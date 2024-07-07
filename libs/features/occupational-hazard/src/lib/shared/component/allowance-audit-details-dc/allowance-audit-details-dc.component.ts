import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Inject,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { AuditAllowance } from '../../models/audit-allowance';
import { LanguageToken, LovList } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { AllowanceSummaryDcComponent } from '../allowance-summary-dc/allowance-summary-dc.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AllowanceFilterParams, PaginationSort } from '../../models';

@Component({
  selector: 'oh-allowance-audit-details-dc',
  templateUrl: './allowance-audit-details-dc.component.html',
  styleUrls: ['./allowance-audit-details-dc.component.scss']
})
export class AllowanceAuditDetailsDcComponent extends AllowanceSummaryDcComponent implements OnInit, OnChanges {
  //Local Variables

  minDaysValue: number;
  maxDaysValue: number;
  minVisitsValue: number;
  maxVisitsValue: number;
  selectedOption = 'Days';
  isDescending = false;
  transactionRequest: PaginationSort = <PaginationSort>{};
  currentSortDirection = 'ASC';
  initialSortDirection = 'DSC';

  initialSortValue = {
    english: 'Start Date',
    arabic: 'تاريخ البداية'
  };
  @Input() previousAllowanceDetails: AuditAllowance = new AuditAllowance();
  @Input() allowanceDetails: AuditAllowance = new AuditAllowance();
  @Input() previousAllowance: AuditAllowance = new AuditAllowance();
  @Input() checkBoxDisabled = false;
  @Input() isPrevious = false;
  @Input() allowanceType: LovList;
  @Input() sortList: LovList;
  @Output() selectedAllowance = new EventEmitter();
  @Output() removeSelection = new EventEmitter();
  @Output() applyAllowance: EventEmitter<AllowanceFilterParams> = new EventEmitter();
  @Output() sortEvent: EventEmitter<PaginationSort> = new EventEmitter();

  lang = 'en';
  transactionForm: FormGroup;
  prevMaxDays: number;
  prevMinDays: number;
  prevMaxVisits: number;
  prevMinVisits: number;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super(language);
  }

  ngOnInit(): void {
    this.transactionForm = this.createAllowanceForm();
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allowanceDetails && changes.allowanceDetails?.currentValue) {
      this.allowanceDetails = changes.allowanceDetails.currentValue;
      this.transactionForm = this.createAllowanceForm();
    }
    if (changes && changes.previousAllowanceDetails && changes.previousAllowanceDetails?.currentValue) {
      this.previousAllowanceDetails = changes.previousAllowanceDetails.currentValue;
      if (this.isPrevious) {
        this.allowanceDetails = changes.previousAllowanceDetails.currentValue;
        this.cdr.detectChanges();
        this.transactionForm = this.createAllowanceForm();
      }
    }
    if (changes && changes.previousAllowance && changes.previousAllowance?.currentValue) {
      this.previousAllowance = changes.previousAllowance.currentValue;
    }
    if (this.allowanceDetails?.auditDetail) {
      const newAllowanceDetails = [];
      const arrLength = this.allowanceDetails?.auditDetail.length;

      this.allowanceDetails?.auditDetail.forEach(element => {
        if (
          element.allowanceSubType.english !== 'Balance Settlement Allowance' &&
          element.allowanceSubType.english !== 'Balance Settlement Reversal'
        ) {
          newAllowanceDetails.push(element);
        }
      });
      this.maxDaysValue = Math.max(...newAllowanceDetails.map(({ allowanceDays }) => allowanceDays));
      this.minDaysValue = Math.min(...newAllowanceDetails.map(({ allowanceDays }) => allowanceDays));
      this.maxVisitsValue = Math.max(...newAllowanceDetails.map(({ visits }) => visits));
      this.minVisitsValue = Math.min(...newAllowanceDetails.map(({ visits }) => visits));
    }
    if (this.previousAllowanceDetails?.auditDetail) {
      const newPrevDetails = [];

      this.previousAllowanceDetails?.auditDetail.forEach(element => {
        if (
          element.allowanceSubType.english !== 'Balance Settlement Allowance' &&
          element.allowanceSubType.english !== 'Balance Settlement Reversal'
        ) {
          newPrevDetails.push(element);
        }
      });

      this.prevMaxDays = Math.max(...newPrevDetails.map(({ allowanceDays }) => allowanceDays));
      this.prevMinDays = Math.min(...newPrevDetails.map(({ allowanceDays }) => allowanceDays));
      this.prevMaxVisits = Math.max(...newPrevDetails.map(({ visits }) => visits));
      this.prevMinVisits = Math.min(...newPrevDetails.map(({ visits }) => visits));

      this.minDaysValue = Math.min(this.minDaysValue, this.prevMinDays);
      this.maxDaysValue = Math.max(this.maxDaysValue, this.prevMaxDays);
      this.maxVisitsValue = Math.max(this.maxVisitsValue, this.prevMaxVisits);
      this.minVisitsValue = Math.min(this.minVisitsValue, this.prevMinVisits);
    }

    if (this.minDaysValue === this.maxDaysValue) {
      this.minDaysValue = 0;
    }
    if (this.minVisitsValue === this.maxVisitsValue) {
      this.minVisitsValue = 0;
    }
  }
  createAllowanceForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false]
    });
  }
  allowanceSelected(allowance, checked) {
    if (checked === 'true') {
      this.selectedAllowance.emit(allowance);
    } else {
      this.removeSelection.emit(allowance);
    }
  }

  applyAllowanceFilter(filterValues: AllowanceFilterParams) {
    this.applyAllowance.emit(filterValues);
  }

  sort() {
    this.sortAllowances();
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
    this.sortAllowances();
  }
  sortAllowances() {
    this.transactionRequest = new PaginationSort();
    this.transactionRequest.column = this.selectedOption;
    this.transactionRequest.direction = this.currentSortDirection;
    this.transactionRequest.directionBoolean = this.isDescending;
    this.sortEvent.emit(this.transactionRequest);
  }

  removeItem(item, arr): void {
    const id = arr.indexOf(item);
    arr.splice(id, 1);
  }
}
