import { Component, HostListener, Inject, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthTokenService,
  BenefitsGosiShowRolesConstants,
  CoreBenefitService,
  GosiCalendar,
  MenuService,
  Role,
  RoleIdEnum,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import {
  ActiveBenefits,
  BenefitConstants,
  BenefitPropertyService,
  BenefitStatus,
  BenefitType,
  isHeirBenefit,
  isLumpsumBenefit,
  isOccNonOcc,
  notIsHeir,
  reDirectUsersToApplyScreen,
  UIPayloadKeyEnum
} from '@gosi-ui/features/benefits/lib/shared';
import { BenefitValues } from '@gosi-ui/features/payment/lib/shared/enums/benefit-values';
import { DependentDetails } from '@gosi-ui/features/payment/lib/shared/models/dependent-details';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Benefits } from '../../models';

@Component({
  selector: 'dsb-benefits-details-dc',
  templateUrl: './ind-benefits-details-dc.component.html',
  styleUrls: ['./ind-benefits-details-dc.component.scss']
})
export class IndBenefitsDetailsDcComponent implements OnInit, OnChanges {
  // Local variables
  length = 1;
  dependents = 5;
  benefitType = 'Non Occupational Disbality Benefit';
  currentIndex: number;
  showLeft: boolean;
  showRight: boolean;
  isExpired = false;
  width: number;
  isAdded = true;
  mobileView = false;
  benefitStatus = BenefitStatus;
  hasActiveBenefit: boolean;
  hasOnHoldBenefit: boolean;
  hasDraftBenefit: boolean;
  commonModalRef: BsModalRef;
  // BenefitType = BenefitType;
  isOccNonOcc = isOccNonOcc;
  isHeirBenefit = isHeirBenefit;
  noItem = false;
  benefitValues = BenefitValues;
  csrModify = BenefitsGosiShowRolesConstants.CSR_MODIFY;
  viewRoles = BenefitsGosiShowRolesConstants.VIEW_ROLES;

  @Input() lang: string;
  @Input() activeBenefitsList: ActiveBenefits[];
  @Input() isAppProfile: boolean;
  @Input() systemRunDate: GosiCalendar;
  @Input() annuitybenefits: Benefits[] = [];

  isLumpsum = false;
  isSaned: boolean;
  isOccPension: boolean;
  accessRoles: string[];
  isViewAccessOnly = false;
  constructor(
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly benefitPropertyService: BenefitPropertyService,
    private coreBenefitService: CoreBenefitService,
    private menuService: MenuService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    private authTokenService: AuthTokenService
  ) {}

