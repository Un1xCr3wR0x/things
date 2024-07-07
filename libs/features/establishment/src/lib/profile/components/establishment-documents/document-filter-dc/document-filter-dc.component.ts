import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, FilterKeyEnum, FilterKeyValue, LovList, convertToYYYYMMDD } from '@gosi-ui/core';
import { DocumentFilters } from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-document-filter-dc',
  templateUrl: './document-filter-dc.component.html',
  styleUrls: ['./document-filter-dc.component.scss']
})
export class DocumentFilterDcComponent implements OnInit, OnChanges {
  /**
   * Component local variables
   */
  filterHistory: DocumentFilters = new DocumentFilters();
  hasFilter: Boolean = false;
  documentUploadPeriodForm = new FormControl();
  maximumDate: Date;
  documentFilterForm: FormGroup;
  selectedAddedByOptions: Array<BilingualText>;
  selectedDocumentTypeOptions: Array<BilingualText>;

  /**
   *Input variables
   */
  @Input() addedByList: LovList;
  @Input() documentTypeList: LovList;
  @Input() hasFiltered: Boolean;
  @Input() clearDocumentFilter: DocumentFilters = new DocumentFilters();

  /**
   *Output variables
   */
  @Output() documentFilters: EventEmitter<DocumentFilters> = new EventEmitter();
  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.maximumDate = new Date();
    this.documentFilterForm = this.createFilterForm();
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
      })
    });
  }

  setFilterBoolean() {
    this.hasFilter =
      this.selectedDocumentTypeOptions?.length > 0 ? true : this.selectedAddedByOptions?.length > 0 ? true : false;
  }
  setDocumentType(val) {
    this.selectedDocumentTypeOptions = val;
    this.setFilterBoolean();
  }
  setAddedBy(val) {
    this.selectedAddedByOptions = val;
    this.setFilterBoolean();
  }
  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    const appliedFilters: Array<FilterKeyValue> = [];
    if (this.documentUploadPeriodForm.value) {
      this.filterHistory.uploadPeriod.fromDate = convertToYYYYMMDD(this.documentUploadPeriodForm.value[0]);
      this.filterHistory.uploadPeriod.toDate = convertToYYYYMMDD(this.documentUploadPeriodForm.value[1]);
      appliedFilters.push({
        key: FilterKeyEnum.PERIOD,
        values: [this.filterHistory.uploadPeriod.fromDate, this.filterHistory.uploadPeriod.toDate]
      });
    } else {
      this.filterHistory.uploadPeriod.fromDate = undefined;
      this.filterHistory.uploadPeriod.toDate = undefined;
    }
    if (this.selectedDocumentTypeOptions && this.selectedDocumentTypeOptions.length > 0) {
      this.filterHistory.documentType = this.selectedDocumentTypeOptions;
      appliedFilters.push({ key: FilterKeyEnum.NATIONALITY, bilingualValues: this.selectedDocumentTypeOptions });
    } else {
      this.filterHistory.documentType = null;
    }
    if (this.selectedAddedByOptions && this.selectedAddedByOptions.length > 0) {
      this.filterHistory.addedBy = this.selectedAddedByOptions;
      appliedFilters.push({ key: FilterKeyEnum.ROLES, bilingualValues: this.selectedAddedByOptions });
    } else {
      this.filterHistory.addedBy = null;
    }
    this.documentFilters.emit(this.filterHistory);
    this.apply.emit(appliedFilters);
  }

  /**
   * This method is to clear the filters
   */
  clearAllFiters(): void {
    this.documentUploadPeriodForm = new FormControl();
    this.documentFilterForm = this.createFilterForm();
    this.selectedAddedByOptions = null;
    this.selectedDocumentTypeOptions = null;
    this.setFilterBoolean();
    this.applyFilter();
  }
}
