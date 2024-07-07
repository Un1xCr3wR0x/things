import { Directive, ElementRef, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { MenuService, RoleIdEnum } from '@gosi-ui/core';

@Directive({
  selector: '[gosiShow]'
})
export class ShowHideDirective implements OnChanges {
  @Input() gosiShow: RoleIdEnum[];
  @Input() gosiShowRegNo: number;

  constructor(
    private menuService: MenuService,
    private templateRef: TemplateRef<ElementRef>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gosiShow?.currentValue || changes.establishmentRegNo?.currentValue) {
      this.checkForEligibility(this.gosiShow, this.gosiShowRegNo);
    }
  }

  showTemplateRef(show: boolean) {
    this.viewContainerRef.clear();
    if (show === true) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  checkForEligibility(roles: RoleIdEnum[], regNo: number) {
    if (roles && roles.length > 0) {
      const isEntitled = this.menuService.isUserEntitled(roles, regNo);
      this.showTemplateRef(isEntitled);
    } else {
      this.showTemplateRef(true);
    }
  }
}
