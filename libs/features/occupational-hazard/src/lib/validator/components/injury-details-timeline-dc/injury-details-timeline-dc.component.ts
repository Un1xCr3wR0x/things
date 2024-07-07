/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { GosiCalendar, BilingualText, dayDiff } from '@gosi-ui/core';
import * as moment from 'moment';
import { DateViolationMsg } from '../../../shared/constants/dateviolation-msg';
import { Engagement, Establishment, Injury } from '../../../shared/models';

@Component({
  selector: 'oh-vtr-injury-details-timeline-dc',
  templateUrl: './injury-details-timeline-dc.component.html',
  styleUrls: ['./injury-details-timeline-dc.component.scss']
})
export class InjuryDetailsTimelineDcComponent implements OnChanges {
  /**
   * Input variables
   */
  @Input() injuryDetails: Injury = new Injury();
  @Input() engagement: Engagement = new Engagement();
  @Input() establishmentDetails: Establishment = new Establishment();
  @Input() canEdit?: boolean;
  @Input() idCode?: string;
  @Input() registrationNo: number;
  @Input() socialInsuranceNo: number;
  @Input() allowanceFlagVal: boolean;
  @Input() allowanceFlag: boolean;
  @Input() allowanceFlagVal3: boolean;
  @Input() allowanceFlagVal4: boolean;

  /**
   * Output variables
   */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();
  @Output() injurySelected: EventEmitter<Injury> = new EventEmitter();

  /**
   * Local variables
   */
  injuryDateList: string[] = [];
  startDate: GosiCalendar = new GosiCalendar();
  engagementStartDate: GosiCalendar = new GosiCalendar();
  injuryTime: string;
  isInjuryFormSubmissionDateDiff: boolean;
  isInjuryEngagementApprovalDate: boolean;
  isInjuryEngagementJoiningDate: boolean;
  isEmployerInformedOnViolation = false;
  isEmployerInformedOnYearsViolation = false;
  lang = 'en';
  delayedDays: number;
  delayedDaysWithCurrentDay: number;
  labelForReason: string;
  labelforReasonAdmin: string;
  isWorkerinformedViolation = false;
  employerInformedOnDaysDiff: number;
  employerInformedOnDayDiff: number;
  workerInformedDiff: number;
  engagementApprovalDate: GosiCalendar = new GosiCalendar();
  engagementformSubmissionDate: GosiCalendar = new GosiCalendar();
  workerInformedMonthsDiff = 0;
  workerInformedDaysDiff = 0;
  workerInformedYearsDiff = 0;
  employerInformedMonthsDiff = 0;
  employerInformedYearsDiff = 0;
  injuryReportingDaysDiff = 0;
  injuryReportingMonthsDiff = 0;
  injuryReportingYearsDiff = 0;
  allowancePayee: BilingualText = new BilingualText();
  /**
   *
   * @param language Creating an instance
   * @param router
   */
  constructor(readonly router: Router) {}

