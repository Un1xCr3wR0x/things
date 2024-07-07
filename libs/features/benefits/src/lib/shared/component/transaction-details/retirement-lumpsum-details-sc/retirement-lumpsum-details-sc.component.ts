import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ApplicationTypeEnum,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  RouterConstants,
  RouterData,
  Transaction
} from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { reDirectUsersToApplyScreen } from '../../../utils';
import { AnnuityResponseDto, BenefitsAdjustmentWrapper } from '../../../models';
import { TransactionPensionBase } from '../../base/transaction-pension.base';
import { BenefitType } from '../../../enum';
import { BenefitConstants } from '../../../constants';

@Component({
  selector: 'bnt-retirement-lumpsum-details-sc',
  templateUrl: './retirement-lumpsum-details-sc.component.html',
  styleUrls: ['./retirement-lumpsum-details-sc.component.scss']
})
export class RetirementLumpsumDetailsScComponent extends TransactionPensionBase implements OnInit {
  isJailedLumpsum = false;
  isRPALumpsum = false;
  lumpsumAdjustments: BenefitsAdjustmentWrapper;
  transactionId: number;

  /** Input Variables */

  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() systemParameter: SystemParameter;
  @Input() retirementForm: FormGroup;
  @Input() routerData: RouterData;
  @Input() transaction: Transaction;
  @Input() lang = 'en';
  @Input() isTransactionScreen = false;

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.route.queryParams.subscribe(params => {
      this.isNonOcc = params.nonocc === 'true';
      this.isJailedLumpsum = params.jailedlumpsum === 'true';
      this.isHazardous = params.hazardous === 'true';
      this.isHeir = params.heir === 'true';
      this.isOcc = params.occ === 'true';
      this.isNonOccDisabilityAssessment = params.disabilityAssessment === 'true';
      this.isRPALumpsum = params.rpa === 'true';
      this.isHoldBenefit = params.hold === 'true';
    });
    this.setBenefitType();
    if (this.isTransactionScreen) {
      this.setBenefitRelatedValues(this.transaction);
    } else {
      this.setRouterDataValues(this.routerData);
      if (this.benefitRequestId && this.socialInsuranceNo && this.referenceNo)
        this.setAnnuityBenefitRelatedValues(this.benefitRequestId, this.socialInsuranceNo, this.referenceNo);
    }
    //setting the benefitType according to the queryparam received
    this.getLumpsumBenefitAdjustment();
    if (this.isJailedLumpsum) {
      this.getImprisonmentDetails();
    }
    // if (this.isOcc) {
    //   this.validatorCanEdit = false;
    // }
  }
  /**
   * Method to fetch Lumpsum benefits adjustments
   */
  getLumpsumBenefitAdjustment() {
    this.lumpsumAdjustments = this.uiBenefitService.getlumpsumBenefitAdjustments();
  }

  reDirectUsersToApplyScreens() {
    reDirectUsersToApplyScreen(
      this.requestType,
      this.socialInsuranceNo,
      this.requestId,
      this.annuityBenefitDetails,
      this.coreBenefitService,
      this.router,
      this.benefitType,
      this.referenceNo
    );
  }

  setBenefitType() {
    if (this.isNonOcc) {
      this.benefitType = BenefitType.nonOccLumpsumBenefitType;
    } else if (this.isJailedLumpsum) {
      this.benefitType = BenefitType.jailedContributorLumpsum;
    } else if (this.isJailedLumpsum) {
      this.benefitType = BenefitType.jailedContributorLumpsum;
    } else if (this.isHazardous) {
      this.benefitType = BenefitType.hazardousLumpsum;
    } else if (this.isHeir) {
      this.benefitType = BenefitType.heirLumpsum;
    } else if (this.isOcc) {
      this.benefitType = BenefitType.occLumpsum;
    } else if (this.isRPALumpsum) {
      this.benefitType = BenefitType.rpaBenefit;
    } else {
      this.benefitType = BenefitType.retirementLumpsumType;
    }
  }

  navigateToEdit() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.manageBenefitService.setRequestDate(this.annuityBenefitDetails?.requestDate);
    this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);
    if (this.isNonOcc) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
        queryParams: {
          nonocc: true
        }
      });
    } else if (this.isJailedLumpsum) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
        queryParams: {
          jailed: true
        }
      });
    } else if (this.isHazardous) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
        queryParams: {
          hazardous: true
        }
      });
    } else if (this.isHeir) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
        queryParams: {
          heir: true
        }
      });
    } else {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM]);
    }
  }
  updateDisabilityDetails() {
    if (this.retirementForm.get('disabilityForm').valid) {
      this.disabilityDetails.disabilityPct = this.retirementForm.get('disabilityForm.disabilityPct').value;
      this.disabilityDetails.disabledB = this.retirementForm.get('disabilityForm.disabledB.english').value === 'Yes';
      this.disabilityDetails.isHelpRequired =
        this.retirementForm.get('disabilityForm.helperRequired.english').value === 'Yes';
      this.disabilityDetails.disabilityDate.gregorian = this.retirementForm.get(
        'disabilityForm.disabilityDt.gregorian'
      ).value;
      this.approveDisabilityDetail(this.retirementForm, this.disabilityDetails);
    } else {
    }
  }
  gotoVicViewPage() {
    const identity: CommonIdentity = checkIqamaOrBorderOrPassport(this.annuityBenefitDetails?.identity);
    //this.router.navigate([RouterConstants.ROUTE_CONTRIBUTOR_PROFILE_ENGAGEMENTS(this.socialInsuranceNo)]);
    this.router.navigate(['/home/billing/vic/dashboard'], {
      queryParams: {
        idNo: identity?.id,
        isDashboard: 'true'
      }
    });
  }
}
