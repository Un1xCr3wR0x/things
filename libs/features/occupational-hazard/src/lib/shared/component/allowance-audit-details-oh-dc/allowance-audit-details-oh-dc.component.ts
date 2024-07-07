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
  import { BilingualText, LanguageToken, LovList } from '@gosi-ui/core';
  import { BehaviorSubject } from 'rxjs';
  import { AllowanceSummaryDcComponent } from '../allowance-summary-dc/allowance-summary-dc.component';
  import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
  import { AllowanceAuditSummary, AllowanceFilterParams, PaginationSort } from '../../models';
  import { AllowanceAuditSummaryOh } from '../../models/allowance-audit-summary-oh';
import { AllowanceSummaryOhDcComponent } from '../allowance-summary-oh-dc/allowance-summary-oh-dc.component';
import { Form } from 'testing';
  
  @Component({
    selector: 'oh-allowance-audit-details-oh-dc',
    templateUrl: './allowance-audit-details-oh-dc.component.html',
    styleUrls: ['./allowance-audit-details-oh-dc.component.scss']
  })
  export class AllowanceAuditDetailsOhDcComponent extends AllowanceSummaryOhDcComponent implements OnInit, OnChanges {
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
    aaa: string
    statusFilterForm: FormGroup;
    statusValue: BilingualText[] = [];
    statusList: BilingualText[] = [];
    checkBoxDisabled: boolean[];
    transactionForm: FormArray = new FormArray([]);
  
    initialSortValue = {
      english: 'Start Date',
      arabic: 'تاريخ البداية'
    };
    @Input() previousAllowanceDetails: AuditAllowance = new AuditAllowance();
    @Input() allowanceDetails: AllowanceAuditSummaryOh = new AllowanceAuditSummaryOh();
    @Input() previousAllowance: AuditAllowance = new AuditAllowance();
    @Input() isPrevious = false;
    @Input() allowanceType: LovList;
    @Input() sortList: LovList;
    @Input() closedAllowances: number[];
    @Input() requestedAllowances: number[];
    @Output() selectedAllowance = new EventEmitter();
    @Output() removeSelection = new EventEmitter();
    @Output() applyAllowance: EventEmitter<AllowanceFilterParams> = new EventEmitter();
    @Output() sortEvent: EventEmitter<PaginationSort> = new EventEmitter();
  
    lang = 'en';
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
      // this.transactionForm = new FormArray([]);
      if(this.allowanceDetails) this.createForm(this.allowanceDetails.allowanceBreakUp);
      // this.allowanceDetails.allowanceBreakUp.forEach((element, i) => {
      //   if(element.tpaStatus == "Sent to TPA") {
      //     this.transactionForm.controls[i].get('checkBoxFlag').setValue(true);
      //     this.checkBoxDisabled[i] = true;
      //   }
      //   if(element.allowanceAuditStatus == 'Closed') {
      //     this.checkBoxDisabled[i] = true;
      //   }
      // })
      // this.transactionForm = this.createAllowanceForm();
      this.language.subscribe(language => {
        this.lang = language;
      });
    }
    ngOnChanges(changes: SimpleChanges) {
      if (changes && changes.allowanceDetails && changes.allowanceDetails?.currentValue) {
        this.allowanceDetails = changes.allowanceDetails.currentValue;
        this.createForm(this.allowanceDetails.allowanceBreakUp);
        this.transactionForm.controls.forEach(element => {
          element.get('checkBoxFlag').setValue(false);
        });
        this.allowanceDetails.allowanceBreakUp.forEach((element, i) => {
        console.log('form ', this.transactionForm.controls[i]);
          if(element.tpaStatus == "Sent to TPA") {
            this.transactionForm.controls[i].get('checkBoxFlag').setValue(false);
            this.allowanceDetails.allowanceBreakUp[i].isDisabled = true;
          }
          if(element.allowanceAuditStatus == 'Closed') {
            this.transactionForm.controls[i].get('checkBoxFlag').setValue(true);
            this.allowanceDetails.allowanceBreakUp[i].isDisabled = true;
          }
        })
      }
      if (changes && changes.closedAllowances && changes.closedAllowances?.currentValue) {
        this.allowanceDetails.allowanceBreakUp.forEach((element, i) => {
          this.closedAllowances.forEach(claimId => {
            if(element.ohClaimId === claimId) {
              // this.checkBoxDisabled[i] = true;
              this.transactionForm.controls[i].get('checkBoxFlag').setValue(true);
              this.allowanceDetails.allowanceBreakUp[i].isDisabled = true;
            }
          })
        })
      }
      if (changes && changes.requestedAllowances && changes.requestedAllowances?.currentValue) {
        this.allowanceDetails.allowanceBreakUp.forEach((element, i) => {
          this.requestedAllowances.forEach(claimId => {
            if(element.ohClaimId === claimId) {
              // this.checkBoxDisabled[i] = true;
              this.transactionForm.controls[i].get('checkBoxFlag').setValue(false);
              this.allowanceDetails.allowanceBreakUp[i].isDisabled = true;
            }
          })
        })
      }
      // if (changes && changes.previousAllowanceDetails && changes.previousAllowanceDetails?.currentValue) {
      //   this.previousAllowanceDetails = changes.previousAllowanceDetails.currentValue;
      //   if (this.isPrevious) {
      //     this.allowanceDetails = changes.previousAllowanceDetails.currentValue;
      //     this.cdr.detectChanges();
      //     this.transactionForm = this.createAllowanceForm();
      //   }
      // }
      if (changes && changes.previousAllowance && changes.previousAllowance?.currentValue) {
        this.previousAllowance = changes.previousAllowance.currentValue;
      }
      if (this.allowanceDetails?.allowanceBreakUp) {
        const newAllowanceDetails = [];
        const arrLength = this.allowanceDetails?.allowanceBreakUp.length;
  
        this.allowanceDetails?.allowanceBreakUp.forEach(element => {
          if (
            element.allowanceType.english !== 'Balance Settlement Allowance' &&
            element.allowanceType.english !== 'Balance Settlement Reversal'
          ) {
            newAllowanceDetails.push(element);
          }
        });
        this.maxDaysValue = Math.max(...newAllowanceDetails.map(({ noOfDays }) => noOfDays));
        this.minDaysValue = Math.min(...newAllowanceDetails.map(({ noOfDays }) => noOfDays));
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
    
    createForm(breakUp) {
      breakUp?.forEach(item => {
        this.transactionForm.push(this.createAllowanceForm());
      })
    }
    createAllowanceForm(): FormGroup {
      return this.fb.group({
        checkBoxFlag: [{
          value: false,
          disabled: false
        }]
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
    
    searchParticipant(event) {
      console.log('bb ', event);
    }
  }
  