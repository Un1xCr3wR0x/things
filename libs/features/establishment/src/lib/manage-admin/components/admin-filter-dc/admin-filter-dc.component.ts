import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, Lov, LovList } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FilterKeyEnum, FilterKeyValue, getCodes } from '../../../shared';

@Component({
  selector: 'est-admin-filter-dc',
  templateUrl: './admin-filter-dc.component.html',
  styleUrls: ['./admin-filter-dc.component.scss']
})
export class AdminFilterDcComponent implements OnInit {
  nationalityControl: FormGroup;

  filterRoles: Array<BilingualText>;
  filteredNationalites: Array<BilingualText>;

  @Input() roleList$: Observable<BilingualText[]>;
  _nationalityList$: Observable<LovList>;
  nationalityLovs: Lov[];
  private _filters: FilterKeyValue[];

  @Input() get nationalityList$() {
    return this._nationalityList$;
  }
  set nationalityList$(values$: Observable<LovList>) {
    this._nationalityList$ = values$?.pipe(tap(res => (this.nationalityLovs = res.items)));
  }

  @Input() set adminFilters(filters: Array<FilterKeyValue>) {
    this.setInitialState();
    if (filters?.length > 0) {
      this._filters = filters;
      this.filterRoles =
        filters.filter(item => item.key === FilterKeyEnum.ROLES)?.length > 0
          ? filters.filter(item => item.key === FilterKeyEnum.ROLES)[0]?.bilingualValues
          : [];
      this.filteredNationalites =
        filters.filter(item => item.key === FilterKeyEnum.NATIONALITY)?.length > 0
          ? filters.filter(item => item.key === FilterKeyEnum.NATIONALITY)[0]?.bilingualValues
          : [];
    }
  }

  get filters() {
    return this._filters;
  }

  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();
  @Output() reset = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.setInitialState();
  }

  setInitialState() {
    this.nationalityControl = this.fb.group({
      english: '',
      arabic: ''
    });
    this.filterRoles = [];
    this.filteredNationalites = [];
    this._filters = [];
  }

  onScroll() {}

  clearAllFiters() {
    this.setInitialState();
    this.reset.emit();
  }

  applyFilter() {
    const appliedFilters = [];
    if (this.filterRoles?.length > 0) {
      appliedFilters.push({ key: FilterKeyEnum.ROLES, bilingualValues: this.filterRoles });
    }
    if (this.filteredNationalites?.length > 0) {
      const codes = getCodes(this.nationalityLovs, this.filteredNationalites);
      appliedFilters.push({ key: FilterKeyEnum.NATIONALITY, bilingualValues: this.filteredNationalites, codes: codes });
    }
    this.apply.emit(appliedFilters);
  }

  setRoles(values: BilingualText[]) {
    this.filterRoles = values;
  }
}
