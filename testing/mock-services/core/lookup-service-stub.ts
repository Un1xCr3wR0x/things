import { ActivityTypeList, bindToObject, GosiCalendar, Lov, LovList } from '@gosi-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  activityTypeListData,
  addressTypeListData,
  adjustmentSortListData,
  auditReasonList,
  bankDetailsByIBAN,
  bankListData,
  bankTypeListData,
  billPaymentStatusList,
  cityListData,
  collectionReturnListData,
  contributionSortListData,
  contactList,
  countryListData,
  establishmentStatusListData,
  establishmentTypeListData,
  flagTypeList,
  gccBankListData,
  gccCountryListData,
  gccCurrencyListData,
  genderListData,
  legalEntityListData,
  licenseIssuingAuthorityListData,
  maritalStatus,
  nationalityListData,
  nonSaudiBankListData,
  officeList,
  organisationListData,
  paymentListData,
  purposeList,
  reasonForCancelEngagement,
  reasonForCancellationList,
  reasonList,
  receiptModeData,
  receiptSortListData,
  receiptStatusList,
  rejectionReasonListData,
  saudiBankListData,
  saudiNonSaudiList,
  vicCancellationReasonList,
  vicSegmentList,
  vicTerminationReasonList,
  violationChannelListdata,
  violationTypeListData,
  violationStatusListData,
  doctorTypeData,
  specialtyData,
  regionListData,
  medicalBoardTypeData,
  hospitalData,
  feesPerVisitData,
  terminateReasonList,
  medicalBoardRejectReasonList,
  medicalBoardReturnReasonList,
  unAvailableReasonList
} from '../../test-data';

/**
 * Stub class for LookupService.
 *
 * @export
 * @class LookupServiceStub
 */
export class LookupServiceStub {
  bankNameList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(new LovList([bankDetailsByIBAN]));
  countryList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(countryListData);
  legalEntityList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(legalEntityListData);
  reopenReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(legalEntityListData);
  activityList: BehaviorSubject<ActivityTypeList> = new BehaviorSubject<ActivityTypeList>(activityTypeListData);
  nationalityList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(nationalityListData);
  officeList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(officeList);
  organistaionList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(organisationListData);
  TransactionStatusList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(countryListData);
  licenseIssuingAuthorityList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(licenseIssuingAuthorityListData);
  location$: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(cityListData);
  establishmentTypeList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(establishmentTypeListData);
  cityList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(cityListData);
  addressTypeList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(addressTypeListData);
  genderList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(genderListData);
  establishmentRejectReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(rejectionReasonListData);
  gccCountryList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(gccCountryListData);
  bankList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(bankListData);
  paymentTypeList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(paymentListData);
  rejectionReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  returnReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  gccCurrencyList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(gccCurrencyListData);
  receiptMode: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(receiptModeData);
  saudiBankList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(saudiBankListData);
  nonSaudiBankList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(nonSaudiBankListData);
  leavingReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(gccCurrencyListData);
  gccBankList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(gccBankListData);
  bankTypeList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(bankTypeListData);
  establishmentStatusList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(establishmentStatusListData);
  receiptStatus: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(receiptStatusList);
  reasonForCancellation: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(reasonForCancellationList);
  billPaymentStatus: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(billPaymentStatusList);
  reasonForCancelEngagement: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(reasonForCancelEngagement);
  governmentUniversities: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  saudiNoSaudi: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(saudiNonSaudiList);
  collectionReturnListData: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(collectionReturnListData);
  contributionSortList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(contributionSortListData);
  receiptSortList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(receiptSortListData);
  adjustmentSortList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(adjustmentSortListData);
  internationalCountryList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(countryListData);
  violationChannelList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(violationChannelListdata);
  violationTypeList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(violationTypeListData);
  violationStatusList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(violationStatusListData);
  vicSegment: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(vicSegmentList);
  pursposeList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(purposeList);
  reasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(reasonList);
  flagTypeList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(flagTypeList);
  maritalStatusList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(maritalStatus);
  vicTerminationReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(vicTerminationReasonList);
  vicCancellationReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(vicCancellationReasonList);
  auditReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(auditReasonList);
  contactList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(contactList);
  doctorTypeData: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(doctorTypeData);
  specialtyData: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(specialtyData);
  regionListData: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(regionListData);
  medicalBoardTypeData: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(medicalBoardTypeData);
  hospitalData: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(hospitalData);
  feesPerVisitData: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(feesPerVisitData);
  terminateReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(terminateReasonList);
  medicalBoardRejectReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(medicalBoardRejectReasonList);
  medicalBoardReturnReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(medicalBoardReturnReasonList);
  unAvailableReasonList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(unAvailableReasonList);
  /**
   * Mock method for getCountryList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getCountryList() {
    return this.countryList.asObservable();
  }
  /**
   * mock method for field office list
   */
  getFieldOfficeList() {
    return this.officeList.asObservable();
  }
  /**
   * Mock method for getCountryList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getBank() {
    return this.bankNameList.asObservable();
  }
  /**
   * Mock method for getTransactionStatusList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getTransactionStatusList(string) {
    return this.TransactionStatusList.asObservable();
  }

  /**
   * Mock method for getGccCountryList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getGccCountryList() {
    return this.gccCountryList.asObservable();
  }

  /**
   * Mock method for getEducationList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getlegalEntityList() {
    return this.legalEntityList.asObservable();
  }

  /**
   * Mock for marital status
   */
  getViolationChannelList() {
    return this.violationChannelList.asObservable();
  }

