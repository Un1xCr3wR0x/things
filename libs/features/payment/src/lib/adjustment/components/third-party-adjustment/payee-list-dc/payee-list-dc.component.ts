/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { LovList } from '@gosi-ui/core';
import { AdjustmentConstants, IbanStatusEnum, PayeeDetails } from '@gosi-ui/features/payment/lib/shared';

@Component({
  selector: 'pmt-payee-list-dc',
  templateUrl: './payee-list-dc.component.html',
  styleUrls: ['./payee-list-dc.component.scss']
})
export class PayeeListDcComponent implements OnInit, OnChanges {
  // Local Variables
  payeeForm: FormGroup;
  isChecked = false;
  checkForm: FormGroup;
  listYesNo$: Observable<LovList>;
  payees: FormArray;
  payeesMap: Map<number, { lov: LovList; payee: PayeeDetails }> = new Map();
  selectedPayeeId: number;
  activeIbanStatus = IbanStatusEnum.ACTIVE;

  @Input() pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  @Input() payeeDetails: PayeeDetails[];
  @Input() itemsPerPage = AdjustmentConstants.ADJUSTMENT_PAGE_SIZE;
  @Input() totalPayees: number;

  // Output Variables
  @Output() onSelectPayee: EventEmitter<PayeeDetails> = new EventEmitter();
  @Output() pageIndexEvent: EventEmitter<number> = new EventEmitter();

  constructor(private fb: FormBuilder) {
    this.payeeForm = this.createPayeeForm();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.payeeDetails?.currentValue) {
      this.reset();
      changes?.payeeDetails?.currentValue?.forEach((payee: PayeeDetails, index: number) => {
        const collection = this.payeesMap.get(index);
        payee.ibanStatus = payee?.ibanStatus?.toString();
        if (!collection) {
          this.payeesMap.set(index, {
            lov: new LovList([
              { value: { english: payee?.payeeId.toString(), arabic: payee?.payeeId.toString() }, sequence: 0 }
            ]),
            payee: payee
          });
        }
        this.addRadioInput();
      });
    }
  }
  /*
   * This method is to create payee form
   */
  createPayeeForm(): FormGroup {
    return this.fb.group({
      payees: new FormArray([])
    });
  }

  createPayeeInput(): FormGroup {
    return this.fb.group({
      english: [null, { updateOn: 'blur' }],
      arabic: null
    });
  }

  addRadioInput() {
    this.payees = this.payeeForm?.get('payees') as FormArray;
    this.payees.push(this.createPayeeInput());
  }

  selectPayeee() {
    this.isChecked = true;
    this.onSelectPayee.emit(this.payeeDetails.find(payee => payee.payeeId === this.selectedPayeeId));
  }
  selectPaye() {
    this.isChecked = true;
  }

  onCheckPayee(personId: string, index: number) {
    this.selectedPayeeId = +personId;
    this.payees?.controls?.forEach((formGroup: FormGroup, i: number) => {
      if (i !== index) formGroup?.reset();
    });
  }

  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (page !== this.pageDetails.currentPage) {
      this.pageIndexEvent.emit(page);
    }
  }
  /**
   * method to reset th list
   */
  reset() {
    this.payees = this.payeeForm?.get('payees') as FormArray;
    this.payees?.clear();
    this.payeesMap?.clear();
  }
}
