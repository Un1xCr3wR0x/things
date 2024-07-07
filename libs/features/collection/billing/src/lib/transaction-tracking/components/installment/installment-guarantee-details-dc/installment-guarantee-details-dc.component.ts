import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { convertToStringDDMMYYYY } from '@gosi-ui/core';
import { InstallmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-installment-guarantee-details-dc',
  templateUrl: './installment-guarantee-details-dc.component.html',
  styleUrls: ['./installment-guarantee-details-dc.component.scss']
})
export class InstallmentGuaranteeDetailsDcComponent implements OnInit, OnChanges {
  //localVariable
  isDownPayment = false;
  gracePeriod: number;
  installmentNameLabel: string;
  installementAmountLabel: string;
  installmentidLabel: string;
  installmentstartDateLabel: string;
  installmentendDateLabel: string;
  deathDate: string;
  @Input() installmentSubmittedDetails: InstallmentRequest;
  constructor() {}

  ngOnInit(): void {
    /**
     * This method is to detect changes in input property.
     * @param changes
     */
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.installmentSubmittedDetails && changes.installmentSubmittedDetails.currentValue) {
      if (this.installmentSubmittedDetails?.guaranteeDetail.length > 0) this.getinstallmentLabel();
      if (this.installmentSubmittedDetails.downPaymentPercentage === 0) this.isDownPayment = false;
      else this.isDownPayment = true;
      this.gracePeriod =
        this.installmentSubmittedDetails.gracePeriod + this.installmentSubmittedDetails.extendedGracePeriod;
      this.deathDate = convertToStringDDMMYYYY(
        this.installmentSubmittedDetails?.guaranteeDetail[0]?.deathDate?.gregorian.toString()
      );
    }
  }
  getinstallmentLabel() {
    if (this.installmentSubmittedDetails?.guaranteeDetail[0].category?.english === 'Bank Guarantee') {
      this.installmentNameLabel = 'BILLING.GUARANTEE-BANK';
      this.installmentidLabel = 'BILLING.GUARANTEE-NUMBER';
      this.installmentstartDateLabel = 'BILLING.GUARANTEE-START-DATE';
      this.installmentendDateLabel = 'BILLING.GUARANTEE-END-DATE';
      this.installementAmountLabel = 'BILLING.GUARANTEE-AMOUNT';
    } else if (this.installmentSubmittedDetails?.guaranteeDetail[0].category?.english === 'Promissory Note') {
      this.installmentNameLabel = 'BILLING.BENEFICIARY-NAME';
      this.installmentidLabel = 'BILLING.BENEFICIARY-NATIONAL-ID';
      this.installmentstartDateLabel = 'BILLING.PROMISORY-START-DATE';
      this.installmentendDateLabel = 'BILLING.PROMISORY-END-DATE';
      this.installementAmountLabel = 'BILLING.PROMISORY-AMOUNTT';
    } else if (this.installmentSubmittedDetails?.guaranteeDetail[0].category?.english === 'Pension') {
      this.installmentNameLabel = 'BILLING.BENEFICIARY-NAME';
      this.installmentidLabel = 'BILLING.BENEFICIARY-NATIONAL-ID';
      this.installementAmountLabel = 'BILLING.PENSION';
    } else if (this.installmentSubmittedDetails?.guaranteeDetail[0].category?.english === 'Other') {
      this.installementAmountLabel = 'BILLING.SALARY-AMOUNT';
    }
  }
}
