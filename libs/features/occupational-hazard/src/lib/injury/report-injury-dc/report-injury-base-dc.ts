/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, Lov, LovList, startOfDay } from '@gosi-ui/core';
import { GoogleMapDcComponent } from '@gosi-ui/foundation-theme';
import {
  Engagement,
  EstablishmentDetailsDcComponent,
  Injury,
  PersonalDetailsDcComponent,
  PreviousInjury,
  ProcessType,
  setResponse
} from '../../shared';
import { ReopenDetailsDcComponent } from '../reopen-details-dc/reopen-details-dc.component';

@Directive()
export abstract class ReportInjuryBase {
  /** Output variables */
  @Output() selectInjuryType: EventEmitter<string> = new EventEmitter();
  @Output() submit: EventEmitter<Injury> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() selectgovernmentSector: EventEmitter<string> = new EventEmitter();
  @Output() template: EventEmitter<null> = new EventEmitter();
  @Output() selectRegNo: EventEmitter<number> = new EventEmitter();
  @Output() reopenReasonDetails: EventEmitter<null> = new EventEmitter();
  @Output() modifyIndicator: EventEmitter<boolean> = new EventEmitter();
  @Output() reopenReason: EventEmitter<BilingualText> = new EventEmitter();
  @Output() establismentDetails: EventEmitter<FormGroup> = new EventEmitter();
  @Output() alertEmit: EventEmitter<boolean> = new EventEmitter();

  /** Input variables */
  @Input() injuryOccuredPlace: LovList = new LovList([]);
  @Input() employeeActivityAtInjuryTime: LovList = new LovList([]);
  @Input() injuryTypeList: LovList = new LovList([]);
  @Input() injuryreasonList: LovList = new LovList([]);
  @Input() cityList: LovList = new LovList([]);
  @Input() reopenReasonList: LovList = new LovList([]);
  @Input() countryList: LovList = new LovList([]);
  @Input() parentForm: FormGroup;
  @Input() previousInjury: PreviousInjury[];
  @Input() injuryNumber: number;
  @Input() occupation: BilingualText;
  @Input() governmentSectorList: LovList = new LovList([]);
  @Input() isAddressAvailable: boolean;
  @Input() isAppPrivate: boolean;
  @Input() viewInjuryDetails: Injury;
  @Input() isWorkflow = false;
  @Input() taskid: string;
  @Input() isValidator1: false;
  @Input() establishmentName: BilingualText;
  @Input() establishmentList: LovList = new LovList([]);
  @Input() engagementDetails: Engagement = new Engagement();
  @Input() registrationNumber: number;
  @Input() selectedEngagament: Engagement;
  @Input() processType = '';
  @Input() booleanList: LovList;
  @Input() isEdit: boolean;
  @Input() allowanceFlag: boolean;
  @Input() allowanceFlagReturn: boolean;
  @Input() allowanceFlagReopen: boolean;

  /**
   * Reference to child components and directives
   */
  @ViewChild('googleMapDcComponent', { static: true })
  googleMapDcComponent: GoogleMapDcComponent;
  @ViewChild('establishmentListForm', { static: false })
  establishmentForm: EstablishmentDetailsDcComponent;
  @ViewChild('PersonalDetailsDcComponent', { static: false })
  PersonalDetailsDcComponent: PersonalDetailsDcComponent;
  @ViewChild('reopenDetailsForm', { static: false })
  reopenDetailsForm: ReopenDetailsDcComponent;
  @ViewChild('ReopenDetailsDcComponent', { static: false })
  reopenInjuryForm: ReopenDetailsDcComponent;

  /* Local variables  */
  reportInjuryForm: FormGroup;
  disableEst = false;
  mapViewMode = false;
  viewInjuryDetail: Injury;
  reasonList: LovList = new LovList([]);
  injuryList: LovList = new LovList([]);
  occupationList: LovList = new LovList([]);
  pushedReason = false;
  maxLength = 500;
  lang = 'en';
  isCountrySaudi: Boolean;
  currentDate: Date = new Date();
  injuryDateCheck: Date = new Date();
  deathDate: Date = new Date();
  employerInformedDate: Date;
  employerInformedDateMinDate: Date = new Date();
  contributorInjuryDate: Date;
  contributorInformedDate: Date = new Date();
  showResonforDelay = false;
  maxlengthData = 250;
  showResonforDelayCurrentDate = false;
  isPersonDead = false;
  injuryDetails: Injury = new Injury();
  showCityDistrict = false;
  cityDistrictList: LovList;
  showCity = true;
  showToggle = true;
  channel: string;
  delayedDays: number;
  otherValue: Lov;
  delayedDaysWithCurrentDay: number;
  city: BilingualText = new BilingualText();
  cityDistrict: BilingualText = new BilingualText();
  latitude = 24.894801;
  longitude = 46.610461;
  addressValidation = false;
  isWorkflowStatus = true;
  isValueBinded = true;
  disabled = false;
  disableDeath = false;
  hideInjury = true;
  showInjury = true;
  IsReopen: boolean;
  selectedReason: BilingualText;
  items: Lov[] = [];
  payeeList: LovList = null;
  emergencyValidators = {
    validators: Validators.compose([Validators.pattern('[0-9]+')]),
    updateOn: 'blur'
  };
  isShowMarker = false;
  reasonForDelayIndividual: boolean = false;

