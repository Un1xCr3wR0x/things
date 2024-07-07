/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BilingualText, Name, formatDate } from '@gosi-ui/core';
// import { DependentDetails } from '../../models/dependent-details';
import { EventValidated, ValidateRequest } from '../../models';
import { Ineligibility } from '../../models/ineligibility';
import { getPensionStatusLabel } from '../../utils/heirOrDependentUtils';

@Component({
  selector: 'bnt-ineligibility-details-dc',
  templateUrl: './ineligibility-details-dc.component.html',
  styleUrls: ['./ineligibility-details-dc.component.scss']
})
export class IneligibilityDetailsDcComponent implements OnInit {
  // [status]="
  //     partiallyEligible ? ('BENEFITS.HEIR-PARTIALLY-ELIGIBLE-MSG' | translate) : singleDepHeirDetails?.message
  //   "
  @Input() details: EventValidated[];
  @Input() lang: string;
  @Input() name: Name;
  @Input() relationship: BilingualText;
  @Input() ineligibility: Ineligibility[] = [];
  @Input() heirPersonId: number;
  @Input() heir: ValidateRequest;
  @Input() isPension: boolean;
  @Input() isDep = false;
  // heirHeading = {
  //   [DependentHeirConstants.eligible()] :'BENEFITS.IS-ELIGIBLE',
  //   'BENEFITS.IS-NOT-ELIGIBLE',
  //   'BENEFITS.PARTIALY-ELIGIBLE'
  // }
  status: string;

  @Output() close: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.status = getPensionStatusLabel(this.heir?.statusAfterValidation, this.isDep);
  }

  getHeading() {
    // BENEFITS.IS-ELIGIBLE
    // BENEFITS.IS-NOT-ELIGIBLE
    // BENEFITS.PARTIALY-ELIGIBLE
  }

  closeModal() {
    this.close.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
