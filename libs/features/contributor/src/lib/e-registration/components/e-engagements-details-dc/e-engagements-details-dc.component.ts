import { Component, OnInit ,OnChanges, SimpleChanges,Input, TemplateRef, ViewChild, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovList, startOfDay, minDateValidator, maxDateValidator, monthDiff, startOfMonth, endOfMonth, subtractMonths, BaseComponent } from '@gosi-ui/core';
import { checkWageAddSection, ContributorConstants, ContributorTypesEnum, createEngagementForm, EngagementDetails, EngagementPeriod, getPeriodParam, MaxLengthEnum, PersonalInformation, SystemParameter } from '../../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import moment from 'moment-timezone';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { EEngagementPeriod } from '../../../shared/models/e-engagement-period';
import { EEngagementDetails } from '../../../shared/models/e-engagement-details';
import { EEngagement } from '../../../shared/models/e-engagement';



@Component({
  selector: 'cnt-e-engagements-details-dc',
  templateUrl: './e-engagements-details-dc.component.html',
  styleUrls: ['./e-engagements-details-dc.component.scss']
})
export class EEngagementsDetailsDcComponent extends BaseComponent implements OnInit, OnChanges {
  /**Input variables */
  @Input() workTypeList: LovList;
  @Input() leavingReasonList: LovList;
  @Input() contributorAbroad: LovList;
  @Input() contributorType: string;
  @Input() systemParams: SystemParameter;
  @Input() engagementDetails: EngagementDetails;
  @Input() engagementDetailsForm: FormGroup;
  @Input() inEditMode: boolean = false;
  @Input() backdatedContributor: boolean;
  @Input() isPrivate: boolean;
  @Input() engagementWageDetails: EngagementPeriod[] = [];
  @Input() eEngDetails: EEngagementDetails;
  @Input() eWageDetails: EEngagementPeriod[] = [];
  @Input() person: PersonalInformation;
  @Input() isGccEstablishment: boolean;
  @Input() isBeneficiary: boolean;
  @Input() joiningDate: Date;
  @Input() leavingDate: Date;
  @Input() disableWageAddSection: boolean;
  @Input() isContractRequired: boolean;
  @Input() checkLegal:boolean;
  @Input() engDetails: EEngagement = new EEngagement();
  /** Output event emitters */
  @Output() joiningDateChange: EventEmitter<Date> = new EventEmitter();
  @Output() leavingDateChange: EventEmitter<Date> = new EventEmitter();
  @Output() resetEngagementWages: EventEmitter<null> = new EventEmitter();
  @Output() disableWageAddSectionChange: EventEmitter<boolean> = new EventEmitter();
  @Output() setWageValidation: EventEmitter<null> = new EventEmitter();
  @Output() setWagePeriodEndDate: EventEmitter<null> = new EventEmitter();
  @Output() checkDocRequired: EventEmitter<Object> = new EventEmitter();
  /**Local variables */
  contributorTypes = ContributorTypesEnum;
  employeeIdMaxLength = MaxLengthEnum.EMPLOYEE_ID;
  modalRef: BsModalRef;
  leavingReason: string;
  minJoiningDate: Date;
  maxJoiningDate: Date;
  maxLeavingDate: Date;
  minLeavingDate: Date;
  disableLeavingDate = true;
  disableLeavingReason = false;
  periodDetailForm: FormGroup;
  /**Child components */
  @ViewChild('changeJoiningDateTemplate', { static: true })
  changeJoiningDateTemplate: TemplateRef<HTMLElement>;
  @ViewChild('changeLeavingDateTemplate', { static: true })
  changeLeavingDateTemplate: TemplateRef<HTMLElement>;
  @ViewChild('changeLeavingReasonTemplate', { static: true })
  changeLeavingReasonTemplate: TemplateRef<HTMLElement>;
  @ViewChild('contractRemovingTemplate', { static: true })
  contractRemovingTemplate: TemplateRef<HTMLElement>;
  @ViewChild('contractRemovingTemplate1', { static: true })
  contractRemovingTemplate1: TemplateRef<HTMLElement>;

