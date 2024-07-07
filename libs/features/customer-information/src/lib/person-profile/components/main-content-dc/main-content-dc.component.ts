/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  CoreContributorService,
  EstablishmentProfile,
  RouterData,
  RouterDataToken,
  RoleIdEnum,
  LanguageToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cim-main-content-dc',
  templateUrl: './main-content-dc.component.html',
  styleUrls: ['./main-content-dc.component.scss']
})
export class MainContentDcComponent extends BaseComponent implements OnInit {
  //Local Variables

  isCsr = true;
  isContributor = true;
  isLoaded = false;
  registrationNo: number;
  sin: number;
  estName: string;
  showError = true;
  OHRoles: RoleIdEnum[] = [];
  isUserLoggedIn = false;
  showDropDownTabs = false;
  hideMoreButton: boolean;
  dontShowInDropdown: boolean;
  showContent = false; //used to show the content tab section.
  isArabic: boolean;
  /**
   * Creates an instance of MainContentDcComponent
   * @memberof  MainContentDcComponent
   *
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken)
    readonly managePersonToken: RouterData,
    readonly router: Router,
    readonly contributorService: CoreContributorService,
    readonly activatedRoute: ActivatedRoute,
    readonly location: Location,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.isArabic = lang === 'ar';
    });
    this.isLoaded = false;
    this.sin = this.contributorService.selectedSIN;
    if (this.sin === null || this.sin === undefined) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.sin = parseInt(res.get('sin'), 10);
      });
    }
    if (this.router.url.includes('user')) {
      this.isUserLoggedIn = true;
    } else {
      this.isUserLoggedIn = false;
    }

    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isCsr = true;
      this.dontShowInDropdown = true;
      this.OHRoles.push(
        RoleIdEnum.CSR,
        RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
        RoleIdEnum.MEDICA_AUDITOR,
        RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
        RoleIdEnum.OH_OFFICER,
        RoleIdEnum.FC,
        RoleIdEnum.OH_FC,
        RoleIdEnum.FEATURE_360_ALL_USER,
        RoleIdEnum.CUSTOMER_CARE_OFFICER,
        RoleIdEnum.CALL_CENTRE_AGENT,
        RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
        RoleIdEnum.MC_OFFICER,
        RoleIdEnum.BOARD_OFFICER,
        RoleIdEnum.GDISO,
        RoleIdEnum.DOCTOR,
        RoleIdEnum.CLM_MGR,
        RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
        RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
        RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
        RoleIdEnum.GCC_CSR,
        RoleIdEnum.MEDICAL_BOARD_SECRETARY,
        RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST
      );
    } else {
      this.isCsr = false;
      this.dontShowInDropdown = false;
      this.OHRoles.push(RoleIdEnum.OH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN);
    }
    this.isLoaded = true;

    // This is for routing issues when admin on clicking contributor id on injury page on injury report by contributor flow
    if(this.routerData.previousOwnerRole === "AdminInjury") {
      this.routerData.resourceType = "Injury";
    }
  }

  showDropdownTabs() {
    this.showDropDownTabs = !this.showDropDownTabs;
  }
  closeDropdownTabs() {
    this.showDropDownTabs = false;
  }
  // Method to show profile
  showProfileScreen(establishment: EstablishmentProfile) {
    if (establishment && establishment.registrationNo) {
      this.registrationNo = establishment.registrationNo;
      this.estName = establishment.name.english ? establishment.name.english : establishment.name.arabic;
    }
  }
  //Method to set establishment name and details
  setEstablishmentDetails() {}

  //Method to show error
  showGosiError(bool: boolean) {
    this.showError = !bool;
  }

  /** Method to enable content of profile section. */
  enableContent(value: boolean) {
    this.showContent = value;
  }

  navigateBack() {
    this.location.back();
  }
}
