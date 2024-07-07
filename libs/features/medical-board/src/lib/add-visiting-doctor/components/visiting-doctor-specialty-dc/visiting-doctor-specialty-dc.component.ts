/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, LanguageToken, LovList } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { DisabiliyDtoList } from '../../../shared';
import { SpecialtyDetails } from '../../../shared/models/specialty-details';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mb-visiting-doctor-specialty-dc',
  templateUrl: './visiting-doctor-specialty-dc.component.html',
  styleUrls: ['./visiting-doctor-specialty-dc.component.scss']
})
export class VisitingDoctorSpecialtyDcComponent implements OnInit, OnChanges {
  specialtyArray: SpecialtyDetails[] = [];
  lang: string;
  visitingReason: string;
  vdYesOrNo: BilingualText;
  participantAttendence: BilingualText;
  @Input() disabilityDetails: DisabiliyDtoList;
  @Input() isReassessment = false;
  @Input() isScheduleReminder = false;
  @Input() isNoReturn = false;
  @Input() parentForm: FormGroup;
  @Input() isVdRequired = false;
  @Input() modifiedDisability = false;
  @Output() selectedVd = new EventEmitter();
  yesOrNoList: LovList = new LovList([]);
  visitingDoctorForm: FormGroup;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>,readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.yesOrNoList = new LovList([
      { value: { english: 'Yes', arabic: 'نعم' }, sequence: 0, code: 1001 },
      { value: { english: 'No', arabic: 'لا' }, sequence: 1, code: 1002 }
    ]);
    this.disabilityDetails ? (this.initilaiseRadioValues(), this.toGetVisitingReason()) : null;
    if (this.isNoReturn && this.parentForm) {
    this.parentForm.addControl('visitingDoctorFormValue', this.visitingDoctorForm);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.disabilityDetails) {
      this.initilaiseRadioValues();
      this.toGetVisitingReason();
    }
    if (changes && changes.isReassessment) {
      this.isReassessment = changes.isReassessment.currentValue;
    }
  }
  initilaiseRadioValues() {
    this.vdYesOrNo = this.disabilityDetails?.isVdRequired === true ? this.forYes : this.forNo;
    this.disabilityDetails?.isParticipantAttendanceRequired === 'Yes'
      ? (this.participantAttendence = this.forYes)
      : this.disabilityDetails?.isParticipantAttendanceRequired === 'No'
      ? (this.participantAttendence = this.forNo)
      : (this.participantAttendence = { english: 'Virtual', arabic: 'افتراضي' });
      if (this.isNoReturn) {
        this.visitingDoctorForm = this.createVisitingDoctorForm(); 
      }
  }
  forYes: BilingualText = {
    english: 'Yes',
    arabic: 'نعم'
  };
  forNo: BilingualText = {
    english: 'No',
    arabic: 'لا'
  };
  // To get Visiting reasons
  toGetVisitingReason() {
    this.visitingReason = this.disabilityDetails?.vdDetails?.vdReasonDescription;
  }
  createVisitingDoctorForm() {
    return this.fb.group({
      visitingDoctor: this.fb.group({
        english: [this.participantAttendence?.english, Validators.required],
        arabic: [null]
      })
    });
  }
  selectVd(type) {
    this.selectedVd.emit(type);
  }
}
