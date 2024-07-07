import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { BilingualText, FilterKeyEnum, FilterKeyValue, LanguageToken, Lov, LovList } from '@gosi-ui/core';
import { FilterDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pmt-tpa-adjustment-list-filter-dc',
  templateUrl: './tpa-adjustment-list-filter-dc.component.html',
  styleUrls: ['./tpa-adjustment-list-filter-dc.component.scss']
})
export class TpaAdjustmentListFilterDcComponent implements OnInit {
  //Local Variables
  private _filters: Array<FilterKeyValue>;
  filteredRequestBy: Array<BilingualText>;
  filteredStatus: Array<BilingualText>;
  requestedByControl: FormGroup;
  benefitControl: FormGroup;
  filteredBenefitTypes: Array<BilingualText>;
  roleLovs: Lov[];
  private _filterStatusList: BilingualText[];

  /** Child components */
  @ViewChild('filter', { static: false })
  filter: FilterDcComponent;

  //Input Variables
  @Input() requestedByLovList: LovList;
  @Input() benefitTypeLovList: LovList;
  @Input() adjustmentStatusList: Array<BilingualText>;
  @Input() filterId: string;

  statusFilterForm: FormGroup;
  lang: string;
  @Input() set filterStatusList(status: BilingualText[]) {
    this._filterStatusList = status;
    if (status) {
      this.statusFilterForm = this.fb.group({
        items: new FormArray([])
      });
      status.forEach(() => {
        const control = new FormControl(false);
        (this.statusFilterForm.controls.items as FormArray).push(control);
      });
    }
  }

  get filterStatusList() {
    return this._filterStatusList;
  }

  @Input() set tpaAdjustmentFilters(filters: Array<FilterKeyValue>) {
    this.initialState();
    if (filters?.length > 0) {
      this._filters = filters;

      this.filteredRequestBy =
        filters.filter(item => item.key === FilterKeyEnum.REQUESTED_BY)?.length > 0
          ? filters.filter(item => item.key === FilterKeyEnum.REQUESTED_BY)[0]?.bilingualValues
          : [];

      this.filteredBenefitTypes =
        filters.filter(item => item.key === FilterKeyEnum.BENEFITE_TYPE)?.length > 0
          ? filters.filter(item => item.key === FilterKeyEnum.BENEFITE_TYPE)[0]?.bilingualValues
          : [];

      this.filteredStatus =
        filters.filter(item => item.key === FilterKeyEnum.STATUS)?.length > 0
          ? filters.filter(item => item.key === FilterKeyEnum.STATUS)[0]?.bilingualValues
          : [];
      if (this.filteredStatus) {
        this._filterStatusList.forEach((status, index) => {
          if (this.filteredStatus.some(selectedStatus => selectedStatus.english === status.english)) {
            this.statusFilterForm.get('items')?.get(index.toString())?.setValue(true);
          }
        });
      }
    }
  }

  get filters() {
    return this._filters;
  }

  //Output Variables
  @Output() reset = new EventEmitter();
  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();

  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.initialState();
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  clearAllFiters() {
    this.initialState();
    this.reset.emit();
  }

  onScroll() {}

  initialState() {
    this._filters = [];
    this.requestedByControl = this.fb.group({
      english: [null],
      arabic: [null]
    });
    this.benefitControl = this.fb.group({
      english: [null],
      arabic: [null]
    });
    this.statusFilterForm?.reset();
    this.filteredRequestBy = [];
    this.filteredBenefitTypes = [];
    this.filteredStatus = [];
  }

  applyFilter() {
    const appliedFilters = [];

    if (this.filteredRequestBy?.length > 0) {
      appliedFilters.push({ key: FilterKeyEnum.REQUESTED_BY, bilingualValues: this.filteredRequestBy });
    }

    if (this.filteredStatus?.length > 0) {
      appliedFilters.push({ key: FilterKeyEnum.STATUS, bilingualValues: this.filteredStatus });
    }

    if (this.filteredBenefitTypes?.length > 0) {
      const codes = this.getCodes(this.benefitTypeLovList.items, this.filteredBenefitTypes);
      appliedFilters.push({
        key: FilterKeyEnum.BENEFITE_TYPE,
        bilingualValues: this.filteredBenefitTypes,
        codes: codes
      });
    }
    this.apply.emit(appliedFilters);
  }

  getCodes(lovs: Array<Lov>, bilinguals: Array<BilingualText>) {
    const codes = bilinguals.reduce((agg, item) => {
      if (lovs?.filter(lov => lov.value.english === item.english)?.length > 0) {
        agg.push(lovs.filter(lov => lov.value.english === item.english)[0]?.code);
      }
      return agg;
    }, []);
    return codes;
  }

  /**
   * method to cancel the filter from parent component
   */
  cancelFilter() {
    this.filter.cancelFilter();
  }

  /**
   * This method is to clear the filter status values
   */
  statusFilterClear() {
    this.filteredStatus = null;
    this.statusFilterForm.reset();
  }
  /**
   * This method is to clear the filter requested by values
   */
  requestedByFilterClear() {
    this.filteredRequestBy = null;
    this.requestedByControl.reset();
  }

  /**
   * This method is to clear the filter benefit type values
   */
  benefitTypeFilterClear() {
    this.filteredBenefitTypes = null;
    this.benefitControl.reset();
  }

  /**
   * Method to hide filter on outside click
   */
  @HostListener('window:mousedown', ['$event'])
  onMouseUp(event): void {
    if (this.filter.isOpen && !this.filter.filterContent.nativeElement.contains(event.target)) {
      this.filter.cancelFilter();
    }
  }
}
