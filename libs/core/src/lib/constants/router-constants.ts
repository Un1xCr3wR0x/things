/**
 * This class is to declare route related details
 * @export
 * @class RouterConstants
 */
import { RouterConstantsBase } from './router-constants-base';
import { ViolationsType } from '../enums';
import { BenefitConstants } from '@gosi-ui/features/benefits/lib/shared';
export class RouterConstants extends RouterConstantsBase {
  static ROUTE_ESTABLISHMENT_INBOX: string;
  //Route to access establishment related features
  public static get ROUTE_ESTABLISHMENT(): string {
    return 'home/establishment/';
  }
  public static get ROUTE_OH(): string {
    return 'home/oh/validator';
  }
  public static get ROUTE_CONTRIBUTOR(): string {
    return 'home/contributor';
  }
  public static get ROUTE_VIOLATIONS(): string {
    return 'home/violations';
  }
  public static get ROUTE_MEDICAL_BOARD(): string {
    return 'home/medical-board';
  }
  public static get ROUTE_INBOX(): string {
    return '/home/transactions/list/worklist';
  }
  public static get ROUTE_ITSM_DETAILS() {
    return '/home/complaints/itsmdetails';
  }
  public static get ROUTE_BILLING(): string {
    return 'home/billing';
  }
  public static get ROUTE_VALIDATOR(): string {
    return 'home/validator';
  }
  public static get ROUTE_MANAGE_PERSON(): string {
    return 'home/profile';
  }
  public static get ROUTE_APPEALS(): string {
    return 'home/appeals/validator';
  }
  public static get TRANSACTION_ADD_IQAMA(): string {
    return 'IqamaNo-Update';
  }
  public static get TRANSACTION_ADD_PASSPORT(): string {
    return 'Add Passport';
  }
  public static get TRANSACTION_ADD_NIN(): string {
    return 'Add NIN';
  }
  public static get TRANSACTION_RPA_AGRFS(): string {
    return 'RPA_AGRFS';
  }
  public static get TRANSACTION_EDIT_NIN(): string {
    return 'Edit NIN';
  }
  public static get TRANSACTION_MODIFY_PERSONAL_DETAILS(): string {
    return 'Modify Personal Details';
  }