  /**
   *
   * @param changes Capturing input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (
      this.injuryDetails &&
      this.injuryDetails.engagementStartDate &&
      this.injuryDetails.engagementStartDate.gregorian
    ) {
      this.engagementStartDate = this.injuryDetails.engagementStartDate;
    } else {
      this.engagementStartDate = new GosiCalendar();
    }

    if (changes && changes.injuryDetails) {
      this.injuryDetails = changes.injuryDetails.currentValue;
      this.injuryTime =
        this.injuryDetails.injuryHour != null
          ? this.injuryDetails.injuryHour + ':' + this.injuryDetails.injuryMinute
          : null;
      this.checkWorkerInformedOnViolation();
      this.checkForEmployerInformedViolation();
      this.setLabelForReasonForDelay();
    }

    if (changes && changes.establishmentDetails) {
      this.establishmentDetails = changes.establishmentDetails.currentValue;
      if (this.establishmentDetails) {
        this.startDate = this.establishmentDetails.startDate;
      }
    }
    if (changes && changes.engagement) {
      this.engagement = changes.engagement.currentValue;
      if (this.engagement && this.engagement.engagementPeriod) {
        this.engagementApprovalDate = this.engagement.approvalDate;
        this.engagementformSubmissionDate = this.engagement.formSubmissionDate;
        this.engagement.engagementPeriod.forEach(key => {
          if (
            moment(this.injuryDetails?.injuryDate?.gregorian).isAfter(key?.startDate?.gregorian) &&
            moment(this.injuryDetails?.injuryDate?.gregorian).isBefore(key?.endDate?.gregorian)
          ) {
            this.engagementStartDate = key.startDate;
          } else if (moment(this.injuryDetails?.injuryDate?.gregorian).isAfter(key?.startDate?.gregorian)) {
            this.engagementStartDate = key.startDate;
          }
        });
      }
    }
    this.checkViolation();
  }
  setLabelForReasonForDelay() {
    if (
      this.injuryDetails?.employeeInformedDate !== undefined ||
      (null && this.injuryDetails?.injuryDate !== undefined) ||
      null
    ) {
      this.delayedDays = this.getDateDifference(
        this.injuryDetails?.injuryDate?.gregorian,
        this.injuryDetails?.employeeInformedDate?.gregorian
      );
      if (this.delayedDays >= 7) {
        this.labelForReason = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-CONTRIBUTOR';
      }
    }
    if (
      this.injuryDetails.employeeInformedDate !== undefined ||
      (null && this.injuryDetails?.injuryDate === undefined) ||
      null
    ) {
      this.delayedDaysWithCurrentDay = this.getDateDifference(
        this.injuryDetails?.employeeInformedDate?.gregorian,
        this.injuryDetails?.employerInformedDate?.gregorian
      );
      if (this.delayedDaysWithCurrentDay >= 3) {
        this.labelForReason = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-EMPLOYER';
      }
    }
    if (this.delayedDays >= 7 && this.delayedDaysWithCurrentDay >= 3) {
      this.labelForReason = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-BOTH';
    }
    if(this.allowanceFlagVal || this.allowanceFlag || this.allowanceFlagVal3 || this.allowanceFlagVal4) {
      this.labelForReason = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-CONTRIBUTOR';
      this.labelforReasonAdmin = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-EMPLOYER';
    }
  }
  getDateDifference(dateFrom: Date, dateto: Date) {
    const delayedDays = dayDiff(dateFrom, dateto);
    return delayedDays;
  }
  /**
   * Check violations for employer informed date
   */
  checkForEmployerInformedViolation() {
    const employerInformedDate = moment(this.injuryDetails.employerInformedDate.gregorian);
    const employeeInformedDate = moment(this.injuryDetails.employeeInformedDate.gregorian);
    this.employerInformedYearsDiff = employerInformedDate.diff(employeeInformedDate, 'years');
    employeeInformedDate.add(this.employerInformedYearsDiff, 'years');
    this.employerInformedMonthsDiff = employerInformedDate.diff(employeeInformedDate, 'months');
    employeeInformedDate.add(this.employerInformedMonthsDiff, 'months');
    this.employerInformedOnDaysDiff = employerInformedDate.diff(employeeInformedDate, 'days');
    if (
      this.employerInformedOnDaysDiff > 3 ||
      this.employerInformedMonthsDiff >= 1 ||
      this.employerInformedYearsDiff >= 1
    ) {
      this.isEmployerInformedOnViolation = true;
    }
    const employerInformedOnYears = moment(this.injuryDetails?.employerInformedDate?.gregorian).diff(
      moment(this.injuryDetails?.injuryDate?.gregorian),
      'years',
      true
    );
    const injuryDate = moment(this.injuryDetails?.injuryDate?.gregorian);
    this.injuryReportingYearsDiff = employerInformedDate.diff(injuryDate, 'years');
    injuryDate.add(this.injuryReportingYearsDiff, 'years');
    this.injuryReportingMonthsDiff = employerInformedDate.diff(injuryDate, 'months');
    injuryDate.add(this.injuryReportingMonthsDiff, 'months');
    this.injuryReportingDaysDiff = employerInformedDate.diff(injuryDate, 'days');
    if (employerInformedOnYears > 1) {
      this.isEmployerInformedOnYearsViolation = true;
    }
  }
  /**
   * Check violations for worker informed date
   */
  checkWorkerInformedOnViolation() {
    const employeeInformedDate = moment(this.injuryDetails.employeeInformedDate.gregorian);
    const injuryDate = moment(this.injuryDetails.injuryDate.gregorian);
    this.workerInformedYearsDiff = employeeInformedDate.diff(injuryDate, 'years');
    injuryDate.add(this.workerInformedYearsDiff, 'years');
    this.workerInformedMonthsDiff = employeeInformedDate.diff(injuryDate, 'months');
    injuryDate.add(this.workerInformedMonthsDiff, 'months');
    this.workerInformedDaysDiff = employeeInformedDate.diff(injuryDate, 'days');
    if (this.workerInformedDaysDiff > 7 || this.workerInformedMonthsDiff >= 1 || this.workerInformedYearsDiff >= 1) {
      this.isWorkerinformedViolation = true;
    }
  }
  /**
   * Check violations for injury date
   */
  checkViolation() {
    if (this.establishmentDetails && this.injuryDetails && this.engagementformSubmissionDate) {
      this.injuryDateList = [];
      if (this.engagementformSubmissionDate?.gregorian && this.injuryDetails.injuryDate?.gregorian) {
        if (
          moment(this.engagementformSubmissionDate.gregorian).isAfter(this.injuryDetails.injuryDate.gregorian, 'day')
        ) {
          this.isInjuryFormSubmissionDateDiff = true;
          this.injuryDateList.push(DateViolationMsg.INJURY_DATE_VIOLATION1);
        } else {
          this.isInjuryFormSubmissionDateDiff = false;
        }
      }

      if (this.injuryDetails.injuryDate?.gregorian && this.engagementApprovalDate?.gregorian) {
        if (moment(this.injuryDetails.injuryDate.gregorian).isBefore(this.engagementApprovalDate.gregorian, 'day')) {
          this.isInjuryEngagementApprovalDate = true;
          this.injuryDateList.push(DateViolationMsg.INJURY_DATE_VIOLATION2);
        } else {
          this.isInjuryEngagementApprovalDate = false;
        }
      }
      if (this.engagement && this.engagement.joiningDate) {
        if (this.injuryDetails.injuryDate.gregorian && this.engagement.joiningDate.gregorian) {
          if (moment(this.injuryDetails.injuryDate.gregorian).isSame(this.engagement.joiningDate.gregorian, 'month')) {
            this.isInjuryEngagementJoiningDate = true;
            this.injuryDateList.push(DateViolationMsg.INJURY_DATE_VIOLATION3);
          } else {
            this.isInjuryEngagementJoiningDate = false;
          }
        }
      }
    }
  }
  // Method to emit edit details

