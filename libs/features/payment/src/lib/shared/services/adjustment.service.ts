import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  BeneficiaryList,
  SaveAdjustmentResponse,
  PersonalInformation,
  SadadOptionDetails,
  SadadResponseData,
  AdjustmentRepaySetValues,
  AdjustmentDetailsFilter,
  AdjustmentOtherPaymentDetails,
  AdjustmentRepaymentValidator,
  AdjustmentOtherPaymentResponse,
  RevertAdjustmentResponse,
  AdjustmentDetails,
  Adjustment,
  AdjustmentModification,
  AdjustmentPaymentDetails,
  AdjustmentRepayValidatorSetValues,
  AdjustmentRepaySetItems,
  BenefitDetails,
  HeirAdjustments,
  AnnuityResponseDto,
  HeirDirectPayment
} from '../models';
import { Observable } from 'rxjs';
import {
  DocumentItem,
  convertToYYYYMMDD,
  Lov,
  BPMUpdateRequest,
  WorkFlowActions,
  WorkflowService,
  LovList,
  Contributor
} from '@gosi-ui/core';
import { map } from 'rxjs/operators';
import { AdjustmentConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {
  modifyId;
  person;
  value;
  referenceNo;
  adjustmentRepayDetails: AdjustmentRepaySetValues;
  adjustmentRepayValues: AdjustmentRepaySetItems;
  beneficiaryList: BenefitDetails[];
  adjustmentRepayValidatorDetails: AdjustmentRepayValidatorSetValues;
  adjustmenturl: string;
  paramExists;
  pageName: string;
  activeTab = AdjustmentConstants.ADJUSTMENT_TABS[0].id;
  adjFormModified = false;

  private ReasonUrl = '/api/v1/lov';
  constructor(private http: HttpClient, readonly workflowService: WorkflowService) {}

  getAdjustmentsByStatus(identifier, status, sin): Observable<AdjustmentDetails> {
    const url = `/api/v1/beneficiary/${identifier}/adjustment/${sin}?status=${status}`;
    return this.http.get<AdjustmentDetails>(url);
  }
  getActiveDebitAdjustments(identifier, type, status1, status2, sin): Observable<AdjustmentDetails> {
    const url = `/api/v1/beneficiary/${identifier}/adjustment/${sin}?adjustmentType=${type}&status=${status1}&status=${status2}`;
    return this.http.get<AdjustmentDetails>(url);
  }
  getAdjustmentsByDualStatus(identifier, status1, status2, sin, benefitReqId?: number): Observable<AdjustmentDetails> {
    const url = `/api/v1/beneficiary/${identifier}/adjustment/${sin}`;
    let params = new HttpParams();
    if (status1) {
      params = params.append('status', status1);
    }
    if (status2) {
      params = params.append('status', status2);
    }
    if (benefitReqId) {
      params = params.append('benefitRequestId', benefitReqId.toString());
    }
    return this.http.get<AdjustmentDetails>(url, { params });
  }
  getAdjustmentByStatusAndType(identifier, paramObj, sin): Observable<AdjustmentDetails> {
    const urlByParam = `/api/v1/beneficiary/${identifier}/adjustment/${sin}?status=${paramObj.status}&benefitType=${paramObj.benefitType}`;
    return this.http.get<AdjustmentDetails>(urlByParam);
  }
  getAdjustmentByDualStatusAndType(identifier, paramObj, sin): Observable<AdjustmentDetails> {
    const urlByParam = `/api/v1/beneficiary/${identifier}/adjustment/${sin}?status=${paramObj.status1}&status=${paramObj.status2}&benefitType=${paramObj.benefitType}`;
    return this.http.get<AdjustmentDetails>(urlByParam);
  }
  /**
   * This method is used to get the adjutment details Id
   */
  getadjustmentBYId(identifier, adjustmentId, sin): Observable<Adjustment> {
    const adjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment/${sin}/adjustment-detail/${adjustmentId}`;
    return this.http.get<Adjustment>(adjustmentUrl);
  }
  adjustmentDetails(identifier, sin): Observable<AdjustmentDetails> {
    const adjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment/${sin}`;
    return this.http.get<AdjustmentDetails>(adjustmentUrl);
  }
  getAdjustByDetail(periodId: number, adjustFilter: AdjustmentDetailsFilter, sin): Observable<AdjustmentDetails> {
    this.adjustmenturl = `/api/v1/beneficiary/${periodId}/adjustment/${sin}`;
    const adjustmentStatusArry = adjustFilter.adjustmentStatus;
    const adjustmentTypeArry = adjustFilter.adjustmentType;
    const benefitTypeArray = adjustFilter.benefitType;
    let benefitRequestStartDate = null;
    let benefitRequestStopDate = null;
    let startDate = null;
    let stopDate = null;
    let adjustmentId = null;
    let sortType = null;
    let adjustmentSortParam = null;
    if (adjustFilter.startDate && adjustFilter.stopDate) {
      startDate = convertToYYYYMMDD(adjustFilter.startDate.toString());
      stopDate = convertToYYYYMMDD(adjustFilter.stopDate.toString());
    }
    if (adjustFilter.benefitRequestStartDate && adjustFilter.benefitRequestStopDate) {
      benefitRequestStartDate = convertToYYYYMMDD(adjustFilter.benefitRequestStartDate.toString());
      benefitRequestStopDate = convertToYYYYMMDD(adjustFilter.benefitRequestStopDate.toString());
    }
    if (adjustFilter.adjustmentId) {
      adjustmentId = adjustFilter.adjustmentId;
    }
    if (adjustFilter.adjustmentSortParam) {
      adjustmentSortParam = adjustFilter.adjustmentSortParam;
    }
    if (adjustFilter.sortType) {
      sortType = adjustFilter.sortType;
    }
    this.paramExists = false;
    this.setAdjustmentStatusParam(adjustmentStatusArry);
    this.setAdjustmentTypeParam(adjustmentTypeArry);
    this.setBenefitTypeParam(benefitTypeArray);
    this.setCreateDateParam(startDate, stopDate);
    this.setRequestDateParam(benefitRequestStartDate, benefitRequestStopDate);
    this.setAdjustmentIdParam(adjustmentId);
    this.setAdjustmentSortParam(adjustmentSortParam);
    this.setSortTypeParam(sortType);
    return this.http.get<AdjustmentDetails>(this.adjustmenturl);
  }
  hasvalidValue(val) {
    if (val !== null && val.length > 0) {
      return true;
    }
    return false;
  }
  setAdjustmentStatusParam(adjustmentStatusArry) {
    if (adjustmentStatusArry && this.hasvalidValue(adjustmentStatusArry)) {
      for (let i = 0; i < adjustmentStatusArry.length; i++) {
        if (this.paramExists) {
          const statusParam = `&status=${adjustmentStatusArry[i].english}`;
          this.adjustmenturl = this.adjustmenturl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `?status=${adjustmentStatusArry[i].english}`;
            this.adjustmenturl = this.adjustmenturl.concat(statusParam);
          } else {
            const statusParam = `&status=${adjustmentStatusArry[i].english}`;
            this.adjustmenturl = this.adjustmenturl.concat(statusParam);
          }
          this.paramExists = true;
        }
      }
    }
  }
  setAdjustmentTypeParam(adjustmentTypeArry) {
    if (adjustmentTypeArry && this.hasvalidValue(adjustmentTypeArry)) {
      for (let i = 0; i < adjustmentTypeArry.length; i++) {
        if (this.paramExists) {
          const typeParam = `&adjustmentType=${adjustmentTypeArry[i].english}`;
          this.adjustmenturl = this.adjustmenturl.concat(typeParam);
        } else {
          if (i === 0) {
            const typeParam = `?adjustmentType=${adjustmentTypeArry[i].english}`;
            this.adjustmenturl = this.adjustmenturl.concat(typeParam);
          } else {
            const typeParam = `&adjustmentType${adjustmentTypeArry[i].english}`;
            this.adjustmenturl = this.adjustmenturl.concat(typeParam);
          }
          this.paramExists = true;
        }
      }
    }
  }
  setBenefitTypeParam(benefitTypeArray) {
    // Benefit type param
    if (benefitTypeArray && this.hasvalidValue(benefitTypeArray)) {
      for (let i = 0; i < benefitTypeArray.length; i++) {
        if (this.paramExists) {
          const benefitParam = `&benefitType=${benefitTypeArray[i].english}`;
          this.adjustmenturl = this.adjustmenturl.concat(benefitParam);
        } else {
          if (i === 0) {
            const benefitParamNot = `?benefitType=${benefitTypeArray[i].english}`;
            this.adjustmenturl = this.adjustmenturl.concat(benefitParamNot);
          } else {
            const benefitParam = `&benefitType=${benefitTypeArray[i].english}`;
            this.adjustmenturl = this.adjustmenturl.concat(benefitParam);
          }
          this.paramExists = true;
        }
      }
    }
  }
  setCreateDateParam(startDate, stopDate) {
    if (startDate && stopDate) {
      if (this.paramExists) {
        const dateCreateParam = `&startDate=${startDate}&stopDate=${stopDate}`;
        this.adjustmenturl = this.adjustmenturl.concat(dateCreateParam);
      } else {
        const dateCreateParam = `?startDate=${startDate}&stopDate=${stopDate}`;
        this.adjustmenturl = this.adjustmenturl.concat(dateCreateParam);
        this.paramExists = true;
      }
    }
  }
  setRequestDateParam(benefitRequestStartDate, benefitRequestStopDate) {
    if (benefitRequestStartDate && benefitRequestStopDate) {
      if (this.paramExists) {
        const dateParam = `&benefitRequestStartDate=${benefitRequestStartDate}&benefitRequestStopDate=${benefitRequestStopDate}`;
        this.adjustmenturl = this.adjustmenturl.concat(dateParam);
      } else {
        const dateParam = `?benefitRequestStartDate=${benefitRequestStartDate}&benefitRequestStopDate=${benefitRequestStopDate}`;
        this.adjustmenturl = this.adjustmenturl.concat(dateParam);
        this.paramExists = true;
      }
    }
  }
  setAdjustmentIdParam(adjustmentId) {
    if (adjustmentId) {
      if (this.paramExists) {
        const adjustmentIdParam = `&adjustmentId=${adjustmentId}`;
        this.adjustmenturl = this.adjustmenturl.concat(adjustmentIdParam);
      } else {
        const dateCreateParamNot = `?adjustmentId=${adjustmentId}`;
        this.adjustmenturl = this.adjustmenturl.concat(dateCreateParamNot);
        this.paramExists = true;
      }
    }
  }
  setAdjustmentSortParam(adjustmentSortParam) {
    if (adjustmentSortParam) {
      if (this.paramExists) {
        const adjustmentSortUrl = `&adjustmentSortParam=${adjustmentSortParam}`;
        this.adjustmenturl = this.adjustmenturl.concat(adjustmentSortUrl);
      } else {
        const adjustmentSortUrlNot = `?adjustmentSortParam=${adjustmentSortParam}`;
        this.adjustmenturl = this.adjustmenturl.concat(adjustmentSortUrlNot);
        this.paramExists = true;
      }
    }
  }
  setSortTypeParam(sortType) {
    if (sortType) {
      if (this.paramExists) {
        const sortTypeUrl = `&sortType=${sortType}`;
        this.adjustmenturl = this.adjustmenturl.concat(sortTypeUrl);
      } else {
        const sortTypeNot = `?sortType=${sortType}`;
        this.adjustmenturl = this.adjustmenturl.concat(sortTypeNot);
        this.paramExists = true;
      }
    }
  }
  getBeneficiaryList(identifier, sin): Observable<BeneficiaryList> {
    const beneficiaryUrl = `/api/v1/beneficiary/${identifier}/benefit/${sin}`;
    return this.http.get<BeneficiaryList>(beneficiaryUrl);
  }
  saveAdjustments(identifier, adjustmentRequest, sin): Observable<SaveAdjustmentResponse> {
    const addAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment`;
    return this.http.post<SaveAdjustmentResponse>(addAdjustmentUrl, adjustmentRequest);
  }
  modifyAdjustments(identifier, adjustmentRequest, adjModificationId, sin): Observable<SaveAdjustmentResponse> {
    const addAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment/${adjModificationId}`;
    return this.http.put<SaveAdjustmentResponse>(addAdjustmentUrl, adjustmentRequest);
  }
  getAdjustmentByeligible(identifier, sin): Observable<AdjustmentModification> {
    const eligibleUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment`;
    return this.http.get<AdjustmentModification>(eligibleUrl);
  }
  getAdjustmentByBenefitType(identifier, type, sin) {
    const url = `/api/v1/beneficiary/${identifier}/adjustment/${sin}?benefitType=${type}`;
    return this.http.get<AdjustmentDetails>(url);
  }
  getPerson(personId): Observable<PersonalInformation> {
    const personUrl = `/api/v1/person/${personId}`;
    return this.http.get<PersonalInformation>(personUrl);
  }
  /* Method to get person details */
  getPersonDetails(sin, benefitRequestId): Observable<AnnuityResponseDto> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
    return this.http.get<AnnuityResponseDto>(url);
  }
  adjustmentValidator(personId, adjModificationId, sin, referenceNo?: number): Observable<AdjustmentDetails> {
    const validatorUrl = `/api/v1/beneficiary/${personId}/adjustment-modification/${sin}/maintain-adjustment/${adjModificationId}`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.append('referenceNumber', referenceNo.toString());
    }
    return this.http.get<AdjustmentDetails>(validatorUrl, { params });
  }
  adjustmentValidatorPayment(personId, adjModificationId, sin): Observable<AdjustmentPaymentDetails> {
    const paymentUrl = `/api/v1/beneficiary/${personId}/adjustment-modification/${sin}/maintain-adjustment/${adjModificationId}/direct-payment`;
    return this.http.get<AdjustmentPaymentDetails>(paymentUrl);
  }
  editDirectPayment(personId, adjModificationId, initiatePayment, sin) {
    const directPaymentUrl = `/api/v1/beneficiary/${personId}/adjustment-modification/${sin}/maintain-adjustment/${adjModificationId}/direct-payment?initiate=${initiatePayment}`;
    return this.http.put(directPaymentUrl, {});
  }
  editHeirDirectPayment(sin, requestId, adjModificationId, request: HeirDirectPayment) {
    const url = `/api/v1/contributor/${sin}/benefit/${requestId}/heir/adjustment-modification/${adjModificationId}/direct-payment`;
    return this.http.put(url, request);
  }
  submitAdjustmentDetails(identifier, adjModificationId, referenceNumber, comments, sin) {
    const submitAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment/${adjModificationId}`;
    return this.http.patch(submitAdjustmentUrl, {
      referenceNo: referenceNumber,
      comments: comments
    });
  }
  saveAndNextAdjustmentsRepay(identifier, adjustmentRequest, sin): Observable<SaveAdjustmentResponse> {
    const addAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-repay/${sin}/adjustment`;
    return this.http.post<SaveAdjustmentResponse>(addAdjustmentUrl, adjustmentRequest);
  }

  saveAndUpdateAdjustmentRepay(identifier, adjustmentRequest, sin): Observable<SaveAdjustmentResponse> {
    const url = `/api/v1/beneficiary/${identifier}/adjustment-repay/${sin}/adjustment`;
    return this.http.put<SaveAdjustmentResponse>(url, adjustmentRequest);
  }

  setAdjustmentRepayItems(data: AdjustmentRepaySetItems) {
    this.adjustmentRepayValues = data;
  }

  getAdjustmentRepayItems() {
    return this.adjustmentRepayValues;
  }
  setSourseId(data: BenefitDetails[]) {
    this.beneficiaryList = data;
  }
  getSourceId() {
    return this.beneficiaryList;
  }
  getPersonById(personId): Observable<Contributor> {
    if (personId) {
      const url = `/api/v1/contributor?personId=${personId}`;
      return this.http.get<Contributor>(url);
    }
  }
  /**
   * This method is used to sent POST call for sadad proceed to pay
   * @param personId
   * @param adjustmentRepayId
   * @param sadadPaymentDetails
   */
  proceedToPay(
    personId: number,
    adjustmentRepayId: number,
    sadadPaymentDetails: SadadOptionDetails,
    sin: number
  ): Observable<SadadResponseData> {
    if (personId && adjustmentRepayId) {
      const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${sin}/adjustment/${adjustmentRepayId}/generate-bill`;
      return this.http.post<SadadResponseData>(url, sadadPaymentDetails);
    }
  }

  getReqDocsForOtherPayment(isAppPrivate: boolean): Observable<DocumentItem[]> {
    if (isAppPrivate) {
      const url = '/api/v1/document/req-doc?transactionId=MNT_ADJUSTMENT_REPAYMENT&type=REQUEST_BENEFIT_FO';
      return this.http.get<DocumentItem[]>(url);
    } else {
      const url = '/api/v1/document/req-doc?transactionId=MNT_ADJUSTMENT_REPAYMENT&type=REQUEST_BENEFIT_GOL';
      return this.http.get<DocumentItem[]>(url);
    }
  }

  getReceiptMode(): Observable<Lov[]> {
    const url = `/api/v1/lov?category=Annuities&domainName=ReceiptMode`;
    return this.http.get<Lov[]>(url);
  }

  getBankLovList(): Observable<Lov[]> {
    const url = `/api/v1/lov?category=COLLECTION&domainName=SaudiArabiaBank`;
    return this.http.get<Lov[]>(url);
  }

  /**
   * This method is used to sent PATCH call for sadad submit
   * @param personId
   * @param adjustmentRepayId
   * @param sadadPaymentDetails
   */
  submitSadadPayment(
    personId: number,
    adjustmentRepayId: number,
    sadadPaymentDetails: SadadOptionDetails,
    sin: number
  ): Observable<SadadResponseData> {
    if (personId && adjustmentRepayId) {
      const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${sin}/adjustment/${adjustmentRepayId}`;
      return this.http.patch<SadadResponseData>(url, sadadPaymentDetails);
    }
  }

  /**
   * this api is called when user clicks on the proceed to pay button on the sadad payment
   * @param sin
   * @param benefitRequestId
   * @param sadadPaymentDetails
   */
  submitOtherPayment(
    personId: number,
    adjustmentRepayId: number,
    sadadPaymentDetails: AdjustmentOtherPaymentDetails,
    sin: number
  ): Observable<AdjustmentOtherPaymentResponse> {
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${sin}/adjustment/${adjustmentRepayId}/payment`;
    return this.http.post<AdjustmentOtherPaymentResponse>(url, sadadPaymentDetails);
  }

  revertAdjustmentRepayment(
    personId: number,
    adjustmentRepayId: number,
    referenceNo: number,
    isSadad: boolean,
    sin: number
  ): Observable<RevertAdjustmentResponse> {
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${sin}/adjustment/${adjustmentRepayId}/revert?referenceNo=${referenceNo}&isSadad=true`;
    return this.http.put<RevertAdjustmentResponse>(url, {});
  }
  cancelAdjustment(identifier, modificationId, referenceNumber, sin) {
    const cancelUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment/revert?adjModificationId=${modificationId}&referenceNo=${referenceNumber}`;
    return this.http.put(cancelUrl, {});
  }
  validatorModifysubmitOtherPayment(
    personId: number,
    adjustmentRepayId: number,
    sadadPaymentDetails: AdjustmentOtherPaymentDetails,
    sin: number
  ): Observable<AdjustmentOtherPaymentResponse> {
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${sin}/adjustment/${adjustmentRepayId}/payment`;
    return this.http.put<AdjustmentOtherPaymentResponse>(url, sadadPaymentDetails);
  }

  /**
   * This method is to fetch Adjustment Repayment Validator screen details
   */
  getAdjustmentRepaymentValidator(adjustmentRepayId: number, personId: number, referenceNo: number, sin: number) {
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${sin}/adjustment/${adjustmentRepayId}`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.get<AdjustmentRepaymentValidator>(url, { params });
  }

  updateAnnuityWorkflow(data: BPMUpdateRequest) {
    if (data.outcome === WorkFlowActions.SEND_FOR_INSPECTION || data.outcome === WorkFlowActions.REJECT) {
      return this.workflowService.mergeAndUpdateTask(data);
    } else {
      return this.workflowService.updateTaskWorkflow(data);
    }
  }
  /**
   * This method is to fetch validator rejection reason values.
   */
  getRejectReasonList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.ReasonUrl, {
        params: {
          category: 'REGISTRATION',
          domainName: 'ReasonForRejectionOfBen'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /**
   * This method is to fetch validator rejection reason values.
   */
  getReturnReasonList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.ReasonUrl, {
        params: {
          category: 'REGISTRATION',
          domainName: 'TransactionReturnReason'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /** This method is to get Dependent details */
  getAdjustmentRepayDetails() {
    return this.adjustmentRepayDetails;
  }
  /** This method is to set Dependent details */
  setAdjustmentRepayDetails(data: AdjustmentRepaySetValues) {
    this.adjustmentRepayDetails = data;
  }
  /** This method is to get Dependent details */
  getAdjustmentRepaymentValidatorDetails() {
    return this.adjustmentRepayValidatorDetails;
  }
  /** This method is to set Dependent details */
  setAdjustmentRepaymentValidatorDetails(data: AdjustmentRepayValidatorSetValues) {
    this.adjustmentRepayValidatorDetails = data;
  }

  setPageName(pageName: string) {
    this.pageName = pageName;
  }

  getPageName() {
    return this.pageName;
  }

  public set adjutmentId(id) {
    this.adjutmentId = id;
  }
  public get adjutmentId() {
    return this.adjutmentId;
  }
  public set adjModificationId(mid) {
    this.modifyId = mid;
  }
  public get adjModificationId() {
    return this.modifyId;
  }
  public set personId(pid) {
    this.person = pid;
  }
  public get personId() {
    return this.person;
  }
  public set adjustmentId(val) {
    this.value = val;
  }
  public get adjustmentId() {
    return this.value;
  }
  public get referenceNumber() {
    return this.referenceNo;
  }
  public set referenceNumber(referenceNumber) {
    this.referenceNo = referenceNumber;
  }
  getHeirAdjustments(sin, benefitRequestId): Observable<HeirAdjustments> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/adjustment-modification`;
    return this.http.get<HeirAdjustments>(url);
  }
  saveHeirAdjustment(sin, benefitRequestId, adjustmentRequest): Observable<SaveAdjustmentResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/adjustment-modification`;
    return this.http.post<SaveAdjustmentResponse>(url, adjustmentRequest);
  }
  editHeirAdjustment(sin, benefitRequestId, adjustmentRequest, adjModificationId): Observable<SaveAdjustmentResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/adjustment-modification/${adjModificationId}`;
    return this.http.put<SaveAdjustmentResponse>(url, adjustmentRequest);
  }
  submitHeirAdjustmentDetails(sin, benefitRequestId, adjModificationId, referenceNumber, comments) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/adjustment-modification/${adjModificationId}`;
    return this.http.patch(url, {
      referenceNo: referenceNumber,
      comments: comments
    });
  }
  getHeirAdjustmentById(sin, benefitRequestId, adjModification): Observable<HeirAdjustments> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/adjustment-modification/${adjModification}`;
    return this.http.get<HeirAdjustments>(url);
  }
}
