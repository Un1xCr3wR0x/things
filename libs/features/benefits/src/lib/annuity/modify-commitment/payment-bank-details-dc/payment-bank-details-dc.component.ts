/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BilingualText, GosiCalendar, formatDate } from '@gosi-ui/core';
import { BenefitPaymentDetails, ModifyPaymentDetails } from '../../../shared/models';

@Component({
  selector: 'bnt-payment-bank-details-dc',
  templateUrl: './payment-bank-details-dc.component.html',
  styleUrls: ['./payment-bank-details-dc.component.scss']
})
export class PaymentBankDetailsDcComponent implements OnInit, OnChanges {
  //Local Variables
  ibanBankAccountNo: string;
  bankName: BilingualText = new BilingualText();
  isBankAvailable: boolean;

  //Input Variables
  @Input() modifyCommitmentDetails: ModifyPaymentDetails = new ModifyPaymentDetails();
  @Input() benefitPayDetails: BenefitPaymentDetails = new BenefitPaymentDetails();
  @Input() isEditMode: boolean;
  @Input() isRemove = false;
  @Input() bankHoldDate: GosiCalendar;
  @Input() verificationStatus: BilingualText = new BilingualText();
  @Input() lang = 'en';
  @Input() isIndividualApp: boolean;

  // @Input() bankAccountList: PersonBankDetails[];

  constructor() {}

  ngOnInit(): void {}
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitPayDetails && changes.benefitPayDetails.currentValue) {
      this.checkPaymentMethod(this.benefitPayDetails);
    }
    this.setBankValues();
  }
  /**
   * Method to set bank values
   */
  setBankValues() {
    if (this.isEditMode && this.modifyCommitmentDetails) {
      this.ibanBankAccountNo = this.modifyCommitmentDetails.modifyPayee?.bankAccount?.ibanBankAccountNo;
      this.bankName = this.modifyCommitmentDetails.modifyPayee?.bankAccount?.bankName;
      this.checkPaymentMethod(this.modifyCommitmentDetails.modifyPayee);
      if(this.isRemove) this.bankHoldDate = this.modifyCommitmentDetails.modifyPayee.bankAccount?.holdStartDate;
    } else if (!this.isEditMode && this.benefitPayDetails.bankAccount) {
      this.ibanBankAccountNo = this.benefitPayDetails.bankAccount?.ibanBankAccountNo;
      this.bankName = this.benefitPayDetails.bankAccount?.bankName;
      //this.bankstatus = this.benefitPayDetails.bankAccount?.verificationStatus;
      this.checkPaymentMethod(this.benefitPayDetails);
      // } else if (this.bankAccountList) {
      //   this.ibanBankAccountNo = this.bankAccountList[0]?.ibanBankAccountNo;
      //   this.bankName = this.bankAccountList[0]?.bankName;
      //   this.bankstatus = this.bankAccountList[0]?.verificationStatus;
    }
  }
  checkPaymentMethod(benefitPayDetails) {
    if (benefitPayDetails.paymentMethod?.english === 'Cheque' || benefitPayDetails.paymentMode?.english === 'Cheque')
      this.isBankAvailable = false;
    else this.isBankAvailable = true;
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
