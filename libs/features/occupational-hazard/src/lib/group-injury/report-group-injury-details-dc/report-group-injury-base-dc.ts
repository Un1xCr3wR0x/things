/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BilingualText, GosiCalendar, Lov, LovList, startOfDay } from '@gosi-ui/core';
import { GoogleMapDcComponent } from '@gosi-ui/foundation-theme';
import { ReopenDetailsDcComponent } from '../../injury/reopen-details-dc/reopen-details-dc.component';
import {
  Establishment,
  PreviousInjury,
  ProcessType,
  setResponse
} from '../../shared';
import { GroupInjury } from '../../shared/models/group-injury-details';

@Directive()
export abstract class ReportGroupInjuryBase {
  /*Input Variables*/
  @Input() isAppPrivate: boolean;
  @Input() isAppPublic: boolean;
  @Input() injuryOccuredPlace: LovList = new LovList([]);
  @Input() injuryreasonList: LovList = new LovList([]);
  @Input() cityList: LovList = new LovList([]);
  @Input() countryList: LovList = new LovList([]);
  @Input() governmentSectorList: LovList = new LovList([]);
  @Input() injuryTypeList: LovList = new LovList([]);
  @Input() parentForm: FormGroup;
  @Input() isAddressAvailable: boolean;
  @Input() establishmentPresent: Establishment;
  @Input() reportGroupInjuryForm: FormGroup;
  @Input() isEdit: boolean;
  @Input() viewInjuryDetails: GroupInjury;
  @Input() processType = '';
  @Input() isWorkflow = false;
  @Input() injuryNumber: number;
  @Input() previousInjury: PreviousInjury[];
  @Input() taskid: string;
  @Input() establishments: LovList = new LovList([]);
  @Input() employeeActivityAtInjuryTime: LovList = new LovList([]);
  @Input() occupation: BilingualText;

  /* Output variables*/
  @Output() template: EventEmitter<null> = new EventEmitter();
  @Output() selectRegNo: EventEmitter<number> = new EventEmitter();
  @Output() establismentDetails: EventEmitter<FormGroup> = new EventEmitter();
  @Output() selectInjuryType: EventEmitter<string> = new EventEmitter();
  @Output() selectgovernmentSector: EventEmitter<string> = new EventEmitter();
  @Output() alertEmit: EventEmitter<boolean> = new EventEmitter();
  @Output() reopenReasonDetails: EventEmitter<null> = new EventEmitter();
  @Output() modifyIndicator: EventEmitter<boolean> = new EventEmitter();
  @Output() submit: EventEmitter<GroupInjury> = new EventEmitter();
  @Output() establishmentSearch: EventEmitter<null> = new EventEmitter();
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() injuryDateChanged: EventEmitter<GosiCalendar> = new EventEmitter();

  /**
   * Reference to child components and directives
   */

  @ViewChild('googleMapDcComponent', { static: true })
  googleMapDcComponent: GoogleMapDcComponent;

  @ViewChild('reopenDetailsForm', { static: false })
  reopenDetailsForm: ReopenDetailsDcComponent;
  @ViewChild('ReopenDetailsDcComponent', { static: false })
  reopenInjuryForm: ReopenDetailsDcComponent;

  /*Local Variables */
  registrationNumber = new FormControl(null, Validators.required);
  showCity = true;
  registrationNo: number;
  showMap = true;
  showCityDistrict = false;
  hasSearchResult = false;
  disableEst = false;
  showResonforDelay = false;
  showResonforDelayCurrentDate = false;
  maxLength = 500;
  length: number;
  latitude = 24.894801;
  establishment: Establishment;
  longitude = 46.610461;
  showCountry = true;
  pushedReason = false;
  isEstablishmentFound: boolean;
  searchEstablishmentForm: FormGroup = new FormGroup({});
  mapViewMode = false;
  showInjury = true;
  isValueBinded = true;
  disableDeath = false;
  addressValidation = false;
  contributorInformedDate: Date = new Date();
  cityDistrictList: LovList;
  isWorkflowStatus = true;
  lang = 'en';
  delayedDays: number;
  delayedDaysWithCurrentDay: number;
  items: Lov[] = [];
  payeeList: LovList = null;
  IsReopen: boolean;
  showToggle = true;
  hideInjury = true;
  selectedReason: BilingualText;
  employerInformedDate: Date;
  isCountrySaudi: Boolean;

  injuryDetails: GroupInjury = new GroupInjury();
  isShowMarker = false;
  currentDate: Date = new Date();
  deathDate: Date = new Date();
  contributorInjuryDate: Date;
  disabled = false;
  employerInformedDateMinDate: Date = new Date();
  maxlengthData = 250;
  reasonList: LovList = new LovList([]);
  isCsr = false;
  injuryList: LovList = new LovList([]);

  constructor(readonly fb: FormBuilder) { }