  /**Creates an instance of CancelVicDetailsDcComponent. */
  constructor(private fb: FormBuilder,private modalService: BsModalService
    ) {
    super();
    }


  ngOnInit(): void {
    this.periodDetailForm = this.CreateDetailsForm(this.fb, this.deathDate ? false : true, this.deathDate ? true : false);
    this.engagementDetailsForm.addControl('periodForm', this.periodDetailForm);
    if (this.periodDetailForm && this.inEditMode) this.bindDataToForm();
    this.eEngDetails.isContributorActive = true;
    if(!this.inEditMode || (this.inEditMode && this.eEngDetails?.isActive))
       this.removeLeavingValidation();
    this.setLeavingDateValidation(this.joiningDate);
    this.setJoiningDateValidation();
    this.checkWageAdditionSection();
    this.periodDetailForm.updateValueAndValidity({ emitEvent: false });
    this.detectChanges();

  }

  CreateDetailsForm = function (
    fb: FormBuilder,
    isContributorActive = true,
    isActive =true,
    disableActive=false,
    disableContributorActive = false,
    isContractActive = true,
    disableContractActive = false
  ) {
    return fb.group({
      joiningDate: fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: ['']
      }),
      leavingDate: fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: ['']
      }),
      leavingReason: fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: ['']
      }),

      formSubmissionDate: fb.group({
        gregorian: [null],
        hijiri: ['']
      }),
      companyWorkerNumber: [null, { updateOn: 'blur' }],
      isContributorActive: { value: isContributorActive, disabled: disableContributorActive },
      isActive: { value: isActive, disabled: disableActive },
      isContractActive: { value: isContractActive, disabled: disableContractActive },

      contributorAbroad: this.fb.group({
        english: ['No', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      penaltyIndicator: [false]
    });
  }

  /** Method to detectchanges in input. */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.systemParams && changes.systemParams.currentValue) {
      this.setJoiningDateValidation();
    }
    if(changes.eEngDetails && changes.eEngDetails.currentValue){
      if(this.periodDetailForm && this.inEditMode) {
        this.bindDataToForm();
      }
    }
  }

  /**Getters for form control */
  private get leavingDateFormControl(): FormControl {
    return this.periodDetailForm.get('leavingDate.gregorian') as FormControl;
  }
  private get leavingReasonFormControl(): FormControl {
    return this.periodDetailForm.get('leavingReason.english') as FormControl;
  }
  private get joiningDateFormControl(): FormControl {
    return this.periodDetailForm.get('joiningDate.gregorian') as FormControl;
  }
  private get ContributorActiveFormControl(): FormControl {
    return this.periodDetailForm.get('isContributorActive') as FormControl;
  }
  private get deathDate(): Date {
    return this.person?.deathDate?.gregorian ? this.person.deathDate.gregorian : null;
  }
  private get birthDate(): Date {
    return this.person?.birthDate?.gregorian ? this.person.birthDate.gregorian : null;
  }


  /**Method to bind data to form */
  bindDataToForm(): void {
    Object.keys(this.eEngDetails).forEach(name => {
      if (this.periodDetailForm.get(name)) {
        if (name === 'joiningDate') {
          const date = new Date(this.eEngDetails[name]['gregorian']);
          this.setJoiningDate(date, false);
          // this.setJoiningDateValidation();
          this.joiningDateFormControl.setValue(date, { emitEvent: false });
          this.joiningDateFormControl.updateValueAndValidity({ emitEvent: false });
        } else if (name === 'leavingDate' && this.eEngDetails.leavingDate) {
          if (this.eEngDetails[name]['gregorian']) {
            const date = new Date(this.eEngDetails[name]['gregorian']);
            this.setLeavingDate(date);
            this.leavingDateFormControl.setValue(date, { emitEvent: false });
            this.leavingDateFormControl.updateValueAndValidity({ emitEvent: false });
          }
        }
        else if (name === 'leavingReason') {
          if (this.eEngDetails.leavingReason) {
            this.leavingReason = this.eEngDetails.leavingReason.english;
            this.leavingReasonFormControl.setValue(this.leavingReason, { emitEvent: false });
          } }
         else if (name === 'isActive') {
          this.ContributorActiveFormControl.setValue(this.eEngDetails.isActive);
          this.ContributorActiveFormControl.disable();
          if (this.eEngDetails.isActive) {
            this.removeLeavingValidation();
          } else {
            this.setLeavingDateValidation(this.joiningDate);
          }
         }
        //  else if (name !== 'penaltyIndicator' && name !== null && name)
        //   this.periodDetailForm.get(name).patchValue(this.eEngDetails[name]);
      }
    });
    if (this.eEngDetails.engagementPeriod?.length > 0 && this.periodDetailForm) {
      const contributorAbroad = this.periodDetailForm.get('contributorAbroad.english');
      if (
        this.eEngDetails.engagementPeriod.length > 0 &&
        this.eEngDetails.engagementPeriod[0].contributorAbroad
      )
        contributorAbroad.setValue('Yes');
      else contributorAbroad.setValue('No');
    }
  }

  /**Method to check wage addition change */
  checkWageAdditionSection(): void {
    this.disableWageAddSection = checkWageAddSection(this.periodDetailForm);
    this.disableWageAddSectionChange.emit(this.disableWageAddSection);
  }
  detectChanges(): void {
    this.joiningDateFormControl.valueChanges
      .pipe(
        tap(() => this.checkWageAdditionSection()),
        filter(() => this.joiningDateFormControl.valid),
        distinctUntilChanged()
      )
      .subscribe(() => this.onJoiningDateChange());
    this.leavingDateFormControl.valueChanges
      .pipe(
        tap(() => this.checkWageAdditionSection()),
        filter(() => !this.leavingDateFormControl.invalid),
        distinctUntilChanged()
      )
      .subscribe(() => this.onLeavingDateChange());
  }
   /**Method to trigger or clear on joining date selection  */
   onJoiningDateChange(): void {
    const val = this.joiningDateFormControl.value; //show confirmation popup when joining date is changed in edit mode
    if (this.joiningDateFormControl.valid && !moment(val).isSame(this.joiningDate)) {
      if (this.engagementWageDetails.length > 0) this.showTemplate(this.changeJoiningDateTemplate);
      else {
        this.setJoiningDate(startOfDay(val));
        this.setWageValidation.emit();
        this.resetLeavingDateAndReason(this.eEngDetails?.leavingReason?.english);
        this.setLeavingDateValidation(startOfDay(val));
      }
    }
  }
  /**Method to trigger or clear on leaving date selection  */
  onLeavingDateChange(): void {
    const val = this.leavingDateFormControl.value; //show confirmation popup when joining date is changed in edit mode
    if (this.leavingDateFormControl.valid && val && !moment(val).isSame(this.leavingDate)) {
      if (this.engagementWageDetails.length > 0) this.showTemplate(this.changeLeavingDateTemplate);
      else {
        this.setLeavingDate(startOfDay(val));
        this.setWageValidation.emit();
        this.setWagePeriodEndDate.emit();
      }
    }
  }
  /** Method to trigger or clear on leaving reason selection*/
  onLeavingReasonChange(): void {
    const val = this.leavingReasonFormControl.value; //show confirmation popup when joining date is changed in edit mode
    if (this.leavingReasonFormControl.valid && val && val !== this.leavingReason) {
      if (this.engagementWageDetails.length > 0) this.showTemplate(this.changeLeavingReasonTemplate);
      else this.setLeavingDateForDead(val);
    }
    this.checkWageAdditionSection();
  }




    /**Method to set joining date max and min date validation based on death date , form submission date */
    setJoiningDateValidation(): void {
      if (this.systemParams && this.periodDetailForm) {
        let minDate: Date;
        let maxDate: Date;
        let monthDifference: number;
        if (this.inEditMode) {
          if (this.deathDate) {
            maxDate = moment(this.engDetails.formSubmissionDate?.gregorian).isBefore(this.deathDate)
              ? this.engDetails.formSubmissionDate?.gregorian
              : this.deathDate;
            minDate = startOfMonth(subtractMonths(moment().toDate(), 24))
          }
          else if (this.eEngDetails.leavingDate?.gregorian) {
            monthDifference = monthDiff(
              startOfMonth(this.eEngDetails.joiningDate.gregorian),
              startOfMonth(moment().toDate())
            );
            if (
              monthDifference > 1
            ) {
              minDate = startOfMonth(subtractMonths(moment().toDate(), 24))
              maxDate = moment(this.eEngDetails.leavingDate.gregorian).toDate();
            } else if (monthDifference <= 1) {
              minDate = startOfMonth(subtractMonths(moment().toDate(), 24))
              maxDate = moment().toDate();
            }
          } else {
            minDate = startOfMonth(subtractMonths(new Date(), 24));
            maxDate = moment().toDate();
          }
            // if (
            //   monthDifference === 1 &&
            //   this.eEngDetails.leavingReason.english === ContributorConstants.LEAVING_REASON_BACKDATED
            // )
            //   minDate = moment(startOfMonth(this.engDetails.formSubmissionDate?.gregorian))
            //     .subtract(1, 'month')
            //     .toDate();
            // if (
            //   monthDifference > 1 &&
            //   this.eEngDetails.leavingReason.english === ContributorConstants.LEAVING_REASON_BACKDATED
            // )
            //   maxDate = endOfMonth(subtractMonths(this.engDetails.formSubmissionDate?.gregorian, 2));
            // else
            //   maxDate =
            //     this.eEngDetails.leavingReason.english === ContributorConstants.LEAVING_REASON_BACKDATED
            //       ? this.eEngDetails.leavingDate.gregorian
            //       : this.engDetails.formSubmissionDate?.gregorian;
          // } 
          // else {
          //   maxDate = this.backdatedContributor
          //     ? moment(this.engDetails.formSubmissionDate.gregorian)
          //         .subtract(Number(getPeriodParam(this.isPrivate, true, this.systemParams)) + 1, 'month')
          //         .endOf('month')
          //         .toDate()
          //     : this.engDetails.formSubmissionDate.gregorian;
          // }
          // if (monthDifference !== 1) {
          //   minDate = moment(this.engDetails.formSubmissionDate.gregorian)
          //     .subtract(
          //       (monthDiff(
          //         startOfMonth(this.eEngDetails.joiningDate.gregorian),
          //         startOfMonth(moment().toDate())
          //       ) > 2)
          //         ? Number(getPeriodParam(this.isPrivate, false, this.systemParams))
          //         : Number(getPeriodParam(this.isPrivate, true, this.systemParams)),
          //       'month'
          //     )
          //     .startOf('month')
          //     .toDate();
          // }
        } else {
          maxDate = this.deathDate ? this.deathDate : moment().toDate();
          // if (this.contributorType === ContributorTypesEnum.SAUDI)
          // minDate = this.systemParams.REG_CONT_MAX_BACKDATED_JOINING_DATE;
          minDate = startOfMonth(subtractMonths(new Date(), 24));
          // else minDate = this.systemParams.REG_CONT_MAX_REGULAR_JOINING_DATE;

        }
        this.minJoiningDate = new Date(startOfDay(minDate));
        this.maxJoiningDate = new Date(startOfDay(maxDate));
        this.joiningDateFormControl.setValidators([
          Validators.required,
          minDateValidator(this.minJoiningDate),
          maxDateValidator(this.maxJoiningDate)
        ]);
        this.joiningDateFormControl.updateValueAndValidity({ emitEvent: false });
      }
    }

  /** Method to set leaving date*/
  setLeavingDate(date: Date): void {
    if (date) this.leavingDate = startOfDay(new Date(date));
    else this.leavingDate = null;
    this.leavingDateChange.emit(this.leavingDate);
  }

  /** This method is to clear leaving date and reson form validation when the isContributorActive toggle is true   */
  removeLeavingValidation(): void {
    if (this.periodDetailForm) {
      if (this.leavingDateFormControl) this.leavingDateFormControl.clearValidators();
      if (this.leavingReasonFormControl) this.leavingReasonFormControl.clearValidators();
      this.resetLeavingDateAndReason(this.eEngDetails?.leavingReason?.english);
    }
  }

  setLeavingDateForDead(value: string): void {
    this.leavingReason = value;
    if (ContributorConstants.DEAD_LEAVING_REASONS.indexOf(value) !== -1 && this.deathDate) {
      this.leavingDateFormControl.setValue(new Date(this.deathDate), { emitEvent: false });
      this.setLeavingDate(this.deathDate);
      this.disableLeavingDate = true;
    } else if (this.joiningDate) this.disableLeavingDate = false;
  }


  /** This method is to reset leaving leaving reason and leaving date   */
  resetLeavingDateAndReason(leavingReason: string): void {
    if (!(this.inEditMode && leavingReason === ContributorConstants.LEAVING_REASON_BACKDATED)) {
      this.setLeavingDate(null);
      this.leavingReason = null;
      this.leavingDateFormControl.reset();
      this.periodDetailForm.get('leavingReason').reset();
    }
  }

  /** This method is called when confirm joining date change in edit mode popup is confirmed.   */
  confirmJoiningDateChange(joiningDate): void {
    this.resetLeavingDateAndReason(this.eEngDetails?.leavingReason?.english);
    this.setJoiningDate(joiningDate);
    this.setLeavingDateValidation(this.joiningDate);
    this.resetEngagementWages.emit();
    this.checkWageAdditionSection();
    this.modalRef.hide();
  }
  /** Method to cancel joining date change. */
  cancelJoiningDateChange(): void {
    this.modalRef.hide(); //to set joining date selected after popup confirmation
    this.joiningDateFormControl.setValue(startOfDay(this.joiningDate), { emitEvent: false });
  }




  /** Method to show template. */
  showTemplate(template: TemplateRef<HTMLElement>): void {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }


