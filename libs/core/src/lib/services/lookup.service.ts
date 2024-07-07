/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LookUpServiceBase } from '../base/lookup-service-base';
import { LovConstants } from '../constants/lov-constants';
import { IbanSaudiBank, LookupCategory, LookupDomainName, LookupPath } from '../enums';
import { BilingualText, FieldOfficeDetails, GosiCalendar, Lov, LovList, Occupation, OccupationList } from '../models';
import { convertToYYYYMMDD } from '../utils/date';
export const CURRENT_OWNER_LOV_VALUE: BilingualText = { english: 'Current Owners', arabic: 'الملاك الحاليين' };
export const NEW_OWNER_LOV_VALUE: BilingualText = { english: 'New Owners', arabic: 'الملاك المضافين ' };
export const CURRENT_ADMIN_LOV_VALUE: BilingualText = {
  english: 'Current Branches Account Manager',
  arabic: 'مدير حساب الفروع الحالي'
};
export const SORT_START_DATE: BilingualText = {
  english: 'startDate',
  arabic: 'تاريخ البداية'
};
export const SORT_DAYS: BilingualText = {
  english: 'days',
  arabic: 'تاريخ النهاية'
};

export const NEW_ADMIN_LOV_VALUE: BilingualText = {
  english: 'Replace Current Branches Account Manager',
  arabic: 'تغيير مدير حساب الفروع'
};
/** The service class to fetch lookup values like country, banks etc. */
@Injectable({
  providedIn: 'root'
})
export class LookupService extends LookUpServiceBase {
  constructor(readonly http: HttpClient) {
    super(http);
  }
  /**This method is to get jobScale values Civilian or Military */
  getJobScale(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.JOB_SCALE);
  }
  /** This method is to get the country look up values. */
  getCountryList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.COUNTRY);
  }
  /** This method is to get the audit reason look up values.*/
  getAuditReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.OH, LookupDomainName.AUDITOR_INVOICE_REASON);
  }
  /** This method is to get the Injury Staus look up values. */
  getTransactionStatusList(domain: string): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, domain);
  }
  /** This method is to get the injury Status look up values. */
  getInjuryStatusList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.CLOSE_INJURY_STATUS);
  }
  getDiseaseDiagnosisList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.OH_DISEASE_DIAGNOSIS);
  }

  getDiseaseCauseList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.OH_DISEASE_CAUSE);
  }

  /** This method is to fetch education lookup values. */
  getEducationList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.EDUCATION);
  }
  /** This method is to fetch injury reopen reasons. */
  getReopenReason(category: string): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(category, LookupDomainName.REOPEN_REASON);
  }
  /** This method is to fetch disease reopen reasons. */
  getReopenDiseaseReason(category: string): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(category, LookupDomainName.REOPEN_DISEASE_REASON);
  }
  /** This method is fetch location lookup values. */
  getLocationList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.LOCATION);
  }
  /** This method is fetch legalEntityList lookup values. */
  getlegalEntityList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.LEGALENTITYTYPE);
  }
  /** This method is fetch Organistaion Type lookup values. */
  getOrganistaionTypeList(): Observable<LovList> {
    const params: HttpParams = new HttpParams().set('category', LookupCategory.REGISTRATION);
    return this.getLookupByPath(LookupPath.ORGANIZATION_CATEGORY, params);
  }
  /** This method is fetch License Issuing Authority lookup values. */
  getLicenseIssueAuthorityList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.LICENSE_ISSUING_AUTHORITY);
  }
  /** This method is fetch Organistaion Type lookup values. */
  getEstablishmentTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.ESTABLISHMENT_TYPE);
  }
  getEstablishmentMOFTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MOF_TYPE_ESTABLISHMENT);
  }
  /** This method is fetch study leave certification Type when studying outside saudi lookup values. */
  getCertificationTypeListOutsideSaudi(): Observable<LovList> {
    const path = `/study-leave-certifications?abroadCertification=true`;
    const certificationTypeLovUrl = this.lovBaseUrl + path;
    const certificationTypeList = new BehaviorSubject<LovList>(null);
    const certificationTypeList$ = certificationTypeList.asObservable();
    this.http
      .get(certificationTypeLovUrl)
      .pipe(catchError(() => this.handleError('Certification list fetch failed. Please try again later.')))
      .subscribe(response => {
        if (response !== undefined) {
          certificationTypeList.next(new LovList(<any>response));
        } else {
          this.handleError('Certification list fetch failed. Please try again later.');
        }
      });
    return certificationTypeList$;
  }
  /** This method is fetch study leave certification Type when studying inside saudi lookup values. */
  getCertificationTypeListInsideSaudi(): Observable<LovList> {
    const path = `/study-leave-certifications?abroadCertification=false`;
    const certificationTypeLovUrl = this.lovBaseUrl + path;
    const certificationTypeList = new BehaviorSubject<LovList>(null);
    const certificationTypeList$ = certificationTypeList.asObservable();
    this.http
      .get(certificationTypeLovUrl)
      .pipe(catchError(() => this.handleError('Certification list fetch failed. Please try again later.')))
      .subscribe(response => {
        if (response !== undefined) {
          certificationTypeList.next(new LovList(<any>response));
        } else {
          this.handleError('Certification list fetch failed. Please try again later.');
        }
      });
    return certificationTypeList$;
  }
  /** This method is fetch law Type lookup values. */
  getLawTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.LAW_TYPE);
  }
  /** This method is fetch Organistaion Type lookup values.*/
  getTreatmentServiceRejectionList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.AUDITOR_REJECTION_REASON);
  }
  /**This method is fetch Organistaion Type lookup values.*/
  getTreatmentServiceTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.TREATMENT_SERVICE_TYPE);
  }
  /** This method is fetch Organistaion Type lookup values. */
  getEstablishmentRejectReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.TRANSACTION_REJECT_REASON);
  }
  /** This method is fetch rejection reason for cancel rpa lookup values. */
  getCancelRPARejectReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.RPA_REJECTION_REASON_FOR_CANCEL);
  }
  /** This method is to get the religion look up values. */
  getReasonForRejection(headerParams): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.REASON_FOR_REJECT,
      headerParams
    );
  }

  /** This method is to get the religion look up values. */
  getEngReasonForRejection(headerParams): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.CNT_AUTH_REJECTION_REASON,
      headerParams
    );
  }

  /** This method is fetch return reasons lookup values. */
  getRegistrationReturnReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.TRANSACTION_RETURN_REASON);
  }
  /** This method is to fetch nationality lookup values. */
  getNationalityList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.NATIONALITY);
  }
  /** This method is to fetch restart reason lookup values. */
  getRestartReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.RESTART_BENEFIT_REASON);
  }
  /** This method is to fetch dependnet hold reason lookup values. */
  getDepHoldReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.DEP_HOLD_REASON);
  }
  /** This method is to fetch heir hold reason lookup values. */
  getHeirHoldReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.HEIR_HOLD_REASON);
  }
  /** This method is to fetch nationality lookup values. */
  getCityList(): Observable<LovList> {
    return this.getLookupByPath(LookupPath.VILLAGE);
  }
  getGosiInitiativeReturnReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.GOSI_INITIATIVE_RETURN_REASON);
  }
  getGosiInitiativeRejectReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.GOSI_INITIATIVE_REJECT_REASON);
  }
  /** This method is to fetch nationality lookup values. */
  getAppealReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.APPEALREASON);
  }
  /** This method is to fetch Injury occured place lookup values. */
  getInjuryOccuredPlace(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.OH_WORK_INJURY_LOCATION_CODE
    );
  }
  getViolationChannelList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.VIOLATION_CHANNEL);
  }
  getViolationTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.VIOLATION_TYPE);
  }
  getViolationStatusList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.VIOLATION_TYPE);
  }
  /** This method is to fetch Gender lookup values. */
  getGenderList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.SEX);
  }
  /** This method is to fetch ContractType lookup values. */
  getContractTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.CONTRACTTYPE);
  }
  /** This method is to fetch MEDICALBOARDTYPE lookup values. */
  getMedicalBoardTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MEDICALBOARDTYPE);
  }
  /** This method is to fetch BODYPARTS lookup values. */

  getBodyPartsList(): Observable<LovList> {
    return this.getLookupByPath(LookupPath.BODY_PARTS);
  }
  getSpecialityList(): Observable<LovList> {
    return this.getLookupByPath(LookupPath.SPECIALTY);
  }
  /** This method is to get Visiting doctor Reasons lookup values. */

  getMBVisitingDoctorReasonsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_VISITING_DOCTOR_REASONS
    );
  }
  getAssessmentTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_ASSESSMENT_TYPE);
  }
  getSessionFrequencyList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_FREQUNCEY_TYPE
    );
  }
  getMbLocations(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION.toUpperCase(), LookupDomainName.MB_LOCATION);
  }
  getSessionChannel(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_SESSION_CHANNEL
    );
  }
  getStopReasonsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_SESSION_STOP_REASONS
    );
  }
  getCancelReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_SESSION_CANCEL_REASONS
    );
  }
  getHoldReasonsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_SESSION_HOLD_REASONS
    );
  }
  getHoldCreationList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_HOLD_SESSION_CREATION
    );
  }
  getUnHoldReasonsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_SESSION_UNHOLD_REASONS
    );
  }
  getUnavailablePeriodReasons(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_UNAVAILABLE_PERIOD_REASONS
    );
  }
  getSessionStatus(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.MB_SESSION_TEMPLATE_STATUS
    );
  }
  getFeespervisitList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.feespervisit);
  }
  getRegionList(): Observable<LovList> {
    return this.getLookupByPath(LookupPath.REGION);
  }
  getRegionsList(): Observable<LovList> {
    const path = `/${LookupPath.REGION}?isMB=true`;
    const url = this.lovBaseUrl + path;
    const lovList = new BehaviorSubject<LovList>(null);
    const lovList$ = lovList.asObservable();
    this.http.get(url).subscribe((response: Lov[]) => {
      if (response !== undefined) {
        lovList.next(new LovList(response));
      } else {
        this.handleError('Region list fetch failed. Please try again later.');
      }
    });
    return lovList$;
  }
  // getHospitalList(): Observable<LovList> {
  //   return this.getLookupByPath(LookupPath.HOSPITAL);
  // }
  /** This method is to fetch specialization lookup values. */
  getSpecializationList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MOL_SPECIALIZATION);
  }
  /** This method is to get Visiting doctor Reasons lookup values. */

  getVisitingDoctorReasonsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD.toUpperCase(),
      LookupDomainName.VISITING_DOCTOR_REASONS
    );
  }
  getHealthInspectionReasonsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION.toUpperCase(),
      LookupDomainName.HEALTH_INSPECTION_REASONS
    );
  }

  /** This method is to fetch specialization lookup values. */
  getWorkTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.WORK_TYPE);
  }
  /** This methode will fetch out all the injury type. */
  getInjuryTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.OH_ACCIDENT_TYPE);
  }
  /** This method is fetch bank name with IBanCode. */
  getInjuryReasonList(injuryType?: string): Observable<LovList> {
    const path = `/${LookupPath.INJURY_REASON}?typeName=${injuryType}`;
    const url = this.lovBaseUrl + path;
    return this.http.get<Lov>(url).pipe(map(lov => new LovList(lov?.items)));
  }
  /** This method is to fetch occupation lookup values. */
  //todo: move to corresponding service
  getOccupationList(): Observable<OccupationList> {
    const path = `/occupation?version=LATEST`;
    const occupationLovUrl = this.lovBaseUrl + path;
    const occupationList = new BehaviorSubject<OccupationList>(null);
    const occupationList$ = occupationList.asObservable();
    this.http
      .get(occupationLovUrl)
      .pipe(catchError(() => this.handleError('Occupation list fetch failed. Please try again later.')))
      .subscribe((response: Occupation[]) => {
        if (response !== undefined) {
          occupationList.next(new OccupationList(response));
        } else {
          this.handleError('Occupation list fetch failed. Please try again later.');
        }
      });
    return occupationList$;
  }
  /** This method is to fetch all occupation lookup values. */
  getAllOccupationList(): Observable<OccupationList> {
    const path = `/occupation`;
    const occupationLovUrl = this.lovBaseUrl + path;
    const occupationList = new BehaviorSubject<OccupationList>(null);
    const occupationList$ = occupationList.asObservable();
    this.http
      .get(occupationLovUrl)
      .pipe(catchError(() => this.handleError('Occupation list fetch failed. Please try again later.')))
      .subscribe((response: Occupation[]) => {
        if (response !== undefined) {
          occupationList.next(new OccupationList(response));
        } else {
          this.handleError('Occupation list fetch failed. Please try again later.');
        }
      });
    return occupationList$;
  }
  /** This method is to fetch Activity Type lookup values. */
  getActivityTypeList(): Observable<LovList> {
    return this.getLookupByPath(LookupPath.ACTIVITY_TYPE);
  }
  /** This method is to fetch Address Type lookup values. */
  getAddressTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.ADDRESS_TYPE);
  }
  /** This method is fetch bank name with IBanCode. */
  getBank(iBanCode): Observable<LovList> {
    // const path = `bank/${iBanCode}`;
    const path = `iban/${iBanCode}`;
    const url = this.lovBaseUrl + '/' + path;
    return this.http.get<Lov>(url).pipe(map(lov => (lov ? new LovList([lov]) : new LovList([]))));
  }
  /** This method is to get the gcc country look up values. */
  getGccCountryList(isSaudiRequired = false): Observable<LovList> {
    const domainName = isSaudiRequired ? LookupDomainName.GCC_COUNTRY_WITH_SAUDI : LookupDomainName.GCC_COUNTRY;
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, domainName);
  }
  /** This method is used to fetch yes or list. */
  getYesOrNoList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MOF_PAYMENT);
  }
  /** This method is to fetch GCC Currency List. */
  getGccCurrencyList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.GCC_CURRENCY);
  }
  /** This method is to fetch government sector List. */
  getGovernmentSectorList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.GOVERNMENT_SECTOR);
  }
  /** This method is to get the receipt mode look up values. */
  getReceiptMode(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.RECEIPT_MODE);
  }
  /** This method is to get the adjustment reason look up values. */
  getAdjustmentReason(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.ADJUSTMENT_REASON);
  }
  /** This method is to get the Saudi bank list look up values. */
  getSaudiBankList(ibanNotMapped = false): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.BANK_NAME).pipe(
      map(res => {
        if (ibanNotMapped) {
          if (res?.items?.length) {
            res.items = res.items.filter(bank => LovConstants.ibanMappedSaudiBanks.indexOf(bank.value?.english) === -1);
          }
          return res;
        }
        return res;
      })
    );
  }
  /** This method is to fetch contributor leaving reason values for terminated. */
  getReasonForLeavingList(nationalityType?: string, autoReasonRequired = false): Observable<LovList> {
    const params: HttpParams = new HttpParams()
      .set('category', LookupCategory.REGISTRATION)
      .set('domainName', LookupDomainName.REASON_FOR_LEAVING)
      .set('nationality', nationalityType)
      .set('autoReasonRequired', autoReasonRequired ? 'true' : 'false');
    return this.getLookupByPath(null, params, false);
  }
  /** This method is to fetch contributor leaving reason values for terminating ppaEstablishment. */
  getReasonForLeavingListPpa(autoReasonRequired = false): Observable<LovList> {
    const params: HttpParams = new HttpParams()
      .set('category', LookupCategory.REGISTRATION)
      .set('domainName', LookupDomainName.REASON_FOR_LEAVING_PPA)
      .set('autoReasonRequired', autoReasonRequired ? 'true' : 'false');
    return this.getLookupByPath(null, params, false);
  }
  /** This method is to fetch contributor leaving reason values for terminate secondment & terminate studyleave. */
  getReasonForLeavingSecondment(autoReasonRequired = false): Observable<LovList> {
    const params: HttpParams = new HttpParams()
      .set('category', LookupCategory.REGISTRATION)
      .set('domainName', LookupDomainName.REASON_FOR_LEAVING_SECONDMENT)
      .set('autoReasonRequired', autoReasonRequired ? 'true' : 'false');
    return this.getLookupByPath(null, params, false);
  }
  /** This method is to get the Non Saudi bank list look up values. */
  //todo: duplicate method of getbank and getSaudiBankList
  getNonSaudiBankList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.GCC_BANK);
  }
  /** get establishment names of sin */
  //todo: move to establishment service
  getEstablishmentNameList(socialInsuranceNo): Observable<LovList> {
    return this.getLookupByPath(`/api/v1/contributor/${socialInsuranceNo}/establishment-name`, null, true);
  }
  /** This method is used to fetch GCC bank list. */
  getGCCBankList(bankName: string, discardOthers = false): Observable<LovList> {
    if (bankName)
      return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, bankName).pipe(
        map(res =>
          discardOthers ? new LovList(res?.items?.filter(item => item.value?.english !== IbanSaudiBank.OTHER)) : res
        )
      );
    return of(new LovList([]));
  }
  /** Method to get bank type Lov. */
  getBankType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.BANKTYPE);
  }
  /** This method is to get the establishment location look up values. */
  getEstablishmentLocationList() {
    return this.getLookupByPath(LookupPath.FIELD_OFFICE);
  }
  /** This method is to get the establishment status look up values. */
  getEstablishmentStatusList() {
    return this.getLookupByPath(LookupPath.ESTABLISHMENT_STATUS);
  }
  /** This method is to get the secondment-establishment look up values. */
  getSecondmentEstList() {
    return this.getLookupByPath(LookupPath.SECONDMENT_EST);
  }
  /** This method is fetch SecondmentEstablishmentType lookup values. */
  getSecondmentEstType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.SECONDMENT_EST_TYPE);
  }
  /** This method is to get the flag type and reason look up values.*/
  getFlagTypeList() {
    return this.getLookupByPath(LookupPath.FLAG_TYPE);
  }
  /** This method is to get the oh category look up values.*/
  getOhCategoryTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.OH_CATEGORY);
  }
  /** This method is to get the receipt status look up values. */
  getReceiptStatus(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.RECEIPT_STATUS);
  }
  /** Method to get reason for cancellation. */
  getReasonForCancellationList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.REASON_FOR_CANCELLATION);
  }
  /** This method is to fetch contributor leaving reason values for terminated. */
  getReasonForCancelEngagement(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.REASON_FOR_CANCELLATION_ENGAGEMENT
    );
  }
  /** Method to get reason for cancellation for PPA Engagements. */
  getPpaReasonForCancellationList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.REASON_FOR_CANCELLATION_PPA);
  }
  /** This method is to get payment status look up values. */
  getBillPaymentStatusList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.BILL_PAYMENT_STATUS);
  }
  /** Method to get government universities. */
  getGovernmentUniversities(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.GOVERNMENT_UNIVERSITIES);
  }
  /** This method is used to fetch yes or list*/
  getSaudiNonSaudi(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.CONTRIBUTOR_RESIDENCE);
  }
  /** This method is fetch return reasons lookup values for General Director.*/
  getCollectionReturnReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.GENERAL_DIRECTOR_TRANSACTION);
  }
  /** Method to get the Hijri Date for corresponding Gregorian Date */
  getHijriDate(gregorianDate: Date): Observable<GosiCalendar> {
    const url = `/api/v1/calendar/hijiri?gregorian=${convertToYYYYMMDD(gregorianDate.toString())}`;
    return this.http.get<GosiCalendar>(url);
  }
  /**
   * Method to get the Gregorian Date for corresponding Hijri Date.
   *
   * @param hijriDate should me in this format yyyy-mm-dd
   */
  getGregorianDate(hijriDate: string): Observable<GosiCalendar> {
    const url = `/api/v1/calendar/gregorian?hijiri=${hijriDate}`;
    return this.http.get<GosiCalendar>(url);
  }
  /** This method is to get the religion look up values. */
  getReligionList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.RELIGION);
  }
  /** This method is fetch return  lookup values for contribution sort field. */
  getContributionSortFieldsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.CONTRIBUTION_SORT_FIELD);
  }
  /** This method is used to fetch receipt sort field. */
  getReceiptSortFields(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.RECEIPT_SORT_FIELDS);
  }
  /*** This method is fetch return  lookup values for adjustment sort field.*/
  getAdjustmentSortFieldsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.ADJUSTMENT_SORT_FIELD);
  }

  /**
   * This method to get Annuity relationship list
   */
  getAnnuitiesRelationshipList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.ANNUITY_RELATIONSHIP);
  }
  /**
   * This method to get Annuity relationship list
   */
  getAnnuitiesModificationReasonForDependentsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.MODIFICATION_REASONS_FOR_DEP);
  }
  /**
   * This method to get Waive Benefit Towards
   */
  getWaiveBenefitTowardsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.WAIVE_BENEFIT_TOWARDS);
  }
  /**
   * This method to get Waive Heir Benefit Towards.
   */
  getWaiveHeirTowardsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.WAIVE_HEIR_BENEFIT_TOWARDS);
  }
  /**
   * This method to get Annuity relationship list
   */
  getAnnuitiesRelationshipByGender(gender: string, eligibleForPensionReform = false): Observable<LovList> {
    const domainName =
      eligibleForPensionReform === true || eligibleForPensionReform.toString() === 'true'
        ? LookupDomainName.ANNUITY_RELATIONSHIP_PENSION_REFORM
        : LookupDomainName.ANNUITY_RELATIONSHIP;
    return this.getLookupByDomainAndGender(LookupCategory.ANNUITIES, domainName, gender);
  }

  getMaritalStatusLookup(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MARITAL_STATUS);
  }

  /**
   * This method to get Annuity relationship list
   */
  getHeirStatusList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.HEIR_STATUS);
  }

  /**
   * This method is to get the deduction plan for annuity pension payment.
   */
  getAdditionalContributionPlan(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.ADDITIONAL_CONTRIBUTION_PLAN);
  }

  /**
   * This method is to get the payment mode for the annuity benefit payment transfer.
   */
  initialisePaymentMode(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.PAYMENT_MODE);
  }

  /**
   * This method is to get the payee type for the bank transfer.
   */
  initialisePayeeType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.PAYEE_TYPE);
  }
  /*** This method is fetch return  lookup values for Exceptional Penalty Waiver Reason .*/
  getExceptionalPenaltyWaiverReason(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.COLLECTION,
      LookupDomainName.EXCEPTIONAL_PENALTY_WAIVER_REASON
    );
  }
  /*** This method is fetch return  lookup values for adjustmen sort field.*/
  getMofContributionSortList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.THIRD_PARTY_SORT_FIELDS);
  } /* This method is to get the international country look up values. */
  getInternationalCountryList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.INTERNATIONALCOUNTRY);
  }
  getEstablishmentSegmentFilterList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.ESTABLISHMENT_SEGMENT_FILTER);
  }
  getSegmentsList(segments?: string): Observable<LovList> {
    return this.getLookupByPath(segments);
  }
  /* This method is to get the vic segment look up values. */
  getVicSegmentFilterList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.VIC_SEGMENT_FILTER);
  }
  getAllEntityFilter(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.ALL_ENTITES_SEGMENT_FILTER);
  }
  getPaymentTypeWavier(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.PAYMENT_TYPE_FOR_WAVIER);
  }
  getInstallmentStatusList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.INSTALLMENT_STATUS);
  }
  getEstablishmentTerminationPaymentType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.ESTABLISHMENT_TERMINATION_PAYMENT_TYPE
    );
  }
  getViolationRecord(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.VIOLATION_RECORD);
  }
  /** This method is to get purpose of registration for vic.*/
  getPurposeOfRegistrationList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.PURPOSE_OF_REGISTRATION);
  }
  /** This method is to get marital status. */
  getMaritalStatus(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MARITAL_STATUS);
  }
  /** This method is to get vic termination reason. */
  getVICTerminationReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.VIC_REASON_FOR_LEAVING);
  }
  getReactivateReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.REACTIVATE_ENGAGEMENT_REASON
    );
  }
  /*** This method is fetch return  lookup values for adjustment sort field.*/
  getCancelViolationsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.CANCEL_VIOLATION_REASON);
  }
  /*** This method is fetch return  lookup values for adjustment sort field.*/
  getModifyViolationsList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MODIFY_VIOLATION_REASON);
  }
  /** This method is fetch bank name with IBanCode. */
  getBankForIban(iBanCode): Observable<LovList> {
    const bankCode = ('0' + iBanCode).slice(-2);
    const path = `iban/${bankCode}`;
    const url = this.lovBaseUrl + '/' + path;
    return this.http.get<Lov>(url).pipe(map(lov => (lov ? new LovList([lov]) : new LovList([]))));
  }
  /** This method is to get vic cancellation reason.  */
  getVicReasonForCancellation(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.VIC_REASON_FOR_CANCELLATION);
  }
  /** This method is to get transfer  mode list. */
  getTransferModeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.TRANSFER_MODE);
  }
  /**This method is to get return disease reason list */
  getDiseaseReturnReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.DISEASE_RETURN_REASON);
  }

  getSortByList(): LovList {
    const lovlist: LovList = new LovList([]);
    let lov = new Lov();
    lov.value = SORT_START_DATE;
    lovlist.items.push(lov);
    lov = new Lov();
    lov.value = SORT_DAYS;
    lovlist.items.push(lov);
    return lovlist;
  }
  /** This method is to get credit retain  list. */
  getCreditRetainList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.CREDIT_RETAIN_INDICATOR);
  }
  /** This method is to get guarantee  list. */
  getInstallmentGuaranteeTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.INSTALLMENT_GUARANTEE_TYPE);
  }
  /** This method is to get guaranteetype banking  list. */
  getGuaranteetypeBankingList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.COLLECTION, LookupDomainName.GUARANTEE_TYPE_BANKING);
  }
  /** This method is to get guarantee type promissory note  list. */
  getGuaranteetypePromissoryNoteList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.COLLECTION,
      LookupDomainName.GUARANTEE_TYPE_PROMISSORY_NOTE
    );
  }
  /** This method is to get guarantee pension registered list. */
  getGuaranteetypePensionRegisteredList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.COLLECTION,
      LookupDomainName.GUARANTEE_TYPE_PENSION_REGISTERED
    );
  }
  /** This method is to get  guarantee pension out of market  list. */
  getGuaranteetypePensionOutOfMarketList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.COLLECTION,
      LookupDomainName.GUARANTEE_TYPE_PENSION_OUT_OFMARKET
    );
  }
  /** This method is to get guarantee type registered  list. */
  getGuaranteetypeOtherRegisteredList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.COLLECTION,
      LookupDomainName.GUARANTEE_TYPE_OTHER_REGISTERED
    );
  }
  /** This method is to get guarantee type registered  out of market list. */
  getGuaranteetypeOtherOutOfMarketList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.COLLECTION,
      LookupDomainName.GUARANTEE_TYPE_OTHER_OUT_OFMARKET
    );
  }
  /** This method is used to fetch inspection Type list. */
  getInspectionType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.INSPECTION_TYPE);
  }
  /**
   * Method to get values for contact us page
   * @param category
   * @param domainName
   */
  getContactLists(category: string, domainName: string): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(category, domainName);
  }
  /**
   * Method to get priority values for adding notes on any transaction
   * @param category
   * @param domainName
   */
  getPrioirtyList(category: string, domainName: string): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(category, domainName);
  }
  /** Method to get field office list*/
  getFieldOfficeList(isReturnFieldOfficeCode: boolean = false) {
    const params: HttpParams = new HttpParams().set('isReturnFieldOfficeCode', `${isReturnFieldOfficeCode}`);
    return this.getLookupByPath(LookupPath.FIELD_OFFICE, params);
  }
  /** Method to get field office details*/
  getFieldOfficeDetails(contactId: number): Observable<FieldOfficeDetails> {
    return this.http.get<FieldOfficeDetails>(`${this.lovBaseUrl}/contact/${contactId}`);
  }
  /** This method is to get annuity transfer  mode list. */
  getTransferModeDetails(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.TRANSFER_MODE);
  }
  /** This method is to get annuity requested by list . */
  getRequestedBy(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.TPA_REQUESTED_BY);
  }
  /** This method is to get annuity TPA adjustment percentage list . */
  getAdjustmentPercentageList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.TPA_ADJUSTMENT_PERCENTAGE);
  }
  /** This method is to get annuity adjustment reason list. */
  getAdjustmentReasonTpa(key): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, key);
  }
  /** This method is to get stooping reason list. */
  getReasonForStopping() {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.TPA_REASON_FOR_STOP);
  }
  /** This method is to get holding reason list. */
  getReasonForHolding() {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.TPA_REASON_FOR_HOLD);
  }
  /** This method is to get reactivating reason list. */
  getReasonForReactivating() {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.TPA_REASON_FOR_REACTIVATE);
  }
  /** This method is to get thirdparty rejection reason list. */
  getTpaRejectionReasonList() {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.TPA_REJECTION_REASON);
  }

  /** This method is to get medical board termination reason. */
  getTerminateContractReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.MB_TERMINATE_CONTRACT_REASON
    );
  }
  /** This method is fetch medical board validator return reason list. */
  getMedicalBoardReturnReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.MEDICAL_TRANSACTION_RETURN_REASON
    );
  }
  /** This method is fetch medical board validator reject reason list. */
  getMedicalBoardRejectReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.REGISTRATION,
      LookupDomainName.MEDICAL_TRANSACTION_REJECT_REASON
    );
  }

  /** This method is fetch hospital name*/
  getHospitalList(): Observable<LovList> {
    return this.getLookupByPath(LookupPath.HOSPITAL_LIST);
  }
  /** This method is to get modify coverage reason list. */
  getModifyCoverageReason(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MODIFY_COVERAGE_TYPE);
  }

  /**
   * Method to fetch unborn reason list
   */
  getUnbornModificationReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.ANNUITIES, LookupDomainName.UNBORN_MODIFICATION_REASON);
  }

  getSuspendSanedReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.SANED_CANCEL_REASON);
    /** This method is to get modify violation type. */
  }
  getModifyViolationType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MODIFIED_VIOLATION_TYPE);
  }
  /** This method is to get modify inspection type. */
  getModifyInspectionType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.VIOLATION_INSPECTION_TYPE);
  }
  /**This method is to get wrong benefits type */
  getWrongBenefitsType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.WRONG_BENEFITS_TYPE);
  }

  /** This method is to fetch nationality lookup values. */
  getDocumentList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.NATIONALITY);
  }

  /**This method is to get reopen est reasons */
  getReopenReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.REOPEN_EST_REASON);
  }
  /**This method is to get reopen est period */
  getReopenPeriodList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.REOPEN_EST_DAYS);
  }
  /**This method is to getPublicSectorSpecialistsList */
  getPublicSectorSpecialistsList(): Observable<Lov[]> {
    return this.getLovLookupByCategoryAndDomain(
      LookupCategory.COMPLAINTS,
      LookupDomainName.APPEAL_PUBLIC_SECTOR_SPECIALISTS
    );
  }
  /**This method is to getPrivateSectorSpecialistsList */
  getPrivateSectorSpecialistsList(): Observable<Lov[]> {
    return this.getLovLookupByCategoryAndDomain(
      LookupCategory.COMPLAINTS,
      LookupDomainName.APPEAL_PRIVATE_SECTOR_SPECIALISTS
    );
  }
  /**This method is to getAppealLegalOpinionList */
  getAppealLegalOpinionList(): Observable<Lov[]> {
    return this.getLovLookupByCategoryAndDomain(LookupCategory.COMPLAINTS, LookupDomainName.APPEAL_LEGAL_OPINION);
  }
  /**This method is to getAppealSearchList */
  getAppealSearchList(): Observable<Lov[]> {
    return this.getLovLookupByCategoryAndDomain(LookupCategory.COMPLAINTS, LookupDomainName.APPEAL_SEARCH);
  }

  /**This method is to getPublicSectorAppealSpecialist */
  getPublicSectorAppealSpecialist(): Observable<Lov[]> {
    return this.getLovLookupByCategoryAndDomain(
      LookupCategory.COMPLAINTS,
      LookupDomainName.APPEAL_PUBLIC_SECTOR_SPECIALISTS
    );
  }

  /**This method is to getPrivateSectorAppealSpecialist */
  getPrivateSectorAppealSpecialist(): Observable<Lov[]> {
    return this.getLovLookupByCategoryAndDomain(
      LookupCategory.COMPLAINTS,
      LookupDomainName.APPEAL_PRIVATE_SECTOR_SPECIALISTS
    );
  }
  /**This method is to getPrivateSectorAppealSpecialist */
  getAppealOnViolationSpecialist(): Observable<Lov[]> {
    return this.getLovLookupByCategoryAndDomain(
      LookupCategory.COMPLAINTS,
      LookupDomainName.APPEAL_ON_VIOLATION_SPECIALISTS
    );
  }

  /**method to fetch Contributor Enquiry Lov list */
  getContributorEnquiryLovList(): Observable<Lov[]> {
    const url = `/api/v1/lov?category=COMPLAINTS&domainName=ContributorEnquiry`;
    return this.http.get<Lov[]>(url);
  }
  getSessionSortBy(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MbSessionConfigurationSortType
    );
  }
  getMbAppealReasonList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_OCC_APPEAL_REASON);
  }
  getMBAssessmentChannelList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_ASSESSMENT_CHANNEL);
  }
  getMBAssessmentStatusList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_ASSESSMENT_STATUS);
  }
  getBodyPartsSourceTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_BODYPARTS_SOURCE_TYPE);
  }
  getHelperNeededList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_HELPER_NEEDED);
  }
  getMBInjuryTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_INJURY_TYPE);
  }
  getMBAssessmentTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.ASSESSMENT_TYPE);
  }
  getMBNonOccAssessmentResultList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_NONOCCASSESSMENT_RESULT);
  }
  getMbNonOccupationalReasonForAppealList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_NONOCCUPATIONAL_REASON_FOR_APPEAL
    );
  }
  getMBNonOccReasonForDisabilityList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_NONOCCREASON_FOR_DISABILITY
    );
  }
  getMBNonOccReasonForRescheduleAssessmentList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_NONOCCREASON_FOR_RESCHEDULE_ASSESSMENT
    );
  }
  getMBOccAssessmentResultList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_OCCASSESSMENT_RESULT);
  }
  getMBOccupationalReasonForAppealList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_OCCUPATIONAL_REASON_FOR_APPEAL
    );
  }
  getMBOccReasonForDisabilityList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_OCC_REASON_FOR_DISABILITY
    );
  }
  getMBOccReasonForRescheduleAssessmentList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_OCC_REASON_FOR_RESCHEDULE_ASSESSMENT
    );
  }
  getMBParticipantAttendanceList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_PARTICIPANT_ATTENDANCE);
  }
  getReasonForHelperList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.REASON_FOR_HELPER);
  }
  getMBParticipantStatusList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_PARTICIPANT_STATUS);
  }
  getMBParticipantTypeList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_PARTICIPANT_TYPE);
  }
  getMBReasonForRejectionList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.REASON_FOR_REJECTION);
  }
  getClarificationDocuments(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_CONTRIBUTOR_CLARIFICATION_DOCS
    );
  }
  /**
   * This method is to get Early Reassessment Reason
   */
  getEarlyReassessmentReason(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_EARLYREASSESSMENT_REASON
    );
  }
  getMbWithdrawReasonForAppealList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_REASON_FOR_WITHDRAW_APPEAL_LIST
    );
  }
  getEarlyReassessmentReject(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(
      LookupCategory.MEDICAL_BOARD,
      LookupDomainName.MB_EARLYREASSESSMENT_REJECT
    );
  }
  getPaymentStatusList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_PAYMENT);
  }
  getConveyanceRejection(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_CONVEYANCE_REJECT);
  }
  getInvestigation(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.MB_MEDICAL_INVESTIGATION);
  }
  getMBSessionStatusType(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_SESSION_STATUS_TYPE);
  }
  /** This method is to get opinion of appeal on vaiolation list. */
  getAovOpinionList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.APPEAL_OPINION);
  }
  /** This method is to get legal opinion of appeal on vaiolation list. */
  getAovLegalOpinionList(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION, LookupDomainName.APPEAL_LEGAL_OPINION);
  }
  getMbOfficeLocations(): Observable<LovList> {
    return this.getLookupByCategoryAndDomain(LookupCategory.MEDICAL_BOARD, LookupDomainName.MB_FIELD_OFFICE);
  }
  getCancelRpaReasons():Observable<LovList>{
    return this.getLookupByCategoryAndDomain(LookupCategory.REGISTRATION,LookupDomainName.CANCEL_RPA_REASONS)
  }
}
