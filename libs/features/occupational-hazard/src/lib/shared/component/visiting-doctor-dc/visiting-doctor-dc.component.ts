import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LookupService, LovList } from '@gosi-ui/core';
import { DisabiliyDtoList } from '@gosi-ui/features/medical-board';
import { OhService, VDFormValue } from '../../../shared';

@Component({
  selector: 'oh-visiting-doctor-dc',
  templateUrl: './visiting-doctor-dc.component.html',
  styleUrls: ['./visiting-doctor-dc.component.scss']
})
export class VisitingDoctorDcComponent implements OnInit, OnChanges {
  //Local variable
  showVisitingReasons: boolean = false;
  selectedSpeciality: BilingualText[];
  selectedMultiSpecialties: BilingualText[];
  @Input() specialtyList: LovList;
  @Input() visitingReasonList: LovList;
  @Input() parentForm: FormGroup;
  @Input() disabilityDetails: DisabiliyDtoList;
  @Input() isReturn: boolean;
  @Input() heirDisabilityAssessment: boolean;
  @Input() showNonOCCDisability: boolean;
  @Input() isAppealedAssessment: boolean;
  visitingReason: LovList = new LovList([]);
  yesOrNoList: LovList = new LovList([]);
  visitingSpecificReason: LovList = new LovList([]);
  showvVDReasonField: boolean;

