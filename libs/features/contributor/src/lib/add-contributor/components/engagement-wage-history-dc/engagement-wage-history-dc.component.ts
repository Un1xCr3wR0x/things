/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Alert,
  BaseComponent,
  CalendarService,
  CalendarTypeEnum,
  GosiCalendar,
  LookupService,
  Lov,
  LovList,
  convertToHijriFormat,
  subtractDays
} from '@gosi-ui/core';
import { EmployeeWageDetails } from '@gosi-ui/core/lib/models/employment-wage-details';
import moment from 'moment-timezone';
import { EngagementPeriod, HijiriConstant, ManageWageLookUp } from '../../../shared';
import { classDetails } from '../../../shared/models/jobClassDetails';
import { gradeDetails } from '../../../shared/models/jobGradeDetails';

@Component({
  selector: 'cnt-engagement-wage-history-dc',
  templateUrl: './engagement-wage-history-dc.component.html',
  styleUrls: ['./engagement-wage-history-dc.component.scss']
})
export class EngagementWageHistoryDcComponent extends BaseComponent {
  /**LOCAL VARIABLES */
  engagementWageEntryEditDetails;
  editWagePeriodOn = false;
  wagePreviousEdit: Alert;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  maxEndDateForHijiri: any;
  disableWage: boolean;
  basicWageEdit: gradeDetails;

  //--------Input Variable---------
  @Input() engagementWageDetails: EngagementPeriod[] = [];
  @Input() occupationList: LovList = null;
  @Input() disableOccupation: boolean;
  @Input() hideWageInfoSection;
  @Input() editModeOn;
  @Input() isWageAdditionOn: boolean;
  @Input() isPrivate: boolean;
  @Input() contributorType: string;
  @Input() jobClassDetails: classDetails[];
  @Input() jobClassLov: Lov[] = [];
  @Input() jobRankLov: Lov[] = [];
  @Input() jobGradeLov: Lov[] = [];
  @Input() jobGradeApiResponse: gradeDetails[];
  @Input() ppaEstablishment: boolean;
  @Input() lovDataList: ManageWageLookUp[] = new Array<ManageWageLookUp>();
  @Input() hideOccupation = false;
  @Input() isVic = false;
  @Input() hijiriDateConst: HijiriConstant;
  @Input() disableBasicWage: boolean;
  @Input() editWagePeriodOnBoolean: boolean;
  @Input() wageStartDate: GosiCalendar = new GosiCalendar();

  //--------Output Variable---------
  @Output() removeWageEvent: EventEmitter<number> = new EventEmitter();
  @Output() editWageEvent: EventEmitter<EmployeeWageDetails> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  @Output() engagementWageDetailsChange: EventEmitter<EngagementPeriod[]> = new EventEmitter();
  @Output() wagePeriodUpdate: EventEmitter<Date> = new EventEmitter();
  @Output() wageStartDateChange: EventEmitter<GosiCalendar> = new EventEmitter();
  @Output() periodEditOn: EventEmitter<boolean> = new EventEmitter();
  @Output() jobClassListChange: EventEmitter<Lov> = new EventEmitter();
  @Output() jobRankListChange: EventEmitter<Lov> = new EventEmitter();
  @Output() selectedClassIndex: EventEmitter<object> = new EventEmitter();
  @Output() lovDataListChange: EventEmitter<ManageWageLookUp[]> = new EventEmitter();

  /**
   * Method to initialize EngagementWageHistoryDcComponent
   */
  constructor(readonly lookupService: LookupService, readonly calendarService: CalendarService) {
    super();
  }

  ngOnInit() {
    this.maxEndDateForHijiri = this.ppaEstablishment
      ? new Date(this.hijiriDateConst?.ppaMaxHjiriDateInGregorian)
      : new Date(this.hijiriDateConst?.gosiMaxHijiriDateInGregorian);
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
    //values needs to be passed as null for ppa and 0 while editing in ui
    if (this.ppaEstablishment) {
      wage.wage.commission = parseFloat('0.00');
      wage.wage.housingBenefit = parseFloat('0.00');
      wage.wage.otherAllowance = parseFloat('0.00');
    }
    if (this.isWageAdditionOn) this.showError.emit('CONTRIBUTOR.ERR_PREVIOUS_EDIT');
    else if (!this.checkIfPeriodEditOn()) {
      this.editWagePeriodOnBoolean = true;
      this.selectedClassIndex.emit({ data: this.engagementWageDetails[index], index: index });
      this.engagementWageDetails.forEach(element => {
        if (this.engagementWageDetails.indexOf(element) === index) {
          element.canEdit = true;
          this.editWagePeriodOn = true;
          this.engagementWageEntryEditDetails = {
            wage: wage,
            index: index
          };
          this.periodEditOn.emit(true);
          // this.checkMinAndMaxSalForPPA(wage.jobGradeName.english);
        }
      });
    }
  }

