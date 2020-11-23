import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
// import * as RecipeActions from '../recipes/store/recipes.actions';
import {faBook, faShoppingBasket, faSignInAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnInit, OnDestroy {
  faBook = faBook;
  faShoppingBasket = faShoppingBasket;
  faSignIn = faSignInAlt;
  faSignOut = faSignOutAlt;
  private userSub: Subscription;
  isDropdownActive = '';
  isAuthenticated = false;
  @ViewChild('navbarDropdownMenuLink', {static: true}) navbarDropdownMenuLink: ElementRef;
  @ViewChild('navbarMainListDiv', {static: true}) navbarMainListDiv: ElementRef;
  @ViewChild('navbar', {static: true}) navbar: ElementRef;
  @HostListener('window:scroll', ['$event'])
  toggleClass(event) {
    if (window.pageYOffset > 0) {
      this.renderer.addClass(this.navbar.nativeElement, 'affix');
      this.renderer.addClass(this.navbarDropdownMenuLink.nativeElement, 'affix')
    } else {
      this.renderer.removeClass(this.navbar.nativeElement, 'affix')
      this.renderer.removeClass(this.navbarDropdownMenuLink.nativeElement, 'affix')
    }
  }


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

  // onSaveData() {
  //   this.store.dispatch(RecipeActions.saveRecipesToDb())
  // }
  //
  // onFetchData() {
  //   this.store.dispatch(RecipeActions.startDbCall());
  //   this.store.dispatch(RecipeActions.getRecipesFromDb());
  // }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  toggleDropdown() {
    if (this.isDropdownActive === 'active') {
      this.renderer.removeClass(this.navbarDropdownMenuLink.nativeElement, 'active');
      this.renderer.removeClass(this.navbarMainListDiv.nativeElement, 'show_list');
      this.isDropdownActive = '';
    } else {
      this.renderer.addClass(this.navbarDropdownMenuLink.nativeElement, 'active');
      this.renderer.addClass(this.navbarMainListDiv.nativeElement, 'show_list');
      this.isDropdownActive = 'active';
    }
  }
}