  public static get TRANSACTION_ADD_IQAMA_GCC(): string {
    return 'GCC-IqamaNo-Update';
  }
  public static get MODIFY_NATIONALITY(): string {
    return 'Modify Nationality Non Saudi to Non Saudi';
  }
  public static get MODIFY_NATIONALITY_OTHERS(): string {
    return 'Modify Nationality';
  }
  public static get TRANSACTION_ADD_BORDER(): string {
    return 'BorderNo-Update';
  }
  public static get TRANSACTION_ADD_BORDER_GCC(): string {
    return 'GCC-BorderNo-Update';
  }
  public static get TRANSACTION_REGISTER_ESTABLISHMENT(): string {
    return 'establishment';
  }
  public static get TRANSACTION_PROACTIVE_FEED(): string {
    return 'MOL-establishment';
  }
  public static get TRANSACTION_CHANGE_EST_BASIC_DETAILS(): string {
    return 'Establishment-basicDetails';
  }
  public static get TRANSACTION_CHANGE_EST_BANK_DETAILS(): string {
    return 'Establishment-bankDetails';
  }
  public static get TRANSACTION_CHANGE_EST_CONTACT_DETAILS(): string {
    return 'Establishment-contactDetails';
  }
  public static get TRANSACTION_CHANGE_EST_ADDRESS_DETAILS(): string {
    return 'Establishment-addressDetails';
  }
  public static get TRANSACTION_CHANGE_LEGAL_ENTITY(): string {
    return 'Establishment-legalEntityDetails';
  }
  public static get TRANSACTION_CHANGE_EST_IDENTIFIER_DETAILS(): string {
    return 'Establishment-identifier';
  }
  public static get TRANSACTION_CHANGE_MOF_PAYMENT_DETAILS(): string {
    return 'Establishment-paymentDetails';
  }
  public static get TRANSACTION_CHANGE_EST_OWNER(): string {
    return 'Establishment-manageOwner';
  }
  public static get TRANSACTION_REGISTER_GCC_ESTABLISHMENT(): string {
    return 'GCC-establishment';
  }
  public static get TRANSACTION_CHANGE_MAIN_ESTABLISHMENT(): string {
    return 'Establishment-branchToMainDetails';
  }
  public static get TRANSACTION_REPLACE_SUPER_ADMIN(): string {
    return 'Establishment-replaceAdmin';
  }
  public static get TRANSACTION_ADD_SUPER_ADMIN(): string {
    return 'Establishment-addBranchesAccountManager';
  }
  public static get TRANSACTION_ADD_GCC_ADMIN(): string {
    return 'Establishment-addGCCAccountManager';
  }
  public static get TRANSACTION_DELINK_ESTABLISHMENT(): string {
    return 'Establishment-deLinkBranchFromMain';
  }
  public static get TRANSACTION_LINK_ESTABLISHMENT(): string {
    return 'Establishment-LinkToAnotherEst';
  }
  public static get TRANSACTION_TERMINATE_ESTABLISHMENT(): string {
    return 'Establishment-Terminate';
  }
  public static get TRANSACTION_GOL_TERMINATE_ESTABLISHMENT(): string {
    return 'Establishment-GOLTerminate';
  }
  public static get TRANSACTION_FLAG_ESTABLISHMENT(): string {
    return 'Establishment-Flag';
  }
  public static get TRANSACTION_REOPEN_ESTABLISHMENT(): string {
    return 'Establishment-reopen';
  }
  public static get TRANSACTION_MODIFY_FLAG_ESTABLISHMENT(): string {
    return 'Establishment-ModifyFlag';
  }
  public static get TRANSACTION_INSPECTION(): string {
    return 'Inspection';
  }
  public static get TRANSACTION_LATE_FEE(): string {
    return 'Establishment-lateFeeChange';
  }
  public static get RASED_DOCUMENT_UPLOAD(): string {
    return 'Rased-DocumentUpload';
  }
  public static get TRANSACTION_SC_ADMIN_EVALUATION(): string {
    return 'Establishment-safetyCheckSelfEvaluation';
  }
  public static get REQUEST_MB_WITHDRAW(): number {
    return 101591;
  }
  public static get REQUEST_MB_APPEAL(): number {
    return 101590;
  }
  public static get TRANSACTIONS_MANAGE_PERSON(): string[] {
    return [
      RouterConstants.TRANSACTION_ADD_BORDER,
      RouterConstants.TRANSACTION_ADD_IQAMA,
      RouterConstants.TRANSACTION_ADD_IQAMA_GCC,
      RouterConstants.TRANSACTION_ADD_BORDER_GCC,
      RouterConstants.TRANSACTION_ADD_PASSPORT,
      RouterConstants.MODIFY_NATIONALITY,
      RouterConstants.TRANSACTION_ADD_NIN,
      RouterConstants.TRANSACTION_EDIT_NIN,
      RouterConstants.MODIFY_NATIONALITY_OTHERS
    ];
  }
  public static get TRANSACTIONS_ADJUSTMENTS_LIST(): string[] {
    return [
      this.TRANSACTION_ADJUSTMENTS,
      this.TRANSACTION_THIRD_PARTY_ADJUSTMENTS,
      RouterConstants.TRANSACTION_MAINTAIN_THIRD_PARTY_ADJUSTMENTS,
      RouterConstants.TRANSACTION_HEIR_ADJUSTMENT
    ];
  }
  public static get TRANSACTIONS_ADJUSTMENTS(): string[] {
    return [RouterConstants.TRANSACTION_ADJUSTMENTS];
  }
  public static get TRANSACTIONS_HEIR_ADJUSTMENTS(): string[] {
    return [RouterConstants.TRANSACTION_HEIR_ADJUSTMENT];
  }
  public static get TRANSACTIONS_ADD_THIRD_PARTY_ADJUSTMENTS(): string[] {
    return [this.TRANSACTION_THIRD_PARTY_ADJUSTMENTS];
  }
  public static get TRANSACTIONS_MAINTAIN_THIRD_PARTY_ADJUSTMENTS(): string[] {
    return [RouterConstants.TRANSACTION_MAINTAIN_THIRD_PARTY_ADJUSTMENTS];
  }
  public static get TRANSACTIONS_PAYMENTS(): string[] {
    return [RouterConstants.TRANSACTION_PAYMENTS_MISCELLANEOUS, RouterConstants.TRANSACTION_ADJUSTMENT_REPAYMENT];
  }
  public static get TRANSACTIONS_UNDER_ESTABLISHMENT(): string[] {
    return [
      this.TRANSACTION_REGISTER_ESTABLISHMENT,
      this.TRANSACTION_CHANGE_EST_BASIC_DETAILS,
      this.TRANSACTION_CHANGE_EST_IDENTIFIER_DETAILS,
      this.TRANSACTION_CHANGE_EST_BANK_DETAILS,
      this.TRANSACTION_CHANGE_EST_OWNER,
      this.TRANSACTION_REGISTER_GCC_ESTABLISHMENT,
      this.TRANSACTION_CHANGE_EST_CONTACT_DETAILS,
      this.TRANSACTION_CHANGE_EST_ADDRESS_DETAILS,
      this.TRANSACTION_CHANGE_LEGAL_ENTITY,
      this.TRANSACTION_CHANGE_MAIN_ESTABLISHMENT,
      this.TRANSACTION_DELINK_ESTABLISHMENT,
      this.TRANSACTION_LINK_ESTABLISHMENT,
      this.TRANSACTION_REPLACE_SUPER_ADMIN,
      this.TRANSACTION_REPLACE_GCC_ADMIN,
      this.TRANSACTION_LINK_ESTABLISHMENT,
      this.TRANSACTION_TERMINATE_ESTABLISHMENT,
      this.TRANSACTION_GOL_TERMINATE_ESTABLISHMENT,
      this.TRANSACTION_FLAG_ESTABLISHMENT,
      this.TRANSACTION_MODIFY_FLAG_ESTABLISHMENT,
      this.TRANSACTION_INSPECTION,
      this.TRANSACTION_LATE_FEE,
      this.TRANSACTION_ADD_SUPER_ADMIN,
      this.TRANSACTION_PROACTIVE_FEED,
      this.RASED_DOCUMENT_UPLOAD,
      this.TRANSACTION_CHANGE_MOF_PAYMENT_DETAILS,
      this.TRANSACTION_ADD_GCC_ADMIN,
      this.TRANSACTION_REOPEN_ESTABLISHMENT,
      this.TRANSACTION_SC_ADMIN_EVALUATION
    ];
  }
  public static get TRANSACTIONS_UNDER_CONTRIBUTOR(): string[] {
    return [
      this.TRANSACTION_UPDATE_WAGE,
      this.TRANSACTION_CONTRIBUTOR,
      this.TRANSACTION_ENGAGEMENT,
      this.TRANSACTION_CHANGE_ENGAGEMENT,
      this.TRANSACTION_REACTIAVTE_ENGAGEMENT,
      this.TRANSACTION_CANCEL_RPA,
      this.TRANSACTION_CANCEL_RPA_FIRST_SCHEME,
      this.TRANSACTION_CANCEL_RPA_LAST_SCHEME,
      this.TRANSACTION_REACTIVATE_VIC_ENGAGEMENT,
      this.TRANSACTION_NON_SAUDI,
      this.TRANSACTION_MOL_ENGAGEMENT,
      this.TRANSACTION_SPECIAL_FOREIGNER,
      this.TRANSACTION_IMMIGRATED,
      this.TRANSACTION_GCC,
      this.TRANSACTION_TERMINATE_ENGAGEMENT,
      this.TRANSACTION_REGISTER_SECONDMENT,
      this.TRANSACTION_TERMINATE_STUDYLEAVE_ENGAGEMENT,
      this.TRANSACTION_ADD_CONTRACT,
      this.TRANSACTION_MANAGE_COMPLIANCE,
      this.INSPECTION_CANCEL_ENGAGEMENT,
      this.TRANSACTION_CANCEL_CONTRACT,
      this.TRANSACTION_CANCEL_ENGAGEMENT,
      this.TRANSACTION_ADD_SECONDED,
      this.TRANSACTION_TRANSFER_INDIVIDUAL_CONTRIBUTOR,
      this.TRANSACTION_TRANSFER_ALL_CONTRIBUTOR,
      this.TRANSACTION_BULK_WAGE_UPDATE,
      this.TRANSACTION_ADD_VIC,
      this.TRANSACTION_MANAGE_VIC,
      this.TRANSACTION_TERMINATE_VIC,
      this.TRANSACTION_CANCEL_VIC,
      this.TRANSACTION_VIOLATE_ENGAGEMENT,
      this.TRANSACTION_ADD_AUTHORIZATION_MOJ,
      this.TRANSACTION_SPECIAL_RESIDENTS,
      this.TRANSACTION_ADD_AUTHORIZATION_EXTERNAL,
      this.TRANSACTION_REGISTER_BACKDATED_ENGAGEMENT,
      this.TRANSACTION_MODIFY_COVERAGE,
      this.TRANSACTION_E_REGISTER_COMPLIANCE,
      this.TRANSACTION_E_REGISTER_PPA,
      this.TRANSACTION_ENTER_RPA_firstScheme,
      this.TRANSACTION_ENTER_RPA_lastScheme,
      this.TRANSACTION_RPA_AGRFS
    ];
  }
  public static get TRANSACTIONS_UNDER_INDIVIDUAL_APP(): string[] {
    return [this.TRANSACTION_CONTRACT_AUTHENTICATION];
  }
  public static get TRANSACTIONS_UNDER_VIOLATIONS(): string[] {
    return [
      ViolationsType.TRANSACTION_INCORRECT_TERMINATION,
      ViolationsType.TRANSACTION_INCORRECT_WAGE,
      ViolationsType.TRANSACTION_MODIFY_JOINING_DATE,
      ViolationsType.TRANSACTION_ADD_NEW_ENGAGEMENT,
      ViolationsType.TRANSACTION_CANCEL_ENGAGEMENT,
      ViolationsType.TRANSACTION_MODIFY_LEAVING_DATE,
      ViolationsType.TRANSACTION_MODIFY_VIOLATION,
      ViolationsType.TRANSACTION_CANCEL_VIOLATION,
      ViolationsType.TRANSACTION_RAISE_VIOLATION,
      ViolationsType.TRANSACTION_WRONG_BENEFITS,
      ViolationsType.TRANSACTION_OTHER_VIOLATION,
      ViolationsType.TRANSACTION_APPEAL_ON_VIOLATION,
      ViolationsType.TRANSACTION_INJURY_VIOLATION
    ];
  }
  public static get TRANSACTIONS_UNDER_MEDICAL_BOARD(): string[] {
    return [
      this.TRANSACTION_ADD_MEMBER,
      this.TRANSACTION_MODIFY_CONTRACT,
      this.TRANSACTION_TERMINATE_CONTRACT,
      this.TRANSACTION_MB_DISABILITY_ASSESSMENT,
      this.TRANSACTION_MB_DISABILITY_REASSESSMENT,
      this.TRANSACTION_MB_NON_OCC_DISABILITY_ASSESSMENT,
      this.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT,
      this.TRANSACTION_MB_ASSIGN_SESSION_MBO,
      this.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR,
      this.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT,
      this.TRANSACTION_REQUEST_CLARIFICATION_FROM_CONTRIBUTOR,
      this.TRANSACTION_MB_NON_OCC_ASSESSMENT,
      this.TRANSACTION_MB_APPOINTMENT_REMINDER,
      this.ESIGN_TRANSACTION,
      this.CLARIFICATION_FROM_CONTRIBUTOR,
      this.TRANSACTION_EARLY_REASSESSMENT,
      this.TRANSACTION_ASSIGN_TO_HO,
      this.TRANSACTION_ASSIGN_APPEAL,
      this.ASSIGN_PARTICIPANT_TO_SESSION,
      this.MB_BENEFIT_ASSESSMENT
    ];
  }
  public static get TRANSACTIONS_UNDER_OH(): string[] {
    return [
      this.TRANSACTION_INJURY,
      this.TRANSACTION_ADD_INJURY,
      this.TRANSACTION_COMPLICATION,
      this.TRANSACTION_REJECTION_INJURY,
      this.TRANSACTION_REJECTION_INJURY_TPA,
      this.TRANSACTION_VALIDATE_REIMBURSMENT,
      this.TRANSACTION_REJECT_COMPLICATION_TPA,
      this.TRANSACTION_REJECT_COMPLICATION,
      this.TRANSACTION_MODIFY_INJURY,
      this.TRANSACTION_CLOSE_INJURY,
      this.TRANSACTION_CLOSE_COMPLICATION,
      this.TRANSACTION_MODIFY_COMPLICATION,
      this.TRANSACTION_REOPEN_INJURY,
      this.TRANSACTION_REOPEN_COMPLICATION,
      this.TRANSACTION_ADD_COMPLICATION,
      this.TRANSACTION_REIMBURSEMENT_CLAIM,
      this.TRANSACTION_ADD_ALLOWANCE,
      this.TRANSACTION_ADD_DEADBODY_CLAIMS,
      this.TRANSACTION_ADD_DIABILITY_CLAIMS,
      this.TRANSACTION_ALLOWANCE_PAYEE,
      this.HOLD_ALLOWANCE,
      this.RESUME_ALLOWANCE,
      this.TRANSACTION_INITIATE_PAYMENT,
      this.TRANSACTION_AUDITOR,
      this.TRANSACTION_ALLOWANCE_AUDITOR,
      this.TRANSACTION_VALIDATE_REIMBURSMENT,
      this.TRANSACTION_INITIATE_INJURY_ALLOWANCE_AUDITOR,
      this.TRANSACTION_ADD_TRANSFER_INJURY,
      this.TRANSACTION_ADD_DISEASE,
      this.TRANSACTION_REOPEN_DISEASE,
      this.TRANSACTION_CLOSE_DISEASE,
      this.TRANSACTION_DISEASE_COMPLICATION
      
    ];
  }
  public static get TRANSACTIONS_UNDER_BILLING(): string[] {
    return [
      this.TRANSACTION_RECEIVE_CONTRIBUTION,
      this.TRANSACTION_RECEIVE_CONTRIBUTION_GCC,
      this.TRANSACTION_RECEIVE_CONTRIBUTION_MOF,
      this.TRANSACTION_EVENT_DATE,
      this.TRANSACTION_CANCEL_RECEIPT,
      this.TRANSACTION_WAIVE_ESTABLISHMENT_PENALTY,
      this.TRANSACTION_EXCEPTIONAL_ESTABLISHMENT_PENALTY,
      this.TRANSACTION_VIC_EXCEPTIONAL_ESTABLISHMENT_PENALTY,
      this.TRANSACTION_VIC_EXCEPTIONAL_BULK_PENALTY,
      this.TRANSACTION_ESTABLISHMENT_EXCEPTIONAL_BULK_PENALTY,
      this.TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY,
      this.TRANSACTION_CREDIT_MANAGEMENT,
      this.TRANSACTION_WAIVE_LATE_FEE_VIOLATION,
      this.TRANSACTION_CREDIT_REFUND_TARNSFER,
      this.TRANSACTION_CREDIT_REFUND_VIC_TARNSFER,
      this.TRANSACTION_CONTRIBUTOR_REFUND_TARNSFER,
      this.TRANSACTION_CANCEL_RECEIPT,
      this.TRANSACTION_WAIVE_ESTABLISHMENT_PENALTY,
      this.TRANSACTION_EXCEPTIONAL_ESTABLISHMENT_PENALTY,
      this.TRANSACTION_VIC_EXCEPTIONAL_ESTABLISHMENT_PENALTY,
      this.TRANSACTION_VIC_EXCEPTIONAL_BULK_PENALTY,
      this.TRANSACTION_ESTABLISHMENT_EXCEPTIONAL_BULK_PENALTY,
      this.TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY,
      this.TRANSACTION_CREDIT_MANAGEMENT,
      this.TRANSACTION_CREDIT_REFUND_TARNSFER,
      this.TRANSACTION_CREDIT_REFUND_VIC_TARNSFER,
      this.TRANSACTION_CONTRIBUTOR_REFUND_TARNSFER,
      this.TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY_EVENT_DATE,
      this.TRANSACTION_INSTALLMENT,
      this.TRANSACTION_MISCELLANEOUS
    ];
  }
  public static get TRANSACTIONS_UNDER_BENEFIT(): string[] {
    return [
      this.TRANSACTION_APPROVE_SANED,
      this.TRANSACTION_WOMEN_LUMPSUM,
      this.TRANSACTION_RETIREMENT_LUMPSUM,
      this.TRANSACTION_RETIREMENT_PENSION,
      this.TRANSACTION_EARLY_RETIREMENT_PENSION,
      this.TRANSACTION_NON_OCC_BENEFIT,
      this.TRANSACTION_NON_OCC_LUMPSUM,
      this.TRANSACTION_NON_OCC_PENSION,
      this.TRANSACTION_JAILED_PENSION,
      this.TRANSACTION_JAILED_LUMPSUM,
      this.TRANSACTION_HAZARDOUS_PENSION,
      this.TRANSACTION_HAZARDOUS_LUMPSUM,
      this.TRANSACTION_HEIR_PENSION,
      this.TRANSACTION_HEIR_LUMPSUM,
      this.TRANSACTION_MODIFY_BENEFIT,
      this.TRANSACTION_REGISTER_HEIR,
      this.TRANSACTION_REPAY_BENEFIT,
      this.TRANSACTION_HOLD_BENEFIT,
      this.TRANSACTION_OCC_LUMPSUM,
      this.TRANSACTION_OCC_PENSION,
      this.TRANSACTION_BENEFIT_ADJUSTMENT,
      this.TRANSACTION_UI_BENEFIT_ADJUSTMENT,
      this.TRANSACTION_MODIFY_PAYEE,
      this.TRANSACTION_FUNERAL_GRANT,
      this.HOLD_RETIREMENT_PENSION_BENEFIT,
      this.TRANSACTION_STOP_BENEFIT,
      this.TRANSACTION_RESTART_BENEFIT,
      this.TRANSACTION_MODIFY_BANK_ACCOUNT,
      this.TRANSACTION_UI_MODIFY_BANK_ACCOUNT,
      this.TRANSACTION_REMOVE_BANK_COMMITMENT,
      this.TRANSACTION_RPA_LUMPSUM,
      this.TRANSACTION_SUSPEND_SANED,
      this.TRANSACTION_HEIR_PROACTIVE,
      this.LINK_CONTRIBUTOR,
      this.TRANSACTION_HEIR_MISCELLANEUOS_PAYMENT,
      this.TRANSACTION_BENEFIT_PROACTIVE_SANED,
      this.TRANSACTION_BENEFIT_PROACTIVE_RETIREMENT_LUMPSUM
    ];
  }

