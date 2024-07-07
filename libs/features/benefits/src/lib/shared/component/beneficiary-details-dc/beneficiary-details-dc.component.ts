/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PersonalInformation, DependentDetails } from '../../models';
import { CommonIdentity } from '@gosi-ui/core';
import { getIdRemoveNullValue, getIdLabel } from '../../utils/benefitUtil';

@Component({
  selector: 'bnt-beneficiary-details-dc',
  templateUrl: './beneficiary-details-dc.component.html',
  styleUrls: ['./beneficiary-details-dc.component.scss']
})
export class BeneficiaryDetailsDcComponent implements OnInit {
  idLabel: string;
  idValue: string;

  @Input() personalInfo: DependentDetails;

  @Output() resetDetails = new EventEmitter<null>();

  constructor() {}

  ngOnInit(): void {
    if (this.personalInfo.identity) {
      const idObj: CommonIdentity | null = this.personalInfo.identity.length
        ? getIdRemoveNullValue(this.personalInfo.identity)
        : null;
      if (idObj) {
        this.idValue = idObj.id.toString();
        this.idLabel = getIdLabel(idObj);
      }
    }
  }
  resetSearch() {
    this.resetDetails.emit();
  }
}
