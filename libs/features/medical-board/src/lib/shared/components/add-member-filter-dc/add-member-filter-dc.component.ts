import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, Lov, LovList } from '@gosi-ui/core/lib/models';
import { MBConstants } from '../../constants';
import { AddMemberFilterRequest } from '../../models';
import { AddSessionMemberRequest } from '../../models/add-session-member-request';

@Component({
  selector: 'mb-add-member-filter-dc',
  templateUrl: './add-member-filter-dc.component.html',
  styleUrls: ['./add-member-filter-dc.component.scss']
})
export class AddMemberFilterDcComponent implements OnInit, OnChanges {
  @Input() specialityLists: LovList;
  @Input() fieldOfficeLists: LovList;
  @Input() addGosiDoctor: boolean;
  @Input() addContractedDoctor: boolean;
  @Input() isAmbOfficer: boolean;
  @Input() isAdhoc: boolean;
  @Input() addMemberRequest: AddSessionMemberRequest = new AddSessionMemberRequest();

  @Output() filter: EventEmitter<AddMemberFilterRequest> = new EventEmitter();
  specialityForm: FormGroup;
  selectedSpecialityOption: BilingualText[] = [];
  subSpecialityForm: FormGroup;
  selectedSubSpecialityOption: BilingualText[] = [];
  locationForm: FormGroup;
  selectedLocationOption: BilingualText[] = [];
  subSpecialityLists: LovList;

  availabilityList: LovList;
  availabilityForm: FormGroup;
  selectedAvailabilityOption: BilingualText[] = [];
  medicalBoardTypeLists = MBConstants.MEDICAL_BOARD_TYPE;
  medicalBoardTypeList: BilingualText[] = [];
  medicalBoardTypeForm: FormGroup;
  selectedMedicalBoardTypeOption: BilingualText[] = [];
  addMemberFilter: AddMemberFilterRequest = new AddMemberFilterRequest();
  specialityValues: BilingualText[];
  subSpecialityValues: BilingualText[];
  locationValues: BilingualText[];
  availabilityValues: BilingualText[];
  medicalBoardTypeValues: BilingualText[];
  tempList: Lov[];

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.specialityForm = this.getSpecialityForm();
    this.subSpecialityForm = this.getSubSpecialtyForm();
    this.locationForm = this.getFieldOfficeForm();
    this.availabilityList = new LovList(MBConstants.AVAILABILITY_LIST);
    this.availabilityForm = this.fb.group({
      english: [null],
      arabic: [null]
    });
    this.medicalBoardTypeLists?.forEach(item => {
      this.medicalBoardTypeList.push(item?.value);
    });
    this.medicalBoardTypeForm = this.fb.group({
      items: new FormArray([])
    });
    this.medicalBoardTypeList.forEach(() => {
      const control = new FormControl(false);
      (this.medicalBoardTypeForm.controls.items as FormArray).push(control);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.addMemberRequest && changes.addMemberRequest.currentValue) {
      this.addMemberRequest = changes.addMemberRequest.currentValue;
      this.addMemberFilter = changes.addMemberRequest.currentValue.filter;
      this.initiateFilter();
    }
    if (changes?.fieldOfficeLists?.currentValue) {
      this.fieldOfficeLists = changes?.fieldOfficeLists?.currentValue;
    }
    if (changes?.specialityLists?.currentValue) {
      this.specialityLists = changes?.specialityLists?.currentValue;
    }
  }

  initiateFilter() {}

  getFieldOfficeForm(): FormGroup {
    return this.fb.group({
      office: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  getSpecialityForm(): FormGroup {
    return this.fb.group({
      speciality: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  getSubSpecialtyForm(): FormGroup {
    return this.fb.group({
      subSpeciality: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  specialitySelected(items) {
    this.selectedSpecialityOption = items;
    if (this.selectedSpecialityOption.length > 0) {
      this.tempList = new Array<Lov>();
      this.selectedSpecialityOption.forEach(item => {
        this.specialityLists?.items.forEach(ele => {
          if (item?.english === ele?.value?.english) {
            ele?.items.forEach(data => {
              this.tempList.push(data);
            });
          }
        });
      });
      this.subSpecialityLists = new LovList(this.tempList);
    } else {
      this.subSpecialityLists = new LovList([]);
    }
    let count = 1;
    this.subSpecialityLists.items.forEach(element => {
      element.sequence = count++;
    });
  }

  defaultFilter() {
    this.addMemberFilter.availability = [];
    this.addMemberFilter.medicalBoardType = [];
    this.addMemberFilter.location = [];
    this.addMemberFilter.speciality = [];
    this.addMemberFilter.subSpeciality = [];
  }

  applyFilter() {
    if (this.selectedSpecialityOption && this.selectedSpecialityOption.length >= 1) {
      this.specialityValues = this.selectedSpecialityOption;
    } else {
      this.specialityValues = null;
    }

    if (this.selectedSubSpecialityOption && this.selectedSubSpecialityOption.length >= 1) {
      this.subSpecialityValues = this.selectedSubSpecialityOption;
    } else {
      this.subSpecialityValues = null;
    }

    if (this.selectedLocationOption && this.selectedLocationOption.length >= 1) {
      this.locationValues = this.selectedLocationOption;
    } else {
      this.locationValues = null;
    }

    if (this.selectedAvailabilityOption && this.selectedAvailabilityOption.length >= 1) {
      this.availabilityValues = this.selectedAvailabilityOption;
    } else {
      this.availabilityValues = null;
    }

    if (this.selectedMedicalBoardTypeOption && this.selectedMedicalBoardTypeOption.length >= 1) {
      this.medicalBoardTypeValues = this.selectedMedicalBoardTypeOption;
    } else {
      this.medicalBoardTypeValues = null;
    }

    this.addMemberFilter.speciality = this.specialityValues;
    this.addMemberFilter.subSpeciality = this.subSpecialityValues;
    this.addMemberFilter.location = this.locationValues;
    this.addMemberFilter.availability = this.availabilityValues;
    this.addMemberFilter.medicalBoardType = this.medicalBoardTypeValues;

    this.filter.emit(this.addMemberFilter);
  }

  clearAllFilter() {
    this.specialityForm.get('speciality').reset();
    this.subSpecialityForm.get('subSpeciality').reset();
    this.locationForm.get('office').reset();
    this.availabilityForm.reset();
    this.medicalBoardTypeForm.reset();
    this.selectedSpecialityOption = null;
    this.selectedSubSpecialityOption = null;
    this.selectedLocationOption = null;
    this.selectedAvailabilityOption = null;
    this.selectedMedicalBoardTypeOption = null;
    this.defaultFilter();

    this.filter.emit(this.addMemberFilter);
  }
  onAvailabilitySelect(event) {
    this.selectedAvailabilityOption = [];
    this.availabilityList.items.forEach(item => {
      if (item.value.english === event) {
        this.selectedAvailabilityOption.push(item.value);
      }
    });
  }
}
