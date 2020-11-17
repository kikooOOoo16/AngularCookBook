import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  { path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module').then(module => module.RecipesModule),
    data: { num: 2 } },
  {
    path: 'shopping-list',
    loadChildren: () => import('./shopping-list/shopping-list.module').then(module => module.ShoppingListModule),
    data: { num: 1 }
  },
  { path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule),
    data: { num: 3 } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
