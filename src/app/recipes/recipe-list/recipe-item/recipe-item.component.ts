import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../../models/recipe.model';
import {faClock, faHourglassHalf} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipeItem: Recipe;
  @Input() index: number;
  faHourGlass = faHourglassHalf;
  faClock = faClock;

  ngOnInit() {
  }
}
