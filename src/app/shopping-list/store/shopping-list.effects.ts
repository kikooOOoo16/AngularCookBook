import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as ShoppingListActions from './shopping-list.actions';
import {map, withLatestFrom} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {Injectable} from "@angular/core";

@Injectable()
export class ShoppingListEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>) {
  }

  shoppingListSave$ = createEffect( () =>
    this.actions$.pipe(
      ofType(ShoppingListActions.saveIngredients),
      withLatestFrom(this.store.select('shoppingList')),
      map(([actionData, shoppingListState]) => {
            if (typeof shoppingListState.ingredients !== 'undefined') {
              localStorage.setItem('shoppingList', JSON.stringify(shoppingListState.ingredients));
            }
            return shoppingListState;
      })
    ), { dispatch: false }
  )
}
