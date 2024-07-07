/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Transaction } from '@gosi-ui/core';
import { ReimbursementRequestDetails } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { of } from 'rxjs';
import {
  allowanceDetails,
  claimsDetails,
  commentsTestData,
  holdAllowanceDetails,
  injuryHistoryTestData,
  personDetailsTestData,
  personUpdateFeedbackTestData,
  routerData
} from 'testing';
import {
  allowanceSummary,
  approveResponse,
  auditDetails,
  complicationDetailsTestData,
  expenseDetails,
  invoiceData,
  payeeDetails,
  paymentSummaryClaims,
  previousClaims,
  ReimbId,
  successMessage,
  transactionReferenceDataAudit,
  treatmentData
} from 'testing/test-data';

export class OhMockService {
  resourceId: number;
  complicationId: number;
  invoiceId = 1234;
  bilingualText = {
    english: 'suxcdd',
    arabic: 'suxcdd'
  };
  tpaCode = 'tcs';
  setReportType(reportType) {
    if (reportType) {
    }
  }
  setFilterValues(values) {
    if (values) {
    }
  }
  setTransactionDetails() {}
  setInjurystatus(status) {
    if (status) {
    }
  }
  generateReport(endDate, lang, startDate) {
    return of(null);
  }
  setAlert(alert) {}
  getAlert() {
    return '';
  }
  getRejectedCount() {
    return of({
      recentRejectedOh: 1,
      totalRejectedOH: 2
    });
  }
  /**  get system parameters  */
  getSystemParams() {
    return of(null);
  }
  getModifiedComplicationDetails(registrationNo, socialInsuranceNo, injuryNumber, complicationId, transactionRefNo) {
    if (registrationNo || socialInsuranceNo || injuryNumber || complicationId || transactionRefNo) {
    }
    return of(complicationDetailsTestData);
  }
  getComplication(registrationNo, socialInsuranceNo, injuryNumber, complicationId, isChangeRequired) {
    if (registrationNo || socialInsuranceNo || injuryNumber || complicationId || isChangeRequired) {
    }
    return of(complicationDetailsTestData);
  }
  setComplicationstatus(status) {
    if (status) {
    }
  }
  setRoute(route) {
    if (route) {
    }
  }
  getRoute() {
    return null;
  }
  resetValues() {
    return null;
  }
  updateWorkflowInjury(data, value, isInjury) {
    if (data || value || isInjury) {
    }
    return of(allowanceSummary);
  }
  updateTaskWorkflow(data) {
    if (data) {
    }
    return of(allowanceSummary);
  }
  updateReadStatus(ohId, transactionId) {
    if (ohId || transactionId) {
    }
    return of(this.bilingualText);
  }
  updateAllowanceStatus(auditNo, injuryId) {
    if (auditNo || injuryId) {
    }
    return of(this.bilingualText);
  }

  updateStatus(tpaCode, invoiceId, invoiceItemId) {
    if (tpaCode || invoiceId || invoiceItemId) {
    }
    return of(this.bilingualText);
  }
  getComments(ohId, sin, regNo, transactionId) {
    if (ohId || sin || regNo || transactionId) {
    }
    return of(transactionReferenceDataAudit);
  }
  updateReimbursementClaim(emailId, mobileNo, isTreatmentWithinSaudiArabia, payee, uuid, reimbId) {
    if (emailId || mobileNo || isTreatmentWithinSaudiArabia || payee || uuid || reimbId) {
      return of(ReimbId);
    }
  }
  addReimbursementClaim(emailId, mobileNo, isTreatmentWithinSaudiArabia, payee, uuid, reimbId) {
    if (emailId || mobileNo || isTreatmentWithinSaudiArabia || payee || uuid || reimbId) {
      return of(12345);
    }
  }
  setNavigationIndicator(navigationIndicator) {
    if (navigationIndicator) {
    }
  }
  complicationRejection(regNo, sin, id) {
    if (regNo || sin || id) {
    }
    return of(null);
  }
  getRejectedAllowanceDetails(regNo, sin, id) {
    if (regNo || sin || id) {
    }
    return of(null);
  }
  setIdForValidatorAction(id) {
    if (id) {
    }
  }
  assignAuditing(tpaCode, invoiceId, formData) {
    if (tpaCode || invoiceId || formData) {
    }
    return of(approveResponse);
  }
  getNavigationIndicator() {
    return true;
  }
  fetchAllowanceSummary(caseId, auditNo) {
    return of(allowanceSummary);
  }
  fetchAllAllowanceDetails(caseId, auditNo, claimId) {
    if (caseId || claimId || auditNo) {
    }
    return of(allowanceSummary);
  }
  fetchAllowanceDetails(caseId, auditNo) {
    if (caseId || auditNo) {
    }
    return of(allowanceSummary);
  }
  fetchPreviousAllowance(caseId, auditNo) {
    if (caseId || auditNo) {
    }
    return of(allowanceSummary);
  }