  onEditInjuryDetails() {
    this.onEdit.emit();
  }

  /**
   * Method to capture navigation details and send to parent via event emitter
   */
  navigateToInjuryDetails() {
    this.injurySelected.emit();
  }
  /**
   *
   * @param year Label for years
   * @param month
   * @param day
   * @param isContributorInformed
   */
  calculateYears(year, month, day, isContributorInformed: boolean) {
    if (year > 0 && month === 0 && day === 0) {
      return this.calculateLessThanTwoScenarios(isContributorInformed, year);
    } else if (year === 0) {
      return '';
    } else if (year === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-YEAR';
    } else if (year === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-YEAR';
    } else if (year > 2 && year < 11) {
      return 'OCCUPATIONAL-HAZARD.GREATER-THAN-TWO';
    } else if (year > 10) {
      return 'OCCUPATIONAL-HAZARD.GREATER-THAN-TEN';
    } else {
      return 'OCCUPATIONAL-HAZARD.YEARS';
    }
  }
  calculateLessThanTwoScenarios(isContributorInformed: boolean, year) {
    if (isContributorInformed && year === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-YEAR_INJURY';
    } else if (isContributorInformed && year === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-YEAR-INJURY';
    } else if (isContributorInformed && year > 2 && year < 11) {
      return 'OCCUPATIONAL-HAZARD.YEAR-DIFF';
    } else if (isContributorInformed && year > 10) {
      return 'OCCUPATIONAL-HAZARD.YEARS-DIFF';
    } else if (!isContributorInformed && year === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-YEAR-FROM-EMPLOYEE-INFORMED';
    } else if (!isContributorInformed && year === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-YEAR-FROM-EMPLOYEE-INFORMED';
    } else if (!isContributorInformed && year > 2 && year < 11) {
      return 'OCCUPATIONAL-HAZARD.YEAR-EMPLOYEE-INFORMED';
    } else if (!isContributorInformed && year > 10) {
      return 'OCCUPATIONAL-HAZARD.YEARS-EMPLOYEE-INFORMED';
    }
  }