  visitingDoctorForm: FormGroup;
  constructor(readonly fb: FormBuilder, readonly lookupService: LookupService, readonly ohService: OhService) {}
  /*
   * This method is for detecting changes in input property
   */
  ngOnChanges() {
    this.showVisitingDoctorFields();
  }
  /**
   * This method handles initialization tasks.
   */
  ngOnInit(): void {
    this.yesOrNoList = new LovList([
      { value: { english: 'Yes', arabic: 'نعم' }, sequence: 0, code: 1001 },
      { value: { english: 'No', arabic: 'لا' }, sequence: 1, code: 1002 }
    ]);

    this.visitingDoctorForm = this.createVisitingDoctorForm();
    this.visitingDoctorForm.get('visitingDoctor').valueChanges.subscribe(() => {
      this.showVisitingDoctorFields();
    });
    if (this.visitingDoctorForm.value.visitingDoctor.english === 'Yes') {
      this.visitingDoctorForm.clearValidators();
      this.visitingDoctorForm.updateValueAndValidity();
    }
    if (this.parentForm) {
      this.parentForm.addControl('visitingDoctorFormValue', this.visitingDoctorForm);
    }
    if (this.isReturn === true || this.heirDisabilityAssessment === true || this.showNonOCCDisability == true) {
      this.selectedMultiSpecialties = this.disabilityDetails?.vdDetails?.vdSpecialties;
      this.forReturnReassessmentTransaction(); //returned Transaction
    }
    if (this.ohService?.visitingDoctorFormValue && this.ohService?.visitingDoctorFormValue?.visitingDoctor?.english) {
      this.patchVDForm(this.ohService.visitingDoctorFormValue);
    }
    if (this.parentForm && this.parentForm.get('visitingDoctorFormValue'))
      this.parentForm.get('visitingDoctorFormValue').valueChanges.subscribe(res => {
        this.ohService.visitingDoctorFormValue = {
          ...res,
          visitingDoctorSpecialty: res?.visitingDoctorSpecialty?.english?.map(speciality => {
            return {
              english: speciality?.english,
              arabic: speciality?.arabic
            };
          })
        };
      });
      // for appreal assessment visiting doctor should be yes 
    if (this.isAppealedAssessment === true) {
      this.visitingDoctorForm.get('visitingDoctor').get('english').setValue('Yes');
    }
  }
  forReturnReassessmentTransaction() {
    if (this.disabilityDetails?.vdDetails) {
      if ((this.disabilityDetails.isVdRequired = true)) {
        this.visitingDoctorForm.get('visitingDoctor').get('english').setValue('Yes');
      } else {
        this.visitingDoctorForm.get('visitingDoctor').get('english').setValue('No');
      }
      this.visitingDoctorForm
        .get('vdReasonDescription')
        .patchValue(this.disabilityDetails?.vdDetails?.vdReasonDescription);
      this.visitingDoctorForm.get('vdReason').patchValue(this.disabilityDetails?.vdDetails?.vdReason);
      if (this.disabilityDetails?.vdDetails?.vdReason?.english === 'Other') this.showvVDReasonField = true;
    }
  }
  patchVDForm(visitingDoctorFormValue: VDFormValue) {
    this.visitingDoctorForm
      .get('visitingDoctor')
      .get('english')
      .setValue(visitingDoctorFormValue?.visitingDoctor?.english);
    this.visitingDoctorForm.get('vdReasonDescription').patchValue(visitingDoctorFormValue?.vdReasonDescription);
    this.visitingDoctorForm.get('vdReason').patchValue(visitingDoctorFormValue?.vdReason);
    if (visitingDoctorFormValue?.vdReason?.english === 'Other') this.showvVDReasonField = true;
    this.visitingDoctorForm.get('visitingDoctorSpecialty').patchValue(visitingDoctorFormValue?.visitingDoctorSpecialty);
  }
  //If visiting doctor
  showVisitingDoctorFields() {
    if (this.visitingDoctorForm && this.visitingDoctorForm?.get('visitingDoctor')?.get('english').value === 'Yes') {
      this.showVisitingReasons = true; //to show field for require  visiting Doctor
      this.visitingDoctorForm?.get('vdReason').get('english').setValidators([Validators.required]);
      this.visitingDoctorForm?.get('vdReasonDescription').updateValueAndValidity();
      this.visitingDoctorForm?.get('vdReason').updateValueAndValidity();
      this.visitingDoctorForm?.get('visitingDoctorSpecialty').get('english').clearValidators();
      this.visitingDoctorForm.updateValueAndValidity();
    } else if (
      this.visitingDoctorForm &&
      this.visitingDoctorForm?.get('visitingDoctor')?.get('english').value === 'No'
    ) {
      this.visitingDoctorForm?.get('vdReasonDescription').clearValidators();
      this.visitingDoctorForm?.get('vdReasonDescription').updateValueAndValidity();
      this.visitingDoctorForm?.get('vdReason').get('english').clearValidators();
      this.visitingDoctorForm?.get('vdReason').get('english').updateValueAndValidity();
      this.visitingDoctorForm?.get('vdReason').updateValueAndValidity();
      this.showVisitingReasons = false;
      this.visitingDoctorForm.clearValidators();
      this.visitingDoctorForm.updateValueAndValidity();
    }
  }
  /*
   * This method is to create Visiting doctor Form
   */
  createVisitingDoctorForm() {
    return this.fb.group({
      visitingDoctor: this.fb.group({
        english: ['No', Validators.required],
        arabic: [null]
      }),
      vdReason: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      vdReasonDescription: [null],
      visitingDoctorSpecialty: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  onSelectedSubspecialty(items: BilingualText[]) {
    this.selectedSpeciality = items;
    this.selectedMultiSpecialties = this.selectedSpeciality.map(val => {
      return {
        english: val.english,
        arabic: val.arabic
      };
    });
  }
  onSelect() {
    if (this.visitingDoctorForm && this.visitingDoctorForm.get('vdReason').get('english').value === 'Other') {
      this.showvVDReasonField = true;
      this.visitingDoctorForm.get('vdReasonDescription').setValidators([Validators.required]);
      this.visitingDoctorForm.get('vdReasonDescription').updateValueAndValidity();
    } else {
      this.visitingDoctorForm.get('vdReasonDescription').clearValidators();
      this.visitingDoctorForm.get('vdReasonDescription').updateValueAndValidity();
      this.showvVDReasonField = false;
    }
  }
  selectYesOrNo() {}
}
