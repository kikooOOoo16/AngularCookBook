import {Component, HostListener, OnInit} from '@angular/core';
import {Ingredient} from '../recipes/models/ingredient.model';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  // animations: [
  //   trigger('shoppingList', [
  //     state('in', style({
  //       transform: 'translateX(0)',
  //       opacity: '1'
  //       })),
  //     transition('void => *',[
  //       style({
  //         opacity: '0',
  //         transform: 'translateX(-100px)'
  //       }),
  //       animate(300)
  //     ]),
      // transition('* => void', [
      //   animate(500, style({
      //     opacity: '0',
      //     transform: 'translateX(100px)'
      //   }))
      // ])
  //   ])
  // ]
})

export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  @HostListener('window:beforeunload', ['$event']) pageLeave ($event: any) {
    if (this.ingredients) {
      this.store.dispatch(ShoppingListActions.saveIngredients());
    }
  }


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      if (data.shoppingListIngredients !== undefined && data.shoppingListIngredients.length > 0) {
        this.store.dispatch(ShoppingListActions.addIngredients({ingredients: data.shoppingListIngredients}))
      }
    })
    this.ingredients = this.store.select('shoppingList'); // this is an observable
  }

  onEditItem(i: number) {
    this.store.dispatch(ShoppingListActions.startEdit({index: i}))
  }

  onBackToRecipes() {
    this.router.navigate(['/recipes']);
  }
}
