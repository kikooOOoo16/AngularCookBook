import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {faAngleUp} from '@fortawesome/free-solid-svg-icons/faAngleUp';
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import {Ingredient} from "./models/ingredient.model";


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  encapsulation: ViewEncapsulation.None, // for animations and custom styling to work
})

export class RecipesComponent implements OnInit, OnDestroy {
  dataBaseCall = false;
  recipesSub: Subscription;
  faAngleUp = faAngleUp;
  private ingredients: Observable<{ ingredients: Ingredient[] }>;
  // save shopping list state on page leave
  @HostListener('window:beforeunload', ['$event']) pageLeave ($event: any) {
    if (this.ingredients) {
      this.store.dispatch(ShoppingListActions.saveIngredients());
    }
  }

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.recipesSub = this.store.select('recipes')
      .subscribe(recipesState => {
        this.dataBaseCall = recipesState.dBCall;
      });
    this.ingredients = this.store.select('shoppingList');
  }

  ngOnDestroy(): void {
    if (this.recipesSub) {
      this.recipesSub.unsubscribe();
    }
  }
}
