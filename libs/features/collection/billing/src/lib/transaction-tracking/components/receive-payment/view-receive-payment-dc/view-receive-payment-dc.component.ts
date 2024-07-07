import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BilingualText, DocumentItem } from '@gosi-ui/core';
import { BranchBreakup, CurrencyDetails, EstablishmentDetails, PaymentDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-view-receive-payment-dc',
  templateUrl: './view-receive-payment-dc.component.html',
  styleUrls: ['./view-receive-payment-dc.component.scss']
})
export class ViewReceivePaymentDcComponent implements OnChanges {
  isOutsideGroupPresent: boolean;
  isBranchPresent: boolean;
  branchAmount: BranchBreakup[];
  documents: DocumentItem[] = [];
  @Input() establishmentInfo: EstablishmentDetails;
  @Input() paymentDetails: PaymentDetails;
  @Input() gccFlag: boolean;
  @Input() currency: BilingualText;
  @Input() isMOF: boolean;
  @Input() currencyDetails: CurrencyDetails;
  constructor() {}
  /**
   * This method is to detect changes in input property.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentDetails && changes.paymentDetails.currentValue) {
      if (!this.isMOF) {
        this.isOutsideGroupPresent = this.paymentDetails.branchAmount.some(item => item.outsideGroup);
        this.isBranchPresent = this.paymentDetails.branchAmount.some(item => !item.outsideGroup);
      }
    }
  }
}
