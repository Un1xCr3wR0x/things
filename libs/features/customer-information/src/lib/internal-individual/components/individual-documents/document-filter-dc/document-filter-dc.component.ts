import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, convertToYYYYMMDD, FilterKeyEnum, FilterKeyValue, LanguageToken, Lov, LovList } from '@gosi-ui/core';
import { DocFilters } from '@gosi-ui/features/customer-information/lib/shared/models/doc-filter-key';
import { DocumentFilters } from '@gosi-ui/features/establishment/lib/shared';
import { BehaviorSubject } from 'rxjs-compat';

@Component({
  selector: 'cim-document-filter-dc',
  templateUrl: './document-filter-dc.component.html',
  styleUrls: ['./document-filter-dc.component.scss']
})
export class DocumentFilterDcComponent implements OnInit, OnChanges {
  /**
   * Component local variables
   */
  filterHistory: DocumentFilters = new DocumentFilters();
  filterData: DocFilters = new DocFilters();
  hasFilter: Boolean = false;
  documentUploadPeriodForm = new FormControl();
  maximumDate: Date;
  documentFilterForm: FormGroup;
  systemForm: FormGroup;
  selectedAddedByOptions: Array<BilingualText>;
  selectedDocumentTypeOptions: Array<BilingualText>;
  transactionTypeOptions: Array<BilingualText>;
  selectedSystemOption: Array<BilingualText>;
  isShow: boolean = false;
  documentTypeNewList: Array<string>;
  documentAddedByList: Array<string>;
  documentTnxNameList: Array<string>;
  isDisabled: boolean = false;
  TnxList: LovList;
  lang = 'en';

  /**
   *Input variables
   */
  @Input() transactionTypeList: LovList;
  @Input() addedByList: LovList;
  @Input() documentTypeList: LovList;
  @Input() hasFiltered: Boolean;
  @Input() clearDocumentFilter: DocumentFilters = new DocumentFilters();
  @Input() systemList: LovList;
  @Input() systemSimisList: LovList;

