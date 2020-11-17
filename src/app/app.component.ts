import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import {RouterOutlet} from "@angular/router";
import {routerAnimation} from "./shared/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    routerAnimation()
  ]
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.autoLogin());
  }

  public getRouteAnimation(outlet: RouterOutlet) {
    return outlet.activatedRouteData.num === undefined ? -1 : outlet.activatedRouteData.num;
  }
}
