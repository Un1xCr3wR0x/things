/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  checkNull,
  CommonIdentity,
  getIconText,
  getIdentityByType,
  getPersonName,
  GosiCalendar,
  LanguageToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { Person } from '../../models';

@Component({
  selector: 'oh-contributor-info-dc',
  templateUrl: './contributor-info-dc.component.html',
  styleUrls: ['./contributor-info-dc.component.scss']
})
export class ContributorInfoDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  personName: string;
  iconName: string;
  lang = 'en';
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  dateOfBirth: GosiCalendar = new GosiCalendar();
  /**
   * Input variables
   */

  @Input() personDetails: Person;

  /**
   * This method is used to initialise the component*
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /**
   * This method if for initialization tasks
   */
  ngOnInit() {
    this.language.subscribe(language => (this.lang = language));
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
      if (this.personDetails.birthDate?.gregorian) {
        this.dateOfBirth = this.personDetails.birthDate;
      } else {
        this.dateOfBirth = new GosiCalendar();
      }
    }
  }
  /**
   * This method is set Icon Name
   * @param transaction
   */
  setIconName(lang) {
    return getIconText(this.personDetails.name, lang);
  }
  /**
   * This method is used to set name details
   */
  setPersonDetails() {
    if (this.personDetails) {
      this.personName = getPersonName(this.personDetails.name, this.lang);
      this.personName = !checkNull(this.personName) ? this.personName : null;
      this.iconName = this.setIconName(this.lang);

      /**
       * getting the identity type for the contributor eg:iqama number border number
       */
      if(this.personDetails.nationality){
        this.primaryIdentity =
        this.personDetails.identity != null
          ? getIdentityByType(this.personDetails.identity, this.personDetails.nationality.english)
          : null;
      }

      this.primaryIdentityType =
        this.primaryIdentity !== null ? 'OCCUPATIONAL-HAZARD.' + this.primaryIdentity.idType : null;
    }
  }
}