  rejectAuditing(auditNo, caseId, details, rejectedServiceList, rejectedService) {
    if (auditNo || caseId || details || rejectedServiceList || rejectedService) {
    }
    return of(null);
  }
  rejectAllowance(auditNo, caseId, details) {
    if (auditNo || caseId || details) {
    }
    return of(null);
  }
  fetchPreviousAllowanceSummary(caseId, auditNo, registrationNo, socialInsuranceNo) {
    if (caseId || auditNo || socialInsuranceNo || registrationNo) {
    }
    return of(allowanceSummary);
  }

  setReferenceNo(referenceNo) {
    if (referenceNo) {
    }
  }
  getAuditDetails(auditNo) {
    return of(auditDetails);
  }
  getClaimNo() {
    return null;
  }
  getCaseId() {
    return null;
  }
  submitReimbursement(regNo, sin, id, reimbId) {
    if (regNo || sin || id || reimbId) {
      return of(successMessage);
    }
  }
  assignForAuditing(registrationNo, socialInsuranceNo, id, data) {
    if (registrationNo || socialInsuranceNo || id || data) {
    }
    return of(successMessage);
  }
  setClaimNo(claimNo) {
    if (claimNo) {
    }
  }
  setCaseId(claimNo) {
    if (claimNo) {
    }
  }
  getReferenceNo(referenceNo) {
    return of(referenceNo);
  }
  filterAuditDetails(auditNo, filterValues) {
    if (auditNo || filterValues) {
    }
    return of(allowanceDetails);
  }
  filterAllowanceDetails(auditNo, injuryId, filterValues) {
    if (auditNo || injuryId || filterValues) {
    }
    return of(allowanceDetails);
  }

  fetchHoldAndAllowanceDetails(regNo, sin, id) {
    if (regNo || sin || id) {
    }
    return of(holdAllowanceDetails);
  }
  setNavigation(param) {
    if (param) {
    }
  }
  fetchClaimSummary(tpaCode, invoiceId, invoiceItemId) {
    if (tpaCode || invoiceId || invoiceItemId) {
    }
    return of(paymentSummaryClaims);
  }
  getBatchDetails(tpaCode, invoiceId) {
    if (tpaCode || invoiceId) {
    }
    return of(invoiceData);
  }
  getInvoiceData() {
    return of(invoiceData);
  }
  getRecoveryDetails(tpaCode, invoiceId, invoiceItemId) {
    if (tpaCode || invoiceId || invoiceItemId) {
      return of(treatmentData);
    }
  }
  getExpenseDetails(claimId, reimbursementId) {
    if (claimId || reimbursementId) {
      return of(expenseDetails);
    }
  }

  fetchPrevioucClaims(reg, sin, ohId) {
    if (reg || sin || ohId) {
    }
    return of(previousClaims);
  }
  setInvoiceDetails(invoiceData) {
    if (invoiceData) {
    }
  }
  getTransactionId() {}
  getTransactionStatus() {}
  getInvoiceDetails(tpaCode, invoiceId) {
    if (tpaCode || invoiceId) {
    }
    return of(invoiceData);
  }
  getTransactionRefId() {}
  setTransactionId(transactionId) {
    if (transactionId) {
    }
  }
  getReimbDetails(regNo, sin, reimId, id) {
    if (regNo || sin || reimId || id) {
    }
    return of();
  }
  setTransactionRefId(transactionRefId) {
    if (transactionRefId) {
    }
  }
  //Set TPACode
  setTPACode(tpa) {
    this.tpaCode = tpa;
  }
  //Get TPACode
  getTPACode() {
    return of('TCS');
  }

