/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Output,
  EventEmitter,
  Inject,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { BilingualText, LanguageToken, LovList } from '@gosi-ui/core';
import { InputDaterangeDcComponent, FilterDcComponent } from '@gosi-ui/foundation-theme/src';
import { DependentHistoryFilter, DependentTransaction, DependentDetails } from '../../models';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'bnt-dependent-history-filter-dc',
  templateUrl: './dependent-history-filter-dc.component.html',
  styleUrls: ['./dependent-history-filter-dc.component.scss']
})
export class DependentHistoryFilterDcComponent implements OnInit, OnChanges {
  // TODO: Changes this component name and variable name common to heir and dependent
  /**
   * Referring datepicker and filter button
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;

  @Input() isHeir = false;
  @Input() dependentHistory: DependentTransaction[];
  @Input() dependentDetails: DependentDetails[];
  @Input() dependentEventsList: LovList;
  // output varaiables
  @Output() dependentFilterEvent: EventEmitter<DependentHistoryFilter> = new EventEmitter();

  dependentPeriodForm = new FormControl();
  dependentNameFilterForm: FormGroup;
  dependentHistoryFilter: DependentHistoryFilter = new DependentHistoryFilter();
  dependentValues: Array<number>;
  selectedPeriodDate: Array<Date>;
  selectedEventTypes: Array<BilingualText>;
  selectedDependents: BilingualText[];
  eventFilterForm: FormGroup;
  eventValues: BilingualText[];
  maxdate: Date;
  lang = 'en';
  dependentHistoryFilter$: Observable<LovList>;
  /**
   * Payment and Payment events lst values
   */
  dependentEvents = [];
  dependentNamesList = [];
  dependentNamesListInput = [];
  pickedDependentListProps;

  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.maxdate = new Date();
    if (!this.eventFilterForm) {
      this.eventFilterForm = this.fb.group({
        items: new FormArray([])
      });
    }
    this.dependentNameFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getDependentNamesFilter();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.dependentDetails && changes.dependentDetails.currentValue && !changes.firstChange) {
      this.dependentNameFilterForm = this.fb.group({
        items: new FormArray([])
      });
      this.getDependentNamesFilter();
    }

    if (changes && changes.dependentEventsList && changes.dependentEventsList.currentValue) {
      this.eventFilterForm = this.fb.group({
        items: new FormArray([])
      });
      this.dependentEventsList.items.forEach(data => {
        if (data) {
          this.dependentEvents.push(data.value);
        }
      });
      if (!this.eventFilterForm) {
        this.eventFilterForm = this.fb.group({
          items: new FormArray([])
        });
      }
      if (this.eventFilterForm) {
        this.eventFilterForm = this.fb.group({
          items: new FormArray([])
        });
        this.dependentEventsList.items.forEach(() => {
          const control = new FormControl(false);
          (this.eventFilterForm?.controls?.items as FormArray).push(control);
        });
      }
    }
  }

  getDependentNamesFilter() {
    this.dependentNamesListInput = this.dependentDetails?.map(x => x.name);
    if (this.dependentNamesListInput) this.dependentNamesList = this.getDependentNameList();
    this.pickedDependentListProps = this.dependentDetails?.map(row => pick(row, ['name', 'personId']));
    if (this.dependentNameFilterForm) {
      this.pickedDependentListProps?.forEach(() => {
        const control = new FormControl(false);
        (this.dependentNameFilterForm?.controls?.items as FormArray)?.push(control);
      });
    }
    function pick(obj, keys) {
      return keys.map(k => (k in obj ? { [k]: obj[k] } : {})).reduce((res, o) => Object.assign(res, o), {});
    }
  }

  getDependentNameList() {
    if (!this.dependentNamesListInput?.length) {
      return;
    }
    const dependentNameList = this.dependentNamesListInput.map(depedentName => {
      return {
        arabic: `${depedentName.arabic.firstName} ${depedentName.arabic.secondName} ${
          depedentName.arabic?.thirdName ? depedentName.arabic?.thirdName : ''
        } ${depedentName.arabic.familyName}`,
        english: depedentName.english.name
      };
    });
    return dependentNameList;
  }

  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    if (this.dependentPeriodForm?.value && this.dependentPeriodForm?.value?.length >= 1) {
      this.selectedPeriodDate = this.dependentPeriodForm?.value;
    } else {
      this.selectedPeriodDate = null;
    }

    if (this.selectedEventTypes && this.selectedEventTypes?.length >= 1) {
      this.eventValues = this.selectedEventTypes;
    } else {
      this.eventValues = null;
    }
    if (this.selectedDependents && this.selectedDependents?.length >= 1) {
      this.dependentValues = this.pickedDependentListProps
        .filter((x, i) => (this.dependentNameFilterForm?.controls?.items as FormArray).controls[i].value)
        .map(x => x.personId);
    } else {
      this.dependentValues = null;
    }
    if (this.selectedPeriodDate) {
      this.dependentHistoryFilter.benefitPeriodFrom = this.selectedPeriodDate[0];
      this.dependentHistoryFilter.benefitPeriodTo = this.selectedPeriodDate[1];
    }
    this.dependentHistoryFilter.dependentNames = this.dependentValues;
    this.dependentHistoryFilter.dependentEvents = this.eventValues;
    this.dependentFilterEvent.emit(this.dependentHistoryFilter);
  }

  /** Method to clear the filters */
  clearAllFiters(): void {
    this.selectedDependents = null;
    this.selectedEventTypes = null;
    this.dependentPeriodForm.reset();
    this.dependentNameFilterForm.reset();
    this.eventFilterForm.reset();
    this.defaultFilter();
    this.dependentFilterEvent.emit(this.dependentHistoryFilter);
  }

  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.dependentHistoryFilter.benefitPeriodFrom = undefined;
    this.dependentHistoryFilter.benefitPeriodTo = undefined;
    this.dependentHistoryFilter.dependentEvents = [];
    this.dependentHistoryFilter.dependentNames = [];
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
}
