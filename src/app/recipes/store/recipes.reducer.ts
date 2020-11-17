import {Recipe} from '../models/recipe.model';
import * as RecipesActions from './recipes.actions';
import {Action, createReducer, on} from '@ngrx/store';

export interface State {
  recipes: Recipe[],
  dBCall: boolean
}

const initialState: State = {
  recipes: [],
  dBCall: false
};

const _recipesReducer = createReducer(
  initialState,
  on(
    RecipesActions.startDbCall,
    (state, action) => ({
      ...state,
      dBCall: true
    })
  ),
  on(
    RecipesActions.setRecipes,
    (state, action) => ({
      ...state,
      recipes: [...action.recipes],
      dBCall: false
    })
  ),
  on(
    RecipesActions.addRecipe,
    (state, action) => ({
      ...state,
      recipes: [...state.recipes, action.recipe]
    })
  ),
  on(
    RecipesActions.updateRecipe,
    (state, action) => {
      const updatedRecipe: Recipe = {
        ...state.recipes[action.index],
        ...action.newRecipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.index] = updatedRecipe;
      return ({
        ...state,
        recipes: updatedRecipes
      });
    }
  ),
  on(
    RecipesActions.updateRecipes,
    (state, action) => ({
      ...state,
      recipes: [...state.recipes, ...action.recipes]
    })
  ),
  on(
    RecipesActions.deleteRecipe,
    (state, action) => ({
      ...state,
      recipes: state.recipes.filter((recipe, recipeId) => {
        return recipeId !== action.index
      })
    })
  )
);

export function recipesReducer(state: State = initialState, action: Action) {
  return _recipesReducer(state, action);
}