  /**
   *
   * @param month Label for months
   * @param day
   * @param isContributorInformed
   */
  calculateMonths(month, day, isContributorInformed: boolean) {
    if (month > 0 && day === 0) {
      return this.calculateLessThanTwoScenariosForMonth(isContributorInformed, month);
    } else if (month === 0) {
      return '';
    } else if (month === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-MONTH';
    } else if (month === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-MONTH';
    } else if (month > 2 && month < 11) {
      return 'OCCUPATIONAL-HAZARD.GREATER-THAN-TWO-MONTH';
    } else if (month > 10) {
      return 'OCCUPATIONAL-HAZARD.GREATER-THAN-TEN-MONTH';
    }
  }
  /**
   *
   * @param day Label for days
   * @param isContributorInformed
   */
  calculateDays(day: number, isContributorInformed: boolean) {
    if (day > 0) {
      return this.calculateLessThanTwoScenariosForDay(isContributorInformed, day);
    } else if (day === 0) {
      return '';
    }
  }
  calculateLessThanTwoScenariosForMonth(isContributorInformed, month) {
    if (isContributorInformed && month === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-MONTH-INJURY';
    } else if (isContributorInformed && month === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-MONTH-INJURY';
    } else if (isContributorInformed && month > 2 && month < 11) {
      return 'OCCUPATIONAL-HAZARD.MONTH-DIFF-INJURY';
    } else if (isContributorInformed && month > 10) {
      return 'OCCUPATIONAL-HAZARD.MONTHS-DIFF-INJURY';
    } else if (!isContributorInformed && month === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-MONTHS-FROM-EMPLOYEE-INFORMED';
    } else if (!isContributorInformed && month === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-MONTHS-FROM-EMPLOYEE-INFORMED';
    } else if (!isContributorInformed && month > 2 && month < 11) {
      return 'OCCUPATIONAL-HAZARD.MONTH-EMPLOYEE-INFORMED';
    } else if (!isContributorInformed && month > 10) {
      return 'OCCUPATIONAL-HAZARD.MONTHS-EMPLOYEE-INFORMED';
    }
  }
  calculateLessThanTwoScenariosForDay(isContributorInformed, day) {
    if (isContributorInformed && day === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-DAY-INJURY';
    } else if (isContributorInformed && day === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-DAY-INJURY';
    } else if (isContributorInformed && day > 2 && day < 11) {
      return 'OCCUPATIONAL-HAZARD.DAY-DIFF-INJURY';
    } else if (isContributorInformed && day > 10) {
      return 'OCCUPATIONAL-HAZARD.DAYS-DIFF-INJURY';
    } else if (!isContributorInformed && day === 1) {
      return 'OCCUPATIONAL-HAZARD.ONE-DAY-FROM-EMPLOYEE-INFORMED';
    } else if (!isContributorInformed && day === 2) {
      return 'OCCUPATIONAL-HAZARD.TWO-DAY-FROM-EMPLOYEE-INFORMED';
    } else if (!isContributorInformed && day > 2 && day < 11) {
      return 'OCCUPATIONAL-HAZARD.DAY-EMPLOYEE-INFORMED';
    }
    if (!isContributorInformed && day > 10) {
      return 'OCCUPATIONAL-HAZARD.DAYS-EMPLOYEE-INFORMED';
    }
  }
  /**
   * get payee
   */
  getPayee() {
    if (this.injuryDetails.allowancePayee === 2) {
      this.allowancePayee.english = 'Contributor';
      this.allowancePayee.arabic = 'المشترك';
      return this.allowancePayee;
    } else if (this.injuryDetails.allowancePayee === 1) {
      this.allowancePayee.english = 'Establishment';
      this.allowancePayee.arabic = 'منشأة';
      return this.allowancePayee;
    }
  }
}
