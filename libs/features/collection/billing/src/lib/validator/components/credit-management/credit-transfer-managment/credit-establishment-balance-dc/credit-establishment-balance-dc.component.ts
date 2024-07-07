/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EstablishmentDetails, CreditManagmentRequest } from '../../../../../shared/models';

@Component({
  selector: 'blg-credit-establishment-balance-dc',
  templateUrl: './credit-establishment-balance-dc.component.html',
  styleUrls: ['./credit-establishment-balance-dc.component.scss']
})
export class CreditEstablishmentBalanceDcComponent implements OnChanges {
  // Input Variables
  @Input() establishmentDet: EstablishmentDetails;
  @Input() editFlag: boolean;
  @Input() creditEstDetails: CreditManagmentRequest;
  @Input() currentBalanceList;
  @Input() creditAvailableBalance: boolean;

  // Local Variables
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.creditEstDetails?.currentValue) {
      this.creditEstDetails = changes?.creditEstDetails?.currentValue;
    }
    if (changes?.currentBalanceList?.currentValue) {
      this.currentBalanceList = changes?.currentBalanceList?.currentValue;
    }
  }
  navigateToEdit() {}
}
