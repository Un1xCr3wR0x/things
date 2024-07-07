/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'est-no-result-dc',
  templateUrl: './no-result-dc.component.html',
  styleUrls: ['./no-result-dc.component.scss']
})
export class NoResultDcComponent {
  @Input() message = 'ESTABLISHMENT.NO-RESULTS';

  constructor() {}
}
