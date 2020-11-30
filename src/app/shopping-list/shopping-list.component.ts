import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import {Ingredient} from '../recipes/models/ingredient.model';
import {Observable, Subscription} from 'rxjs';
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

export class ShoppingListComponent implements OnInit, OnDestroy, AfterViewInit {
  private userSub: Subscription;
  @ViewChildren('ingredientList') private ingredientsReferenceList: QueryList<any>
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private checkedIngredientsIndex: Array<number> = [];
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

  ngAfterViewInit(): void {
    console.log(localStorage.getItem('checkedIngredientsIndex') + ' ' + localStorage.getItem('checkedIngredientsIndex') !== undefined)
    if (localStorage.getItem('checkedIngredientsIndex')) {
      this.checkedIngredientsIndex = JSON.parse(localStorage.getItem('checkedIngredientsIndex'));
      this.checkedIngredientsIndex.forEach(checkedIngredientIndex => {
        this.ingredientsReferenceList.forEach((ingredientReference, index) => {
          if (checkedIngredientIndex === index) {
            this.renderer.addClass(ingredientReference.nativeElement, 'checked');
          }
        })
      })
    }
    localStorage.removeItem('checkedIngredientsIndex');
  }

  ngOnDestroy(): void {
    if (this.ingredientsReferenceList.length > 0) {
      this.ingredientsReferenceList.forEach((ingredientReference, index) => {
        if (ingredientReference.nativeElement.classList.contains('checked')) {
          this.checkedIngredientsIndex.push(index);
        }
      })
      localStorage.setItem('checkedIngredientsIndex', JSON.stringify(this.checkedIngredientsIndex));
    }
  }

  onEditItem(i: number) {
    this.store.dispatch(ShoppingListActions.startEdit({index: i}))
  }

  onBackToRecipes() {
    this.router.navigate(['/recipes']);
  }

  onCheckIngredient($event, i, ingredientReference: HTMLAnchorElement) {
    $event.stopPropagation();
    if (ingredientReference.classList.contains('checked')) {
      ingredientReference.classList.remove('checked')
    } else {
      ingredientReference.classList.add('checked')
    }
  }
}
