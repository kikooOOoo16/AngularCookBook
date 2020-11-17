import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Recipe} from './models/recipe.model';
import * as RecipesActions from './store/recipes.actions';
import * as fromApp from '../store/app.reducer';

import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import {map, switchMap, take} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions) {
  }

  // @ts-ignore
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // the resolver will subscribe automatically to figure out when the data is there so we don't have to subscribe
    // resolve expects an observable as a return value on the resolve method and it waits for this observable to complete
    // before it loads the route for which we add this resolver so we can't just write the following
    // this.store.dispatch(new RecipesActions.GetRecipesFromDb()); because it doesn't return an observable that we need to complete
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(RecipesActions.getRecipesFromDb());
          return this.actions$.pipe(
            ofType(RecipesActions.setRecipes),
            take(1)
          ); // we use take 1 to unsubscribe and not have an ongoing subscription
        } else {
          return of(recipes);
        }
      })
    );
  }
}
