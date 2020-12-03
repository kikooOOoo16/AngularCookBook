import {Ingredient} from './ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public cookTime: Date;
  public ingredients: Ingredient[];

  constructor(name: string, description: string, imagePath: string, cookTime: Date, ingredients: Ingredient[]) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.cookTime = cookTime;
    this.ingredients = ingredients;
  }
}