  public static get TRANSACTIONS_UNDER_APPEALS(): string[] {
    return [this.PUBLIC_SECTOR_APPEAL, this.PRIVATE_SECTOR_APPEAl, this.TRANSACTION_GENERAL_APPEAL];
  }
  public static get TRANSACTION_HEIR_PROACTIVE(): string {
    return 'request heir benefit';
  }
  public static get TRANSACTION_OCC_PENSION(): string {
    return 'request occupational pension benefit';
  }
  public static get TRANSACTION_OCC_LUMPSUM(): string {
    return 'request occupational lumpsum benefit';
  }
  public static get TRANSACTION_APPROVE_SANED(): string {
    return 'request unemployment';
  }
  public static get TRANSACTION_WOMEN_LUMPSUM(): string {
    return 'request woman lumpsum';
  }
  public static get TRANSACTION_RETIREMENT_LUMPSUM(): string {
    return 'request retirement lumpsum';
  }
  public static get TRANSACTION_RETIREMENT_PENSION(): string {
    return 'request retirement pension';
  }
  public static get TRANSACTION_EARLY_RETIREMENT_PENSION(): string {
    return 'request early retirement pension';
  }
  public static get TRANSACTION_NON_OCC_BENEFIT(): string {
    return 'request non occupational disability benefit';
  }
  public static get TRANSACTION_NON_OCC_LUMPSUM(): string {
    return 'request non occupational disability lumpsum benefit';
  }
  public static get TRANSACTION_NON_OCC_PENSION(): string {
    return 'request non occupational disability pension benefit';
  }
  public static get TRANSACTION_JAILED_PENSION(): string {
    return 'request jailed contributor pension benefit';
  }
  public static get TRANSACTION_JAILED_LUMPSUM(): string {
    return 'request jailed contributor lumpsum benefit';
  }
  public static get TRANSACTION_HAZARDOUS_PENSION(): string {
    return 'request retirement pension benefit (hazardous occupation)';
  }
  public static get TRANSACTION_HAZARDOUS_LUMPSUM(): string {
    return 'request retirement lumpsum benefit (hazardous occupation)';
  }
  public static get TRANSACTION_RPA_LUMPSUM(): string {
    return 'request - moved to public pension lumpsum (rpa) benefit';
  }
  public static get TRANSACTION_HEIR_PENSION(): string {
    return 'request heir pension benefit';
  }
  public static get TRANSACTION_HEIR_LUMPSUM(): string {
    return 'request heir lumpsum benefit';
  }
  public static get TRANSACTION_MODIFY_BENEFIT(): string {
    return 'modify benefit';
  }
  public static get TRANSACTION_WAIVE_LATE_FEE_VIOLATION(): string {
    return 'penalty-waiver-gosi-initiative';
  }
  public static get TRANSACTION_MODIFY_PAYEE(): string {
    return 'modify payee';
  }
  public static get TRANSACTION_FUNERAL_GRANT(): string {
    return 'funeral grant';
  }
  public static get TRANSACTION_STOP_BENEFIT(): string {
    return 'stop benefit';
  }
  public static get TRANSACTION_RESTART_BENEFIT(): string {
    return 'restart benefit';
  }
  public static get TRANSACTION_HEIR_MISCELLANEUOS_PAYMENT(): string {
    return 'heir miscellaneous payment';
  }
  public static get TRANSACTION_MODIFY_BANK_ACCOUNT(): string {
    return 'modify bank account';
  }
  public static get TRANSACTION_UI_MODIFY_BANK_ACCOUNT(): string {
    return 'ui modify bank account';
  }
  public static get TRANSACTION_NON_OCC_DISABILITY_REASSESSMENT(): string {
    return 'Non-Occupational Disability Reassessment';
  }
  public static get TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT(): string {
    return 'Non-Occupational Dependent Disability Reassessment';
  }
  public static get TRANSACTION_OCC_DISABILITY_REASSESSMENT(): string {
    return 'Occupational Disability Reassessment';
  }
  public static get TRANSACTION_HEIR_DISABILITY_REASSESSMENT(): string {
    return 'Heir Disability Reassessment';
  }
  public static get ROUTE_CONTRIBUTOR_REASSESSMENT(): string {
    return '/home/oh/reassessment';
  }
  public static get TRANSACTION_REMOVE_BANK_COMMITMENT(): string {
    return 'remove bank commitment';
  }
  public static get TRANSACTION_REGISTER_HEIR(): string {
    return 'register heir';
  }
  public static get TRANSACTION_REPAY_BENEFIT(): string {
    return 'repay benefit';
  }
  public static get TRANSACTION_HOLD_BENEFIT(): string {
    return 'hold benefit';
  }
  public static get HOLD_RETIREMENT_PENSION_BENEFIT(): string {
    return 'hold benefit';
  }
  public static get ROUTE_DASHBOARD(): string {
    return '/dashboard';
  }
  public static get ROUTE_COMPLICATION(): string {
    return '/home/oh/complication';
  }
  /* Medical Board workflows */
  public static get TRANSACTION_ADD_MEMBER(): string {
    return 'register contract';
  }
  public static get TRANSACTION_MODIFY_CONTRACT(): string {
    return 'update contract';
  }
  public static get TRANSACTION_ASSIGN_APPEAL(): string {
    return 'Appeal Assessment';
  }
  public static get TRANSACTION_TERMINATE_CONTRACT(): string {
    return 'terminate contract';
  }
  /* Contributor workflows */
  public static get TRANSACTION_ENGAGEMENT(): string {
    return 'engagement';
  }
  public static get TRANSACTION_SPECIAL_FOREIGNER(): string {
    return 'Special Foreign Contributor';
  }
  public static get TRANSACTION_SPECIAL_RESIDENTS(): string {
    return 'Premium Residents Contributor';
  }
  public static get TRANSACTION_NON_SAUDI(): string {
    return 'Non Saudi Contributor';
  }
  public static get TRANSACTION_GCC(): string {
    return 'GCC Contributor';
  }
  public static get TRANSACTION_IMMIGRATED(): string {
    return 'Immigrated Tribe Contributor';
  }
  public static get TRANSACTION_MOL_ENGAGEMENT(): string {
    return 'MOL-engagement';
  }
  public static get TRANSACTION_UPDATE_WAGE(): string {
    return 'Update Wage';
  }
  public static get TRANSACTION_ADD_SECONDED(): string {
    return 'Register Seconded';
  }
  public static get TRANSACTION_CHANGE_ENGAGEMENT(): string {
    return 'change engagement';
  }
  public static get TRANSACTION_TERMINATE_ENGAGEMENT(): string {
    return 'terminate engagement';
  }
  public static get TRANSACTION_ENTER_RPA_firstScheme(): string {
    return 'Enter Rpa First Scheme';
  }
  public static get TRANSACTION_ENTER_RPA_lastScheme(): string {
    return 'Enter Rpa Last Scheme';
  }
  public static get TRANSACTION_CANCEL_RPA(): string {
    return 'Cancel Rpa';
  }
  public static get TRANSACTION_CANCEL_RPA_FIRST_SCHEME(): string {
    return 'Cancel Rpa First Scheme';
  }
  public static get TRANSACTION_CANCEL_RPA_LAST_SCHEME(): string {
    return 'Cancel Rpa Last Scheme';
  }
  public static get TRANSACTION_REGISTER_SECONDMENT(): string {
    return 'Register Secondment';
  }
  public static get TRANSACTION_TERMINATE_STUDYLEAVE_ENGAGEMENT(): string {
    return 'Register study leave';
  }
  public static get TRANSACTION_CANCEL_ENGAGEMENT(): string {
    return 'cancel engagement';
  }
  public static get TRANSACTION_REACTIAVTE_ENGAGEMENT(): string {
    return 'Reactivate engagement';
  }
  public static get TRANSACTION_REACTIVATE_VIC_ENGAGEMENT(): string {
    return 'Reactivate VIC engagement';
  }
  public static get TRANSACTION_CONTRIBUTOR(): string {
    return 'contributor';
  }
  public static get TRANSACTION_TRANSFER_INDIVIDUAL_CONTRIBUTOR(): string {
    return 'transfer engagement';
  }
  public static get TRANSACTION_ADD_CONTRACT(): string {
    return 'Add Contract';
  }
  public static get TRANSACTION_E_REGISTER_COMPLIANCE(): string {
    return 'Violate e-register';
  }
  public static get TRANSACTION_E_REGISTER_PPA(): string {
    return 'PPA e-register';
  }
  public static get TRANSACTION_CONTRACT_AUTHENTICATION(): string {
    return 'Contract Authentication';
  }
  public static get TRANSACTION_MANAGE_COMPLIANCE(): string {
    return 'Violate engagement';
  }
  public static get TRANSACTION_CANCEL_CONTRACT(): string {
    return 'Cancel Contract';
  }
  public static get INSPECTION_CANCEL_ENGAGEMENT(): string {
    return 'Inspection Cancel Contract';
  }
  public static get TRANSACTION_TRANSFER_ALL_CONTRIBUTOR(): string {
    return 'transfer all engagements';
  }
  public static get TRANSACTION_BULK_WAGE_UPDATE(): string {
    return 'bulk wage update';
  }
  public static get TRANSACTION_ADD_VIC(): string {
    return 'VIC-engagement';
  }
  public static get TRANSACTION_MANAGE_VIC(): string {
    return 'Manage VIC';
  }
  public static get TRANSACTION_TERMINATE_VIC(): string {
    return 'terminate VIC engagement';
  }
  public static get TRANSACTION_CANCEL_VIC(): string {
    return 'cancel VIC engagement';
  }
  public static get TRANSACTION_MODIFY_COVERAGE(): string {
    return 'Modify coverage details';
  }
  public static get ROUTE_INJURY_REJECT_VIEW(): string {
    return 'home/oh/injury/:registrationNo/:socialInsuranceNo/:injuryId/reject';
  }
  /** Billing Feature Transactions. */
  public static get TRANSACTION_RECEIVE_CONTRIBUTION(): string {
    return 'receive-contribution';
  }
  public static get TRANSACTION_RECEIVE_CONTRIBUTION_GCC(): string {
    return 'receive-contribution-GCC';
  }
  public static get TRANSACTION_RECEIVE_CONTRIBUTION_MOF(): string {
    return 'receive-contribution-MOF';
  }
  public static get TRANSACTION_EVENT_DATE(): string {
    return 'maintain-event-date';
  }
  public static get TRANSACTION_CANCEL_RECEIPT(): string {
    return 'cancel-receipt';
  }
  public static get TRANSACTION_VIOLATE_ENGAGEMENT(): string {
    return 'Violate engagement';
  }
  public static get TRANSACTION_REGISTER_BACKDATED_ENGAGEMENT(): string {
    return 'Register BackDated Engagement';
  }
  public static get TRANSACTION_WAIVE_ESTABLISHMENT_PENALTY(): string {
    return 'penalty-waiver-est';
  }
  public static get TRANSACTION_CREDIT_MANAGEMENT(): string {
    return 'credit-transfer';
  }
  public static get TRANSACTION_EXCEPTIONAL_ESTABLISHMENT_PENALTY(): string {
    return 'spcl-penalty-waiver-est';
  }
  public static get TRANSACTION_VIC_EXCEPTIONAL_ESTABLISHMENT_PENALTY(): string {
    return 'spcl-penalty-waiver-vic';
  }
  public static get TRANSACTION_CREDIT_REFUND_TARNSFER(): string {
    return 'credit-refund-est';
  }
  public static get TRANSACTION_CREDIT_REFUND_VIC_TARNSFER(): string {
    return 'credit-refund-vic';
  }
  public static get TRANSACTION_CONTRIBUTOR_REFUND_TARNSFER(): string {
    return 'credit-refund-cont';
  }
  public static get TRANSACTION_ESTABLISHMENT_EXCEPTIONAL_BULK_PENALTY(): string {
    return 'bulk-penalty-waiver-est';
  }
  public static get TRANSACTION_VIC_EXCEPTIONAL_BULK_PENALTY(): string {
    return 'bulk-penalty-waiver-vic';
  }
  public static get TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY(): string {
    return 'bulk-penalty-waiver-all';
  }
  public static get TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY_EVENT_DATE(): string {
    return 'bulk-penalty-waiver-event-date';
  }
  public static get TRANSACTION_INSTALLMENT(): string {
    return 'establishment-installment';
  }
  public static get TRANSACTION_MISCELLANEOUS(): string {
    return 'est-misc-adjustment';
  }
  public static get ROUTE_VALIDATOR_BILLING(): string {
    return 'home/billing/validator';
  }
  public static get ROUTE_INDIVIDUAL_APP_CONTRACT_AUTH(): string {
    return 'home/contributor';
  }
  public static get ROUTE_INDIVIDUAL_CONTRACT_AUTH(): string {
    return '/home/contributor/contract/individual-contract-auth';
  }
  //Route to benefit ui validator.
  public static get ROUTE_BENEFIT_UI(): string {
    return 'home/benefits/individual';
  }
  public static get ROUTE_BENEFIT(): string {
    return 'home/benefits';
  }
  public static ROUTE_BENEFIT_LIST(sin: number): string {
    return `home/profile/individual/internal/${sin}/benefits`;
  }
  public static ROUTE_PROFILE(identifier): string {
    return `home/profile/individual/internal/${identifier}/personal-details`;
  }
  public static ROUTE_INDIVIDUAL(identifier): string {
    return `home/profile/individual/internal/${identifier}`;
  }
  public static get ROUTE_ADJUSTMENTS(): string {
    return 'home/adjustment/validator/view';
  }
  public static get ROUTE_MAINTAIN_HEIR_ADJUSTMENT(): string {
    return 'home/adjustment/validator/heir-adjustment';
  }
  public static get ROUTE_THIRD_PARTY_ADJUSTMENTS(): string {
    return 'home/adjustment/validator/tpaView';
  }
  public static get ROUTE_MAINTAIN_THIRD_PARTY_ADJUSTMENTS(): string {
    return 'home/adjustment/validator/maintainTpaView';
  }
  public static get ROUTE_PAYMENTS(): string {
    return 'home/payment';
  }
  public static get ROUTE_TODOLIST(): string {
    return '/home/transactions/list/todolist';
  }
  /*Injury Transcations */
  public static get TRANSACTION_INJURY(): string {
    return 'injury';
  }
  public static get TRANSACTION_COMPLICATION(): string {
    return 'complication';
  }
  public static get TRANSACTION_REJECTION_INJURY(): string {
    return 'OH Rejection Injury';
  }
  public static get TRANSACTION_REJECTION_INJURY_TPA(): string {
    return 'OH Rejection Injury TPA';
  }
  public static get TRANSACTION_ADD_INJURY(): string {
    return 'Injury';
  }
  public static get ALLOWANCE_AUDITOR_FLOW(): string {
    return 'Initiate Allowance Auditor Workflow';
  }
  public static get TRANSACTION_REJECT_INJURY(): string {
    return 'OH Rejection Injury';
  }
  public static get TRANSACTION_REJECT_COMPLICATION(): string {
    return 'OH Rejection Complication';
  }
  public static get TRANSACTION_REJECT_INJURY_TPA(): string {
    return 'OH Rejection Injury TPA';
  }
  public static get TRANSACTION_REJECT_COMPLICATION_TPA(): string {
    return 'OH Rejection Complication TPA';
  }
  public static get TRANSACTION_MODIFY_INJURY(): string {
    return 'Modify Injury';
  }
  public static get TRANSACTION_CLOSE_INJURY(): string {
    return 'Close Injury TPA';
  }
  public static get TRANSACTION_CLOSE_COMPLICATION(): string {
    return 'Close Complication TPA';
  }
  public static get TRANSACTION_MODIFY_COMPLICATION(): string {
    return 'Modify Complication';
  }
  public static get TRANSACTION_REOPEN_INJURY(): string {
    return 'OH Reopen Injury';
  }
  public static get TRANSACTION_REOPEN_DISEASE(): string {
    return 'Reopen Disease';
  }
  public static get TRANSACTION_CLOSE_DISEASE(): string {
    return 'Close Disease TPA'
  }
  public static get TRANSACTION_REOPEN_COMPLICATION(): string {
    return 'Reopen Complication';
  }
  public static get TRANSACTION_ALLOWANCE_PAYEE(): string {
    return 'Update OH Allowance Payee';
  }
  public static get TRANSACTION_ADD_COMPLICATION(): string {
    return 'Complication';
  }
  public static get TRANSACTION_DISEASE_COMPLICATION(): string {
    return 'Add Disease Complication';
  }
  public static get TRANSACTION_ADD_ALLOWANCE(): string {
    return 'Add allowance';
  }
  public static get TRANSACTION_ADD_TRANSFER_INJURY(): string {
    return 'Transfer Injury';
  } 
  public static get TRANSACTION_ADD_DISEASE(): string {
    return 'Disease';
  } 
  public static get TRANSACTION_REIMBURSEMENT_CLAIM(): string {
    return 'REIMBURSEMENT_CLAIM';
  }
  public static get TRANSACTION_ADD_DEADBODY_CLAIMS(): string {
    return 'Add dead body repatriation';
  }
  public static get TRANSACTION_ADD_DIABILITY_CLAIMS(): string {
    return 'Add total disability repatriation';
  }
  public static get HOLD_ALLOWANCE(): string {
    return 'Hold Allowance';
  }
  public static get RESUME_ALLOWANCE(): string {
    return 'Resume Allowance';
  }
  public static get TRANSACTION_INITIATE_PAYMENT(): string {
    return 'Initiate Invoice Payment';
  }
  public static get TRANSACTION_AUDITOR(): string {
    return 'Initiate Auditor Workflow';
  }
  public static get TRANSACTION_VALIDATE_REIMBURSMENT(): string {
    return 'Validate Reimbursement';
  }
  public static get TRANSACTION_ALLOWANCE_AUDITOR(): string {
    return 'Initiate Allowance Auditor Workflow';
  }
  public static get TRANSACTION_ADJUSTMENTS(): string {
    return 'Adjustment Modification';
  }
  public static get TRANSACTION_HEIR_ADJUSTMENT(): string {
    return 'Heir Adjustment Modification';
  }
  public static get TRANSACTION_THIRD_PARTY_ADJUSTMENTS(): string {
    return 'Third Party Adjustment Modification';
  }
  public static get TRANSACTION_MAINTAIN_THIRD_PARTY_ADJUSTMENTS(): string {
    return 'Modify Third Party Adjustment';
  }
  public static get TRANSACTION_PAYMENTS_MISCELLANEOUS(): string {
    return 'Miscellaneous Payment';
  }
  public static get TRANSACTION_ADJUSTMENT_REPAYMENT(): string {
    return 'Adjustment Repayment';
  }
  public static get ROUTE_NOT_FOUND(): string {
    return '/home/error';
  }
  public static get ROUTE_HOME(): string {
    return '/home';
  }
  public static ROUTE_MISSING_ADMIN_DETAILS(registrationNo: number, adminId: number) {
    return `/complete-admin/establishment/admin/${registrationNo}/missing-details/${adminId}`;
  }
  public static get TRANSACTION_BENEFIT_ADJUSTMENT(): string {
    return 'benefit adjustment';
  }
  public static get TRANSACTION_BENEFIT_SANED(): string {
    return 'Benefit Adjustment';
  }
  public static get TRANSACTION_UI_BENEFIT_ADJUSTMENT(): string {
    return 'ui benefit adjustment';
  }
  public static get UI_BENEFIT_ADJUSTMENT(): string {
    return 'UI Benefit Adjustment';
  }
  public static get ROUTE_MODIFY_BENEFIT_PAYMENT(): string {
    return 'home/benefits/annuity/modify-benefit';
  }
  public static get TRANSACTION_ADD_AUTHORIZATION_MOJ(): string {
    return 'addAuthorizationMOJ';
  }
  public static get TRANSACTION_ADD_AUTHORIZATION_EXTERNAL(): string {
    return 'addAuthorizationExternal';
  }
  public static get TRANSACTION_SUSPEND_SANED(): string {
    return 'Suspend Unemployment'.toLowerCase();
  }
  public static get TRANSACTION_GENERAL_APPEAL(): string {
    return 'Appeal On Violation';
  }
  public static get PRIVATE_SECTOR_APPEAl(): string {
    return 'Private Sector Appeal';
  }
  public static get PUBLIC_SECTOR_APPEAL(): string {
    return 'Public Sector Appeal';
  }
  public static get TRANSACTION_INITIATE_INJURY_ALLOWANCE_AUDITOR(): string {
    return 'Initiate Injury Allowance Auditor Workflow';
  }
  public static get LINK_CONTRIBUTOR(): string {
    return 'link contributor';
  }

