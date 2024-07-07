/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { BilingualText, Contributor, IdentityTypeEnum, Person } from '@gosi-ui/core';
import { getPersonName } from '@gosi-ui/core';

@Component({
  selector: 'cim-profile-info-dc',
  templateUrl: './profile-info-dc.component.html',
  styleUrls: ['./profile-info-dc.component.scss']
})
export class ProfileInfoDcComponent implements OnInit, OnChanges {
  //Local Variables
  typeNin = IdentityTypeEnum.NIN;
  typeGcc = IdentityTypeEnum.NATIONALID;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  name = new BilingualText();

  //Input Variables
  @Input() contributor: Contributor;
  @Input() person: Person;
  @Input() isUserLoggedIn = false;

  constructor() {}
  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.setPersonName();
  }

  /**
   * Method to detect the input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && (changes.contributor || changes.person)) {
      this.setPersonName();
    }
  }

  /**
   * Method to set the name of the persona
   */
  setPersonName() {
    if (this.isUserLoggedIn) {
      this.name.english = getPersonName(this.person.name, 'en');
      this.name.arabic = getPersonName(this.person.name, 'ar');
    } else {
      this.name.english = getPersonName(this.contributor.person.name, 'en');
      this.name.arabic = getPersonName(this.contributor.person.name, 'ar');
    }
  }
}
