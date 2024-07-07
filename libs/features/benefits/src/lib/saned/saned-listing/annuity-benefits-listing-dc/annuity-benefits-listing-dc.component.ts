import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { BenefitConstants, BenefitType, clearDraftUtil } from '../../../shared';
import { Benefits } from '../../../shared/models';
import { SanedbaseComponent } from '../../base/saned.base-component';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RouterData } from '@gosi-ui/core';

@Component({
  selector: 'bnt-annuity-benefits-listing-dc',
  templateUrl: './annuity-benefits-listing-dc.component.html',
  styleUrls: ['./annuity-benefits-listing-dc.component.scss']
})
export class AnnuityBenefitsListingDcComponent extends SanedbaseComponent implements OnInit, OnChanges {
  // input to the component
  @Input() annuitybenefits: Benefits[];
  @Input() annuityitemsPresent: Boolean;
  @Input() systemParameter: SystemParameter;
  @Input() lang: string;
  @Input() modalRef: BsModalRef;
  @Input() isIndividualApp: boolean;
  @Input() showEstimateBtn: boolean;
  @Input() routerData: RouterData;

  benefitTypeEnums = BenefitType;

  benefitInfo: Benefits;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {}

  navigateToEstimate() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_ESTIMATION]);
    } else {
      this.router.navigate([BenefitConstants.ROUTE_PENSION_ESTIMATION]);
    }
  }

  //Method to navigate to  View History
  navigateToViewHistory() {
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
      queryParams: {
        annuity: true
      }
    });
  }
  // Method to navigate to Contributor Visits to this page
  navigateToContributorVisit() {
    this.router.navigate([BenefitConstants.ROUTE_CONTRIBUTOR_VISITS], {
      queryParams: {
        annuity: true
      }
    });
  }
  //Method to navigate to lumpsum
  navigateToWomenLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        womenLumpsum: true
      }
    });
  }
  //Method to navigate to retirement pension
  navigateToRetirementPension() {
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT]);
  }
  //Method to navigate to retirement lumpsum
  navigateToRetirementLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM]);
  }
  //Method to navigate to early retirement
  navigateToEarlyRetirement() {
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        earlyretirement: true
      }
    });
  }
  //Method to navigate to non occ disability assessment
  navigateToNonOccDisabilityAssessment() {
    clearDraftUtil(this.routerData);
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
    clearDraftUtil(this.routerData);
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
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        nonocc: true,
        isDisabilityBenefit: isDisabilityBenefit
      }
    });
  }
  //Method to navigate to jailed pension
  navigateToJailedPension() {
    clearDraftUtil(this.routerData);
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
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        jailed: true
      }
    });
  }
  //Method to navigate to hazardous pension
  navigateToHazardousPension() {
    clearDraftUtil(this.routerData);
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
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        hazardous: true
      }
    });
  }
  //Method to navigate to heir pension
  navigateToHeirPension(eligibleForPensionReform = false) {
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        heir: true,
        eligibleForPensionReform: eligibleForPensionReform
      }
    });
  }
  //Method to navigate to heir lumpsum
  navigateToHeirLumpsum(benefit: Benefits) {
    if (benefit) {
      this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
    }
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        heir: true,
        eligibleForPensionReform: benefit.eligibleForPensionReform
      }
    });
  }

  //Method to navigate to funeral grant
  navigateToFuneralGrant() {
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_FUNERAL_GRANT], {
      queryParams: {
        heir: true
      }
    });
  }
  navigateToRPALumpsum() {
    clearDraftUtil(this.routerData);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        rpa: true
      }
    });
  }
  ShowEligibilityPopup(templateRef: TemplateRef<HTMLElement>, annuitybenefits: Benefits) {
    this.benefitInfo = annuitybenefits;
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
}
