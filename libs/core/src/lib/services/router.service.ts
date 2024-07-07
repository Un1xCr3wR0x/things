import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentConstants } from '@gosi-ui/features/payment/lib/shared/constants/payment-constants';
import { RouterConstants } from '../constants';
import { ApplicationTypeEnum, Role, WorkFlowActions } from '../enums';
import { RouterData } from '../models';
import { ApplicationTypeToken, RouterDataToken } from '../tokens';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  constructor(
    private router: Router,
    @Inject(RouterDataToken) private routerToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  /**
   * This method is to set the router token data
   * @param tokenData
   */
  setRouterDataToken(tokenData) {
    this.routerToken.fromJsonToObject(tokenData);
    this.navigateTo();
  }

  /**
   * This method is to set the router token data
   * @param tokenData
   */
  setRouterDataTokenOnly(tokenData) {
    this.routerToken.fromJsonToObject(tokenData);
  }

  // last condition needs to remove
  private navigateTo() {
    if (RouterConstants.TRANSACTIONS_UNDER_ESTABLISHMENT.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToEstablishment();
      return;
    } else if (RouterConstants.TRANSACTIONS_UNDER_CONTRIBUTOR.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToContributor();
      return;
    } else if (RouterConstants.TRANSACTIONS_UNDER_INDIVIDUAL_APP.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToIndividualContractAuth();
      return;
    } else if (RouterConstants.TRANSACTIONS_UNDER_INDIVIDUAL_APP.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToIndividualContractAuth();
      return;
    } else if (this.forReassessmentActBehalf(this.routerToken)) {
      this.router.navigate(['/home/oh/reassessment/contributor-assessment']);
    } else if (this.isRequestClarificationTransaction(this.routerToken)) {
      this.navigateToMedicalBoard();
    } else if (this.reAssignRequestClarificationMB(this.routerToken)) {
      this.navigateToMedicalBoard();
    } else if (
      (RouterConstants.TRANSACTIONS_UNDER_MEDICAL_BOARD.indexOf(this.routerToken.resourceType) !== -1 &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR || this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS) &&
        this.routerToken.state === WorkFlowActions.RETURN &&
        this.routerToken.resourceType !== WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR) ||
      ((this.routerToken.assignedRole === Role.OH_DOCTOR || this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS) &&
        this.routerToken.resourceType === WorkFlowActions.BENEFITSNONOCCDISABILITY) ||
      ((this.routerToken.assignedRole === Role.OH_DOCTOR || this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS) &&
        this.routerToken.resourceType === WorkFlowActions.HEIR_DISABILITY_ASSESSMENT) ||
      (this.routerToken.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR ||
          this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS)) ||
      ((this.routerToken.resourceType === WorkFlowActions.NON_OCC_DISABILITY_REASSESSMENT ||
        this.routerToken.resourceType === WorkFlowActions.DEPENDENT_DISABILITY_REASSESSMENT) &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR ||
          this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS)) ||
      (this.routerToken.resourceType === WorkFlowActions.HEIR_DISABILITY_REASSESSMENT &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR ||
          this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS)) ||
      (this.routerToken.resourceType === WorkFlowActions.NON_OCC_DISABILITY_ASSESSMENT &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR ||
          this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS)) ||
      (this.routerToken.resourceType === WorkFlowActions.EARLY_REASSESSMENT &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR ||
          this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS)) ||
      (this.routerToken.resourceType === WorkFlowActions.APPEAL_ASSESSMENT &&
        (this.routerToken.assignedRole === Role.HEAD_OFFICE_GOSI_DOCTOR ||
          this.routerToken.assignedRole === Role.HO_DOCTOR ||
          this.routerToken.assignedRole === Role.HO_OFFICER ||
          this.routerToken.assignedRole === Role.HEAD_GOSI_DOCTOR)) ||
      (this.routerToken.resourceType === WorkFlowActions.EARLY_REASSESSMENT &&
        this.routerToken.assignedRole === Role.CONTRIBUTOR) ||
      (this.routerToken.resourceType === WorkFlowActions.NON_OCC_DEPENDENT_ASSESSMENT &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR ||
          this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS)) ||
      (this.routerToken.resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR ||
          this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS)) ||
      ((this.routerToken.resourceType === WorkFlowActions.REQUEST_CLARIFICATION ||
        this.checkOnRequestClarification()) &&
        (this.routerToken.assignedRole === Role.OH_DOCTOR ||
          this.routerToken.assignedRole === Role.GOSI_DOCTOR_CAPS)) ||
      this.mbConveyanceAllowance(this.routerToken)
    ) {
      this.navigateToOh();
      return;
    } else if (
      RouterConstants.TRANSACTIONS_UNDER_MEDICAL_BOARD.indexOf(this.routerToken.resourceType) !== -1 ||
      this.conveyanceAllowancembo(this.routerToken)
    ) {
      this.navigateToMedicalBoard();
      return;
    } else if (RouterConstants.TRANSACTIONS_UNDER_BENEFIT.indexOf(this.routerToken.resourceType.toLowerCase()) !== -1) {
      this.navigateToUiBenefits();
    } else if (RouterConstants.TRANSACTIONS_UNDER_BILLING.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToBilling();
    } else if (RouterConstants.TRANSACTIONS_UNDER_OH.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToOh();
    } else if (RouterConstants.TRANSACTIONS_MANAGE_PERSON.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToManagePerson();
      return;
    } else if (RouterConstants.TRANSACTIONS_PAYMENTS.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToPayments(this.routerToken.resourceType);
    } else if (RouterConstants.TRANSACTIONS_ADJUSTMENTS_LIST.includes(this.routerToken.resourceType)) {
      this.navigateToAdjustments();
    } else if (
      RouterConstants.TRANSACTIONS_UNDER_COMPLAINTS.indexOf(this.routerToken.resourceType) !== -1 ||
      (this.routerToken.resourceType == RouterConstants.PRIVATE_SECTOR_APPEAl &&
        this.appToken === ApplicationTypeEnum.PUBLIC)
    ) {
      this.navigateToComplaints();
      return;
    } else if (RouterConstants.TRANSACTIONS_UNDER_VIOLATIONS.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToViolations();
    } else if (RouterConstants.TRANSACTIONS_UNDER_APPEALS.indexOf(this.routerToken.resourceType) !== -1) {
      this.navigateToAppeals();
    } else if (
      //TODO Remove rest of code
      this.routerToken.assignedRole === Role.VALIDATOR ||
      this.routerToken.assignedRole === Role.VALIDATOR_1 ||
      this.routerToken.assignedRole === Role.VALIDATOR_2 ||
      this.routerToken.assignedRole === Role.GDS ||
      this.routerToken.assignedRole === Role.FC_APPROVER ||
      this.routerToken.assignedRole === Role.OH_FCAPPROVER ||
      this.routerToken.assignedRole === Role.GDISO ||
      this.routerToken.assignedRole === Role.GDES ||
      this.routerToken.assignedRole === Role.CSB_DIRECTOR ||
      this.routerToken.assignedRole === Role.MEDICAL_MANAGER ||
      this.routerToken.assignedRole === Role.MEDICAL_MANAGER_SPACE ||
      this.routerToken.assignedRole === Role.EXCEPTIONAL_WAIVER_OFFICER
    ) {
      this.navigateToValidator();
    } else if (RouterConstants.TRANSACTIONS_UNDER_REASSESSMENT.indexOf(this.routerToken.resourceType) !== -1) {
      if (this.routerToken.assignedRole === Role.CONTRIBUTOR) {
        this.navigateToEdit();
      } else {
        this.navigateToMedicalBoard();
      }
    } else {
      this.navigateToEdit();
    }
  }
  private navigateToComplaints() {
    this.navigateToDomain(RouterConstants.ROUTE_VALIDATOR_COMPLAINTS);
  }

  private isRequestClarificationTransaction(routerToken: RouterData) {
    const payload = JSON.parse(routerToken.payload);
    if (routerToken.assignedRole !== Role.CONTRIBUTOR) return false;
    if (
      payload?.previousOutcome === WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR ||
      payload?.previousOutcome === WorkFlowActions.REQUEST_MEDICAL_REPORTS
    ) {
      switch (routerToken.resourceType) {
        case RouterConstants.TRANSACTION_CLOSE_INJURY:
        case RouterConstants.TRANSACTION_CLOSE_COMPLICATION:
        case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
        case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
        case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
        case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
        case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
        case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
        case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
          return true;
        default:
          return false;
      }
    }
  }

  /**
   * Method to navigate to validator
   */
  private navigateToValidator() {
    this.navigateToDomain(RouterConstants.ROUTE_VALIDATOR);
  }

  /**
   * This method is used to navigate to access edit or modify functionalitites during workflow
   */
  navigateToEdit() {
    const transaction = this.routerToken.resourceType;
    switch (transaction) {
      case RouterConstants.TRANSACTION_ADD_IQAMA:
      case RouterConstants.TRANSACTION_ADD_BORDER:
      case RouterConstants.TRANSACTION_ADD_PASSPORT:
      case RouterConstants.TRANSACTION_MODIFY_PERSONAL_DETAILS:
        {
          this.navigateToDomain(RouterConstants.ROUTE_MANAGE_PERSON);
        }
        break;
      case RouterConstants.TRANSACTION_NON_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT:
        {
          this.navigateToDomain(RouterConstants.ROUTE_CONTRIBUTOR_REASSESSMENT);
        }
        break;
      case RouterConstants.TRANSACTION_OCC_DISABILITY_REASSESSMENT:
        {
          this.navigateToDomain(RouterConstants.ROUTE_CONTRIBUTOR_REASSESSMENT);
        }
        break;
      case RouterConstants.TRANSACTION_HEIR_DISABILITY_REASSESSMENT:
        {
          this.navigateToDomain(RouterConstants.ROUTE_CONTRIBUTOR_REASSESSMENT);
        }
        break;
    }
  }

  /**
   * Method to navigate to establishment module
   */
  navigateToEstablishment() {
    this.navigateToDomain(RouterConstants.ROUTE_ESTABLISHMENT);
  }

  /**
   * Method to navigate to Manage Person
   */
  navigateToManagePerson() {
    this.navigateToDomain(RouterConstants.ROUTE_MANAGE_PERSON);
  }

  /**Method to navigate contributor */
  navigateToContributor() {
    this.navigateToDomain(RouterConstants.ROUTE_CONTRIBUTOR);
  }

  navigateToIndividualContractAuth() {
    // this.navigateToDomain(RouterConstants.ROUTE_INDIVIDUAL_APP_CONTRACT_AUTH);
    // case RouterConstants.TRANSACTION_CONTRACT_AUTHENTICATION:
    this.navigateToDomain(RouterConstants.ROUTE_INDIVIDUAL_CONTRACT_AUTH);
  }
  /** Method to navgate to Billing Validator module. */
  navigateToBilling() {
    this.navigateToDomain(RouterConstants.ROUTE_BILLING);
    return;
  }
  /**
   * Method to navigate to Oh
   */
  navigateToOh() {
    this.navigateToDomain(RouterConstants.ROUTE_OH);
  }

  /** Method to navgate to Medical Board Validator module. */
  navigateToMedicalBoard() {
    this.router.navigate([RouterConstants.ROUTE_MEDICAL_BOARD]);
  }

  /**
   * Method to navigate to RejectOh page
   */
  navigateToRejectOh() {
    this.navigateToDomain(RouterConstants.ROUTE_INJURY_REJECT_VIEW);
  }

  /**
   * Method to navigate to benefits page
   */
  navigateToUiBenefits() {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.navigateToDomain(RouterConstants.ROUTE_BENEFIT_UI);
    } else {
      this.navigateToDomain(RouterConstants.ROUTE_BENEFIT);
    }
  }
  navigateToAdjustments() {
    if (RouterConstants.TRANSACTIONS_ADJUSTMENTS.indexOf(this.routerToken.resourceType) !== -1) {
      this.router.navigate([RouterConstants.ROUTE_ADJUSTMENTS]);
    } else if (RouterConstants.TRANSACTION_THIRD_PARTY_ADJUSTMENTS.indexOf(this.routerToken.resourceType) !== -1) {
      this.router.navigate([RouterConstants.ROUTE_THIRD_PARTY_ADJUSTMENTS]);
    } else if (
      RouterConstants.TRANSACTION_MAINTAIN_THIRD_PARTY_ADJUSTMENTS.indexOf(this.routerToken.resourceType) !== -1
    ) {
      this.router.navigate([RouterConstants.ROUTE_MAINTAIN_THIRD_PARTY_ADJUSTMENTS]);
    } else if (RouterConstants.TRANSACTIONS_HEIR_ADJUSTMENTS.indexOf(this.routerToken.resourceType) !== -1) {
      this.router.navigate([RouterConstants.ROUTE_MAINTAIN_HEIR_ADJUSTMENT]);
    }
  }
  navigateToThirdPartyAdjustments() {
    this.router.navigate([RouterConstants.ROUTE_THIRD_PARTY_ADJUSTMENTS]);
  }
  navigateToMaintainThirdPartyAdjustments() {
    this.router.navigate([RouterConstants.ROUTE_MAINTAIN_THIRD_PARTY_ADJUSTMENTS]);
  }
  navigateToPayments(resourceType: string) {
    if (resourceType === RouterConstants.TRANSACTION_ADJUSTMENT_REPAYMENT) {
      this.router.navigate([PaymentConstants.APPROVE_ADJUSTMENT_REPAYMENT]);
    } else if (resourceType === PaymentConstants.MISCELLANEOUS_PAYMENT) {
      this.router.navigate([PaymentConstants.ROUTE_VALIDATOR]);
    } else {
      this.router.navigate([RouterConstants.ROUTE_PAYMENTS]);
    }
  }
  /** Method to navgate to Violations Validator module. */
  navigateToViolations() {
    this.navigateToDomain(RouterConstants.ROUTE_VIOLATIONS);
  }
  navigateToAppeals() {
    this.navigateToDomain(RouterConstants.ROUTE_APPEALS);
  }
  private navigateToDomain(url: string) {
    this.router.navigate([url], { skipLocationChange: true });
  }
  private mbConveyanceAllowance(routerToken) {
    const payload = JSON.parse(routerToken.payload);
    if (
      routerToken.assignedRole === Role.FINANCIAL_CONTROLLER_ANN_ONE ||
      routerToken.assignedRole === Role.FINANCIAL_CONTROLLER_ANN_TWO ||
      routerToken.assignedRole === Role.OH_FCAPPROVER ||
      payload.assignedRole === Role.CNT_FC_APPROVER
    ) {
      switch (routerToken.resourceType) {
        case RouterConstants.MB_CONVEYANCE_ALLOWANCE:
          return true;
        default:
          return false;
      }
    }
  }
  private conveyanceAllowancembo(routerToken) {
    const payload = JSON.parse(routerToken.payload);
    if (
      (payload.assignedRole === Role.MEDICAL_OFFICER ||
        payload.assignedRole === Role.MS_OFFICER ||
        payload.assignedRole === Role.MEDICAL_BOARD_OFFICER ||
        payload.assignedRole === Role.MB_OFFICER ||
        payload.assignedRole === Role.MBO) &&
      this.routerToken.resourceType === RouterConstants.MB_CONVEYANCE_ALLOWANCE
    ) {
      return true;
    }
  }
  private reAssignRequestClarificationMB(routerToken) {
    const parsedPayload = JSON.parse(routerToken?.payload);
    if (parsedPayload?.previousOutcome === 'CAPTURED' && this.getMBResourceType(routerToken?.resourceType)) {
      return true;
    } else {
      return false;
    }
  }
  getMBResourceType(resourceType) {
    switch (resourceType) {
      case RouterConstants.TRANSACTION_CLOSE_INJURY:
      case RouterConstants.TRANSACTION_CLOSE_COMPLICATION:
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
      case RouterConstants.MB_BENEFIT_ASSESSMENT:
        return true;
      default:
        return false;
    }
  }
  forReassessmentActBehalf(routerToken) {
    const parsedPayload = JSON.parse(routerToken.payload);
    const reassessmentTransactionAct = [
      'Occupational Disability Reassessment',
      'Non-Occupational Disability Reassessment',
      'Non-Occupational Dependent Disability Reassessment',
      'Heir Disability Reassessment'
    ];
    if (
      reassessmentTransactionAct.findIndex(val => val === routerToken?.resourceType) > -1 &&
      parsedPayload?.previousOutcome === 'CAPTURED' &&
      routerToken?.content?.TXNElement?.Body?.contributorInitiatedFlag === true
    ) {
      return true;
    } else return false;
  }
  checkOnRequestClarification() {
    const parsedPayload = JSON.parse(this.routerToken?.payload);
    if (
      (this.routerToken.resourceType === WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR ||
        this.routerToken.resourceType === WorkFlowActions.ASSIGN_ASSESSMENT_TO_HO_DOCTOR) &&
      parsedPayload?.previousOutcome === WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR
    ) {
      return true;
    } else {
      return false;
    }
  }
}