  //Set Invoice Id
  setInvoiceId(id) {
    this.invoiceId = id;
  }
  //Get Invoice Id
  getInvoiceId() {
    return of(124);
  }
  getNavigation() {}
  getallowanceDetails() {
    return of(allowanceDetails);
  }
  getallowanceDetail(regNo: number, sin: number, id: number, referenceNo) {
    if (regNo || sin || id || referenceNo) {
    }
    return of(allowanceDetails);
  }
  setRouterData(routerData) {
    if (routerData) {
    }
  }
  getClaimsDetails() {
    return of(claimsDetails);
  }
  getTreatmentCompleted() {
    return of('Yes');
  }
  getPayeeDetails(regNo: number, sin: number, id: number) {
    if (regNo || sin || id) {
    }
    return of(payeeDetails);
  }
  getInjurystatus() {
    const injuryStatus = {
      english: 'Rejected',
      arabic: 'Rejected'
    };
    return of(injuryStatus);
  }
  getComplicationstatus() {
    const injuryStatus = {
      english: 'Rejected',
      arabic: 'Rejected'
    };
    return of(injuryStatus);
  }
  getRouterData() {
    return routerData;
  }
  setIsWorkflow(workflow) {
    if (workflow) {
    }
  }
  getIsWorkflow() {
    return true;
  }
  setPersonId(personId) {
    if (personId) {
    }
  }
  setInjuryNumber(injuryNumber) {
    if (injuryNumber) {
    }
  }
  getInjuryNumber(injuryNumber) {
    if (injuryNumber) {
    }
    return of(1001952006);
  }
  setComplicationId(complicationId) {
    this.complicationId = complicationId;
  }
  getComplicationId() {
    return of(1001952006);
  }
  setSocialInsuranceNo(socialInsuranceNo) {
    if (socialInsuranceNo) {
    }
  }
  deleteTransactionDetails(number) {
    if (number) {
    }
    return of(number);
  }
  setRegistrationNo(registrationNo) {
    if (registrationNo) {
    }
  }
  setEstablishmetRegistrationNo(registrationNo) {
    if (registrationNo) {
    }
  }
  setInjuryId(injuryId) {
    if (injuryId) {
    }
  }
  getInjuryId() {
    return of(1001923482);
  }
  getBreakUpDetails(claimId, id, index) {
    if (claimId || id || index) {
    }
    return of(null);
  }
  getCompanionDetails(claimId) {
    if (claimId) {
    }
    return of(null);
  }
  getAdditionalDetails(allowance, index) {
    if (allowance || index) {
    }
    return of(null);
  }
  setPersonDetails(person) {
    if (person) {
    }
  }
  setInjuryDetails(injuryDetailsData) {
    if (injuryDetailsData) {
    }
  }
  getTreatmentServiceDetails(tpaCode, invoiceId, invoiceItemId, pagination, filterParams) {
    if (tpaCode || invoiceId || invoiceItemId || pagination || filterParams) {
      return of(treatmentData);
    }
  }
  getServiceDetails(regNo: number, sin: number, id, claimId, isRecoveryRequest) {
    return of(treatmentData);
  }
  getInjuryHistoryDetails() {
    return of(injuryHistoryTestData);
  }
  getPersonDetails() {
    return of(personDetailsTestData);
  }
  getSocialInsuranceNo() {
    return of(601336235);
  }
  getRegistrationNumber() {
    return of(10000602);
  }
  getEstablishmetRegistrationNo() {
    return of(10000602);
  }
  updateAddress(personalDetails) {
    if (personalDetails) {
    }
    return of(personUpdateFeedbackTestData);
  }
  validatorAction() {
    return of(null);
  }
  getOhHistory(Complication) {
    if (Complication) {
    }
    return of(injuryHistoryTestData);
  }
  getReportType() {
    return of('Complication');
  }
  setValues(personId, socialGroupNumber, injuryNumber) {
    if (personId || socialGroupNumber || injuryNumber) {
    }
  }
  setResponse() {}
  getValidatorComments(injuryId, transactionType) {
    if (injuryId || transactionType) {
    }
    return of(commentsTestData);
  }
  getClosingstatus() {
    return of('Cured with disability');
  }
  setClosingstatus(closingStatus) {
    if (closingStatus) {
    }
  }
  getIsClosed() {
    return true;
  }
  setIsClosed(isClosed) {
    if (isClosed) {
    }
  }
  submitComplicationClosingDetails() {}

  getTransactionDetails() {
    let transaction: Transaction = {
      transactionRefNo: 12345,
      title: {
        english: 'Reopen Injury',
        arabic: ''
      },
      description: null,
      contributorId: 132123,
      establishmentId: 12434,
      initiatedDate: null,
      lastActionedDate: null,
      stepStatus: { english: '', arabic: '' },
      status: null,
      channel: null,
      transactionId: 12345,
      registrationNo: 132123,
      sin: 41224,
      businessId: 2144,
      taskId: 'sdvjsvjdvasvd',
      assignedTo: 'admin',
      params: {
        BUSINESS_ID: 3527632,
        INJURY_ID: 1234445456,
        REGISTRATION_NO: 1234,
        SIN: 1234,
        REIMBURSEMENT_ID: 132
      },
      assigneeName: '',
      idParams: new Map(),
      pendingWith: null,
      fromJsonToObject(json) {
        Object.keys(new Transaction()).forEach(key => {
          if (key in json) {
            if (key === 'params' && json[key]) {
              this[key] = json[key];
              const params = json.params;
              Object.keys(params).forEach(paramKey => {
                this.idParams.set(paramKey, params[paramKey]);
              });
            } else {
              this[key] = json[key];
            }
          }
        });
        return this;
      }
    };
    return transaction;
  }

  filterPrevAllowanc(auditNo, injuryId, filterValues, pagination, registrationNo, socialInsuranceNo) {
    if (injuryId || auditNo || filterValues || pagination || registrationNo || socialInsuranceNo) {
    }
    return of(allowanceSummary);
  }

  getReimbClaim(registrationNo, socialInsuranceNo, bussinessId, reimbId) {
    return of(new ReimbursementRequestDetails());
  }
}