  createGroupInjuryForm() {
    return this.fb.group({
      injuryDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
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
      employerInformedDate: this.fb.group({
        gregorian: [this.currentDate, { validators: Validators.required }],
        hijiri: [null]
      }),
      place: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      detailedPlace: [null, { validators: Validators.required }],
      detailsDescription: [null, { validators: Validators.required }],
      accidentType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      governmentSector: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      }),
      comments: [null],
      reasonForDelay: [null]
    });
  }

  // method to update form control value.
  updateForm() {
    if (this.searchEstablishmentForm) {
      this.searchEstablishmentForm.markAllAsTouched();
      this.searchEstablishmentForm.updateValueAndValidity();
      this.establismentDetails.emit(this.searchEstablishmentForm);
    }
  }

  /**
   * Method to submit the Group injury Details
   */

  // saving the reported injury
  submitGroupInjuryDetails() {
    if (this.processType === ProcessType.REOPEN && !this.reopenDetailsForm.isValidForm()) {
      this.reopenReasonDetails.emit();
    } else {
      if (this.processType !== ProcessType.REOPEN && this.isAppPrivate) {
        this.updateForm();
      }
      this.modifyIndicator.emit(this.showInjury);
      this.injuryDetails = new GroupInjury();
      this.injuryDetails = setResponse(new GroupInjury(), this.reportGroupInjuryForm.getRawValue());
      //set placeform value to parentform
      if (this.processType === ProcessType.REOPEN && this.showInjury === false) {
        this.reportGroupInjuryForm = this.createGroupInjuryForm();
        this.bindObjectToForm(this.reportGroupInjuryForm, this.injuryDetails);
        this.injuryDetails = setResponse(new GroupInjury(), this.reportGroupInjuryForm.getRawValue());
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
        this.injuryDetails.country = this.reportGroupInjuryForm.get('placeForm').get('country').value;
        this.injuryDetails.city = this.reportGroupInjuryForm.get('placeForm').get('city').value;
        this.injuryDetails.cityDistrict = this.reportGroupInjuryForm.get('placeForm').get('cityDistrict').value;
        this.injuryDetails.latitude = this.reportGroupInjuryForm.get('placeForm').get('latitude').value;
        this.injuryDetails.longitude = this.reportGroupInjuryForm.get('placeForm').get('longitude').value;
      }
      if (this.injuryNumber) {
        this.injuryDetails.injuryId = this.injuryNumber;
      }

      this.injuryDetails.governmentSector = this.reportGroupInjuryForm.get('governmentSector').value;

      const injuryDate = this.reportGroupInjuryForm.get('injuryDate').get('gregorian').value;
      this.injuryDetails.injuryDate.gregorian = startOfDay(injuryDate);
      const employeeInformedDate = this.reportGroupInjuryForm.get('employeeInformedDate').get('gregorian').value;
      this.injuryDetails.employeeInformedDate.gregorian = startOfDay(employeeInformedDate);
      const employerInformedDate = this.reportGroupInjuryForm.get('employerInformedDate').get('gregorian').value;
      this.injuryDetails.employerInformedDate.gregorian = startOfDay(employerInformedDate);
      const workDisabilitydate = this.reportGroupInjuryForm.get('workDisabilityDate').get('gregorian').value;
      this.injuryDetails.workDisabilityDate.gregorian = startOfDay(workDisabilitydate);
      this.injuryDetails.injuryHour = this.reportGroupInjuryForm.get('datePicker').get('injuryHour').value;
      this.injuryDetails.injuryMinute = this.reportGroupInjuryForm.get('datePicker').get('injuryMinute').value;
      if (this.showResonforDelay === false && this.showResonforDelayCurrentDate === false) {
        this.injuryDetails.reasonForDelay = null;
      } else {
        this.injuryDetails.reasonForDelay = this.reportGroupInjuryForm.get('reasonForDelay')?.value
      }
      this.injuryDetails.detailsDescription = this.reportGroupInjuryForm.get('detailsDescription')?.value;
      this.injuryDetails.detailedPlace = this.reportGroupInjuryForm.get('detailedPlace').value;

      this.injuryDetails.comments = this.reportGroupInjuryForm.get('comments').value;

      this.submit.emit(this.injuryDetails);
    }
  }

  // method to enable form control.
  enableField(formControl: AbstractControl) {
    formControl.setValidators([Validators.required]);
    formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
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
      }
    }
  }

  //Method to bind objects to report injury form while modifying a transaction
  bindObjectToForm(form: FormGroup, data) {
    const treatmentStarted = data.treatmentCompleted === false ? 'No' : 'Yes';
    if (form.get('treatmentCompleted')) {
      form.get('treatmentCompleted').get('english').setValue(treatmentStarted);
    }

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
      if (this.reportGroupInjuryForm.get('treatmentCompleted')) {
        this.injuryDetails.treatmentCompleted
          ? this.reportGroupInjuryForm.get('treatmentCompleted.english').setValue('Yes')
          : this.reportGroupInjuryForm.get('treatmentCompleted.english').setValue('No');
      }
    }
    form.updateValueAndValidity();
    form.markAsPristine();
  }

  //bind occupation to dropdown
  bindOccupation() {
    if (this.reportGroupInjuryForm && this.reportGroupInjuryForm.get('occupation')) {
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

  // to set the map values
  setMapValues(mapValues) {
    this.latitude = mapValues.latitude;
    this.longitude = mapValues.longitude;
  }
  /**
   * Method to cancel template of injury details
   */
  showCancelTemplate() {
    this.template.emit();
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

  setValuesInMap() {
    if (this.cityList && this.viewInjuryDetails?.city) {
      this.reportGroupInjuryForm.get('placeForm').get('city').setValue(this.viewInjuryDetails.city);
      this.cityDistrictList = new LovList(
        this.cityList.items.filter(city => city.value?.english === this.viewInjuryDetails.city?.english)[0].items
      );
      if (this.viewInjuryDetails.cityDistrict) {
        this.reportGroupInjuryForm.get('placeForm').get('cityDistrict').setValue(this.viewInjuryDetails.cityDistrict);
      }
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
    this.reportGroupInjuryForm.get('placeForm').get('latitude').setValue(this.viewInjuryDetails.latitude);
    this.reportGroupInjuryForm.get('placeForm').get('longitude').setValue(this.viewInjuryDetails.longitude);
  }
}
