/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cnt-view-contract-details-dc',
  templateUrl: './view-contract-details-dc.component.html',
  styleUrls: ['./view-contract-details-dc.component.scss']
})
export class ViewContractDetailsDcComponent {
  /** Output variables. */
  @Output() onViewDetailsClicked: EventEmitter<null> = new EventEmitter<null>(null);

  /** Method to handle view contract details. */
  onViewClick() {
    this.onViewDetailsClicked.emit();
  }
}
