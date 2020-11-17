import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {faAngleUp} from '@fortawesome/free-solid-svg-icons/faAngleUp';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  encapsulation: ViewEncapsulation.None, // for animations and custom styling to work
})

export class RecipesComponent implements OnInit, OnDestroy {
  dataBaseCall = false;
  recipesSub: Subscription;
  faAngleUp = faAngleUp;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.recipesSub = this.store.select('recipes')
      .subscribe(recipesState => {
        this.dataBaseCall = recipesState.dBCall;
      });
  }

  ngOnDestroy(): void {
    if (this.recipesSub) {
      this.recipesSub.unsubscribe();
    }
  }
}
