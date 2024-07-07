import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MiscellaneousPayment,
  PatchPaymentResponse,
  MiscellaneousPaymentRequest,
  AnnuityResponseDto,
  PersonDto,
  PaymentDetails
} from '../models';
import { BenefitConstants } from '../constants';
import {
  BPMUpdateRequest,
  WorkflowService,
  DocumentItem,
  convertToYYYYMMDD,
  LovList,
  Lov,
  RouterConstants,
  WorkFlowActions,
  Contributor,
  ApplicationTypeToken,
  CryptoService,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { AdjustmentDetails } from '../models/adjustment-details';
import { AdjustmentDetailsFilter } from '../models/adjustment-details-filter';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  bankInfo;
  isIndividualApp = false;
  adjustmenturl: string;
  paramExists;
  isUserSubmittedTransaction: Boolean;
  private paymentReasonUrl = '/api/v1/lov';
  constructor(
    private http: HttpClient,
    readonly workflowService: WorkflowService,
    readonly datePipe: DatePipe,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly cryptoService: CryptoService
  ) {}

  fetchPaymentdetails(identifier: number, sin: number): Observable<MiscellaneousPayment> {
    const paymentUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${sin}/direct-payment`;
    return this.http.get<MiscellaneousPayment>(paymentUrl);
  }
  fetchDirectPaymentHistory(identifier: number, sin: number): Observable<PaymentDetails> {
    const paymentUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${sin}/direct-payment/payment-history`;
    return this.http.get<PaymentDetails>(paymentUrl);
  }
  submitPaymentDetails(requestData, identifier, sin: number) {
    const paymentUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${sin}/direct-payment`;
    return this.http.post<MiscellaneousPayment>(paymentUrl, requestData);
  }
  editPaymentDetails(requestData, identifier, miscPaymentId, sin: number): Observable<PatchPaymentResponse> {
    const paymentPutUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${sin}/direct-payment/${miscPaymentId}`;
    return this.http.put<PatchPaymentResponse>(paymentPutUrl, requestData);
  }
  patchPaymentDetails(
    identifier,
    miscPaymentId,
    referenceNumber,
    comments,
    sin: number
  ): Observable<PatchPaymentResponse> {
    const paymentPatchUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${sin}/direct-payment/${miscPaymentId}`;
    return this.http.patch<PatchPaymentResponse>(paymentPatchUrl, {
      referenceNo: referenceNumber,
      comments: comments
    });
  }
  validatorDetails(identifier, miscPaymentId, sin: number): Observable<MiscellaneousPaymentRequest> {
    const val = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${sin}/direct-payment/${miscPaymentId}`;
    return this.http.get<MiscellaneousPaymentRequest>(val);
  }

  hasvalidValue(val) {
    if (val !== null && val.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * This method is used to get the adjutment details
   */
  getAdjustByDetail(periodId: number, adjustFilter: AdjustmentDetailsFilter): Observable<AdjustmentDetails> {
    this.adjustmenturl = `/api/v1/party/${periodId}/adjustment`;
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
    if (adjustFilter.startDate && adjustFilter.startDate) {
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
  /**
   * Method to handle workflow actions of annuity request.
   * @param data workflow data
   */
  handleAnnuityWorkflowActions(data: BPMUpdateRequest) {
    // return this.workflowService.updateTaskWorkflow(data);
    if (data.outcome === WorkFlowActions.SEND_FOR_INSPECTION || data.outcome === WorkFlowActions.REJECT) {
      return this.workflowService.mergeAndUpdateTask(data);
    } else {
      return this.workflowService.updateTaskWorkflow(data);
    }
  }
  getDocuments(referenceNo): Observable<DocumentItem[]> {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    const encryptedReferenceNo = this.cryptoService.encrypt(referenceNo);
    if (!this.isIndividualApp) {
      const docUrl = `/api/v1/document/scanned-documents?referenceNo=${referenceNo}`;
      return this.http.get<DocumentItem[]>(docUrl);
    } else {
      const docUrl = `/api/v1/document/scanned-documents?referenceNo=${encryptedReferenceNo}`;
      return this.http.get<DocumentItem[]>(docUrl);
    }
  }
  public set bankDetails(bankInfo) {
    this.bankInfo = bankInfo;
  }
  public get bankDetails() {
    return this.bankInfo;
  }
  /**
   * This method is to fetch saned rejection reason values.
   */
  getPaymentRejectReasonList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.paymentReasonUrl, {
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
  getPaymentReturnReasonList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.paymentReasonUrl, {
        params: {
          category: 'REGISTRATION',
          domainName: 'TransactionReturnReason'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }

  /**
   * This method is used to get the nin by passing  benefitRequestId
   * @param sin
   * @param benefitRequestId
   *
   */
  getActiveBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number): Observable<AnnuityResponseDto> {
    if (sin && benefitRequestId) {
      const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}?referenceNo=${referenceNo}`;
      return this.http.get<AnnuityResponseDto>(url);
    }
  }

  /**Method to set user submit repyment*/
  setIsUserSubmitted() {
    this.isUserSubmittedTransaction = true;
  }
  /**Method to return submitted transaction*/
  getIsUserSubmitted() {
    return this.isUserSubmittedTransaction;
  }

  /**
   * Method to sort Lovlist.
   * @param lovList lov list
   * @param isBank bank identifier
   * @param lang language
   */
  sortLovList(lovList: LovList, isBank: boolean, lang: string) {
    let other: Lov;
    let otherExcludedList: Lov[];
    if (isBank) {
      other = lovList.items.filter(item => BenefitConstants.OTHER_LIST.indexOf(item.value.english) !== -1)[0];
      otherExcludedList = lovList.items.filter(item => BenefitConstants.OTHER_LIST.indexOf(item.value.english) === -1);
      lovList.items = this.sortItems(otherExcludedList, isBank, lang);
      lovList.items.push(other);
    } else {
      lovList.items = this.sortItems(lovList.items, isBank, lang);
    }
    return { ...lovList };
  }

  /**
   * Method to sort items.
   * @param list list
   * @param isBank bank identifier
   * @param lang language
   */
  sortItems(list: Lov[], isBank: boolean, lang: string) {
    if (isBank) {
      if (lang === 'en') {
        list.sort((a, b) => {
          if (a.value.english !== 'Riyad Bank' && b.value.english !== 'Riyad Bank') {
            return a.value.english
              .toLowerCase()
              .replace(/\s/g, '')
              .localeCompare(b.value.english.toLowerCase().replace(/\s/g, ''));
          }
        });
      } else {
        list.sort((a, b) => {
          if (a.value.english !== 'Riyad Bank' && b.value.english !== 'Riyad Bank') {
            return a.value.arabic.localeCompare(b.value.arabic);
          }
        });
      }
    } else {
      if (lang === 'en') {
        list.sort((a, b) =>
          a.value.english
            .toLowerCase()
            .replace(/\s/g, '')
            .localeCompare(b.value.english.toLowerCase().replace(/\s/g, ''))
        );
      } else {
        list.sort((a, b) => a.value.arabic.localeCompare(b.value.arabic));
      }
    }
    return list;
  }

  /**
   * This method is to navigate to the inbox
   */
  navigateToInbox() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  revertPayment(identifier, miscPaymentId, referenceNo, sin: number) {
    const url = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${sin}/direct-payment/${miscPaymentId}/revert?referenceNo=${referenceNo}`;
    return this.http.put(url, {});
  }
  // getPersonByNin(nin): Observable<PersonDto>{
  //   if (nin) {
  //     const url = `/api/v1/person?NIN=${nin}`;
  //     return this.http.get<PersonDto>(url);
  //   }
  // }

  /** This method is to get personId

   */
  getPersonByNin(identifier): Observable<PersonDto> {
    const url = `/api/v1/person`;
    let params = new HttpParams();
    if (identifier) {
      const firstDigit = Number(String(identifier).charAt(0));
      if (firstDigit == 1) {
        params = params.set('NIN', identifier.toString());
      } else if (firstDigit == 2) {
        params = params.set('iqamaNo', identifier.toString());
      } else if (firstDigit == 3 || firstDigit == 4 || firstDigit == 5 || firstDigit == 6 || firstDigit == 7) {
        params = params.set('borderNo', identifier.toString());
      }
    }
    return this.http.get<PersonDto>(url, { params });
  }
}
