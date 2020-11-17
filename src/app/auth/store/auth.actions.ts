import {createAction, props} from '@ngrx/store';

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{
    email: string,
    password: string
  }>()
);

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{
    email: string,
    password: string
  }>()
);

export const authenticateSuccess = createAction(
  '[Auth] AuthenticateSuccess',
  props<{
    email: string,
    userId: string,
    token: string,
    expirationDate: Date,
    redirect: boolean
  }>()
);

export const authenticateFail = createAction(
  '[Auth] AuthenticateFail',
  props<{
    errorMessage: string
  }>()
);

export const logout = createAction(
  '[Auth] Logout'
);

export const autoLogin = createAction(
  '[Auth] Auto Login'
);

export const clearError = createAction(
  '[Auth] Clear Error'
);
