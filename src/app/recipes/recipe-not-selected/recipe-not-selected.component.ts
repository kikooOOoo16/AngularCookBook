import {Component, OnInit} from '@angular/core';
import * as fromApp from '../../store/app.reducer'
import {Store} from "@ngrx/store";
import {map} from "rxjs/operators";
import {Recipe} from "../models/recipe.model";

@Component({
  selector: 'app-recipe-not-selected',
  templateUrl: './recipe-not-selected.component.html',
  styleUrls: ['./recipe-not-selected.component.css']
})
export class RecipeNotSelectedComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.store.select('recipes').pipe(
      map(recipesState => {
        return recipesState.recipes
      })
    ).subscribe((recipes) => {
      this.recipes = recipes;
    })
  }

}
