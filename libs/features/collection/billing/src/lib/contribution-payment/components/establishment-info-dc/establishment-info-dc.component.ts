/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { EstablishmentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-establishment-info-dc',
  templateUrl: './establishment-info-dc.component.html',
  styleUrls: ['./establishment-info-dc.component.scss']
})
export class EstablishmentInfoDcComponent {
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() gccFlag: boolean;
}
