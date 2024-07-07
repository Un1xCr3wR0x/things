/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  CommonIdentity,
  convertToStringDDMMYYYY,
  Establishment,
  getIdentityByType,
  getPersonNameAsBilingual,
  RouterDataToken,
  RouterData,
  Role
} from '@gosi-ui/core';
import { BenefitDetails, ContributorSearchResult, UnemploymentCalculationDto, UnemploymentResponseDto } from '../../../shared/models';
import { ManageBenefitService, UiBenefitsService } from '../../../shared/services';
import { BenefitConstants } from '@gosi-ui/features/benefits/lib/shared';
import * as moment from 'moment';

@Component({
  selector: 'bnt-ui-contributor-details-dc',
  templateUrl: './ui-contributor-details-dc.component.html',
  styleUrls: ['./ui-contributor-details-dc.component.scss']
})
export class UiContributorDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() establishment: Establishment;
  @Input() registrationNo: number;
  @Input() contributor: ContributorSearchResult;
  @Input() role: string;
  @Input() personNameEnglish: string;
  @Input() personNameArabic: string;
  @Input() validatorCanEdit = false;
  @Input() benefitRequest: UnemploymentResponseDto;
  @Input() benefitDetails: BenefitDetails;
  @Input() validatorAppealCanEdit;
  @Input() showIneligibilityPoup;
  @Input() selectedRequestDate;
  @Output() navigateToEdit: EventEmitter<null> = new EventEmitter();
  @Output() onNinClicked: EventEmitter<null> = new EventEmitter();
  @Output() onDateEditCick = new EventEmitter();
  @Output() showEligibilityPopups = new EventEmitter();
  /**
   * Local variables
   */
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  socialInsuranceNo: number;
  dob: string;
  age: number;
  rolesEnum = Role;

  /**
   *
   * @param language Creating an instance
   * @param router
   */
  constructor(
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly manageBenefitService: ManageBenefitService,
    readonly uiBenefitService: UiBenefitsService
  ) {}

  /**
   *  This method if for initialization tasks
   */
  ngOnInit() {
    this.setPersonDetails();
    this.getAgeDateOfBirthValues();
    this.setRequestdate();
    //console.log(this.selectedRequestDate)
  }
  /**
   * Method to handle input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.setPersonDetails();
    if (changes && changes.establishment) {
      this.establishment = changes.establishment.currentValue;
    }
    if (changes && changes.contributor) {
      this.contributor = changes.contributor.currentValue;
      if (this.contributor) {
        const nameObj = getPersonNameAsBilingual(this.contributor.person.name);
        this.personNameEnglish = nameObj.english;
        this.personNameArabic = nameObj.arabic;
        this.socialInsuranceNo = this.contributor.socialInsuranceNo;
      }
    }
    if (changes && changes.registrationNo) {
      this.registrationNo = changes.registrationNo.currentValue;
    }
    if (changes && changes.validatorCanEdit) {
      this.validatorCanEdit = changes.validatorCanEdit.currentValue;
    }
    if (changes && changes.selectedRequestDate) {
      this.selectedRequestDate = changes.selectedRequestDate.currentValue;
    }
  }
  /**
   * This method is used to set name details
   */
  setPersonDetails() {
    if (this.contributor) {
      /**
       * getting the identity type for the contributor eg:iqama number border number
       */

      this.primaryIdentity =
        this.contributor.person.identity != null
          ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
          : null;

      this.primaryIdentityType = this.primaryIdentity !== null ? 'BENEFITS.' + this.primaryIdentity.idType : null;
    }
  }

  setRequestdate() {
    const momentObj = moment(this.benefitRequest.requestDate.gregorian, 'YYYY-MM-DD');
    const momentString = momentObj.format('YYYY-MM-DD');
    this.benefitRequest.requestDate.gregorian = moment(momentString, 'YYYY-MM-DD').toDate();
  }

  /**
   * Method to capture navigation details and send to parent via event emitter
   */
  navigateToInjuryDetails() {
    // this.router.navigate([
    //   `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/info`
    // ]);
    this.onNinClicked.emit();
  }


  /**
   * Method to populate date of birth and age
   */
  getAgeDateOfBirthValues() {
    this.age = this.benefitRequest.age;
    if (this.benefitRequest.dateOfBirth.gregorian) {
      this.dob = convertToStringDDMMYYYY(this.benefitRequest.dateOfBirth.gregorian.toString());
    }
  }

  //TODO: remove unused methods
  /**
   * This method is to navigate to dashboard
   */
  navigateToDashboard() {
    // this.router.navigate([RouterConstants.ROUTE_DASHBOARD]);
  }
  //navigate to apply for benefits screen
  editRequestScreen() {
    // this.uiBenefitService.setBenefitStatus(BenefitConstants.VAL_EDIT_BENEFIT);
    // this.routerData.tabIndicator = 1;
    // this.routerData.selectWizard = BenefitConstants.BENEFIT_DETAILS;
    // this.manageBenefitService.setRequestDate(this.benefitRequest.requestDate);
    // this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
    this.navigateToEdit.emit();
  }
}