  /**
   *
   * Mock for marital status
   */
  getViolationTypeList() {
    return this.violationTypeList.asObservable();
  }
  /**
   *
   * Mock for marital status
   */
  getViolationStatusList() {
    return this.violationStatusList.asObservable();
  }
  /**
   * Mock for Reopen Reason
   */
  getReopenReason(registration) {
    if (registration) return this.reopenReasonList.asObservable();
  }
  /**
   * Mock method for getEducationList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getEducationList() {
    return this.legalEntityList.asObservable();
  }

  /**
   * Mock method for getSpecialisation.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getSpecializationList() {
    return this.legalEntityList.asObservable();
  }

  /**
   * Mock method for getWorktype.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getWorkTypeList() {
    return this.legalEntityList.asObservable();
  }
  /**
   * Mock method for get contact list
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getContactLists() {
    return this.contactList.asObservable();
  }
  /**
   * Mock method for getOccupationList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getOccupationList() {
    return this.legalEntityList.asObservable();
  }

  getReasonForLeavingList() {
    return this.leavingReasonList.asObservable();
  }

  /**
   * Mock method for getLocationList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getActivityTypeList() {
    return this.activityList.asObservable();
  }

  /**
   * Mock method for getNationalityList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getNationalityList() {
    return this.nationalityList.asObservable();
  }

  /**
   * Mock method for getEstablishmentReturnReasonList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getEstablishmentReturnReasonList() {
    return this.nationalityList.asObservable();
  }
  /**
   * Mock method for getcontributorReturnReasonList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getcontributorReturnReasonList() {
    return this.nationalityList.asObservable();
  }

  /**
   * Mock method for getCityList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getCityList() {
    return this.cityList.asObservable();
  }
  /**
   * Mock method for getAddressTypeList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getAddressTypeList() {
    return this.addressTypeList.asObservable();
  }
  /**
   * Mock method for getGenderList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getGenderList() {
    return this.genderList.asObservable();
  }

  /**
   * Mock method for getLicenseIssueAuthorityList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getLicenseIssueAuthorityList() {
    return this.licenseIssuingAuthorityList.asObservable();
  }

  /**
   * Mock method for getOrganistaionTypeList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getOrganistaionTypeList() {
    return this.organistaionList.asObservable();
  }

  /**
   * Mock method for getEstablishmentRejectReasonList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getEstablishmentRejectReasonList() {
    return this.establishmentRejectReasonList.asObservable();
  }

  /**
   * Mock method for getEstablishmentRejectReasonList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getRegistrationReturnReasonList() {
    return this.establishmentRejectReasonList.asObservable();
  }

  /**
   * Mock method for getOrganistaionTypeList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getEstablishmentTypeList() {
    return this.establishmentTypeList.asObservable();
  }

  /**
   * Mock method for getYesOrNoList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getYesOrNoList() {
    return of(null);
  }
  /**
   * Mock method for getbankList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getBankList() {
    return this.bankList.asObservable();
  }
  /**
   * Mock method for getPaymentMode.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getPaymentMode() {
    return this.paymentTypeList.asObservable();
  }

  getReturnReasonList() {
    return this.returnReasonList.asObservable();
  }

  getRejectionReasonList() {
    return this.rejectionReasonList.asObservable();
  }

  /**
   * Mock method for getGccCurrencyList.
   * @memberof LookupServiceStub
   */
  getGccCurrencyList() {
    return this.gccCurrencyList.asObservable();
  }

  /**
   * Mock method for getReceiptMode.
   * @memberof LookupServiceStub
   */
  getReceiptMode() {
    return this.receiptMode.asObservable();
  }

  /**
   * Mock method for getAdjustmentReason.
   * @memberof LookupServiceStub
   */
  getAdjustmentReason() {
    return this.receiptMode.asObservable();
  }

  /**
   * Mock method for getSaudiBankList.
   * @memberof LookupServiceStub
   */
  getSaudiBankList() {
    return this.saudiBankList.asObservable();
  }
  getNonSaudiBankList() {
    return this.nonSaudiBankList.asObservable();
  }

  /**
   * Mock method for getQatarBankList
   */
  getGCCBankList() {
    return this.gccBankList.asObservable();
  }

