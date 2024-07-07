import { Directive, Input, ElementRef, Renderer2, AfterViewInit, HostListener, HostBinding } from '@angular/core';
import { MenuService, RoleIdEnum } from '@gosi-ui/core';

@Directive({
  selector: '[gosiEnable]'
})
export class EnableDisableDirective implements AfterViewInit {
  @Input('gosiEnable') roles: RoleIdEnum[];
  userRoles: string[] = [];
  @HostListener('click', ['$event'])
  onClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  @HostBinding('style.pointer-events') get pointerEvents(): string {
    if (this.menuService.getAuthorizationStatus()) return 'auto';
    else if (!this.roles?.some(v => this.userRoles.indexOf(v.toString()) !== -1)) {
      return 'none';
    }
    return 'auto';
  }
  constructor(private menuService: MenuService, private elementRef: ElementRef, private render: Renderer2) {
    this.userRoles = this.menuService.getRoles();
  }

  ngAfterViewInit() {
    if (!this.menuService.getAuthorizationStatus()) {
      if (this.roles && this.roles.length > 0 && this.elementRef.nativeElement) {
        const elements = this.elementRef.nativeElement.querySelectorAll('*');
        if (!this.roles?.some(v => this.userRoles.indexOf(v.toString()) !== -1)) {
          this.addClass(elements);
        } else {
          this.removeClass(elements);
        }
      }
    }
  }
  removeClass(elements) {
    this.render.removeClass(this.elementRef.nativeElement, 'disabled');
    this.render.setAttribute(this.elementRef.nativeElement, 'disabled', 'false');

    elements.forEach(element => {
      element.removeEventListener(
        'click',
        function (e) {
          e.preventDefault();
          e.stopPropagation();
        },
        false
      );
      this.render.setAttribute(element, 'disabled', 'false');
      this.render.removeClass(element, 'disabled');
    });
  }

  addClass(elements) {
    this.render.addClass(this.elementRef.nativeElement, 'disabled');
    this.render.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');

    elements.forEach(element => {
      element.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          e.stopPropagation();
        },
        false
      );
      this.render.setAttribute(element, 'disabled', 'true');
      this.render.addClass(element, 'disabled');
    });
  }
}
