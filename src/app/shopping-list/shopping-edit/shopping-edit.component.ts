import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../recipes/models/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingListForm', {static: true}) shoppingListForm: NgForm;
  shoppingListSubscription: Subscription;
  editMode = false;
  editedItem: Ingredient;
  disabledClass = 'disabled';

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.shoppingListSubscription = this.store.select('shoppingList').subscribe(stateDate => {
      if (stateDate.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateDate.editedIngredient;
        this.shoppingListForm.form.setValue({
          nameInput: this.editedItem.name,
          amountInput: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.shoppingListSubscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  addItemToShoppingList(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.nameInput, value.amountInput);
    if (this.editMode) {
      this.store.dispatch(ShoppingListActions.updateIngredient({ingredient: newIngredient}));
      this.resetForm();
    } else {
      this.store.dispatch(ShoppingListActions.addIngredient({ingredient: newIngredient}));
      this.resetForm();
    }
  }

  resetForm() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  deleteIngredient() {
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.resetForm();
  }
}
