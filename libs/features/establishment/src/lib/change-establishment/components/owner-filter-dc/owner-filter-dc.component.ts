import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { ActiveFilterEnum, FilterKeyEnum, FilterKeyValue } from '../../../shared';

@Component({
  selector: 'est-owner-filter-dc',
  templateUrl: './owner-filter-dc.component.html',
  styleUrls: ['./owner-filter-dc.component.scss']
})
export class OwnerFilterDcComponent implements OnInit {
  maxDate = new Date();
  private _minDate: Date;
  activeList = [ActiveFilterEnum.ACTIVE, ActiveFilterEnum.INACTIVE];
  filteredStatus: Array<ActiveFilterEnum>;
  filteredNationality: BilingualText[] = [];

  @Input()
  get minDate() {
    const start = new Date(this._minDate);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  set minDate(minDate: Date) {
    this._minDate = minDate ? new Date(minDate) : undefined;
  }

  private _filters: Array<FilterKeyValue>;
  @Input()
  get filters() {
    return this._filters;
  }
  set filters(newFilters: Array<FilterKeyValue>) {
    this.initialState();
    if (newFilters?.length > 0) {
      this._filters = newFilters;
      const period = newFilters.filter(item => item.key === FilterKeyEnum.PERIOD);
      const status = newFilters.filter(item => item.key === FilterKeyEnum.STATUS);
      const nationalityList = newFilters.filter(item => item.key === FilterKeyEnum.NATIONALITY);
      if (period?.length > 0) {
        this.periodControl.setValue([period[0]?.values[0], period[0]?.values[1]]);
      }
      if (status?.length > 0) {
        this.filteredStatus = status[0].translateKeys as ActiveFilterEnum[];
      }
      if (nationalityList?.length > 0) {
        this.filteredNationality = nationalityList[0].bilingualValues;
      }
    }
  }

  @Input() nationalityList$: Observable<LovList>; //populate dropdown
  @Input() status$: Observable<LovList>; //populate dropdown

  @Output() reset = new EventEmitter();
  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();
  hasFilterParams = false;

  nationalityControl: FormGroup;
  periodControl: FormControl = new FormControl();

  constructor(readonly fb: FormBuilder) {
    this.nationalityControl = this.bilingualFormGroup();
  }

  ngOnInit(): void {}

  // ngOnChanges(changes: SimpleChanges) {}

  bilingualFormGroup() {
    return this.fb.group({
      english: '',
      arabic: ''
    });
  }

  applyFilter() {
    this.apply.emit(this.getAppliedFilters());
  }

  clearAllFiters() {
    this.initialState();
    this.reset.emit();
  }

  onScroll() {}

  setStatus(tags: ActiveFilterEnum[]) {
    this.filteredStatus = tags;
  }

  initialState() {
    this.filteredNationality = [];
    this.filteredStatus = [];
    this.periodControl = new FormControl();
    this._filters = [];
  }

  selectNationalities(value: BilingualText[]) {
    this.filteredNationality = value;
    this.checkForParams();
  }

  checkForParams() {
    this.hasFilterParams = this.getAppliedFilters()?.length > 0 ? true : false;
  }

  getAppliedFilters(): FilterKeyValue[] {
    const value = [];
    if (this.filteredStatus.indexOf(this.activeList[0]) !== -1) {
      value.push(ActiveFilterEnum.ACTIVE);
    }
    if (this.filteredStatus.indexOf(this.activeList[1]) !== -1) {
      value.push(ActiveFilterEnum.INACTIVE);
    }
    const appliedFilters: Array<FilterKeyValue> = [];
    if (this.periodControl?.value?.length > 0) {
      appliedFilters.push({
        key: FilterKeyEnum.PERIOD,
        values: [this.periodControl?.value[0], this.periodControl.value[1]]
      });
    }

    if (value.length > 0) {
      appliedFilters.push({ key: FilterKeyEnum.STATUS, translateKeys: value });
    }
    if (this.filteredNationality?.length > 0) {
      appliedFilters.push({ key: FilterKeyEnum.NATIONALITY, bilingualValues: [...this.filteredNationality] });
    }
    return appliedFilters;
  }
}
