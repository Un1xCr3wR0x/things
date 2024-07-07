/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EstablishmentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-establishment-payment-banner-dc',
  templateUrl: './establishment-payment-banner-dc.component.html',
  styleUrls: ['./establishment-payment-banner-dc.component.scss']
})
export class EstablishmentPaymentBannerDcComponent implements OnChanges {
  //local Variable
  isMain = false;
  //Input variables
  @Input() isMOF: boolean;
  @Input() gccFlag: boolean;
  @Input() estDetails: EstablishmentDetails;

  /**
   * This method is to detect changes in input property.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.estDetails && changes.estDetails.currentValue) {
      this.estDetails = changes.estDetails.currentValue;
      if (this.estDetails.establishmentType.english === 'Main') this.isMain = true;
    }
  }
}
