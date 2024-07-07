/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageToken, LovList } from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClaimSummaryDetails, PaginationSort } from '../../../shared/models';
import { TreatmentService } from '../../../shared/models/treatment-service';

@Component({
  selector: 'oh-auditor-treatment-details-dc',
  templateUrl: './auditor-treatment-details-dc.component.html',
  styleUrls: ['./auditor-treatment-details-dc.component.scss']
})
export class AuditorTreatmentDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  lang = 'en';
  filterApplied = false;
  treatmentForm: FormGroup;
  maximumValue: number;
  minimumValue: number;
  selectedOption: string;
  isDescending = false;
  transactionRequest: PaginationSort = <PaginationSort>{};
  currentSortDirection = 'ASC';
  setAmount = false;

  /**
   * Input variables
   */
  @Input() treatmentList: TreatmentService = new TreatmentService();
  @Input() checkBoxDisabled = false;
  @Input() claimSummaryDetails: ClaimSummaryDetails;
  @Input() serviceTypeList$: Observable<LovList> = null;
  @Output() selectedService = new EventEmitter();
  @Output() removeSelection = new EventEmitter();
  @Output() getTreatmentServiceDetails = new EventEmitter(null);
  @Output() sortEvent: EventEmitter<PaginationSort> = new EventEmitter();

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private cd: ChangeDetectorRef,
    readonly fb: FormBuilder
  ) {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  ngOnInit(): void {
    this.treatmentForm = this.createTreatmentForm();
    this.defaultSort();
  }
  /**
   * This method is to change the sort direction and fetch the list
   */
  changeSortDirection(): void {
    if (this.isDescending) {
      this.isDescending = false;
      this.currentSortDirection = 'ASC';
    } else {
      this.isDescending = true;
      this.currentSortDirection = 'DESC';
    }
    this.sortTransactions(false);
  }
  defaultSort() {
    if (this.lang === 'en') this.selectedOption = 'Treatment Date';
    else this.selectedOption = 'تاريخ العلاج';
    this.currentSortDirection = 'ASC';
    this.isDescending = false;
    this.sortTransactions(true);
  }
  sortTransactions(isDefault) {
    this.transactionRequest = new PaginationSort();
    this.transactionRequest.column = this.selectedOption;
    this.transactionRequest.direction = this.currentSortDirection;
    this.transactionRequest.directionBoolean = this.isDescending;
    this.transactionRequest.isDefault = isDefault;
    this.sortEvent.emit(this.transactionRequest);
  }
  /**
   * This method is to handle large screen table sorting
   */
  sortList(columnName) {
    this.selectedOption = columnName;
    this.changeSortDirection();
  }
  /**
   * This method is to handle small screen table sorting
   */
  sort() {
    this.sortTransactions(false);
  }
  /** Method to detect chnages in input. */

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.treatmentList?.currentValue) {
      this.treatmentForm = this.createTreatmentForm();
      this.treatmentList = changes.treatmentList.currentValue;
      if (this.treatmentList?.services?.length > 0 && !this.setAmount) {
        this.setAmount = true;
        this.maximumValue = Math.max(...this.treatmentList?.services?.map(({ paidAmount }) => paidAmount));
        this.minimumValue = Math.min(...this.treatmentList?.services?.map(({ paidAmount }) => paidAmount));
      }
    }
  }
  fetchTreatmentDetails(filters) {
    this.filterApplied = true;
    this.getTreatmentServiceDetails.emit(filters);
  }
  selectService(claim, checked) {
    if (checked === 'true') {
      this.selectedService.emit(claim);
    } else {
      this.removeSelection.emit(claim);
    }
  }
  createTreatmentForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false]
    });
  }
}
