/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
export class BillingConstants {
  /*SAR Bilingual Value to remove after fixing the chart */
  public static get CURRENCY_SAR(): BilingualText {
    const SAR = new BilingualText();
    SAR.english = 'SAR';
    SAR.arabic = 'ر.س';
    return SAR;
  }
  public static get ROUTE_RECEIVE_CONTRIBUTION_ESTABLISHMENT(): string {
    return 'home/billing/payment/establishment-payment/edit';
  }
  public static get ROUTE_RECEIVE_CONTRIBUTION_MOF(): string {
    return 'home/billing/payment/mof-payment/edit';
  } //Route to access receipt
  public static get ROUTE_RECIEPT(): string {
    return 'home/billing/receipt/establishment';
  } //Route to access Vic receipt
  public static get ROUTE_VIC_RECIEPT(): string {
    return 'home/billing/receipt/vic';
  } //Route to validator edit cancel receipt
  public static get ROUTE_CANCEL_RECEIPT(): string {
    return 'home/billing/payment/cancel-establishment-payment/edit';
  } //Route to validator edit waive establishment penalty
  public static get ROUTE_PENALTY_WAIVER(): string {
    return 'home/billing/penalty-waiver/edit';
  }
  //Route to validator edit establishment credit transfer
  public static get ROUTE_ESTABLISHMENT_CREDIT_TRANSFER(): string {
    return '/home/billing/credit-transfer/establishment-credit-transfer/edit';
  }
  //Route to validator edit establishment credit refund
  public static get ROUTE_ESTABLISHMENT_CREDIT_REFUND(): string {
    return '/home/billing/credit-transfer/establishment-refund-credit-balance/edit';
  }
  //Route to validator edit vic credit refund
  public static get ROUTE_VIC_CREDIT_REFUND(): string {
    return '/home/billing/credit-transfer/vic-refund-credit-balance/edit';
  }
  public static get ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC_SEGMENT_EDIT(): string {
    return 'home/billing/establishment-service/vic/modify';
  }
  public static get ROUTE_CONTRIBUTOR_REFUND(): string {
    return '/home/billing/credit-transfer/contributor-refund/edit';
  }
  public static get ROUTE_LATE_CALCULATION_FEE(): string {
    return '/home/billing/eventdate/modify';
  }
  //Route to establishment exceptional peanlty waiver screen
  public static get ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT_ONEDIT(): string {
    return 'home/billing/establishment-service/establishment/edit';
  }
  //Route to establishment exceptional peanlty waiver screen
  public static get ROUTE_MISCELLANOUEOUS_ADJUSTMENT_ONEDIT(): string {
    return 'home/billing/miscellaneous-adjustment/edit';
  }
  //Route to all entity exceptional peanlty waiver screen
  public static get ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ALL_ENTITY(): string {
    return 'home/billing/establishment-service/entityType/waiver';
  }
  //Route to billing EXPECTIONAL bulk penalty validator
  public static get ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY_ONEDIT(): string {
    return 'home/billing/establishment-service/entityType/edit';
  }
  //Route to vic exceptional peanlty waiver screen
  public static get ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC_EDIT(): string {
    return 'home/billing/establishment-service/vic/edit';
  }
  //Route to vic exceptional peanlty waiver screen
  public static get ROUTE_VALIDATOR_INSTALLMENT_EDIT(): string {
    return 'home/billing/installment/edit';
  }
  public static get ROUTE_VALIDATOR_BILLING_LATE_FEE_VIOLATION_EDIT(): string {
    return 'home/billing/penalty-waiver/violation-late-fees/edit'
  }
  //Wizard headings.
  public static get CONTRIBUTION_PAYMENT_DETAILS(): string {
    return 'BILLING.CONTRIBUTION-PAYMENT-DETAILS';
  }
  public static get DOCUMENTS(): string {
    return 'BILLING.DOCUMENTS';
  }
  public static get TERMS_CONDITIONS(): string {
    return 'BILLING.TERMS-CONDITIONS';
  }
  //Scan document transaction id.
  public static get SCAN_TRANSACTION_ID(): string {
    return 'RECEIVE_CONTRIBUTION_PAYMENT';
  }
  //Minimum allowed transaction date.
  public static get TRANSACTION_MINDATE(): string {
    return '2004-03-02';
  }
  //Max length for input fields.
  public static get AMOUNT_RECEIVED_SEPARATOR_LIMIT(): number {
    return 10000000000000;
  }
  public static get COMMENTS_MAX_LENGTH(): number {
    return 100;
  }
  public static get ADDITIONAL_DETAILS_MAX_LENGTH(): number {
    return 200;
  }
  public static get GUARANTEE_ID_MAX_LENGTH(): number {
    return 10;
  }
  //Transaction Id for scan/upload documents.
  public static get DOCUMENT_TRANSACTION_ID(): number {
    return 201304;
  }
  //Transaction Id for scan/upload documents.
  public static get PENALTY_WAIVER_DOCUMENT_TRANSACTION_ID(): number {
    return 300332;
  }
  public static get CREDIT_MANAGEMENT_DOCUMENT_TRANSACTION_ID(): number {
    return 300323;
  }
  public static get CREDIT_REFUND_DOCUMENT_TRANSACTION_ID(): number {
    return 300325;
  }
  public static get MISC_ADJUSTMENT_DOCUMENT_TRANSACTION_ID(): number {
    return 300360;
  }
  public static get VIC_CREDIT_REFUND_DOCUMENT_TRANSACTION_ID(): number {
    return 300326;
  }
  public static get CONTRIBUTOR_REFUND_DOCUMENT_TRANSACTION_ID(): number {
    return 300335;
  }
  public static get INSTALLMENT_DOCUMENT_TRANSACTION_ID(): number {
    return 300345;
  }
  public static get MAINTAIN_EVENTDATE_TRANSACTION_ID(): number {
    return 300331;
  }
  public static get GCC_RECEIPT_MODE(): string[] {
    return ['Bankers Cheque', 'SAMA Voucher', 'Sadad Network', 'Direct Debit', 'ATM', 'Cash'];
  }
  public static get CLOSE_IN_SETTLEMET_STATUS(): string {
    return 'Under Closure waiting for settlement';
  }
  public static get CLOSE_IN_STATUS(): string {
    return 'Closed- waiting for settlement';
  }
  public static get REG_STATUS(): string {
    return 'Registered';
  }
  public static get REOPENED_STATUS(): string {
    return 'Reopened';
  }
  public static get REOPEN_CLOSING_IN_PROGRESS_STATUS(): string {
    return 'Reopened- closing in progress';
  }
  public static get R_STATUS(): string {
    return 'Registered';
  }
  public static get INTERNATIONAL_COUNTRY_FILTER(): string[] {
    return ['Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman', 'Qatar', 'United Arab Emirates'];
  } //Constant for other in the bank list.
  public static get OTHER_LIST(): string {
    return 'Other';
  } //Constant for copy of cheque.
  public static get COPY_CHEQUE(): string {
    return 'Copy of Cheque';
  } //Constant for proof of payment.
  public static get PROOF_PAYMENT(): string {
    return 'Proof of  Payment';
  } //Constants for Module: Validator
  public static get TRANSACTION_APPROVED(): string {
    return 'BILLING.TRANSACTION-APPROVED';
  }
  public static get TRANSACTION_REJECTED(): string {
    return 'BILLING.TRANSACTION-REJECTED';
  }
  public static get TRANSACTION_RETURNED(): string {
    return 'BILLING.TRANSACTION-RETURNED';
  }
  //Route to billing contribution payment validator.
  public static get ROUTE_VALIDATOR_BILLING_CONTRIBUTION(): string {
    return 'home/billing/validator/payment';
  }
  //Route to billing contribution payment validator.
  public static get ROUTE_VALIDATOR_BILLING_MISCELLANEOUS(): string {
    return 'home/billing/validator/miscellaneous-adjustment';
  }
  //Route to billing event date validator.
  public static get ROUTE_VALIDATOR_BILLING_EVENTDATE(): string {
    return 'home/billing/validator/eventdate';
  }
  //Route to billing cancel receipt validator
  public static get ROUTE_VALIDATOR_BILLING_CANCEL_RECEIPT(): string {
    return 'home/billing/validator/cancel-receipt';
  }
  //Route to billing waive establishment penalty validator
  public static get ROUTE_VALIDATOR_BILLING_WAIVE_ESTABLISHMENT_PENALTY(): string {
    return 'home/billing/validator/penalty-waiver';
  }
  //Route to billing EXPECTIONAL establishment penalty validator
  public static get ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_ESTABLISHMENT_PENALTY(): string {
    return 'home/billing/validator/exceptional-est-penalty-waiver';
  }
  //Route to billing EXPECTIONAL establishment penalty validator
  public static get ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_VIC_PENALTY(): string {
    return 'home/billing/validator/exceptional-vic-penalty-waiver';
  }
  //Route to billing EXPECTIONAL bulk penalty validator
  public static get ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY(): string {
    return 'home/billing/validator/exceptional-bulk-penalty-waiver';
  }
  //Route to billing Installment validator
  public static get ROUTE_VALIDATOR_BILLING_INSTALLMENT(): string {
    return 'home/billing/validator/installment';
  }
  public static get ROUTE_VALIDATOR_BILLING_LATE_FEE_VIOLATION(): string {
    return 'home/billing/validator/violation-late-fees';
  }
  //Route to billing credit management validator screen
  public static get ROUTE_VALIDATOR_BILLING_CREDIT_MANAGEMENT(): string {
    return 'home/billing/validator/credit-management';
  }
  //Route to billing credit transfer validator screen
  public static get ROUTE_VALIDATOR_BILLING_CREDIT_TRANSFER(): string {
    return 'home/billing/validator/credit-refund-transfer-est';
  }
  //Route to billing credit refund validator vic view
  public static get ROUTE_VALIDATOR_BILLING_CREDIT_VIC_TRANSFER(): string {
    return 'home/billing/validator/credit-refund-transfer-vic';
  }
  //Route to billing credit refund validator vic view
  public static get ROUTE_VALIDATOR_BILLING_CONTRIBUTOR_TRANSFER(): string {
    return 'home/billing/validator/contributor-refund';
  }
  //Route to installment history view
  public static get INSTALLMENT_HISTORY_ROUTE(): string {
    return 'home/billing/installment/history';
  }
  //Route to access detailed bill
  public static get ROUTE_DETAILED_BILL(): string {
    return 'home/billing/establishment/detailed-bill';
  }
  //Route to access detailed bill mof
  public static get ROUTE_DETAILED_BILL_MOF(): string {
    return 'home/billing/establishment/detailed-bill/mof';
  }
  //Route to access dashboard bill mof
  public static get ROUTE_DASHBOARD_MOF(): string {
    return 'home/billing/establishment/dashboard-mof';
  }
  //Route to access dashboard bill
  public static get ROUTE_DASHBOARD_BILL(): string {
    return 'home/billing/establishment/dashboard/view';
  }
  //Route to access vic dashboard bill
  public static get ROUTE_VIC_DASHBOARD_BILL(): string {
    return 'home/billing/vic/dashboard';
  }
  //Route to access dashboard bill
  public static get ROUTE_BILL_HISTORY(): string {
    return 'home/billing/establishment/bill-history';
  }
  //Route to access dashboard bill
  public static get ROUTE_VIC_DASHBOARD(): string {
    return 'home/billing/vic/dashboard';
  }
  //Route to access vic bill history
  public static get ROUTE_VIC_BILL_HISTORY(): string {
    return 'home/billing/vic/bill-history/';
  }
  //Route to access dashboard bill
  public static get ROUTE_BILL_HISTORY_MOF(): string {
    return 'home/billing/establishment/bill-history/mof';
  }
  //Route to access dashboard bill
  public static get ROUTE_BILL_ALLOCATION(): string {
    return 'home/billing/establishment/bill-allocation/view';
  }
  //Route to access dashboard bill
  public static get ROUTE_BILL_ALLOCATION_MOF(): string {
    return 'home/billing/establishment/bill-allocation/mof';
  }
  //Route to establishment exceptional peanlty waiver screen
  public static get ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT(): string {
    return 'home/billing/establishment-service/establishment/waiver';
  }
  //Route to  vic exceptional peanlty waiver screen
  public static get ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC(): string {
    return 'home/billing/establishment-service/vic/waiver';
  } //Route to  entity type exceptional peanlty waiver screen
  public static get ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ENTITY_TYPE(): string {
    return 'home/billing/establishment-service/entityType/waiver';
  } //Route to access dashboard bill
  public static get ROUTE_VIC_BILL_ALLOCATION(): string {
    return 'home/billing/vic/bill-allocation';
  }
  public static get CANCEL_RECEIPT_DOC_TRANSACTION_ID(): string {
    return 'CANCEL_RECEIPT';
  }
  public static get CANCEL_RECEIPT_DOC_TRANSACTION_TYPE(): string {
    return 'CANCEL_RECEIPT';
  }
  public static get CANCEL_RECEIPT_TRANSACTION_ID(): number {
    return 100700;
  } //Billing history routing constant
  public static get BIILL_HISTORY_ROUTE_ALLOCATOIN(): string {
    return 'allocation';
  } //Billing history routing constant
  public static get BIILL_HISTORY_ROUTE_BILL_DETAILS(): string {
    return 'bill-details';
  } //route to allocation-mof
  public static get ROUTE_CONTRIBUTOR_CREDIT_ALLOCATION(): string {
    return 'home/billing/establishment/bill-allocation/contributor-level';
  } //Sadad payment mode
  public static get PAYMENT_MODE(): string {
    return 'Sadad Network';
  } //route to receipt list view
  public static get RECEIPT_LIST_ROUTE(): string {
    return 'home/billing/receipt/establishment';
  } //route to receipt vic list view
  public static get RECEIPT_VIC_LIST_ROUTE(): string {
    return 'home/billing/receipt/vic';
  }
  //route to receipt serach
  public static get RECEIPT_SEARCH_ROUTE(): string {
    return 'home/billing/receipt/receipt-search';
  }
  //route to record government payment
  public static get RECORD_GOVERNMENT_PAYMENT(): string {
    return 'home/billing/record-gov-receipts';
  }
  //route to mof receipt  list view
  public static get MOF_RECEIPT_LIST_ROUTE(): string {
    return 'home/billing/receipt/mof';
  } //route to receipt details
  public static get RECEIPT_DETAILS_ROUTE(): string {
    return 'home/billing/receipt/establishment/receiptDetails';
  }
  public static get RECEIVE_PAYMENT(): string {
    return 'home/billing/payment/establishment-payment';
  }
  //route to receipt details
  public static get VIC_RECEIPT_DETAILS_ROUTE(): string {
    return 'home/billing/receipt/vic/receiptDetails';
  } //route to mof receipt details
  public static get MOF_RECEIPT_DETAILS_ROUTE(): string {
    return 'home/billing/receipt/mof/receiptDetails';
  } //constant for cancelled status
  public static get CANCELLED(): string {
    return 'Cancelled';
  } //CONSTANT FOR SADAD NETWORK
  public static get SADAD_NETWORK(): string {
    return 'Sadad Network';
  }
  public static get PROCESSED_STATUS(): string[] {
    return ['Processed'];
  }
  public static get MOF_RECEIPT_ALLOCATION_BREAKUP(): string {
    return 'home/billing/receipt/mof/allocationDetails';
  }
  public static get STATUS(): string {
    return 'Processed';
  }
  public static get MOF_GOSI_ESTABLISHMENT(): string {
    return 'MOF_PAID_GOSI';
  }
  public static get MOF_PPA_ESTABLISHMENT(): string {
    return 'MOF_PAID_PPA';
  }
  public static get PENALTY_WAVIER_DOC_TRANSACTION_ID(): string {
    return 'PENALTY_WAIVER';
  }
  public static get MISC_ADJUSTMENT_DOC_TRANSACTION_ID(): string {
    return 'EST_MISC_ADJUSTMENT';
  }
  public static get CREDIT_MANAGEMENT_ID(): string {
    return 'CREDIT_TRANSFER';
  }
  public static get CREDIT_REFUND_ID(): string {
    return 'CREDIT_REFUND_ESTABLISHMENT';
  }
  public static get CREDIT_REFUND_VIC_ID(): string {
    return 'CREDIT_REFUND_VIC';
  }
  public static get CONTRIBUTOR_REFUND_ID(): string {
    return 'CREDIT_REFUND_CONTRIBUTOR';
  }
  public static get CREDIT_REFUND_BALANCE_DETAILS(): string {
    return 'BILLING.REFUND-CREDIT-BAL-DETAILS-CAPS';
  }
  public static get CREDIT_MANAGEMENT_TRANSACTION_GOL_TYPE(): string {
    return 'CREDIT_TRANSFER_GOL';
  }
  public static get CREDIT_MANAGEMENT_TRANSACTION_FO_TYPE(): string {
    return 'CREDIT_TRANSFER_FO';
  }
  public static get CREDIT_REFUND_TRANSACTION_TYPE(): string {
    return 'ESTABLISHMENT_CREDIT_REFUND';
  }
  public static get CREDIT_REFUND_VIC_TRANSACTION_TYPE(): string {
    return 'CREDIT_REFUND_VIC';
  }
  public static get CONTRIBUTOR_REFUND_TRANSACTION_TYPE(): string {
    return 'CREDIT_REFUND_CONTRIBUTOR';
  }
  public static get PENALTY_WAVIER_FO_DOC_TRANSACTION_TYPE(): string {
    return 'PENALTY_WAIVER_FO';
  }
  public static get PENALTY_WAVIER_SPCL_GOL_FO_DOC_TRANSACTION_TYPE(): string {
    return 'PENALTY_WAIVER_SPCL_SOCIETY';
  }
  public static get PENALTY_WAVIER_GOL_DOC_TRANSACTION_TYPE(): string {
    return 'PENALTY_WAIVER_GOL';
  }
  public static get PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE(): string {
    return 'PENALTY_WAIVER_SPCL';
  }
  public static get MISC_ADJUSTMENT_DOC_TRANSACTION_TYPE(): string {
    return 'MISC_ADJUSTMENT_OTHER';
  }
  //Wizard headings.
  public static get REFUND_CONTRIBUTOR_DETAILS(): string {
    return 'BILLING.CONTIBUTOR-REFUND-REQUESTS';
  }
  public static get TRANSFER_CREDIT_DETAILS(): string {
    return 'BILLING.TRANSFER-CREDIT-DETAILS';
  }
  public static get REFUND_CREDIT_DETAILS(): string {
    return 'BILLING.REFUND-CREDIT-BAL-DETAILS-CAPS';
  }
  public static get GUARANTEE(): string {
    return 'BILLING.GUARANTEE-CAPS';
  }
  public static get INSTALLMENT_DETAILS(): string {
    return 'BILLING.INSTALLMENT-DET';
  }
  public static get INSTALLMENT(): string {
    return 'INSTALLMENT';
  }
  public static get BANK_GUARANTEE(): string {
    return 'BANK_GUARANTEE';
  }
  public static get BANK_GUARANTEE_EXCEPTIONAL_CASE_GOL(): string {
    return 'BANK_GUARANTEE_EXCEPTIONAL_CASE_GOL';
  }
  public static get BANK_GUARANTEE_CASE_GOL(): string {
    return 'BANK_GUARANTEE_CASE_GOL';
  }
  public static get PROMISSORY_NOTE(): string {
    return 'PROMISSORY_NOTE';
  }
  public static get PROMISSORY_NOTE_CASE_GOL(): string {
    return 'PROMISSORY_NOTE_CASE_GOL';
  }
  public static get DECEASED_CLOSED_EST(): string {
    return 'DECEASED_CLOSED_EST';
  }
  public static get DECEASED_CLOSED_EST_GOL(): string {
    return 'DECEASED_CLOSED_EST_GOL';
  }
  public static get SPECIAL_REQUEST(): string {
    return 'SPECIAL_REQUEST';
  }
  public static get BANKGUARANTEE_SPECIAL_REQUEST(): string {
    return 'BANKGUARANTEE_SPECIAL_REQUEST';
  }
  public static get PROMISSORY_NOTE_SPECIAL_REQUEST(): string {
    return 'PROMISSORY_NOTE_SPECIAL_REQUEST';
  }
  public static get ESTABLISHMENT_OWNER_ON_JOB(): string {
    return 'ESTABLISHMENT_OWNER_ON_JOB';
  }
  public static get ESTABLISHMENT_OWNER_ON_JOB_GOL(): string {
    return 'ESTABLISHMENT_OWNER_ON_JOB_GOL';
  }
  public static get NON_COMPLIANCE_GUARANTEE(): string {
    return 'NON_COMPLIANCE_GUARANTEE';
  }
  public static get NON_COMPLIANCE_GUARANTEE_CASE_GOL(): string {
    return 'NON_COMPLIANCE_GUARANTEE_CASE_GOL';
  }
  public static get PENSION_REGISTERED(): string {
    return 'GOSI_PENSION_REGISTERED_EST';
  }
  public static get PENSION_REGISTERED_CASE_GOL(): string {
    return 'GOSI_PENSION_REGISTERED_EST_CASE_GOL';
  }
  public static get PENSION_CLOSED(): string {
    return 'GOSI_PENSION_CLOSED_EST';
  }
  public static get PENSION_CLOSED_GOL(): string {
    return 'GOSI_PENISON_CLOSED_EST_GOL';
  }
  public static get PPA_PENSION_CLOSED(): string {
    return 'PPA_PENSION_CLOSED_EST';
  }
  public static get BANK_GUARANTEE_EXCEPTIONAL(): string {
    return 'BANK_GUARANTEE_EXCEPTIONAL_CASE';
  }
  public static get NON_COMPLIANCE_EXCEPTIONAL(): string {
    return 'NON_COMPLIANCE_GUARANTEE_EXCEPTIONAL_CASE';
  }
  public static get NON_COMPLIANCE_EXCEPTIONAL_CASE_GOL(): string {
    return ' NON_COMPLIANCE_GUARANTEE_EXCEPTIONAL_CASE_GOL';
  }
  public static get PROMISSORY_NOTE_EXCEPTIONAL_CASE(): string {
    return 'PROMISSORY_NOTE_EXCEPTIONAL_CASE';
  }
  public static get PROMISSORY_NOTE_EXCEPTIONAL_CASE_GOL(): string {
    return 'PROMISSORY_NOTE_EXCEPTIONAL_CASE_GOL';
  }
  public static get MAINTAIN_EVENT_DATE(): string {
    return 'MAINTAIN_EVENT_DATE';
  }
  public static get ADJUSTMENT_DETAILS(): string {
    return 'BILLING.ADJUSTMENT-DETAILS-CAP';
  }
  public static get EXCEPTIONAL_HOME(): string {
    return '/home/billing/establishment-service/verify';
  } //CSV Error msg
  public static get EMPTY_CSV_ERROR(): string {
    return 'BILLING.BULK-WAGE.EMPTY-CSV-ERROR';
  }
  public static get INVALID_FILE_CONTENT(): string {
    return 'BILLING.BULK-WAGE.INVALID-FILE-CONTENT';
  } //route to contributor refund amount page
  public static get CONTRIBUTOR_REFUND_AMOUNT_ROUTE(): string {
    return 'home/billing/credit-transfer/contributor-refund-amount';
  }
  public static get ERROR_MESSAGE(): string {
    return 'No bill issued for this Month';
  }
  public static get ERROR_MESSAGE_MONTH(): string {
    return 'No bill has been issued yet';
  }
  public static get NO(): string {
    return 'BILLING.NO';
  }
  public static get SEMI_GOVERNMENT(): string {
    return 'Semi Government';
  }
  public static get GOVERNMENT(): string {
    return 'Government';
  }
  public static get PRIVATE(): string {
    return 'Individual';
  }
  public static get WARNING_ONE(): string {
    return 'The establishment was granted two waivers before.';
  }
  public static get WARNING_TWO(): string {
    return 'A request already exists in the workflow to wave establishment late fees. ';
  }
  public static get WARNING_THREE(): string {
    return 'The establishment is not eligible for a second time waiver.';
  }
  public static get WARNING_FOUR(): string {
    return 'The establishment is not eligible for a second time waiver, and it benefited from a waiver during a previous closure.';
  }
  public static get WARNING_FIVE(): string {
    return 'There are no outstanding late fees to be waived.';
  }
  public static get  WARNING_SIX(): string {
    return 'No records found for waive off';
  }
  public static get WARNING_SEVEN(): string {
    return 'A request already exists in the workflow to benefit from GOSI initiative to waive late fees and violations';
  }
  public static get WARNING_EIGHT(): string {
    return 'Establishment has an active flag';
  }
  public static get WARNING_NINE(): string {
    return 'It is not possible to submit a request to benefit from GOSI Initiative to Waive Late Fees and Violations more than once';
  }
  public static get WARNING_TEN(): string {
    return 'The request cannot be submitted as there are no incurred dues prior to the initiative release date';
  }
  public static get WARNING_ELEVEN(): String {
    return 'To get access to services provided by GOSI, please complete establishment details';
  }
  public static get WARNING_TWELVE(): String {
    return 'Sorry, the service cannot be provided, as a lawsuit is in progress, for defaulting on paying the overdues';
  }
  public static get WARNING_THIRTEEN(): String {
    return 'A request already approved and waiting for payment';
  }
  //Constant for copy of cheque.
  public static get CHEQUE(): string {
    return 'Cheque';
  }
  public static get CREDIT_RETAINED(): string {
    return 'Do not Retain Amount';
  }
  public static get LEGAL_ENTITY_CHANGE(): string {
    return 'change establishment legal entity';
  }
  public static get DELINK_BRANCH_CHANGE(): string {
    return 'delink branch from a main establishment';
  }
  public static get CHANGE_OWNER(): string {
    return 'manage establishment owners details';
  }
  public static get CHANGE_BANK_DETAILS(): string {
    return 'change establishment bank details';
  }
  public static get DROPPED_MONTH_ERROR_CODE(): string {
    return 'BILL-ERR-0057';
  }
}
