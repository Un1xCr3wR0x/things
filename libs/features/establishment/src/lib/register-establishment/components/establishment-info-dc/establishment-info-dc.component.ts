/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { Establishment } from '@gosi-ui/core/lib/models/establishment';

@Component({
  selector: 'est-establishment-info-dc',
  templateUrl: './establishment-info-dc.component.html',
  styleUrls: ['./establishment-info-dc.component.scss']
})
export class EstablishmentInfoDcComponent {
  @Input() establishment: Establishment = new Establishment();

  /**
   * Creates an instance of EstablishmentInfoDcComponent
   * @memberof  EstablishmentInfoDcComponent
   *
   */
  constructor() {}
}
