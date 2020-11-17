import {Ingredient} from '../../recipes/models/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';
import {Action, createReducer, on} from '@ngrx/store';

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient,
  editedIngredientIndex: number
}

const initialState: State = {
  ingredients: [],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export const _shoppingListReducer = createReducer(
  initialState,
  on(
    ShoppingListActions.addIngredient,
    (state, action) => {
      const editedIngredients = sumAmountIfExists(action.ingredient, null, [...state.ingredients]);
      return ({
        ...state,
        ingredients: [...editedIngredients] // so we copy the old state and we override the ingredients property
      });
    }
  ),
  on(
    ShoppingListActions.addIngredients,
    (state, action) => {
      const editedIngredients = sumAmountIfExists(null, action.ingredients, [...state.ingredients]);
      return ({
        ...state,
        ingredients: [...editedIngredients]
      })
    }
  ),
  on(
    ShoppingListActions.updateIngredient,
    (state, action) => {
      const oldIngredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...oldIngredient, // copy old ingredients
        ...action.ingredient // override old ingredient with new
      };
      let editedIngredients = [...state.ingredients];
      editedIngredients[state.editedIngredientIndex] = updatedIngredient;
      editedIngredients = sumAmountIfExists(null, null, editedIngredients);
      return ({
        ...state,
        ingredients: [...editedIngredients],
        editedIngredientIndex: -1,
        editedIngredient: null
      })
    }
  ),
  on(
    ShoppingListActions.deleteIngredient,
    (state, action) => ({
      ...state,
      ingredients: state.ingredients.filter((ing, ingredientIndex) => {
        return ingredientIndex !== state.editedIngredientIndex;
      })
    })
  ),
  on(
    ShoppingListActions.startEdit,
    (state, action) => ({
      ...state,
      editedIngredientIndex: action.index,
      editedIngredient: {...state.ingredients[action.index]}
    })
  ),
  on(
    ShoppingListActions.stopEdit,
    (state, action) => ({
      ...state,
      editedIngredientIndex: -1,
      editedIngredient: null
    })
  )
);

// ngRx calls and passes the arguments to this function
export function shoppingListReducer(state: State = initialState, action: Action) {
  return _shoppingListReducer(state, action)
}

function sumAmountIfExists(
  newIngredient: Ingredient = null,
  newIngredients: Ingredient[] = null,
  stateIngredients: Ingredient[]): Ingredient[] {

  const result: Ingredient[] = [];
  if (newIngredient) {
    stateIngredients.push(newIngredient);
  } else if (newIngredients) {
    stateIngredients = stateIngredients.concat(newIngredients);
  }
  stateIngredients = JSON.parse(JSON.stringify(stateIngredients));
  stateIngredients.forEach((ingredient) => {
    const existing = result.filter((resultItem) => {
      return resultItem.name.toLowerCase() === ingredient.name.toLowerCase();
    });
    if (existing.length) {
      const existingIndex = result.indexOf(existing[0]);
      result[existingIndex].amount += ingredient.amount;
    } else {
      result.push(ingredient);
    }
  });
  return [...result];
}
