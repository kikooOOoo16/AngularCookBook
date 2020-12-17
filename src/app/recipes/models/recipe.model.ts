import {Ingredient} from './ingredient.model';

export enum recipeDifficulty {
  Low = 'Low',
  Medium = 'Medium',
  Hard = 'Hard'
}

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public cookTime: Date;
  public prepTime: Date;
  public recipeDifficulty: recipeDifficulty;
  public ingredients: Ingredient[];

  constructor(name: string, description: string, imagePath: string, cookTime: Date, prepTime: Date, recipeDifficulty: recipeDifficulty, ingredients: Ingredient[]) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.cookTime = cookTime;
    this.prepTime = prepTime;
    this.recipeDifficulty = recipeDifficulty;
    this.ingredients = ingredients;
  }
}
