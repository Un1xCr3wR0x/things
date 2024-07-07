import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Inject,
  Output,
  EventEmitter,
  OnChanges,
  TemplateRef
} from '@angular/core';
import { CreditBalanceDetails, CreditRefundDetails, CreditRefundRequest } from '../../../../shared/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BilingualText, greaterThanValidator, LanguageToken, lessThanValidator, LovList } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'blg-credit-balance-details-dc',
  templateUrl: './credit-balance-details-dc.component.html',
  styleUrls: ['./credit-balance-details-dc.component.scss']
})
export class CreditBalanceDetailsDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() workflowFlag: boolean;
  @Input() creditBalanceDetails?: CreditBalanceDetails;
  @Input() inWorkflow: boolean;
  @Input() amount: number;
  @Input() vicCreditBalanceDetails: CreditRefundRequest;
  @Input() creditRetainedList: LovList;
  @Input() parentForm: FormGroup;
  @Input() creditRefundDetails: CreditRefundDetails;
  @Input() isRefundCreditBalance: boolean;
  @Input() fromPage: string;
  @Input() isIbanDetails: boolean;

  // Output Variables
  @Output() amountToBeRefunded: EventEmitter<number> = new EventEmitter();
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() creditRetained: EventEmitter<boolean> = new EventEmitter();
  // Local Variables
  amtRefundedForm: FormGroup;
  refundedAmt;
  balance: number;
  refundBalFlag = false;
  modalRef: BsModalRef;
  creditRetainedForm: FormGroup;
  iscreditRetained = false;
  creditRefundValues: BilingualText;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.amtRefundedForm = this.createAmtRefundedForm();
    this.creditRetainedForm = this.createCreditRetainedForm();
    if (this.parentForm) {
      this.parentForm.addControl('crditRetainedForm', this.creditRetainedForm);
    }
    if (this.creditRefundValues) {
      this.creditRetainedForm?.get('creditRetained').get('english').setValue(this.creditRefundValues.english);
      if (this.creditRetainedForm?.get('creditRetained').get('english').value === 'Do not Retain Amount') {
        this.iscreditRetained = false;
      } else this.iscreditRetained = true;
      this.creditRetained.emit(this.iscreditRetained);
    }
    this.setRefundedAmount();
  }

  createAmtRefundedForm(): FormGroup {
    return this.fb.group({
      refundedAmount: [
        this.inWorkflow ? this.amount : '',
        {
          validators: Validators.compose([
            greaterThanValidator(0),
            lessThanValidator(this.checkValidator()),
            Validators.required
          ]),
          updateOn: 'blur'
        }
      ]
    });
  }
  /**
   * Method to create  form
   */
  createCreditRetainedForm() {
    return this.fb.group({
      creditRetained: this.fb.group({
        english: ['Do not Retain Amount', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      })
    });
  }
  checkValidator() {
    if (!this.iscreditRetained && this.isRefundCreditBalance) return this.creditBalanceDetails?.totalCreditBalance;
    else return this.creditBalanceDetails?.transferableBalance;
  }
  selectValues(val) {
    if (val === 'Do not Retain Amount') {
      this.iscreditRetained = false;
      this.amtRefundedForm
        .get('refundedAmount')
        .setValidators([
          lessThanValidator(this.creditBalanceDetails.totalCreditBalance),
          greaterThanValidator(0),
          Validators.required
        ]);
    } else {
      this.iscreditRetained = true;
      this.amtRefundedForm
        .get('refundedAmount')
        .setValidators([
          lessThanValidator(this.creditBalanceDetails.transferableBalance),
          greaterThanValidator(0),
          Validators.required
        ]);
    }
    this.amtRefundedForm.get('refundedAmount').reset();
    this.creditRetained.emit(this.iscreditRetained);
  }
  setRefundedAmount() {
    if (this.inWorkflow) {
      this.amtRefundedForm = this.createAmtRefundedForm();
      this.amtRefundedForm.get('refundedAmount').setValue(parseFloat(this.amount?.toString()).toFixed(2));
      this.refundedAmt = this.amount;
      this.setRefundFlag();
    }
    this.amtRefundedForm?.get('refundedAmount').valueChanges.subscribe(value => {
      this.refundedAmt = value;
      this.setRefundFlag();
    });
  }
  setRefundFlag() {
    if (this.refundedAmt < 0) {
      this.refundBalFlag = false;
    } else if (this.refundedAmt > this.creditBalanceDetails?.transferableBalance) {
      this.refundBalFlag = false;
    } else {
      this.refundBalFlag = true;
    }
    if (!this.iscreditRetained && this.isRefundCreditBalance) {
      if (this.refundedAmt > this.creditBalanceDetails?.totalCreditBalance) this.refundBalFlag = false;
      else this.refundBalFlag = true;
    }
    if (this.iscreditRetained) this.balance = this.creditBalanceDetails?.transferableBalance - this.refundedAmt;
    else this.balance = this.creditBalanceDetails?.totalCreditBalance - this.refundedAmt;
    if (!this.isRefundCreditBalance) this.balance = this.creditBalanceDetails?.transferableBalance - this.refundedAmt;
    this.amountToBeRefunded.emit(this.refundedAmt);
  }
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.creditBalanceDetails && changes.creditBalanceDetails.currentValue) {
      this.creditBalanceDetails = changes.creditBalanceDetails.currentValue;
      this.amtRefundedForm = this.createAmtRefundedForm();
      this.setRefundedAmount();
    }
    if (changes?.creditRefundDetails?.currentValue) {
      this.creditRefundDetails = changes?.creditRefundDetails?.currentValue;
      this.creditRefundValues = this.creditRefundDetails.creditRetainIndicator;
    }
    if (changes && changes.amount && changes.amount.currentValue) {
      if (this.inWorkflow) {
        this.amtRefundedForm = this.createAmtRefundedForm();
        this.amtRefundedForm.get('refundedAmount').setValue(parseFloat(this.amount.toString()).toFixed(2));
        this.setRefundedAmount();
      }
    }
  }
  // * Method to show a popup.
  showModal(template: TemplateRef<HTMLElement>, size: string) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Method to show a confirmation popup for cancelling the transaction.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to show modal. */
  saveAndNextDetails(): void {
    if (this.amtRefundedForm?.get('refundedAmount').valid) {
      this.save.emit();
    }
  }
  /** Method to confirm cancellation of the form. */
  confirmCancelBtn() {
    this.modalRef.hide();
    this.cancel.emit();
  }
  /** Method to decline the popUp. */
  declinePopup() {
    this.modalRef.hide();
  }
}
