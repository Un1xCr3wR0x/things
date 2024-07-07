/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { Role } from '@gosi-ui/core/lib/enums';
import { BenefitConstants, BenefitValues, ManageBenefitService, isHeirBenefit, UIPayloadKeyEnum } from './shared';
import { Router } from '@angular/router';
import { RouterDataToken, RouterData, RouterConstants } from '@gosi-ui/core';

@Component({
  selector: 'bnt-benefits-dc',
  templateUrl: './benefits-dc.component.html'
})
export class BenefitsDcComponent implements OnInit {
  /** Local variables */
  isValidator = false;

  /**
   * Creates an instance of UiDcComponent
   * @param routerData
   * @param router
   */
  constructor(
    @Inject(RouterDataToken) private routerData: RouterData,
    readonly router: Router,
    readonly manageBenefitService: ManageBenefitService
  ) {}

  /**
   * This method handles initialization tasks.
   *
   * @memberof UiDcComponent
   */
  ngOnInit() {
    //Validator flow
    if (
      !this.routerData.stopNavigationToValidator &&
      (this.routerData.assignedRole === Role.VALIDATOR ||
        this.routerData.assignedRole === Role.VALIDATOR_1 ||
        this.routerData.assignedRole === Role.VALIDATOR_2 ||
        this.routerData.assignedRole === Role.FC_APPROVER_ANNUITY ||
        this.routerData.assignedRole === Role.CNT_FC_APPROVER ||
        this.routerData.assignedRole === Role.DOCTOR ||
        this.routerData.assignedRole === Role.SM ||
        this.routerData.assignedRole === Role.BOSH ||
        this.routerData.assignedRole === Role.VC ||
        this.routerData.assignedRole === Role.VCSANED)
    ) {
      this.navigateToValidatorScreens();
    }
    //Non validator flow
    else {
      if (this.routerData.assigneeId === 'estadmin') {
        if (this.routerData.resourceType === 'engagement') {
          this.router.navigate([`home/contributor/edit/${this.routerData.assigneeId}`]);
        } else if (this.routerData.resourceType === RouterConstants.TRANSACTION_CHANGE_ENGAGEMENT) {
          this.router.navigate(['home/contributor-rf/engagement/change/edit']);
        }
      }
      if (
        this.routerData.initiatorRoleId === Role.CUSTOMER_SERVICE_REPRESENTATIVE ||
        this.routerData.assignedRole === 'Contributor'
      ) {
        this.navigateToContributorScreens();
      }
    }
  }

