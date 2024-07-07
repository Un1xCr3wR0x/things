/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, MobileDetails } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { Complication, InjuryHistoryResponse } from '../models';
import { ComplicationSubmit } from '../models/complication-submit';
import { ComplicationWrapper } from '../models/complication-wrapper';
import { OhService } from './oh.service';

@Injectable({
  providedIn: 'root'
})
export class ComplicationService {
  /*Local variables */
  private complicationId: number;

  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) private appToken: string,
    readonly ohService: OhService
  ) {}

  /**
   *
   * @param socialInsuranceNo set complication Id
   */
  setComplicationId(complicationId) {
    this.complicationId = complicationId;
  }
  /**
   *
   * @param socialInsuranceNo set complication Id
   */
  getComplicationId() {
    return this.complicationId;
  }

  /**
   * Getting the complication Details
   */
  getComplication(
    registrationNo,
    socialInsuranceNo,
    injuryId,
    complicationId,
    isChangeRequired
  ): Observable<ComplicationWrapper> {
    if (registrationNo && socialInsuranceNo && injuryId && complicationId) {
      let getComplicationUrl = '';
      if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
        getComplicationUrl = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}/complication/${complicationId}?isChangeRequired=${isChangeRequired}`;
      } else
        getComplicationUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/complication/${complicationId}?isChangeRequired=${isChangeRequired}`;
      return this.http.get<ComplicationWrapper>(getComplicationUrl);
    }
  }
  getComplications(socialInsuranceNo, injuryId, complicationId, isChangeRequired): Observable<ComplicationWrapper> {
    const url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}/complication/${complicationId}?isChangeRequired=${isChangeRequired}`;
    return this.http.get<ComplicationWrapper>(url);
  }
  /**
   * Getting the complication Details
   */
  getModifiedComplicationDetails(
    registrationNo,
    socialInsuranceNo,
    injuryId,
    complicationId,
    refNo
  ): Observable<Complication> {
    const getComplicationUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/complication/${complicationId}/change-request/${refNo}`;
    return this.http.get<Complication>(getComplicationUrl);
  }

  /**
   *  this method is used to save complication details
   * @param reportComplicationDetails
   */
  saveComplication(reportComplicationDetails: Complication, isWorkFlow: boolean): Observable<number> {
    let url = '';
    if (isWorkFlow === false && !this.ohService.getComplicationId() && (this.appToken === ApplicationTypeEnum.PUBLIC || this.appToken === ApplicationTypeEnum.PRIVATE)) {
      url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${this.ohService.getInjuryId()}/complication`;
      return this.http.post<number>(url, reportComplicationDetails);
    } else if (
      isWorkFlow === false &&
      !this.ohService.getComplicationId() &&
      this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP
    ) {
      url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${this.ohService.getInjuryId()}/complication`;
      return this.http.post<number>(url, reportComplicationDetails);
    } else {
      return this.updateComplication(reportComplicationDetails);
    }
  }

  /**
   *
   * @param reportComplicationDetails update complication details
   */
  updateComplication(reportComplicationDetails): Observable<number> {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      const url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${this.ohService.getInjuryId()}/complication/${this.ohService.getComplicationId()}`;
      return this.http.put<number>(url, reportComplicationDetails);
    } else {
      const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${this.ohService.getInjuryId()}/complication/${this.ohService.getComplicationId()}`;
      return this.http.put<number>(url, reportComplicationDetails);
    }
  }

  /**
   * This method is to save emergency contact number for Complication
   * @param contributor
   */
  saveEmergencyContact(emergencyContact: MobileDetails, registrationNo?: number): Observable<number> {
    let params = new HttpParams();
    if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) {
      const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${this.ohService.getInjuryId()}/complication/${this.ohService.getComplicationId()}/emergency-contact`;
      return this.http.patch<number>(url, emergencyContact);
    } else {
      if (registrationNo) {
        params = params.append('registrationNo', registrationNo.toString());
      }
      const url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${this.ohService.getInjuryId()}/complication/${this.ohService.getComplicationId()}/emergency-contact`;
      return this.http.patch<number>(url, emergencyContact, { params });
    }
  }
  /**
   * This method is used to submit complication
   * @param complicationId
   * @param injuryId
   * @param actionflag
   * @param comments
   */
  submitComplication(
    complicationId,
    injuryId,
    actionflag,
    comments,
    registrationNo?: number
  ): Observable<ComplicationSubmit> {
    const complication = {
      comments: comments,
      navigationIndicator: this.ohService.getNavigationIndicator(),
      registrationNo: registrationNo
    };
    let params = new HttpParams();
    if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) {
      const submitComplicationUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${injuryId}/complication/${complicationId}/submit?isEdited=${actionflag}`;
      return this.http.patch<ComplicationSubmit>(submitComplicationUrl, complication);
    } else {
      // if (registrationNo) {
      //   params = params.append('registrationNo', registrationNo.toString());
      // }
      const submitComplicationUrl = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${injuryId}/complication/${complicationId}/submit?isEdited=${actionflag}`;
      return this.http.patch<ComplicationSubmit>(submitComplicationUrl, complication);
    }
  }
  /**
   * This method is used to get the complication details
   * @param socialInsuranceNo
   * @param injuryNo
   */

  getComplicationHistory(socialInsuranceNo: number, injuryNo: number): Observable<InjuryHistoryResponse> {
    let getInjuryComplicationUrl = '';
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP || this.appToken === ApplicationTypeEnum.PRIVATE) {
      getInjuryComplicationUrl = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryNo}/complication?isOtherEngInjuryReq=true`;
    } else {
      if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        getInjuryComplicationUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${socialInsuranceNo}/injury/${injuryNo}/complication?isOtherEngInjuryReq=false`;
      } 
    }
    return this.http.get<InjuryHistoryResponse>(getInjuryComplicationUrl);
  }

  /**
   *  this method is used to save disease complication details
   * @param reportComplicationDetails
   */
  saveDiseaseComplication(reportComplicationDetails: Complication): Observable<number> {
      let url = '';
      if (!this.ohService.getComplicationId() && (this.appToken === ApplicationTypeEnum.PUBLIC)) {
        url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/complication`;
        return this.http.post<number>(url, reportComplicationDetails);
      } else if (!this.ohService.getComplicationId() && (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP || this.appToken === ApplicationTypeEnum.PRIVATE)
      ) {
        url =  url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/complication`;
        return this.http.post<number>(url, reportComplicationDetails);
      } else {
        return this.updateDiseaseComplication(reportComplicationDetails);
      }
  }
  /**
   *
   * @param reportComplicationDetails update complication details
   */
  updateDiseaseComplication(reportComplicationDetails): Observable<number> {
      if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP || this.appToken === ApplicationTypeEnum.PRIVATE) {
        const url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/complication/${this.ohService.getComplicationId()}`;
        return this.http.put<number>(url, reportComplicationDetails);
      } else {
        const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/complication/${this.ohService.getComplicationId()}`;
        return this.http.put<number>(url, reportComplicationDetails);
      }
  }
  /**
   * This method is to save diseaseemergency contact number for Complication
   * @param contributor
   */
  emergencyContactSave(emergencyContact: MobileDetails, registrationNo?: number): Observable<number> {
    let params = new HttpParams();
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP || this.appToken === ApplicationTypeEnum.PRIVATE) {
      const url = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/complication/${this.ohService.getComplicationId()}/emergency-contact`;
      return this.http.patch<number>(url, emergencyContact, { params });
    }
    else{
      const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${this.ohService.getDiseaseId()}/complication/${this.ohService.getComplicationId()}/emergency-contact`;
      return this.http.patch<number>(url, emergencyContact, { params }); 
    }  
  }
  /**
   * This method is used to disease submit complication
   * @param complicationId
   * @param injuryId
   * @param actionflag
   * @param comments
   */
  submitDiseaseComplication(
    diseaseId,
    complicationId,
    actionflag,
    comments,
    registrationNo?: number
  ): Observable<ComplicationSubmit> {
    const complication = {
      comments: comments,
      navigationIndicator: this.ohService.getNavigationIndicator(),
      registrationNo: registrationNo
    };
      let params = new HttpParams();
      if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        const submitComplicationUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${diseaseId}/complication/${complicationId}/submit?isEdited=${actionflag}`;
        return this.http.patch<ComplicationSubmit>(submitComplicationUrl, complication);
      } else {
        const submitComplicationUrl = `/api/v1/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${diseaseId}/complication/${complicationId}/submit?isEdited=${actionflag}`;
        return this.http.patch<ComplicationSubmit>(submitComplicationUrl, complication);
      }
  }

  getDiseaseComplicationHistory(socialInsuranceNo: number, diseaseNo: number): Observable<any> {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/disease/${diseaseNo}/complication?isOtherEngInjuryReq=true`;
      return this.http.get<any>(url);
    } else {
      const url = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseNo}/complication?isOtherEngInjuryReq=true`;
      return this.http.get<any>(url);
    }
  }
   /**
   * Getting the complication Details
   */
   getHistoryComplication(
    registrationNo,
    socialInsuranceNo,
    diseaseNo,
    complicationId,
  ): Observable<any> {
      let getComplicationUrl = '';
      if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        getComplicationUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/disease/${diseaseNo}/complication/${complicationId}`;
      } else {
      getComplicationUrl = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseNo}/complication/${complicationId}`;
      }
      return this.http.get<any>(getComplicationUrl);
  }
}
