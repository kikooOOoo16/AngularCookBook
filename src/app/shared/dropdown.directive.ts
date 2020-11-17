import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  private isOpen = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('click') toggleShow(): void {
    const menu = this.elRef.nativeElement.querySelector('.dropdown-menu');
    if (this.isOpen) {
      this.renderer.removeClass(menu, 'show');
      this.isOpen = false;
    } else {
      this.renderer.addClass(menu, 'show');
      this.isOpen = true;
    }
  }

  @HostListener('document:click', ['$event.target']) clickedOutsideEvent(targetElement): void {
    const menu = this.elRef.nativeElement.querySelector('.dropdown-menu');
    const clickedInside = this.elRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.renderer.removeClass(menu, 'show');
    }
  }
}
