/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VicWageUpdateDetails } from '../../../../shared/models';
@Component({
  selector: 'cnt-view-vic-individual-wage-details-dc',
  templateUrl: './view-vic-individual-wage-details-dc.component.html',
  styleUrls: ['./view-vic-individual-wage-details-dc.component.scss']
})
export class ViewVicIndividualWageDetailsDcComponent {
  /** Input variables */
  @Input() vicEngagement: VicWageUpdateDetails;
  @Input() canEdit: boolean;
  @Input() eligiblePRBoolean: boolean;

  /** Output variables */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /** Method to handle edit. */
  editEngagementDetails() {
    this.onEdit.emit();
  }
}