  @HostListener('window:resize', ['$event'])
  onWIndowREsize() {
    this.width = window.innerWidth;
    this.setMobileView();
  }
  setMobileView() {
    if (this.width < 1024) {
      this.mobileView = true;
      // if (this.activeBenefitsList[this.currentIndex + 1].status) {
      this.showRight =
        this.currentIndex < this.activeBenefitsList?.length + this.annuitybenefits?.length - 1 ? true : false;
      // }
    } else {
      this.mobileView = false;
      // if (this.activeBenefitsList[this.currentIndex + 1].status) {
      this.showRight = this.activeBenefitsList?.length + this.annuitybenefits?.length > 3 ? true : false;
      // }
    }
  }

  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.commonModalRef.hide();
  }

  ngOnInit(): void {
    this.currentIndex = 0;
    this.showLeft = false;
    this.width = window.innerWidth;
    this.setMobileView();
    if (this.mobileView) {
      this.showRight =
        this.currentIndex + 1 < this.activeBenefitsList.length + this.annuitybenefits?.length - 1 ? true : false;
    } else {
      this.showRight = this.activeBenefitsList.length + this.annuitybenefits?.length > 3 ? true : false;
    }
    this.getAccessRoles();
  }
  getAccessRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.accessRoles = gosiscp ? gosiscp?.[0].role?.map(r => r.toString()) : [];
    if (this.accessRoles.includes(RoleIdEnum.BENEFIT_SEARCH_READ.toString())) {
      this.isViewAccessOnly = true;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.activeBenefitsList?.currentValue && changes.activeBenefitsList?.currentValue?.length) {
      this.hasActiveBenefit =
        this.activeBenefitsList?.length &&
        this.activeBenefitsList.findIndex(eachItem => eachItem.status?.english === this.benefitStatus.ACTIVE) >= 0
          ? true
          : false;
      this.hasDraftBenefit =
        this.activeBenefitsList?.length &&
        this.activeBenefitsList.findIndex(eachItem => eachItem.status?.english === this.benefitStatus.DRAFT) >= 0
          ? true
          : false;
      this.hasOnHoldBenefit =
        this.activeBenefitsList?.length &&
        this.activeBenefitsList.findIndex(eachItem => {
          // console.log(eachItem.status?.english?.trim());
          return eachItem.status?.english === this.benefitStatus.ONHOLD || eachItem.status?.english === 'On Hold';
        }) >= 0
          ? true
          : false;
      this.activeBenefitsList?.forEach(eachItem => {
        let nonHeirCount = 0;
        let isActiveHeir = false;
        if (isHeirBenefit(eachItem?.benefitType?.english) && eachItem.status?.english === this.benefitStatus.ACTIVE) {
          isActiveHeir = true;
        } else if (!isHeirBenefit(eachItem?.benefitType?.english)) {
          nonHeirCount = nonHeirCount + 1;
        }
        // if (isActiveHeir && nonHeirCount === 0) this.noItem = true;
      });
    }

    if (changes.activeBenefitsList?.currentValue || changes.annuitybenefits?.currentValue) {
      // if (changes.activeBenefitsList?.currentValue) this.activeBenefitsList = changes.activeBenefitsList?.currentValue;
      // if (changes.annuitybenefits?.currentValue) this.annuitybenefits = changes.annuitybenefits?.currentValue;
      if (this.mobileView) {
        this.showRight =
          this.currentIndex + 1 < this.activeBenefitsList?.length + this.annuitybenefits?.length - 1 ? true : false;
      } else {
        this.showRight = this.activeBenefitsList?.length + this.annuitybenefits?.length > 3 ? true : false;
      }
    }
  }
  showdependents(item: ActiveBenefits) {
    // Defect 554695
    this.isSaned = item.benefitType.english === BenefitType.ui ? true : false;
    this.isOccPension = item.benefitType.english === BenefitType.occPension ? true : false;
    if (isLumpsumBenefit(item.benefitType.english)) {
      this.isLumpsum = true;
    }
    if (
      !this.isLumpsum &&
      !this.isSaned &&
      !this.isOccPension &&
      item.benefitType.english !== BenefitType.funeralGrant &&
      item.eligibleForDependentComponent
    ) {
      return true;
    } else false;
  }
  hasDisabled(dependentDetails: DependentDetails[]) {
    if (dependentDetails?.findIndex(dependent => dependent?.heirStatus?.english == this.benefitValues.disabled) >= 0) {
      return true;
    } else return false;
  }
  get isOnlyOneCard() {
    return this.activeBenefitsList?.length <= 0 && this.annuitybenefits?.length === 1;
  }
  get isOnlyDraftCard() {
    return (
      this.activeBenefitsList?.length === 1 &&
      this.activeBenefitsList.filter(benefit => benefit.status.english === BenefitStatus.DRAFT)?.length > 0 &&
      this.annuitybenefits?.length <= 0
    );
  }
  onLeftClick() {
    if (this.mobileView) {
      this.currentIndex = this.currentIndex - 1;

      this.showLeft = this.currentIndex - 2 > 0 ? true : false;

      this.showRight =
        this.currentIndex < this.activeBenefitsList?.length + this.annuitybenefits?.length - 1 ? true : false;
    } else {
      this.currentIndex = this.isAppProfile ? this.currentIndex - 2 : this.currentIndex - 3;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight =
        (this.isAppProfile ? this.currentIndex + 1 : this.currentIndex + 2) <
        this.activeBenefitsList?.length + this.annuitybenefits?.length - 1
          ? true
          : false;
    }
  }

  onRightClick() {
    if (this.mobileView) {
      this.currentIndex = this.currentIndex + 1;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight =
        this.currentIndex < this.activeBenefitsList?.length + this.annuitybenefits?.length - 1 ? true : false;
    } else {
      this.currentIndex = this.isAppProfile ? this.currentIndex + 2 : this.currentIndex + 3;

      this.showLeft = this.isAppProfile
        ? this.currentIndex - 1 > 0
          ? true
          : false
        : this.currentIndex - 2 > 0
        ? true
        : false;

      this.showRight =
        (this.isAppProfile ? this.currentIndex + 1 : this.currentIndex + 2) <
        this.activeBenefitsList?.length + this.annuitybenefits?.length - 1
          ? true
          : false;
    }
  }
  isPastDate(expiryDate: GosiCalendar) {
    const today = moment(this.systemRunDate?.gregorian).toDate();
    const date = moment(expiryDate?.gregorian?.toString());
    if (date) {
      if (date.isBefore(today, 'day')) {
        return true;
      }
    }
  }
  navigateToDraftRequest(activeBenefit: ActiveBenefits) {
    this.routerData.idParams.set(UIPayloadKeyEnum.ID, activeBenefit.benefitRequestId);
    this.routerData.idParams.set(UIPayloadKeyEnum.SIN, activeBenefit.sin);
    this.routerData.idParams.set(UIPayloadKeyEnum.REFERENCE_NO, activeBenefit.referenceNo);
    this.routerData.assignedRole = Role.VALIDATOR_1;
    this.routerData.draftRequest = true;
    // if (activeBenefit.appeal) {
    //   this.router.navigate([BenefitConstants.ROUTE_APPEAL_DETAILS]);
    // } else {
    reDirectUsersToApplyScreen(
      null,
      activeBenefit.sin,
      activeBenefit.benefitRequestId,
      null,
      this.coreBenefitService,
      this.router,
      activeBenefit.benefitType.english,
      activeBenefit.referenceNo
    );
  }
  navigateToApplyScreen(benefit: Benefits) {
    switch (benefit?.benefitType?.english) {
      case BenefitType.ui: {
        this.navigateToSaned();
        break;
      }
      case BenefitType.womanLumpsum: {
        this.navigateToWomenLumpsum(benefit);
        break;
      }
      case BenefitType.retirementPension: {
        this.navigateToRetirementPension();
        break;
      }
      case BenefitType.retirementLumpsum: {
        this.navigateToRetirementLumpsum(benefit);
        break;
      }
      case BenefitType.earlyretirement: {
        this.navigateToEarlyRetirement();
        break;
      }
      case BenefitType.NonOccDisabilityAssessment: {
        this.navigateToNonOccDisabilityAssessment();
        break;
      }
      case BenefitType.NonOccDisabilityBenefitsType: {
        this.navigateToNonOccPension(benefit);
        break;
      }
      case BenefitType.nonOccLumpsumBenefitType: {
        this.navigateToNonOccLumpsum(benefit);
        break;
      }
      case BenefitType.nonOccPensionBenefitType: {
        this.navigateToNonOccPension(benefit);
        break;
      }
      case BenefitType.jailedContributorPension: {
        this.navigateToJailedPension();
        break;
      }
      case BenefitType.jailedContributorLumpsum: {
        this.navigateToJailedLumpsum(benefit);
        break;
      }
      case BenefitType.hazardousPension: {
        this.navigateToHazardousPension();
        break;
      }
      case BenefitType.hazardousLumpsum: {
        this.navigateToHazardousLumpsum(benefit);
        break;
      }
      case BenefitType.heirPension: {
        this.navigateToHeirPension();
        break;
      }
      case BenefitType.heirLumpsum: {
        this.navigateToHeirLumpsum(benefit);
        break;
      }
      case BenefitType.funeralGrant: {
        this.navigateToFuneralGrant();
        break;
      }
      case BenefitType.rpaBenefit: {
        this.navigateToRPALumpsum();
        break;
      }
    }
  }

  navigateToSaned() {
    this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
  }

  //Method to navigate to lumpsum
  navigateToWomenLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        womenLumpsum: true
      }
    });
  }
  //Method to navigate to retirement pension
  navigateToRetirementPension() {
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT]);
  }
  //Method to navigate to retirement lumpsum
  navigateToRetirementLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM]);
  }
  //Method to navigate to early retirement
  navigateToEarlyRetirement() {
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        earlyretirement: true
      }
    });
  }
  //Method to navigate to non occ disability assessment
  navigateToNonOccDisabilityAssessment() {
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_DISABILITY_ASSESSMENT], {
      queryParams: {
        nonocc: true
      }
    });
  }
  //Method to navigate to non occ retirement lumpsum
  navigateToNonOccLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        nonocc: true
      }
    });
  }
  //Method to navigate to non occ retirement pension
  navigateToNonOccPension(benefit: Benefits) {
    let isDisabilityBenefit = false;
    if (benefit.benefitType.english === BenefitType.NonOccDisabilityBenefitsType) {
      isDisabilityBenefit = true;
    }
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        nonocc: true,
        isDisabilityBenefit: isDisabilityBenefit
      }
    });
  }
  //Method to navigate to jailed pension
  navigateToJailedPension() {
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        jailed: true
      }
    });
  }
  //Method to navigate to jailed lumpsum
  navigateToJailedLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        jailed: true
      }
    });
  }
  //Method to navigate to hazardous pension
  navigateToHazardousPension() {
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        hazardous: true
      }
    });
  }
  //Method to navigate to hazardous lumpsum
  navigateToHazardousLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        hazardous: true
      }
    });
  }
  //Method to navigate to heir pension
  navigateToHeirPension() {
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        heir: true
      }
    });
  }
  //Method to navigate to heir lumpsum
  navigateToHeirLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        heir: true
      }
    });
  }

  //Method to navigate to funeral grant
  navigateToFuneralGrant() {
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_FUNERAL_GRANT], {
      queryParams: {
        heir: true
      }
    });
  }
  navigateToRPALumpsum() {
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        rpa: true
      }
    });
  }
  navigateTomodify(activeBenefit: ActiveBenefits, benefitStatus: BenefitStatus) {
    if (benefitStatus === this.benefitStatus.DRAFT) {
      this.routerData.idParams.set(UIPayloadKeyEnum.ID, activeBenefit.benefitRequestId);
      this.routerData.idParams.set(UIPayloadKeyEnum.SIN, activeBenefit.sin);
      this.routerData.idParams.set(UIPayloadKeyEnum.REFERENCE_NO, activeBenefit.referenceNo);
      this.routerData.assignedRole = Role.VALIDATOR_1;
      this.routerData.draftRequest = true;
      // if (activeBenefit.appeal) {
      //   this.router.navigate([BenefitConstants.ROUTE_APPEAL_DETAILS]);
      // } else {
      reDirectUsersToApplyScreen(
        null,
        activeBenefit.sin,
        activeBenefit.benefitRequestId,
        null,
        this.coreBenefitService,
        this.router,
        activeBenefit.benefitType.english,
        activeBenefit.referenceNo
      );
      // }
    } else if (this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.BENEFIT_VIEW_DETAILS)) {
      const benefitType = activeBenefit.benefitType.english;
      this.coreBenefitService.setActiveBenefit(activeBenefit);

      // navigate to heir pension modify page
      if (isHeirBenefit(benefitType)) {
        this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
      }
      if (notIsHeir(benefitType)) {
        this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      }
    }
  }
}