  /**
   *Output variables
   */
  @Output() documentFilters: EventEmitter<DocumentFilters> = new EventEmitter();
  @Output() apply: EventEmitter<DocFilters> = new EventEmitter();
  @Output() docFilter: EventEmitter<DocFilters> = new EventEmitter();
  constructor(private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.maximumDate = new Date();
    this.documentFilterForm = this.createFilterForm();
    this.systemForm = this.fb.group({
      items: new FormArray([])
    });
    this.systemList.forEach(item => {
      const control = new FormControl(false);
      (this.systemForm.controls.items as FormArray).push(control);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasFiltered) {
      this.hasFilter = this.hasFiltered ? true : false;
      this.hasFiltered = undefined;
    }
    if (changes && changes.clearDocumentFilter) {
      this.setFilterHistory();
      this.clearFilterForm();
      this.setFilterFormValues();
    }
  }
  /**
   * Method to Clear Filter Forms
   */
  clearFilterForm() {
    this.documentFilterForm?.reset();
  }
  /**
   * Method to set Filter Form values
   */
  setFilterFormValues() {
    if (this.clearDocumentFilter.uploadPeriod.fromDate === undefined) {
      this.documentUploadPeriodForm.reset();
    }
    this.documentFilterForm?.get('documentType')?.get('english')?.setValue(this.clearDocumentFilter.documentType);
    this.applyFilter();
  }
  setFilterHistory() {
    this.filterHistory.addedBy = this.clearDocumentFilter.addedBy;
    this.setAddedBy(this.clearDocumentFilter.addedBy);
    this.filterHistory.uploadPeriod = this.clearDocumentFilter.uploadPeriod;
    this.filterHistory.documentType = this.clearDocumentFilter.documentType;
    this.setDocumentType(this.clearDocumentFilter.documentType);
  }

  /**
   * This method is to create filter form
   */
  createFilterForm() {
    return this.fb.group({
      documentType: this.fb.group({
        english: '',
        arabic: ''
      }),
      addedBy: this.fb.group({
        english: '',
        arabic: ''
      }),
      transactionType: this.fb.group({
        english: '',
        arabic: ''
      })
    });
  }

  setFilterBoolean() {
    this.hasFilter =
      this.selectedDocumentTypeOptions?.length > 0 ? true : this.selectedAddedByOptions?.length > 0 ? true : this.transactionTypeOptions?.length > 0 ? true : this.selectedSystemOption?.length > 0 ? true : false;
  }
  setDocumentType(val) {
    this.selectedDocumentTypeOptions = val;
    this.documentTypeNewList = [];
    val.forEach(element => {
      if (element?.english) {
          this.documentTypeNewList.push(element.english);
      }
  });
    this.setFilterBoolean();
  }
  setAddedBy(val) {
    this.selectedAddedByOptions = val;
    this.documentAddedByList = [];
    val.forEach(element => {
      if (element?.english) {
          this.documentAddedByList.push(element.english);
      }
  });
    this.setFilterBoolean();
  }
  setTransactionType(val) {
    this.transactionTypeOptions = val;
    this.documentTnxNameList = [];
    val.forEach(element => {
      if (element?.english) {
          this.documentTnxNameList.push(element?.code);
      }
  });
    this.setFilterBoolean(); 
  }
  selectedSystem(val) {
    this.selectedSystemOption = val;
    if(this.selectedSystemOption[0].english === 'Simis'){
      this.TnxList = this.systemSimisList;
    }
    else {
      this.TnxList = this.transactionTypeList;
    }
    this.isShow = true;
    this.isDisabled = true;
    this.setFilterBoolean(); 
  }
  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    // const appliedFilters: Array<any> = [];
    // if (this.documentUploadPeriodForm.value) {
    //   this.filterHistory.uploadPeriod.fromDate = convertToYYYYMMDD(this.documentUploadPeriodForm.value[0]);
    //   this.filterHistory.uploadPeriod.toDate = convertToYYYYMMDD(this.documentUploadPeriodForm.value[1]);
    //   appliedFilters.push({
    //     key: FilterKeyEnum.PERIOD,
    //     values: [this.filterHistory.uploadPeriod.fromDate, this.filterHistory.uploadPeriod.toDate]
    //   });
    // } else {
    //   this.filterHistory.uploadPeriod.fromDate = undefined;
    //   this.filterHistory.uploadPeriod.toDate = undefined;
    // }
    // if (this.selectedDocumentTypeOptions && this.selectedDocumentTypeOptions.length > 0) {
    //   this.filterHistory.documentType = this.selectedDocumentTypeOptions;
    //   appliedFilters.push(this.selectedDocumentTypeOptions)
    //   // appliedFilters.push({ key: FilterKeyEnum.NATIONALITY, bilingualValues: this.selectedDocumentTypeOptions });
    // } else {
    //   this.filterHistory.documentType = null;
    // }
    // if (this.selectedAddedByOptions && this.selectedAddedByOptions.length > 0) {
    //   this.filterHistory.addedBy = this.selectedAddedByOptions;
    //   appliedFilters.push({ key: FilterKeyEnum.ROLES, bilingualValues: this.selectedAddedByOptions });
    // } else {
    //   this.filterHistory.addedBy = null;
    // }
    // if (this.selectedSystemOption && this.selectedSystemOption.length > 0) {
    //   this.filterHistory.system = this.selectedSystemOption;
    //   appliedFilters.push({ key: FilterKeyEnum.ROLES, bilingualValues: this.selectedSystemOption });
    // }
    // else {
    //   this.filterHistory.system = null; 
    // }
    // if (this.transactionTypeOptions && this.transactionTypeOptions.length > 0) {
    //   this.filterHistory.system = this.transactionTypeOptions;
    //   appliedFilters.push({ key: FilterKeyEnum.ROLES, bilingualValues: this.transactionTypeOptions });
    // }
    // else {
    //   this.filterHistory.transactionType = null; 
    // }
    // this.documentFilters.emit(this.filterHistory);
    // this.apply.emit(appliedFilters);
    if(this.selectedDocumentTypeOptions && this.selectedDocumentTypeOptions.length >= 1)
    {
      this.filterData.documentType = this.documentTypeNewList;
      this.docFilter.emit(this.filterData);
    }
    else{
      this.filterData.documentType = null;
    }
    if(this.selectedAddedByOptions && this.selectedAddedByOptions.length >= 1)
    {
      this.filterData.addedBy = this.documentAddedByList;
      this.docFilter.emit(this.filterData);
    }
    else{
      this.filterData.addedBy = null;
    }
    if(this.transactionTypeOptions && this.transactionTypeOptions.length >= 1)
    {
      this.filterData.transactionType = this.documentTnxNameList;
      this.docFilter.emit(this.filterData);
    }
    else{
      this.filterData.transactionType = null;
    }
    if(this.selectedSystemOption && this.selectedSystemOption.length >= 1)
    {
      this.filterData.system = this.selectedSystemOption[0]?.english;
      this.docFilter.emit(this.filterData);
    }
    else{
      this.filterData.system = null;
    }
    if (this.documentUploadPeriodForm.value) {
        this.filterData.uploadPeriod.fromDate = convertToYYYYMMDD(this.documentUploadPeriodForm.value[0]);
        this.filterData.uploadPeriod.toDate = convertToYYYYMMDD(this.documentUploadPeriodForm.value[1]);
        this.docFilter.emit(this.filterData);
      } else {
        this.filterData.uploadPeriod.fromDate = undefined;
        this.filterData.uploadPeriod.toDate = undefined;
      }
    this.apply.emit(this.filterData);
  }

  /**
   * This method is to clear the filters
   */
  clearAllFiters(): void {
    this.documentUploadPeriodForm = new FormControl();
    this.documentFilterForm = this.createFilterForm();
    this.selectedAddedByOptions = null;
    this.selectedDocumentTypeOptions = null;
    this.transactionTypeOptions = null;
    this.selectedSystemOption = null;
    this.systemForm.reset();
    this.isDisabled = false;
    this.isShow = false;
    this.systemForm.enable();
    this.setFilterBoolean();
    this.applyFilter();
  }
}
