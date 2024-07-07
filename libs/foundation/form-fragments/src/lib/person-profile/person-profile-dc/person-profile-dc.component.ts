/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges, Inject } from '@angular/core';
import {
  IdentityTypeEnum,
  GenderEnum,
  Person,
  ContactDetails,
  getArabicName,
  getPersonIdentifier,
  Contributor,
  BaseComponent,
  maleIconLocation,
  FemaleIconLocation,
  ApplicationTypeEnum,
  ApplicationTypeToken
} from '@gosi-ui/core';
import { Router } from '@angular/router';

@Component({
  selector: 'frm-person-profile-dc',
  templateUrl: './person-profile-dc.component.html',
  styleUrls: ['./person-profile-dc.component.scss']
})
export class PersonProfileDcComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  //Local Variables
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  contributor: Contributor = new Contributor();
  person: Person;
  socialInsuranceNo: number;
  active = false;
  isContributor = false;
  iconLocation = maleIconLocation;
  iconName: string;
  personArabicName = '';
  hasBorderWorkFlow = false;
  hasIqamaWorkFlow = false;
  isIqamaReturned = false;
  isBorderReturned = false;

  //Input variables
  isUserLoggedIn = false;
  isCsr = false;
  @Input() personDetails;

  /**
   * Creates an instance of PersonProfileScComponent
   * @memberof  PersonProfileDcComponent
   *
   */
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string, readonly router: Router) {
    super();
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isCsr = true;
    } else {
      this.isCsr = false;
    }
  }

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    if (this.router.url.includes('user')) {
      this.isUserLoggedIn = true;
    } else {
      this.isUserLoggedIn = false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.personDetails && changes.personDetails.currentValue) {
      this.initialisePersonDetails(changes.personDetails.currentValue.person);
      this.socialInsuranceNo = changes.personDetails.currentValue.socialInsuranceNo;
      this.active = changes.personDetails.currentValue.active;
    }
  }
  /**
   * Method to initialise person details
   * @param person
   */
  initialisePersonDetails(person: Person): void {
    if (person && person !== null) {
      this.person = person;
      if (this.person) {
        if (this.person.sex?.english === GenderEnum.MALE) {
          this.iconLocation = maleIconLocation;
        } else {
          this.iconLocation = FemaleIconLocation;
        }
      }
      if (!this.person.contactDetail) {
        this.person.contactDetail = new ContactDetails();
        this.person.contactDetail.addresses = [];
      }
      if (!this.person.contactDetail.addresses) {
        this.person.contactDetail.addresses = [];
      }
      this.personArabicName = getArabicName(this.person.name.arabic);
      this.enableFunctionalitites();
    }
  }
  /**
   * This method is enable the various functionalities according to the person role viewing the screen
   */
  enableFunctionalitites() {
    if (this.person) {
      this.contributor.person.identity = [...getPersonIdentifier(this.person)];
      this.person.identity = [...getPersonIdentifier(this.person)];
    }
  }
}
