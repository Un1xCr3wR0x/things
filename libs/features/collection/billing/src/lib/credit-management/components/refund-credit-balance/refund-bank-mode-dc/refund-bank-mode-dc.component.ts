import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CreditRefundDetails } from '../../../../shared/models/credit-refund-details';

@Component({
  selector: 'blg-refund-bank-mode-dc',
  templateUrl: './refund-bank-mode-dc.component.html',
  styleUrls: ['./refund-bank-mode-dc.component.scss']
})
export class RefundBankModeDcComponent implements OnInit, OnChanges {
  // Local Variables
  bankDetailsForm: FormGroup;
  isBankTransfer = true;
  modalRef: BsModalRef;
  paymentModes: BilingualText;
  disabledValues: string[] = [];
  hidenValues: string[] = [];

  //input variable
  @Input() transferModeList: LovList;
  @Input() parentForm: FormGroup;
  @Input() creditRefundDetails: CreditRefundDetails;
  @Input() isBankRequestinProgress: boolean;
  @Input() isAppPrivate: boolean = true;

  // Output Variables
  @Output() modeSelected = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bankDetailsForm = this.createBankForm();
    if (this.parentForm) {
      this.parentForm.addControl('bankModeForm', this.bankDetailsForm);
    }
    if (this.creditRefundDetails) {
      this.setPaymentMode(this.creditRefundDetails);
    }
  }

  // this method is used to get values on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.creditRefundDetails?.currentValue) {
      this.creditRefundDetails = changes?.creditRefundDetails?.currentValue;
      this.setPaymentMode(this.creditRefundDetails);
    }

    if (changes && changes.isBankRequestinProgress) {
      this.isBankRequestinProgress = changes.isBankRequestinProgress.currentValue;
    }
    if (!changes?.isAppPrivate.currentValue) {
      this.disabledValues.push(BillingConstants.CHEQUE);
      this.hidenValues.push(BillingConstants.CHEQUE);
    }
  }
  /**
   * Method to create  form
   */
  createBankForm() {
    return this.fb.group({
      paymentMode: this.fb.group({
        english: ['Bank Transfer', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      })
    });
  }
  selectValues(val) {
    if (val === 'Bank Transfer') {
      this.isBankTransfer = true;
    } else this.isBankTransfer = false;
    this.modeSelected.emit(this.isBankTransfer);
  }

  setPaymentMode(creditRefundDetails) {
    this.paymentModes = creditRefundDetails.paymentMode;
    this.bankDetailsForm?.get('paymentMode').get('english').setValue(this.paymentModes.english);
    if (this.bankDetailsForm?.get('paymentMode').get('english').value === 'Bank Transfer') {
      this.isBankTransfer = true;
    } else this.isBankTransfer = false;

    this.bankDetailsForm?.get('paymentMode').valueChanges.subscribe(value => {
      if (value === 'Bank Transfer') this.isBankTransfer = true;
      else this.isBankTransfer = false;
    });
    this.modeSelected.emit(this.isBankTransfer);
  }
}
