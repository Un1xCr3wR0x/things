/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  BorderNumber,
  CommonIdentity,
  getIdentityByType,
  getPersonArabicName,
  getPersonEnglishName,
  Iqama,
  LanguageToken,
  NationalId,
  NIN,
  Passport,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ContributorWageDetails } from '../../../shared';

@Component({
  selector: 'cnt-employee-details-dc',
  templateUrl: './employee-details-dc.component.html',
  styleUrls: ['./employee-details-dc.component.scss']
})
export class EmployeeDetailsDcComponent implements OnInit {
  //Input variables
  @Input() contributorWage: ContributorWageDetails;
  @Input() enableNavigation = false;

  /** Output variables. */
  @Output() navigateToProfile: EventEmitter<number> = new EventEmitter();

  //Local Variables
  selectedIdentity: CommonIdentity;
  arabicName: string;
  englishName: string;

  /**
   * This method is to initialize EmployeeDetailsDcComponent
   * @param language
   * */
  constructor(
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {}

  /**
   * This method is used to handle further initialization tasks
   */
  ngOnInit(): void {
    this.englishName = getPersonEnglishName(this.contributorWage.name.english);
    this.arabicName = getPersonArabicName(this.contributorWage.name.arabic);
    this.selectedIdentity = this.getIdentityByType(
      this.contributorWage.identity,
      this.contributorWage.nationality.english
    );
  }
  /**
   * to navigate Person Profile of that particular contributor
   */
  navigateToPersonProfile() {
    if (this.enableNavigation) this.navigateToProfile.emit(this.contributorWage.socialInsuranceNo);
  }

  setManageWageCredentials() {}
  /**
   * This method is to fetch required identitiers by nationality
   * @param identity
   * @param nationality
   */
  getIdentityByType(
    identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>,
    nationality: string
  ): CommonIdentity {
    if (nationality) {
      const value: CommonIdentity = getIdentityByType(identity, nationality);
      value.idType = 'CONTRIBUTOR.WAGE.' + value.idType;
      return value;
    }
  }
}
