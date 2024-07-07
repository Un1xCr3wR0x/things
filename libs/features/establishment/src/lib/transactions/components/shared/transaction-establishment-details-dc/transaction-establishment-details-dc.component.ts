import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Establishment } from '@gosi-ui/core';

@Component({
  selector: 'est-transaction-establishment-details-dc',
  templateUrl: './transaction-establishment-details-dc.component.html',
  styleUrls: ['./transaction-establishment-details-dc.component.scss']
})
export class TransactionEstablishmentDetailsDcComponent implements OnInit {
  @Input() establishment: Establishment = new Establishment();
  /**
   * Output Variables
   */
  @Output() establishmentProfile: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  goToEstProfile() {
    this.establishmentProfile.emit(this.establishment?.registrationNo);
  }
}
