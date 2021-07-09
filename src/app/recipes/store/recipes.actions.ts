import {createAction, props} from '@ngrx/store';
import {Recipe} from '../models/recipe.model';

export const getRecipesFromDb = createAction(
  '[Recipes] Get Recipes From Db',
);

export const noRecipesInDb = createAction(
  '[Recipes] No Recipes In Db'
)

export const saveRecipesToDb = createAction(
  '[Recipes] Save Recipes To Db'
);

export const startDbCall = createAction(
  '[Recipes] Start DataBase Call'
);

export const setRecipes = createAction(
  '[Recipes] Set Recipes',
  props<{
    recipes: Recipe[]
  }>()
);

export const addRecipe = createAction(
  '[Recipes] Add Recipe',
  props<{
    recipe: Recipe
  }>()
);

export const updateRecipe = createAction(
  '[Recipes] Update Recipe',
  props<{
    index: number,
    newRecipe: Recipe
  }>()
);

export const updateRecipes = createAction(
  '[Recipes] Update Recipes',
  props<{
    recipes: Recipe[]
  }>()
);

export const deleteRecipe = createAction(
  '[Recipes] Delete Recipe',
  props<{
    index: number
  }>()
);

export const resetRecipes = createAction(
  '[Recipes] Reset Recipes'
)
