import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Establishment } from '@gosi-ui/core';
import {
  EstablishmentTypeEnum,
  TerminatePaymentMethodEnum,
  TerminateResponse,
  isGccEstablishment
} from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-close-establishment-details-dc',
  templateUrl: './close-establishment-details-dc.component.html',
  styleUrls: ['./close-establishment-details-dc.component.scss']
})
export class CloseEstablishmentDetailsDcComponent implements OnInit, OnChanges {
  //Local Variables
  balanceAmount: number;
  isDebit: boolean;
  bankPaymentMethod = TerminatePaymentMethodEnum.BANK;
  isGcc: boolean;
  /**
   * Input Variables
   */
  @Input() establishment: Establishment;
  @Input() isCloseEst = false;
  @Input() establishmentToValidate: Establishment;
  @Input() closeEstDetails: TerminateResponse;

  /**
   * Output Variables
   */
  @Output() establishmentProfile: EventEmitter<number> = new EventEmitter();
  @Output() viewBill: EventEmitter<null> = new EventEmitter();
  main = EstablishmentTypeEnum.MAIN;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.closeEstDetails) {
      this.closeEstDetails = changes.closeEstDetails.currentValue;
      this.balanceAmount = Math.abs(
        this.closeEstDetails?.balance?.outStandingAmount - this.closeEstDetails?.balance?.creditBalance
      );
      this.isDebit = this.closeEstDetails?.debit;
    }
    if (changes.establishment) {
      this.isGcc = isGccEstablishment(changes?.establishment?.currentValue);
    }
  }
  goToEstProfile() {
    this.establishmentProfile.emit(this.establishment?.registrationNo);
  }
}
