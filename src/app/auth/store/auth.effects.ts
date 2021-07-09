import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../user';
import {AuthService} from '../auth.service';
import {environment} from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import * as RecipeActions from '../../recipes/store/recipes.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; // signUp request doesn't require this field therefor its optional
}

@Injectable() // needs Injectable so that things can be injected into this class (Actions, HttpClient)
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) {
  }

  authSignUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((action) => {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=\n' +
          environment.fireBaseApiKey,
          {
            email: action.email,
            password: action.password,
            returnToken: true
          }
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken);
          }),
          catchError(errorResponse => {
            return handleError(errorResponse);
          })
        );
      })
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart), // continue pipe chain if argument of type LOGIN_START (can have multiple actions)
      switchMap((action) => { // switchMap creates a new observable by taking another observables state
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=\n' +
          environment.fireBaseApiKey,
          {
            email: action.email,
            password: action.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken);
          }),
          catchError(errorResponse => {
            return handleError(errorResponse);
          })
        );
      })
    )
  );

  authRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticateSuccess),
      tap((action) => {
        if (action.redirect) {
          this.router.navigate(['/']);
        }
      })
    ), {dispatch: false} // won't yield a dispatchable actions in the end
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: string
        }
          = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return {type: 'AUTOLOGINDUMMY'};
        }
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return AuthActions.authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          })
        }
        return {type: 'AUTOLOGINDUMMY'};
      })
    )
  );

  autoLogout = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      }),
      map( () => {
        return RecipeActions.resetRecipes()
      })
    )
  );
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(
    new Date().getTime() + +expiresIn * 1000
  ); // ms to s to date time stamp
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user)); // Auto Login
  return AuthActions.authenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(AuthActions.authenticateFail({errorMessage}));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS' :
      errorMessage = 'This email is already associated with an account exists.';
      break;
    case 'EMAIL_NOT_FOUND' :
      errorMessage = 'Invalid input data!';
      break;
    case 'INVALID_PASSWORD' :
      errorMessage = 'Invalid input data!';
      break;
  }
  return of(AuthActions.authenticateFail({errorMessage}));
};
