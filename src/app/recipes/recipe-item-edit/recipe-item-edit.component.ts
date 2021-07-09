import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Recipe, recipeDifficulty} from '../models/recipe.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import {Subscription} from 'rxjs';
import {faTimes} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-recipe-item-edit',
  templateUrl: './recipe-item-edit.component.html',
  styleUrls: ['./recipe-item-edit.component.css']
})
export class RecipeItemEditComponent implements OnInit, OnDestroy {
  recipeId: number;
  editMode = false;
  recipe: Recipe;
  recipeForm: FormGroup;
  recipeDifficulty : recipeDifficulty = recipeDifficulty.Low;
  ingredientUnits = ['' ,'kg', 'g', 'l', 'ml', 'tbsp', 'cup'];
  private storeSub: Subscription;
  faTimes = faTimes;
  disabledClass = 'disabled';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.recipeId = +param.id;
      this.editMode = param.id != null;
      this.initRecipeForm();
    });
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  initRecipeForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeCookTime = new Date;
    let recipePrepTime = new Date;
    const recipeIngredients = new FormArray([]);
    if (this.editMode) {
      this.storeSub = this.store.select('recipes')
        .pipe(
          map(recipesState => {
            return recipesState.recipes.find((recipe, index) => {
              return this.recipeId === index
            })
          })
        ).subscribe(recipe => {
          this.recipe = recipe;
        });
      recipeName = this.recipe.name;
      recipeImagePath = this.recipe.imagePath;
      recipeDescription = this.recipe.description;
      recipePrepTime = this.recipe.prepTime;
      recipeCookTime = this.recipe.cookTime;
      this.recipeDifficulty = this.recipe.recipeDifficulty;
      if (this.recipe.ingredients) {
        for (const ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,3})?$/)]),
              unit: new FormControl(ingredient.unit)
            })
          );
        }
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      prepTime: new FormControl(recipePrepTime, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-9][0-9]$/)),
      cookTime: new FormControl(recipeCookTime, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-9][0-9]$/)),
      recipeDifficulty: new FormControl(this.recipeDifficulty, Validators.required),
      ingredients: recipeIngredients
    });
  }

  submitForm() {
    if (this.editMode) {
      this.store.dispatch(RecipesActions.updateRecipe({newRecipe: this.recipeForm.value, index: this.recipeId}));
    } else {
      this.store.dispatch(RecipesActions.addRecipe({recipe: this.recipeForm.value}));
    }
    this.onCancel();
  }

  onAddIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,3})?$/)]),
        unit: new FormControl(this.ingredientUnits[0])
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  get controls() { // a getter!
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  recipeDifficulties() : Array<String> {
    let recipeDifficulties = Object.keys(recipeDifficulty);
    return recipeDifficulties.slice(recipeDifficulties.length / 2 - 1);
  }
}
