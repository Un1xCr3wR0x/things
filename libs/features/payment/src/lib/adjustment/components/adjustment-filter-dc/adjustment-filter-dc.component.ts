import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  Inject,
  SimpleChanges,
  OnChanges,
  HostListener
} from '@angular/core';
import { InputDaterangeDcComponent, InputDateDcComponent, FilterDcComponent } from '@gosi-ui/foundation-theme/src';
import { BilingualText, LovList, LanguageToken } from '@gosi-ui/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AdjustmentDetailsFilter, SelectedBenefits } from '../../../shared/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pmt-adjustment-filter-dc',
  templateUrl: './adjustment-filter-dc.component.html',
  styleUrls: ['./adjustment-filter-dc.component.scss']
})
export class AdjustmentFilterDcComponent implements OnInit, OnChanges {
  /**
   * Referring datepicker and daterange picker
   */
  @ViewChild('benefitDateRangePicker') benefitDateRangePicker: InputDaterangeDcComponent;
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('datePicker') datePicker: InputDateDcComponent;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;

  //input variables
  @Input() adjustList: LovList;
  // output varaiables
  @Output() adjustDetailsFilter: EventEmitter<AdjustmentDetailsFilter> = new EventEmitter();

  /**
   * Status list Values
   */
  adjustmentStatusList = [
    {
      english: 'Active',
      arabic: 'نشيط'
    },
    {
      english: 'New',
      arabic: 'جديد'
    },
    {
      english: 'Paid Up',
      arabic: 'مدفوع'
    },
    {
      english: 'Recovered',
      arabic: 'مستعاد'
    },
    {
      english: 'Cancelled',
      arabic: 'ملغى'
    }
  ];
  /**
   * adjustment type list Values
   */
  adjustmentTypeList = [
    {
      english: 'Credit',
      arabic: 'دائن'
    },
    {
      english: 'Debit',
      arabic: 'مدين'
    }
  ];

  /**
   * calendar variables
   */
  maxdate: Date;
  selectedRequestDate: Array<Date>;
  selectedDateCreated: Array<Date>;
  DateCreatedFormController = new FormControl();
  benefitRequestDateFormController = new FormControl();
  benefitDateCreatedFormController = new FormControl();
  benefitTypeFilterForm: FormGroup;

