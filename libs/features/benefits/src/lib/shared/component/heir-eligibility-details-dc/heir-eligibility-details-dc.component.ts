/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import {
  CommonIdentity,
  IdentityTypeEnum,
  checkIqamaOrBorderOrPassport,
  BilingualText,
  GosiCalendar
} from '@gosi-ui/core';
import { HeirEligibilityStatus } from '../../enum';
import { ValidateRequest, BenefitDetails, DependentDetails, HeirEvent } from '../../models';
import { DependentHeirConstants } from '../../constants';
import {
  getDependentHeirEligibilityStatus,
  getIdentityLabel,
  getOldestEventFromResponse,
  HeirEligibilityStatusWithOtherBenefits,
  getLatestEventFromResponse
} from '../../utils';

@Component({
  selector: 'bnt-heir-eligibility-details-dc',
  templateUrl: './heir-eligibility-details-dc.component.html',
  styleUrls: ['./heir-eligibility-details-dc.component.scss']
})
export class HeirEligibilityDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Input
   */
  @Input() heirEligibilityDetails: ValidateRequest[] = [];
  @Input() isHeirLumpsum: boolean;
  @Input() benefitCalculation: BenefitDetails;
  @Input() systemRunDate: GosiCalendar;
  @Input() isModify: boolean;
  /**
   * Output
   */
  @Output() showIneligibilityDetails: EventEmitter<ValidateRequest> = new EventEmitter();

  eligibilityStatus = HeirEligibilityStatus;
  dependentHeirConstants = DependentHeirConstants;

  constructor() {}

  ngOnInit() {
    // this.setStatus();
  }

  setStatus() {
    this.heirEligibilityDetails.forEach((eachHeir, index) => {
      eachHeir.oldestEvent = getOldestEventFromResponse(eachHeir.events);
      // eachHeir.showNotEligibleReason =
      //   (
      //     eachHeir.heirPensionStatus?.english === DependentHeirConstants.notEligibleString ||
      //     eachHeir.events.filter(event => (!event.valid && event.message?.english)).length > 0
      //   );
      // const eachDep = new DependentDetails();
      // eachDep.events = eachHeir.events as HeirEvent[];

      eachHeir.heirPensionStatus = HeirEligibilityStatusWithOtherBenefits(
        eachHeir,
        this.systemRunDate,
        this.benefitCalculation,
        this.isHeirLumpsum,
        false,
        this.isModify
      );
      // eachHeir.statusAfterValidation = this.getStatus(eachHeir, index);
    });
  }
  getHeirPensionStatus(heir) {
    const latestEvent = getLatestEventFromResponse(heir?.events);
    if (latestEvent && latestEvent[0]) {
      return latestEvent[0]?.valid
        ? DependentHeirConstants.eligibleForBenefit()
        : heir?.eligibleForBackDated
        ? DependentHeirConstants.eligibleForBackdatedBenefit()
        : DependentHeirConstants.notEligibleBenefit();
    } else {
      return '';
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // if (changes && changes.heirEligibilityDetails && changes.heirEligibilityDetails.currentValue) {
    //   this.setStatus();
    // }
    if (changes && changes.benefitCalculation && changes.benefitCalculation.currentValue) {
      this.setStatus();
    }
  }

  showIneligibilityReasons(details: ValidateRequest) {
    this.showIneligibilityDetails.emit(details);
  }

  checkIdentity(index: number) {
    if (this.heirEligibilityDetails) {
      const value = checkIqamaOrBorderOrPassport(this.heirEligibilityDetails[index]?.identity);
      return value?.id;
    }
  }

  checkIdentityLabel(index: number) {
    if (this.heirEligibilityDetails) {
      const value = checkIqamaOrBorderOrPassport(this.heirEligibilityDetails[index]?.identity);
      return getIdentityLabel(value);
    }
  }

  // getStatus(data: ValidateRequest, index?: number): BilingualText {
  //   if (this.isHeirLumpsum) {
  //     return data.oldestEvent?.valid ? DependentHeirConstants.eligible() : DependentHeirConstants.notEligible();
  //   } else {
  //     const status = getDependentHeirEligibilityStatus(data.events, data.valid, this.systemRunDate, true, null, this.isModify);
  //     if (status.english !== DependentHeirConstants.notEligibleString && this.benefitCalculation) {
  //       const calculationForHeir = this.benefitCalculation.ineligibility?.find(inEligiblePeriod => {
  //         return inEligiblePeriod.heirPersonId === data.heirPersonId;
  //       });
  //       if (status.english === DependentHeirConstants.eligibleString &&
  //         calculationForHeir?.period &&
  //         calculationForHeir?.period.find(element => {
  //           return !element.endDate;
  //         })) {
  //         if (index !== undefined)
  //           this.heirEligibilityDetails[index].showNotEligibleReason = true;
  //         if (calculationForHeir.hasEligiblePeriod) {
  //           return DependentHeirConstants.eligibleForBackdated();
  //         } else {
  //           return DependentHeirConstants.notEligible();
  //         }
  //       } else if (status.english === DependentHeirConstants.eligibleForBackdatedString) {
  //         if (index !== undefined)
  //           this.heirEligibilityDetails[index].showNotEligibleReason = true;
  //         if (
  //           calculationForHeir?.period &&
  //           calculationForHeir?.period.find(element => {
  //             return !element.endDate;
  //           })) {
  //           if (calculationForHeir.hasEligiblePeriod) {
  //             return DependentHeirConstants.eligibleForBackdated();
  //           } else {
  //             return DependentHeirConstants.notEligible();
  //           }
  //         } else if (!calculationForHeir.hasEligiblePeriod) {
  //           //if period is empty or has endDate for all items in period
  //           return DependentHeirConstants.notEligible();
  //         }
  //       } else {
  //         return status;
  //       }
  //     } else {
  //       return status;
  //     }
  //   }
  // }

  getLumpsumReason(data: ValidateRequest) {
    return data.oldestEvent?.valid ? '-' : data?.oldestEvent?.message;
  }
}
