import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FilterKeyValue } from '../../../shared/models/filier-key-value';
import moment from 'moment-timezone';
import { startOfDay, LovList, BilingualText, LanguageToken, GosiCalendar } from '@gosi-ui/core';
import { InputDaterangeDcComponent, FilterDcComponent } from '@gosi-ui/foundation-theme';
import { ClaimSummaryDetails } from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { TreatmentService } from '../../../shared/models/treatment-service';

@Component({
  selector: 'oh-treatment-filiter-dc',
  templateUrl: './treatment-filiter-dc.component.html',
  styleUrls: ['./treatment-filiter-dc.component.scss']
})
export class TreatmentFiliterDcComponent implements OnInit, OnChanges {
  filterForm: FormGroup;
  lang = 'en';
  isSelected = false;
  hasAppliedFilter = false;
  maximumDate: Date;
  minimumDate: Date;
  resetMinimum: number;
  resetMaximum: number;
  setDate = false;
  filteredServiceType: BilingualText[] = [];
  @Input() serviceTypeList: LovList;
  @Input() maximumValue: number;
  @Input() minimumValue: number;
  @Input() treatmentList: TreatmentService = new TreatmentService();

  /** Output variables */
  @Output() getTreatmentServiceDetails = new EventEmitter(null);
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.resetMinimum = this.minimumValue;
    this.resetMaximum = this.maximumValue;
    if (!this.filterForm?.get('serviceType')) {
      this.filterForm = this.createFilterForm();
    }
  }
  /** Method to detect chnages in input. */

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.minimumValue?.currentValue) {
      this.minimumValue = changes.minimumValue?.currentValue;
    }
    if (changes && changes.maximumValue?.currentValue) {
      this.maximumValue = changes.maximumValue.currentValue;
    }
    if (changes && changes.treatmentList?.currentValue) {
      this.treatmentList = changes.treatmentList.currentValue;
      if (this.treatmentList?.services?.length > 0 && this.treatmentList?.services[0]?.treatmentDate && !this.setDate) {
        const date = new Date(this.treatmentList.services[0].treatmentDate);
        let maxDate = date;
        let minDate = date;
        this.treatmentList?.services.forEach(element => {
          if (minDate > new Date(element.treatmentDate)) {
            minDate = new Date(element.treatmentDate);
          }
          if (maxDate < new Date(element.treatmentDate)) {
            maxDate = new Date(element.treatmentDate);
          }
          this.maximumDate = maxDate;
          this.minimumDate = minDate;
        });
        this.setDate = true;
      }
    }
  }
  /** Method to handle filter request. */
  handleFilterReset(): void {
    this.hasAppliedFilter = false;
    this.filterForm.reset(this.createFilterForm());
    this.handleTypeReset();
    this.filterForm.get('claimRangePicker').setValue([this.resetMinimum, this.resetMaximum]);
    this.assembleOperationParams();
  }
  handleTypeReset(): void {
    this.filteredServiceType = [];
    this.filterForm.get('serviceType').get('english').setValue(null);
    this.filterForm.get('serviceType').get('arabic').setValue(null);
  }
  /** Method to fetch contributor on filter */
  handleFilterTreatmentService(): void {
    this.hasAppliedFilter = true;
    if (this.checkFilterForm()) {
      this.assembleOperationParams();
    } else this.hasAppliedFilter = false;
  }
  /** Method to assemble operation params. */
  assembleOperationParams() {
    const operationParams = {};
    if (this.checkFilterForm()) operationParams['filter'] = this.getFilterParams();
    this.getTreatmentServiceDetails.emit(operationParams);
  }
  /** Method to check filter form is valid or not. */
  checkFilterForm() {
    return this.hasAppliedFilter && this.filterForm.valid;
  }
  /** Method to create filter form. */
  createFilterForm() {
    return this.fb.group({
      dateRangePicker: [],
      claimRangePicker: new FormControl([this.minimumValue, this.maximumValue]),
      serviceType: this.fb.group({
        english: [],
        arabic: []
      })
    });
  }
  /** Method to get filter params. */
  getFilterParams(): FilterKeyValue {
    const formValue = this.filterForm.value;
    const filterRequest: FilterKeyValue = new FilterKeyValue();
    if (this.filterForm.get('claimRangePicker').value) {
      filterRequest.maxAmount = formValue.claimRangePicker[1];
      filterRequest.minAmount = formValue.claimRangePicker[0];
    }

    if (!this.isSelected) {
      filterRequest.maxAmount = null;
      filterRequest.minAmount = null;
    }
    this.isSelected = false;
    if (formValue.dateRangePicker?.length === 2) {
      filterRequest.endDate = moment(startOfDay(formValue.dateRangePicker[1])).format('YYYY-MM-DD');
      filterRequest.startDate = moment(startOfDay(formValue.dateRangePicker[0])).format('YYYY-MM-DD');
    }
    if (formValue.serviceType?.english?.length > 0) {
      filterRequest.type = this.filteredServiceType;
    }
    return filterRequest;
  }
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
  setAmount() {
    this.isSelected = true;
  }
}