  public static get ROUTE_OH_DISABILITY_ASSESSMENT(): string {
    return `/home/medical-board/disability-assessment/create`;
  }
  public static get TRANSACTION_MB_DISABILITY_ASSESSMENT(): string {
    return 'Assign MB Officer';
  }
  public static get TRANSACTION_MB_APPOINTMENT_REMINDER(): string {
    return 'Reminder to schedule a Medical Board appointment';
  }
  public static get TRANSACTION_MB_DISABILITY_REASSESSMENT(): string {
    return 'Reassessment';
  }
  public static get TRANSACTION_MB_NON_OCC_DISABILITY_ASSESSMENT(): string {
    return 'Benefit Disability Assessment';
  }
  public static get TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT(): string {
    return 'Heir Disability Assessment';
  }
  public static get TRANSACTION_MB_ASSIGN_SESSION_MBO(): string {
    return 'Assign Session to MBO';
  }
  public static get TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR(): string {
    return 'Assign Assessment to GOSI Doctor';
  }
  public static get TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT(): string {
    return 'Occupational Disability Assessment';
  }
  public static get TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT(): string {
    return 'Occupational Disability Reassessment';
  }
  public static get TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT(): string {
    return 'Non-Occupational Disability Reassessment';
  }
  public static get TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT(): string {
    return 'Heir Disability Reassessment';
  }
  public static get TRANSACTION_REQUEST_CLARIFICATION_FROM_CONTRIBUTOR(): string {
    return 'Request Clarification from Contributor';
  }
  public static get TRANSACTION_MB_NON_OCC_ASSESSMENT(): string {
    return 'Non-Occupational Disability Assessment';
  }
  public static get ESIGN_TRANSACTION(): string {
    return 'E-Sign Workitem';
  }
  public static get CLARIFICATION_FROM_CONTRIBUTOR(): string {
    return 'Request Clarification from Contributor';
  }
  public static get TRANSACTIONS_UNDER_REASSESSMENT(): string[] {
    return [
      this.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT,
      this.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT,
      this.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT,
      this.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT
    ];
  }
  public static get TRANSACTION_EARLY_REASSESSMENT(): string {
    return 'Early Re-assessment';
  }
  public static get TRANSACTION_ASSIGN_TO_HO(): string {
    return 'Assign Assessment to HO Doctor';
  }
  public static get ASSIGN_PARTICIPANT_TO_SESSION(): string {
    return 'Assign participant to Session';
  }
  public static get MB_CONVEYANCE_ALLOWANCE(): string {
    return 'Conveyance payment flow';
  }
  public static get MB_BENEFIT_ASSESSMENT(): string {
    return 'MB Benefit Assessment';
  }
  public static get TRANSACTION_BENEFIT_DEPENDENT_DISABILITY_REASSESSMENT(): string {
    return 'Dependent Disability Reassessment';
  }
  public static get TRANSACTION_BENEFIT_HEIR_ASSESSMEMT(): string {
    return 'Request Heir Disability Assessment';
  }
  public static get TRANSACTION_BENEFIT_DEPENDENT_ASSESSMEMT(): string {
    return 'Request Dependant Disability Assessment';
  }
  public static get REQUEST_NON_OCC_DISB_ASSESSMENT(): string {
    return 'Request Non - Occupational Disability Assessment';
  }
  public static get REQUEST_HEIR_DISB_ASSESSMENT(): string {
    return 'Request Heir Disability Assessment';
  }
  public static get REQUEST_DEP_DISB_ASSESSMENT(): string {
    return 'Request Dependant Disability Assessment';
  }
  public static get TRANSACTION_BENEFIT_PROACTIVE_SANED(): string {
    return 'proactive saned request';
  }
  public static get TRANSACTION_BENEFIT_PROACTIVE_RETIREMENT_LUMPSUM(): string {
    return 'proactive retirement lumpsum';
  }
  public static get REQUEST_DEPENDENT_DISB_ASSESSMENT(): string {
    return 'Request Dependent Disability Assessment';
  }
  public static get TRANSACTION_BENEFIT_PROACTIVE_RETIREMENT_PENSION(): string {
    return 'proactive retirement pension';
  }
}
