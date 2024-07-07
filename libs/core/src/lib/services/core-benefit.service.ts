import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BilingualText, CoreActiveBenefits, GosiCalendar, InspectionDetails } from '../models';
import { PersonWrapperDto, Contributor } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CoreBenefitService {
  savedActiveBenefit: CoreActiveBenefits;
  message: BilingualText;
  fromRecalculation = false;
  injuryId: number;
  isReopenCase = false;
  assessmentId: number;
  disabilityAssessmentId: number;
  regNo: number;
  benefitReqId: number;
  isBenefitRoute = false;
  nationalId = null;
  disabilityType = null;
  benefitDetailMB;
  mbAssessmentId:number;
  assessmentType:BilingualText;
  constructor(private http: HttpClient) {}
  getSavedActiveBenefit() {
    return this.savedActiveBenefit;
  }

  setActiveBenefit(data: CoreActiveBenefits) {
    this.savedActiveBenefit = data;
  }
  setBenefitAppliedMessage(message: BilingualText) {
    this.message = message;
  }
  getBenefitAppliedMessage() {
    return this.message;
  }
  /** getting system run date  */
  getSystemRunDate(): Observable<GosiCalendar> {
    return this.http.get<GosiCalendar>(`/api/v1/calendar/run-date`).pipe(catchError(err => this.handleError(err)));
  }

  setInjuryId(id: number) {
    this.injuryId = id;
  }
  getInjuryId() {
    return this.injuryId;
  }
  getPersonByNin(nin): Observable<PersonWrapperDto> {
    if (nin) {
      const url = `/api/v1/person?NIN=${nin}`;
      return this.http.get<PersonWrapperDto>(url);
    }
  }
  getPersonById(personId): Observable<Contributor> {
    if (personId) {
      const url = `/api/v1/contributor?personId=${personId}`;
      return this.http.get<Contributor>(url);
    }
  }
  setFromRecalculation(status) {
    this.fromRecalculation = status;
  }
  getOverlappedEngmt(sin?: number) {
    let params = new HttpParams();
    const url = `/api/v1/inspection`;
    if (sin) {
      params = params.set('socialInsuranceNo', sin.toString());
    }
    return this.http.get<InspectionDetails[]>(url, { params });
    // return this.http.get<InspectionDetails[]>(`/api/v1/inspection`).pipe(catchError(err => this.handleError(err)));
  }
  /**
   * Method to handle error while service call fails
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  public set assessmentRequestId(id) {
    this.assessmentId = id;
  }
  public get assessmentRequestId() {
    return this.assessmentId;
  }
  setPersonIdReqId(benefitDetail) {
    this.benefitDetailMB = benefitDetail;
  }
  getPersonIdReqId() {
    return this.benefitDetailMB;
  }
  public set registrationNo(regNo) {
    this.regNo = regNo;
  }
  public get registrationNo() {
    return this.regNo;
  }
  public get benefitRequestId() {
    return this.benefitReqId;
  }
  public set benefitRequestId(requestId) {
    this.benefitReqId = requestId;
  }
  setIsBenefitRoute(isBenefitRoute) {
    this.isBenefitRoute = isBenefitRoute;
  }
  getIsBenefitRoute() {
    return this.isBenefitRoute;
  }
  public set mbAssessment(id) {
    this.mbAssessmentId = id;
  }
  public get mbAssessment() {
    return this.mbAssessmentId;
  }
  public set mbAssessmentType(type) {
    this.assessmentType = type;
  }
  public get mbAssessmentType() {
    return this.assessmentType;
  }
}
