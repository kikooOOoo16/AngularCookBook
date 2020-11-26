import {Component, HostListener, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {Ingredient} from '../recipes/models/ingredient.model';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';
import {map} from "rxjs/operators";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})

export class ShoppingListComponent implements OnInit {
  @ViewChildren('ingredientList') ingredientsList: QueryList<any>;
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private userSub: Subscription;
  isAuthenticated = false;
  @HostListener('window:beforeunload', ['$event']) pageLeave ($event: any) {
    if (this.ingredients) {
      this.store.dispatch(ShoppingListActions.saveIngredients());
    }
  }
  faCheck = faCheck;


  constructor(private router: Router,
              private renderer: Renderer2,
              private activatedRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      if (data.shoppingListIngredients !== undefined && data.shoppingListIngredients.length > 0) {
        this.store.dispatch(ShoppingListActions.addIngredients({ingredients: data.shoppingListIngredients}))
        localStorage.removeItem('shoppingList')
      }
    })
    this.ingredients = this.store.select('shoppingList'); // this is an observable
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user
    )).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onEditItem(i: number) {
    this.store.dispatch(ShoppingListActions.startEdit({index: i}))
  }

  onBackToRecipes() {
    this.router.navigate(['/recipes']);
  }

  checkIngredient(i) {
    this.ingredientsList.filter((element, index) => index === i)
      .map((elementRef) => {
        this.renderer.addClass(elementRef.nativeElement, 'checked');
    })
  }
}