  /**
   * Component local variables
   */
  lang = 'en';
  adjustmentDetailTypeFilterForm: FormGroup;
  statusFilterForm: FormGroup;
  selectedAdjustList = [];
  adjustFilter: AdjustmentDetailsFilter = new AdjustmentDetailsFilter();
  selectedAdjustmentTypeOptions: Array<BilingualText>;
  selectedAdjustmentStatusOptions: Array<BilingualText>;
  adjustmentStatusValue: BilingualText[];
  adjustmentTypeValue: Array<BilingualText>;
  selectedBenefitType: SelectedBenefits[] = [];

  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.maxdate = new Date();
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.adjustmentStatusList.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    this.adjustmentDetailTypeFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.adjustmentTypeList.forEach(() => {
      const control = new FormControl(false);
      (this.adjustmentDetailTypeFilterForm.controls.items as FormArray).push(control);
    });
    this.benefitTypeFilterForm = this.fb.group({
      selectedBenefit: this.fb.group({
        english: [''],
        arabic: ['']
      })
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.adjustList.currentValue) {
      this.adjustList = changes.adjustList.currentValue;
    }
  }
  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.adjustFilter.adjustmentStatus = [];
    this.adjustFilter.adjustmentType = [];
  }
  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    if (this.selectedAdjustmentTypeOptions && this.selectedAdjustmentTypeOptions.length >= 1) {
      this.adjustmentTypeValue = this.selectedAdjustmentTypeOptions;
    } else {
      this.adjustmentTypeValue = null;
    }
    if (this.selectedAdjustmentStatusOptions && this.selectedAdjustmentStatusOptions.length >= 1) {
      this.adjustmentStatusValue = this.selectedAdjustmentStatusOptions;
    } else {
      this.adjustmentStatusValue = null;
    }
    if (this.benefitDateCreatedFormController.value && this.benefitDateCreatedFormController.value.length >= 1) {
      this.selectedDateCreated = this.benefitDateCreatedFormController.value;
    } else {
      this.selectedDateCreated = null;
    }
    if (this.benefitRequestDateFormController.value && this.benefitRequestDateFormController.value.length >= 1) {
      this.selectedRequestDate = this.benefitRequestDateFormController.value;
    } else {
      this.selectedRequestDate = null;
    }
    this.adjustFilter.adjustmentType = this.adjustmentTypeValue;
    this.adjustFilter.adjustmentStatus = this.adjustmentStatusValue;
    if (this.selectedDateCreated) {
      this.adjustFilter.startDate = this.selectedDateCreated[0];
      this.adjustFilter.stopDate = this.selectedDateCreated[1];
    }
    if (this.selectedRequestDate) {
      this.adjustFilter.benefitRequestStartDate = this.selectedRequestDate[0];
      this.adjustFilter.benefitRequestStopDate = this.selectedRequestDate[1];
    }
    if (this.selectedBenefitType && this.selectedBenefitType.length > 0) {
      this.adjustFilter.benefitType = this.selectedBenefitType.map(benefitType => {
        return { english: benefitType.english, arabic: benefitType.arabic };
      });
    } else if (this.selectedBenefitType && this.selectedBenefitType.length === 0) {
      this.adjustFilter.benefitType = [];
    }
    this.adjustDetailsFilter.emit(this.adjustFilter);
  }
  /**
   * This method is to clear the filters
   */

  clearAllFiters(): void {
    this.selectedAdjustmentTypeOptions = null;
    this.selectedAdjustmentStatusOptions = null;
    this.adjustmentDetailTypeFilterForm.reset();
    this.statusFilterForm.reset();
    this.benefitRequestDateFilterClear();
    this.benefitDateCreatedFilterClear();
    this.defaultFilter();
    this.benefitTypeFilterClear();
    this.adjustDetailsFilter.emit(this.adjustFilter);
  }
  /**
   * This method is to clear the filter adjust Type values
   */
  adjustmentDetailClear() {
    this.selectedAdjustmentTypeOptions = null;
    this.adjustmentDetailTypeFilterForm.reset();
  }
  benefitTypeFilterClear() {
    this.selectedBenefitType = [];
    this.adjustFilter.benefitType = null;
    this.benefitTypeFilterForm.reset();
  }
  /**
   * This method is to clear the filter status values
   */
  statusFilterClear() {
    this.selectedAdjustmentStatusOptions = null;
    this.statusFilterForm.reset();
  }
  /**
   * This method is to clear the initiated date in filter
   */
  benefitDateCreatedFilterClear() {
    this.adjustFilter.startDate = undefined;
    this.adjustFilter.stopDate = undefined;
    this.benefitDateCreatedFormController.reset();
  }
  benefitRequestDateFilterClear() {
    this.adjustFilter.benefitRequestStartDate = undefined;
    this.adjustFilter.benefitRequestStopDate = undefined;
    this.benefitRequestDateFormController.reset();
  }
  /**
   * method to set the scroll for filter
   */
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
    else if (this.dateRangePicker?.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
    if (this.benefitDateRangePicker?.dateRangePicker?.isOpen) this.benefitDateRangePicker.dateRangePicker.hide();
    else if (this.benefitDateRangePicker?.dateRangePicker?.isOpen) this.benefitDateRangePicker.dateRangePicker.hide();
  }
  /**
   * Method to hide filter on outside click
   */
  @HostListener('window:mousedown', ['$event'])
  onMouseUp(event): void {
    if (
      this.filterbutton.isOpen &&
      (this.filterbutton.filterContent.nativeElement.contains(event.target) ||
        ((this.benefitDateRangePicker?.dateRangePicker.isOpen ||
          this.dateRangePicker?.dateRangePicker.isOpen ||
          this.datePicker?.datePicker.isOpen) &&
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

  selectedValue(value) {
    this.selectedBenefitType = value;
  }
}
