import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipes.actions';
import {faBook, faShoppingBasket, faSignInAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  faBook = faBook;
  faShoppingBasket = faShoppingBasket;
  faSignIn = faSignInAlt;
  faSignOut = faSignOutAlt;
  private userSub: Subscription;
  private isDropdownOpen = false;
  isAuthenticated = false;
  @ViewChild('navbarDropdown', {static: true}) navbarDropdown: ElementRef;

  constructor(
    private renderer: Renderer2,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user // inline syntax because we are returning immediately
    )).subscribe(user => {
      this.isAuthenticated = !!user; // if we don't have a user we want is authenticate to be opposite therefore an extra ! mark
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.store.dispatch(RecipeActions.saveRecipesToDb())
  }

  onFetchData() {
    this.store.dispatch(RecipeActions.startDbCall());
    this.store.dispatch(RecipeActions.getRecipesFromDb());
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  toggleDropdown() {
    if (this.isDropdownOpen) {
      this.renderer.removeClass(this.navbarDropdown.nativeElement, 'show');
      this.isDropdownOpen = false;
    } else {
      this.renderer.addClass(this.navbarDropdown.nativeElement, 'show');
      this.isDropdownOpen = true;
    }
  }
}
