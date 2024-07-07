/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EstablishmentDetails, PenalityWavier } from '../../../shared/models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'blg-waiver-establishment-info-dc',
  templateUrl: './waiver-establishment-info-dc.component.html',
  styleUrls: ['./waiver-establishment-info-dc.component.scss']
})
export class WaiverEstablishmentInfoDcComponent {
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() wavierDetails: PenalityWavier;
  @Input() documents: Document;
  @Input() isScan: boolean;
  @Input() parentForm: FormGroup;
  @Input() gracePeriodFlag: boolean;

  @Output() doc: EventEmitter<null> = new EventEmitter();

  refreshDocuments(item) {
    this.doc.emit(item);
  }
}
