import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { monthDiff, Lov, formatDate } from '@gosi-ui/core';
import { BenefitRecalculation } from '../../../../shared';

@Component({
  selector: 'bnt-benefit-recalculation-details-dc',
  templateUrl: './benefit-recalculation-details-dc.component.html',
  styleUrls: ['./benefit-recalculation-details-dc.component.scss']
})
export class BenefitRecalculationDetailsDcComponent implements OnInit {
  @Input() bankNameList: Lov;
  @Input() benefitType: string;
  @Input() benefitRecalculationDetails: BenefitRecalculation;
  @Input() lang = 'en';

  @Output() onPaymentDetailsSave = new EventEmitter();
  @Output() onIbanChanged = new EventEmitter();
  @Output() onBankDetailsCancelled = new EventEmitter();
  @Output() onPreviousBtnClicked = new EventEmitter();

  benefitsForm = new FormGroup({});
  monthDifference = monthDiff;
  constructor() {}

  ngOnInit(): void {
    this.benefitsForm.addControl('checkBoxFlag', new FormControl(false, Validators.required));
  }
  changeCheck(event) {}
  /** Method to save bank details */
  onSavePayment() {
    this.onPaymentDetailsSave.emit();
  }
  /** Method to pass iban to smart coomponent  */
  passIban(iban) {
    this.onIbanChanged.emit(iban);
  }
  /** Method to cancel bank details tab */
  onPaymentCancel() {
    this.onBankDetailsCancelled.emit();
  }
  /** Method to reach previous tab */
  previousSection() {
    this.onPreviousBtnClicked.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
