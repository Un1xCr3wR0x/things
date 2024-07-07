/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IdentityTypeEnum,
  LanguageToken,
  LovList,
  markFormGroupTouched,
  RoleIdEnum,
  BilingualText,
  startOfMonth,
  AlertService,
  OccupationList,
  endOfMonth
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import { EngagementDetails } from '@gosi-ui/features/contributor/lib/shared/models';
import {
  Contributor,
  ContributorConstants,
  DropDownItems,
  EngagementPeriod,
  Establishment,
  SystemParameter,
  YesOrNo
} from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'cnt-engagement-details-dc',
  templateUrl: './engagement-details-dc.component.html',
  styleUrls: ['./engagement-details-dc.component.scss']
})
export class EngagementDetailsDcComponent extends WageDetailFormBase implements OnInit, OnChanges {
  /** Local variables. */
  engagementDetailsForm: FormGroup;
  wageDetailsForm: FormGroup;
  periodEditInProgress = false;

  descriptionContent;
  modalRef: BsModalRef;
  minDateGreg: Date;
  maxDateGreg: Date;
  currentDate: string;
  date = new Date();
  engagementStatus: string;
  applicableFrom: Date;
  currentEngagmentDetails: any;
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  selectedEngagement: EngagementDetails; //To store the changes without affecting original details.
  /** Constants */
  ENGAGEMENT_INACTIVE = ContributorConstants.ENGAGEMENT_INACTIVE_STATUS;
  ENGAGEMENT_ACTIVE = ContributorConstants.ENGAGEMENT_ACTIVE_STATUS;
  ENGAGEMENT_CANCELLED = ContributorConstants.ENGAGEMENT_CANCELLED_STATUS;
  CANCEL_IN_PROGRESS = ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS;
  addContractAccessRoles = [RoleIdEnum.CSR, RoleIdEnum.GCC_CSR];
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  tempPeriods: EngagementPeriod[] = []; //To store the value of changed engagement periods, to update if verification success

  /** Input  variables. */
  @Input() index: number;
  @Input() isOpenInitially: boolean;
  @Input() engagement: EngagementDetails;
  @Input() contributorData: Contributor;
  @Input() actionList: DropDownItems[];
  @Input() occupationLovList: LovList = new LovList([]);
  @Input() occupationList: OccupationList;
  @Input() yesOrNoList: LovList;
  @Input() establishment: Establishment;
  @Input() isUnifiedProfile: boolean;
  @Input() leavingReason: LovList;
  @Input() engagementType: string;
  @Input() lang: string;
  @Input() newEngagementDate: any;
  @Input() engagementLeavingReason: BilingualText = new BilingualText();
  @Input() engagementDetails: EngagementDetails;
  @Input() isWageSave: boolean;
  @Input() savedWageDetialsForm = null;
  @Input() systemParameter: SystemParameter;
  @Input() parentForm: FormGroup;
  @Input() isWageVerified: boolean;
  @Input() editMode: boolean;
  @Input() isSaudiPerson: boolean;
  @Input() contributor: Contributor;
  @Input() updatedEngagement: EngagementDetails;

  /** Output variables. */
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() save: EventEmitter<Object> = new EventEmitter();
  @Output() verify: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() saveWage: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() editInProgress: EventEmitter<boolean> = new EventEmitter();
  @Output() showError: EventEmitter<null> = new EventEmitter();

  isPeriodSplitted: boolean = false;
  documentUploadForm: FormGroup;

  /** Creates an instancce of EngagementAccordianViewDcComponent. */
  constructor(
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    private modalService: BsModalService,
    readonly activatedRoute: ActivatedRoute,
    readonly datePipe: DatePipe,
    public fb: FormBuilder,
    readonly alertService: AlertService
  ) {
    super(fb);
  }

