/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cim-info-modal-dc',
  templateUrl: './info-modal-dc.component.html',
  styleUrls: ['./info-modal-dc.component.scss']
})
export class InfoModalDcComponent {
  /** Input variables */
  @Input() contentKey: string;
  @Input() deathDate: string;
  @Input() heading: string;

  /** Output variables */
  @Output() ok: EventEmitter<boolean> = new EventEmitter();

  handleModalAction() {
    this.ok.emit(true);
  }
}
