/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  BilingualText,
  LanguageToken,
  Transaction,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  LovList
} from '@gosi-ui/core';
import { FilterDcComponent, InputDateDcComponent, InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { BehaviorSubject } from 'rxjs';
import { TransactionFilter } from '../../models/transaction-filter';
import { TransactionTypeConstants } from 'libs/core/src/lib/constants/transaction-type-constants';

@Component({
  selector: 'trn-transaction-filter-dc',
  templateUrl: './transaction-filter-dc.component.html',
  styleUrls: ['./transaction-filter-dc.component.scss']
})
export class TransactionFilterDcComponent implements OnInit {
  /**
   * Input Variables
   */
  @Input() transactionFilter: TransactionFilter = new TransactionFilter();
  /**
   * Referring datepicker and daterange picker
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('datePicker') datePicker: InputDateDcComponent;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;
  /**
   * calendar variables
   */
  totalItems;
  maxdate: Date;
  selectedLastDate: Date;
  selectedInitialDate: Array<Date>;
  initialDateFormController = new FormControl();
  lastActionlDateFormController = new FormControl();
  isIndividualApp: boolean;
  /**
   * Component local variables
   */
  lang = 'en';
  statusFilterForm: FormGroup;
  channelFilterForm: FormGroup;
  selectedChannelOptions: Array<BilingualText>;
  selectedStatusOptions: Array<BilingualText>;
  channelValue: BilingualText[];
  statusValue: BilingualText[];
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  closeButtonCLick: boolean = false;
  txnTypesList: LovList;
  selectedTransactionTypesOptions: BilingualText[] = [];
  txnTypeFilterForm: FormGroup = new FormGroup({});
  txnTypeValue: BilingualText[];
  /**
   * Status list Values
   */
  transactionStatusList = [
    {
      english: 'In Progress',
      arabic: 'قيد المعالجة'
    },
    {
      english: 'Completed',
      arabic: 'مكتملة'
    },
    {
      english: 'Draft',
      arabic: 'مسودة'
    }
  ];

  /**
   * Entry channel list Values
   */

  entryChannelList = [
    {
      english: 'System',
      arabic: 'النظام',
      isExternal: false
    },
    {
      english: 'Field Office',
      arabic: 'المكتب',
      isExternal: false
    },
    {
      english: 'Call Center',
      arabic: 'مركز الاتصال',
      isExternal: false
    },
    {
      english: 'GOSI Website',
      arabic: 'الموقع الإلكتروني',
      isExternal: true
    },
    {
      english: 'gosi-online',
      arabic: 'التأمينات أون لاين',
      isExternal: true
    },
    {
      english: 'Taminaty App',
      arabic: 'تطبيق تأميناتي',
      isExternal: true
    },
    {
      english: 'Rased',
      arabic: 'راصد',
      isExternal: false
    },
    {
      english: 'TPA',
      arabic: 'إدارة المطالبات الطبية',
      isExternal: false
    }
  ];

  entryChannelListIndividual = [
    {
      english: 'GOSI',
      arabic: 'المؤسسة العامة للتأمينات الاجتماعية',
      isExternal: false
    },
    {
      english: 'Establishment',
      arabic: 'المنشأة',
      isExternal: true
    },
    {
      english: 'Me',
      arabic: 'العميل',
      isExternal: true
    }
  ];
  // output varaiables
  @Output() transactionDetailsFilter: EventEmitter<TransactionFilter> = new EventEmitter();
  // input variables
  @Input() isEstablishment = false;
  @Input() isIndividualProfile = false;
  constructor(
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  /** Method to initialize the component. */
  ngOnInit(): void {
    if (this.appToken === ApplicationTypeEnum.PUBLIC)
      this.entryChannelList = this.entryChannelList.filter(item => item.isExternal === true);
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.maxdate = new Date();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.transactionStatusList.forEach(item => {
      const control = new FormControl(false);
      if (this.transactionFilter?.status?.find(status => item.english === status.english)) control.setValue(true);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    this.channelFilterForm = this.fb.group({
      items: new FormArray([])
    });
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.entryChannelListIndividual.forEach(item => {
        const control = new FormControl(false);
        if (this.transactionFilter?.channel?.find(channel => item.english === channel.english)) control.setValue(true);
        (this.channelFilterForm.controls.items as FormArray).push(control);
      });
    } else {
      this.entryChannelList.forEach(item => {
        const control = new FormControl(false);
        if (this.transactionFilter?.channel?.find(channel => item.english === channel.english)) control.setValue(true);
        (this.channelFilterForm.controls.items as FormArray).push(control);
      });
    }
    this.initialDateFormController.setValue([
      this.transactionFilter?.initiatedFrom,
      this.transactionFilter?.initiatedTo
    ]);
    this.lastActionlDateFormController.setValue(this.transactionFilter?.lastActionDate);
    this.txnTypesList = new LovList(TransactionTypeConstants.TRANSACTION_TYPE_FILTER_TRANSACTIONS);
    this.txnTypeFilterForm = this.fb.group({
      english: [null],
      arabic: [null]
    });
  }
  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.transactionFilter.initiatedFrom = undefined;
    this.transactionFilter.initiatedTo = undefined;
    this.transactionFilter.lastActionDate = undefined;
    this.transactionFilter.channel = [];
    this.transactionFilter.status = [];
    this.transactionFilter.txnType = [];
  }
  /**
   * This method is to filter the list based on the multi filters
   */

  applyFilter(): void {
    if (this.selectedChannelOptions && this.selectedChannelOptions.length >= 1) {
      this.channelValue = this.selectedChannelOptions;
    } else {
      this.channelValue = null;
    }

    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValue = this.selectedStatusOptions;
    } else {
      this.statusValue = null;
    }
    if (this.initialDateFormController.value && this.initialDateFormController.value.length >= 1) {
      this.selectedInitialDate = this.initialDateFormController.value;
    } else {
      this.selectedInitialDate = null;
    }
    if (this.lastActionlDateFormController.value) {
      this.selectedLastDate = this.lastActionlDateFormController.value;
    } else {
      this.selectedLastDate = null;
    }
    if (this.selectedTransactionTypesOptions && this.selectedTransactionTypesOptions.length >= 1) {
      this.txnTypeValue = this.selectedTransactionTypesOptions;
    } else {
      this.txnTypeValue = null;
    }
    this.transactionFilter.channel = this.channelValue;
    this.transactionFilter.status = this.statusValue;
    this.transactionFilter.txnType = this.txnTypeValue;
    this.transactionFilter.lastActionDate = this.selectedLastDate;
    if (this.selectedInitialDate) {
      this.transactionFilter.initiatedFrom = this.selectedInitialDate[0];
      this.transactionFilter.initiatedTo = this.selectedInitialDate[1];
    }
    this.transactionDetailsFilter.emit(this.transactionFilter);
  }

  /**
   * This method is to clear the filters
   */

  clearAllFiters(): void {
    this.selectedChannelOptions = null;
    this.selectedStatusOptions = null;
    this.channelFilterForm.reset();
    this.statusFilterForm.reset();
    this.initialDateFormController.reset();
    this.lastActionlDateFormController.reset();
    this.selectedTransactionTypesOptions = [];
    this.txnTypeFilterForm.reset();
    this.defaultFilter();
    this.transactionDetailsFilter.emit(this.transactionFilter);
  }
  /**
   * This method is to clear the filter channel values
   */
  channelFilterClear() {
    this.closeButtonCLick = true;
    setTimeout(() => {
      this.closeButtonCLick = false;
    }, 40);
    this.selectedChannelOptions = null;
    this.channelFilterForm.reset();
  }
  /**
   * This method is to clear the filter status values
   */
  statusFilterClear() {
    this.closeButtonCLick = true;
    setTimeout(() => {
      this.closeButtonCLick = false;
    }, 40);
    this.selectedStatusOptions = null;
    this.statusFilterForm.reset();
  }
  /**
   * This method is to clear the initiated date in filter
   */
  initiatedDateFilterClear() {
    this.closeButtonCLick = true;
    setTimeout(() => {
      this.closeButtonCLick = false;
    }, 40);
    this.transactionFilter.initiatedFrom = undefined;
    this.transactionFilter.initiatedTo = undefined;
    this.initialDateFormController.reset();
  }
  /**
   * This method is to clear the last action date in filter
   */
  lastActionDateFilterClear() {
    this.closeButtonCLick = true;
    setTimeout(() => {
      this.closeButtonCLick = false;
    }, 40);
    this.transactionFilter.lastActionDate = undefined;
    this.lastActionlDateFormController.reset();
  }
  /**
   * This method is to clear the transaction type in filter
   */
  txnTypeFilterClear() {
    this.selectedTransactionTypesOptions = [];
    this.txnTypeFilterForm.reset();
  }

  /**
   * Method to hide datepicker while scrolling
   */
  onScroll() {
    if (this.datePicker.datePicker.isOpen) this.datePicker.datePicker.hide();
    else if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
  /**
   * Method to hide filter on outside click
   */
  @HostListener('window:mousedown', ['$event'])
  onMouseUp(event): void {
    if (
      this.filterbutton.isOpen &&
      (this.filterbutton.filterContent.nativeElement.contains(event.target) ||
        ((this.dateRangePicker.dateRangePicker.isOpen || this.datePicker.datePicker.isOpen) &&
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
