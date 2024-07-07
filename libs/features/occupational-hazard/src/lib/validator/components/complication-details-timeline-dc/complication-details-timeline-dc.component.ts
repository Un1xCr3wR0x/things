/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { GosiCalendar, EstablishmentProfile, ApplicationTypeEnum } from '@gosi-ui/core';
import * as moment from 'moment';
import { Engagement, Complication } from '../../../shared/models';
import { DateViolationMsg } from '../../../shared/constants/dateviolation-msg';

@Component({
  selector: 'oh-vtr-complication-details-timeline-dc',
  templateUrl: './complication-details-timeline-dc.component.html',
  styleUrls: ['./complication-details-timeline-dc.component.scss']
})
export class ComplicationDetailsTimelineDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() establishment: EstablishmentProfile = new EstablishmentProfile();
  @Input() engagement: Engagement = new Engagement();
  @Input() canEdit: boolean;
  @Input() complication: Complication = new Complication();
  @Input() isContributor: boolean;

  /**
   * Output variables
   */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();
  @Output() complicationSelected: EventEmitter<Complication> = new EventEmitter();

  /**
   * Local variables
   */
  estjoinDate: GosiCalendar = new GosiCalendar();
  engagementApprovalDate: GosiCalendar = new GosiCalendar();
  startDateOfEngagement: GosiCalendar = new GosiCalendar();

  isComplicationSubmissionDateDiff: boolean;
  isComplicationEngagementApprvDateDiff: boolean;
  isComplicationEngagementJoinDateDiff: boolean;
  contributorInformedMonthsDiff = 0;
  employerInformedOnDaysDiff: number;
  employerInformedOnDateViolation = false;
  complicationReportedOnMonthsDiff = 0;
  complicationReportedOnDaysDiff = 0;
  employerInformedYearsOnViolation = false;
  employerInformedYearsDiff = 0;
  complicationReportingYearsDiff = 0;
  contributorInformedYearsDiff = 0;
  contributorInformedOnDateMonthsOfDifference = 0;
  contributorInformedOnDaysDifference = 0;
  contributorInformedViolation = false;
  complicationDateList = [];
  isIndividualApp: boolean;

  //TODO: remove unused methods
  /**
   * Creates an instance of ComplicationDetailsTimelineDcComponent
   * @memberof  ComplicationDetailsTimelineDcComponent
   *
   */
  constructor() {}

  /**
   * This method is to initialize the component
   */
  ngOnInit() {
    this.isIndividualApp = ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
  }

  /**
   * Method to detect the input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.complication && this.complication.engagementStartDate && this.complication.engagementStartDate.gregorian) {
      this.startDateOfEngagement = this.complication.engagementStartDate;
    } else {
      this.startDateOfEngagement = new GosiCalendar();
    }
    if (changes && changes.complication) {
      this.complication = changes.complication.currentValue;
      this.checkContributorInformedOnViolation();
      this.checkEmployerInformedOnViolation();
    }
    if (changes && changes.establishment) {
      this.establishment = changes.establishment.currentValue;
      if (this.establishment) {
        this.estjoinDate = this.establishment.startDate;
      }
    }
    if (changes && changes.engagement) {
      this.engagement = changes.engagement.currentValue;
      if (this.engagement && this.complication && this.complication.complicationDate) {
        this.engagementApprovalDate = this.engagement.approvalDate;
        this.engagement.engagementPeriod.forEach(key => {
          if (
            moment(this.complication.complicationDate?.gregorian).isAfter(key.startDate?.gregorian) &&
            moment(this.complication.complicationDate?.gregorian).isBefore(key.endDate?.gregorian)
          ) {
            this.startDateOfEngagement = key.startDate;
          } else if (moment(this.complication.complicationDate?.gregorian).isAfter(key.startDate?.gregorian)) {
            this.startDateOfEngagement = key.startDate;
          }
        });
      }
    }
    this.checkViolation();
  }
  /**
   * Check violations for employer informed date
   */
  checkEmployerInformedOnViolation() {
    const employerInformedDate = moment(this.complication.employerInformedDate?.gregorian);
    const employeeInformedDate = moment(this.complication.employeeInformedDate?.gregorian);
    this.employerInformedYearsDiff = employerInformedDate.diff(employeeInformedDate, 'years');
    employeeInformedDate.add(this.employerInformedYearsDiff, 'years');
    this.contributorInformedMonthsDiff = employerInformedDate.diff(employeeInformedDate, 'months');
    employeeInformedDate.add(this.contributorInformedMonthsDiff, 'months');
    this.employerInformedOnDaysDiff = employerInformedDate.diff(employeeInformedDate, 'days');
    if (this.employerInformedOnDaysDiff > 3 || this.contributorInformedMonthsDiff >= 1) {
      this.employerInformedOnDateViolation = true;
    }
    const employerInformedOnYears = moment(this.complication.employerInformedDate?.gregorian).diff(
      moment(this.complication.complicationDate?.gregorian),
      'years',
      true
    );
    const complicationDate = moment(this.complication.complicationDate?.gregorian);
    this.complicationReportingYearsDiff = employerInformedDate.diff(complicationDate, 'years');
    complicationDate.add(this.complicationReportingYearsDiff, 'years');
    this.complicationReportedOnMonthsDiff = employerInformedDate.diff(complicationDate, 'months');
    complicationDate.add(this.complicationReportedOnMonthsDiff, 'months');
    this.complicationReportedOnDaysDiff = employerInformedDate.diff(complicationDate, 'days');
    if (employerInformedOnYears > 1) {
      this.employerInformedYearsOnViolation = true;
    }
  }
  /**
   * Check violations for worker informed date
   */
  checkContributorInformedOnViolation() {
    const employeeInformedDate = moment(this.complication.employeeInformedDate?.gregorian);
    const complicationDate = moment(this.complication.complicationDate?.gregorian);
    this.contributorInformedYearsDiff = employeeInformedDate.diff(complicationDate, 'years');
    complicationDate.add(this.contributorInformedYearsDiff, 'years');
    this.contributorInformedOnDateMonthsOfDifference = employeeInformedDate.diff(complicationDate, 'months');
    complicationDate.add(this.contributorInformedOnDateMonthsOfDifference, 'months');
    this.contributorInformedOnDaysDifference = employeeInformedDate.diff(complicationDate, 'days');
    if (
      this.contributorInformedOnDaysDifference > 7 ||
      this.contributorInformedOnDateMonthsOfDifference >= 1 ||
      this.contributorInformedYearsDiff >= 1
    ) {
      this.contributorInformedViolation = true;
    }
  }
  /**
   * Check violations for injury date
   */
  checkViolation() {
    if (this.establishment && this.complication && this.engagement) {
      this.complicationDateList = [];
      if (this.engagement.formSubmissionDate?.gregorian && this.complication.complicationDate?.gregorian) {
        if (
          moment(this.engagement.formSubmissionDate?.gregorian).isAfter(
            this.complication.complicationDate?.gregorian,
            'day'
          )
        ) {
          this.isComplicationSubmissionDateDiff = true;
          this.complicationDateList.push(DateViolationMsg.COMPLICATION_DATE_VIOLATION1);
        } else {
          this.isComplicationSubmissionDateDiff = false;
        }
      }

      if (this.complication.complicationDate?.gregorian && this.engagement.approvalDate?.gregorian) {
        if (
          moment(this.complication.complicationDate.gregorian).isBefore(this.engagement.approvalDate.gregorian, 'day')
        ) {
          this.isComplicationEngagementApprvDateDiff = true;
          this.complicationDateList.push(DateViolationMsg.COMPLICATION_DATE_VIOLATION2);
        } else {
          this.isComplicationEngagementApprvDateDiff = false;
        }
      }
      if (this.complication.complicationDate.gregorian && this.engagement.joiningDate?.gregorian) {
        if (
          moment(this.complication.complicationDate.gregorian).isSame(this.engagement.joiningDate.gregorian, 'month')
        ) {
          this.isComplicationEngagementJoinDateDiff = true;
          this.complicationDateList.push(DateViolationMsg.COMPLICATION_DATE_VIOLATION3);
        } else {
          this.isComplicationEngagementJoinDateDiff = false;
        }
      }
    }
  }
  // Method to emit edit details
  onEditComlicationDetails() {
    this.onEdit.emit();
  }
  /**
   * Method to emit complication
   * @param complication
   */
  viewComplicationDetails(complication: Complication) {
    this.complicationSelected.emit(complication);
  }
  /**
   *
   * @param years Label for years
   * @param months
   * @param days
   * @param isDelayed
   */
  calculateYear(years, months, days, isDelayed: boolean) {
    if (years > 0 && months === 0 && days === 0) {
      return this.calculateLessThanTwoScenarios(isDelayed, years);
    } else if (years === 0) {
      return '';
    } else if (years === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-YEAR';
    } else if (years === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-YEAR';
    } else if (years > 2 && years < 11) {
      return 'OCCUPATIONAL-HAZARD.GREATER-THAN-TWO';
    } else if (years > 10) {
      return 'OCCUPATIONAL-HAZARD.GREATER-THAN-TEN';
    } else {
      return 'OCCUPATIONAL-HAZARD.YEARS';
    }
  }
  calculateLessThanTwoScenarios(isDelayed: boolean, year) {
    if (isDelayed && year === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-YEAR-COMPLICATION';
    } else if (isDelayed && year === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-YEAR-COMPLICATION';
    } else if (isDelayed && year > 2 && year < 11) {
      return 'OCCUPATIONAL-HAZARD.YEAR-DIFF-COMPLICATION';
    } else if (isDelayed && year > 10) {
      return 'OCCUPATIONAL-HAZARD.YEARS-DIFF-COMPLICATION';
    } else if (!isDelayed && year === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-YEAR-FROM-EMPLOYEE-INFORMED';
    } else if (!isDelayed && year === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-YEAR-FROM-EMPLOYEE-INFORMED';
    } else if (!isDelayed && year > 2 && year < 11) {
      return 'OCCUPATIONAL-HAZARD.YEAR-EMPLOYEE-INFORMED';
    } else if (!isDelayed && year > 10) {
      return 'OCCUPATIONAL-HAZARD.YEARS-EMPLOYEE-INFORMED';
    }
  }

  /**
   *
   * @param months Label for months
   * @param days
   * @param isContributorInformed
   */
  calculateMonth(months, days, isDelayed: boolean) {
    if (months > 0 && days === 0) {
      return this.calculateLessThanTwoScenariosForMonths(isDelayed, months);
    } else if (months === 0) {
      return '';
    } else if (months === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-MONTH';
    } else if (months === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-MONTH';
    } else if (months > 2 && months < 11) {
      return 'OCCUPATIONAL-HAZARD.GREATER-THAN-TWO-MONTH';
    } else if (months > 10) {
      return 'OCCUPATIONAL-HAZARD.GREATER-THAN-TEN-MONTH';
    }
  }
  calculateLessThanTwoScenariosForMonths(isDelayed: boolean, months) {
    if (isDelayed && months === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-MONTH-COMPLICATION';
    } else if (isDelayed && months === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-MONTH-COMPLICATION';
    } else if (isDelayed && months > 2 && months < 11) {
      return 'OCCUPATIONAL-HAZARD.MONTH-DIFF-COMPLICATION';
    } else if (isDelayed && months > 10) {
      return 'OCCUPATIONAL-HAZARD.MONTHS-DIFF-COMPLICATION';
    } else if (!isDelayed && months === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-MONTHS-FROM-EMPLOYEE-INFORMED';
    } else if (!isDelayed && months === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-MONTHS-FROM-EMPLOYEE-INFORMED';
    } else if (!isDelayed && months > 2 && months < 11) {
      return 'OCCUPATIONAL-HAZARD.MONTH-EMPLOYEE-INFORMED';
    } else if (!isDelayed && months > 10) {
      return 'OCCUPATIONAL-HAZARD.MONTHS-EMPLOYEE-INFORMED';
    }
  }
  /**
   *
   * @param days Label for days
   * @param isContributorInformed
   */
  calculateDay(days: number, isDelayed: boolean) {
    if (days > 0) {
      return this.calculateLessThanTwoScenariosForDays(isDelayed, days);
    } else if (days === 0) {
      return '';
    }
  }
  calculateLessThanTwoScenariosForDays(isDelayed: boolean, days) {
    if (isDelayed && days === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-DAY-COMPLICATION';
    } else if (isDelayed && days === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-DAY-COMPLICATION';
    } else if (isDelayed && days > 2 && days < 11) {
      return 'OCCUPATIONAL-HAZARD.DAY-DIFF-COMPLICATION';
    } else if (isDelayed && days > 10) {
      return 'OCCUPATIONAL-HAZARD.DAYS-DIFF-COMPLICATION';
    } else if (!isDelayed && days === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-DAY-FROM-EMPLOYEE-INFORMED';
    } else if (!isDelayed && days === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-DAY-FROM-EMPLOYEE-INFORMED';
    } else if (!isDelayed && days > 2 && days < 11) {
      return 'OCCUPATIONAL-HAZARD.DAY-EMPLOYEE-INFORMED';
    }
    if (!isDelayed && days > 10) {
      return 'OCCUPATIONAL-HAZARD.DAYS-EMPLOYEE-INFORMED';
    }
  }
}

