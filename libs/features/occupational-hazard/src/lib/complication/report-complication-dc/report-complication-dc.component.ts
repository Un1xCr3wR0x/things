/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, dayDiff, LovList, Role, startOfDay, Lov, GosiCalendar, addDays } from '@gosi-ui/core';
import { ProcessType, Complication, Injury, OhService } from '../../shared';

@Component({
  selector: 'oh-report-complication-dc',
  templateUrl: './report-complication-dc.component.html',
  styleUrls: ['./report-complication-dc.component.scss']
})
export class ReportComplicationDcComponent implements OnInit, OnChanges, AfterViewChecked {
  isIndividualApp: boolean;
  /** Constructor initialization */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private fb: FormBuilder,
    readonly router: Router,
    readonly ohService: OhService,
  ) {}

  /** input variables */
  @Input() isAddressAvailable: boolean;
  @Input() parentForm: FormGroup;
  @Input() booleanList: LovList;
  @Input() isWorkflow: boolean;
  @Input() complicationDetails: Complication;
  @Input() processType = '';
  @Input() assignedRole: string;
  @Input() modifyIndicator = false;
  @Input() isEdit: boolean;
  @Input() injuryDetails: Injury;
  @Input() closingDate: GosiCalendar;
  @Input() isContributor: boolean;

  /** Output variables */
  @Output() submit: EventEmitter<Complication> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() template: EventEmitter<null> = new EventEmitter();
  @Output() showToggle: EventEmitter<boolean> = new EventEmitter();

  /** Local variables */
  contributorInformedDate: Date = new Date();
  maxLength = 500;
  isAppPrivate = false;
  isAppPublic = false;
  delayedDaysWithCurrentDay: number;
  reportComplicationForm: FormGroup;
  contributorComplicationDate: Date;
  workDisabilityDate: Date;
  deathDate: Date = new Date();
  reportedComplicationDetails: Complication = new Complication();
  isAddress = false;
  isPersonDead = false;
  addressValidation = false;
  delayedDays: number;
  showResonforDelayCurrentDate = false;
  showResonforDelay = false;
  disabled = false;
  items: Lov[] = [];
  minDate=null;
  payeeList: LovList = null;
  isBindValue = false;
  currentDate: Date = new Date();
  employerInformedDate: Date;
  employerInformedDateMinDate: Date = new Date();
  emergencyValidators = {
    validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
    updateOn: 'blur'
  };

  /**
   * Method for initialization tasks
   */
  ngOnInit() {
    this.reportComplicationForm = this.createComplicationForm();
    this.items.push({
      value: { english: 'Contributor', arabic: ' مشترك' },
      sequence: 1
    });
    if(this.complicationDetails.initiatedBy === 'taminaty'){
      this.isContributor=true;
    }
    this.items.push({ value: { english: 'Establishment', arabic: 'منشأة' }, sequence: 2 });
    this.payeeList = new LovList(this.items);
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    }
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isAppPublic = true;
    }
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.isIndividualApp = true;
      this.reportComplicationForm.get('employeeInformedDate').get('gregorian').patchValue(this.currentDate);
    }
    this.isBindValue = false;
    if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.RE_OPEN) {
      this.disabled = true;
    }
    if (this.processType === ProcessType.RE_OPEN) {
      this.reportComplicationForm.get('mobileNo').get('primary').setValidators([Validators.required]);
    } else {
      this.reportComplicationForm.get('mobileNo').get('primary').clearValidators();
    }

    if (this.parentForm) {
      this.parentForm.addControl('reportComplication', this.reportComplicationForm);
    }
    this.dateValidation();
  }

  /**
   * @param changes Capturing the input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.assignedRole) {
      this.assignedRole = changes.assignedRole.currentValue;
    }
    if (changes && changes.modifyIndicator) {
      this.modifyIndicator = changes.modifyIndicator.currentValue;
    }
    if (changes && changes.complicationDetails) {
      this.complicationDetails = changes.complicationDetails.currentValue;
      if(this.complicationDetails.initiatedBy === 'taminaty'){
        this.isContributor=true;
      }
    }
  }
  dateChange() {
    this.contributorComplicationDate = this.reportComplicationForm.get('complicationDate').get('gregorian').value;
  }
  /**
   * Validation for complication dates
   */
  dateValidation() {
    if (this.reportComplicationForm) {
      this.reportComplicationForm
        .get('employeeInformedDate')
        .get('gregorian')
        .valueChanges.subscribe(employeeInformedDate => {
          this.contributorInformedDate = employeeInformedDate;
          this.employerInformedDateMinDate = employeeInformedDate;
          if (!this.isAppPrivate && !this.isIndividualApp && this.processType !== ProcessType.RE_OPEN) {
            this.employerInformedDate = this.currentDate;
          }
          this.validationCheck();
        });
      this.reportComplicationForm
        .get('employerInformedDate')
        .get('gregorian')
        .valueChanges.subscribe(employerInformedDate => {
          this.employerInformedDate = employerInformedDate;
          this.validationCheck();
        });
      this.reportComplicationForm
        .get('complicationDate')
        .get('gregorian')
        .valueChanges.subscribe(complicationDate => {
          if (complicationDate.gregorian !== null) {
            {
              this.contributorComplicationDate = complicationDate;
              this.workDisabilityDate= this.reportComplicationForm.get('workDisabilityDate').get('gregorian').value;
              if (
                this.processType !== ProcessType.MODIFY &&
                // this.processType !== ProcessType.EDIT &&
                this.processType !== ProcessType.RE_OPEN
              ) {
                setTimeout(() => {
                  this.reportComplicationForm.get('workDisabilityDate').get('gregorian').setValue(complicationDate);
                }, 100);
                this.reportComplicationForm.get('workDisabilityDate').get('gregorian').updateValueAndValidity();
              }
              this.validationCheck();
            }
          }
        });
        this.workDisabilityDateChange();
      this.reportComplicationForm
        .get('deathDate')
        .get('gregorian')
        .valueChanges.subscribe(deathDate => {
          this.deathDate = deathDate;
          if (deathDate === null) {
            this.deathDate = this.currentDate;
          }
        });
    }
  }
  //Method to make report injury form controls read only if it is workflow of establishment admin
  makeFormControlsReadOnly(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      if (key !== 'comments') form.controls[key].disable();
      if (key !== 'mobileNo') form.controls[key].disable();
    });
  }
  //Method to bind objects to report injury form while modifying a transaction
  bindObjectToForm(form: FormGroup, data) {
    if (data && form) {
      Object.keys(data).forEach(name => {
        if (
          (name === 'complicationDate' ||
            name === 'workDisabilityDate' ||
            name === 'employeeInformedDate' ||
            name === 'employerInformedDate' ||
            name === 'deathDate') &&
          form.get(name) &&
          form.get(name).get('gregorian') &&
          data[name]
        ) {
          form.get(name).get('gregorian').patchValue(new Date(data[name]['gregorian']));
        } else if (form.get(name) && data[name]) {
          form.get(name).patchValue(data[name]);
        }
      });
      this.reportComplicationForm.get('mobileNo').setValue(this.complicationDetails.emergencyContactNo);
      this.complicationDetails.treatmentCompleted
        ? this.reportComplicationForm.get('treatmentCompleted.english').setValue('Yes')
        : this.reportComplicationForm.get('treatmentCompleted.english').setValue('No');
      if (this.complicationDetails.allowancePayee === 2) {
        this.reportComplicationForm.get('payeeType.english').setValue('Contributor');
        this.reportComplicationForm.get('payeeType.arabic').setValue(' مشترك');
      } else if (this.complicationDetails.allowancePayee === 1) {
        this.reportComplicationForm.get('payeeType.english').setValue('Establishment');
        this.reportComplicationForm.get('payeeType.arabic').setValue('منشأة');
      }
      form.updateValueAndValidity();
      form.markAsPristine();
    }
  }
  workDisabilityDateChange() {
    this.reportComplicationForm.get('workDisabilityDate.gregorian').valueChanges.subscribe(value => {
      if (value !== null) {
        this.workDisabilityDate = value;
      }
    });
  }
  /**
   * Method to disable form control.
   * @param formControl form control
   */
  disableField(formControl: AbstractControl) {
    formControl.setValue(null);
    formControl.disable();
    formControl.clearValidators();
    formControl.markAsPristine();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
  /**
   * Nethod to enable form control.
   * @param formControl form control
   */
  enableField(formControl: AbstractControl) {
    formControl.setValidators([Validators.required]);
    formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }

  /**
   * Create Report Complication form
   */

  createComplicationForm() {
    return this.fb.group({
      complicationDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      workDisabilityDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      deathDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      employeeInformedDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      employerInformedDate: this.fb.group({
        gregorian: [this.currentDate, { validators: Validators.required }],
        hijiri: [null]
      }),
      complicationToDeathIndicator: [false, { updateOn: blur }],
      treatmentCompleted: this.fb.group({
        english: ['No', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      reasonForDelay: [null],
      payeeType: this.fb.group({
        english: ['Contributor', { validators: Validators.required }],
        arabic: null
      }),
      mobileNo: this.fb.group({
        primary: [
          '',
          {
            validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
            updateOn: 'blur'
          }
        ],
        isdCodePrimary: [null, { updateOn: 'blur' }],
        secondary: [null],
        isdCodeSecondary: [null, { updateOn: 'blur' }]
      }),
      isMobileNoVerified: [false]
    });
  }

  /**
   * validation for report complication form
   */
  validationCheck() {
    if (this.reportComplicationForm.get('complicationToDeathIndicator').valueChanges) {
      this.isPersonDead = this.reportComplicationForm.get('complicationToDeathIndicator').value;
      const deathDate = this.reportComplicationForm.get('deathDate').get('gregorian');
      if (this.isPersonDead) {
        this.addressValidation = true;
        deathDate.setValidators([Validators.required]);
      } else {
        this.addressValidation = false;
        this.deathDate = new Date();
        deathDate.reset();
        deathDate.clearValidators();
      }
      deathDate.updateValueAndValidity();
    }
    if (
      this.reportComplicationForm.get('complicationDate').get('gregorian').valueChanges ||
      this.reportComplicationForm.get('employeeInformedDate').get('gregorian').valueChanges ||
      this.reportComplicationForm.get('employerInformedDate').get('gregorian').valueChanges ||
      this.reportComplicationForm.get('workDisabilityDate').get('gregorian').valueChanges
    ) {
      const reasonForDelay = this.reportComplicationForm.get('reasonForDelay');
      this.reportComplicationForm
        .get('employeeInformedDate')
        .get('gregorian')
        .valueChanges.subscribe(employeeInformedDate => {
          if (employeeInformedDate.gregorian !== null) {
            this.contributorInformedDate = employeeInformedDate;
            this.reasonForDelayValidation(reasonForDelay);
          }
        });

      this.reportComplicationForm
        .get('complicationDate')
        .get('gregorian')
        .valueChanges.subscribe(complicationDate => {
          if (complicationDate.gregorian !== null) {
            this.contributorComplicationDate = complicationDate;
            this.reasonForDelayValidation(reasonForDelay);
          }
        });

      this.reportComplicationForm
        .get('employerInformedDate')
        .get('gregorian')
        .valueChanges.subscribe(employerInformedDate => {
          if (employerInformedDate.gregorian !== null) {
            this.employerInformedDate = employerInformedDate;
            this.reasonForDelayValidation(reasonForDelay);
          }
        });
    }
  }
  reasonForDelayValidation(reasonForDelay) {
    if (
      this.contributorInformedDate !== undefined ||
      (null && this.contributorComplicationDate !== undefined) ||
      null
    ) {
      this.delayedDays = this.getDateDifference(this.contributorComplicationDate, this.contributorInformedDate);
      this.showResonforDelay = this.delayedDays >= 7 ? true : false;
    }
    if (
      this.contributorInformedDate !== undefined ||
      (null && this.contributorComplicationDate === undefined) ||
      null
    ) {
      if (!this.isAppPrivate && this.processType === ProcessType.RE_OPEN) {
        this.employerInformedDate = this.complicationDetails.employerInformedDate.gregorian;
      }
      this.delayedDaysWithCurrentDay = this.getDateDifference(this.contributorInformedDate, this.employerInformedDate);
      this.showResonforDelayCurrentDate = this.delayedDaysWithCurrentDay >= 3 ? true : false;
    }
    if (this.showResonforDelay === true || this.showResonforDelayCurrentDate === true) {
      reasonForDelay.setValidators([Validators.required]);
    } else {
      reasonForDelay.clearValidators();
    }
    reasonForDelay.updateValueAndValidity();
  }
  /**
   * finding the delayed number of days, leads to show delay details field
   */
  getDateDifference(dateFrom: Date, dateto: Date) {
    const delayedDays = dayDiff(dateFrom, dateto);
    return delayedDays;
  }

  /**
   * Binding value to form
   */
  submitComplicationDetails() {
    if (this.processType === ProcessType.RE_OPEN) {
      if (!this.modifyIndicator) {
        this.bindObjectToForm(this.reportComplicationForm, this.complicationDetails);
      }
    }
    this.reportedComplicationDetails = new Complication();
    this.reportedComplicationDetails.treatmentCompleted = this.reportComplicationForm.get('treatmentCompleted').value;
    this.reportedComplicationDetails = this.setResponse(new Complication(), this.reportComplicationForm.getRawValue());

    if (this.reportComplicationForm.get('complicationToDeathIndicator').value === false) {
      this.reportedComplicationDetails.deathDate = null;
    } else {
      this.reportedComplicationDetails.deathDate.gregorian = startOfDay(this.deathDate);
    }
    const complicationDate = this.reportComplicationForm.get('complicationDate').get('gregorian').value;
    this.reportedComplicationDetails.complicationDate.gregorian = startOfDay(complicationDate);
    const employeeInformedDate = this.reportComplicationForm.get('employeeInformedDate').get('gregorian').value;
    this.reportedComplicationDetails.employeeInformedDate.gregorian = startOfDay(employeeInformedDate);
    const employerInformedDate = !this.isIndividualApp
      ? this.reportComplicationForm.get('employerInformedDate').get('gregorian').value
      : null;
    this.reportedComplicationDetails.employerInformedDate.gregorian = startOfDay(employerInformedDate);
    const workDisabilityDate = this.reportComplicationForm.get('workDisabilityDate').get('gregorian').value;
    this.reportedComplicationDetails.workDisabilityDate.gregorian = startOfDay(workDisabilityDate);
    this.reportedComplicationDetails.reasonForDelay = this.reportComplicationForm.get('reasonForDelay').value;
    if (this.processType === ProcessType.RE_OPEN) {
      this.reportedComplicationDetails.emergencyContactNo = this.reportComplicationForm.get('mobileNo').value;
      if (this.reportComplicationForm.get('payeeType.english').value === 'Contributor') {
        this.reportedComplicationDetails.allowancePayee = 2;
      } else if (this.reportComplicationForm.get('payeeType.english').value === 'Establishment') {
        this.reportedComplicationDetails.allowancePayee = 1;
      }
    } else {
      this.reportedComplicationDetails.emergencyContactNo = null;
      this.reportedComplicationDetails.allowancePayee = null;
      this.reportComplicationForm.get('payeeType.english').clearValidators();
      this.reportComplicationForm.get('payeeType.english').updateValueAndValidity();
    }
    this.submit.emit(this.reportedComplicationDetails);
  }
  /**
   * Template for cancel
   */
  showCancelTemplate() {
    this.template.emit();
  }

  /**
   * Method to bind form data to model
   */
  setResponse(object, data) {
    if (data && object) {
      Object.keys(object).forEach(key => {
        if (key in data) {
          if (data[key]) {
            if (key === 'treatmentCompleted') {
              object[key] = data[key]['english'] === 'No' ? false : true;
            } else {
              object[key] = data[key];
            }
          }
        }
      });
    }
    return { ...object };
  }
  /**
   * Binding the values
   */
  ngAfterViewChecked() {
    if (!this.isBindValue) {
      if (
        (this.processType === ProcessType.MODIFY ||
          this.processType === ProcessType.EDIT ||
          this.processType === ProcessType.RE_OPEN ||
          this.isEdit) &&
        this.complicationDetails.complicationDate.gregorian !== undefined
      ) {
        this.bindObjectToForm(this.reportComplicationForm, this.complicationDetails);
        this.isBindValue = true;
        if (!this.reportComplicationForm.valid) {
          this.modifyIndicator = true;
          this.showToggle.emit(false);
        }
        if (
          this.assignedRole === Role.EST_ADMIN_OH &&
          (this.processType === ProcessType.RE_OPEN || this.processType === ProcessType.EDIT)
        ) {
          this.makeFormControlsReadOnly(this.reportComplicationForm);
          if (this.processType === ProcessType.RE_OPEN) {
            this.enableField(this.reportComplicationForm.get('mobileNo').get('primary'));
          }
          this.reportComplicationForm.clearValidators();
          this.reportComplicationForm.updateValueAndValidity();
        }
      }
    }
  }
}