  /**
   *
   * @param assignedRole Checking the assigned role is validator1 or not
   */
  checkIfValidator(assignedRole): boolean {
    if (assignedRole === Role.VALIDATOR_1 || assignedRole === Role.FC_APPROVER_ANNUITY) {
      return true;
    }
  }
  navigateToContributorScreens() {
    switch (this.routerData.resourceType) {
      case BenefitConstants.TRANSACTION_APPROVE_SANED:
        this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
        break;
      case BenefitConstants.TRANSACTION_SUSPEND_SANED:
        this.router.navigate([BenefitConstants.ROUTE_SANED_SUSPEND_BENEFIT]);
        break;
      case BenefitConstants.TRANSACTION_WOMAN_LUMPSUM:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
          queryParams: {
            womenLumpsum: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_RETIREMENT_PENSION:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT]);
        break;
      case BenefitConstants.TRANSACTION_RETIREMENT_LUMPSUM:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM]);
        break;
      case BenefitConstants.TRANSACTION_EARLY_RETIREMENT_PENSION:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
          queryParams: {
            earlyretirement: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_NON_OCC_DISABILITY_BENEFIT:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_DISABILITY_ASSESSMENT], {
          queryParams: {
            nonocc: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_NON_OCC_DISABILITY_LUMPSUM:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
          queryParams: {
            nonocc: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_NON_OCC_DISABILITY_PENSION:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
          queryParams: {
            nonocc: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_JAILED_PENSION:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
          queryParams: {
            jailed: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_JAILED_LUMPSUM:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
          queryParams: {
            jailed: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_HAZARDS_RETIRMENT:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
          queryParams: {
            hazardous: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_HAZARDS_LUMPSUM:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
          queryParams: {
            hazardous: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_HEIR_PENSION:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
          queryParams: {
            heir: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_HEIR_LUMPSUM:
        this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
          queryParams: {
            heir: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_REMOVE_BANK_COMMITMENT:
        this.router.navigate([BenefitConstants.ROUTE_REMOVE_COMMITMENT], {
          queryParams: {
            edit: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_MODIFY_BANK_ACCOUNT:
        this.router.navigate([BenefitConstants.ROUTE_MODIFY_COMMITMENT], {
          queryParams: {
            edit: true
          }
        });
        break;
      case BenefitConstants.TRANSACTION_OCC_PENSION:
      // case BenefitConstants.TRANSACTION_OCC_LUMPSUM:
      //   this.isOccBenefit(this.routerData.resourceType);
      //   break;
      // case BenefitConstants.TRANSACTION_HEIR_REGISTER:
      // case BenefitConstants.MODIFY_BENEFITS:
      //   this.isHeirRegister(this.routerData.resourceType);
      //   break;
      // case BenefitConstants.TRANSACTION_REPAY_BENEFIT:
      //   this.isRepayModify(this.routerData.resourceType);
      //   break;
      // case BenefitConstants.TRANSACTION_MODIFY_PAYEE:
      //   this.isRepayModify(this.routerData.resourceType);
      //   break;
      // case BenefitConstants.TRANSACTION_BENEFIT_ADJUSTMENT:
      // case BenefitConstants.TRANSACTION_UI_BENEFIT_ADJUSTMENT:
      //   this.isUIBenefit(this.routerData.resourceType);
      //   break;
      // case BenefitConstants.TRANSACTION_FUNERAL_GRANT:
      // case BenefitConstants.HOLD_RETIREMENT_PENSION_BENEFIT:
      //   this.isFuneralPensionBenefit(this.routerData.resourceType);
      //   break;
      // case BenefitConstants.TRANSACTION_STOP_BENEFIT:
      // case BenefitConstants.TRANSACTION_RESTART_BENEFIT:
      //   this.isRestartStopBenefit(this.routerData.resourceType);
      //   break;
      // case BenefitConstants.TRANSACTION_MODIFY_BANK_ACCOUNT:
      // case BenefitConstants.TRANSACTION_REMOVE_BANK_COMMITMENT:
      // case BenefitConstants.TRANSACTION_UI_MODIFY_BANK_ACCOUNT:
      //   this.isModifyRemoveBank(this.routerData.resourceType);
      //   break;
      // case BenefitConstants.TRANSACTION_REQ_RPA_LUMPSUM:
      //   this.navigateToRPALumpsum();
      //   break;
    }
  }
  /* navigate to validator screens*/
  navigateToValidatorScreens() {
    switch (this.routerData.resourceType) {
      case BenefitConstants.TRANSACTION_APPROVE_SANED:
        this.router.navigate([BenefitConstants.ROUTE_VALIDATOR_APPROVE_SANED]);
        break;
      case BenefitConstants.TRANSACTION_SUSPEND_SANED:
        this.router.navigate([BenefitConstants.ROUTE_VALIDATOR_SANED_SUSPEND_BENEFIT]);
        break;
      case BenefitConstants.TRANSACTION_WOMAN_LUMPSUM:
        this.router.navigate([BenefitConstants.ROUTE_VALIDATOR_APPROVE_WOMAN_LUMPSUM]);
        break;
      case BenefitConstants.TRANSACTION_RETIREMENT_PENSION:
        this.router.navigate(['home/benefits/validator/validator-retirement-pension']);
        break;
      case BenefitConstants.TRANSACTION_RETIREMENT_LUMPSUM:
        this.router.navigate(['home/benefits/validator/validator-retirement-lumpsum']);
        break;
      case BenefitConstants.TRANSACTION_EARLY_RETIREMENT_PENSION:
        this.navigateToEarlyRetirement();
        break;
      case BenefitConstants.TRANSACTION_NON_OCC_DISABILITY_BENEFIT:
        this.navigateTODissabilityAssessment();
        break;
      case BenefitConstants.TRANSACTION_NON_OCC_DISABILITY_LUMPSUM:
        this.navigateTONonOccLumpsum();
        break;
      case BenefitConstants.TRANSACTION_NON_OCC_DISABILITY_PENSION:
        this.navigateToNonOccPension();
        break;
      case BenefitConstants.TRANSACTION_JAILED_PENSION:
        this.navigateToJailedPension();
        break;
      case BenefitConstants.TRANSACTION_JAILED_LUMPSUM:
        this.navigateToJailedLumpsum();
        break;
      case BenefitConstants.TRANSACTION_HAZARDS_RETIRMENT:
      case BenefitConstants.TRANSACTION_HAZARDS_LUMPSUM:
        this.isHazardBenefit(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_HEIR_PENSION:
      case BenefitConstants.TRANSACTION_HEIR_LUMPSUM:
      case BenefitConstants.TRANSACTION_HEIR_PROACTIVE:
        this.isHeirBenefit(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_OCC_PENSION:
      case BenefitConstants.TRANSACTION_OCC_LUMPSUM:
        this.isOccBenefit(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_HEIR_REGISTER:
      case BenefitConstants.LINK_CONTRIBUTOR:
      case BenefitConstants.MODIFY_BENEFITS:
        this.isHeirRegister(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_REPAY_BENEFIT:
        this.isRepayModify(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_MODIFY_PAYEE:
        this.isRepayModify(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_BENEFIT_ADJUSTMENT:
      case BenefitConstants.TRANSACTION_UI_BENEFIT_ADJUSTMENT:
        this.isUIBenefit(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_FUNERAL_GRANT:
      case BenefitConstants.HOLD_RETIREMENT_PENSION_BENEFIT:
        this.isFuneralPensionBenefit(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_STOP_BENEFIT:
      case BenefitConstants.TRANSACTION_RESTART_BENEFIT:
        this.isRestartStopBenefit(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_MODIFY_BANK_ACCOUNT:
      case BenefitConstants.TRANSACTION_REMOVE_BANK_COMMITMENT:
      case BenefitConstants.TRANSACTION_UI_MODIFY_BANK_ACCOUNT:
        this.isModifyRemoveBank(this.routerData.resourceType);
        break;
      case BenefitConstants.TRANSACTION_REQ_RPA_LUMPSUM:
        this.navigateToRPALumpsum();
        break;
      case BenefitConstants.TRANSACTION_HEIR_MISCELLANEUOS_PAYMENT:
        this.navigateToHeirMiscPayment();
        break;
      case BenefitConstants.TRANSACTION_BENEFIT_PROACTIVE_SANED:
        this.router.navigate([BenefitConstants.ROUTE_VALIDATOR_APPROVE_SANED]);
        break;
      case BenefitConstants.TRANSACTION_BENEFIT_PROACTIVE_RETIREMENT_LUMPSUM:
        this.router.navigate(['home/benefits/validator/validator-retirement-lumpsum']);
        break;
      case BenefitConstants.TRANSACTION_BENEFIT_PROACTIVE_RETIREMENT_PENSION:
        this.router.navigate(['home/benefits/validator/validator-retirement-pension']);
        break;
    }
  }
  isHazardBenefit(type) {
    return type === BenefitConstants.TRANSACTION_HAZARDS_RETIRMENT
      ? this.navigateToHazardousPension()
      : this.navigateToHazardousLumpsum();
  }
  isHeirBenefit(type) {
    return type === BenefitConstants.TRANSACTION_HEIR_PENSION || type === BenefitConstants.TRANSACTION_HEIR_PROACTIVE
      ? this.navigateToHeirPension(this.routerData.idParams.get(UIPayloadKeyEnum.SUB_RESOURCE))
      : this.navigateToHeirLumpsum();
  }
  isOccBenefit(type) {
    return type === BenefitConstants.TRANSACTION_OCC_PENSION ? this.navigateToOCCPension() : this.navigateOCCLumpsum();
  }
  isHeirRegister(type) {
    return (type === BenefitConstants.TRANSACTION_HEIR_REGISTER || type === BenefitConstants.LINK_CONTRIBUTOR)
      ? this.router.navigate(['home/benefits/validator/validate-heir-registeration'])
      : this.navigateModifyBenefitScreen(type);
  }
  isRepayModify(type) {
    return type === BenefitConstants.TRANSACTION_REPAY_BENEFIT
      ? this.router.navigate(['home/benefits/validator/approve-return-lumpsum'], {})
      : this.router.navigate(['home/benefits/validator/modify-benefit-payment'], {});
  }
  isUIBenefit(type) {
    return type === BenefitConstants.TRANSACTION_BENEFIT_ADJUSTMENT
      ? this.navigateToBenefitAdjustment(this.routerData)
      : this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_RECALCULATE]);
  }
  isFuneralPensionBenefit(type) {
    return type === BenefitConstants.TRANSACTION_FUNERAL_GRANT
      ? this.router.navigate([BenefitConstants.ROUTE_VALIDATOR_REQUEST_FUNERAL_GRANT])
      : this.router.navigate(['home/benefits/validator/hold-benefit-payment'], {});
  }
  isRestartStopBenefit(type) {
    return type === BenefitConstants.TRANSACTION_STOP_BENEFIT
      ? this.router.navigate(['home/benefits/validator/approve-stop-benefit'], {})
      : this.router.navigate(['home/benefits/validator/approve-restart-benefit'], {});
  }
  isModifyRemoveBank(type) {
    return type === BenefitConstants.TRANSACTION_MODIFY_BANK_ACCOUNT ||
      type === BenefitConstants.TRANSACTION_UI_MODIFY_BANK_ACCOUNT
      ? this.navigateToModifyBankScreens()
      : this.navigateToRemoveBankScreens();
  }
  navigateModifyBenefitScreen(type: string) {
    const payload = JSON.parse(this.routerData.payload);
    let heir = false;
    if (payload?.benefitType) {
      heir = isHeirBenefit(payload.benefitType);
    }
    if (payload.subResource === BenefitValues.dependents) {
      this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
        queryParams: {
          addModifyDep: true,
          nonocc:
            type === BenefitConstants.TRANSACTION_NON_OCC_DISABILITY_PENSION ||
            type === BenefitConstants.TRANSACTION_NON_OCC_DISABILITY_LUMPSUM
        }
      });
    } else if (payload.subResource === BenefitValues.heirs) {
      this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
        queryParams: {
          addModifyHeir: true,
          heir: heir
        }
      });
    } else if (payload.subResource === BenefitValues.holdDependent || payload.subResource === BenefitValues.holdHeir) {
      this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
        queryParams: {
          hold: true,
          heir: heir
        }
      });
    } else if (payload.subResource === BenefitValues.stopDependent || payload.subResource === BenefitValues.stopHeir) {
      this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
        queryParams: {
          stop: true,
          heir: heir
        }
      });
    } else if (
      payload.subResource === BenefitValues.restartDependent ||
      payload.subResource === BenefitValues.restartHeir
    ) {
      this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
        queryParams: {
          restart: true,
          heir: heir
        }
      });
    } else if (payload.subResource === BenefitValues.startBenefitWaive) {
      this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
        queryParams: {
          startBenefitWaive: true,
          heir: heir
        }
      });
    } else if (payload.subResource === BenefitValues.stopBenefitWaive) {
      this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
        queryParams: {
          stopBenefitWaive: true,
          heir: heir
        }
      });
    } else if (payload.subResource === BenefitValues.updateJailWorker) {
      this.router.navigate(['home/benefits/validator/approve-imprisonment-modify']);
    }
  }
  navigateToModifyBankScreens() {
    this.router.navigate(['home/benefits/validator/modify-commitment'], {
      queryParams: {
        modifybank: true
      }
    });
  }
  navigateToRemoveBankScreens() {
    this.router.navigate(['home/benefits/validator/modify-commitment'], {
      queryParams: {
        removebank: true
      }
    });
  }
  navigateToEarlyRetirement() {
    this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
      queryParams: {
        earlyretirement: true
      }
    });
  }
  navigateTODissabilityAssessment() {
    this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
      queryParams: {
        disabilityAssessment: true
      }
    });
  }
  navigateTONonOccLumpsum() {
    this.router.navigate(['home/benefits/validator/validator-retirement-lumpsum'], {
      queryParams: {
        nonocc: true
      }
    });
  }
  navigateToNonOccPension() {
    this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
      queryParams: {
        nonocc: true
      }
    });
  }
  navigateToJailedPension() {
    this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
      queryParams: {
        jailedpension: true
      }
    });
  }
  navigateToJailedLumpsum() {
    this.router.navigate(['home/benefits/validator/validator-retirement-lumpsum'], {
      queryParams: {
        jailedlumpsum: true
      }
    });
  }
  navigateToRPALumpsum() {
    this.router.navigate(['home/benefits/validator/validator-retirement-lumpsum'], {
      queryParams: {
        rpa: true
      }
    });
  }
  navigateToHeirMiscPayment() {
    this.router.navigate(['home/benefits/validator/validator-direct-payment']);
  }
  navigateToHazardousPension() {
    this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
      queryParams: {
        hazardous: true
      }
    });
  }
  navigateToHazardousLumpsum() {
    this.router.navigate(['home/benefits/validator/validator-retirement-lumpsum'], {
      queryParams: {
        hazardous: true
      }
    });
  }
  navigateToHeirPension(subResource: string) {
    this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
      queryParams: {
        heir: true
      }
    });
  }
  navigateToHeirLumpsum() {
    this.router.navigate(['home/benefits/validator/validator-retirement-lumpsum'], {
      queryParams: {
        heir: true
      }
    });
  }
  navigateToOCCPension() {
    this.router.navigate(['home/benefits/validator/validator-retirement-pension'], {
      queryParams: {
        occ: true
      }
    });
  }
  navigateOCCLumpsum() {
    this.router.navigate(['home/benefits/validator/validator-retirement-lumpsum'], {
      queryParams: {
        occ: true
      }
    });
  }
  navigateToBenefitAdjustment(routerData) {
    this.manageBenefitService
      .getBenefitRecalculation(routerData?.idParams.get('socialInsuranceNo'), routerData?.idParams.get('id'))
      .subscribe(
        res => {
          if (
            routerData?.idParams.get('benefitChangeRequired') &&
            res?.changeInEngagementRecalculationDetails?.newBenefitDetails?.benefitConversionType ===
              BenefitConstants.TO_BE_SELECTED
          ) {
            this.router.navigate([BenefitConstants.ROUTE_CONTRIBUTOR_BENEFIT_TYPE]);
          } else if (
            res?.changeInEngagementRecalculationDetails?.newBenefitDetails?.benefitConversionType ===
              BenefitConstants.PENSION_CONTRIBUTOR ||
            res?.changeInEngagementRecalculationDetails?.newBenefitDetails?.benefitConversionType ===
              BenefitConstants.LUMPSUM_CONTRIBUTOR
          ) {
            this.router.navigate([BenefitConstants.ROUTE_CONTRIBUTOR_VALIDATOR_BENEFIT_TYPE]);
          } else if (
            JSON.parse(routerData?.payload)?.subResource === 'Rejoining' ||
            JSON.parse(routerData?.payload)?.subResource === 'Termination of Reemployment'
          ) {
            this.router.navigate([BenefitConstants.ROUTE_REJOINING_TERMINATE]);
          } else if (
            JSON.parse(routerData?.payload)?.subResource === 'Non Occ Disability Decision Change' ||
            JSON.parse(routerData?.payload)?.subResource === 'Occ Disability Decision Change'
          ) {
            this.router.navigate([BenefitConstants.ROUTE_DISABILITY_ASSESSMENT]);
          } else if (
            JSON.parse(routerData?.payload)?.subResource === 'Heir Benefit Recalculation Without Main Beneficiary'
          ) {
            this.router.navigate([BenefitConstants.ROUTE_HEIR_RECALCULATION]);
          } else {
            this.router.navigate([BenefitConstants.ROUTE_ENGAGEMENT_CHANGE]);
          }
        },
        () => {
          if (
            JSON.parse(routerData?.payload)?.subResource === 'Rejoining' ||
            JSON.parse(routerData?.payload)?.subResource === 'Termination of Reemployment'
          ) {
            this.router.navigate([BenefitConstants.ROUTE_REJOINING_TERMINATE]);
          } else if (
            JSON.parse(routerData?.payload)?.subResource === 'Non Occ Disability Decision Change' ||
            JSON.parse(routerData?.payload)?.subResource === 'Occ Disability Decision Change'
          ) {
            this.router.navigate([BenefitConstants.ROUTE_DISABILITY_ASSESSMENT]);
          } else if (
            JSON.parse(routerData?.payload)?.subResource === 'Heir Benefit Recalculation Without Main Beneficiary'
          ) {
            this.router.navigate([BenefitConstants.ROUTE_HEIR_RECALCULATION]);
          } else {
            this.router.navigate([BenefitConstants.ROUTE_ENGAGEMENT_CHANGE]);
          }
        }
      );
  }
  /**
   * Covered scenarios other than Validator 1
   * @param resourceType
   * @param assignedRole
   */
  handleValidatorRedirections(resourceType, assignedRole) {
    if (assignedRole === Role.VALIDATOR_1) {
      if (resourceType === BenefitConstants.TRANSACTION_APPROVE_SANED) {
        this.router.navigate([BenefitConstants.ROUTE_VALIDATOR_APPROVE_SANED]);
      }
    }
  }
}
