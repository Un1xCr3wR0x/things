/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { convertToStringDDMMYYYY, GosiCalendar, RoleIdEnum } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { EngagementType, TransactionName } from '../../../../shared/enums';
import { EngagementDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-engagement-detail-dc',
  templateUrl: './engagement-detail-dc.component.html',
  styleUrls: ['./engagement-detail-dc.component.scss']
})
export class EngagementDetailDcComponent implements OnChanges {
  /** Local variables */
  isFutureEngagement = false;
  isWageUpdatePending = false;
  hasFuturePeriods = false;
  joiningDate: GosiCalendar;
  isEdit = false;

  /** Constants */
  typeVic = EngagementType.VIC;

  /** Input variables. */
  @Input() engagement: EngagementDetails;
  @Input() index: number;
  @Input() showUnifiedHeader: boolean;
  @Input() isIndividualProfile = false;
  @Input() isPREligible = false;
  @Input() userRoles: string[];


  /** Output variables. */
  @Output() wageEdit: EventEmitter<number> = new EventEmitter();

  isShow = true;
  /** Method to handle changes in input variables. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagement && changes.engagement.currentValue) this.identifyEngagementState(this.engagement);
    if (this.userRoles.includes(RoleIdEnum.INQUIRY_FOR_CONTRACTSAUHENTICATION.toString())) this.isEdit = true;
    if (
      (this.userRoles.includes(RoleIdEnum.CSR.toString()) &&
        !this.userRoles.includes(RoleIdEnum.GCC_CSR.toString()) &&
        this.engagement?.gccEstablishment) ||
      (this.userRoles.includes(RoleIdEnum.GCC_CSR.toString()) &&
        !this.userRoles.includes(RoleIdEnum.CSR.toString()) &&
        !this.engagement?.gccEstablishment)
    ) {
      this.isShow = false;
    }
     if(this.engagement?.ppaIndicator){
         this.isShow = false;
     }
  }

  /** Method to identify engagement state. */
  identifyEngagementState(engagement: EngagementDetails) {
    //Future periods are applicable for VIC only.
    if (engagement.engagementType === this.typeVic) {
      if (moment(engagement.joiningDate.gregorian).isAfter(new Date())) this.isFutureEngagement = true;
      this.isWageUpdatePending = engagement.pendingTransaction.some(
        item => item.type.english === TransactionName.MANAGE_VIC_WAGE
      );
      this.hasFuturePeriods = engagement.engagementPeriod.some(period =>
        moment(period.startDate.gregorian).isAfter(new Date())
      );
      this.joiningDate = engagement?.joiningDate;
      // this.joiningDate = convertToStringDDMMYYYY(engagement?.joiningDate?.gregorian.toString());
    }
    //commenting as faced issue with secondment/study-leave for future dates
    // if(engagement.ppaIndicator){
    //   engagement.engagementPeriod = engagement.engagementPeriod.filter(period => moment(period.startDate?.gregorian).isSameOrBefore(new Date()))
    // }
  }
  /** Method to handle wage edit. */
  handleWageEdit() {
    this.wageEdit.emit(this.index);
  }
}
