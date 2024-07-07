import { Directive, Input, ElementRef } from '@angular/core';
import { RoleFeature, RoleIdEnum } from '@gosi-ui/core';

declare const require;
@Directive({
  selector: '[gosiRoles]'
})
export class ShowRolesDirective {
  @Input('gosiRoles') set gosiRoles(roles: string[]) {
    if (roles && roles.length > 0) {
      this.roleItem = this.roleMappingJson.roleFeatures.filter(item => {
        return (
          roles.some(roleId => roleId === item.role) &&
          item.role !== RoleIdEnum.AMEEN_USER.toString() &&
          item.role !== RoleIdEnum.AMEEN_INTERNAL_SUPERVISOR.toString()
        );
      });
    } else this.roleItem = [];
  }

  @Input('lang') set language(lang: string) {
    if (lang === 'en') {
      this.el.nativeElement.innerHTML =
        this.roleItem.length > 0 ? this.roleItem.map(item => item.roleNameEnglish).join(',') : 'Not Available';
    } else {
      this.el.nativeElement.innerHTML =
        this.roleItem.length > 0 ? this.roleItem.map(item => item.roleNameArabic).join(',') : 'غير متوفر';
    }
  }

  roleItem: RoleFeature[];

  roleMappingJson = require('../../../../../../role-mapping.json');
  constructor(private el: ElementRef) {}
}
