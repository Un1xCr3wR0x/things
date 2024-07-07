/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  BilingualText,
  FilterKeyEnum,
  FilterKeyValue,
  LanguageToken,
  LovList,
  convertToYYYYMMDD,
  greaterThanLessThanValidator
} from '@gosi-ui/core';
import { FilterDcComponent, InputMultiCheckboxDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject } from 'rxjs';
import { TransactionCodeEnum } from '../../../shared';
import { FilterStatusConstants } from '../../../shared/constants';
import { DefaultAmounts, FilterHistory, HistoryRequest, ViolationFilterResponse } from '../../../shared/models';

@Component({
  selector: 'vol-violation-history-filter-dc',
  templateUrl: './violation-history-filter-dc.component.html',
  styleUrls: ['./violation-history-filter-dc.component.scss']
})
export class ViolationHistoryFilterDcComponent implements OnInit, OnChanges {
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;
  /**
   * Component local variables
   */
  filterHistory: FilterHistory = new FilterHistory();
  historyRequest: HistoryRequest = new HistoryRequest();
  lang = 'en';
  maximumDate: Date;
  selectedChannelOptions: Array<BilingualText>;
  selectedStatusOptions: Array<BilingualText>;
  selectedViolationTypeOptions: Array<BilingualText>;
  statusFilterForm: FormGroup;
  statusList: LovList;
  transactionStatusList: BilingualText[] = [];
  violationDateReportedForm = new FormControl();
  violationFilterForm: FormGroup;
  hasFilter: Boolean = false;
  minPenaltyAmount: number = 0;
  maxPenaltyAmount: number = 1000;
  minPaidAmount: number = 0;
  maxPaidAmount: number = 1000;
  defaultMinPenaltyAmount: number;
  defaultMaxPenaltyAmount: number;
  defaultMinPaidAmount: number;
  defaultMaxPaidAmount: number;
  initialMinPenaltyAmount: number = 0;
  initialMaxPenaltyAmount: number = 1000;
  initialMinPaidAmount: number = 0;
  initialMaxPaidAmount: number = 1000;
  /**
   *Input variables
   */
  @Input() channelList: LovList;
  @Input() inspectionType: LovList = new LovList([]);
  @Input() violationFilterResponse: ViolationFilterResponse = new ViolationFilterResponse();
  @Input() typeList: LovList;
  @Input() violationType: LovList = new LovList([]);
  @Input() clearFilterHistory: FilterHistory = new FilterHistory();
  @Input() hasFiltered: Boolean;
  @Input() defaultAmounts: DefaultAmounts;
  /**
   *Output variables
   */
  @Output() historyDetailsFilter: EventEmitter<FilterHistory> = new EventEmitter();
  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();