  getBankType() {
    return this.bankTypeList.asObservable();
  }

  getEstablishmentLocationList() {
    return this.legalEntityList.asObservable();
  }

  getEstablishmentStatusList() {
    return this.establishmentStatusList.asObservable();
  }
  getReceiptStatus() {
    return this.receiptStatus.asObservable();
  }
  getReasonForCancellationList() {
    this.reasonForCancellation.asObservable();
  }
  getBillPaymentStatusList() {
    return this.billPaymentStatus.asObservable();
  }
  getSaudiNonSaudi() {
    return this.saudiNoSaudi.asObservable();
  }
  getReasonForCancelEngagement() {
    return this.reasonForCancelEngagement.asObservable();
  }
  getGovernmentUniversities() {
    return this.governmentUniversities.asObservable();
  }
  /**
   * Mock method for getCollectionReturnReasonList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getCollectionReturnReasonList() {
    return this.collectionReturnListData.asObservable();
  }
  getContributionSortFieldsList() {
    return this.contributionSortList.asObservable();
  }
  getReceiptSortFields() {
    return this.contributionSortList.asObservable();
  }
  getAdjustmentSortFieldsList() {
    return this.contributionSortList.asObservable();
  }
  /**
   * Mock method for getGccCountryList.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getInternationalCountryList() {
    return this.internationalCountryList.asObservable();
  }
  getVicSegmentFilterList() {
    return this.vicSegment.asObservable();
  }
  getPurposeOfRegistrationList() {
    return this.pursposeList.asObservable();
  }
  getExceptionalPenaltyWaiverReason() {
    return of(<any>new LovList([bindToObject(new Lov(), reasonList.items)]));
  }
  getEstablishmentSegmentFilterList() {
    return this.reasonList.asObservable();
  }
  getAllEntityFilter() {
    return this.reasonList.asObservable();
  }
  getFlagTypeList() {
    return this.flagTypeList.asObservable();
  }
  getMaritalStatus() {
    return this.maritalStatusList.asObservable();
  }
  getVICTerminationReasonList() {
    return this.vicTerminationReasonList.asObservable();
  }
  getBankForIban() {
    return this.countryList.asObservable();
  }
  getVicReasonForCancellation() {
    return;
  }
  getAuditReasonList() {
    return this.auditReasonList.asObservable();
  }
  getTransferModeList() {
    return this.bankList.asObservable();
  }
  getCreditRetainList() {
    return this.bankList.asObservable();
  }
  getHijriDate() {
    return of(new GosiCalendar());
  }
  getReligionList() {
    return of(new LovList([]));
  }
  getReasonForRejection() {
    return of(new LovList([]));
  }
  getCancelViolationsList() {
    return of(new LovList([]));
  }
  getModifyViolationsList() {
    return of(new LovList([]));
  }
  getTransferModeDetails() {
    return this.bankList.asObservable();
  }
  getAdjustmentPercentageList() {
    return of(new LovList([]));
  }
  getRequestedBy() {
    return of(new LovList([]));
  }
  getReasonForHolding() {
    return of(new LovList([]));
  }
  getReasonForReactivating() {
    return of(new LovList([]));
  }
  getReasonForStopping() {
    return of(new LovList([]));
  }
  getSpecialityList() {
    return this.specialtyData.asObservable();
  }
  getContractTypeList() {
    return this.doctorTypeData.asObservable();
  }
  getRegionList() {
    return this.regionListData.asObservable();
  }
  getMedicalBoardTypeList() {
    return this.medicalBoardTypeData.asObservable();
  }
  getHospitalList() {
    return this.hospitalData.asObservable();
  }
  getFeespervisitList() {
    return this.feesPerVisitData.asObservable();
  }
  getTerminateContractReasonList() {
    return this.terminateReasonList.asObservable();
  }
  getMedicalBoardRejectReasonList() {
    return this.medicalBoardRejectReasonList.asObservable();
  }
  getMedicalBoardReturnReasonList() {
    return this.medicalBoardReturnReasonList.asObservable();
  }
  getUnavailablePeriodReasons() {
    return this.unAvailableReasonList.asObservable();
  }
  getAnnuitiesRelationshipList() {
    return of(new LovList([new Lov()]));
  }
  getHeirStatusList() {
    return of(new LovList([new Lov()]));
  }
  getMaritalStatusLookup() {
    return of(new LovList([new Lov()]));
  }
  getAnnuitiesRelationshipByGender() {
    return of(new LovList([new Lov()]));
  }
  getTpaRejectionReasonList() {
    return of(new LovList([new Lov()]));
  }
  getAppealReasonList() {
    return of(new LovList([new Lov()]));
  }
  getMBOccReasonForDisabilityList() {
    return of(new LovList([new Lov()]));
  }
  getClarificationDocuments() {
    return of(new LovList([new Lov()]));
  }
  getBodyPartsList() {
    return of(new LovList([new Lov()]));
  }
}
