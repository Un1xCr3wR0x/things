/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  BilingualText,
  CommonIdentity,
  getIdentityByType,
  getPersonNameAsBilingual,
  GosiCalendar,
  setArabicIfEnglishEmpty
} from '@gosi-ui/core';
import { PersonalInformation } from '../../models';

@Component({
  selector: 'cnt-contributor-info-dc',
  templateUrl: './contributor-info-dc.component.html',
  styleUrls: ['./contributor-info-dc.component.scss']
})
export class ContributorInfoDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  personName: BilingualText;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  dateOfBirth: GosiCalendar = new GosiCalendar();
  /**
   * Input variables
   */

  @Input() personDetails: PersonalInformation;
  @Input() personNameLabel = 'CONTRIBUTOR.CONTRIBUTOR-NAME';

  /**
   * This method is used to initialise the component*
   */
  constructor() {}

  /**
   * This method if for initialization tasks
   */
  ngOnInit() {
    this.setPersonDetails();
  }
  /**
   * Method to handle input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.personDetails && changes.personDetails.currentValue != null) {
      this.personDetails = changes.personDetails.currentValue;
      this.setPersonDetails();
      if (this.personDetails.birthDate.gregorian) {
        this.dateOfBirth = this.personDetails.birthDate;
      } else {
        this.dateOfBirth = new GosiCalendar();
      }
    }
  }
  /**
   * This method is used to set name details
   */
  setPersonDetails() {
    if (this.personDetails) {
      this.personName = setArabicIfEnglishEmpty(getPersonNameAsBilingual(this.personDetails.name));

      /**
       * getting the identity type for the contributor eg:iqama number border number
       */
      this.primaryIdentity =
        this.personDetails.identity != null
          ? getIdentityByType(this.personDetails.identity, this.personDetails.nationality.english)
          : null;

      this.primaryIdentityType = this.primaryIdentity !== null ? `CONTRIBUTOR.${this.primaryIdentity.idType}` : null;
    }
  }
}
