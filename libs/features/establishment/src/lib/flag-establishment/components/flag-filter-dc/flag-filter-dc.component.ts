import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, Lov, LovList } from '@gosi-ui/core';
import { FilterDcComponent } from '@gosi-ui/foundation-theme/src';
import { FilterKeyEnum, FilterKeyValue, getCodes } from '../../../shared';

@Component({
  selector: 'est-flag-filter-dc',
  templateUrl: './flag-filter-dc.component.html',
  styleUrls: ['./flag-filter-dc.component.scss']
})
export class FlagFilterDcComponent implements OnInit {
  //Local Variables
  private _filters: Array<FilterKeyValue>;
  reasonControl: FormGroup;
  filteredReasons: Array<BilingualText>;
  reasonLovs: Lov[];
  periodControl: FormControl = new FormControl();
  roleControl: FormGroup;
  maxDate: Date;
  minDate: Date;
  filteredTypes: Array<BilingualText>;
  roleLovs: Lov[];

  /** Child components */
  @ViewChild('filter', { static: false })
  filter: FilterDcComponent;

  //Input Variables
  @Input() reasonList: LovList;
  @Input() creationTypeLovList: LovList;
  @Input() filterId: string;

  @Input() set flagFilters(filters: Array<FilterKeyValue>) {
    this.initialState();
    if (filters?.length > 0) {
      this._filters = filters;
      const period = filters.filter(item => item.key === FilterKeyEnum.PERIOD);

      if (period?.length > 0) {
        this.periodControl.setValue([period[0]?.values[0], period[0]?.values[1]]);
      }
      this.filteredReasons =
        filters.filter(item => item.key === FilterKeyEnum.REASON)?.length > 0
          ? filters.filter(item => item.key === FilterKeyEnum.REASON)[0]?.bilingualValues
          : [];

      this.filteredTypes =
        filters.filter(item => item.key === FilterKeyEnum.APPLIED_BY)?.length > 0
          ? filters.filter(item => item.key === FilterKeyEnum.APPLIED_BY)[0]?.bilingualValues
          : [];
    }
  }

  get filters() {
    return this._filters;
  }

  //Output Variables
  @Output() reset = new EventEmitter();
  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initialState();
  }

  clearAllFiters() {
    this.initialState();
    this.reset.emit();
  }

  onScroll() {}
  initialState() {
    this._filters = [];
    this.periodControl = new FormControl();
    this.reasonControl = this.fb.group({
      english: [null],
      arabic: [null]
    });
    this.roleControl = this.fb.group({
      english: [null],
      arabic: [null]
    });
    this.filteredReasons = [];
    this.filteredTypes = [];
  }

  applyFilter() {
    const appliedFilters = [];
    if (this.periodControl?.value?.length > 0) {
      appliedFilters.push({
        key: FilterKeyEnum.PERIOD,
        values: [this.periodControl?.value[0], this.periodControl.value[1]]
      });
    }
    if (this.filteredReasons?.length > 0) {
      appliedFilters.push({ key: FilterKeyEnum.REASON, bilingualValues: this.filteredReasons });
    }

    if (this.filteredTypes?.length > 0) {
      const codes = getCodes(this.creationTypeLovList.items, this.filteredTypes);
      appliedFilters.push({ key: FilterKeyEnum.APPLIED_BY, bilingualValues: this.filteredTypes, codes: codes });
    }
    this.apply.emit(appliedFilters);
  }

  /**
   * method to cancel the filter from parent component
   */
  cancelFilter() {
    this.filter.cancelFilter();
  }
}
