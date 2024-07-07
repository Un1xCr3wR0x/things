/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ApplicationTypeEnum, ApplicationTypeToken, BPMTransactionStatus, BilingualText, LanguageToken, Lov, LovList, RequestSort, RoleLovList, SortDirectionEnum, TransactionService, bindToObject } from '@gosi-ui/core';
import { InboxConstants } from '../../constants';
import { BehaviorSubject } from 'rxjs-compat';

@Component({
  selector: 'ibx-inbox-search-filter-dc',
  templateUrl: './inbox-search-filter-dc.component.html',
  styleUrls: ['./inbox-search-filter-dc.component.scss']
})
export class InboxSearchFilterDcComponent implements OnInit, OnChanges {
  //Local Variables
  isFilterCleared = false;
  transactionForm: FormGroup;
  selectedTnxOptions: Array<string>;
  selectedTnxOptionsNew: any;
  selectedlist: BilingualText[];
  selectedRoles: Array<string>;
  roleLovList: RoleLovList[];
  tnxLovList: RoleLovList[];
  transactionNameList: Array<string>;
  swimlaneRoles: Array<string>
  selectedOla: any;
  selectedFormValues: any;
  selectedRoleNew: any;
  isApplied: boolean = false;
  /**
   * Input Variables
   */
  @Input() selectedFilterStatus: BPMTransactionStatus = null;
  @Input() sortItem: RequestSort;
  @Input() sortList: LovList;
  @Input() isWorkList = true;
  @Input() searchParam = '';
  @Input() clearSearch: boolean;
  @Input() olaSlaFilter: string[];
  /**
   * Output Variables
   */
  @Output() searchValue: EventEmitter<string> = new EventEmitter();
  @Output() statusFilter: EventEmitter<string> = new EventEmitter();
  @Output() sort: EventEmitter<RequestSort> = new EventEmitter();
  @Output() sortUnclaimed: EventEmitter<RequestSort> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  @Output() olaSlaFilterOutput: EventEmitter<BilingualText[]> = new EventEmitter();
  @Output() transactionFilter: EventEmitter<string[]> = new EventEmitter();
  @Output() roleFilter: EventEmitter<string[]> = new EventEmitter();

  /**
   * Local Variables
   */
  lang = 'en';
  newRoleLovList: LovList;
  newTnxLovList: LovList;
  isDescending = true;
  statusFilterRadioForm: FormGroup = new FormGroup({});
  statusList: LovList = new LovList([]);
  isSearched = false;
  olaSlaFilterForm: FormGroup;
  selectedSlaOlaOptions: Array<BilingualText>;

