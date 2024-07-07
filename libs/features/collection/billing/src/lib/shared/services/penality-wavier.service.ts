import { Injectable } from '@angular/core';
import {
  BulkPenaltyEntityCountDetails,
  PenalityWavier,
  PenaltyWaiverRequest,
  PenaltyWaiverSegmentRequest,
  WaiverSummaryDetails
} from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BPMUpdateRequest, BilingualText, LovList, Lov, AuthTokenService } from '@gosi-ui/core';
import { TransactionOutcome } from '../enums';
import { BillingConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class PenalityWavierService {
  penalityWaiverReason: BilingualText = new BilingualText();
  penalityotherReason: string;
  establishmentSegments: string;
  vicSegments: BilingualText = new BilingualText();
  selectedSegments: BilingualText[];
  fileContent = [];
  entitySegments: BilingualText = new BilingualText();

  penalityWaiverDetails: PenalityWavier = new PenalityWavier();
  /**
   * Creates an instance of DetailedBillService
   * @param http HttpClient
   */
  constructor(readonly http: HttpClient,
    readonly tokenService: AuthTokenService) {}

  /**Methode to set penalityWaiverReason */
  setPenalityWaiverReason(reason: BilingualText) {
    this.penalityWaiverReason = reason;
  }
  /**Methode to return penalityWaiverReason */
  getPenalityWaiverReason() {
    return this.penalityWaiverReason;
  }
  /**Methode to set penalityWaiverReason */
  setPenalityWaiverBulkFileContent(fileContent) {
    this.fileContent = [];
    this.fileContent = fileContent;
  }
  /**Methode to return penalityWaiverReason */
  getPenalityWaiverBulkFileContent() {
    return this.fileContent;
  }
  /**Methode to set penalityWaiverReason */
  setPenalityWaiverDetails(details: PenalityWavier) {
    this.penalityWaiverDetails = details;
  }
  /**Methode to return penalityWaiverReason */
  getPenalityWaiverDetails() {
    return this.penalityWaiverDetails;
  }

  /**Methode to set penalityWaiverOtherReason */
  setPenalityWaiverOtherReason(otherReason) {
    this.penalityotherReason = otherReason;
  }
  /**Methode to return penalityWaiverOtherReason */
  getPenalityWaiverOtherReason() {
    return this.penalityotherReason;
  }
  /**Methode to set allsegments */
  setAllEntitySegments(entitySegments) {
    this.entitySegments = entitySegments;
  }
  /**Methode to return penalityWaiverOtherReason */
  getAllEntitySegments() {
    return this.entitySegments;
  }

  /**Methode to set penalityWaiverOtherReason */
  setEstablishmentSegments(establishmentSegments) {
    this.establishmentSegments = establishmentSegments;
  }
  /**Methode to return penalityWaiverOtherReason */
  getEstablishmentSegments() {
    return this.establishmentSegments;
  }
  /**Methode to set penalityWaiverOtherReason */
  setVicSegments(vicSegments) {
    this.vicSegments = vicSegments;
  }
  /**Methode to return penalityWaiverOtherReason */
  getVicSegments() {
    return this.vicSegments;
  }
  /**Methode to set penalityWaiverOtherReason */
  setSegments(segments) {
    this.selectedSegments = segments;
  }
  /**Methode to return penalityWaiverOtherReason */
  getSegments() {
    return this.selectedSegments;
  }

  /**
   * This method is to get wavier penality details
   * @param registrationNo registratio nNo
   */
  getWavierPenalityDetails(registrationNo: number, waiveOffType: string, fromDate?, toDate?) {
    let url = `/api/v1/establishment/${registrationNo}/penalty-waiver/quote?includeHistory=true&waiveOffType=${waiveOffType}`;
    if (fromDate !== undefined) {
      url = url + `&waiveFrom=${fromDate}`;
    }
    if (toDate !== undefined) {
      url = url + `&waiveTo=${toDate}`;
    }
    return this.http.get<PenalityWavier>(url);
  }
  getWaiverSummaryDetails(registrationNo: number) {
    let url = `/api/v1/establishment/${registrationNo}/penalty-waiver/history`;
    return this.http.get<WaiverSummaryDetails>(url);
  }
  /**
   * This method is to save wavier penality details
   * @param registrationNo registration No
   */
  submitWavierPenalityDetails(registrationNo: number, penaltyWaiverDetails: PenaltyWaiverRequest) {
    const url = `/api/v1/establishment/${registrationNo}/penalty-waiver`;
    return this.http.post<PaymentResponse>(url, penaltyWaiverDetails);
  }
  GenerateTrainingDoc(registrationNo: number, language: string ){
    const url = `/api/v1/establishment/${registrationNo}/penalty-waiver/training-doc?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
   }
  /**
   * This method is to save wavier penality details
   * @param penaltyWaiverDetails registration No
   */
  submitWavierPenalitySegmentDetails(penaltyWaiverDetails) {
    const url = `/api/v1/bulk-penalty-waiver`;
    return this.http.post<PenaltyWaiverSegmentRequest>(url, penaltyWaiverDetails);
  }

  /**
   * This method is to save wavier penality details
   * @param registrationNo registration No
   */
  submitVicWavierPenalityDetails(sinNo: number, penaltyWaiverDetails: PenaltyWaiverRequest) {
    const url = `/api/v1/contributor/${sinNo}/penalty-waiver`;
    return this.http.post<PaymentResponse>(url, penaltyWaiverDetails);
  }
  /**
   * This method is to gett penalty waiver details for view
   * @param registerationNo registration No
   *  @param waiverId waiver Id
   */
  getWavierPenalityDetailsForView(registrationNo: number, waiverId: number) {
    const url = `/api/v1/establishment/${registrationNo}/penalty-waiver/${waiverId}`;
    return this.http.get<PenalityWavier>(url);
  }
  /** Method to handle workflow actions. */
  handleWorkflowActions(data: BPMUpdateRequest) {
    const url = `/api/process-manager/v1/taskservice/update`;
    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${data.user}`
      })
    };

    const payload = {
      taskId: data.taskId,
      outcome: data.outcome
    };
    return this.http.post<BilingualText>(url, payload, httpOptions);
  }
  /**
   * Method to submit paymet details after workflow edit.
   * @param taskId task d of transaction
   * @param workflowUser user
   */
  submitAfterEditforWaivePenalty(taskId: string, workflowUser: string) {
    const submitWaiverPenalty = `/api/process-manager/v1/taskservice/update`;
    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${workflowUser}`
      })
    };
    const payload = {
      taskId: taskId,
      outcome: TransactionOutcome.SUBMIT
    };
    return this.http.post<BilingualText>(submitWaiverPenalty, payload, httpOptions);
  }
  /**
   * This method is to get vic wavier penality details
   * @param sinNo sin No
   */
  getVicWavierPenalityDetails(sinNo: number, waiveOffType: string, fromDate?, toDate?) {
    let url = `/api/v1/contributor/${sinNo}/penalty-waiver/quote?includeHistory=true&waiveOffType=${waiveOffType}`;
    if (fromDate !== undefined) {
      url = url + `&waiveFrom=${fromDate}`;
    }
    if (toDate !== undefined) {
      url = url + `&waiveTo=${toDate}`;
    }
    return this.http.get<PenalityWavier>(url);
  }
  /**
   * This method is to submit details after approve
   * @param sinNo sin No
   */
  submitDetailsAfterEdit(idNumber: number, penaltyWaiverId: number, penaltyWaiverDetails: PenaltyWaiverRequest) {
    const url = `/api/v1/establishment/${idNumber}/penalty-waiver/${penaltyWaiverId}`;
    return this.http.patch<PaymentResponse>(url, penaltyWaiverDetails);
  }
  /**
   * This method is to gett penalty waiver details for view
   * @param registerationNo registration No
   *  @param waiverId waiver Id
   */
  getExceptionalVicDetails(socialInsurancenumber: number, waiverId: number) {
    const url = `/api/v1/contributor/${socialInsurancenumber}/penalty-waiver/${waiverId}`;
    return this.http.get<PenalityWavier>(url);
  }

  /**
   * This method is to get bulk penalty waiver details for view
   *  @param waiverId waiver Id
   */
  getExceptionalBulkDetails(waiverId: number) {
    const url = `/api/v1/bulk-penalty-waiver/${waiverId}`;
    return this.http.get<PenaltyWaiverSegmentRequest>(url);
  }
  /**
   * This method is to gett penalty waiver details for view
   * @param registerationNo registration No
   *  @param waiverId waiver Id
   */
  penaltyWaiverRevert(registerNumber: number, penaltyWaiverId: number) {
    const url = `/api/v1/establishment/${registerNumber}/penalty-waiver/${penaltyWaiverId}/revert`;
    return this.http.put<number>(url, null);
  }

  /**
   * This method is to get bulk penalty waiver details for vic, establishment and both.
   */
  getBulkPenaltyWaiverQuote(segmentCriteria: string, segmentCriteriaValues: string, waiverEntityType: string) {
    const url = `/api/v1/bulk-penalty-waiver/quote?segmentCriteria=${segmentCriteria}&${segmentCriteriaValues}&waiverEntityType=${waiverEntityType}`;
    return this.http.get<BulkPenaltyEntityCountDetails>(url);
  }

  /**
   * This method is to get bulk penalty waiver details for entity type all
   */
  getBulkPenaltyWaiverQuoteForAll(segmentCriteria: string, waiverEntityType: string) {
    const url = `/api/v1/bulk-penalty-waiver/quote?segmentCriteria=${segmentCriteria}&waiverEntityType=${waiverEntityType}`;
    return this.http.get<BulkPenaltyEntityCountDetails>(url);
  }
  /**
   * Method to sort Lovlist.
   * @param lovList lov list
   * @param lang language
   * @param otherValue boolean
   */
  sortLovList(lovList: LovList, otherValue: boolean, lang: string) {
    let other: Lov;
    let otherExcludedDatas: Lov[];
    if (otherValue) {
      other = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) !== -1)[0];
      otherExcludedDatas = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) === -1);
      lovList.items = this.sortItems(otherExcludedDatas, lang);
      lovList.items.push(other);
    } else {
      lovList.items = this.sortItems(lovList.items, lang);
    }
    return { ...lovList };
  }
  /**
   * Method to sort items.
   * @param list list
   * @param isBank bank identifier
   * @param lang language
   */
  sortItems(list: Lov[], lang: string) {
    if (lang === 'en') {
      list.sort((a, b) =>
        a.value.english.toLowerCase().replace(/\s/g, '').localeCompare(b.value.english.toLowerCase().replace(/\s/g, ''))
      );
    } else {
      list.sort((a, b) => a.value.arabic.localeCompare(b.value.arabic));
    }

    return list;
  }
  /**
   * This method is used to rever vic exceptional details on validator edit
   */
  vicExceptionalPenaltyWaiverRevert(sin: number, penaltyWaiverId: number) {
    const url = `/api/v1/contributor/${sin}/penalty-waiver/${penaltyWaiverId}/revert`;
    return this.http.put<number>(url, null);
  }
  /**
   * This method is to update vic expetional penalty waiver details
   * @param sin sin
   */
  updateVicExceptionalPenaltyDet(sin: number, waiverId: number, penaltyWaiverDetails: PenaltyWaiverRequest) {
    const url = `/api/v1/contributor/${sin}/penalty-waiver/${waiverId}`;
    return this.http.put<PaymentResponse>(url, penaltyWaiverDetails);
  }
  /**
   * This method is to submit details after approve
   * @param sinNo sin No
   */
  updateEstablishmentExceptional(
    idNumber: number,
    penaltyWaiverId: number,
    penaltyWaiverDetails: PenaltyWaiverRequest
  ) {
    const url = `/api/v1/establishment/${idNumber}/penalty-waiver/${penaltyWaiverId}`;
    return this.http.put<PaymentResponse>(url, penaltyWaiverDetails);
  }
  /**
   * This method is to submit details after approve
   * @param sinNo sin No
   */
  updateEstVicSegmentDetails(penaltyWaiverId: number, penaltyWaiverDetails: PenaltyWaiverSegmentRequest) {
    const url = `/api/v1/bulk-penalty-waiver/${penaltyWaiverId}`;
    return this.http.put<PaymentResponse>(url, penaltyWaiverDetails);
  }
  /**
   * This method is revert establishment-bulk details
   * @param registerationNo registration No
   *  @param waiverId waiver Id
   */
  estVicBulkExceptionalRevert(bulkWaiverId: number) {
    const url = `/api/v1/bulk-penalty-waiver/${bulkWaiverId}/revert`;
    return this.http.put<number>(url, null);
  }
}
