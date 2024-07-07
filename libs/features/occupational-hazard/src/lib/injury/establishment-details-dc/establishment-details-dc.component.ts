/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CommonIdentity,
  Establishment,
  getIdentityByType,
  getPersonArabicName,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';

import { ContributorSearchResult } from '../../shared/models/contributor-search-result';
import { EngagementDetailsDTO } from '../../shared';

@Component({
  selector: 'oh-establishment-dtls-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrls: ['./establishment-details-dc.component.scss']
})
export class EstablishmentDetailsDcComponent implements OnInit {
  /**
   * Local Variables
   */
  sin: number;
  arabicName: string;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  isAppPrivate = false;
  /**
   *  Input Variables
   */
  @Input() isReimbursement = false;
  @Input() isGroupInjury = false;
  @Input() establishment: Establishment;
  @Input() engagementDetails: EngagementDetailsDTO;
  @Input() contributor: ContributorSearchResult;

  /**
   *
   * @param language Creating an instance
   * @param router
   */
  constructor(readonly router: Router, @Inject(ApplicationTypeToken) readonly appToken: string) {}

  /**
   *  This method if for initialization tasks
   */
  ngOnInit() {
    this.setPersonDetails();
    this.arabicName = getPersonArabicName(this.contributor?.person?.name?.arabic);
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }
  /**
   * This method is used to set name details
   */
  setPersonDetails() {
    if (this.contributor?.person) {
      /**
       * getting the identity type for the contributor eg:iqama number border number
       */

      this.primaryIdentity =
        this.contributor.person.identity != null
          ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
          : null;

      this.primaryIdentityType =
        this.primaryIdentity !== null ? 'OCCUPATIONAL-HAZARD.' + this.primaryIdentity.idType : null;
    }
  }
  /**
   * This method is to navigate to dashboard
   */
  navigate() {
    if (this.isAppPrivate) {
      if (this.establishment.registrationNo)
        this.router.navigate([`home/establishment/profile/${this.establishment.registrationNo}/view`]);
      else {
        this.router.navigate(['home/establishment/profile']);
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
  /**
   * This method is to navigate to oh history page
   */

  navigateToInjury() {
    this.router.navigate([
      `home/profile/individual/internal/${this.contributor.socialInsuranceNo}/overview`
    ]);
  }
}
