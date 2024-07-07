import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Lov, LovList } from '@gosi-ui/core';

@Component({
  selector: 'blg-receipt-advanced-search-dc',
  templateUrl: './receipt-advanced-search-dc.component.html',
  styleUrls: ['./receipt-advanced-search-dc.component.scss']
})
export class ReceiptAdvancedSearchDcComponent implements OnInit, DoCheck {
  // Local Variables
  maxDate = new Date();
  maxLength = 20;

  // Input
  @Input() parentForm = new FormGroup({});
  @Input() receiptModeList: LovList;

  // output
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() close: EventEmitter<null> = new EventEmitter();
  @Output() change: EventEmitter<null> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.parentForm) {
      this.parentForm.addControl('advancedSearchForm', this.createForm());
    }
  }

  ngDoCheck() {
    if (this.parentForm.get('advancedSearchForm').get('minAmount').value === '0.00') {
      this.parentForm.get('advancedSearchForm').get('minAmount').setValue('');
    }
    if (this.parentForm.get('advancedSearchForm').get('maxAmount').value === '0.00') {
      this.parentForm.get('advancedSearchForm').get('maxAmount').setValue('');
    }
  }

  createForm() {
    return this.fb.group({
      ReceiptDateFrom: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      ReceiptDateTo: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      minAmount: [null],
      maxAmount: [null],
      receiptMode: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      receiptModeCode: [null],
      referenceNo: [null],
      chequeNo: [null],
      registrationNo: [null],
      receiptNo: []
    });
  }

  onClose() {
    this.parentForm.get('advancedSearchForm').reset();
    this.close.emit();
  }

  onSearch() {
    this.search.emit();
  }

  onReceiptModeSelect(receiptMode: Lov) {
    if (receiptMode) {
      this.parentForm.get('advancedSearchForm').get('receiptModeCode').setValue(receiptMode.code);
    } else {
      this.parentForm.get('advancedSearchForm').get('receiptMode').setValue(null);
    }
  }

  onSearchDetailsChange() {
    this.change.emit();
  }
}