/** Method to decline modal. */
    decline(): void {
      this.modalRef.hide();
    }

  /** Method to set contributor active status. */
  setContributorActive(): void {
    this.ContributorActiveFormControl.setValue(true);
    this.checkWageAdditionSection();
    this.decline();
  }

   /** This method is to set leaving date as death date depeding leaving reason */
   contributorActiveChange(isContributorActive: boolean): void {
    if (this.modalRef) this.decline();
    if (isContributorActive) {
      if (this.periodDetailForm) this.removeLeavingValidation();
    } else {
      this.setLeavingDateValidation(this.joiningDate);
    }
    this.setWagePeriodEndDate.emit();
    this.checkDocRequired.emit({ joiningDate: this.joiningDate, isConActive: isContributorActive });
    this.checkWageAdditionSection();
  }


    /**Method tp enable or disable leaving input */
    enableLeavingDate(): void {
      if (
        this.inEditMode &&
        this.eEngDetails.leavingReason?.english === ContributorConstants.LEAVING_REASON_BACKDATED
      ) {
        this.disableLeavingDate = this.disableLeavingReason = true;
      } else if (
        this.leavingReasonFormControl &&
        ContributorConstants.DEAD_LEAVING_REASONS.indexOf(this.leavingReasonFormControl.value) !== -1 &&
        this.deathDate
      )
        this.disableLeavingDate = true;
      else this.disableLeavingDate = this.joiningDate ? false : true;
    }

  /** Method to set max and min leaving date validation based on death date, form submission */
  setLeavingDateValidation(minDate: Date, maxDate?: Date): void {
    if (this.periodDetailForm) {
      if (!this.ContributorActiveFormControl.value) {
        minDate = minDate ? startOfDay(new Date(minDate)) : null;
        maxDate = maxDate ? startOfDay(new Date(maxDate)) : null;
        if (minDate) minDate = moment(minDate).toDate();
        if (this.inEditMode) {
          if (this.deathDate) {
            maxDate = moment(this.engDetails.formSubmissionDate.gregorian).isBefore(this.deathDate)
              ? new Date(this.engDetails.formSubmissionDate.gregorian)
              : new Date(this.deathDate);
          } else if (this.eEngDetails.leavingDate?.gregorian) {
            maxDate =
              this.eEngDetails.leavingReason?.english === ContributorConstants.LEAVING_REASON_BACKDATED
                ? this.eEngDetails.leavingDate.gregorian
                : this.engDetails.formSubmissionDate.gregorian;
          } else {
            maxDate = this.backdatedContributor
              ? moment(this.engDetails.formSubmissionDate.gregorian)
                  .subtract(Number(getPeriodParam(this.isPrivate, true, this.systemParams)) + 1, 'month')
                  .endOf('month')
                  .toDate()
              : new Date(this.engDetails.formSubmissionDate.gregorian);
          }
        } else maxDate = this.deathDate ? this.deathDate : moment().toDate();
        this.minLeavingDate = new Date(startOfDay(minDate));
        this.maxLeavingDate = new Date(startOfDay(maxDate));
        this.leavingReasonFormControl.setValidators([Validators.required]);
        this.leavingDateFormControl.setValidators([
          Validators.required,
          minDateValidator(this.minLeavingDate),
          maxDateValidator(this.maxLeavingDate)
        ]);
      } else {
        this.leavingDateFormControl.clearValidators();
        this.leavingReasonFormControl.clearValidators();
      }
      this.enableLeavingDate();
      this.leavingDateFormControl.updateValueAndValidity({ emitEvent: false });
      this.leavingReasonFormControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  /** Method to set joining date*/
  setJoiningDate(newJoiningDate: Date, checkRequired = true): void {
    if (newJoiningDate) this.joiningDate = startOfDay(new Date(newJoiningDate));
    else this.joiningDate = null;
    this.joiningDateChange.emit(this.joiningDate);
    // if (checkRequired)
    //   this.checkDocRequired.emit({
    //     joiningDate: this.joiningDate,
    //   });
  }


  /** Method to handle active contributor switch change. */
  onContributorActiveChange(isContributorActive: boolean): void {
     this.contributorActiveChange(isContributorActive);
  }
  /** This method is called when confirm joining date change in edit mode popup is confirmed.   */
  confirmLeavingDateChange(leavingDate): void {
    this.setLeavingDate(startOfDay(new Date(leavingDate)));
    this.leavingReason = null;
    this.periodDetailForm.get('leavingReason').reset();
    this.resetEngagementWages.emit();
    this.checkWageAdditionSection();
    this.modalRef.hide();
  }
  /** This method is called when confirm joining date change in edit mode popup is canceled. */
  cancelLeavingDateChange(): void {
    this.leavingDateFormControl.setValue(startOfDay(this.leavingDate), { emitEvent: false });
    this.modalRef.hide();
  }
  /** This method is called when confirm leaving reason change popup is confirmed.   */
  confirmLeavingReasonChange(): void {
    this.setLeavingDateForDead(this.leavingReasonFormControl.value);
    this.resetEngagementWages.emit();
    this.checkWageAdditionSection();
    this.decline();
  }
  /** This method is called when confirm leaving reason change popup is canceled.*/
  cancelLeavingReasonChange(): void {
    this.leavingReasonFormControl.setValue(this.leavingReason, { emitEvent: false });
    this.leavingReasonFormControl.updateValueAndValidity({ emitEvent: false });
    this.periodDetailForm.updateValueAndValidity({ emitEvent: false });
    this.decline();
  }



  /** Method to save cancellation details. */
  saveCancellationDetails() {
    // console.log(this.periodDetailForm.value.joiningDate);
    // console.log(this.periodDetailForm.value.leavingDate);
    // console.log(this.periodDetailForm.value.leavingReason);
    // console.log(this.periodDetailForm.value.isContributorActive)
  }


}
