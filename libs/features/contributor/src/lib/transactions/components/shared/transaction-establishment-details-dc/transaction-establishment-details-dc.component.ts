import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { checkBilingualTextNull } from '@gosi-ui/core';
import { Establishment } from '@gosi-ui/features/contributor';

@Component({
  selector: 'cnt-transaction-establishment-details-dc',
  templateUrl: './transaction-establishment-details-dc.component.html',
  styleUrls: ['./transaction-establishment-details-dc.component.scss']
})
export class TransactionEstablishmentDetailsDcComponent implements OnInit {
  @Input() establishment: Establishment;
  @Input() registrationNo: number;
  @Input() CNTWage;

  constructor() {}

  ngOnInit(): void {}

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
}