  //ViewChild variables
  @ViewChild('statusCheckBox') statusCheckBox: InputMultiCheckboxDcComponent;

  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.maximumDate = new Date();
    this.violationFilterForm = this.createFilterForm();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.violationFilterResponse)
      this.violationFilterResponse = changes.violationFilterResponse?.currentValue;
    if (this.violationFilterResponse) {
      this.initiateStatusFilter();
      this.initiateAmountFilters(false);
    }
    if (changes && changes.defaultAmounts) {
      this.defaultAmounts = changes.defaultAmounts?.currentValue;
      this.defaultMinPaidAmount = this.defaultAmounts?.defaultPaidMinAmount;
      this.defaultMaxPaidAmount = this.defaultAmounts?.defaultPaidMaxAmount;
    }
    if (changes && changes.hasFiltered) {
      this.hasFilter = this.hasFiltered ? true : false;
      this.hasFiltered = undefined;
    }
    if (changes && changes.clearFilterHistory) {
      this.setFilterHistory();
      this.clearFilterForm();
      this.setFilterFormValues();
    }
  }
  checkForSliderChange(isPenalty: boolean) {
    if (isPenalty) {
      const sliderPenaltyForm = this.violationFilterForm?.get('penaltyAmount')?.get('sliderPenaltyAmount');
      this.minPenaltyAmount = sliderPenaltyForm?.value[0];
      this.maxPenaltyAmount = sliderPenaltyForm?.value[1];
    } else {
      const sliderPaidForm = this.violationFilterForm?.get('paidAmount')?.get('sliderPaidAmount');
      this.minPaidAmount = sliderPaidForm?.value[0];
      this.maxPaidAmount = sliderPaidForm?.value[1];
    }
    this.initiateAmountFilters(true);
  }

  setViolationDate() {
    this.setFilterBoolean();
  }

  setViolationType(val) {
    this.selectedViolationTypeOptions = val;
    this.setFilterBoolean();
  }

  setStatusType(val) {
    this.selectedStatusOptions = val;
    this.setFilterBoolean();
  }

  setChannelType(val) {
    this.selectedChannelOptions = val;
    this.setFilterBoolean();
  }

  setPenaltyAmount() {
    this.setFilterBoolean();
    this.minPenaltyAmount = this.violationFilterForm.get('penaltyAmount').get('minPenaltyAmount').value;
    this.maxPenaltyAmount = this.violationFilterForm.get('penaltyAmount').get('maxPenaltyAmount').value;
    if (this.violationFilterForm.get('penaltyAmount').valid) {
      this.initiateAmountFilters(true);
    }
  }
  setPaidAmount() {
    this.setFilterBoolean();
    this.minPaidAmount = this.violationFilterForm.get('paidAmount').get('minPaidAmount').value;
    this.maxPaidAmount = this.violationFilterForm.get('paidAmount').get('maxPaidAmount').value;
    if (this.violationFilterForm.get('paidAmount').valid) {
      this.initiateAmountFilters(true);
    }
  }

  setFilterBoolean() {
    const penaltyForm = this.violationFilterForm?.get('penaltyAmount');
    this.hasFilter =
      this.selectedViolationTypeOptions?.length > 0
        ? true
        : this.selectedStatusOptions?.length > 0
        ? true
        : this.selectedChannelOptions?.length > 0
        ? true
        : this.violationDateReportedForm?.touched
        ? true
        : // : (penaltyForm?.get('sliderPenaltyAmount').touched || penaltyForm?.get('minPenaltyAmount').touched || penaltyForm?.get('maxPenaltyAmount').touched )
        // ? true
        this.clearFilterHistory?.appliedPenaltyAmountStart !== null
        ? true
        : this.clearFilterHistory?.appliedPaidAmountStart !== null
        ? true
        : false;
  }

  setFilterHistory() {
    this.filterHistory.channel = this.clearFilterHistory.channel;
    this.setChannelType(this.clearFilterHistory.channel);
    this.filterHistory.period = this.clearFilterHistory.period;
    this.filterHistory.violationType = this.clearFilterHistory.violationType;
    this.setViolationType(this.clearFilterHistory.violationType);
    this.filterHistory.status = [];
    this.clearFilterHistory.status.forEach(item => {
      switch (item.english) {
        case FilterStatusConstants.STATUS_APPROVED.english:
          this.filterHistory.status.push(this.getStatusList(TransactionCodeEnum.APPROVE));
          break;
        case FilterStatusConstants.STATUS_CANCELLED.english:
          this.filterHistory.status.push(this.getStatusList(TransactionCodeEnum.CANCEL));
          break;
        case FilterStatusConstants.STATUS_MODIFIED.english:
          this.filterHistory.status.push(this.getStatusList(TransactionCodeEnum.MODIFY));
          break;
      }
    });
    this.filterHistory.appliedPenaltyAmountStart = this.clearFilterHistory?.appliedPenaltyAmountStart;
    this.filterHistory.appliedPenaltyAmountEnd = this.clearFilterHistory?.appliedPenaltyAmountEnd;
    this.filterHistory.appliedPaidAmountStart = this.clearFilterHistory?.appliedPaidAmountStart;
    this.filterHistory.appliedPaidAmountEnd = this.clearFilterHistory?.appliedPaidAmountEnd;
  }

  /**
   * Method to Clear Filter Forms
   */
  clearFilterForm() {
    this.violationFilterForm?.reset();
    this.statusFilterForm?.reset();
  }

  /**
   * Method to set Filter Form values
   */
  setFilterFormValues() {
    let valueChange: boolean = false;
    this.violationFilterForm?.get('channel')?.get('english')?.setValue(this.clearFilterHistory.channel);
    if (this.clearFilterHistory.period.startDate === undefined) {
      this.violationDateReportedForm.reset();
    }
    this.violationFilterForm?.get('violationType')?.get('english')?.setValue(this.clearFilterHistory.violationType);
    this.selectedStatusOptions = [];
    this.clearFilterHistory.status.forEach(item => {
      this.selectedStatusOptions.push(item);
    });
    if (this.clearFilterHistory?.appliedPaidAmountEnd === null) {
      this.minPaidAmount = this.initialMinPaidAmount;
      this.maxPaidAmount = this.initialMaxPaidAmount;
      valueChange = true;
    }
    if (this.clearFilterHistory?.appliedPenaltyAmountEnd === null) {
      this.minPenaltyAmount = this.initialMinPenaltyAmount;
      this.maxPenaltyAmount = this.initialMaxPenaltyAmount;
      valueChange = true;
    }
    this.initiateAmountFilters(valueChange);
    this.applyFilter();
    this.initiateStatusFilter();
  }

  /**
   * Method to initiate filter
   */
  initiateStatusFilter() {
    this.statusList = new LovList(this.violationFilterResponse?.listOfStatus);
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.transactionStatusList = [];
    let item: BilingualText;
    this.statusList?.items?.forEach(status => {
      switch (status.code) {
        case TransactionCodeEnum.APPROVE:
          item = FilterStatusConstants.STATUS_APPROVED;
          break;
        case TransactionCodeEnum.CANCEL:
          item = FilterStatusConstants.STATUS_CANCELLED;
          break;
        case TransactionCodeEnum.MODIFY:
          item = FilterStatusConstants.STATUS_MODIFIED;
          break;
      }
      this.transactionStatusList.push(item);
    });
    this.transactionStatusList?.forEach((value, i) => {
      let control = new FormControl();
      if (this.selectedStatusOptions) {
        this.selectedStatusOptions?.forEach(items => {
          if (items.english === value.english) {
            control = new FormControl(true);
          }
        });
      } else {
        control = new FormControl();
      }
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
  }
  /**
   * Method to initiate Amount filter
   */
  initiateAmountFilters(valueChange: boolean) {
    if (!valueChange) {
      if (
        this.hasFilter &&
        this.violationFilterResponse.appliedPenaltyAmountStart !== null &&
        this.violationFilterResponse.appliedPaidAmountStart !== null
      ) {
        this.minPenaltyAmount = this.violationFilterResponse.appliedPenaltyAmountStart;
        this.maxPenaltyAmount = this.violationFilterResponse.appliedPenaltyAmountEnd;
        this.minPaidAmount = this.violationFilterResponse.appliedPaidAmountStart;
        this.maxPaidAmount = this.violationFilterResponse.appliedPaidAmountEnd;
      } else if (this.hasFilter && this.violationFilterResponse.appliedPenaltyAmountStart !== null) {
        this.minPenaltyAmount = this.violationFilterResponse.appliedPenaltyAmountStart;
        this.maxPenaltyAmount = this.violationFilterResponse.appliedPenaltyAmountEnd;
      } else if (this.hasFilter && this.violationFilterResponse.appliedPaidAmountStart !== null) {
        this.minPaidAmount = this.violationFilterResponse.appliedPaidAmountStart;
        this.maxPaidAmount = this.violationFilterResponse.appliedPaidAmountEnd;
      } else {
        this.minPenaltyAmount = Math.floor(this.violationFilterResponse.penaltyAmountStart);
        this.maxPenaltyAmount = Math.ceil(this.violationFilterResponse.penaltyAmountEnd);
        this.minPaidAmount = Math.floor(this.violationFilterResponse.paidAmountStart);
        this.maxPaidAmount = Math.ceil(this.violationFilterResponse.paidAmountEnd);
        this.initialMinPenaltyAmount = Math.floor(this.violationFilterResponse.penaltyAmountStart);
        this.initialMaxPenaltyAmount = Math.ceil(this.violationFilterResponse.penaltyAmountEnd);
        this.initialMinPaidAmount = Math.floor(this.violationFilterResponse.paidAmountStart);
        this.initialMaxPaidAmount = Math.ceil(this.violationFilterResponse.paidAmountEnd);
      }
    }
    this.createAmountForm();
    this.violationFilterForm
      ?.get('penaltyAmount')
      ?.get('sliderPenaltyAmount')
      .setValue([this.minPenaltyAmount, this.maxPenaltyAmount]);
    this.violationFilterForm?.get('penaltyAmount')?.get('minPenaltyAmount').setValue(this.minPenaltyAmount);
    this.violationFilterForm?.get('penaltyAmount')?.get('maxPenaltyAmount').setValue(this.maxPenaltyAmount);
    this.violationFilterForm
      ?.get('paidAmount')
      ?.get('sliderPaidAmount')
      .setValue([this.minPaidAmount, this.maxPaidAmount]);
    this.violationFilterForm?.get('paidAmount')?.get('minPaidAmount').setValue(this.minPaidAmount);
    this.violationFilterForm?.get('paidAmount')?.get('maxPaidAmount').setValue(this.maxPaidAmount);
  }
  createAmountForm() {
    this.violationFilterForm?.removeControl('penaltyAmount');
    this.violationFilterForm?.removeControl('paidAmount');
    this.violationFilterForm?.addControl(
      'penaltyAmount',
      this.fb.group({
        sliderPenaltyAmount: new FormControl([this.initialMinPenaltyAmount, this.initialMaxPenaltyAmount]),
        minPenaltyAmount: [null, [greaterThanLessThanValidator(this.initialMinPenaltyAmount, this.maxPenaltyAmount)]],
        maxPenaltyAmount: [null, [greaterThanLessThanValidator(this.minPenaltyAmount, this.initialMaxPenaltyAmount)]]
      })
    );
    this.violationFilterForm?.addControl(
      'paidAmount',
      this.fb.group({
        sliderPaidAmount: new FormControl([this.initialMinPaidAmount, this.initialMaxPaidAmount]),
        minPaidAmount: [null, [greaterThanLessThanValidator(this.initialMinPaidAmount, this.maxPaidAmount)]],
        maxPaidAmount: [null, [greaterThanLessThanValidator(this.minPaidAmount, this.initialMaxPaidAmount)]]
      })
    );
  }
  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    if(this.violationFilterForm?.valid){
    const appliedFilters: Array<FilterKeyValue> = [];
    const sliderPenaltyForm = this.violationFilterForm?.get('penaltyAmount')?.get('sliderPenaltyAmount');
    const sliderPaidForm = this.violationFilterForm?.get('paidAmount')?.get('sliderPaidAmount');
    if (this.violationDateReportedForm.value) {
      this.filterHistory.period.startDate = convertToYYYYMMDD(this.violationDateReportedForm.value[0]);
      this.filterHistory.period.endDate = convertToYYYYMMDD(this.violationDateReportedForm.value[1]);
      appliedFilters.push({
        key: FilterKeyEnum.PERIOD,
        values: [this.filterHistory.period.startDate, this.filterHistory.period.endDate]
      });
    } else {
      this.filterHistory.period.startDate = undefined;
      this.filterHistory.period.endDate = undefined;
    }
    if (this.selectedViolationTypeOptions && this.selectedViolationTypeOptions.length > 0) {
      this.filterHistory.violationType = this.selectedViolationTypeOptions;
      appliedFilters.push({ key: FilterKeyEnum.NATIONALITY, bilingualValues: this.selectedViolationTypeOptions });
    } else {
      this.filterHistory.violationType = null;
    }
    if (this.selectedChannelOptions && this.selectedChannelOptions.length > 0) {
      this.filterHistory.channel = this.selectedChannelOptions;
      appliedFilters.push({ key: FilterKeyEnum.ROLES, bilingualValues: this.selectedChannelOptions });
    } else {
      this.filterHistory.channel = null;
    }
    if (this.selectedStatusOptions && this.selectedStatusOptions.length > 0) {
      const selectedOptions = this.selectedStatusOptions.map(a => a);
      appliedFilters.push({ key: FilterKeyEnum.STATUS, bilingualValues: selectedOptions });
      const selectListForStatus = new Array<BilingualText>();
      this.selectedStatusOptions.forEach((item, i) => {
        switch (item.english) {
          case FilterStatusConstants.STATUS_APPROVED.english:
            selectListForStatus.push(this.getStatusList(TransactionCodeEnum.APPROVE));
            break;
          case FilterStatusConstants.STATUS_CANCELLED.english:
            selectListForStatus.push(this.getStatusList(TransactionCodeEnum.CANCEL));
            break;
          case FilterStatusConstants.STATUS_MODIFIED.english:
            selectListForStatus.push(this.getStatusList(TransactionCodeEnum.MODIFY));
            break;
        }
      });
      this.filterHistory.status = selectListForStatus;
    } else {
      this.filterHistory.status = null;
    }
    if (
      this.initialMinPenaltyAmount !== sliderPenaltyForm?.value[0] ||
      this.initialMaxPenaltyAmount !== sliderPenaltyForm?.value[1]
    ) {
      this.filterHistory.appliedPenaltyAmountStart = this.violationFilterForm
        .get('penaltyAmount')
        .get('sliderPenaltyAmount').value[0];
      this.filterHistory.appliedPenaltyAmountEnd = this.violationFilterForm
        .get('penaltyAmount')
        .get('sliderPenaltyAmount').value[1];
      appliedFilters.push({
        key: FilterKeyEnum.PENALTYAMOUNT,
        rangeValues: [this.filterHistory.appliedPenaltyAmountStart, this.filterHistory.appliedPenaltyAmountEnd]
      });
    }
    // else if(this.violationFilterForm.get('penaltyAmount').get('minPenaltyAmount').value || this.violationFilterForm.get('penaltyAmount').get('maxPenaltyAmount').value){
    //   this.filterHistory.appliedPenaltyAmountStart=this.violationFilterForm.get('penaltyAmount').get('minPenaltyAmount').value;
    //   this.filterHistory.appliedPenaltyAmountEnd=this.violationFilterForm.get('penaltyAmount').get('maxPenaltyAmount').value;
    // }else{
    //   this.filterHistory.appliedPenaltyAmountStart=undefined;
    //   this.filterHistory.appliedPenaltyAmountEnd=undefined;
    // }
    if (
      this.initialMinPaidAmount !== sliderPaidForm?.value[0] ||
      this.initialMaxPaidAmount !== sliderPaidForm?.value[1]
    ) {
      this.filterHistory.appliedPaidAmountStart = this.violationFilterForm
        .get('paidAmount')
        .get('sliderPaidAmount').value[0];
      this.filterHistory.appliedPaidAmountEnd = this.violationFilterForm
        .get('paidAmount')
        .get('sliderPaidAmount').value[1];
      appliedFilters.push({
        key: FilterKeyEnum.PAIDAMOUNT,
        rangeValues: [this.filterHistory.appliedPaidAmountStart, this.filterHistory.appliedPaidAmountEnd]
      });
    }
    // else if(this.violationFilterForm.get('paidAmount').get('minPaidAmount').value || this.violationFilterForm.get('paidAmount').get('maxPaidAmount').value){
    //   this.filterHistory.appliedPaidAmountStart=this.violationFilterForm.get('paidAmount').get('minPaidAmount').value;
    //   this.filterHistory.appliedPaidAmountEnd=this.violationFilterForm.get('paidAmount').get('maxPaidAmount').value;
    // }else{
    //   this.filterHistory.appliedPaidAmountStart=undefined;
    //   this.filterHistory.appliedPaidAmountEnd=undefined;
    // }

    this.historyDetailsFilter.emit(this.filterHistory);
    this.apply.emit(appliedFilters);
   }else{
    if (this.filterbutton) {
      this.filterbutton.isOpen = true;
    }
   }
  }

  getStatusList(code: number): BilingualText {
    this.statusList = new LovList(this.violationFilterResponse.listOfStatus);
    let value = new BilingualText();
    this.statusList?.items.forEach(element => {
      if (element.code === code) {
        value = element.value;
      }
    });
    return value;
  }

  /**
   * This method is to create filter form
   */
  createFilterForm() {
    return this.fb.group({
      violationType: this.fb.group({
        english: '',
        arabic: ''
      }),
      channel: this.fb.group({
        english: '',
        arabic: ''
      }),
      status: this.fb.group({
        english: [null],
        arabic: []
      }),
      reportDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      penaltyAmount: this.fb.group({
        sliderPenaltyAmount: new FormControl([this.initialMinPenaltyAmount, this.initialMaxPenaltyAmount]),
        minPenaltyAmount: [null],
        maxPenaltyAmount: [null]
      }),
      paidAmount: this.fb.group({
        sliderPaidAmount: new FormControl([this.initialMinPaidAmount, this.initialMaxPaidAmount]),
        minPaidAmount: [null],
        maxPaidAmount: [null]
      })
    });
  }
  /**
   * This method is to clear the filters
   */
  clearAllFiters(): void {
    this.violationDateReportedForm = new FormControl();
    this.violationFilterForm = this.createFilterForm();
    this.createAmountForm();
    this.filterHistory.appliedPenaltyAmountStart = null;
    this.filterHistory.appliedPenaltyAmountEnd = null;
    this.filterHistory.appliedPaidAmountStart = null;
    this.filterHistory.appliedPaidAmountEnd = null;
    this.selectedChannelOptions = null;
    this.selectedStatusOptions = null;
    this.statusFilterForm.reset();
    this.selectedViolationTypeOptions = null;
    this.setFilterBoolean();
    this.applyFilter();
  }
}
