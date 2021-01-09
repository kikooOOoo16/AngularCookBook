import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer';
import {Recipe} from '../models/recipe.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {User} from "../../auth/user";
import {of} from "rxjs";

@Injectable()
export class RecipesEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>) {
  }

  getRecipesFromDb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.getRecipesFromDb),
      switchMap(() => {
        let userData: User = JSON.parse(localStorage.getItem('userData'))
        return this.http.get<Recipe[]>(
          'https://ng-course-recipe-book-fd2ff.firebaseio.com/' + userData.id + '/recipes.json'
        ).pipe(
          map(recipes => {
            return recipes.map(recipe => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            });
          }),
          map(recipes => {
            return RecipesActions.setRecipes({recipes});
          }),catchError((err) =>
            of(RecipesActions.noRecipesInDb())
          )
        );
      }),
    )
  );

  saveRecipesToDb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.saveRecipesToDb, RecipesActions.updateRecipe, RecipesActions.deleteRecipe, RecipesActions.addRecipe),
      withLatestFrom(this.store.select('recipes')), // merge value from one observable into another
      switchMap(([actionData, recipesState]) => {
        let userData: User = JSON.parse(localStorage.getItem('userData'))
        // array destructuring syntax (first element is the data from the action second is from above observable)
        return this.http.put(
          'https://ng-course-recipe-book-fd2ff.firebaseio.com/' + userData.id + '/recipes.json',
          recipesState.recipes)
      })
    ), {dispatch: false}
  );

  noRecipesInDb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.noRecipesInDb),
      map(() => {
        const emptyRecipes: Recipe[] = [];
        return RecipesActions.setRecipes({recipes: emptyRecipes});
      })
    )
  )
}
