import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BilingualText, LovList } from '@gosi-ui/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { BenefitRequestFilter } from '../../../shared/models/benefit-request-filter';
import {
  InputDaterangeDcComponent,
  FilterDcComponent,
  SearchDcComponent,
  SortDcComponent
} from '@gosi-ui/foundation-theme/src/lib/components';
import { Observable, of } from 'rxjs';
import { BenefitGroup } from '../../../shared/enum/benefit-group';

@Component({
  selector: 'bnt-benefit-request-filter-dc',
  templateUrl: './benefit-request-filter-dc.component.html',
  styleUrls: ['./benefit-request-filter-dc.component.scss']
})
export class BenefitRequestFilterDcComponent implements OnInit, OnChanges {
  /**
   * Referring datepicker and filter button
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;
  @ViewChild('searchComponent') searchComponent: SearchDcComponent;
  @ViewChild('sortComponent') sortComponent: SortDcComponent;

  @Input() benefitTypeList: LovList;
  @Input() benefitGroup: string;
  /** Output Variables */
  @Output() benefitRequestFilterEvent: EventEmitter<BenefitRequestFilter> = new EventEmitter();

  BenefitGroup = BenefitGroup;
  searchForm: FormGroup;
  requestDateFilterForm = new FormControl();
  benefitRequestFilter: BenefitRequestFilter = new BenefitRequestFilter(); //This object stores values from filter,search and sort
  benefitTypeFilterForm: FormGroup;
  benefitTypeValues: BilingualText[];
  selectedBenefitOptions: Array<BilingualText>;
  selectedPeriodDate: Array<Date>;
  maxdate: Date;
  requestSort: Observable<LovList>;
  direction = 'ASCENDING';
  benefitTypes: Array<BilingualText> = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.benefitRequestFilter.requestSortParam = 'REQUEST_DATE';
    this.maxdate = new Date();
    this.benefitTypeFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.requestSort = of(
      new LovList([
        {
          value: {
            english: 'Request Date',
            arabic: 'تاريخ الطلب'
          },
          sequence: 1
        }
      ])
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitTypeList && changes.benefitTypeList.currentValue) {
      this.benefitTypeList.items.forEach(data => {
        if (data) {
          this.benefitTypes.push(data.value);
        }
      });
      this.benefitTypes.forEach(() => {
        const control = new FormControl(false);
        (this.benefitTypeFilterForm.controls.items as FormArray).push(control);
      });
    }
  }

  /** ------------------------- Filter Related Functions ------------------------------ */
  applyFilter() {
    if (this.requestDateFilterForm.value && this.requestDateFilterForm.value.length >= 1) {
      this.selectedPeriodDate = this.requestDateFilterForm.value;
    } else {
      this.selectedPeriodDate = null;
    }
    if (this.selectedBenefitOptions && this.selectedBenefitOptions.length >= 1) {
      this.benefitTypeValues = this.selectedBenefitOptions;
    } else {
      this.benefitTypeValues = null;
    }
    if (this.selectedPeriodDate) {
      this.benefitRequestFilter.requestPeriodFrom = this.selectedPeriodDate[0];
      this.benefitRequestFilter.requestPeriodTo = this.selectedPeriodDate[1];
    }
    this.benefitRequestFilter.benefitTypes = this.benefitTypeValues;
    this.benefitRequestFilterEvent.emit(this.benefitRequestFilter);    
  }

  /** Method to clear the filters */
  clearAllFiters(): void {
    this.selectedBenefitOptions = null;
    this.requestDateFilterForm.reset();
    this.benefitTypeFilterForm.reset();
    this.defaultFilter();
    this.benefitRequestFilterEvent.emit(this.benefitRequestFilter);
  }

  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.benefitRequestFilter.requestPeriodFrom = undefined;
    this.benefitRequestFilter.requestPeriodTo = undefined;
    this.benefitRequestFilter.benefitTypes = [];
  }

  /**
   * Method to hide datepicker while scrolling
   */
  onScroll() {
    if (this.dateRangePicker?.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }

  @HostListener('window:mousedown', ['$event'])
  onMouseUp(event): void {
    if (
      this.filterbutton.isOpen &&
      (this.filterbutton.filterContent.nativeElement.contains(event.target) ||
        (this.dateRangePicker?.dateRangePicker.isOpen &&
          !this.filterbutton.filterContent.nativeElement.contains(event.target)))
    ) {
      this.filterbutton.onShown();
    } else if (this.filterbutton.filterBtnRef.nativeElement.contains(event.target)) {
      if (!this.filterbutton.isOpen) {
        this.filterbutton.onHidden();
      } else {
        this.filterbutton.onShown();
      }
    } else {
      this.filterbutton.onHidden();
    }
  }

  /** -------------------------- Search Related Functons -------------------------- */
  onSearchKey(searchKey: string) {
    this.benefitRequestFilter.searchKey = searchKey;
    this.benefitRequestFilterEvent.emit(this.benefitRequestFilter);
  }

  resetSearch() {
    this.benefitRequestFilter.searchKey = undefined;
    this.searchComponent.control.reset();
  }

  /** ------------------------------- Sort Related Functions ------------------------------------- */
  sortOrder(order) {
    if (order === 'DESC') {
      this.direction = 'DESCENDING';
    } else {
      this.direction = 'ASCENDING';
    }
    this.benefitRequestFilter.sortType = this.direction;
    if (this.benefitRequestFilter.requestSortParam) this.benefitRequestFilterEvent.emit(this.benefitRequestFilter);
  }
  sortList() {
    this.benefitRequestFilter.sortType = this.direction;
    this.benefitRequestFilterEvent.emit(this.benefitRequestFilter);
  }
  resetSort() {
    this.sortComponent.sortListForm.reset();
  }
}
