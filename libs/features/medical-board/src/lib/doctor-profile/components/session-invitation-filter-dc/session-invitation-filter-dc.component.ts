import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { SessionFilterRequest } from '../../../shared/models/session-filter-request';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme/lib/components/widgets/input-daterange-dc/input-daterange-dc.component';

@Component({
  selector: 'mb-session-invitation-filter-dc',
  templateUrl: './session-invitation-filter-dc.component.html',
  styleUrls: ['./session-invitation-filter-dc.component.scss']
})
export class SessionInvitationFilterDcComponent implements OnInit {
  // @Input() specialtyList: LovList;
  @Input() locationList: LovList;
  // @Input() regionList: LovList;

  //local Variable

  requestDateFilterForm = new FormControl();
  selectedLocation: BilingualText[] = [];
  selectedStatus: BilingualText[] = [];
  // selectedRegion: BilingualText[] = [];
  locationValues: BilingualText[];
  // regionValues: BilingualText[];
  statusValues: BilingualText[];
  // visitingFilter: visitingFilterRequest = new visitingFilterRequest();
  sessionFilter: SessionFilterRequest = new SessionFilterRequest();
  //  formValues
  locationForm: FormGroup = new FormGroup({});
  statusForm: FormGroup = new FormGroup({});
  selectedPeriodDate: Array<Date>;
  @Output() filter: EventEmitter<SessionFilterRequest> = new EventEmitter();
  @Input() statusList: LovList;
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  // regionForm: FormGroup = new FormGroup({});

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.locationForm = this.getLocationForm();
    this.statusForm = this.getStatusForm();
    // this.regionForm = this.getRegionForm();
  }
  getLocationForm(): FormGroup {
    return this.fb.group({
      location: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  // getRegionForm(): FormGroup {
  //   return this.fb.group({
  //     region: this.fb.group({
  //       english: [null],
  //       arabic: [null]
  //     })
  //   });
  // }
  getStatusForm(): FormGroup {
    return this.fb.group({
      status: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  applyFilter() {
    if (this.requestDateFilterForm.value && this.requestDateFilterForm.value.length >= 1) {
      this.selectedPeriodDate = this.requestDateFilterForm.value;
    } else {
      this.selectedPeriodDate = null;
    }
    if (this.selectedLocation && this.selectedLocation.length >= 1) {
      this.locationValues = this.selectedLocation;
    } else {
      this.locationValues = null;
    }

    if (this.selectedStatus && this.selectedStatus.length >= 1) {
      this.statusValues = this.selectedStatus;
    } else {
      this.statusValues = null;
    }

    // if (this.selectedRegion && this.selectedRegion.length >= 1) {
    //   this.regionValues = this.selectedRegion;
    // } else {
    //   this.regionValues = null;
    // }
    if (this.selectedPeriodDate) {
      this.sessionFilter.sessionPeriodFrom = this.selectedPeriodDate[0];
      this.sessionFilter.sessionPeriodTo = this.selectedPeriodDate[1];
    }
    this.sessionFilter.fieldOffice = this.locationValues;
    this.sessionFilter.status = this.statusValues;
    // this.sessionFilter.region = this.regionValues;
    this.filter.emit(this.sessionFilter);
  }
  clearAllFilter() {
    this.locationForm.get('location').reset();
    this.statusForm.get('status').reset();
    this.requestDateFilterForm.reset();
    // this.regionForm.get('region').reset();
    this.selectedLocation = null;
    this.selectedStatus = null;
    // this.selectedRegion = null;
    this.defaultFilter();
    this.filter.emit(this.sessionFilter);
  }
  defaultFilter() {
    this.sessionFilter.sessionPeriodFrom = undefined;
    this.sessionFilter.sessionPeriodTo = undefined;
    this.sessionFilter.status = [];
    this.sessionFilter.fieldOffice = [];
    // this.visitingFilter.region = [];
  }
  onScroll() {
    if (this.dateRangePicker?.dateRangePicker?.isOpen) this.dateRangePicker?.dateRangePicker?.hide();
  }
}
