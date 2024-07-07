/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { ApplicationTypeToken, BilingualText, MobileDetails, LovList } from '@gosi-ui/core';
import { OhService } from './oh.service';
import { Disease, ReopenDisease } from '../models/disease-details';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError, filter } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DiseaseWrapper } from '../models/disease-wrapper';
import {
  AllowancePayee,
  Contributor,
  EngagementDetails,
  InjuryFeedback,
  Pagination,
  Person,
  PreviousMedicalboardAssessments
} from '../models';
import { OccupationDetails } from '../models/occupation';
import { EngagementsResponseDTO } from '../models/engagementsResponseDTO';
import { DiseaseHistory } from '../models/disease-history';

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {
  engagementDetailsCopy: EngagementDetails[];
  private url = '/api/v1/lov';
  navigationIndicator = 0;
  inProgress = false;
  statusEng: string[];
  specialtyArray: any;
  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    //TODO: remove oh service from here and pass values as params when calling methods
    readonly ohService: OhService
  ) {}

  /**
   *
   * @param reportDiseaseDetails Submiting the disease reported
   */
  reportDisease(reportDiseaseDetails: Disease, registerationNumber: number, isAppPublic?): Observable<number> {
    let url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease`;
    if (isAppPublic) {
      url = `/api/v1/establishment/${registerationNumber}/contributor/${this.ohService.getSocialInsuranceNo()}/disease`;
    }
    return this.http.post<number>(url, reportDiseaseDetails);
  }

  /**
   *
   *
   *
   * @param reportDiseaseDetails Submiting the Disease reported
   */
  updateDisease(reportDiseaseDetails: Disease, registerationNumber: number, isAppPublic?): Observable<number> {
    let req;
    let url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${reportDiseaseDetails.diseaseId}`;
    if (isAppPublic) {
      url = `/api/v1/establishment/${registerationNumber}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${
        reportDiseaseDetails.diseaseId
      }`;
    }
    req = new HttpRequest('PUT', url, reportDiseaseDetails, {
      reportProgress: true
    });
    return this.http.request<number>(req).pipe(
      map(event => {
        if (event && event.type === HttpEventType.Response) {
          this.inProgress = false;
          return event.body;
        } else {
          this.inProgress = true;
          return null;
        }
      }),
      filter(res => res !== null),
      catchError(err => this.handleError(err))
    );
  }
  private handleError(error: HttpErrorResponse) {
    this.inProgress = false;
    return throwError(error);
  }
  /**
   * This method is to get disease details
   * @param socialInsuranceNo
   * @param diseaseId
   */
  getDiseaseDetails(
    registerationNumber: number,
    socialInsuranceNo: number,
    diseaseId: number,
    isAppPublic?: boolean,
    isChangeRequired?: boolean
  ) {
    let url = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseId}?isChangeRequired=${isChangeRequired}`;
    if (isAppPublic) {
      url = `/api/v1/establishment/${registerationNumber}/contributor/${socialInsuranceNo}/disease/${diseaseId}`;
    }
    return this.http.get<DiseaseWrapper>(url);
  }
  /**
   *
   *
   * @param socialInsuranceNo
   * @param diseaseId
   * @param isChangeRequired
   */
  getModifiedDiseaseDetails(socialInsuranceNo: number, diseaseId: number, refNo: number) {
    if (socialInsuranceNo && diseaseId) {
      const url = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseId}/change-request/${refNo}`;
      return this.http.get<Disease>(url);
    }
  }
  saveReopenDisease(
    reopenReasonDetails: ReopenDisease,
    socialInsuranceNo: number,
    diseaseId: number
  ): Observable<ReopenDisease> {
    const Url = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseId}/reOpenDisease`;
    return this.http.put<ReopenDisease>(Url, reopenReasonDetails);
  }
  /**
   *Final submit of disease
   * @param diseaseNo
   */
  submitDisease(
    diseaseNo,
    actionFlag: boolean,
    comments,
    registeratonNumber: number,
    isTransferredInjury: boolean,
    transferInjuryId: number,
    referenceNo: number,
    isAppPublic?
  ): Observable<InjuryFeedback> {
    const diseaseNumber = {
      comments: comments,
      navigationIndicator: this.navigationIndicator,
      isTransferredInjury: isTransferredInjury,
      transferInjuryId: transferInjuryId,
      referenceNo: referenceNo
    };
    let submitDiseaseUrl = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${diseaseNo}/submit?isEdited=${actionFlag}`;
    if (isAppPublic) {
      submitDiseaseUrl = `/api/v1/establishment/${registeratonNumber}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${diseaseNo}/submit?isEdited=${actionFlag}`;
    }
    return this.http.patch<InjuryFeedback>(submitDiseaseUrl, diseaseNumber);
  }

  /**this method is to get diseaseId */

  getTransferDiseaseId(socialInsuranceNo: number, injuryId: number) {
    let getTransferUrl = `/api/v1/contributor/${socialInsuranceNo}/disease/${injuryId}/transferredInjury`;
    return this.http.get<DiseaseWrapper>(getTransferUrl);
  }
  /**
   *
   * @param indicator Setting Indicator for modify flow
   */
  setNavigationIndicator(indicator: number) {
    this.navigationIndicator = indicator;
  }
  /**
   * This method is to save emergency contact number for disease
   * @param contributor
   */

  saveEmergencyContactDisease(
    emergencyContact: MobileDetails,
    registerationNumber: number,
    isAppPublic?
  ): Observable<number> {
    let url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/emergency-contact`;
    if (isAppPublic) {
      url = `/api/v1/establishment/${registerationNumber}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/emergency-contact`;
    }
    return this.http.patch<number>(url, emergencyContact);
  }

  saveAllowancePayee(
    allowancePayeeType: number,
    navigationIndicator: number,
    registerationNumber: number,
    isAppPublic?,
    uuid?: string
  ): Observable<BilingualText> {
    const allowancePaye = {
      allowancePayee: allowancePayeeType,
      navigationIndicator: navigationIndicator,
      uuid: uuid,
      ohDate: null,
      ohType: null
    };
    let url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/allowance-payee`;
    if (isAppPublic) {
      url = `/api/v1/establishment/${registerationNumber}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/allowance-payee`;
    }
    return this.http.patch<BilingualText>(url, allowancePaye);
  }
  //Get Payee Details
  getPayeeDetails(
    socialInsuranceNo: number,
    payeeId: number,
    registerationNumber: number,
    isAppPublic?,
    isChangeRequired?: boolean
  ) {
    if (!isChangeRequired) {
      isChangeRequired = false;
    } else {
      isChangeRequired = true;
    }
    let url = `/api/v1/contributor/${socialInsuranceNo}/disease/${payeeId}/allowance-payee?isChangeRequired=${isChangeRequired}`;
    if (isAppPublic) {
      url = `/api/v1/establishment/${registerationNumber}/contributor/${socialInsuranceNo}/disease/${payeeId}/allowance-payee?isChangeRequired=${isChangeRequired}`;
    }
    return this.http.get<AllowancePayee>(url);
  }

  /**
   * This method is to get occupation details
   * @param socialInsuranceNo
   * @param diseaseId
   */
  getOccupationDetails(socialInsuranceNo: number) {
    if (socialInsuranceNo) {
      const url = `/api/v1/contributor/${socialInsuranceNo}/disease/engagement`;
      return this.http.get<OccupationDetails>(url);
    }
  }
  /**
   *
   * @param injuryType fetching the injury reason corosponding to injury type
   */
  getInjuryReason(injuryType: string): Observable<LovList> {
    const url = `/api/v1/establishment/injuryReason?typeName=${injuryType}`;
    return this.http.get<LovList>(url);
  }
  getEngagementOccupationDetails(
    socialInsuranceNo?: number,
    occupation?: string,
    registrationNo?: number,
    isIndividualApp?,
    isAppPrivate?
  ): Observable<EngagementsResponseDTO> {
    if (socialInsuranceNo) {
      let url;
      if (isAppPrivate || isIndividualApp) {
        url = `/api/v1/contributor/${socialInsuranceNo}/engagement-occupation`;
      } else {
        url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement-occupation`;
      }

      if (occupation) {
        url = url + '?occupation=' + occupation;
      }
      return this.http.get<EngagementsResponseDTO>(url);
    }
  }
  public getEngagementDetailsSaved() {
    return this.engagementDetailsCopy;
  }
  public setEngagementDetailsSaved(details: EngagementDetails[]) {
    return (this.engagementDetailsCopy = details);
  }
  /* @param indicator Setting Status for filter
   */
  setStatus(statusFilter: BilingualText[]) {
    if (statusFilter) {
      this.statusEng = statusFilter.map(items => items.english);
      if (this.statusEng.find(status => status === 'Closed')) {
        this.statusEng.push(
          'Cured With Disability',
          'Cured Without Disability',
          'Closed without continuing treatment',
          'Resulted in Death'
        );
      }
    } else {
      this.statusEng = null;
    }
  }
  /**
   * This method is used to generate filterparameters
   * @param socialInsuranceNumber
   */
  arrayToParams(paramKey, filterArray, finalParam, resultArr) {
    if (filterArray) {
      filterArray.forEach(element => {
        finalParam = paramKey + '=' + element;
        resultArr.push(finalParam);
      });
    } else {
      finalParam = paramKey + '=';
      resultArr.push(finalParam);
    }
    return resultArr;
  }
  /**
   * This method is used to get the Disease History
   * @param socialInsuranceNumber
   */
  getDiseaseHistory(
    registerationNumber: number,
    socialInsuranceNumber: number,
    ohType?: string,
    pagination?: Pagination,
    isIndividualApp?,
    isAppPrivate?
  ): Observable<DiseaseHistory[]> {
    let getDiseaseHistoryUrl = '';
    getDiseaseHistoryUrl = `/api/v1/establishment/${registerationNumber}/contributor/${socialInsuranceNumber}/disease`;
    if (isAppPrivate || isIndividualApp) {
      getDiseaseHistoryUrl = `/api/v1/contributor/${socialInsuranceNumber}/disease`;
    }

    let diseaseRequest = new Pagination();
    if (pagination) {
      diseaseRequest = pagination;
    }
    const isOtherEngInjuryReq = true;
    if (diseaseRequest) {
      if (this.statusEng) {
        const resultArr = [];
        this.arrayToParams('status', this.statusEng, null, resultArr);
        getDiseaseHistoryUrl = `${getDiseaseHistoryUrl}?isOtherEngInjuryReq=${isOtherEngInjuryReq}&ohType=${ohType}&pageNo=${
          diseaseRequest.page.pageNo
        }&pageSize=${diseaseRequest.page.size}&${resultArr.join('&')}`;
      } else {
        getDiseaseHistoryUrl = `${getDiseaseHistoryUrl}?isOtherEngInjuryReq=${isOtherEngInjuryReq}&ohType=${ohType}&pageNo=${diseaseRequest.page.pageNo}&pageSize=${diseaseRequest.page.size}`;
      }
    }
    return this.http.get<DiseaseHistory[]>(getDiseaseHistoryUrl);
  }
  updateAddress(personDetails: Person, socialInsuranceNo: number) {
    const addPersonUrl = `/api/v1/contributor/${socialInsuranceNo}/address`;
    return this.http.patch<Person>(addPersonUrl, personDetails.contactDetail);
  }
  /**
   * This method is to get contibutor details
   * @param socialInsuranceNo
   */
  getContributor(socialInsuranceNo): Observable<Contributor> {
    const url = `/api/v1/contributor/${socialInsuranceNo}`;
    return this.http.get<Contributor>(url);
  }

  getPreviousAssessmentDetails(
    socialInsuranceNo: number,
    diseaseId: number
  ): Observable<PreviousMedicalboardAssessments[]> {
    let url = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseId}/previous-assessment`;
    return this.http.get<PreviousMedicalboardAssessments[]>(url);
  }
  setSpecialityArray(specialtyArray: any) {
    this.specialtyArray = specialtyArray;
  }

  getSpecialtyArray() {
    return this.specialtyArray;
  }
}
