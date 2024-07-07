import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AssessedBy,
  AssessmentResponseDto,
  BilingualText,
  DisabilityData,
  ServiceProviderAddressDto,
  contributorAssessmentResponse,
  MedicalBoardAssessmentRequest,
  ContributorAssessmenttRequestDto,
  AssessmentDetail,
  DisabilityDetails,
  MbAllowance,
  ReportsResponse
} from '../../models';
import moment from 'moment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicalboardAssessmentService {
  _isWithdraw: boolean;
  _disabilityAssessmentId: number;
  disabilityType: BilingualText;
  contractDoctor = false;
  private registrationNo: number;
  private socialInsuranceNo: number;
  private personId: number;
  private injuryId: number;
  private identifier: number;
  private isDatePassed: boolean;
  private isHoWorkitem: boolean;
  private iswithdraw: boolean;
  private isComplication: boolean;
  private fromOh = false;

  constructor(private http: HttpClient) {}
  public get isWithdraw() {
    return this._isWithdraw;
  }
  public set isWithdraw(isWithdraw) {
    this._isWithdraw = isWithdraw;
  }
  public get disabilityAssessmentId() {
    return this._disabilityAssessmentId;
  }
  public set disabilityAssessmentId(disabilityAssessmentId) {
    this._disabilityAssessmentId = disabilityAssessmentId;
  }
  public get assessmentType() {
    return this.disabilityType;
  }
  public set assessmentType(type) {
    this.disabilityType = type;
  }
  public set isContractDoctor(isContractDoctor) {
    this.contractDoctor = isContractDoctor;
  }
  public get isContractDoctor() {
    return this.contractDoctor;
  }
  setIsFromOh(isFromOh) {
    this.fromOh = isFromOh;
  }
  getIsFromOh() {
    return this.fromOh;
  }
  //get registration number
  getRegistrationNumber() {
    return this.registrationNo;
  }
  //set registration number
  setRegistrationNo(registrationNo: number) {
    this.registrationNo = registrationNo;
  }
  //get social insurance number
  public getSocialInsuranceNo() {
    return this.socialInsuranceNo;
  }
  //set social insurance number
  setSocialInsuranceNo(socialInsuranceNo: number) {
    this.socialInsuranceNo = socialInsuranceNo;
  }
  //get person id
  public getPersonId() {
    return this.personId;
  }
  // Method to set variable personid
  setPersonId(personId: number) {
    this.personId = personId;
  }

  getInjuryId() {
    return this.injuryId;
  }
  // Method to set variable injuryId
  setInjuryId(injuryId) {
    this.injuryId = injuryId;
  }
  public getDisabilityType() {
    return this.disabilityType;
  }
  //set identifier
  setIdentifier(identifier: number) {
    this.identifier = identifier;
  }
  //set if transaction is withdraw appeal
  public setIsWithdraw(iswithdraw: boolean) {
    this.iswithdraw = iswithdraw;
  }
  //set if appeal is from ho workitem
  setIsHoWorkitem(isHoWorkitem: boolean) {
    this.isHoWorkitem = isHoWorkitem;
  }
  //set if it is complication
  setIsComplication(isComplication: boolean) {
    this.isComplication = isComplication;
  }
  //set if 21 days is passed for appeal
  setAppealDate(isDatePassed: boolean) {
    this.isDatePassed = isDatePassed;
  }
  public getIdentifier() {
    return this.identifier;
  }
  public getAppealDate() {
    return this.isDatePassed;
  }
  public getIsWithdraw() {
    return this.iswithdraw;
  }
  getIsHoWorkitem() {
    return this.isHoWorkitem;
  }
  //isCompplication
  getIsComplication() {
    return this.isComplication;
  }

  submitAssessment(
    identifier: number,
    disabilityAssessmentId: number,
    request: ContributorAssessmenttRequestDto
  ): Observable<contributorAssessmentResponse> {
    const url = `/api/v1/participant/${identifier}/assessment-request/${disabilityAssessmentId}/approve?isReassessment=true`;
    return this.http.put<contributorAssessmentResponse>(url, request);
  }
  getServiceProviderAddress(identifier, hospitalName: BilingualText): Observable<ServiceProviderAddressDto> {
    let url = `/api/v1/participant/${identifier}/service-provider?`;
    if (hospitalName) {
      url += `hospitalName.arabic=${hospitalName.arabic}&hospitalName.english=${hospitalName.english}`;
    }
    return this.http.get<ServiceProviderAddressDto>(url);
  }
  // getPreviousDisability(
  //   identifier: number,
  //   nationalId?: number,
  //   assessmentType?: string

  // ): Observable<DisabilityDetailsDto> {
  //   const url = `/api/v1/participant/${identifier}/previous-disability-assessments`;
  //   let params = new HttpParams();
  //   if (nationalId && assessmentType) {
  //     params = params.set('identifier', nationalId.toString());
  //     params = params.set('assessmentType', assessmentType);
  //   }
  //   return this.http.get<DisabilityDetailsDto>(url, { params });
  // }j
  acceptContinueEntitlement(sin, occBenefitId, assessmentId): Observable<BilingualText> {
    let url = `/api/v1/contributor/${sin}/benefit/${occBenefitId}/disability-assignment/submit`;
    let params = new HttpParams();
    params = params.set('assessmentId', assessmentId);
    return this.http.patch<BilingualText>(url, null, { params });
  }
  getPreviousDisability(
    identifier: number,
    nationalId?: number,
    assessmentType?: string,
    assessmentsRequest?: MedicalBoardAssessmentRequest,
    assessedByDto?: AssessedBy,
    injuryId?: number,
    benefitReqId?:number
  ): Observable<DisabilityData> {
    const url = `/api/v1/participant/${identifier}/previous-disability-assessments`;
    let startDate = null;
    let endDate = null;

    let params = new HttpParams();
    if (assessmentsRequest?.pageSize) {
      params = params
        .set('pageNo', assessmentsRequest.pageNo.toString())
        .set('pageSize', assessmentsRequest.pageSize.toString());
    }
    if (nationalId && assessmentType) {
      // params = params.set('reqIdentifier', nationalId.toString());
      params = params.set('assessmentType', assessmentType);
    }
    if (assessmentsRequest?.searchKey) params = params.append('searchKey', assessmentsRequest?.searchKey.toString());
    // if (assessmentsRequest?.identifier) {
    //   params = params.set('reqIdentifier', nationalId.toString());
    // }
    if (assessmentsRequest?.assessmentType) {
      assessmentsRequest.assessmentType.forEach(data => {
        params = params.append('assessmentType', data.english);
      });
    }

    if (assessmentsRequest?.status) {
      assessmentsRequest.status.forEach(data => {
        params = params.append('status', data.english);
      });
    }
    if (assessmentsRequest?.medicalBoardType) {
      assessmentsRequest.medicalBoardType.forEach(data => {
        params = params.append('medicalBoardType', data.english);
      });
    }

    if (assessmentsRequest?.sessionPeriodFrom && assessmentsRequest?.sessionPeriodTo) {
      startDate = this.convertToDDMMYYYY(assessmentsRequest?.sessionPeriodFrom?.toString());
      endDate = this.convertToDDMMYYYY(assessmentsRequest?.sessionPeriodTo?.toString());
    }
    if (startDate && endDate) {
      params = params.append('startDate', startDate);
      params = params.append('endDate', endDate);
    }
    if (assessmentsRequest?.sortOrder) {
      params = params.set('sortOrder', assessmentsRequest.sortOrder);
    }
    if (assessedByDto?.isMbo) {
      params = params.set('isMbo', assessedByDto?.isMbo?.toString());
    }
    if (assessedByDto?.isContributor) {
      params = params.set('isParticipant', assessedByDto?.isContributor?.toString());
    }
    if (assessedByDto?.isHoDoctor) {
      params = params.set('isHoDoctor', assessedByDto?.isHoDoctor?.toString());
    }
    if (assessedByDto?.isMbManager) {
      params = params.set('isMbManager', assessedByDto?.isMbManager?.toString());
    }
    if (injuryId) {
      params = params.set('injuryId', injuryId?.toString());
    }
    if (benefitReqId) {
      params = params.set('benefitReqId', benefitReqId?.toString());
    }
    return this.http.get<DisabilityData>(url, { params });
  }
  submitAppealDetails(
    sin: number,
    disabilityAssessmentId: number,
    assessmentRequestDto,
    assessedByDto: boolean
  ): Observable<AssessmentResponseDto> {
    const url = `/api/v1/participant/${sin}/disability-assessment/${disabilityAssessmentId}/appeal`;
    let params = new HttpParams();
    // if (assessedByDto?.isContributor) {
    //   params = params.set('isParticipant', assessedByDto?.isContributor);
    // }
    // if (assessedByDto?.isMbo) {
    //   params = params.set('isMbo', assessedByDto?.isMbo);
    // }

    params = params.set('isHoDoctor', assessedByDto.toString());
    return this.http.post<AssessmentResponseDto>(url, assessmentRequestDto, { params });
  }
  appealAccept(identifier: number, disabilityAssessmentId: number): Observable<BilingualText> {
    const url = `/api/v1/participant/${identifier}/accept`;
    let params = new HttpParams();
    // assessmentId=${disabilityAssessmentId}&autoAccept=false
    params = params.set('assessmentId', disabilityAssessmentId.toString());
    params = params.set('autoAccept', 'false');
    return this.http.patch<BilingualText>(url, null, { params });
  }
  withdrawAppeal(sin: number, disabilityAssessmentId: number, assessmentRequestDto): Observable<BilingualText> {
    const url = `/api/v1/participant/${sin}/disability-assessment/${disabilityAssessmentId}/withdraw-appeal`;
    return this.http.post<BilingualText>(url, assessmentRequestDto);
  }

  convertToDDMMYYYY = function (date: string) {
    if (date) {
      return moment(date).format('DD-MM-YYYY');
    }
    return null;
  };
  /** Method to get assessment details */
  getAssessmentDetail(
    identifier: number,
    disabilityAssessmentId: number,
    referenceNo?: number
  ): Observable<AssessmentDetail> {
    const url = `/api/v1/participant/${identifier}/disability-assessment/${disabilityAssessmentId}`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.append('referenceNo', referenceNo.toString());
    }
    return this.http.get<AssessmentDetail>(url, { params });
  }
  getDisabilityDetails(identifier, assessmentRequestid: number): Observable<DisabilityDetails> {
    const url = `/api/v1/participant/${identifier}/assessment-request/${assessmentRequestid}`;
    return this.http.get<DisabilityDetails>(url);
  }
  reportDownload(identifier: String, reportDetails) {
    const url = `/api/v1/participant/${identifier}/report`;
    return this.http
      .post<Number>(url, reportDetails, { responseType: 'blob' as 'json' })
      .pipe(catchError(this.parseErrorBlob));
  }
  parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    const reader: FileReader = new FileReader();
    const obs = new Observable((observer: any) => {
      reader.onloadend = e => {
        observer.error(reader.result);
        observer.complete();
      };
    });
    reader.readAsText(err.error);
    return obs;
  }
  getContributoDocumentsAssesment(identifier, assessmentReqId, referenceNo): Observable<BilingualText[]> {
    const url = `/api/v1/participant/${identifier}/assessment-request/${assessmentReqId}/req-docs-contributor/${referenceNo}`;
    return this.http.get<BilingualText[]>(url);
  }
  // get allowance details for fc login
  getAllowanceDetails(identifier, mbAssessmentReqId?): Observable<MbAllowance> {
    // const url = `../../../assets/data/allowance.json`;
    const url = `/api/v1/payment/${identifier}/allowance`;
    let params = new HttpParams();
    if (mbAssessmentReqId) {
      params = params.set('mbAssessmentReqId', mbAssessmentReqId);
    }
    return this.http.get<MbAllowance>(url, { params });
  }
  getHospitalAddress(identifier): Observable<ServiceProviderAddressDto[]> {
    const url = `/api/v1/participant/${identifier}/fetch-provider`;
    return this.http.get<ServiceProviderAddressDto[]>(url);
  }
  getMedicalReportsTPA(
    resourceType,
    identifier?,
    assessmentRequestId?,
    referenceNo?,
    socialInsuranceNo?,
    injuryId?
  ): Observable<ReportsResponse> {
    let url = '';
    //scenario 1 :compllication and injury assessment (close injury TPA and close complication TPA)
    //  scenario 2: where assessment req id there
    resourceType === 'Close Complication TPA' || resourceType === 'Close Injury TPA'
      ? (url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}/transaction/${referenceNo}/tpa-req-docs`)
      : (url = `/api/v1/participant/${identifier}/assessment-request/${assessmentRequestId}/tpaReq-docs/${referenceNo}`);
    return this.http.get<ReportsResponse>(url);
  }
  saveOHDocumentTPA(socialInsuranceNo, injuryId, transactionId): Observable<BilingualText> {
    const url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}/transaction/${transactionId}`;
    return this.http.put<BilingualText>(url, null);
  }
  getOTPValidation(identifier): Observable<BilingualText> {
    const url = `/api/v1/participant/${identifier}/validateOtp`;
    return this.http.get<BilingualText>(url);
  }
  /** Method to verify OTP for contract. */
  verifyOTP(identifier: number, xOtp: string) {
    const url = `/api/v1/participant/${identifier}/validateOtp`;
    const headersXOTP = new HttpHeaders().set('x-otp', xOtp);
    return this.http.get(url, { headers: headersXOTP });
  }
  psychiatricDownload(identifier: String) {
    const url = `/api/v1/participant/${identifier}/downloadAssessmentDocument`;
    return this.http
      .get(url, { responseType: 'blob' as 'json' })
      .pipe(catchError(this.parseErrorBlob));
  }
}
