import { Directive } from '@angular/core';

@Directive({
  selector: '[appTrackScroll]',
  host: {'(window:scroll)': 'track($event)'}
})

export class TrackScrollDirective {
  $event: Event;

  constructor() { }

  track($event: Event) {
    // console.log("Scroll Event" + $event)
  }

}
