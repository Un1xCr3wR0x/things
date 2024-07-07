/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LovList,
  Lov,
  GosiCalendar,
  WizardItem,
  DocumentService,
  BilingualText,
  Transaction,
  CryptoService,
  DocumentItem
} from '@gosi-ui/core';
import { Observable, of } from 'rxjs';
import {
  BenefitResponse,
  UnemploymentResponseDto,
  BenefitDetails,
  ActiveBenefits,
  UiApply,
  SanedRecalculation,
  AnnuityResponseDto
} from '../models';
import { BenefitConstants } from '../constants';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SanedBenefitService {
  /**
   * Local Variables
   */
  status;

  private disabilityAssessmentId = null;
  private benefitRequestId = null;
  private socialInsuranceNumber = null;
  private nin = null;

  private sanedReasonUrl = '/api/v1/lov';
  constructor(
    private http: HttpClient,
    readonly router: Router,
    readonly cryptoService: CryptoService,
    readonly documentService: DocumentService
  ) {}

  /**
   * This method is used to get the benefit details
   * @param sin
   */
  getBenefitCalculationsForSaned(sin: number, requestDate?: GosiCalendar, benefitRequestId?: number) {
    let url = `/api/v1/contributor/${sin}/ui/calculate`;
    let params = new HttpParams();
    if (requestDate && requestDate.gregorian) {
      const momentObj = moment(requestDate.gregorian, 'YYYY-MM-DD');
      const reqDate = momentObj.format('YYYY-MM-DD');
      params = params.append('requestDate', reqDate);
    }
    if (benefitRequestId) {
      params = params.append('benefitRequestId', benefitRequestId.toString());
    }
    return this.http.get<BenefitDetails>(url, { params });
  }
  getReqDocsForAppeal(): Observable<DocumentItem[]> {
    const url = '/api/v1/document/req-doc?transactionId=APPEAL&type=MEDICAL_BOARD';
    return this.http.get<DocumentItem[]>(url);
  }
  getDisabilityAssessmentId() {
    return this.disabilityAssessmentId;
  }
  setDisabilityAssessmentId(disabilityAssessmentId) {
    this.disabilityAssessmentId = disabilityAssessmentId;
  }
  getbenefitRequestId() {
    return this.benefitRequestId;
  }
  setBenefitRequestId(benefitRequestId) {
    this.benefitRequestId = benefitRequestId;
  }
  getSocialInsuranceNumber() {
    return this.socialInsuranceNumber;
  }
  setSocialInsuranceNumber(sin) {
    this.socialInsuranceNumber = sin;
  }
  getNin() {
    return this.nin;
  }
  setNin(nin) {
    this.nin = nin;
  }
  /**
   * This method is used to apply for benefit
   * @param sin
   * @param requestDate
   */
  applySanedBenefit(sin: number, payload: UiApply) {
    const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {
      headers: httpHeaders
    };

    const url = `/api/v1/contributor/${sin}/ui`;
    return this.http.post<BenefitResponse>(url, payload, options);
  }
  /**
   * This method is used to update benefit
   * @param sin
   * @param requestDate
   * @param benefitRequestId
   * @param referenceNo
   */
  updateBenefit(sin: number, benefitRequestId: number, payload: UiApply) {
    if (sin) {
      const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      const options = {
        headers: httpHeaders
      };

      const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}`;
      return this.http.put<BenefitResponse>(url, payload, options);
    }
  }
  getOTPValidation(identifier: number, benefitRequestId: number, nin: number) {
    // getOTPValidation(identifier): Observable<BilingualText> {
    //   const url = `/api/v1/otp/${identifier}/generate`;
    //   return this.http.get<BilingualText>(url);
    const url = `/api/v1/contributor/${identifier}/benefit/${benefitRequestId}/verify`
    let params = new HttpParams();
    if (nin) { params = params.append('personIdentifier', nin.toString()); }
    return this.http.get(url, { params });
  }
  /** Method to verify OTP for contract. */
  verifyOTP(identifier: number, benefitRequestId: number, nin: number, xOtp: string) {
    const url = `/api/v1/contributor/${identifier}/benefit/${benefitRequestId}/verify`;
    let params = new HttpParams();
    if (nin) { params = params.append('personIdentifier', nin.toString()); }
    const headersXOTP = new HttpHeaders().set('x-otp', xOtp);
    return this.http.get(url, { headers: headersXOTP, params });
  }
  /**
   * This method is used to revert benefit
   * @param sin
   * @param benefitRequestId
   * @param referenceNo
   */
  revertBenefit(sin: number, benefitRequestId: number, referenceNo: number) {
    if (sin && benefitRequestId) {
      let payload;
      if (referenceNo) {
        payload = {
          referenceNo: referenceNo
        };
      }
      const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/revert`;
      return this.http.put<null>(url, payload);
    }
  }

  patchBenefit(sin: number, benefitRequestId: number, comment: { comments: string }, referenceNo: number) {
    const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {
      headers: httpHeaders
    };
    const payload = {
      referenceNo: referenceNo,
      comments: comment.comments || ''
    };
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}`;
    return this.http.patch<BenefitResponse>(url, payload, options);
  }

  /**
   * This method is used to get the benefit request details
   * @param sin
   * @param benefitRequestId
   *
   */
  getBenefitRequestDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.append('referenceNo', referenceNo.toString());
    }
    return this.http.get<UnemploymentResponseDto>(url, { params });
  }
  /** This method is used to get benefit recalculate details  */
  getBenefitRecalculateDetails(sin: number, benefitRequestId: number, referenceNo: Number) {
    const recalculateUrl = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/recalculation`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.append('referenceNo', referenceNo.toString());
    }
    return this.http.get<SanedRecalculation>(recalculateUrl, { params });
  }
  /**
   * This method is to fetch saned rejection reason values.
   */
  getSanedRejectReasonList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.sanedReasonUrl, {
        params: {
          category: 'REGISTRATION',
          domainName: 'ReasonForRejectionOfBen'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /**
   * This method is to fetch saned rejection reason values.
   */
  getSanedReturnReasonList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.sanedReasonUrl, {
        params: {
          category: 'REGISTRATION',
          domainName: 'TransactionReturnReason'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }

  /**
   * This method is to fetch annuity rejection reason values for validator.
   */
  getRejectReasonValidator(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.sanedReasonUrl, {
        params: {
          category: 'REGISTRATION',
          domainName: 'ReasonForRejectionOfBen'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /**
   * This method is to fetch saned rejection reason values for validator.
   */
  getSanedRejectReasonValidator(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.sanedReasonUrl, {
        params: {
          category: 'REGISTRATION',
          domainName: 'ReasonForRejectionOfSaned'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /**
   * This method is to fetch saned hold reason values.
   */
  getSanedHoldReasons() {
    const url = this.sanedReasonUrl;
    let params = new HttpParams();
    params = params.set('category', 'ANNUITIES');
    params = params.set('domainName', 'HoldBenefitReason');
    return this.http.get<BilingualText[]>(url, { params });
  }

  /**
   * This method is to get the progress wizard icons
   */
  getSanedWizardItems() {
    const wizardItems: WizardItem[] = [];
    const benefitsItem = new WizardItem(BenefitConstants.UI_SANED_DETAILS, 'Benefits');
    benefitsItem.isImage = true;
    wizardItems.push(benefitsItem);
    return wizardItems;
  }

  /**
   * This method is to get the progress wizard icons
   */
  getAppealWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push({ ...new WizardItem(BenefitConstants.UI_SANED_DETAILS, 'Benefits'), isImage: true });
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }

  //used to fetch active annuity benefits
  getBenefitsWithStatus(socialInsuranceNo: number, status: string[]): Observable<ActiveBenefits[]> {
    let params = new HttpParams();
    const uri = `/api/v1/contributor/${socialInsuranceNo}/benefit`;
    if (status.length) {
      status.forEach(eachStatus => {
        params = params.append('status', eachStatus);
      });
    }
    params = params.set('includeSaned', 'true');
    // params = params.append('status', status.join(', '));
    return this.http.get(uri, { params }).pipe(
      map(res => {
        const ret = <ActiveBenefits[]>res;
        return ret;
      })
    );
  }

  //used to fetch active annuity benefits of individuals
  getBenefitsOfIndividualWithStatus(socialInsuranceNo: number, status: string[]): Observable<ActiveBenefits[]> {
    let params = new HttpParams();
    const uri = `/api/v1/contributor/${socialInsuranceNo}/benefit`;
    if (status.length) {
      status.forEach(eachStatus => {
        params = params.append('status', eachStatus);
      });
    }
    params = params.set('includeSaned', 'true');
    return this.http.get(uri, { params }).pipe(
      map(res => {
        const ret = <ActiveBenefits[]>res;
        return ret;
      })
    );
  }
  getContributorVisit(sin: number) {
    const url = `/api/v1/contributor/${sin}/ui/contributor-visits`;
    return this.http.post(url, {});
  }

  //used to fetch active annuity benefits
  // getBenefitsInActiveAndDraft(socialInsuranceNo: number): Observable<ActiveBenefits[]> {
  //   const uri = `/api/v1/contributor/${socialInsuranceNo}/benefit?status=Active&status=Draft`;
  //   return this.http.get(uri).pipe(
  //     map(res => {
  //       const ret = <ActiveBenefits[]>res;
  //       return ret;
  //     })
  //   );
  // }
  // used to fetch active UI Benefits
  getActiveUiBenefits(socialInsuranceNo: number): Observable<ActiveBenefits[]> {
    const url = `/api/v1/contributor/${socialInsuranceNo}/ui`;
    return this.http.get(url).pipe(
      map(res => {
        const ret = <ActiveBenefits[]>res;
        return ret;
      })
    );
  }
  /** Method  to  get saned inspection  type */
  getSanedInspectionType(): Observable<LovList> {
    return of(
      new LovList([{ value: { english: 'Overlapping Engagement', arabic: 'المشاركة المتداخلة' }, sequence: 0 }])
    );
  }
  /** Method to edit direct payment status */
  editDirectPayment(sin, benefitRequestId, status) {
    const paymentUrl = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/recalculation/direct-payment?initiate=${status}`;
    return this.http.put(paymentUrl, {});
  }
  /** Method to edit benefit direct payment */
  editBenefitDirectPayment(sin, benefitRequestId, status) {
    const benefitPaymentUrl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/recalculation/direct-payment?initiate=${status}`;
    return this.http.put(benefitPaymentUrl, {});
  }
  /** Method to edit heir direct payment */
  editHeirDirectPayment(sin, benefitRequestId, status, directPaymentRequest) {
    const heirPaymentUrl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/recalculation/direct-payment?initiate=${status}`;
    return this.http.put(heirPaymentUrl, directPaymentRequest);
  }
  /** Method to get transaction id */
  getTransaction(transactionTraceId) {
    const encryptedId = this.cryptoService.encrypt(transactionTraceId);
    const getTxnUrl = `/api/v1/transaction/${encryptedId}`;
    return this.http.get<Transaction>(getTxnUrl);
  }
  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }
  getAmw(nin: number) {
    const url = `/api/v1/calculate-pension/GetContributorProfile/${nin}`;
    return this.http.get<AnnuityResponseDto>(url);
  }
  fetchHijiriYear() {
    const url = `/api/v1/calculate-pension/hijiri-year`;
    return this.http.get<number[]>(url);
  }
  getPensionCalculator(noDependents: number, hijiriYear: number, wagePercentage: number, nin: number, lang = 'en') {
    const langHeader = new HttpHeaders({ 'Accept-Language': lang });
    let url = `/api/v1/calculate-pension/${nin}`;
    let params = new HttpParams();
    // if (noDependents) {
    params = params.append('numberOfDependants', noDependents.toString());
    //}
    if (hijiriYear) {
      params = params.append('year', hijiriYear.toString());
    }
    //if (wagePercentage) {
    params = params.append('wageIncreasePersentage', wagePercentage.toString());
    //}
    return this.http.get<BenefitDetails>(url, { params, headers: langHeader });
  }
}
