/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, SimpleChanges, OnChanges, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {
  CommonIdentity,
  getIdentityByType,
  Establishment,
  getPersonNameAsBilingual,
  RouterDataToken,
  RouterData,
  BilingualText,
  convertToStringDDMMYYYY,
  GosiCalendar,
  Name,
  formatDate,
  CalendarTypeEnum,
  Role,
  checkIqamaOrBorderOrPassport,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import {
  ContributorSearchResult,
  AnnuityResponseDto,
  PersonalInformation,
  ImprisonmentDetails,
  BenefitDetails,
  DependentHistory,
  DependentDetails,
  HeirBenefitDetails,
  FuneralGrantBeneficiaryResponse
} from '../../models';
import { getIdentityLabel, isHeirLumpsum, isModifyBenefit } from '../../utils';
import { ManageBenefitService, ModifyBenefitService, BenefitPropertyService } from '../../services';
import { BenefitConstants } from '../../constants';
import { BenefitType } from '../../enum';
import { PersonBankDetails } from '@gosi-ui/features/customer-information/lib/shared/models';

@Component({
  selector: 'bnt-annuity-contributor-details-dc',
  templateUrl: './annuity-contributor-dc.component.html',
  styleUrls: ['./annuity-contributor-dc.component.scss']
})
export class AnnuityContributorcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  socialInsuranceNo: number;
  age: number;
  ageInHijiri: number;
  dob: string;
  dobHijiri: string;
  uiConst = BenefitConstants;
  benefitTypes = BenefitType;
  imprisonmentPeriod: BilingualText;
  hasCertificate: BilingualText;
  // isHeir: boolean;
  heirBenefitPayments: HeirBenefitDetails[];
  isHeirLumpsum = isHeirLumpsum;
  identity: CommonIdentity | null;
  identityLabel = '';
  /**
   * Input variables
   */
  @Input() benefitCalculationDetails: BenefitDetails;
  @Input() funeralBeneficiaryDetails: FuneralGrantBeneficiaryResponse;
  @Input() oldBenefitDetails: BenefitDetails;
  @Input() establishment: Establishment;
  @Input() registrationNo: number;
  @Input() contributor: ContributorSearchResult;
  @Input() lang = 'en';
  @Input() assignedRole;
  @Input() rolesEnum = Role;
  // In use
  @Input() isHeirBenefit = false;
  @Input() isJailedBenefit = false;
  @Input() personNameEnglish: string;
  @Input() personNameArabic: string;
  @Input() validatorCanEdit = false;
  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() imprisonmentDetails: ImprisonmentDetails;
  @Input() benefitType: string;
  @Input() requestType: string;
  @Input() benefitRequestId: number;
  @Input() sin: number;
  @Input() dependentDetails: DependentDetails[];
  @Input() personDetails: PersonalInformation;
  @Input() notificationDate: GosiCalendar;
  @Input() dependentHistory: DependentHistory;
  @Input() bankDetails: PersonBankDetails;
  @Input() systemRunDate: GosiCalendar;
  @Input() isIndividualApp: boolean;

  /**
   * Output
   */
  @Output() navigateToBenefitsHistory = new EventEmitter();
  @Output() navigateToTranscationHistory: EventEmitter<number> = new EventEmitter();
  @Output() navigateToEdit: EventEmitter<null> = new EventEmitter();
  @Output() getDepHistory: EventEmitter<number> = new EventEmitter();
  @Output() navigateToProfile: EventEmitter<null> = new EventEmitter();
  @Output() viewBenefitDetails = new EventEmitter();
  isModifyBenefit: boolean;
  viewOnly = BenefitsGosiShowRolesConstants.BENEFIT_READ;
  /**
   *
   * @param language Creating an instance
   * @param router
   */

  constructor(
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly manageBenefitService: ManageBenefitService,
    public modifyPensionService: ModifyBenefitService,
    readonly benefitPropertyService: BenefitPropertyService
  ) {}

  /**
   *  This method if for initialization tasks
   */
  ngOnInit() {
    // if (this.benefitType === BenefitType.heirLumpsum || this.benefitType === BenefitType.heirPension) {
    //   this.isHeir = true;
    // }
    this.isModifyBenefit = isModifyBenefit(this.routerData.resourceType);
  }

  /**
   * Method to handle input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    // this.setPersonDetails();

    if (changes && (changes.personNameEnglish || changes.personNameArabic)) {
      this.checkPersonNameNull();
    }
    if (changes && changes.contributor) {
      this.setContributorDetails(changes);
    }
    if (changes && changes.registrationNo) {
      this.registrationNo = changes.registrationNo.currentValue;
    }
    this.setInputDetails(changes);
  }

  setInputDetails(changes: SimpleChanges) {
    if (changes && changes.annuityBenefitDetails?.currentValue) {
      this.getAgeDateOfBirthValues();
      this.setRequestdate();
      this.getIdentity();
    }
    if (changes && changes.benefitType?.currentValue) {
      this.setBenefitType(changes);
    }
    if (changes && changes.benefitCalculationDetails?.currentValue) {
      this.setBenefitCalculationDetails(changes);
    }
    if (changes && changes.oldBenefitDetails && changes.oldBenefitDetails.currentValue) {
      this.oldBenefitDetails = changes.oldBenefitDetails.currentValue[0];
    }
    if (changes && changes.imprisonmentDetails?.currentValue) {
      this.setImprisonmentDetails(this.imprisonmentDetails);
    }
    if (changes && changes.dependentDetails?.currentValue) {
      if (this.dependentDetails && this.dependentDetails.length > 0) {
        this.dependentDetails.forEach(dependent => {
          dependent.nameBilingual = new BilingualText();
          if (dependent.name) {
            dependent.nameBilingual.english = dependent.name?.english.name;
            dependent.nameBilingual.arabic = this.getArabicFullName(dependent.name);
          }
        });
      }
    }
  }

  getIdentity() {
    this.identity = checkIqamaOrBorderOrPassport(this.annuityBenefitDetails?.identity);
    this.identityLabel = getIdentityLabel(this.identity);
  }

  onViewBenefitDetails() {
    this.viewBenefitDetails.emit();
  }
  getArabicFullName(name: Name) {
    let arabicName = '';
    if (name.arabic) {
      if (name.arabic.firstName) {
        arabicName += name.arabic.firstName + ' ';
      }
      if (name.arabic.secondName) {
        arabicName += name.arabic.secondName + ' ';
      }
      if (name.arabic.thirdName) {
        arabicName += name.arabic.thirdName + ' ';
      }
      if (name.arabic.familyName) {
        arabicName += name.arabic.familyName;
      }
    }
    return arabicName;
  }

  /**setImprisonmentDetails */
  setImprisonmentDetails(imprisonmentDetails: ImprisonmentDetails) {
    this.imprisonmentPeriod = new BilingualText();
    if (imprisonmentDetails && imprisonmentDetails.releaseDate) {
      // Defect 480806 date format in / for hijiri date
      this.imprisonmentPeriod.english = `${
        imprisonmentDetails?.enteringDate.entryFormat === CalendarTypeEnum.HIJRI
          ? convertToStringDDMMYYYY(imprisonmentDetails?.enteringDate.hijiri)
          : convertToStringDDMMYYYY(moment(imprisonmentDetails?.enteringDate?.gregorian).toString())
      }
        → ${
          imprisonmentDetails?.releaseDate.entryFormat === CalendarTypeEnum.HIJRI
            ? convertToStringDDMMYYYY(imprisonmentDetails?.releaseDate?.hijiri)
            : convertToStringDDMMYYYY(moment(imprisonmentDetails?.releaseDate?.gregorian).toString())
        } `;
      this.imprisonmentPeriod.arabic = `${
        imprisonmentDetails?.enteringDate.entryFormat === CalendarTypeEnum.HIJRI
          ? convertToStringDDMMYYYY(imprisonmentDetails?.enteringDate.hijiri)
          : convertToStringDDMMYYYY(moment(imprisonmentDetails?.enteringDate?.gregorian).toString())
      }
      ← ${
        imprisonmentDetails?.releaseDate.entryFormat === CalendarTypeEnum.HIJRI
          ? convertToStringDDMMYYYY(imprisonmentDetails?.releaseDate?.hijiri)
          : convertToStringDDMMYYYY(moment(imprisonmentDetails?.releaseDate?.gregorian).toString())
      } `;
    } else {
      this.imprisonmentPeriod.english = `${
        imprisonmentDetails?.enteringDate.entryFormat === CalendarTypeEnum.HIJRI
          ? convertToStringDDMMYYYY(imprisonmentDetails?.enteringDate.hijiri)
          : convertToStringDDMMYYYY(moment(imprisonmentDetails?.enteringDate?.gregorian).toString())
      }
        → onwards `;
      this.imprisonmentPeriod.arabic = `${
        imprisonmentDetails?.enteringDate.entryFormat === CalendarTypeEnum.HIJRI
          ? convertToStringDDMMYYYY(imprisonmentDetails?.enteringDate.hijiri)
          : convertToStringDDMMYYYY(moment(imprisonmentDetails?.enteringDate?.gregorian).toString())
      }
      ← حتى الآن  `;
    }
  }

  setContributorDetails(changes: SimpleChanges) {
    this.contributor = changes.contributor.currentValue;
    if (this.contributor) {
      this.setPersonDetails();
      const nameObj = getPersonNameAsBilingual(this.contributor.person.name);
      this.personNameEnglish = nameObj.english?.length > 0 ? nameObj.english : '-';
      this.personNameArabic = nameObj.arabic;
      this.socialInsuranceNo = this.contributor?.socialInsuranceNo;
    }
  }

  checkPersonNameNull() {
    this.personNameEnglish = this.personNameEnglish ? this.personNameEnglish : '-';
    this.personNameArabic = this.personNameArabic ? this.personNameArabic : '-';
  }

  setBenefitType(changes: SimpleChanges) {
    this.benefitType = changes.benefitType.currentValue;
  }

  getAgeDateOfBirthValues() {
    this.age = this.annuityBenefitDetails?.age;
    this.ageInHijiri = this.annuityBenefitDetails?.ageInHijiri > 0 ? this.annuityBenefitDetails?.ageInHijiri : this.age;
    if (this.annuityBenefitDetails?.dateOfBirth?.gregorian) {
      const momentObj = moment(this.annuityBenefitDetails.dateOfBirth.gregorian, 'YYYY-MM-DD');
      const momentString = momentObj.format('DD/MM/YYYY');
      this.dob = momentString;
    }
    if (this.annuityBenefitDetails?.dateOfBirth?.hijiri) {
      const momentObj = moment(this.annuityBenefitDetails.dateOfBirth.hijiri, 'YYYY-MM-DD');
      const momentString = momentObj.format('DD/MM/YYYY');
      this.dobHijiri = momentString;
    }
  }

  setRequestdate() {
    const momentObj = moment(this.annuityBenefitDetails?.requestDate?.gregorian, 'YYYY-MM-DD');
    const momentString = momentObj.format('YYYY-MM-DD');
    this.annuityBenefitDetails.requestDate.gregorian = moment(momentString, 'YYYY-MM-DD').toDate();
  }

  setBenefitCalculationDetails(changes: SimpleChanges) {
    this.benefitCalculationDetails = changes.benefitCalculationDetails.currentValue;
    if (this.benefitCalculationDetails?.heirBenefitDetails) {
      this.heirBenefitPayments = this.benefitCalculationDetails.heirBenefitDetails;
    }
  }

  /**
   * getting the identity type for the contributor eg:iqama number border number
   */
  setPersonDetails() {
    this.primaryIdentity =
      this.contributor.person.identity != null
        ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
        : null;

    this.primaryIdentityType = this.primaryIdentity !== null ? 'BENEFITS.' + this.primaryIdentity.idType : null;
  }

  // navigateToApplyBenefitScreen() {
  //   //common setting before redirection
  //   this.manageBenefitService.setRequestDate(this.annuityBenefitDetails.requestDate);
  //   this.routerData.tabIndicator = 1;
  //   if (this.requestType === BenefitType.startBenefitWaive || this.requestType === BenefitType.stopBenefitWaive) {
  //     this.routerData.selectWizard = BenefitConstants.WAIVE_BENEFIT;
  //   } else {
  //     this.routerData.selectWizard = BenefitConstants.BENEFIT_DETAILS;
  //   }
  //   if (this.benefitType === BenefitType.funeralGrant) {
  //     this.routerData.selectWizard = BenefitConstants.FUNERAL_GRANT_DETAILS;
  //   }
  //   this.benefitPropertyService.setAnnuityStatus(BenefitConstants.VAL_EDIT_BENEFIT);
  //   // this function will do the redirection to the approriate pages with route
  //   this.reDirectUsersToApplyScreen();
  // }

  // navigateToHeirBenefitScreen() {
  //   //common setting before redirection
  //   this.manageBenefitService.setRequestDate(this.annuityBenefitDetails.requestDate);
  //   this.routerData.tabIndicator = 1;
  //   this.routerData.selectWizard = BenefitConstants.BENEFIT_DETAILS;
  //   this.benefitPropertyService.setAnnuityStatus(BenefitConstants.VAL_EDIT_BENEFIT);
  //   // this function will do the redirection to the approriate pages with route
  //   this.reDirectUsersToApplyScreen();
  // }

  //this will redirect user to the dependent page of apply edit section - tabindicator will be 0
  navigateToDependentScreen() {
    this.manageBenefitService.setRequestDate(this.annuityBenefitDetails.requestDate);
    this.routerData.tabIndicator = 0;
    this.routerData.selectWizard = BenefitConstants.BENEFIT_DETAILS;
    if (this.requestType === BenefitType.startBenefitWaive || this.requestType === BenefitType.stopBenefitWaive) {
      if (this.isHeirBenefit) {
        this.routerData.selectWizard = BenefitConstants.REASON_FOR_BENEFIT;
      } else {
        this.routerData.selectWizard = BenefitConstants.WAIVE_BENEFIT;
      }
    } else if (this.dependentDetails && this.dependentDetails.length) {
      if (this.isHeirBenefit) {
        this.routerData.selectWizard = BenefitConstants.REASON_FOR_BENEFIT;
      } else if (this.isJailedBenefit) {
        this.routerData.selectWizard = BenefitConstants.IMPRISONMENT_DETAILS;
      } else {
        this.routerData.selectWizard = BenefitConstants.DEPENDENTS_DETAILS;
      }
    } else if (this.dependentDetails?.length <= 0) {
      //Defect 498919 -commented and else if part added
      if (!this.isHeirBenefit && !this.isJailedBenefit && this.benefitType !== BenefitType.funeralGrant)
        this.routerData.selectWizard = BenefitConstants.DEPENDENTS_DETAILS;
    }
    if (this.benefitType === BenefitType.funeralGrant) {
      this.routerData.selectWizard = BenefitConstants.FUNERAL_GRANT_DETAILS;
    }
    this.benefitPropertyService.setAnnuityStatus(BenefitConstants.VAL_EDIT_BENEFIT);
    // this function will do the redirection to the approriate pages with route
    this.reDirectUsersToApplyScreen();
  }

  // the helper function to redirect the user to apply page
  reDirectUsersToApplyScreen() {
    this.navigateToEdit.emit();
  }

  getDependentHistory(personId: number) {
    this.getDepHistory.emit(personId);
  }

  //TODO: change name in both hmtl and ts

  viewHistory() {
    this.navigateToBenefitsHistory.emit();
  }
  viewTranscationHistory(){
  this.navigateToTranscationHistory.emit(this.manageBenefitService.nin);
  }

  navigateToInjuryDetails() {
    this.navigateToProfile.emit();
  }

  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.routerData.stopNavigationToValidator = true;
      // this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)], {
      //   state: { loadPageWithLabel: 'BENEFITS' }
      // });
      this.router.navigate([BenefitConstants.ROUTE_INDIVIDUAL(this.sin)]);
      // const url = this.router.serializeUrl(
      //   this.router.createUrlTree(
      //     [BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)],
      //     {
      //       state: { loadPageWithLabel: 'BENEFITS' }
      //     }
      //   )
      // );
      // window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
      // this.navigateToDomain(RouterConstants.ROUTE_BENEFIT_UI);
    }
  }

  getDateFormat(lang) {
    return formatDate(lang);
  }
}
