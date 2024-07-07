/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { EstablishmentDetails, CurrencyDetails, PaymentDetails } from '../../models';

@Component({
  selector: 'blg-establishment-banner-dc',
  templateUrl: './establishment-banner-dc.component.html',
  styleUrls: ['./establishment-banner-dc.component.scss']
})
export class EstablishmentBannerDcComponent {
  /** Input variables. */
  @Input() establishment: EstablishmentDetails;
  @Input() showReceiptStatus = true;
  @Input() gccFlag: boolean;
  @Input() currencyDetails: CurrencyDetails;
  @Input() receipt: PaymentDetails;
}