  constructor(private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly transactionService: TransactionService
    ) {}
  /*
   * Method to initialise tasks
   */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transactionForm = this.createForm();
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
    this.transactionService.getRoleLovList().subscribe(res => {
    this.roleLovList = res;
    this.getLovList();
    });
    this.transactionService.getTnxLovList().subscribe(res => {
      this.tnxLovList = res;
      this.getTransactionLovList();
    });
  }
    this.statusFilterRadioForm = this.fb.group({
      status: this.fb.group({
        english: [this.selectedFilterStatus],
        arabic: [null]
      })
    });
    this.olaSlaFilterForm = this.fb.group({
      items: new FormArray([])
    });
    const savedFilterData = this.transactionService.getFilterData();
    this.olaSlaList.forEach(item => {
      const control = new FormControl(false);
      if (this.olaSlaFilter?.find(channel => item.english === channel)) control.setValue(true);
      else if (savedFilterData?.selectedSlaOlaOptions !== undefined && savedFilterData?.selectedSlaOlaOptions !== null){
      if(item.english === savedFilterData?.selectedSlaOlaOptions[0]?.english) control.setValue(true);
      }
      (this.olaSlaFilterForm.controls.items as FormArray).push(control);
    });
    this.statusList = new LovList(
      InboxConstants.STATE_LIST_NEW.map((item, index) => {
        return bindToObject(new Lov(), {
          value: item,
          sequence: index + 1
        });
      })
    );

      this.selectedTnxOptionsNew = savedFilterData?.selectedTnxOptions;
      this.selectedRoleNew = savedFilterData?.selectedRoles;
      this.selectedOla = savedFilterData?.selectedSlaOlaOptions;

    this.statusFilterRadioForm.get('status').patchValue({ english: savedFilterData?.status });
    if(this.selectedTnxOptionsNew?.length > 0 || this.selectedRoleNew?.length > 0 || this.selectedOla?.length > 0 || savedFilterData?.status){
      this.isApplied = true;
    }
    else {
      this.isApplied = false;  
    }
  }
  /*
   * Method to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.sortList && changes.sortList.currentValue) this.sortList = changes.sortList.currentValue;
    if (changes && changes.sortItem && changes.sortItem.currentValue) {
      this.sortItem = changes.sortItem.currentValue;
    }
    if (changes?.selectedFilterStatus?.currentValue) {
      this.selectedFilterStatus = changes.selectedFilterStatus.currentValue;
      this.statusFilterRadioForm?.get('status')?.get('english')?.setValue(this.selectedFilterStatus);
    }
    if (changes?.searchParam?.currentValue) {
      this.searchParam = changes.searchParam.currentValue;
    }
  }
  /*
   * Method to search transactions
   */
  searchTransactions(value: string) {
    if (value && (value.length >= 3 || value === null)) {
      const regex = /^(?=.*[0-9])(?=.*[A-Za-z])[A-Za-z0-9]+$/;
      if(regex.test(value)) {
        this.showError.emit();
      }
      else {
        this.searchValue.emit(value);
        this.isSearched = true;
        this.searchParam = value;
      }

    }
  }
  statusFilterClear(event) {
    this.statusFilterRadioForm.reset();
    event.stopPropagation();
    // this.statusFilter.emit(null);
  }

  getLovList(){
    let newList: Lov[] = [];
    this.roleLovList.forEach((val, i )=>{
          newList.push({
            value: {
              arabic: val.value.arabic,
              english: val.value.english
            },
            sequence: i,
            swimlaneRole: val.swimlaneRole
          })
      }
      );
      this.newRoleLovList = new LovList(newList);
  }

  getTransactionLovList() {
    let TnxList: Lov[] = [];
    this.tnxLovList.forEach((val, i )=>{
      TnxList.push({
            value: {
              arabic: val.value.arabic,
              english: val.value.english
            },
            sequence: i,
            resourceName: val.resourceName
          })
      }
      );
      this.newTnxLovList = new LovList(TnxList);
  }

  selectedSlaOlaUpdate(event){
    if(event.length >= 1) {
      this.selectedSlaOlaOptions = event;
      // this.selectedFormValues.selectedSlaOlaOptions = event;
      this.selectedOla = event;
    }
    else{
      this.selectedSlaOlaOptions = [];
      this.selectedOla = [];
    }
  }
  /*
   * Method to filter status
   */
  applyFilter(): void {
     this.selectedFormValues = {
      selectedSlaOlaOptions: this.selectedSlaOlaOptions ? this.selectedSlaOlaOptions : this.selectedOla,
      selectedTnxOptions: this.selectedTnxOptions,
      selectedRoles: this.selectedRoles,
      status: this.statusFilterRadioForm?.value?.status?.english
    };
    this.transactionService.saveFilterData(this.selectedFormValues);
    if(this.selectedOla){
    this.selectedSlaOlaOptions = this.selectedOla;
    }
    if(this.selectedSlaOlaOptions && this.selectedSlaOlaOptions.length >= 1){
      this.olaSlaFilterOutput.emit(this.selectedSlaOlaOptions);
    }else{
      this.olaSlaFilterOutput.emit(null);
    }
    if(this.selectedTnxOptions && this.selectedTnxOptions.length >= 1)
    {
      this.transactionFilter.emit(this.transactionNameList);
    }
    else{
      this.transactionFilter.emit(null);
    }
    if(this.selectedRoles && this.selectedRoles.length >= 1){
      this.roleFilter.emit(this.swimlaneRoles);
    }
    else{
      this.roleFilter.emit(null);
    }
    this.statusFilter.emit(this.statusFilterRadioForm?.value?.status?.english?.toUpperCase());
    if(this.selectedSlaOlaOptions?.length > 0 || this.selectedTnxOptions?.length > 0 || this.selectedRoles?.length > 0 || this.statusFilterRadioForm?.value?.status?.english){
    this.isApplied = true;
    }
    else{
    this.isApplied = false;  
    }

  }

  /*
   * Method to clear filter params
   */
  clearAllFiters() {
    this.isFilterCleared = true;
    this.selectedSlaOlaOptions = null;
    this.statusFilterRadioForm.reset();
    this.olaSlaFilterForm.reset();
    this.olaSlaFilterOutput.emit(null);
    this.transactionFilter.emit(null);
    this.roleFilter.emit(null);
    this.statusFilter.emit(null);
    this.transactionForm.reset();
    this.selectedTnxOptions = [];
    this.selectedRoles = [];
    this.transactionService.clearFilterData();
    this.selectedTnxOptionsNew = [];
    this.selectedRoleNew = [];
    this.selectedOla = [];
    this.isApplied = false;
  }
  /*
   * Method to get sorting order
   */
  sortOrderList(order: string) {
    if (order === SortDirectionEnum.ASCENDING) this.sortItem.direction = SortDirectionEnum.ASCENDING;
    else this.sortItem.direction = SortDirectionEnum.DESCENDING;
    this.onSort();
    this.onSortUnclaimed();
  }

  clearButtonClick(event) {
    this.transactionFilter.emit(null);
    this.selectedTnxOptions = [];
    this.transactionForm.controls['name'].reset();
    this.selectedTnxOptionsNew = [];
  }
  clearRoleClick(event) {
    this.roleFilter.emit(null);
    this.selectedRoles = [];
    this.transactionForm.controls['role'].reset();
    this.selectedRoleNew = [];
  }
  selectedRole(val){
    this.selectedRoles = val;
    this.selectedRoleNew = val;
    this.swimlaneRoles = [];
    val.forEach(selectedRole => {
   const role = this.newRoleLovList.items.find(item => item.value.english === selectedRole.english);
   if (role) {
     this.swimlaneRoles.push(role.swimlaneRole);
   }
 });
}

  selectedOptions(val){
    this.selectedTnxOptions = val;
    this.selectedTnxOptionsNew = val;
    this.transactionNameList = [];
    val.forEach(selectedName => {
   const name = this.newTnxLovList.items.find(item => item.value.english === selectedName.english);
   if (name) {
     this.transactionNameList.push(name.resourceName);
   }
 });

  }
  createForm(): FormGroup {
    return this.fb.group({
      name: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      role: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  /*
   * Method to get sorting list details
   */
  sortListDetails(sortBy: Lov) {
    this.sortItem.column = InboxConstants.SORT_FOR_INBOX.find(item => item.code === sortBy.code).column;
    this.sortItem.value = InboxConstants.SORT_FOR_INBOX.find(item => item.code === sortBy.code).value;
    this.onSort();
    this.onSortUnclaimed();
  }

  /**
   * Method to emit sort
   */
  private onSort(): void {
    this.sort.emit(this.sortItem);
  }
  private onSortUnclaimed(): void {
    this.sortUnclaimed.emit(this.sortItem);
  }
  onSearchEnable(searchKey: string) {
    if (!searchKey && this.isSearched) {
      this.isSearched = false;
      this.searchParam = searchKey;
        this.searchValue.emit(searchKey);
    }
  }
  resetSearch() {
    this.searchValue.emit(null);
  }
  olaSlaList = [
    {
      english: 'OLA Exceeded',
      arabic: 'تجاوزت اتفاقية مستوى التشغيل'
    }
  ];
}
