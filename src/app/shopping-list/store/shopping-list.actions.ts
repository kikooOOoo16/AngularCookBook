import {createAction, props} from '@ngrx/store';
import {Ingredient} from '../../recipes/models/ingredient.model';

export const saveIngredients = createAction(
  '[Shopping List] Save Ingredients',
);

export const addIngredient = createAction(
  '[Shopping List] Add Ingredient',
  props<{
    ingredient: Ingredient
  }>()
);

export const addIngredients = createAction(
  '[Shopping List] Add Ingredients',
  props<{
    ingredients: Ingredient[]
  }>()
);

export const updateIngredient = createAction(
  '[Shopping List] Update Ingredient',
  props<{
    ingredient: Ingredient
  }>()
);

export const toggleCheckedIngredient = createAction(
  '[Shopping List] Toggle Checked Ingredient',
  props<{
    checkedState: boolean
  }>()
)

export const deleteIngredient = createAction(
  '[Shopping List] Delete Ingredient'
);

export const startEdit = createAction(
  '[Shopping List] Start Edit',
  props<{
    index: number
  }>()
);

export const stopEdit = createAction(
  '[Shopping List] Stop Edit'
);
