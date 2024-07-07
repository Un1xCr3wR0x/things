/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  InputDaterangeDcComponent,
  InputDateDcComponent,
  FilterDcComponent
} from '@gosi-ui/foundation-theme/src/lib/components';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BilingualText, LanguageToken, LovList, Lov } from '@gosi-ui/core';
import { HeirBenefitFilter } from '../../models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-benefit-history-filter-dc',
  templateUrl: './benefit-history-filter-dc.component.html',
  styleUrls: ['./benefit-history-filter-dc.component.scss']
})
export class BenefitHistoryFilterDcComponent implements OnInit, OnChanges {
  /**
   * Referring datepicker and daterange picker
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('datePicker') datePicker: InputDateDcComponent;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;

  //input variables
  @Input() heirList: LovList;
  /**
   * calendar variables
   */
  totalItems;
  maxdate: Date;
  selectedLastDate: Date;
  selectedPeriodDate: Array<Date>;
  benefitPeriodDateFormController = new FormControl();
  lastActionlDateFormController = new FormControl();
  /**
   * Component local variables
   */
  lang = 'en';
  statusFilterForm: FormGroup;
  informationTypeFilterForm: FormGroup;
  heirNamesFilterForm: FormGroup;
  selectedInformationTypeOptions: Array<BilingualText>;
  selectedStatusOptions: Array<BilingualText>;
  informationTypeValue: BilingualText[];
  statusValue: BilingualText[];
  heirFilter: HeirBenefitFilter = new HeirBenefitFilter();
  selectedHeirsList: Lov[] = [];
  selectedHeirsIds: number[] = [];
  filteredNames: BilingualText[] = [];
  /**
   * Status list Values
   */
  benefitStatusList = [
    {
      english: 'Active',
      arabic: 'نشيط'
    },
    {
      english: 'Paid Up',
      arabic: 'نشيط'
    },
    {
      english: 'Stopped',
      arabic: 'نشيط'
    },
    {
      english: 'On Hold',
      arabic: 'نشيط'
    }
  ];

  /**
   * info type list Values
   */
  informationTypeList = [
    {
      english: 'Benefit',
      arabic: 'النظام'
    },
    {
      english: 'Event',
      arabic: 'المكتب'
    }
  ];
  // output varaiables
  @Output() heirDetailsFilter: EventEmitter<HeirBenefitFilter> = new EventEmitter();

  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.maxdate = new Date();

    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.benefitStatusList.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    this.informationTypeFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.informationTypeList.forEach(() => {
      const control = new FormControl(false);
      (this.informationTypeFilterForm.controls.items as FormArray).push(control);
    });
    this.heirNamesFilterForm = this.bilingualFormGroup();
  }
  bilingualFormGroup() {
    return this.fb.group({
      english: '',
      arabic: ''
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.heirList.currentValue) {
      this.heirList = changes.heirList.currentValue;
    }
  }

  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.heirFilter.benefitPeriodFrom = undefined;
    this.heirFilter.benefitPeriodTo = undefined;
    this.heirFilter.benefitStatus = [];
    this.heirFilter.informationType = [];
    this.heirFilter.personIds = [];
  }
  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    if (this.selectedInformationTypeOptions && this.selectedInformationTypeOptions.length >= 1) {
      this.informationTypeValue = this.selectedInformationTypeOptions;
    } else {
      this.informationTypeValue = null;
    }
    if (this.selectedHeirsIds && this.selectedHeirsIds.length >= 1) {
      this.heirFilter.personIds = this.selectedHeirsIds;
    }

    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValue = this.selectedStatusOptions;
    } else {
      this.statusValue = null;
    }
    if (this.benefitPeriodDateFormController.value && this.benefitPeriodDateFormController.value.length >= 1) {
      this.selectedPeriodDate = this.benefitPeriodDateFormController.value;
    } else {
      this.selectedPeriodDate = null;
    }
    this.heirFilter.informationType = this.informationTypeValue;
    this.heirFilter.benefitStatus = this.statusValue;
    if (this.selectedPeriodDate) {
      this.heirFilter.benefitPeriodFrom = this.selectedPeriodDate[0];
      this.heirFilter.benefitPeriodTo = this.selectedPeriodDate[1];
    }
    this.heirDetailsFilter.emit(this.heirFilter);
  }

  /**
   * This method is to clear the filters
   */

  clearAllFiters(): void {
    this.selectedInformationTypeOptions = null;
    this.selectedStatusOptions = null;
    this.informationTypeFilterForm.reset();
    this.statusFilterForm.reset();
    this.benefitPeriodDateFormController.reset();
    this.heirNamesFilterForm.reset();
    this.defaultFilter();
    this.heirDetailsFilter.emit(this.heirFilter);
  }
  /**
   * This method is to clear the filter channel values
   */
  informationTypeFilterClear() {
    this.selectedInformationTypeOptions = null;
    this.informationTypeFilterForm.reset();
  }
  /**
   * This method is to clear the filter status values
   */
  statusFilterClear() {
    this.selectedStatusOptions = null;
    this.statusFilterForm.reset();
  }
  /**
   * This method is to clear the initiated date in filter
   */
  benefitPeriodDateFilterClear() {
    this.heirFilter.benefitPeriodFrom = undefined;
    this.heirFilter.benefitPeriodTo = undefined;
    this.benefitPeriodDateFormController.reset();
  }

  /**
   * Method to hide datepicker while scrolling
   */
  onScroll() {
    if (this.datePicker?.datePicker.isOpen) this.datePicker.datePicker.hide();
    else if (this.dateRangePicker?.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
  /**
   * Method to hide filter on outside click
   */
  @HostListener('window:mousedown', ['$event'])
  onMouseUp(event): void {
    if (
      this.filterbutton.isOpen &&
      (this.filterbutton.filterContent.nativeElement.contains(event.target) ||
        ((this.dateRangePicker?.dateRangePicker.isOpen || this.datePicker?.datePicker.isOpen) &&
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

  selectedValue(valueList: Lov[]) {
    if (valueList && valueList.length >= 1) {
      this.selectedHeirsIds = [];
      valueList.forEach(value => {
        if (value && value.code) {
          this.selectedHeirsIds.push(value.code);
        }
      });
    } else {
      this.selectedHeirsIds = [];
    }
    if (this.selectedHeirsIds.length >= 1) {
      this.selectedHeirsIds = this.selectedHeirsIds.filter(
        (element, i) => i === this.selectedHeirsIds.indexOf(element)
      );
    }
  }
}
