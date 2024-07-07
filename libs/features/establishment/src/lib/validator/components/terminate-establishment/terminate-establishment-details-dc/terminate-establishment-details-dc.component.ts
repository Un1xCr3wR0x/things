/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Establishment, TransactionReferenceData } from '@gosi-ui/core';
import {
  isGccEstablishment,
  TerminatePaymentMethodEnum,
  TerminateResponse
} from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-terminate-establishment-details-dc',
  templateUrl: './terminate-establishment-details-dc.component.html',
  styleUrls: ['./terminate-establishment-details-dc.component.scss']
})
export class TerminateEstablishmentDetailsDcComponent implements OnInit, OnChanges {
  //Local Variables
  balanceAmount: number;
  isDebit: boolean;
  bankPaymentMethod = TerminatePaymentMethodEnum.BANK;
  isGcc: boolean;
  //Input Variables
  @Input() establishment: Establishment;
  @Input() establishmentToValidate: Establishment;
  @Input() closeEstablishmentDetails: TerminateResponse;
  @Input() canEdit: boolean;
  @Input() comments: TransactionReferenceData[];

  //Output variables
  @Output() navigateToClose: EventEmitter<null> = new EventEmitter();
  @Output() viewBill: EventEmitter<null> = new EventEmitter();

  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.closeEstablishmentDetails) {
      this.closeEstablishmentDetails = changes.closeEstablishmentDetails.currentValue;
      this.balanceAmount = Math.abs(
        this.closeEstablishmentDetails?.balance?.outStandingAmount -
          this.closeEstablishmentDetails.balance?.creditBalance
      );
      this.isDebit = this.closeEstablishmentDetails?.debit;
    }
    if (changes.establishment) {
      this.isGcc = isGccEstablishment(changes.establishment.currentValue);
    }
  }

  ngOnInit(): void {}

  navigateToTerminateEst() {
    this.navigateToClose.emit();
  }
}
