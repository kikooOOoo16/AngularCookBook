import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {Recipe} from '../models/recipe.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import {AlertComponent} from "../../shared/alert/alert.component";
import {PlaceholderDirective} from "../../shared/placeholder/placeholder.directive";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  recipe: Recipe;
  id: number;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params.pipe(
      map(params => {
        return +params.id;
      }), switchMap(id => { // switch params observable to store newRecipe state observable
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return this.id === index
        });
      })
    ).subscribe(recipe => {
      this.recipe = recipe;
    });
  }

  onAddToShoppingList() {
    this.store.dispatch(ShoppingListActions.addIngredients({ingredients: this.recipe.ingredients}));
    this.showErrorAlert('Sent to shopping list.')
  }

  onDeleteRecipe() {
    this.store.dispatch(RecipesActions.deleteRecipe({index: this.id}));
    this.router.navigate(['/recipes']);
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainer = this.alertHost.viewContainerRef;
    hostViewContainer.clear();

    const componentRef = hostViewContainer.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      hostViewContainer.clear();
      this.closeSub.unsubscribe();
    });
  }
}
