import {Component, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Ingredient} from '../recipes/models/ingredient.model';
import {Observable, Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';
import {map} from "rxjs/operators";
import {faCheckSquare, faSquare} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  private ingredientsSub: Subscription;
  checkedIngredient : Subject<boolean> = new Subject<boolean>();
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  isAuthenticated = false;
  @HostListener('window:beforeunload', ['$event']) pageLeave ($event: any) {
    if (this.ingredients) {
      this.store.dispatch(ShoppingListActions.saveIngredients());
    }
  }
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;


  constructor(private router: Router,
              private renderer: Renderer2,
              private activatedRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      if (data.shoppingListIngredients !== undefined && data.shoppingListIngredients.length > 0) {
        this.store.dispatch(ShoppingListActions.addIngredients({ingredients: data.shoppingListIngredients}));
        localStorage.removeItem('shoppingList');
      }
    })
    this.ingredients = this.store.select('shoppingList'); // this is an observable
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user
    )).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    if (this.ingredientsSub) {
      this.ingredientsSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  onEditItem(i: number) {
    this.store.dispatch(ShoppingListActions.startEdit({index: i}));
  }

  onBackToRecipes() {
    this.router.navigate(['/recipes']);
  }

  onCheckIngredient(i) {
    let checkedState: boolean = false;
    this.store.dispatch(ShoppingListActions.startEdit({index: i}));
    this.ingredientsSub = this.ingredients.subscribe((ingredientsState) => {
      ingredientsState.ingredients.forEach((ingredient, index) => {
        if (index === i) {
          checkedState = !ingredient.checked;
        }
      })
    })
    this.ingredientsSub.unsubscribe();
    this.store.dispatch(ShoppingListActions.toggleCheckedIngredient({checkedState: checkedState}));
    checkedState = null;
    this.checkedIngredient.next(true);
  }
}
