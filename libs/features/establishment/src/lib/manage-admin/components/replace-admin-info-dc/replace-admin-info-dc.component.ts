/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { CommonIdentity, GenderEnum, getIdentityByType, BilingualText } from '@gosi-ui/core';
import { Admin } from '../../../shared';

@Component({
  selector: 'est-replace-admin-info-dc',
  templateUrl: './replace-admin-info-dc.component.html',
  styleUrls: ['./replace-admin-info-dc.component.scss']
})
export class ReplaceAdminInfoDcComponent implements OnInit {
  /**
   * Local variables
   */
  identity: CommonIdentity;
  femaleGender = GenderEnum.FEMALE;
  currentRoles: BilingualText;

  /**
   * Input variables
   */
  @Input() translateFromModule = 'ESTABLISHMENT.';
  @Input() admin: Admin;

  constructor() {}

  ngOnInit(): void {
    this.identity = getIdentityByType(this.admin.person.identity, this.admin.person.nationality.english);
    this.identity.idType = this.translateFromModule + this.identity.idType;
    const roles = this.admin.roles as BilingualText[];
    const roleInEnglish = roles?.map(role => role.english).join(',');
    const roleInArabic = roles?.map(role => role.arabic).join(',');
    this.currentRoles = roles?.length > 0 ? { english: roleInEnglish, arabic: roleInArabic } : undefined;
  }
}
