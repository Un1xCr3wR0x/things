import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, Lov, LovList } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FilterKeyEnum } from '../../enums';
import { FilterKeyValue } from '../../models';
import { getCodes } from '../../utils';

@Component({
  selector: 'est-branch-filter-dc',
  templateUrl: './branch-filter-dc.component.html',
  styleUrls: ['./branch-filter-dc.component.scss']
})
export class BranchFilterDcComponent implements OnInit {
  filteredRoles: Array<BilingualText>;
  filteredStatus: Array<BilingualText>;
  filteredLocation: Array<BilingualText>;
  filteredLegalEntity: Array<BilingualText>;
  locationControl: FormGroup;
  legalEntityControl: FormGroup;
  statusBilingual$: Observable<BilingualText[]>;
  _locationList$: Observable<LovList>;
  statusLovs: Lov[];
  legalEntityLov: Lov[];
  fieldOfficeLovs: Lov[];
  private _filters: FilterKeyValue[];

  @Input() isDynamicPositionRequired = true;
  @Input() showRoles = false;
  @Input() showLocation = true;
  @Input() showLegalEntity = true;
  @Input() showStatus = true;
  @Input() roleList$: Observable<BilingualText[]>;
  _legalEntityList$: Observable<LovList>;
  @Input() set statusList$(values$: Observable<LovList>) {
    this.statusBilingual$ = values$?.pipe(
      tap(res => (this.statusLovs = res.items)),
      map(res => res.items.map(lov => lov.value))
    );
  }
  @Input() get locationList$() {
    return this._locationList$;
  }
  set locationList$(values$: Observable<LovList>) {
    this._locationList$ = values$?.pipe(tap(res => (this.fieldOfficeLovs = res.items)));
  }
  @Input() get legalEntityList$() {
    return this._legalEntityList$;
  }
  set legalEntityList$(values$: Observable<LovList>) {
    this._legalEntityList$ = values$?.pipe(tap(res => (this.legalEntityLov = res.items)));
  }
  @Input() set branchFilters(filters: FilterKeyValue[]) {
    this.setInitialState();
    if (filters) {
      this._filters = filters;
      this.filteredStatus = this.getFilterValues(filters, FilterKeyEnum.STATUS);
      this.filteredLocation = this.getFilterValues(filters, FilterKeyEnum.LOCATION);
      this.filteredLegalEntity = this.getFilterValues(filters, FilterKeyEnum.LEGAL_ENITY);
      this.filteredRoles = this.getFilterValues(filters, FilterKeyEnum.ROLES);
    }
  }

  get filters() {
    return this._filters;
  }

  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setInitialState();
  }

  setInitialState() {
    this.locationControl = this.fb.group({
      english: '',
      arabic: ''
    });
    this.legalEntityControl = this.fb.group({
      english: '',
      arabic: ''
    });
    this.filteredLegalEntity = [];
    this.filteredLocation = [];
    this.filteredStatus = [];
    this.filteredRoles = [];
    this._filters = [];
  }

  getFilterValues(filters: Array<FilterKeyValue>, key: FilterKeyEnum): Array<BilingualText> {
    const customFilters = filters.filter(item => item.key === key);
    if (customFilters.length > 0 && customFilters[0]?.bilingualValues?.length > 0) {
      return customFilters[0]?.bilingualValues;
    } else {
      return [];
    }
  }

  setStatus(status: BilingualText[]) {
    this.filteredStatus = status;
  }

  setRoles(roles: BilingualText[]) {
    this.filteredRoles = roles;
  }

  applyFilter() {
    const appliedFilters: FilterKeyValue[] = [];
    if (this.filteredStatus?.length > 0) {
      const codes = getCodes(this.statusLovs, this.filteredStatus);
      appliedFilters.push({ key: FilterKeyEnum.STATUS, bilingualValues: this.filteredStatus, codes: codes });
    }
    if (this.filteredLocation?.length > 0) {
      const codes = getCodes(this.fieldOfficeLovs, this.filteredLocation);
      appliedFilters.push({ key: FilterKeyEnum.LOCATION, bilingualValues: this.filteredLocation, codes: codes });
    }
    if (this.filteredLegalEntity?.length > 0) {
      const codes = getCodes(this.legalEntityLov, this.filteredLegalEntity);
      appliedFilters.push({ key: FilterKeyEnum.LEGAL_ENITY, bilingualValues: this.filteredLegalEntity, codes: codes });
    }
    if (this.filteredRoles?.length > 0) {
      appliedFilters.push({ key: FilterKeyEnum.ROLES, bilingualValues: this.filteredRoles });
    }
    this.apply.emit(appliedFilters);
  }

  clearAllFilters() {
    this.setInitialState();
    this.apply.emit([]);
  }
  onScroll() {}
}
