import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { AddMemberFilterRequest, SessionRequest } from '../../../shared';

@Component({
  selector: 'mb-participant-filter-dc',
  templateUrl: './participant-filter-dc.component.html',
  styleUrls: ['./participant-filter-dc.component.scss']
})
export class ParticipantFilterDcComponent implements OnInit, OnChanges {
  locationForm: FormGroup = new FormGroup({});
  assessmentTypeForm: FormGroup = new FormGroup({});
  specialtyForm: FormGroup = new FormGroup({});
  selectedassessmentType: BilingualText[] = [];
  selectedLocation: BilingualText[] = [];
  selectedSpecialty: BilingualText[] = [];
  locationValues: BilingualText[];
  specialtyValues: BilingualText[];
  assessmentTypeValues: BilingualText[];
  participantFilter: AddMemberFilterRequest = new AddMemberFilterRequest();
  @Input() specialtyList: LovList;
  @Input() locationList: LovList;
  @Input() assessmentTypeLists: LovList;
  @Input() assessmentTypeList: LovList;
  @Input() request: SessionRequest = new SessionRequest();
  @Input() isPmb = false;
  @Input() fieldLocationList:LovList;
  @Output() filter: EventEmitter<AddMemberFilterRequest> = new EventEmitter();
  constructor(readonly fb: FormBuilder) {}

  ngOnInit() {
    this.locationForm = this.getLocationForm();
    this.assessmentTypeForm = this.getAssessmentTypeForm();
    this.specialtyForm = this.getSpecialtyForm();
  }
  /*
   * Method to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.request && changes.request.currentValue) {
      this.request = changes.request.currentValue;
      this.participantFilter = changes.request.currentValue.filterData;
      this.initiateFilter();
    }
    if (changes?.locationList?.currentValue) {
      this.locationList = changes?.locationList?.currentValue;
    }
    if (changes?.specialtyList?.currentValue) {
      this.specialtyList = changes?.specialtyList?.currentValue;
    }
    if (changes?.assessmentTypeLists?.currentValue) {
      this.assessmentTypeLists = changes?.assessmentTypeLists?.currentValue;
    }
  }
  getLocationForm(): FormGroup {
    return this.fb.group({
      location: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getAssessmentTypeForm(): FormGroup {
    return this.fb.group({
      type: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getSpecialtyForm(): FormGroup {
    return this.fb.group({
      specialty: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  initiateFilter() {}
  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.participantFilter.speciality = [];
    this.participantFilter.assessmentType = [];
    this.participantFilter.location = [];
  }
  applyFilter() {
    if (this.selectedLocation && this.selectedLocation.length >= 1) {
      this.locationValues = this.selectedLocation;
    } else {
      this.locationValues = null;
    }

    if (this.selectedSpecialty && this.selectedSpecialty.length >= 1) {
      this.specialtyValues = this.selectedSpecialty;
    } else {
      this.specialtyValues = null;
    }
    if (this.selectedassessmentType && this.selectedassessmentType.length >= 1) {
      this.assessmentTypeValues = this.selectedassessmentType;
    } else {
      this.assessmentTypeValues = null;
    }
    this.participantFilter.location = this.locationValues;
    this.participantFilter.speciality = this.specialtyValues;
    this.participantFilter.assessmentType = this.assessmentTypeValues;
    this.filter.emit(this.participantFilter);
  }
  clearAllFilter() {
    this.assessmentTypeForm.get('type').reset();
    this.locationForm.get('location').reset();
    this.specialtyForm.get('specialty').reset();
    this.selectedLocation = null;
    this.selectedSpecialty = null;
    this.selectedassessmentType = null;
    this.defaultFilter();
    this.filter.emit(this.participantFilter);
  }
}
