/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonIdentity, getIdentityByType, getPersonNameAsBilingual, Person } from '@gosi-ui/core';
import { EngagementDetails } from '../models/engagement';

@Component({
  selector: 'frm-personal-details-dc',
  templateUrl: './personal-details-dc.component.html',
  styleUrls: ['./personal-details-dc.component.scss']
})
export class PersonalDetailsDcComponent implements OnInit, OnChanges {
  @Input() personDetails: Person;
  @Input() selectedEngagament: EngagementDetails;

  constructor() {}
  personType: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  personNameEnglish: string = null;
  personNameArabic: String = null;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.personDetails = changes.personDetails.currentValue;
    if (this.personDetails) {
      /**
       * setting the identity
       */
      this.personType = getIdentityByType(this.personDetails.identity, this.personDetails.nationality.english);
      this.primaryIdentityType = 'FORM-FRAGMENTS.' + this.personType.idType;
      const nameObj = getPersonNameAsBilingual(this.personDetails.name);
      this.personNameEnglish = nameObj.english;
      this.personNameArabic = nameObj.arabic;
    }
  }
}
