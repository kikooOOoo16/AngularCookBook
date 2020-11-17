import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipesComponent} from './recipes.component';
import {RecipesAuthGuard} from './recipes-auth-guard';
import {RecipeNotSelectedComponent} from './recipe-not-selected/recipe-not-selected.component';
import {RecipeItemEditComponent} from './recipe-item-edit/recipe-item-edit.component';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';
import {RecipesResolverService} from './recipes-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [RecipesAuthGuard],
    resolve: [RecipesResolverService],
    children: [
      {
        path: '',
        component: RecipeNotSelectedComponent },
      {
        path: 'new',
        component: RecipeItemEditComponent,
        data: {routeId: 1} },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
        data: {routeId: 1}
      },
      {
        path: ':id/edit',
        component: RecipeItemEditComponent,
        resolve: [RecipesResolverService],
        data: {routeId: 1}
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class RecipesRoutingModule {
}
