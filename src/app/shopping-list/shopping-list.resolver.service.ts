import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Ingredient} from "../recipes/models/ingredient.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListResolverService implements Resolve<Ingredient[]>{

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Ingredient[]> | Promise<Ingredient[]> | Ingredient[] {
    const shoppingListIngredients: Ingredient[] = JSON.parse(localStorage.getItem('shoppingList'));
    if (typeof shoppingListIngredients !== 'undefined' && shoppingListIngredients !== null && shoppingListIngredients.length > 0) {
      return shoppingListIngredients
    }
  }
}
