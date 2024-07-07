import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BenefitsGosiShowRolesConstants } from '@gosi-ui/core/lib/constants';
import { BenefitPropertyService, Benefits } from '@gosi-ui/features/benefits/lib/shared';
import { BenefitConstants, BenefitType, isHeirBenefit } from '@gosi-ui/features/payment/lib/shared';

@Component({
  selector: 'cim-eligibility-details-dc',
  templateUrl: './eligibility-details-dc.component.html',
  styleUrls: ['./eligibility-details-dc.component.scss']
})
export class EligibilityDetailsDcComponent implements OnInit {
  @Input() eligiblity: Benefits[] = [];
  @Input() lang: string;
  @Input() isAppProfile = false;

  // @Output() applyForBenefit = new EventEmitter();

  currentIndex: number;
  showLeft: boolean;
  showRight: boolean;
  width: number;
  isAdded = true;
  mobileView = false;
  // benefitsGosiShowRolesConstants = BenefitsGosiShowRolesConstants;
  csrModify = BenefitsGosiShowRolesConstants.CSR_MODIFY;
  // isHeir: boolean;

  constructor(readonly router: Router, readonly benefitPropertyService: BenefitPropertyService) {}
  @HostListener('window:resize', ['$event'])
  onWIndowREsize() {
    this.width = window.innerWidth;
    if (this.width < 1024) {
      this.mobileView = true;
      this.showRight = this.currentIndex < this.eligiblity.length - 1 ? true : false;
    } else {
      this.mobileView = false;
      this.showRight = this.currentIndex + 1 < this.eligiblity.length - 1 ? true : false;
    }
  }
  ngOnInit(): void {
    this.currentIndex = 0;
    this.showLeft = false;
    this.showRight = this.currentIndex + 1 < this.eligiblity.length - 1 ? true : false;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.eligiblity && changes.eligiblity.currentValue) {
      this.eligiblity = changes.eligiblity.currentValue;
      this.showRight = this.currentIndex + 1 < this.eligiblity.length - 1 ? true : false;
    }
  }
  apply(benefit) {
    // this.isHeir = isHeirBenefit(benefit.benefitType.english);

    //   this.applyForBenefit.emit();
    // }
    //Method to navigate to lumpsum
    if (benefit.benefitType.english === BenefitType.womanLumpsum) {
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
    if (benefit.benefitType.english === BenefitType.retirementPension) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT]);
    }
    //Method to navigate to retirement lumpsum
    if (benefit.benefitType.english === BenefitType.retirementLumpsum) {
      if (benefit) {
        this.benefitPropertyService.setEligibleForVIC(benefit.eligibleForVicCancellation);
      }
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM]);
    }
    //Method to navigate to early retirement
    if (benefit.benefitType.english === BenefitType.earlyretirement) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          earlyretirement: true
        }
      });
    }
    //Method to navigate to non occ disability assessment
    if (benefit.benefitType.english === BenefitType.NonOccDisabilityAssessment) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_DISABILITY_ASSESSMENT], {
        queryParams: {
          nonocc: true
        }
      });
    }
    //Method to navigate to non occ retirement lumpsum
    if (benefit.benefitType.english === BenefitType.nonOccLumpsumBenefitType) {
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
    if (benefit.benefitType.english === BenefitType.nonOccPensionBenefitType) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          nonocc: true
        }
      });
    }
    //Method to navigate to jailed pension
    if (benefit.benefitType.english === BenefitType.jailedContributorPension) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          jailed: true
        }
      });
    }
    //Method to navigate to jailed lumpsum
    if (benefit.benefitType.english === BenefitType.jailedContributorLumpsum) {
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
    if (benefit.benefitType.english === BenefitType.hazardousPension) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          hazardous: true
        }
      });
    }
    //Method to navigate to hazardous lumpsum
    if (benefit.benefitType.english === BenefitType.hazardousLumpsum) {
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
    if (benefit.benefitType.english === BenefitType.heirPension) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          heir: true
        }
      });
    }
    //Method to navigate to heir lumpsum
    if (benefit.benefitType.english === BenefitType.heirLumpsum) {
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
    if (benefit.benefitType.english === BenefitType.funeralGrant) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_FUNERAL_GRANT], {
        queryParams: {
          heir: true
        }
      });
    }
    if (benefit.benefitType.english === BenefitType.rpaBenefit) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
        queryParams: {
          rpa: true
        }
      });
    }
    if (benefit.benefitType.english === BenefitType.ui) {
      this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
    }
  }
  onLeftClick() {
    if (this.mobileView) {
      this.currentIndex = this.currentIndex - 1;

      this.showLeft = this.currentIndex - 1 > 0 ? true : false;

      this.showRight = this.currentIndex < this.eligiblity.length - 1 ? true : false;
    } else {
      this.currentIndex = this.currentIndex - 2;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight = this.currentIndex + 1 < this.eligiblity.length - 1 ? true : false;
    }
  }

  onRightClick() {
    if (this.mobileView) {
      this.currentIndex = this.currentIndex + 1;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight = this.currentIndex < this.eligiblity.length - 1 ? true : false;
    } else {
      this.currentIndex = this.currentIndex + 2;

      this.showLeft = this.currentIndex - 1 > 0 ? true : false;

      this.showRight = this.currentIndex + 1 < this.eligiblity.length - 1 ? true : false;
    }
  }
}
