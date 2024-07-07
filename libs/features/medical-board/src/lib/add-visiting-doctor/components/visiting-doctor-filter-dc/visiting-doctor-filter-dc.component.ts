import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BilingualText, LovList } from '@gosi-ui/core';
import { VisitingFilterRequest } from '../../../shared';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'mb-visiting-doctor-filter-dc',
  templateUrl: './visiting-doctor-filter-dc.component.html',
  styleUrls: ['./visiting-doctor-filter-dc.component.scss']
})
export class VisitingDoctorFilterDcComponent implements OnInit {
  //Input Variable
  @Input() specialtyList: LovList;
  @Input() locationList: LovList;
  @Input() regionList: LovList;

  //local Variable
  selectedLocation: BilingualText[] = [];
  selectedSpecialty: BilingualText[] = [];
  selectedRegion: BilingualText[] = [];
  locationValues: BilingualText[];
  regionValues: BilingualText[];
  specialtyValues: BilingualText[];
  visitingFilter: VisitingFilterRequest = new VisitingFilterRequest();
  //  formValues
  locationForm: FormGroup = new FormGroup({});
  specialtyForm: FormGroup = new FormGroup({});
  regionForm: FormGroup = new FormGroup({});
  // Output variable
  @Output() filter: EventEmitter<VisitingFilterRequest> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.locationForm = this.getLocationForm();
    this.specialtyForm = this.getSpecialtyForm();
    this.regionForm = this.getRegionForm();
  }
  getLocationForm(): FormGroup {
    return this.fb.group({
      location: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getRegionForm(): FormGroup {
    return this.fb.group({
      region: this.fb.group({
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

    if (this.selectedRegion && this.selectedRegion.length >= 1) {
      this.regionValues = this.selectedRegion;
    } else {
      this.regionValues = null;
    }

    this.visitingFilter.location = this.locationValues;
    this.visitingFilter.speciality = this.specialtyValues;
    this.visitingFilter.region = this.regionValues;
    this.filter.emit(this.visitingFilter);
  }
  clearAllFilter() {
    this.locationForm.get('location').reset();
    this.specialtyForm.get('specialty').reset();
    this.regionForm.get('region').reset();
    this.selectedLocation = null;
    this.selectedSpecialty = null;
    this.selectedRegion = null;
    this.defaultFilter();
    this.filter.emit(this.visitingFilter);
  }
  defaultFilter() {
    this.visitingFilter.speciality = [];
    this.visitingFilter.location = [];
    this.visitingFilter.region = [];
  }
}
