/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { EstablishmentConstants, FlagConstants, FlagCreationTypeEnum, FlagDetails } from '../../../shared';

@Component({
  selector: 'est-flag-details-dc',
  templateUrl: './flag-details-dc.component.html',
  styleUrls: ['./flag-details-dc.component.scss']
})
export class FlagDetailsDcComponent implements OnInit {
  userCreationType = FlagCreationTypeEnum.USER;
  addFlagAccessRoles = FlagConstants.ADD_FLAG_ACCESS_ROLES;
  /**
   * Input variables
   */
  @Input() flagDetails: FlagDetails;
  @Input() hasModifyEligibility: boolean;
  @Output() modifyReason: EventEmitter<number> = new EventEmitter();
  appliedBy: BilingualText;

  constructor() {}

  ngOnInit(): void {
    this.appliedBy =
      this.flagDetails.creationType?.english === this.userCreationType
        ? {
            english: this.flagDetails?.initiatedBy?.english + ' (' + this.flagDetails?.initiatedRole?.english + ')',
            arabic: this.flagDetails?.initiatedBy?.arabic + ' (' + this.flagDetails?.initiatedRole?.arabic + ')'
          }
        : { english: this.flagDetails?.initiatedBy?.english, arabic: this.flagDetails?.initiatedBy?.arabic };
  }
  navigateToModifyFlag(flagId) {
    this.modifyReason.emit(flagId);
  }

  onSelectTransactionIdDetails() {
    let url = '';
    url = '/establishment-private/#' + EstablishmentConstants.FLAG_TRACK_ROUTE(this.flagDetails.referenceNo);
    window.open(url, '_blank');
  }
}
