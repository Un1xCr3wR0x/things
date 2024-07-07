import { Inject, Injectable } from '@angular/core';
import { AnnuityResponseDto, BilingualText, BulkParticipants, Contributor, InjuryWrapper, RouterData } from '../../models';
import { HttpClient } from '@angular/common/http';
import { ApplicationTypeToken } from '../../tokens/tokens';
import { ApplicationTypeEnum } from '../../enums';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AddVisitingDoctorService {
  private registrationNo: number;
  private socialInsuranceNo: number;
  id: number;
  routerData: RouterData;

  constructor(
    private http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    ) { }

  
  /**
   * This method is used to get the contributor details with only sin
   * @param sin
   */
  getContirbutorDetails(sin: number) {
    return this.http.get<Contributor>(`/api/v1/contributor/${sin}`);
  }
  getRegistrationNumber() {
    return this.registrationNo;
  }
  public getSocialInsuranceNo() {
    return this.socialInsuranceNo;
  }
  setIdForValidatorAction(id: number) {
    this.id = id;
  }
  //set registration number
  setRegistrationNo(registrationNo: number) {
    this.registrationNo = registrationNo;
  }
   //set social insurance number
   setSocialInsuranceNo(socialInsuranceNo: number) {
    this.socialInsuranceNo = socialInsuranceNo;
  }
  //setRouterData
  setRouterData(routerData: RouterData) {
    this.routerData = routerData;
  }
  //GetRouterData
  getRouterData() {
    return this.routerData;
  }
  
  /**
   * This method is used to get the lumpsum benefit request details
   * @param sin
   * @param benefitRequestId
   */
  getAnnuityBenefitRequestDetail(sin: number, benefitRequestId: number, referenceNo?) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
    return this.http.get<AnnuityResponseDto>(url);
  }

  getInjuryDetails(registrationNo: number, socialInsuranceNo: number, injuryId: number, isChangeRequired?: boolean) {
    if (socialInsuranceNo && registrationNo && injuryId) {
      let url = '';
      if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
        url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}?isChangeRequired=${isChangeRequired}`;
      } else
        url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}?isChangeRequired=${isChangeRequired}`;
      return this.http.get<InjuryWrapper>(url);
    }
  }
  getInjuryDetail(socialInsuranceNo,injuryId,isChangeRequired){
  const url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}?isChangeRequired=${isChangeRequired}`;
  return this.http.get<InjuryWrapper>(url);
  }
  addBulkParticipants(
    sessionId: number,
    request: BulkParticipants[],
    isReplaced = false
  ): Observable<BilingualText> {
    return this.http.post<BilingualText>(
      `/api/v1/mb-session/${sessionId}/add-participant?isReplaced=${isReplaced}&loginType=MBO`,
      request
    );
  }
}
