import {Component, OnInit} from '@angular/core';
import {faEnvelope, faPhone} from "@fortawesome/free-solid-svg-icons";
import * as fromApp from '../store/app.reducer';
import {Store} from "@ngrx/store";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  userSub: Subscription;
  isAuthenticated = false;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user
    )).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
}
