import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TerminationTransactionsDetails } from '../../../../shared/models/termination-transactions-details';

@Component({
  selector: 'blg-contributor-bank-details-dc',
  templateUrl: './contributor-bank-details-dc.component.html',
  styleUrls: ['./contributor-bank-details-dc.component.scss']
})
export class ContributorBankDetailsDcComponent implements OnInit, OnChanges {
  // Local Variables
  contributorBankDetailsForm: FormGroup;
  isBankTransfer = true;
  modalRef: BsModalRef;
  paymentMode: BilingualText;

  //input variable
  @Input() bankNameFromApi: BilingualText;
  @Input() lang;
  @Input() transferModeList: LovList;
  @Input() ibanNumber: string;
  @Input() bankName: BilingualText;
  @Input() parentForm: FormGroup;
  @Input() transactionsDetails: TerminationTransactionsDetails;

  // Output Variables
  @Output() onGetBankNameChanged = new EventEmitter();
  @Output() saveNewIban = new EventEmitter();
  @Output() saveDetails: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.contributorBankDetailsForm = this.createBankForm();
    if (this.parentForm) {
      this.parentForm.addControl('contributorBankDetailsForm', this.contributorBankDetailsForm);
    }
  }

  // this method is used to get values on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.transactionsDetails?.currentValue) {
      this.transactionsDetails = changes?.transactionsDetails?.currentValue;
      this.paymentMode = this.transactionsDetails?.transferMode;
      this.contributorBankDetailsForm.get('option').get('english').setValue(this.paymentMode.english);
      if (this.paymentMode.english === 'Bank Transfer') {
        this.isBankTransfer = true;
      }
    }
    if (changes?.bankNameFromApi?.currentValue) {
      this.bankNameFromApi = changes?.bankNameFromApi?.currentValue;
    }
    if (changes?.bankName?.currentValue) {
      this.bankName = changes?.bankName?.currentValue;
    }
    if (changes?.ibanNumber?.currentValue) {
      this.ibanNumber = changes?.ibanNumber?.currentValue;
    }
  }
  /**
   * Method to create  form
   */
  createBankForm() {
    return this.fb.group({
      option: this.fb.group({
        english: ['Bank Transfer', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      })
    });
  }
  selectValues(val) {
    if (val === 'Bank Transfer') this.isBankTransfer = true;
    else this.isBankTransfer = false;
  }
  // * Method to get new bank name and iban
  saveNewBankDetails(bankDet) {
    this.saveNewIban.emit(bankDet);
  }
  /** Method to save . */
  saveAndNext(): void {
    this.saveDetails.emit();
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  onGetBankName(iban) {
    if (iban?.length > 0) this.onGetBankNameChanged.emit(iban);
  }
}
