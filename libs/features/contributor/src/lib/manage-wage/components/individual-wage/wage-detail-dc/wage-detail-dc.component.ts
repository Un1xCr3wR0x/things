/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, EstablishmentStatusEnum, RoleIdEnum } from '@gosi-ui/core';
import { EngagementDetails, Establishment } from '../../../../shared';

@Component({
  selector: 'cnt-wage-detail-dc',
  templateUrl: './wage-detail-dc.component.html',
  styleUrls: ['./wage-detail-dc.component.scss']
})
export class WageDetailDcComponent implements OnChanges {
  /** Local variables */
  canUserEdit = true;

  /** Input variables */
  @Input() currentEngagement: EngagementDetails;
  @Input() currentUserRoles: string[];
  @Input() establishment: Establishment;

  /** Output variables */
  @Output() navigateToWageUpdate = new EventEmitter();

  constructor(@Inject(ApplicationTypeToken) private appToken: string) {}

  /** Method to detect changes to input. */
  ngOnChanges(changes: SimpleChanges) {
    if(changes.currentEngagement) this.checkUserAccessPPA();
    if (changes.establishment && changes.establishment.currentValue) this.checkUserEditAccess();
  }

  /** Method  to check whether user has edit access. */
  checkUserEditAccess() {
    if (
      this.currentUserRoles.length === 0 ||
      (this.currentUserRoles.includes(RoleIdEnum.CSR.toString()) &&
        !this.currentUserRoles.includes(RoleIdEnum.GCC_CSR.toString()) &&
        this.establishment.gccEstablishment?.gccCountry) ||
      (this.currentUserRoles.includes(RoleIdEnum.GCC_CSR.toString()) &&
        !this.currentUserRoles.includes(RoleIdEnum.CSR.toString()) &&
        !this.establishment.gccEstablishment?.gccCountry) ||
      this.currentUserRoles.includes(RoleIdEnum.GCC_ADMIN.toString()) ||
      (this.appToken === ApplicationTypeEnum.PRIVATE
        ? !(
            this.currentUserRoles.includes(RoleIdEnum.CSR.toString()) ||
            this.currentUserRoles.includes(RoleIdEnum.GCC_CSR.toString())
          )
        : !(
            this.currentUserRoles.includes(RoleIdEnum.SUPER_ADMIN.toString()) ||
            this.currentUserRoles.includes(RoleIdEnum.BRANCH_ADMIN.toString()) ||
            this.currentUserRoles.includes(RoleIdEnum.REG_ADMIN.toString())
          ))
    )
      this.canUserEdit = false;
    else if (
      this.establishment.status.english !== EstablishmentStatusEnum.REGISTERED &&
      this.establishment.status.english !== EstablishmentStatusEnum.REOPEN
    )
      this.canUserEdit = false;
    else this.canUserEdit = true;
  }

  checkUserAccessPPA() {
    if (this.currentEngagement?.ppaIndicator) this.canUserEdit = false;
  }
}
