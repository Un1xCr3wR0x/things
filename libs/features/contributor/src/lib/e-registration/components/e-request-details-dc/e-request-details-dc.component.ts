/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, BaseComponent, bindToObject, GosiCalendar, LovList, markFormGroupTouched, monthDiff, scrollToTop, startOfDay, startOfMonth, subtractDays } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ContributorService, ContributorTypesEnum, EngagementDetails, EngagementPeriod, Establishment, PersonalInformation } from '../../../shared';
import { EEngagement } from '../../../shared/models/e-engagement';
import { EEngagementDetails } from '../../../shared/models/e-engagement-details';
import { EEngagementPeriod } from '../../../shared/models/e-engagement-period';
import { SystemParameter } from '../../../shared/models/system-parameter';
import { EEstablishmentDetailsDcComponent } from '../e-establishment-details-dc/e-establishment-details-dc.component';
import { EWageAddDcComponent } from '../e-wage-add-dc/e-wage-add-dc.component';
@Component({
  selector: 'cnt-e-request-details-dc',
  templateUrl: './e-request-details-dc.component.html',
  styleUrls: ['./e-request-details-dc.component.scss']
})



export class ERequestDetailsDcComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Variable declaration and initialization
   */
  modalRef: BsModalRef;

  joiningDate: Date;
  leavingDate: Date;
  leavingReason: string;
  minJoiningDate: Date;
  maxJoiningDate: Date;
  maxLeavingDate: Date;
  minLeavingDate: Date;

  disableLeavingDate = true;
  disableLeavingReason = false;

  employeeIdMaxLength: number;
  contributorTypes = ContributorTypesEnum;

  maxWageAddDate: Date = new Date();
  minDateWageAdd: Date;

  currentAge: number;
  disableWageAddSection = true;
  isWageAdditionOn = false;
  isPeriodEditOn = false;

  engagementDetailsForm: FormGroup;
  engagementWageDetails: EEngagementPeriod[] = [];
  estaDetails: Establishment;
  eEngDetails: EEngagementDetails = new EEngagementDetails();
  eWageDetails: EEngagementPeriod[] = [];
  Enddate: GosiCalendar = new GosiCalendar(); // for e-inscp regular case

  //-----Wage-Period-Variables
  contributorAbroadStatus: boolean;
  isWageInfoVisible: boolean;
  disableJoining = true;
  disableAddition:boolean;
  diff:number;
  onwards:boolean;
  /**
   * Input variables
   */
  // @Input() workTypeList$: Observable<LovList>;
  @Input() occupationList: LovList;
  @Input() engDetails: EEngagement = new EEngagement();
  // @Input() contributorAbroad$: Observable<LovList>;
  // @Input() contributorType: string;
  // @Input() isGccEstablishment: boolean;
  @Input() systemParams: SystemParameter;
  @Input() engagementDetails: EngagementDetails;
  @Input() establishmentDetails: Establishment;
  @Input() leavingReasonList: LovList;
  @Input() inEditMode: boolean;
  @Input() penaltyIndicator: boolean = false;
  @Input() backdatedContributor: boolean;
  @Input() isDocumentsRequired: boolean;
  @Input() isPrivate: boolean;
  @Input() person: PersonalInformation;
  @Input() isBeneficiary: boolean;
  @Input() isSubmit: boolean;
  @Input() isContractRequired: boolean;
  @Input() isApiTriggered: boolean;
  @Input() checkLegal:boolean;
  @Input() registered:boolean;

  /**
   * Output event emitters
   */
  @Output() checkDocRequired: EventEmitter<Object> = new EventEmitter();
  @Output() save: EventEmitter<object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  /**
   * Template & directive references
   */
  @ViewChild(EWageAddDcComponent, { static: false })
  eWageAddDcComponent: EWageAddDcComponent;
  @ViewChild(EEstablishmentDetailsDcComponent, { static: false })
  eEstablishmentDetailsDcComponent: EEstablishmentDetailsDcComponent;

  /**
   * Method to initialize values on class instantiation
   * @param fb
   */
  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly contributorService: ContributorService
    ) {
    super();
  }

  /**
   * Method to handle all initial tasks on component load
   */
  ngOnInit() {
    //console.log(this.inEditMode);   
    this.engagementDetailsForm = this.createEngagementDetailsForm();
    this.manageDeclaration(!this.isDocumentsRequired);
    if (this.inEditMode) {
      this.setPenaltyIndicator(this.penaltyIndicator);
    }
  }

  /**
   * Method to emit joining date change
   * @param data
   */
  checkDocumentsRequired(data: Object) {
    this.checkDocRequired.emit(data);
  }

  /**Method to handle tasks after child views are created */
  ngAfterViewInit(): void {
    // if (this.inEditMode && this.engDetails?.engagementRequestDto.engagementPeriod.length > 0 && this.eWageAddDcComponent) {
    //   this.engagementWageDetails = this.engDetails.engagementRequestDto.engagementPeriod;
    //   this.eWageAddDcComponent.isEngagementWageAddFormVisible = false;
    //   // this.engagementWageDetails = this.engagementDetails.engagementPeriod;
    //   this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
    //   this.handleWagePeriodChange(this.engagementWageDetails[0].startDate.gregorian);
    // }
  }

  /**Method to detect Input variable changes */
  ngOnChanges(changes: SimpleChanges) {
    // if (changes.isDocumentsRequired) {
    //   this.manageDeclaration(!this.isDocumentsRequired);
    // }
    if (changes.engDetails && changes.engDetails.currentValue){
      if(this.inEditMode && this.engDetails?.engagementRequestDto.engagementPeriod.length > 0){
        this.eEngDetails = this.engDetails.engagementRequestDto;
        this.engagementWageDetails = this.engDetails.engagementRequestDto.engagementPeriod;
        // this.setPenaltyIndicator(this.penaltyIndicator);
        this.eWageAddDcComponent.isEngagementWageAddFormVisible = false;
        this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
        this.handleWagePeriodChange(this.engagementWageDetails[0].startDate.gregorian);
      }
    }
  }
  /**Method to set penaly indicator */
  setPenaltyIndicator(penaltyIndicator: boolean): void {
    this.engagementDetailsForm.get('penaltyIndicator').setValue(penaltyIndicator, { emitEvent: false });
  }

  /**
   * Method to set joining date
   * @param newJoiningDate
   */
  setJoiningDate(newJoiningDate: Date): void {
    if (newJoiningDate) {
      this.joiningDate = startOfDay(new Date(newJoiningDate));
    } else {
      this.joiningDate = null;
    }
  }
  /**
   * Method to set leaving date
   * @param date
   */
  setLeavingDate(date: Date): void {
    if (date) {
      this.leavingDate = startOfDay(new Date(date));
    } else {
      this.leavingDate = null;
    }
  }

  /**
   * Method to add or remove validations for declarations checkbox
   * @param isRequired
   */
  manageDeclaration(isRequired: boolean) {
    if (this.engagementDetailsForm) {
      if (isRequired) {
        this.engagementDetailsForm.get('checkBoxFlag').setValidators(Validators.requiredTrue);
      } else {
        this.engagementDetailsForm.get('checkBoxFlag').clearValidators();
      }
      this.engagementDetailsForm.get('checkBoxFlag').updateValueAndValidity({ emitEvent: false });
    }
  }

  /**
   * Method to create engagement details form
   */
  createEngagementDetailsForm(): FormGroup {
    return this.fb.group({
      // checkBoxFlag: [, { validators: Validators.requiredTrue }],
      penaltyIndicator: [false]
    });
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

  /**Method to show alert error */
  showAlertError(key: string): void {
    this.showError.emit(key);
  }

  /**Method to emit previous button action */
  navigateTopreviousTab() {
    this.previous.emit();
  }

  /**
   * This method is used to show given template
   * @param template
   */
  showTemplate(template: TemplateRef<HTMLElement>): void {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * This method is used to confirm cancellation of transaction
   * @param changes
   * @memberof EmploymentDetailsDcComponent
   */
  confirmCancel(): void {
    this.reset.emit();
    this.decline();
  }
  /**Method to hide modal */
  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Method to save engagement Details
   */
  saveEngagementDetails() {
    markFormGroupTouched(this.eWageAddDcComponent.engagementWageAddForm);
    markFormGroupTouched(this.engagementDetailsForm);
    let isPreviousEdit = false;
    this.engagementWageDetails.forEach(element => {
      if (element.canEdit === true) {
        isPreviousEdit = true;
      }
    });
    if (isPreviousEdit) {
      this.showError.emit('CONTRIBUTOR.ERR_PREVIOUS_EDIT');
    } else if (this.eWageAddDcComponent.isEngagementWageAddFormVisible && this.joiningDate) {
      this.showError.emit('CONTRIBUTOR.ERR-ADD-ENGAGEMENT-PERIOD');
    } else if (this.engagementDetailsForm.invalid) {
      //console.log('mannn ', this.engagementDetailsForm);
      this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
    } else {
      //console.log('mannn ', this.engagementDetailsForm);

      this.engagementDetailsForm
        .get('periodForm.penaltyIndicator')
        .setValue(this.engagementDetailsForm.get('penaltyIndicator').value);
      const engagement = (this.engagementDetailsForm.get('periodForm') as FormGroup).getRawValue();
      this.estaDetails = this.eEstablishmentDetailsDcComponent.onSave();
      //console.log('mannn2 ', this.engagementDetailsForm);
      this.save.emit({
        engagementDetails: engagement,
        wageDetails: [...this.engagementWageDetails]
      });
    }
  }

  /** Method to alert details if present */
  showAlertDetails(err): void {
    this.isApiTriggered = false;
    if (err.error?.details?.length > 0) this.alertService.showError(null, err.error.details);
    else this.onshowError(err);
  }

  onshowError(error) {
    this.isApiTriggered = false;
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }
  
  /**Method to reset all added wages */
  resetEngagementWages(): void {
    this.setWageValidation();
    this.engagementWageDetails = [];
    this.eWageAddDcComponent.resetWageEntryForm();
    this.eWageAddDcComponent.isEngagementWageAddFormVisible = true;
    this.eWageAddDcComponent.engagementWageAddForm
      .get('startDate.gregorian')
      .patchValue(startOfDay(this.joiningDate), { emitEvent: false });
    this.eWageAddDcComponent.engagementWageAddForm
      .get('endDate.gregorian')
      .patchValue(startOfDay(this.leavingDate), { emitEvent: false });
  }
  //--------------------------------Engagement Wage Add Methods---------------------

  /**Method to update end date for last period based on start date of new period */
  updateEndDateForLastPeriod(selectedStartDate) {
    if (selectedStartDate !== null && this.systemParams) {
      if (this.engagementWageDetails.length > 1) {
        this.engagementWageDetails[0].endDate.gregorian = moment(selectedStartDate)
          .subtract(1, 'months')
          .endOf('month')
          .toDate();
      } else if (this.engagementWageDetails.length === 1 && this.engagementWageDetails[0].endDate) {
        this.engagementWageDetails[0].endDate.gregorian = moment(selectedStartDate)
          .subtract(1, 'months')
          .endOf('month')
          .toDate();
      }
      else if(this.engagementWageDetails.length === 1 && !(this.engagementWageDetails[0].endDate)){
         this.engagementWageDetails[0].endDate=this.Enddate;
         this.engagementWageDetails[0].endDate.gregorian = moment(selectedStartDate)
          .subtract(1, 'months')
          .endOf('month')
          .toDate();
      }
    }
  }

  /**Method to set max and min for wage period addition */
  setWageValidation(minDate?: Date): void {
    if (minDate) {
      this.minDateWageAdd = moment(minDate).startOf('month').clone().add(1, 'months').toDate();
    } else if (this.joiningDate) {
      this.minDateWageAdd = subtractDays(this.joiningDate, 1);
    }
    if (this.leavingDate) {
      this.maxWageAddDate = this.leavingDate ? moment(this.leavingDate).endOf('month').toDate() : new Date();
    }
  }

  /**
   * This method is to modify the wage period end date depending on the leaving date of contributor
   */
  setWagePeriodEndDate() {
    if (this.engagementWageDetails && this.engagementWageDetails.length > 0) {
      this.engagementWageDetails[0].endDate.gregorian = this.leavingDate;
      this.setWageInfo(this.engagementWageDetails[0].startDate.gregorian); //checking for add additional period
    }
    if (this.leavingDate) {
      this.eWageAddDcComponent.engagementWageAddForm
        .get('endDate.gregorian')
        .patchValue(startOfDay(this.leavingDate), { emitEvent: false });
    } else {
      this.eWageAddDcComponent.engagementWageAddForm.get('endDate.gregorian').reset();
    }
  }

  /**
   * Method to set validations and add new period button
   * @param date
   */
  handleWagePeriodChange(date: Date): void {
    this.setWageInfo(date);
    this.setWageValidation(date);
  }

  /**
   * Method to check if wage info is required or not based on wage start date
   * @param startDate
   */
  setWageInfo(startDate: Date) {
    if (this.leavingDate) {
      this.isWageInfoVisible = !moment(this.leavingDate, 'month').isSame(startDate, 'month');
    } else {
      this.isWageInfoVisible = !moment(new Date(), 'month').isSame(startDate, 'month');
    }
  }

  /**
   * Method to add wage period on click of (save wage & occupation button) from child component (engagement-wage-add)
   */
  addWagePeriod(wage) {
    wage.canEdit = false;
    this.disableJoining = false;
    wage.contributorAbroad = this.contributorAbroadStatus;
    wage = bindToObject(new EEngagementPeriod(), wage);
    this.updateEndDateForLastPeriod(wage.startDate.gregorian);
    this.engagementWageDetails.push(wage);
    this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
    this.engagementWageDetails[0].endDate.gregorian = this.leavingDate ? new Date(this.leavingDate) : null;
    this.handleWagePeriodChange(wage.startDate.gregorian);
    this.isWageAdditionOn = false;
  }
  /**Method to end date on cancel of wage addition */
  cancelAddWagePeriod() {
    this.setWageInfo(this.engagementWageDetails[0].startDate.gregorian);
    this.isWageAdditionOn = false;
  }

  /**
   * Method to show engagement wage add form for adding additional wage period on clicking (add additional period button)
   */
  addAdditionalPeriod() {
    this.eWageAddDcComponent.engagementWageAddForm = this.eWageAddDcComponent.createWageDetailsForm();
    this.eWageAddDcComponent.isEngagementWageAddFormVisible = true;
    this.isWageAdditionOn = true;
  }

  /**Method to delete wage period */
  removeWagePeriod(index: number): void {
    if (this.engagementWageDetails.length === 1) {
      this.eWageAddDcComponent.isEngagementWageAddFormVisible = true;
      this.isWageInfoVisible = false;
      const joiningDateFormat = startOfDay(this.joiningDate);
      this.eWageAddDcComponent.resetWageEntryForm();
      this.eWageAddDcComponent.engagementWageAddForm.get('startDate.gregorian').patchValue(joiningDateFormat);
    } else {
      this.engagementWageDetails[1].endDate = this.engagementWageDetails[0].endDate;
    }
    this.engagementWageDetails.splice(index, 1);
    this.handleWagePeriodChange(this.engagementWageDetails[0].startDate.gregorian);
  }
}
