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
  LanguageToken,
  LovList,
  Lov,
  SortDirectionEnum,
  ChannelConstants,
  Channel
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  EstablishmentFilterConstants,
  IndividualSortConstants,
  TransactionsSortConstants,
  TransactionsFilterConstants
} from '../../../constants';
import { RequestFilter, SearchRequest, RequestSort, EstablishmentSortConstants } from '../../../../shared';
import { FilterDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'dsb-common-sort-filter-dc',
  templateUrl: './common-sort-filter-dc.component.html',
  styleUrls: ['./common-sort-filter-dc.component.scss']
})
export class CommonSortFilterDcComponent implements OnInit, OnChanges {
  @ViewChild('filterComponent', { static: false }) filterComponent: FilterDcComponent;
  /*
   * Local variables
   */
  isDescending = true;
  statusFilterForm: FormGroup = new FormGroup({});
  fieldOfficeForm: FormGroup = new FormGroup({});
  channelFilterForm: FormGroup;
  entityFilterForm: FormGroup;
  typeFilterForm: FormGroup;
  selectedStatusOptions: BilingualText[] = [];
  selectedofficeOptions: BilingualText[] = [];
  statusValue: BilingualText[];
  fieldOfficeValue: BilingualText[];
  txnStatusList: LovList;
  selectedChannelOptions: BilingualText[] = [];
  selectedEntityOptions: BilingualText[] = [];
  selectedTypeOptions: BilingualText[] = [];
  channelValue: BilingualText[];
  entityValue: BilingualText[];
  channelList: BilingualText[] = [];
  entityLists: BilingualText[] = [];
  sortList: LovList;
  sortMode: string;
  sortItem: RequestSort = new RequestSort();
  transactionFilter: RequestFilter = new RequestFilter();
  lang = 'en';
  sortInitialValue: BilingualText = new BilingualText();
  SortColumnList: typeof EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT;
  typeList: BilingualText[] = [];
  /*
   * Input variables
   */
  @Input() isEstablishment = false;
  @Input() isIndividual = false;
  @Input() isTransaction = false;
  @Input() isPrivate = true;
  @Input() fieldOfficeList: LovList;
  @Input() entityList: LovList = new LovList([]);
  @Input() statusList: LovList = new LovList([]);
  @Input() searchRequest: SearchRequest = new SearchRequest();
  //output variables
  @Output() sort: EventEmitter<RequestSort> = new EventEmitter();
  @Output() filter: EventEmitter<RequestFilter> = new EventEmitter();
  /**
   *
   * @param fb  @param language
   */
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /*
   * Method to initalise variables
   */
  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    this.statusFilterForm = this.createForm();
    this.fieldOfficeForm = this.createFieldOfficeForm();
  }
  /**
   * create form
   */
  createForm() {
    return this.fb.group({
      status: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  /**
   * Method to create find us form
   */
  createFieldOfficeForm(): FormGroup {
    return this.fb.group({
      office: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  /*
   * Method to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.searchRequest && changes.searchRequest.currentValue) {
      this.initiateSort();
      this.initiateFilter();
      this.searchRequest = changes.searchRequest.currentValue;
      this.transactionFilter = changes.searchRequest.currentValue.filter;
      this.sortItem = changes.searchRequest.currentValue.sort;
      this.setValues();
    }
    if (changes?.fieldOfficeList?.currentValue) {
      this.fieldOfficeList = changes?.fieldOfficeList?.currentValue;
    }
    if (changes?.statusList?.currentValue) {
      this.statusList = changes?.statusList?.currentValue;
    }
    if (changes?.entityList?.currentValue) {
      this.entityList = changes?.entityList?.currentValue;
      this.initiateFilter();
    }
  }
  /**
   * Method to clear filter
   */
  clearAllFilters(): void {
    this.statusFilterForm.get('status').reset();
    this.fieldOfficeForm.get('office').reset();
    this.selectedStatusOptions = [];
    this.selectedofficeOptions = [];
    this.selectedTypeOptions = [];
    this.channelFilterForm.reset();
    this.entityFilterForm.reset();
    this.typeFilterForm.reset();
    this.selectedChannelOptions = null;
    this.selectedEntityOptions = null;
    this.defaultFilter();
    this.filter.emit(this.transactionFilter);
  }
  /**
   * Method to initiate filter
   */
  initiateFilter() {
    if (this.isEstablishment) {
      this.typeList = EstablishmentFilterConstants.TYPE_FILTER_FOR_ESTABLISHMENT.map(item => item.value);
      this.entityFilterForm = this.fb.group({
        items: new FormArray([])
      });
      if (this.entityList?.items) {
        this.entityList.items.forEach(item => {
          this.entityLists.push(item.value);
        });
        this.entityLists.forEach(() => {
          const control = new FormControl(false);
          (this.entityFilterForm.controls.items as FormArray).push(control);
        });
      }
      this.typeFilterForm = this.fb.group({
        items: new FormArray([])
      });
      this.typeList.forEach(() => {
        const control = new FormControl(false);
        (this.typeFilterForm.controls.items as FormArray).push(control);
      });
    } else if (this.isTransaction) {
      this.txnStatusList = new LovList(TransactionsFilterConstants.FILTER_FOR_TRANSACTIONS);
      this.channelList = ChannelConstants.CHANNELS_FILTER_TRANSACTIONS.filter(
        item => item.value !== Channel.THIRD_PARTY && item.display !== false
      );
      this.channelFilterForm = this.fb.group({
        items: new FormArray([])
      });
      this.channelList.forEach(() => {
        const control = new FormControl(false);
        (this.channelFilterForm.controls.items as FormArray).push(control);
      });
    }
  }

  /**
   * Method for apply filter options
   */
  applyFilter(): void {
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValue = this.selectedStatusOptions;
    } else {
      this.statusValue = null;
    }
    if (this.selectedChannelOptions && this.selectedChannelOptions.length >= 1) {
      this.channelValue = this.selectedChannelOptions;
    } else {
      this.channelValue = null;
    }
    if (this.selectedEntityOptions && this.selectedEntityOptions.length >= 1) {
      this.entityValue = this.selectedEntityOptions;
    } else {
      this.entityValue = null;
    }
    if (this.selectedofficeOptions && this.selectedofficeOptions.length >= 1) {
      this.fieldOfficeValue = this.selectedofficeOptions;
    } else {
      this.fieldOfficeValue = null;
    }
    this.transactionFilter.status = this.statusValue;
    this.transactionFilter.channel = this.channelValue;
    this.transactionFilter.type = this.selectedTypeOptions;
    this.transactionFilter.filedOffice = this.fieldOfficeValue;
    this.transactionFilter.legalEntity = this.entityValue;
    this.onFilter();
  }
  /**
   * Method to initiate sort
   */
  private initiateSort(): void {
    if (this.isEstablishment) {
      this.sortList = new LovList(EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT);
      this.SortColumnList = EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT;
      this.sortItem.column = EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT[0].column;
      this.sortMode = EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT[0].value.english;
    } else if (this.isTransaction) {
      this.sortList = new LovList(TransactionsSortConstants.SORT_FOR_TRANSACTIONS);
      this.SortColumnList = TransactionsSortConstants.SORT_FOR_TRANSACTIONS;
      this.sortItem.column = TransactionsSortConstants.SORT_FOR_TRANSACTIONS[0].column;
      this.sortMode = TransactionsSortConstants.SORT_FOR_TRANSACTIONS[0].value.english;
    } else if (this.isIndividual) {
      this.sortList = new LovList(IndividualSortConstants.SORT_FOR_CONTRIBUTOR);
      this.SortColumnList = IndividualSortConstants.SORT_FOR_CONTRIBUTOR;
      this.sortItem.column = IndividualSortConstants.SORT_FOR_CONTRIBUTOR[0].column;
      this.sortMode = IndividualSortConstants.SORT_FOR_CONTRIBUTOR[0].value.english;
    }
    this.sortItem.direction = SortDirectionEnum.DESCENDING;
    this.isDescending = true;
  }
  /*
   * Method to get sorting list details
   */
  sortListDetails(sortBy: Lov) {
    this.sortItem.column = this.SortColumnList.find(item => item.code === sortBy.code).column;
    this.onSort();
  }
  /*
   * Method to get sorting order
   */
  sortOrderList(order) {
    this.sortItem.direction = order;
    this.onSort();
  }
  /**
   * Method to clear filter form
   */
  defaultFilter(): void {
    this.transactionFilter.status = [];
    this.transactionFilter.channel = [];
    this.transactionFilter.legalEntity = [];
    this.transactionFilter.filedOffice = [];
  }
  /**
   * Method to emit sort
   */
  private onSort(): void {
    this.sort.emit(this.sortItem);
  }
  /**
   * method to emit filter
   */
  private onFilter(): void {
    this.filter.emit(this.transactionFilter);
  }
  /**
   * Method to set sort and filter values
   *
   */
  setValues(): void {
    if (this.searchRequest) {
      if (this.searchRequest.sort) {
        if (this.searchRequest.sort.column) {
          this.sortInitialValue = this.getSortValue(this.searchRequest.sort.column);
        }
        if (this.searchRequest.sort.direction)
          this.isDescending = this.searchRequest.sort.direction === SortDirectionEnum.ASCENDING ? false : true;
      }
      if (this.searchRequest.filter && this.searchRequest.filter.channel) {
        this.channelList.forEach((item: BilingualText, index: number) => {
          if (this.searchRequest.filter.channel.find((channel: BilingualText) => channel.english === item.english))
            (this.channelFilterForm.controls.items as FormArray).controls[index].setValue(true);
        });
      }
      if (this.searchRequest.filter && this.searchRequest.filter.status) {
        this.selectedStatusOptions = this.searchRequest.filter.status;
      }
    }
  }
  /**
   * Method to get sort field name
   * @param column
   */
  getSortValue(column: string): BilingualText {
    if (this.isEstablishment) {
      return EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT.find(item => item.column === column).value;
    } else if (this.isTransaction) {
      return TransactionsSortConstants.SORT_FOR_TRANSACTIONS.find(item => item.column === column).value;
    }
  }
  /**
   * This method is to clear the filter status values
   */
  statusClear() {
    this.selectedStatusOptions = [];
    this.statusFilterForm.get('status').reset();
  }
  /**
   * This method is to clear the channel values
   */
  channelFilterClear() {
    this.selectedChannelOptions = null;
    this.channelFilterForm.reset();
  }
  /**
   * This method is to clear the filter entity values
   */
  entityFilterClear() {
    this.selectedEntityOptions = null;
    this.entityFilterForm.reset();
  }
  /**
   * This method is to clear the filter type values
   */
  typeFilterClear() {
    this.selectedTypeOptions = null;
    this.typeFilterForm.reset();
  }
  /**
   * This method is to clear the field office values
   */
  fieldOfficeClear() {
    this.selectedofficeOptions = null;
    this.fieldOfficeForm.get('office').reset();
  }
  /**
   * This method is to crefresh filter component
   */
  refreshFilter() {
    if (this.filterComponent && this.filterComponent.isOpen) {
      this.filterComponent.filterPosition();
      this.filterComponent.resetPopver();
    }
  }
}
