import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ApplicationTypeEnum,
  BenefitsGosiShowRolesConstants,
  BilingualText,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  Transaction
} from '@gosi-ui/core';
import { BenefitConstants } from '../../../constants';
import { BenefitType } from '../../../enum';
import {
  AnnuityResponseDto,
  HoldPensionDetails,
  PaymentDetail,
  HoldBenefitDetails,
  HeirsDetails,
  Contributor,
  AttorneyDetailsWrapper,
  ActiveBenefits
} from '../../../models';
import { getIdentityLabel } from '../../../utils';
import { TransactionPensionBase } from '../../base/transaction-pension.base';

@Component({
  selector: 'bnt-modify-commitment-details-sc',
  templateUrl: './modify-commitment-details-sc.component.html',
  styleUrls: ['./modify-commitment-details-sc.component.scss']
})
export class ModifyCommitmentDetailsScComponent extends TransactionPensionBase implements OnInit {
  /**
   * Local Variables
   */
  modifyCommitment: HoldBenefitDetails;
  modifyCommitmentType: string;
  isModifyBank = false;
  isRemoveBank = false;
  iscolfour = true;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  contributorDetails: Contributor;
  benefitAttorney: AttorneyDetailsWrapper;
  identity: CommonIdentity | null;
  authorizedIdentity: CommonIdentity | null;
  directDisabled: boolean;
  checkBenefitType = BenefitType.modifyCommitment;
  identityLabel = ' ';
  individualApp: boolean;
  isEditShown = false;
  /** Input Variables */
  @Input() transaction: Transaction;
  @Input() isTransactionScreen = false;
  @Input() socialInsuranceNo: number;
  @Input() requestId: number;
  @Input() referenceNo: number;
  @Input() lang = 'en';
  @Input() canEditModifyCommitment;
  @Input() status;
  @Input() checkForm: FormGroup;
  @Output() onEditCommitmentClicked = new EventEmitter();
  @Output() samaDisable: EventEmitter<{ disableApprove: boolean; warningDisplay: BilingualText }> = new EventEmitter();
  ngOnInit(): void {
    this.isEditShown = this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.VALIDATOR_EDIT);
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.individualApp = true;
    }
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.isModifyBank = params.modifybank === 'true';
        this.isRemoveBank = params.removebank === 'true';
      }
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.isTransactionScreen) {
      this.benefitType = +this.transaction.params.BENEFIT_TYPE === 1050 ? BenefitType.ui : null;
      this.directDisabled = true;
    } else {
      this.benefitType =
        this.routerData?.resourceType === BenefitConstants.TRANSACTION_UI_MODIFY_BANK_ACCOUNT ? BenefitType.ui : null;
      this.isEditShown =
        this.benefitType === BenefitType.ui
          ? this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.SANED_VALIDATOR_EDIT)
          : this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.VALIDATOR_EDIT);
    }
    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 ||
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2
    ) {
      this.directDisabled = false;
    } else if (
      this.routerData.assignedRole === this.rolesEnum.FC_APPROVER ||
      this.routerData.assignedRole === this.rolesEnum.FC_CONTROLLER ||
      this.routerData.assignedRole === this.rolesEnum.CNT_FC_APPROVER ||
      this.routerData.assignedRole === 'FC Approver'
    ) {
      this.directDisabled = true;
    }
    if (this.isModifyBank && this.socialInsuranceNo && this.requestId && this.status === 'Completed') {
      if (this.benefitType === BenefitType.ui) {
        // this.getUIModifyCommitmentDetails(this.socialInsuranceNo, this.requestId, !this.isModifyBank ? this.referenceNo : null);
        this.getUiBenefitDetails(
          this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo,
          this.requestId
        );
        this.getUiPaymentDetails(
          this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo,
          this.requestId
        );
      } else {
        // this.getModifyCommitmentDetails(this.socialInsuranceNo, this.requestId, null);
        this.getActiveBenefitDetails(
          this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo,
          this.requestId
        );
        this.getPaymentDetails(
          this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo,
          this.requestId
        );
      }
    } else if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      if (this.benefitType === BenefitType.ui) {
        this.getUIModifyCommitmentDetails(
          this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo,
          this.requestId,
          this.referenceNo
        );
      } else {
        this.getModifyCommitmentDetails(
          this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo,
          this.requestId,
          this.referenceNo
        );
      }
    }
  }

  // fetch modify Remove bank  details
  getUIModifyCommitmentDetails(sin: number, benefitRequestId: number, referenceNo?: number) {
    this.modifyBenefitService
      .getValidatorUIBankDetails(sin, benefitRequestId, referenceNo, this.isModifyBank)
      .subscribe(
        res => {
          this.setModifyCommitment(res);
        },
        err => this.showError(err)
      );
  }
  // fetch modify Remove bank  details
  getModifyCommitmentDetails(sin: number, benefitRequestId: number, referenceNo?: number) {
    this.modifyBenefitService.getModifyCommitment(sin, benefitRequestId, referenceNo, this.isModifyBank).subscribe(
      res => {
        this.setModifyCommitment(res);
      },
      err => this.showError(err)
    );
  }
  setModifyCommitment(res: HoldBenefitDetails) {
    this.modifyCommitment = res;
    if (this.modifyCommitment?.modifyPayee?.bankAccount?.disableApprove) {
      this.samaDisable.emit({
        disableApprove: this.modifyCommitment?.modifyPayee?.bankAccount?.disableApprove,
        warningDisplay: this.modifyCommitment?.modifyPayee?.bankAccount?.bankWarningMessage
      });
    }
    this.contributorDetails = res?.contributor;
    this.benefitAttorney = res?.benefitAttorney;
    this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
    this.identityLabel = getIdentityLabel(this.identity);
    if (this.benefitAttorney?.identity)
      this.authorizedIdentity = checkIqamaOrBorderOrPassport(this.benefitAttorney?.identity);
    this.checkForm.get('checkBoxFlag').setValue(this.modifyCommitment?.isDirectPaymentOpted);
  }

  // Fetch active benefit Details
  getActiveBenefitDetails(sin: number, benefitRequestId: number) {
    this.manageBenefitService.getAnnuityBenefitRequestDetail(sin, benefitRequestId, null).subscribe(res => {
      if (res) {
        this.setBenefitDetails(res);
      }
    });
  }

  // Fetch active benefit Details
  getUiBenefitDetails(sin: number, benefitRequestId: number) {
    this.uiBenefitService.getUiBenefitRequestDetail(sin, benefitRequestId, null).subscribe(res => {
      if (res) {
        this.setBenefitDetails(res);
        this.personId = res?.personId;
      }
    });
  }

  /** Method to fetch payment details **/
  getPaymentDetails(sin: number, benefitRequestId: number) {
    this.manageBenefitService.getPaymentDetails(sin, benefitRequestId).subscribe(res => {
      if (res) {
        this.setPaymentDetails(res);
      }
    });
  }

  /** Method to fetch payment details **/
  getUiPaymentDetails(sin: number, benefitRequestId: number) {
    this.uiBenefitService.getUiPaymentDetails(sin, benefitRequestId).subscribe(res => {
      if (res) {
        this.setPaymentDetails(res);
      }
    });
  }

  setBenefitDetails(res: AnnuityResponseDto) {
    if (!this.modifyCommitment) this.modifyCommitment = new HoldBenefitDetails();
    if (!this.modifyCommitment.pension) this.modifyCommitment.pension = new HoldPensionDetails();
    this.modifyCommitment.pension.annuityBenefitType = res.benefitType;
    this.modifyCommitment.pension.benefitAmount = res.benefitAmount;
    this.modifyCommitment.pension.benefitStartDate = res.benefitStartDate;
    this.modifyCommitment.pension.status = res.status;
    this.modifyCommitment.modifyPayee.personId = res?.personId;
    if (!this.contributorDetails) this.contributorDetails = new Contributor();
    this.contributorDetails.name = res.contributorName;
    this.contributorDetails.dateOfBirth = res.dateOfBirth;
    this.contributorDetails.age = res.ageInGregorian;
    this.contributorDetails.hijiriAge = res.age;
    this.contributorDetails.identity = res.identity;
    this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
    this.identityLabel = getIdentityLabel(this.identity);
  }

  setPaymentDetails(res: PaymentDetail) {
    if (!this.modifyCommitment) this.modifyCommitment = new HoldBenefitDetails();
    if (!this.modifyCommitment.modifyPayee) this.modifyCommitment.modifyPayee = new HeirsDetails();
    this.modifyCommitment.modifyPayee.payeeType = res.benefitDetails?.payeeType;
    this.modifyCommitment.modifyPayee.paymentMode = res.benefitDetails?.paymentMethod;
    this.modifyCommitment.modifyPayee.bankAccount = res.benefitDetails?.bankAccount;
    this.modifyCommitment.samaVerification = res.samaVerification;
    if (this.modifyCommitment?.modifyPayee?.payeeType?.english === 'Authorized Person') {
      this.benefitAttorney = new AttorneyDetailsWrapper();
      this.benefitAttorney['nameBilingual'] = res.benefitDetails?.authorizedPersonName;
      this.authorizedIdentity = checkIqamaOrBorderOrPassport(res.benefitDetails.authorizedPersonIdentifier);
    }
  }

  navigateToContributorDetails() {
    // this.routerData.stopNavigationToValidator = true;
    // this.router.navigate([`home/profile/contributor/${this.socialInsuranceNo}/info`]);
    if (!this.isIndividualApp) {
      this.contributorService.selectedSIN = this.socialInsuranceNo;
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }

  navigateToAdjustmentDetails() {
    this.adjustmentPaymentService.identifier = this.modifyCommitment?.modifyPayee?.personId || this.personId;
    this.adjustmentPaymentService.socialNumber = this.isIndividualApp
      ? this.authTokenService.getIndividual()
      : this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.modifyCommitment?.pension?.annuityBenefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
}