  constructor(readonly fb: FormBuilder) {}

  createInjuryForm() {
    return this.fb.group({
      injuryDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      governmentSector: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      }),
      datePicker: this.fb.group({
        injuryHour: [null, { validators: Validators.required }],
        injuryMinute: [null, { validators: Validators.required }]
      }),
      workDisabilityDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      employeeInformedDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      place: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      deathDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      detailedPlace: [null, { validators: Validators.required }],
      occupation: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      detailsDescription: [null,{ validators: Validators.required }],
      employerInformedDate: this.fb.group({
        gregorian: [this.currentDate, { validators: Validators.required }],
        hijiri: [null]
      }),
      treatmentCompleted: this.fb.group({
        english: ['No', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      accidentType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      injuryReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      comments: [null],
      reasonForDelay: [null],
      delayByEmployer: [null],
      injuryToDeathIndicator: [false, { updateOn: blur }],
      payeeType: this.fb.group({
        english: ['Contributor', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      emergencyContactNo: this.fb.group({
        primary: [
          '',
          {
            validators: Validators.compose([Validators.pattern('[0-9]+')]),
            updateOn: 'blur'
          }
        ],
        isdCodePrimary: ['sa', { updateOn: 'blur' }],
        secondary: [null],
        isdCodeSecondary: [null, { updateOn: 'blur' }]
      })
    });
  }

  // saving the reported injury
  submitInjuryDetails() {
    if (this.processType === ProcessType.REOPEN && !this.reopenDetailsForm.isValidForm()) {
      this.reopenReasonDetails.emit();
    } else {
      if (this.processType !== ProcessType.REOPEN && this.isAppPrivate) {
        this.updateForm();
      }
      this.modifyIndicator.emit(this.showInjury);
      this.injuryDetails = new Injury();
      this.injuryDetails = setResponse(new Injury(), this.reportInjuryForm.getRawValue());
      //set placeform value to parentform
      if (this.processType === ProcessType.REOPEN && this.showInjury === false) {
        this.reportInjuryForm = this.createInjuryForm();
        this.bindObjectToForm(this.reportInjuryForm, this.viewInjuryDetails);
        this.injuryDetails = setResponse(new Injury(), this.reportInjuryForm.getRawValue());
        if (this.viewInjuryDetails.city) {
          this.injuryDetails.city = this.viewInjuryDetails.city;
        }
        if (this.viewInjuryDetails.country) {
          this.injuryDetails.country = this.viewInjuryDetails.country;
        }
        if (this.viewInjuryDetails.cityDistrict) {
          this.injuryDetails.cityDistrict = this.viewInjuryDetails.cityDistrict;
        }
        this.injuryDetails.latitude = this.viewInjuryDetails.latitude;
        this.injuryDetails.longitude = this.viewInjuryDetails.longitude;
      } else {
        this.injuryDetails.country = this.reportInjuryForm.get('placeForm').get('country')?.value;
        this.injuryDetails.city = this.reportInjuryForm.get('placeForm').get('city')?.value;
        this.injuryDetails.cityDistrict = this.reportInjuryForm.get('placeForm').get('cityDistrict')?.value;
        this.injuryDetails.latitude = this.reportInjuryForm.get('placeForm').get('latitude')?.value;
        this.injuryDetails.longitude = this.reportInjuryForm.get('placeForm').get('longitude')?.value;
      }
      if (this.injuryNumber) {
        this.injuryDetails.injuryId = this.injuryNumber;
      }
      if (this.reportInjuryForm.get('injuryToDeathIndicator')?.value === false) {
        this.injuryDetails.deathDate = null;
      } else {
        this.injuryDetails.deathDate.gregorian = startOfDay(this.deathDate);
      }
      this.injuryDetails.governmentSector = this.reportInjuryForm.get('governmentSector')?.value;
      if (this.IsReopen) {
        this.injuryDetails.emergencyContactNo = this.reportInjuryForm.get('emergencyContactNo')?.value;
        this.injuryDetails.emergencyContactNo.isdCodePrimary = this.reportInjuryForm
          .get('emergencyContactNo')
          .get('isdCodePrimary')?.value;
        if (
          this.injuryDetails.emergencyContactNo &&
          (this.injuryDetails.emergencyContactNo.isdCodePrimary === null ||
            this.injuryDetails.emergencyContactNo.isdCodePrimary === '')
        ) {
          this.injuryDetails.emergencyContactNo.isdCodePrimary = 'sa';
        }
        this.injuryDetails.reopenReason = this.selectedReason;
        this.injuryDetails.modifyInjuryIndicator = this.showInjury;
      }
      const injuryDate = this.reportInjuryForm.get('injuryDate').get('gregorian')?.value;
      this.injuryDetails.injuryDate.gregorian = startOfDay(injuryDate);
      const employeeInformedDate = this.reportInjuryForm.get('employeeInformedDate').get('gregorian')?.value;
      this.injuryDetails.employeeInformedDate.gregorian = startOfDay(employeeInformedDate);
      const employerInformedDate = this.reportInjuryForm.get('employerInformedDate').get('gregorian')?.value;
      this.injuryDetails.employerInformedDate.gregorian = startOfDay(employerInformedDate);
      const workDisabilitydate = this.reportInjuryForm.get('workDisabilityDate').get('gregorian')?.value;
      this.injuryDetails.workDisabilityDate.gregorian = startOfDay(workDisabilitydate);
      this.injuryDetails.injuryHour = this.reportInjuryForm.get('datePicker').get('injuryHour')?.value;
      this.injuryDetails.injuryMinute = this.reportInjuryForm.get('datePicker').get('injuryMinute')?.value;
      if (this.showResonforDelay === false &&  this.showResonforDelayCurrentDate === false) {
        this.injuryDetails.reasonForDelay = null;
    }else{
      this.injuryDetails.reasonForDelay = this.reportInjuryForm.get('reasonForDelay')?.value
    }      this.injuryDetails.detailedPlace = this.reportInjuryForm.get('detailedPlace')?.value;
      if (this.reportInjuryForm.get('deathDate').get('gregorian')?.value === null) {
        this.injuryDetails.deathDate = null;
      }
      if (this.allowanceFlag) {
        this.injuryDetails.reasonForDelay = this.reasonForDelayIndividual ? this.reportInjuryForm.get('reasonForDelay')?.value : null;
        this.injuryDetails.delayByEmployer = this.reportInjuryForm.get('delayByEmployer')?.value;
        if(this.allowanceFlagReopen) {
          if (this.showResonforDelay) {
            this.injuryDetails.reasonForDelay = this.reportInjuryForm.get('reasonForDelay')?.value;
          } else {
            this.injuryDetails.reasonForDelay = null;
          }
        }
      } else {  
        this.injuryDetails.delayByEmployer = null;
      }
      if (this.reportInjuryForm.get('payeeType.english')?.value === 'Contributor') {
        this.injuryDetails.allowancePayee = 2;
      } else if (this.reportInjuryForm.get('payeeType.english')?.value === 'Establishment') {
        this.injuryDetails.allowancePayee = 1;
      }
      this.injuryDetails.comments = this.reportInjuryForm.get('comments')?.value;
      if (this.processType !== ProcessType.REOPEN) {
        this.injuryDetails.emergencyContactNo = null;
        this.reportInjuryForm.get('payeeType.english').clearValidators();
        this.reportInjuryForm.get('payeeType.english').updateValueAndValidity();
      }

      this.submit.emit(this.injuryDetails);
    }
  }
  //Method to bind objects to report injury form while modifying a transaction
  bindObjectToForm(form: FormGroup, data) {
    const treatmentStarted = data.treatmentCompleted === false ? 'No' : 'Yes';
    form.get('treatmentCompleted').get('english').setValue(treatmentStarted);
    if (data) {
      Object.keys(data).forEach(name => {
        if (name === 'injuryHour' || name === 'injuryMinute') {
          form.get('datePicker').get(name).patchValue(data[name]);
        } else if (
          (name === 'employeeInformedDate' ||
            name === 'employerInformedDate' ||
            name === 'injuryDate' ||
            name === 'workDisabilityDate' ||
            name === 'deathDate') &&
          data[name] &&
          form.get(name) &&
          form.get(name).get('gregorian')
        ) {
          form.get(name).get('gregorian').patchValue(new Date(data[name]['gregorian']));
        } else if (data[name] && form.get(name)) {
          form.get(name).patchValue(data[name]);
        }
      });
    }
    form.updateValueAndValidity();
    form.markAsPristine();
  }
  //Method to make report injury form controls read only if it is workflow of establishment admin
  makeFormControlsReadOnly(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      if (key !== 'comments') form.controls[key].disable();
    });
    //Disable google maps form component as well
    if (this.googleMapDcComponent) {
      Object.keys(this.googleMapDcComponent.placeForm.controls).forEach(key => {
        this.googleMapDcComponent.placeForm.controls[key].disable();
        this.googleMapDcComponent.placeForm.updateValueAndValidity();
      });
    }
  }
  //bind occupation to dropdown
  bindOccupation() {
    if (this.reportInjuryForm && this.reportInjuryForm.get('occupation')) {
      const occuptionTypeItem = {
        sequence: 0,
        code: 1231,
        value: {
          english: this.occupation.english,
          arabic: this.occupation.arabic
        }
      };
      if (this.employeeActivityAtInjuryTime) {
        this.employeeActivityAtInjuryTime = new LovList([
          ...this.employeeActivityAtInjuryTime?.items,
          occuptionTypeItem
        ]);
      }
    }
  }
  // to set the map values
  setMapValues(mapValues) {
    this.latitude = mapValues.latitude;
    this.longitude = mapValues.longitude;
  }
  // This method is used to show the cancellation template on click of cancel
  showCancelTemplate() {
    this.template.emit();
  }
  // This method is used to emit the registration number
  selectEstablishment(registrationNo: number) {
    this.selectRegNo.emit(registrationNo);
  }
  // Method to disable form control.
  disableField(formControl: AbstractControl) {
    formControl.setValue(null);
    formControl.disable();
    formControl.clearValidators();
    formControl.markAsPristine();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
  // method to enable form control.
  enableField(formControl: AbstractControl) {
    formControl.setValidators([Validators.required]);
    formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
  // method to update form control value.
  updateForm() {
    if (this.establishmentForm) {
      this.establishmentForm.engagementForm.markAllAsTouched();
      this.establishmentForm.engagementForm.updateValueAndValidity();
      this.establismentDetails.emit(this.establishmentForm.engagementForm);
    }
  }
  invalidICDScenario() {
    if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) {
      if (
        this.viewInjuryDetails &&
        this.viewInjuryDetails.injuryReason &&
        this.viewInjuryDetails.accidentType &&
        !this.viewInjuryDetails.reasonActive
      ) {
        const items = {
          sequence: 0,
          code: 1231,
          value: {
            english: this.viewInjuryDetails.injuryReason.english,
            arabic: this.viewInjuryDetails.injuryReason.arabic
              ? this.viewInjuryDetails.injuryReason.arabic
              : this.viewInjuryDetails.injuryReason.english
          }
        };
        const injuryTypeItem = {
          sequence: 0,
          code: 1231,
          value: {
            english: this.viewInjuryDetails.accidentType.english,
            arabic: this.viewInjuryDetails.accidentType.arabic
              ? this.viewInjuryDetails.accidentType.arabic
              : this.viewInjuryDetails.accidentType.english
          }
        };
        if (!this.injuryreasonList?.items) {
          this.injuryreasonList = new LovList([]);
        }
        if (!this.injuryTypeList) {
          this.injuryTypeList = new LovList([]);
        }
        this.injuryreasonList?.items?.push(items);
        this.injuryTypeList?.items.push(injuryTypeItem);
        this.reasonList = this.injuryreasonList;
        this.injuryList = this.injuryTypeList;
        this.pushedReason = true;
      } else {
        this.reasonList = this.injuryreasonList;
      }
    }
  }
  setValuesInMap() {
    if (this.cityList && this.viewInjuryDetails?.city) {
      this.reportInjuryForm.get('placeForm').get('city').setValue(this.viewInjuryDetails.city);
      this.cityDistrictList = new LovList(
        this.cityList.items.filter(city => city.value?.english === this.viewInjuryDetails.city?.english)[0].items
      );
      this.reportInjuryForm.get('placeForm').get('cityDistrict').setValue(this.viewInjuryDetails.cityDistrict);
      if (
        this.viewInjuryDetails.cityDistrict &&
        this.cityDistrictList &&
        this.cityDistrictList.items &&
        this.cityDistrictList.items.length > 1
      ) {
        this.showCityDistrict = true;
      }
      if (this.cityDistrictList && this.cityDistrictList.items && this.cityDistrictList.items.length === 1) {
        this.showCityDistrict = false;
      }
    }
    this.reportInjuryForm.get('placeForm').get('latitude').setValue(this.viewInjuryDetails.latitude);
    this.reportInjuryForm.get('placeForm').get('longitude').setValue(this.viewInjuryDetails.longitude);
  }
}
