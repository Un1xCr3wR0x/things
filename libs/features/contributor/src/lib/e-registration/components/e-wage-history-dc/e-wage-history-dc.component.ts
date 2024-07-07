/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { Alert, BaseComponent, LanguageToken, LovList } from '@gosi-ui/core';
import { EmployeeWageDetails } from '@gosi-ui/core/lib/models/employment-wage-details';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { EngagementPeriod } from '../../../shared';
import { EEngagementPeriod } from '../../../shared/models/e-engagement-period';

@Component({
  selector: 'cnt-e-wage-history-dc',
  templateUrl: './e-wage-history-dc.component.html',
  styleUrls: ['./e-wage-history-dc.component.scss']
})
export class EWageHistoryDcComponent extends BaseComponent {
/**LOCAL VARIABLES */
engagementWageEntryEditDetails;
editWagePeriodOn = false;
wagePreviousEdit: Alert;
lang = 'en';
//--------Input Variable---------
@Input() engagementWageDetails: EEngagementPeriod[] = [];
@Input() occupationList: LovList = null;
@Input() disableOccupation: boolean;
@Input() hideWageInfoSection;
@Input() inEditMode;
@Input() isWageAdditionOn: boolean;
@Input() eWageDetails: EEngagementPeriod[] = [];
//--------Output Variable---------
@Output() removeWageEvent: EventEmitter<number> = new EventEmitter();
@Output() editWageEvent: EventEmitter<EmployeeWageDetails> = new EventEmitter();
@Output() showError: EventEmitter<string> = new EventEmitter();
@Output() engagementWageDetailsChange: EventEmitter<EEngagementPeriod[]> = new EventEmitter();
@Output() wagePeriodUpdate: EventEmitter<Date> = new EventEmitter();
@Output() periodEditOn: EventEmitter<boolean> = new EventEmitter();

/**
 * Method to initialize EngagementWageHistoryDcComponent
 */
constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
  super();
  this.language.subscribe(res => (this.lang = res));
}

/**
 * Method to remove wage period
 * @param index
 */
removeWagePeriod(index: number) {
  if (this.isWageAdditionOn) this.showError.emit('CONTRIBUTOR.ERR_PREVIOUS_EDIT');
  else if (!this.checkIfPeriodEditOn()) this.removeWageEvent.emit(index);
}

/** Method to check whether period edit is on. */
checkIfPeriodEditOn() {
  let isPreviousEditOn = false;
  this.engagementWageDetails.forEach(element => {
    if (element.canEdit === true) {
      isPreviousEditOn = element.canEdit;
      this.showError.emit('CONTRIBUTOR.ERR_PREVIOUS_EDIT');
    }
  });
  return isPreviousEditOn;
}
/**
 * Method to edit a wage period
 * @param wage
 * @param index
 */
editWagePeriod(wage: EmployeeWageDetails, index: number) {
  if (this.isWageAdditionOn) this.showError.emit('CONTRIBUTOR.ERR_PREVIOUS_EDIT');
  else if (!this.checkIfPeriodEditOn()) {
    this.engagementWageDetails.forEach(element => {
      if (this.engagementWageDetails.indexOf(element) === index) {
        element.canEdit = true;
        this.editWagePeriodOn = true;
        this.engagementWageEntryEditDetails = {
          wage: wage,
          index: index
        };
        this.periodEditOn.emit(true);
      }
    });
  }
}

/**
 * Method to create a new period or update the wage period based onthe start date selected
 * @param wageDetails
 */
updateWageDetails(wageDetails) {
  this.editWagePeriodOn = false;
  let newPeriod: EngagementPeriod;
  this.engagementWageDetails.forEach((element, index) => {
    if (index === wageDetails.index) {
      element.canEdit = false;
      if (moment(wageDetails.wage.startDate.gregorian).isSame(element.startDate.gregorian)) {
        element.occupation = wageDetails.wage.occupation;
        element.startDate = wageDetails.wage.startDate;
        element.wage = wageDetails.wage.wage;
      } else {
        newPeriod = new EngagementPeriod();
        newPeriod.occupation = wageDetails.wage.occupation;
        newPeriod.startDate = wageDetails.wage.startDate;
        newPeriod.wage = wageDetails.wage.wage;
        newPeriod.endDate = { ...element.endDate };
        element.endDate.gregorian = moment(wageDetails.wage.startDate.gregorian)
          .subtract(1, 'months')
          .endOf('month')
          .toDate();
      }
    }
  });
  if (newPeriod) {
    this.engagementWageDetails.push(newPeriod);
  }
  this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
  this.engagementWageDetailsChange.emit(this.engagementWageDetails);
  this.wagePeriodUpdate.emit(this.engagementWageDetails[0].startDate.gregorian);
  this.periodEditOn.emit(false);
  this.showError.emit(''); //to clear any previous errors on save
}

/**
 * Method to sort engagement periods (last added period on top)
 * @param wageDetails
 */
sortEngagementPeriod(wageDetails: EEngagementPeriod[]) {
  return wageDetails.sort((a, b) => {
    const dateOne = moment(b.startDate.gregorian);
    const dateTwo = moment(a.startDate.gregorian);
    return dateOne.isAfter(dateTwo) ? 1 : dateOne.isBefore(dateTwo) ? -1 : 0;
  });
}

/**
 * Method to cancel to wage edit
 */
cancelWageEdit() {
  this.engagementWageDetails.forEach(element => {
    if (element.canEdit === true) {
      element.canEdit = false;
      this.editWagePeriodOn = false;
      this.periodEditOn.emit(false);
      this.showError.emit(''); //to clear any previous errors on cancel
    }
  });
}
}