  /** Method to initialize the commponent. */
  ngOnInit(): void {
    //console.log(this.engagement);
    //console.log(this.occupationList);
    //console.log(this.yesOrNoList);
    //console.log(this.systemParameter);
    //console.log(this.engagementDetails);

    if (this.newEngagementDate) {
      this.engagementDetailsForm.get('engagementDate').get('gregorian').patchValue(this.newEngagementDate);
      this.engagementDetailsForm.get('leavingReason').patchValue(this.engagementLeavingReason);
    } else if (this.engagementType === 'Modifywageandoccupation') {
      this.documentUploadForm = this.createCommentsForm();
    } else {
      this.engagementDetailsForm = this.createEngagementDetailsForm();
    }
    this.setEngagementStatus();

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      if (params)
        if (params.EngagementType == 'LeavingDate') {
          this.minDateGreg = new Date(params.joiningDate);
          this.maxDateGreg = new Date(params.leavingDate);
        } else if (params.EngagementType == 'Terminateengagement') {
          this.minDateGreg = new Date(params.joiningDate);
          this.maxDateGreg = new Date(this.currentDate);
        } else if (params.EngagementType == 'Modifywageandoccupation' && !this.isWageSave) {
          this.wageDetailsForm = super.createWageDetailsForm();
          const firstOfMonth = new Date(startOfMonth(this.firstDay));
          if (new Date(params.joiningDate) > firstOfMonth) {
            this.wageDetailsForm.get('startDate').get('gregorian').setValue(new Date(params.joiningDate));
          } else {
            this.wageDetailsForm.get('startDate').get('gregorian').setValue(firstOfMonth);
          }
        } else if (params.EngagementType == 'JoiningDate') {
          if (params.leavingDate) {
            this.minDateGreg = this.subtractMonths(new Date(params.joiningDate), 24);
            this.maxDateGreg = new Date(params.leavingDate);
          } else {
            this.minDateGreg = this.subtractMonths(new Date(params.joiningDate), 24);
            this.maxDateGreg = new Date(this.currentDate);
          }
        }
    });
  }

  getContributionSelection(contribution: any) {
    //console.log(contribution);
    //console.log(this.wageDetailsForm);
  }

  createCommentsForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false]
    });
  }

  /** Method to set edit in progree flag when period being edited. */
  handlePeriodEdit(flag: boolean) {
    this.periodEditInProgress = flag;
    this.disableOrEnableFields(flag);
    this.editInProgress.emit(this.periodEditInProgress);
  }
  /**Method to enable or disable fields */
  disableOrEnableFields(isDisable: boolean): void {
    //   if (isDisable) {
    //     //Store the fields that are enabled
    //     if (!this.disableJoiningDate) this.enabledFields.push(ChangeEngagementTransactionType.JOINING_DATE);
    //     if (!this.disableLeavingDate) this.enabledFields.push(ChangeEngagementTransactionType.LEAVING_DATE);
    //     if (!this.disableLeavingReason) this.enabledFields.push(ChangeEngagementTransactionType.LEAVING_REASON);
    //     if (!this.disableWorkType) this.enabledFields.push(ChangeEngagementTransactionType.WORK_TYPE);
    //     if (!this.disableEmployeeId) this.enabledFields.push(ChangeEngagementTransactionType.EMPLOYEE_ID);
    //     this.disableLeavingDate =
    //       this.disableLeavingReason =
    //       this.disableJoiningDate =
    //       this.disableWorkType =
    //       this.disableEmployeeId =
    //         isDisable;
    //   } else {
    //     this.enabledFields.forEach(key => {
    //       if (key === ChangeEngagementTransactionType.JOINING_DATE) this.disableJoiningDate = false;
    //       if (key === ChangeEngagementTransactionType.LEAVING_DATE) this.disableLeavingDate = false;
    //       if (key === ChangeEngagementTransactionType.LEAVING_REASON) this.disableLeavingReason = false;
    //       if (key === ChangeEngagementTransactionType.WORK_TYPE) this.disableWorkType = false;
    //       if (key === ChangeEngagementTransactionType.EMPLOYEE_ID) this.disableEmployeeId = false;
    //     });
    //     this.enabledFields = [];
    //   }
  }

  periodEdit(res) {
    this.periodEditInProgress = res;
  }

  calculateTotalWage() {
    super.calculateTotalWage(this.wageDetailsForm);
  }

  onBlur() {
    super.calculateTotalWage(this.wageDetailsForm);
  }

  /** Method for subtracting months to a date */
  subtractMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() - months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  /** Method to create Adjustment Details Form */
  createEngagementDetailsForm() {
    return this.fb.group({
      engagementDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      description: this.fb.group({
        english: [
          'I hereby acknowledge that all the information provided are correct and valid. I also acknowledge of the penalties provided by the GOSI laws for the incorrect and invalidity of the information given. In addition to the provided penalties in other schemes with which been approved under the Anti-Forgery Law for any proved fraudulent or false and acknowledged as true.'
        ],
        arabic: [
          'أقر وأتعهد بصحة المعلومات المقدمة، مقراً بعلمي بالعقوبات المنصوص عليها في نظام التأمينات الاجتماعية المترتبة على ثبوت عدم صحة هذه المعلومات، بالإضافة إلى العقوبات المنصوص عليها في الأنظمة الأخرى والتي من ضمنها ما تم إقراره بموجب نظام مكافحة التزوير لكل من اثبت وقائع أو أقوال كاذبة على أنها وقائع صحيحة ومعترف بها'
        ]
      }),
      checkBoxFlag: [null, { validators: Validators.requiredTrue }],
      leavingReason: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.engagementDetails = changes.engagementDetails.currentValue;
      this.setEngagementStatus();
      this.selectedEngagement = JSON.parse(JSON.stringify(this.engagementDetails));
    }
    if (changes.isWageVerified && changes.isWageVerified.currentValue) {
      if (this.isWageVerified === true) {
        this.periodEditInProgress = false;
        this.disableOrEnableFields(this.periodEditInProgress);
        this.selectedEngagement.engagementPeriod = this.tempPeriods;
        if (!this.editMode) this.isPeriodSplitted = this.checkPeriodSplit(); //In validator edit split are not discarded
      }
    }
    //If there is change in engagement details, use that value.
    if (changes.updatedEngagement && changes.updatedEngagement.currentValue) {
      this.selectedEngagement = JSON.parse(JSON.stringify(this.updatedEngagement));
      this.tempPeriods = [];
      this.updatedEngagement.engagementPeriod.forEach(period => {
        this.tempPeriods.push(JSON.parse(JSON.stringify(period)));
      });
      this.isPeriodSplitted = this.checkPeriodSplit(); //In case of validator edit/previous section
      if (this.engagement) {
        //To identify change in joining/leaving date in case of validator edit/previous section
      }
    }

    if (changes && changes.engagementType && changes.engagementType.currentValue) {
      this.engagementType = changes.engagementType.currentValue;
      this.engagementDetailsForm = this.createEngagementDetailsForm();
    }
    if (changes && changes.lang && changes.lang.currentValue) {
      this.lang = changes.lang.currentValue;
    }

    if (
      changes.currentEngagmentDetails &&
      changes.currentEngagmentDetails.currentValue &&
      this.currentEngagmentDetails.joiningDate
    ) {
      const firstOfMonth = new Date(startOfMonth(this.firstDay));
      if (new Date(this.currentEngagmentDetails.joiningDate.gregorian) > firstOfMonth) {
        this.applicableFrom = this.currentEngagmentDetails.joiningDate.gregorian;
      } else {
        this.applicableFrom = firstOfMonth;
      }
      if (this.wageDetailsForm) {
        //console.log(this.wageDetailsForm);
        this.patchWageDetailsForm();
      }
    }
    if (changes.savedWageDetialsForm && changes.savedWageDetialsForm.currentValue != null) {
      this.wageDetailsForm = changes.savedWageDetialsForm.currentValue;
      //console.log(this.wageDetailsForm);
    }
  }

  /** Method to check whether periods are splitted or not. */
  checkPeriodSplit() {
    let flag = false;
    this.selectedEngagement.engagementPeriod.forEach((period, index, array) => {
      if (!flag) {
        if (array[index + 1] && period.id === array[index + 1].id) flag = true;
      }
    });
    return flag;
  }

  patchWageDetailsForm() {
    if (this.currentEngagmentDetails) {
      this.wageDetailsForm.patchValue(this.currentEngagmentDetails.engagementPeriod[0]);
      this.currentEngagmentDetails.engagementPeriod[0].startDate.gregorian = new Date(this.applicableFrom);
      this.wageDetailsForm.get('startDate').patchValue(this.currentEngagmentDetails.engagementPeriod[0].startDate);
      this.wageDetailsForm.updateValueAndValidity();
      this.wageDetailsForm.markAsPristine();
    }
  }

  /**
   * Method to set engagement status.
   */
  setEngagementStatus() {
    if (
      this.engagementDetails?.status === 'LIVE' ||
      this.engagementDetails?.status === 'TERMINATION_IN_PROGRESS' ||
      this.engagementDetails?.status === 'CANCEL_IN_PROGRESS'
    ) {
      this.engagementStatus = 'Active';
    } else {
      this.engagementStatus = 'Inactive';
    }
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /** Method to save payment details. */
  saveAndNext() {
      this.isWageSave = true;

        //console.log(this.selectedEngagement);

        this.saveWage.emit(this.selectedEngagement);

  }

  /** Method to handle wage change in engagement period. */
  verifyWageChange(event) {
    const engagement: EngagementDetails = JSON.parse(JSON.stringify(this.selectedEngagement));
    this.tempPeriods = [];
    let updatedPeriod: EngagementPeriod = JSON.parse(JSON.stringify(event.updatedPeriod));
    let isFound = false;
    engagement?.engagementPeriod.forEach(period => {
      if (period.id === updatedPeriod.id) {
        if (!isFound) {
          isFound = true;
          event.periods.forEach(item => {
            if (moment(item.startDate.gregorian).isSame(updatedPeriod.startDate.gregorian)) {
              updatedPeriod = this.setWagePeriod(updatedPeriod);
              this.tempPeriods.push(updatedPeriod);
              engagement.updatedPeriod = updatedPeriod;
            } else this.tempPeriods.push(item);
          });
        }
      } else this.tempPeriods.push(period);
    });
    engagement.engagementPeriod = this.tempPeriods;
    this.verify.emit(engagement);
  }

  /** Method to set the changed period to existing period. */
  setWagePeriod(period: EngagementPeriod): EngagementPeriod {
    period.occupation = this.parentForm.get('updatedPeriod.occupation.english').value
      ? this.parentForm.get('updatedPeriod.occupation').value
      : undefined;
    // period.jobClassCode = this.parentForm.get('updatedPeriod.jobClassCode').value;
    period.jobClassName = this.parentForm.get('updatedPeriod.jobClassName').value;
    // period.jobRankCode = this.parentForm.get('updatedPeriod.jobRankCode').value;
    period.jobRankName = this.parentForm.get('updatedPeriod.jobRankName').value;
    // period.jobGradeCode = this.parentForm.get('updatedPeriod.jobGradeCode').value;
    period.jobGradeName = this.parentForm.get('updatedPeriod.jobGradeName').value;
    period.wage = (this.parentForm.get('updatedPeriod.wage') as FormGroup).getRawValue();
    period.contributorAbroad =
      this.parentForm.get('updatedPeriod.contributorAbroad.english').value === YesOrNo.YES ? true : false;
    period.wage.contributoryWage = 0;
    period.wageDetailsUpdated = true;
    return period;
  }

  /** Method to delete the splitted period. */
  deleteSplittedPeriod(startDate: Date) {
    this.selectedEngagement.engagementPeriod.forEach((item, index) => {
      if (moment(startDate).isSame(item.startDate.gregorian, 'day')) {
        if (item.endDate) {
          this.selectedEngagement.engagementPeriod[index + 1].endDate.gregorian = endOfMonth(item.endDate.gregorian);
          if (true) {
            this.selectedEngagement.engagementPeriod[index + 1].endDate.gregorian = item.endDate.gregorian;
            this.selectedEngagement.engagementPeriod[index + 1].endDate.hijiri = item.endDate.hijiri;
          }
        } else {
          this.selectedEngagement.engagementPeriod[index + 1].endDate = undefined;
        }
        this.selectedEngagement.engagementPeriod.splice(index, 1);
      }
    });
    this.selectedEngagement.engagementPeriod = [...this.selectedEngagement.engagementPeriod];
    this.isPeriodSplitted = this.checkPeriodSplit();
  }
}