  /**
   * Method to create a new period or update the wage period based onthe start date selected
   * @param wageDetails
   */
  updateWageDetails(wageDetails: { wage: any; index: number }) {
    this.editWagePeriodOn = false;
    this.periodEditOn.emit(false);
    // this.checkMinAndMaxSalForPPA(wageDetails.wage.jobGradeName.english);
    let newPeriod: EngagementPeriod;

    const lovData = {
      jobClassLov: this.jobClassLov,
      jobRankLov: this.jobRankLov,
      jobGradeLov: this.jobGradeLov,
      jobGradeApiResponse: this.jobGradeApiResponse,
      startDate: wageDetails?.wage?.startDate
    };

    this.engagementWageDetails.forEach((element, index) => {
      if (index === wageDetails.index) {
        element.canEdit = false;
        if (
          moment(wageDetails.wage.startDate.gregorian).isSame(element.startDate.gregorian) &&
          (moment(wageDetails.wage.startDate.hijiri).isSame(element.startDate.hijiri) ||
            wageDetails.wage.startDate.hijiri == element.startDate.hijiri ||
            wageDetails.wage.startDate.hijiri == convertToHijriFormat(element.startDate.hijiri))
        ) {
          element.occupation = wageDetails.wage.occupation;
          element.startDate = wageDetails.wage.startDate;
          element.wage = wageDetails.wage.wage;
          element.jobGradeName = wageDetails.wage.jobGradeName;
          element.jobRankName = wageDetails.wage.jobRankName;
          element.jobClassName = wageDetails.wage.jobClassName;
          element.jobClassCode = wageDetails?.wage?.jobClassCode;
          element.jobRankCode = wageDetails?.wage?.jobRankCode;
          element.jobGradeCode = wageDetails?.wage?.jobGradeCode;
          this.lovDataList[index] = lovData;
        } else {
          newPeriod = new EngagementPeriod();
          newPeriod.occupation = wageDetails.wage.occupation;
          newPeriod.wage = wageDetails.wage.wage;
          newPeriod.jobGradeName = wageDetails.wage.jobGradeName;
          newPeriod.jobRankName = wageDetails.wage.jobRankName;
          newPeriod.jobClassName = wageDetails.wage.jobClassName;
          newPeriod.jobClassCode = wageDetails?.wage?.jobClassCode;
          newPeriod.jobRankCode = wageDetails?.wage?.jobRankCode;
          newPeriod.jobGradeCode = wageDetails?.wage?.jobGradeCode;
          this.lovDataList.push(lovData);

          if (!moment(wageDetails.wage.startDate.gregorian).isSame(element.startDate.gregorian)) {
            newPeriod.startDate = wageDetails.wage.startDate;
            newPeriod.endDate = { ...element.endDate };
            element.endDate.gregorian = moment(wageDetails.wage.startDate.gregorian)
              .subtract(1, 'months')
              .endOf('month')
              .toDate();
            element.endDate.entryFormat = wageDetails.wage.startDate.entryFormat;
            this.lookupService.getHijriDate(element.endDate.gregorian).subscribe(res => {
              element.endDate.hijiri = convertToHijriFormat(res.hijiri);
              this.newPeriod(newPeriod);
            });
          } else {
            const actualDate = convertToHijriFormat(wageDetails.wage.startDate.hijiri);
            this.calendarService.getGregorianDate(actualDate).subscribe(res => {
              wageDetails.wage.startDate.gregorian = res.gregorian;
              newPeriod.startDate = wageDetails.wage.startDate;
              newPeriod.endDate = { ...element.endDate };
              element.endDate.gregorian = moment(subtractDays(wageDetails.wage.startDate.gregorian, 1)).toDate();
              element.endDate.entryFormat = wageDetails.wage.startDate.entryFormat;
              this.lookupService.getHijriDate(element.endDate.gregorian).subscribe(res => {
                element.endDate.hijiri = convertToHijriFormat(res.hijiri);
                this.newPeriod(newPeriod);
              });
            });
          }
        }
      }
    });

    // if (newPeriod) {
    //   this.engagementWageDetails.push(newPeriod);
    // }
    // this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
    // this.engagementWageDetailsChange.emit(this.engagementWageDetails);
    // this.wagePeriodUpdate.emit(this.engagementWageDetails[0].startDate.gregorian);
    // this.showError.emit(''); //to clear any previous errors on save
  }

  newPeriod(newPeriod) {
    if (newPeriod) {
      this.engagementWageDetails.push(newPeriod);
    }
    this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
    this.lovDataList = this.sortLovDataList(this.lovDataList);
    this.lovDataListChange.emit(this.lovDataList);
    this.engagementWageDetailsChange.emit(this.engagementWageDetails);
    this.wageStartDate = this.engagementWageDetails[0]?.startDate;
    this.wageStartDateChange.emit(this.wageStartDate);
    this.wagePeriodUpdate.emit(this.engagementWageDetails[0].startDate.gregorian);
    this.periodEditOn.emit(false);
    this.showError.emit(''); //to clear any previous errors on save
  }
  /**
   * Method to sort engagement periods (last added period on top)
   * @param wageDetails
   */
  sortEngagementPeriod(wageDetails: EngagementPeriod[]) {
    return wageDetails.sort((a, b) => {
      const dateOne = moment(b.startDate.gregorian);
      const dateTwo = moment(a.startDate.gregorian);
      return dateOne.isAfter(dateTwo) ? 1 : dateOne.isBefore(dateTwo) ? -1 : 0;
    });
  }

  sortLovDataList(lovDataList: ManageWageLookUp[]) {
    return lovDataList.sort((a, b) => {
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
  getYear(date: string) {
    return moment(date).toDate().getFullYear().toString();
  }

  isEndDateAfterPpaDate(endDate: Date) {
    if (moment(endDate).isAfter(moment(this.hijiriDateConst.ppaMinGregorianDate))) {
      return true;
    } else false;
  }
  // getJoiningDateForPPA(data: any) {
  //   this.joiningDateForPPAChange.emit(data);
  // }

  jobClassListChangeForPPA(data: any) {
    this.jobClassListChange.emit(data);
  }

  jobRankListChangeForPPA(data: any) {
    this.jobRankListChange.emit(data);
  }
  /** This method is to check min, max salary of Grade for PPA  */
  checkMinAndMaxSalForPPA(event) {
    if (this.ppaEstablishment) {
      this.basicWageEdit = this.jobGradeApiResponse?.find(item => item?.jobGradeName.english === event);
      if (this.basicWageEdit.minSalary === this.basicWageEdit.maxSalary) this.disableWage = true;
      else this.disableWage = false;
    }
  }
}
