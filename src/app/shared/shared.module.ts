import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown.directive';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { AlertComponent } from './alert/alert.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TrackScrollDirective } from './trackscroll.directive';
import { StopPropagationDirective } from './stop-propagation.directive';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent,
    DropdownDirective,
    PlaceholderDirective,
    TrackScrollDirective,
    StopPropagationDirective,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
    exports: [
        CommonModule,
        FontAwesomeModule,
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective,
        DropdownDirective,
        TrackScrollDirective,
        StopPropagationDirective
    ],
  entryComponents: [
    AlertComponent
  ]
})

export class SharedModule {
}
