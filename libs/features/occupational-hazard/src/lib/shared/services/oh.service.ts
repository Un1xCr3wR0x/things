/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AppConstants,
  ApplicationTypeToken,
  BilingualText,
  DocumentRequiredList,
  LovList,
  MobileDetails,
  RouterData,
  setPersonToObject,
  StorageService,
  Transaction,
  CryptoService,
  ApplicationTypeEnum,
  LovCategoryList,
  LovCategory,
  GosiCalendar,
  startOfDay,
  DocumentItem,
  SubmitResponse,
  SelectedParticipantDetails,
  EarlyReassessmentResponseDto,
  EarlyReassessmentDto,
  ContributorAssessmenttRequestDto,
  DisabilityDetails,
  DisabilityData,
  RequireReports
} from '@gosi-ui/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { treatmentCompleted } from '../constants/treatment-completed';
import { OHReportTypes } from '../enums';
import {
  AllowancePayee,
  CalculationWrapper,
  ClaimDetailsFilterParams,
  CompanionDetails,
  ExpenseDetails,
  HoldResumeDetails,
  InjuryHistoryResponse,
  InspectionResponses,
  ReimbursementDetails,
  ContributorSearchResult,
  VDFormValue,
  HealthInspection,
  EstablishmentHealth,
  AssessmentResponse
} from '../models';
import { ClarificationRequest, TransactionResponse, Person, InjuryHistory } from '../models';
import { AllowanceWrapper, ClaimWrapper, ClaimsWrapper, Pagination } from '../models';
import { catchError } from 'rxjs/operators';
import { EstablishmentDetailsDto } from '../models/establishmentDetailsDto';
import { SpecialtyList } from '@gosi-ui/features/medical-board';
import { AnnuityResponseDto } from '@gosi-ui/features/benefits/lib/shared';
import { VicContributorDetails } from '@gosi-ui/features/collection/billing/lib/shared/models/vic-contributor-details';
import { contributorAssessmentResponse } from '../models/contributor-assessment-response';
import { ServiceProviderAddressDto } from '../models/service-provider-address';
import { TransactionTraceId } from '../models/transaction-trace';
import { PersonalInformation } from '@gosi-ui/features/contributor';
import { Repatriation, RepatriationDto, RepatriationResponse } from '../models/dead-body-repatriation';
// import { assessmentResponse } from '@gosi-ui/features/medical-board/lib/shared/models/submit-assessment-response';
@Injectable({
  providedIn: 'root'
})
export class OhService {
  private registrationNo: number;
  private newRegistrationNo: number;
  private socialInsuranceNo: number;
  private nin: number;
  private assessmentRequestId: number;
  private disablilityAssessmentId: number;
  private injuryId: number;
  public bulkInjuryId: number;
  private personId: number;
  private selectedOccType: BilingualText;
  private person: Person;
  private reportType: OHReportTypes;
  private complicationId: number;
  private diseaseId: number;
  private transferInjuryId: number;
  private referenceNo: number;
  private isNewDisease = false;
  private isDisease = false;
  private diseaseNumber: number;
  private injuryHistory: InjuryHistory;
  private injuryNumber: number;
  private isWorkflow = false;
  private isNewTransaction = false;
  private isFromGroupInjuryPage = false;
  private isFromPreviousOHHistoryPage = false;
  private isFromValidatorPage = false;
  private isMessageForOcc = false;
  private hasRoutedBack = false;
  private currentPath: string;
  private previousPath: string;
  private successMessageDisplay = false;
  private routerData: RouterData;
  private assessmentidentity = new BehaviorSubject<any>(null);
  assessmentidentity$ = this.assessmentidentity.asObservable();
  private closedStatus: BilingualText;
  private injuryStatus: BilingualText;
  private diseaseStatus: BilingualText;
  private complicationStatus: BilingualText;
  private contributor: ContributorSearchResult;
  private navigationIndicator = 0;
  private isClosed = false;
  private id: number;
  private selectedTabid: string;
  private transactionStatus: BilingualText;
  private treatmentCompleted: BehaviorSubject<LovList> = null;
  private treatmentCompleted$: Observable<LovList> = null;
  private isTransferInjuryIdClicked = false;
  private route = null;
  private param = '';
  private transactionId: number;
  private injuryDate: GosiCalendar;
  private transactionRefId: number;
  visitingDoctorFormValue: VDFormValue;
  isDiseaseedit = false;
  private closeDate: Date;
  protected lovBaseUrl = '/api/v1/lov';
  message: BilingualText;
  workflowtype: string;
  specialtyArray: SpecialtyList[];
  private participantDetail: SelectedParticipantDetails;
  private disabilityType: string;
  private identifier: number;
  private isDatePassed: boolean;
  private isHoWorkitem: boolean;
  private iswithdraw: boolean;
  private isComplication: boolean;
  private isAppealRoute: boolean;
  private statusCode:number;
  private repatriationButton: boolean = false
  validatorPath: string;
  constructor(
    readonly http: HttpClient,
    readonly storageService: StorageService,
    readonly cryptoService: CryptoService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    const regNo = storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY);
    this.registrationNo = regNo != null ? parseInt(regNo, 10) : null;
  }
  //Method to reset service variables
  resetValues() {
    //this.socialInsuranceNo = null;
    // this.registrationNo = null;
    this.injuryNumber = null;
    this.injuryId = null;
    this.bulkInjuryId = null;
    this.routerData = null;
    this.transactionId = null;
    this.transactionRefId = null;
    this.transactionStatus = null;
    this.personId = null;
    this.person = null;
    this.complicationId = null;
    this.injuryHistory = null;
  }
  //setRouterData
  setRouterData(routerData: RouterData) {
    this.routerData = routerData;
  }
  //Set transaction Id
  setTransactionId(id) {
    this.transactionId = id;
  }
  //Set Transaction Reference Id
  setTransactionRefId(id) {
    this.transactionRefId = id;
  }
  setTransactionStatus(status) {
    this.transactionStatus = status;
  }
  //Set transaction Id
  getTransactionId() {
    return this.transactionId;
  }
  //Set Transaction Reference Id
  getTransactionRefId() {
    return this.transactionRefId;
  }

  getContributor() {
    return this.contributor;
  }

  setContributor(contributor: ContributorSearchResult) {
    return (this.contributor = contributor);
  }
  //Get Transaction Status
  getTransactionStatus() {
    return this.transactionStatus;
  }
  setIsTransferInjuryIdClicked(isTransferInjuryIdClicked:boolean){
    this.isTransferInjuryIdClicked = isTransferInjuryIdClicked;
  }
  getIsTransferInjuryIdClicked(){
    return this.isTransferInjuryIdClicked;
  }

  //GetRouterData
  getRouterData() {
    return this.routerData;
  }
  //Set Report Type
  setReportType(reportType: OHReportTypes) {
    this.reportType = reportType;
  }
  //set Transaction message
  setTransactionMessage(message: BilingualText) {
    this.message = message;
  }
  //get Transaction message
  getTransactionMessage() {
    return this.message;
  }

  setReferenceNo(referenceNo){
    this.referenceNo = referenceNo;
  }
  getReferenceNo(){
    return this.referenceNo
  }


  setSelectedOccType(type: BilingualText) {
    this.selectedOccType = type;
  }

  getSelectedOccType() {
    return this.selectedOccType;
  }

  //Get Payee Details
  getPayeeDetails(registrationNo: number, socialInsuranceNo: number, payeeId: number, isChangeRequired?: boolean) {
    if (!isChangeRequired) {
      isChangeRequired = false;
    } else {
      isChangeRequired = true;
    }
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${payeeId}/allowance-payee?isChangeRequired=${isChangeRequired}`;
    return this.http.get<AllowancePayee>(url);
  }
  validatorSubmit(clarificationRequest: ClarificationRequest, id): Observable<TransactionResponse> {
    const submitUrl = `/api/v1/injury/${id}/clarification-request`;
    return this.http.post<TransactionResponse>(submitUrl, clarificationRequest);
  }
  //get workflow
  getIsWorkflow() {
    return this.isWorkflow;
  }
  //isCompplication
  getIsComplication() {
    return this.isComplication;
  }
  //set navigation indicator
  setNavigationIndicator(navigationIdicator: number) {
    this.navigationIndicator = navigationIdicator;
  }
  //get navigation indaticator in case of modify ,reopen
  getNavigationIndicator() {
    return this.navigationIndicator;
  }
  //Setting Workflow (Injury/Complication/disease)
  setIsWorkflow(isWorkflow: boolean) {
    this.isWorkflow = isWorkflow;
  }
  getSuccessMessageDisplay() {
    return this.successMessageDisplay;
  }
  setSuccessMessageDisplay(successMessageDisplay: boolean) {
    this.successMessageDisplay = successMessageDisplay;
  }
  getIsNewTransaction() {
     return this.isNewTransaction;
  }
   setISNewTransaction(isNewTransaction: boolean) {
    this.isNewTransaction = isNewTransaction;
  }

  getIsFromGroupInjuryPage() {
    return this.isFromGroupInjuryPage;
 }
  setIsFromGroupInjuryPage(isFromGroupInjuryPage: boolean) {
   this.isFromGroupInjuryPage = isFromGroupInjuryPage;
 }
  getIsFromPreviousOHHistoryPage() {
    return this.isFromPreviousOHHistoryPage;
  }
  setIsFromPreviousOHHistoryPage(isFromPreviousOHHistoryPage: boolean) {
    this.isFromPreviousOHHistoryPage = isFromPreviousOHHistoryPage;
  }
  getIsMessageForOcc() {
    return this.isMessageForOcc;
  }
  setIsMessageForOcc(isMessageForOcc: boolean) {
    this.isMessageForOcc = isMessageForOcc;
  }
  getIsFromValidatorPage() {
    return this.isFromValidatorPage;
  }
  setIsFromValidatorPage(isFromValidatorPage: boolean) {
    this.isFromValidatorPage = isFromValidatorPage;
  }
  getHasRoutedBack() {
    return this.hasRoutedBack;
  }
  setHasRoutedBack(hasRoutedBack: boolean) {
    this.hasRoutedBack = hasRoutedBack;
  }
  getCurrentPath() {
    return this.currentPath;
  }
  setCurrentPath(currentPath: string) {
    this.currentPath = currentPath;
  }
  getPreviousPath() {
    return this.previousPath;
  }
  setPreviousPath(previousPath: string) {
    this.previousPath = previousPath;
  }
  setValidatorPath(validatorPath: string) {
    this.validatorPath = validatorPath;
  }
  getValidatorPath() {
    return this.validatorPath;
  }
  getSelectedTabid() {
    return this.selectedTabid;
  }
  setSelectedTabid(selectedTabid: string) {
    this.selectedTabid = selectedTabid;
  }
  /** Method to call system params api to limit joining date of an engagement */
  getSystemParams(): Observable<{ name: string; value: string }[]> {
    const url = `/api/v1/lov/system-parameters`;
    return this.http.get<{ name: string; value: string }[]>(url);
  }
  //getIdentity
  assessmentidentityvalue(data: any) {
    this.assessmentidentity.next(data);
  }
  setNavigation(param) {
    this.param = param;
  }
  getNavigation() {
    return this.param;
  }
  getReportType() {
    return this.reportType;
  }
  getIsHoWorkitem() {
    return this.isHoWorkitem;
  }
  // Method to set variable personid
  setPersonId(personId: number) {
    this.personId = personId;
  }
  setInjuryNumber(injuryNumber) {
    this.injuryNumber = injuryNumber;
  }
  getInjuryNumber() {
    return this.injuryNumber;
  }
  //set complication id
  setComplicationId(complicationId) {
    this.complicationId = complicationId;
  }
  //get complication id
  getComplicationId() {
    return this.complicationId;
  }
  //set social insurance number
  setSocialInsuranceNo(socialInsuranceNo: number) {
    this.socialInsuranceNo = socialInsuranceNo;
  }
  //set disability assessment id
  setDisablilityAssessmentId(disablilityAssessmentId: number) {
    this.disablilityAssessmentId = disablilityAssessmentId;
  }
  //set assessment request id
  setAssessmentRequestId(assessmentRequestId: number) {
    this.assessmentRequestId = assessmentRequestId;
  }
  //set disability type
  setDisabilityType(disabilityType: string) {
    this.disabilityType = disabilityType;
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
  setStatusCode(statusCode){
    this.statusCode = statusCode
  }
  getStatusCode(){
    return this.statusCode
  }
  //set if it is complication
  setIsComplication(isComplication: boolean) {
    this.isComplication = isComplication;
  }
  //set if 21 days is passed for appeal
  setAppealDate(isDatePassed: boolean) {
    this.isDatePassed = isDatePassed;
  }
  //set registration number
  setRegistrationNo(registrationNo: number) {
    this.registrationNo = registrationNo;
  }
  //set Establishment registration number
  setEstablishmetRegistrationNo(registrationNo: number) {
    this.registrationNo = registrationNo;
  }
  //set workflowtype
  setWorkFlowType(workflowtype: string) {
    this.workflowtype = workflowtype;
  }
  //method to set if route from appeal / withdraw\
  setAppealRoute(isAppealRoute: boolean) {
    this.isAppealRoute = isAppealRoute;
  }
  getAppealRoute() {
    return this.isAppealRoute;
  }
  // Method to set variable injuryId
  setInjuryId(injuryId) {
    this.injuryId = injuryId;
  }

  // Method to set variable bulkInjuryId
  setBulkInjuryId(bulkInjuryId) {
    this.bulkInjuryId = bulkInjuryId;
  }

  getBulkInjuryId(bulkInjuryId) {
    this.bulkInjuryId = bulkInjuryId;
  }
  getWorkFlowType() {
    return this.workflowtype;
  }
  getInjuryId() {
    return this.injuryId;
  }
  // Method to set variable diseaseId
  setDiseaseId(diseaseId) {
    this.diseaseId = diseaseId;
  }
  getDiseaseId() {
    return this.diseaseId;
  }
  setTransferInjuryId(transferInjuryId) {
    this.transferInjuryId = transferInjuryId;
  }
  getTransferInjuryId() {
    return this.transferInjuryId;
  }
  // Method to set variable diseaseId
  setIsNewDisease(isNewDisease) {
    this.isNewDisease = isNewDisease;
  }
  getIsNewDisease() {
    return this.isNewDisease;
  }
  setIsDisease(isDisease) {
    this.isDisease = isDisease;
  }
  getIsDisease() {
    return this.isDisease;
  }
  setIsDiseaseedit(isDiseaseedit) {
    this.isDiseaseedit = isDiseaseedit;
  }
  getIsDiseaseedit() {
    return this.isDiseaseedit;
  }
  // Method to set variable diseaseNumber
  setDiseaseNumber(diseaseNumber) {
    this.diseaseNumber = diseaseNumber;
  }
  getDiseaseNumber() {
    return this.diseaseNumber;
  }
  //@param person Setting personal details
  public setPersonDetails(person) {
    this.person = person;
  }
  // @param setInjuryDetails Setting personal details
  public setInjuryDetails(injuryHistory) {
    this.injuryHistory = injuryHistory;
  }
  //get injury history details
  public getInjuryHistoryDetails() {
    return this.injuryHistory;
  }
  //get personal details
  public getPersonDetails() {
    return this.person;
  }
  //get social insurance number
  public getSocialInsuranceNo() {
    return this.socialInsuranceNo;
  }
  public getDisablilityAssessmentId() {
    return this.disablilityAssessmentId;
  }
  public getAssessmentRequestId() {
    return this.assessmentRequestId;
  }
  public getDisabilityType() {
    return this.disabilityType;
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

  //get person id
  public getPersonId() {
    return this.personId;
  }
  setIdForValidatorAction(id: number) {
    this.id = id;
  }
  setRegistrationNumber(registrationNo: number) {
    this.registrationNo = registrationNo;
  }
  getRegistrationNumber() {
    return this.registrationNo;
  }
  getNewRegistrationNumber() {
    return this.newRegistrationNo;
  }
  setNewRegistrationNumber(registrationNumber: number) {
    this.newRegistrationNo = registrationNumber;
  }
  getEstablishmetRegistrationNo() {
    return this.registrationNo;
  }
  setClosingstatus(closedStatus: BilingualText) {
    this.closedStatus = closedStatus;
  }
  getClosingstatus() {
    return this.closedStatus;
  }
  setInjurystatus(Status: BilingualText) {
    this.injuryStatus = Status;
  }
  setComplicationstatus(Status: BilingualText) {
    this.complicationStatus = Status;
  }
  //get injury status
  getComplicationstatus() {
    return this.complicationStatus;
  }
  //get injury status
  getInjurystatus() {
    return this.injuryStatus;
  }
  setDiseasestatus(Status: BilingualText) {
    this.diseaseStatus = Status;
  }
  //get injury status
  getDiseasestatus() {
    return this.diseaseStatus;
  }
  setIsClosed(isClosed: boolean) {
    this.isClosed = isClosed;
  }
  // Method to get whether closed status
  getIsClosed() {
    return this.isClosed;
  }
  updateAddress(personDetails: Person) {
    let addPersonUrl = '';
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      addPersonUrl = `/api/v1/contributor/${this.socialInsuranceNo}/address`;
    } else {
      addPersonUrl = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/address`;
    }
    return this.http.patch<Person>(addPersonUrl, personDetails.contactDetail);
  }
  //This method is used to get the Injury History by type
  getOhHistory(ohType?: string, pagination?: Pagination, isAppPrivate?: boolean): Observable<InjuryHistoryResponse> {
    let getOhHistoryUrl = `/api/v1/establishment/${this.registrationNo
    }/contributor/${this.getSocialInsuranceNo()}/injury`;
    const isOtherEngInjuryReq = true;
    let injRequest = new Pagination();
    if (pagination) {
      injRequest = pagination;
    }
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP && this.getSocialInsuranceNo() && this.getSocialInsuranceNo() !== 0) {
      getOhHistoryUrl = `/api/v1/contributor/${this.getSocialInsuranceNo()}/injury?isOtherEngInjuryReq=${isOtherEngInjuryReq}&ohType=${ohType}&pageNo=${
        injRequest.page.pageNo
      }&pageSize=${injRequest.page.size}`;
    } else if(this.registrationNo && this.registrationNo !== 0
    && this.getSocialInsuranceNo() && this.getSocialInsuranceNo() !== 0){
      getOhHistoryUrl = `${getOhHistoryUrl}?isOtherEngInjuryReq=${isOtherEngInjuryReq}&ohType=${ohType}&pageNo=${injRequest.page.pageNo}&pageSize=${injRequest.page.size}`;
    }
    return this.http.get<InjuryHistoryResponse>(getOhHistoryUrl);
  }
  getEstablishmentNameList(socialInsuranceNo,diseaseId){
    const url = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseId}/establishment`;
    return this.http.get<EstablishmentHealth[]>(url);
  }
  // @param socialInsuranceNo Revert Transient details on Cancelling transaction
  deleteTransactionDetails(referenceNo): Observable<null> {
    let id = this.injuryId;
    if (this.complicationId) {
      id = this.complicationId;
    }
    if (referenceNo === null || referenceNo === undefined) {
      referenceNo = 0;
    }
    if(this.diseaseId){
      id = this.diseaseId;
    }
    if(this.registrationNo && this.socialInsuranceNo && id){
      const url = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/injury/${id}/revert?referenceNo=${referenceNo}`;
      return this.http.put<null>(url, []);
    }   
  }
  revertDiseaseTransaction(referenceNo): Observable<null> {
    let id = this.diseaseId;
    if (referenceNo === null || referenceNo === undefined) {
      referenceNo = 0;
    }
    let url ='';
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP || this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = `/api/v1/contributor/${this.socialInsuranceNo}/disease/${id}/revert?referenceNo=${referenceNo}`;
    } else {
      url = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/disease/${id}/revert?referenceNo=${referenceNo}`;
      }

    return this.http.put<null>(url, []);
  }
  // @param socialInsuranceNo Getting the allowance details
  getallowanceDetails(pagination?: Pagination) {
    let id = this.injuryId;
    if (this.complicationId) {
      id = this.complicationId;
    }
    if (this.diseaseId) {
      id = this.diseaseId;
    }
    let url = '';
    if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) {
      if (pagination) {
        url = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/injury/${id}/allowance?pageNo=${pagination.page.pageNo}&pageSize=${pagination.page.size}`;
      } else {
        url = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/injury/${id}/allowance`;
      }
    } else {
      if (pagination) {
        url = `/api/v1/contributor/${this.socialInsuranceNo}/injury/${id}/allowance?pageNo=${pagination.page.pageNo}&pageSize=${pagination.page.size}`;
      } else {
        url = `/api/v1/contributor/${this.socialInsuranceNo}/injury/${id}/allowance`;
      }
    }
    return this.http.get<AllowanceWrapper>(url);
  }
  getallowanceDetail(registrationNo: number, socialInsuranceNo: number, injuryId: number, referenceNo) {
    if (socialInsuranceNo && registrationNo && injuryId) {
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/ohClaim?referenceNo=${referenceNo}`;
      return this.http.get<ClaimWrapper>(url);
    }
  }
  concatUrl(url) {
    if (url.substr(url.length - 1) !== '?') {
      url = url.concat(`&`);
    }
    return url;
  }
  getClaimsDetails(filterValues?: ClaimDetailsFilterParams) {
    let id = this.injuryId;
    if (this.complicationId) {
      id = this.complicationId;
    }
    if (this.diseaseId) {
      id = this.diseaseId;
    }
    if (id !== this.diseaseId && id.toString() !== 'NaN') {
      let url = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/injury/${id}/claims`;
      if (filterValues) {
        url = url.concat(
          filterValues.minAmount || filterValues.minAmount === 0 ? `?minAmount=${filterValues.minAmount}` : `?`
        );
        if (filterValues.maxAmount) {
          url = this.concatUrl(url);
          url = url.concat(`maxAmount=${filterValues.maxAmount}`);
        }
        if (filterValues.startDate) {
          url = this.concatUrl(url);
          url = url.concat(`startDate=${filterValues.startDate}`);
        }
        if (filterValues.endDate) {
          url = this.concatUrl(url);
          url = url.concat(`endDate=${filterValues.endDate}`);
        }
        if (filterValues?.claimPayee?.length > 0) {
          filterValues.claimPayee.forEach(element => {
            if (url.substr(url.length - 1) !== '?') {
              url = url.concat(`&`);
            }
            url = url.concat(`claimsPayee=${element}`);
          });
        }
        if (filterValues?.claimType?.length > 0) {
          filterValues.claimType.forEach(element => {
            if (url.substr(url.length - 1) !== '?') {
              url = url.concat(`&`);
            }
            url = url.concat(`claimType=${element}`);
          });
        }
        if (filterValues?.claimStatus?.length > 0) {
          filterValues.claimStatus.forEach(element => {
            if (url.substr(url.length - 1) !== '?') {
              url = url.concat(`&`);
            }
            url = url.concat(`status=${element}`);
          });
        }
      }
      return this.http.get<ClaimsWrapper>(url);
    }
  }
  // @param socialInsuranceNo Getting the companion details
  getCompanionDetails(allowanceId: number) {
    let id = this.injuryId;
    if (this.complicationId) {
      id = this.complicationId;
    }
    const url = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/injury/${id}/allowance/${allowanceId}/companion`;
    return this.http.get<CompanionDetails>(url);
  }
  //@param socialInsuranceNo Getting the allowance details
  getBreakUpDetails(allowanceId: number, claimItemId: number) {
    if (allowanceId && claimItemId) {
      let id = this.injuryId;
      if (this.complicationId) {
        id = this.complicationId;
      }
      if (this.diseaseId) {
        id = this.diseaseId;
      }
      const url = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/injury/${id}/allowance/${allowanceId}/allowanceItem/${claimItemId}/allowance-details`;
      return this.http.get<CalculationWrapper>(url);
    }
  }
  // @param socialInsuranceNo Getting the expense details
  getExpenseDetails(claimId: number, reimbursementId: number) {
    let id = this.injuryId;
    if (this.complicationId) {
      id = this.complicationId;
    }
    const url = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/injury/${id}/reimbursement/${reimbursementId}/expense-details?ohClaimId=${claimId}`;
    return this.http.get<ExpenseDetails>(url);
  }
  // @param socialInsuranceNo Api to add reimbursement claim
  addReimbursementClaim(
    emailId: string,
    mobileNo: MobileDetails,
    isTreatmentWithinSaudiArabia: boolean,
    payee: number,
    uuid: string,
    amount?: string,
    vat?: string,
    hospital?: string,
    invoiceDate?: GosiCalendar
  ) {
    let id = this.injuryId;
    if (this.complicationId) {
      id = this.complicationId;
    }
    const reimburseRequest = {
      emailId: emailId,
      isTreatmentWithinSaudiArabia: isTreatmentWithinSaudiArabia,
      mobileNo: mobileNo,
      payableTo: payee,
      uuid: uuid,
      amount: amount,
      vat: vat,
      hospital: hospital,
      invoiceDate: invoiceDate
    };
    const url = `/api/v1/establishment/${this.registrationNo
    }/contributor/${this.getSocialInsuranceNo()}/injury/${id}/reimbursement`;
    return this.http.post<ReimbursementDetails>(url, reimburseRequest);
  }

  updateReimbursementClaim(
    emailId: string,
    mobileNo: MobileDetails,
    isTreatmentWithinSaudiArabia: boolean,
    payee: number,
    uuid: string,
    reimbId: number,
    amount?: string,
    vat?: string,
    hospital?: string,
    invoiceDate?: GosiCalendar
  ) {
    let id = this.injuryId;
    if (this.complicationId) {
      id = this.complicationId;
    }
    const reimburseRequest = {
      emailId: emailId,
      isTreatmentWithinSaudiArabia: isTreatmentWithinSaudiArabia,
      mobileNo: mobileNo,
      payableTo: payee,
      uuid: uuid,
      amount: amount,
      vat: vat,
      hospital: hospital,
      invoiceDate: invoiceDate
    };
    const url = `/api/v1/establishment/${this.registrationNo
    }/contributor/${this.getSocialInsuranceNo()}/injury/${id}/reimbursement/${reimbId}`;
    return this.http.put<number>(url, reimburseRequest);
  }

  // @param socialInsuranceNo  set values for personId and socialInsuranceNo
  setValues(registrationNumber: number, socialInsuranceNo: number, injuryNumber: number) {
    this.socialInsuranceNo = socialInsuranceNo;
    this.registrationNo = registrationNumber;
    this.injuryNumber = injuryNumber;
    this.injuryId = injuryNumber;
  }
  // This is a generic method to map the response to the intended Object
  setResponse(object, response) {
    if (response && object) {
      Object.keys(response).forEach(name => {
        if (name === 'person') {
          object.person = setPersonToObject(response[name], new Person());
        } else {
          if (name in object && response[name]) {
            object[name] = response[name];
          }
        }
      });
    }
  }
  validatorAction(requiredDocuments: DocumentRequiredList, allowanceFlagVal: boolean = false): Observable<TransactionResponse> {
    let addInjuryUrl = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/injury/${this.id}/req-docs`;
    if(this.diseaseId && !allowanceFlagVal){
      addInjuryUrl = `/api/v1/contributor/${this.socialInsuranceNo}/disease/${this.diseaseId}/req-docs`;
    }
    return this.http.put<TransactionResponse>(addInjuryUrl, requiredDocuments);
  }
  inspectionAction(
    establishmentDto: EstablishmentDetailsDto,
    socialInsuranceNo: number,
    diseaseId: number
  ): Observable<BilingualText> {
    const Url = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseId}/inspection-establishment`;
    return this.http.put<BilingualText>(Url, establishmentDto);
  }
  doctorSubmit(
    healthInspectionForm: HealthInspection,
    socialInsuranceNo: number,
    diseaseId: number
  ): Observable<HealthInspection> {
    const Url = `/api/v1/contributor/${socialInsuranceNo}/disease/${diseaseId}/doctor-submit`;
    return this.http.put<HealthInspection>(Url, healthInspectionForm);
  }
  saveContributorDocuments(
    requiredDocuments: DocumentRequiredList,
    resourceType,
    registrationNo?,
    socialInsuranceNo?,
    injuryId?,
    identifier?,
    assessmentReqId?,
    referenceNo?
  ): Observable<BilingualText> {
    let url = '';
    //scenario 1 :compllication and injury assessment (close injury TPA and close complication TPA)
    //  scenario 2: where assessment req id there
    resourceType === 'Close Complication TPA' || resourceType === 'Close Injury TPA'
      ? (url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/req-docs-contributor`)
      : (url = `/api/v1/participant/${identifier}/assessment-request/${assessmentReqId}/req-docs-contributor/${referenceNo}`);
    return this.http.put<BilingualText>(url, requiredDocuments);
  }
  getTreatmentCompleted(): Observable<LovList> {
    if (this.treatmentCompleted$ != null) {
      return this.treatmentCompleted$;
    } else {
      this.treatmentCompleted = new BehaviorSubject<LovList>(null);
      this.treatmentCompleted$ = this.treatmentCompleted.asObservable();
      this.treatmentCompleted.next(new LovList(treatmentCompleted.items));
      return this.treatmentCompleted$;
    }
  }
  getTransaction(transactionTraceId) {
    const encryptedId = this.cryptoService.encrypt(transactionTraceId);
    const getTxnUrl = `/api/v1/transaction/${encryptedId}`;
    return this.http.get<Transaction>(getTxnUrl);
  }
  setRoute(route: string) {
    this.route = route;
  }
  getRoute() {
    return this.route;
  }
  //Fetching Hold and Allowance Details
  fetchHoldAndAllowanceDetails(registrationNo, socialInsuranceNo, id) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${id}/hold-resume`;
    return this.http.get<HoldResumeDetails>(url);
  }
  complicationRejection(injuryRejectReason, registrationNo, socialInsuranceNo): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${this.injuryNumber}/reject-parent`;
    return this.http.put<BilingualText>(url, injuryRejectReason);
  }
  //Method to get inspection details
  getOHInspectionDetailsWithInjury(injuryId: number): Observable<InspectionResponses[]> {
    const url = `/api/v1/inspection?injuryId=${injuryId}`;
    return this.http.get<InspectionResponses[]>(url);
  }
  getOHInspectionDetailsWithSin(sin: number): Observable<InspectionResponses> {
    const url = `/api/v1/inspection?socialInsuranceNo=${sin}`;
    return this.http.get<InspectionResponses>(url);
  }
  setInjuryDate(date: GosiCalendar) {
    this.injuryDate = date;
  }
  getInjuryDate() {
    return this.injuryDate;
  }
  setInjuryClosedDate(date: Date) {
    this.closeDate = date;
  }
  getInjuryClosedDate() {
    return this.closeDate;
  }
  /**
   * This method is to handle error response.
   */
  protected handleError(msg: string) {
    return throwError(msg);
  }
  getOccupationList(): Observable<LovCategoryList> {
    const path = `/occupationByOrder`;
    const occupationLovUrl = this.lovBaseUrl + path;
    const occupationList = new BehaviorSubject<LovCategoryList>(null);
    const occupationList$ = occupationList.asObservable();
    this.http
      .get(occupationLovUrl)
      .pipe(catchError(() => this.handleError('Occupation list fetch failed. Please try again later.')))
      .subscribe((response: LovCategory[]) => {
        if (response !== undefined) {
          occupationList.next(new LovCategoryList(response));
        } else {
          this.handleError('Occupation list fetch failed. Please try again later.');
        }
      });
    return occupationList$;
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
  /**
   * This method is used to get the contributor details with only sin
   * @param sin
   */
  getContirbutorDetails(sin: number) {
    return this.http.get<VicContributorDetails>(`/api/v1/contributor/${sin}`);
  }
  /**
   * this method is used to gfet complication id and injury id for complication reassessmnet scenarios
   * @param mbAssessmentRequestId
   */
  getDisabilityDetails(identifier, assessmentRequestid: number): Observable<DisabilityDetails> {
    const url = `/api/v1/participant/${identifier}/assessment-request/${assessmentRequestid}`;
    return this.http.get<DisabilityDetails>(url);
  }
  getServiceProviderAddress(identifier, hospitalName: BilingualText): Observable<ServiceProviderAddressDto> {
    let url = `/api/v1/participant/${identifier}/service-provider?`;
    if (hospitalName) {
      url += `hospitalName.arabic=${hospitalName.arabic}&hospitalName.english=${hospitalName.english}`;
    }
    return this.http.get<ServiceProviderAddressDto>(url);
  }
  getReqDocsForReassessmentRequest(): Observable<DocumentItem[]> {
    const url = '/api/v1/document/req-doc?transactionId=REQUEST_MB_RE_ASSESSMENT&type=MEDICAL_BOARD';
    return this.http.get<DocumentItem[]>(url);
  }
  getReqDocsForAppeal(): Observable<DocumentItem[]> {
    const url = '/api/v1/document/req-doc?transactionId=APPEAL&type=MEDICAL_BOARD';
    return this.http.get<DocumentItem[]>(url);
  }
  getReqDocsForWithdrawAppeal(): Observable<DocumentItem[]> {
    const url = '/api/v1/document/req-doc?transactionId=WITHDRAW_APPEAL&type=MEDICAL_BOARD';
    return this.http.get<DocumentItem[]>(url);
  }
  submitAssessment(
    identifier: number,
    disabilityAssessmentId: number,
    request: ContributorAssessmenttRequestDto
  ): Observable<contributorAssessmentResponse> {
    const url = `/api/v1/participant/${identifier}/assessment-request/${disabilityAssessmentId}/approve?isReassessment=true`;
    return this.http.put<contributorAssessmentResponse>(url, request);
  }
  /**
   * post mbassessmentRequest id for submitting participant
   * @param assessmentRequestId
   * @param transactiontraceid
   * @returns bilingual text
   */
  putAssessmentRequestId(
    identifier: number,
    assessmentRequestId,
    TransactionTraceId: TransactionTraceId
  ): Observable<AssessmentResponse> {
    const url = `/api/v1/participant/${identifier}/assessment-request/${assessmentRequestId}/submit?isParticipantSubmit=true`;
    return this.http.put<AssessmentResponse>(url, TransactionTraceId);
  }
  getPreviousDisability(identifier: number, nationalId?: number, assessmentType?: string): Observable<DisabilityData> {
    const url = `/api/v1/participant/${identifier}/previous-disability-assessments`;
    let params = new HttpParams();
    if (nationalId && assessmentType) {
      params = params.set('identifier', nationalId.toString());
      params = params.set('assessmentType', assessmentType);
    }
    return this.http.get<DisabilityData>(url, { params });
  }
  /** Method to get person by id. */
  getPersonById(personId: number) {
    const url = `/api/v1/person/${personId}`;
    return this.http.get<PersonalInformation>(url);
  }
  /**
   * Api to put early disability re-assessment details
   * @param identifier
   * @param EarlyReassessmentDto
   * @returns  EarlyReassessmentResponseDto
   */
  saveEarlyReassessmentDetails(
    identifier,
    EarlyReassessmentDto: EarlyReassessmentDto,
    assessmentReqId?: number,
    referenceNo?: number,
    isReturn?: boolean
  ): Observable<EarlyReassessmentResponseDto> {
    if (assessmentReqId && isReturn === true) {
      //if return transaction save and next put api
      const url = `/api/v1/participant/${identifier}/early-reassessment-request/${assessmentReqId}/update`;
      let params = new HttpParams();
      if (referenceNo) {
        params = params.set('referenceNo', referenceNo.toString());
      }
      return this.http.put<EarlyReassessmentResponseDto>(url, EarlyReassessmentDto, { params });
    } else {
      // save and next for post api
      const url = `/api/v1/participant/${identifier}/early-reassessment-request`;
      return this.http.post<EarlyReassessmentResponseDto>(url, EarlyReassessmentDto);
    }
  }
  /**
   * Api to update details for early disability re assessment
   * @param EarlyReassessmentDto
   * @param identifier
   * @param disabilityAssessmentId
   * @param mbReassessmentReqId
   * @param referenceNo
   * @returns EarlyReassessmentResponseDto
   */
  updateEarlyDisabDetails(
    identifier,
    mbReassessmentReqId,
    disabilityAssessmentId?,
    referenceNo?,
    isReturn?
  ): Observable<SubmitResponse> {
    const url = `/api/v1/participant/${identifier}/early-reassessment-request/${mbReassessmentReqId}/submit`;
    let params = new HttpParams();
    if (disabilityAssessmentId) {
      params = params.set('disabilityAssessmentId', disabilityAssessmentId);
    }
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo);
    }
    if (isReturn) {
      params = params.set('isReturn', isReturn);
    }
    return this.http.patch<SubmitResponse>(url, null, { params });
  }
  //set participant details
  setParticipantdetails(Participant: SelectedParticipantDetails) {
    this.participantDetail = Participant;
  }
  getParticipantDetail() {
    return this.participantDetail;
  }
  /**
   * reject a early reassessment
   * @param disabilityAssessmentId
   * @param earlyReassessmentDto
   * @param referenceNo
   * @returns bilingual text
   */
  rejectReassessment(
    identifier: number,
    assessmentReqId: number,
    earlyReassessmentDto: EarlyReassessmentDto,
    disabilityAssessmentId?: number,
    referenceNo?: number
  ): Observable<BilingualText> {
    const url = `/api/v1/participant/${identifier}/early-reassessment-request/${assessmentReqId}/reject`;
    let params = new HttpParams();
    if (disabilityAssessmentId) {
      params = params.set('disabilityAssessmentId', disabilityAssessmentId.toString());
    }
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.patch<BilingualText>(url, earlyReassessmentDto, { params });
  }
  /**
   *
   * @param transactionId
   * @param type
   * @returns
   */
  getReqDocEarlyReassessment(transactionId?, type?): Observable<DocumentItem[]> {
    const url = `/api/v1/document/req-doc`;
    let params = new HttpParams();
    if (transactionId) {
      params = params.set('transactionId', transactionId);
    }
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<DocumentItem[]>(url, { params });
  }
  saveTpaDocuments(
    reportDetailsDto,
    resourceType,
    socialInsuranceNo?,
    injuryId?,
    identifier?,
    assessmentReqId?,
  ): Observable<BilingualText> {
    let url = '';
    //scenario 1 :compllication and injury assessment (close injury TPA and close complication TPA)
    //  scenario 2: where assessment req id there
    resourceType === 'Close Complication TPA' || resourceType === 'Close Injury TPA'
      ? (url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}/tpa-cpt`)
      : (url = `/api/v1/participant/${identifier}/assessment-request/${assessmentReqId}/tpa-cpt`);
    return this.http.post<BilingualText>(url, reportDetailsDto);
  }

  submitRepatriationExpenses(repatriationExpenses: Repatriation, registrationNo: number, socialInsuranceNo: number, injuryId: number, isAdminSubmit?): Observable<RepatriationResponse> {
    // let params = new HttpParams();
    // params = params.set('isAdminSubmit', isAdminSubmit);
    const submitUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/dead-body-repatriation?isAdminSubmit=${isAdminSubmit}`;
    return this.http.post<RepatriationResponse>(submitUrl, repatriationExpenses);
  }

  submitRepatriation(registrationNo: number, socialInsuranceNo: number, injuryId: number, settlementId: number, comments) {
    const injuryNumber = {
      comments: comments
    };
    const submitUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/dead-body-repatriation/${settlementId}`;
    return this.http.patch<RepatriationResponse>(submitUrl, injuryNumber);
  }
  getCPTCodeDetails(
    resourceType,
    socialInsuranceNo?,
    injuryId?,
    code?,
    specialty?,
    specialtyCode?,
    identifier?,
    assessmentRequestId?
  ): Observable<[{ cptCode: string; cptCodeDescription: string }]> {
    let params = new HttpParams();
    let url = '';
    resourceType === 'Close Complication TPA' || resourceType === 'Close Injury TPA'
      ? (url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}/cpt-specialty`)
      : (url = `/api/v1/participant/${identifier}/assessment-request/${assessmentRequestId}/cpt-specialty`);
    params = params.set('code', code);
    params = params.set('specialty', specialty);
    params = params.set('specialtyCode', specialtyCode);
    return this.http.get<[{ cptCode: string; cptCodeDescription: string }]>(url, { params });
  }

  setRepatriationButton(repatriationButton) {
    this.repatriationButton = repatriationButton;
  }
  getRepatriationButton() {
    return this.repatriationButton;
  }

  getModifiedRepatriation(registrationNo: number, socialInsuranceNo: number, injuryId: number, referenceNo?: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/dead-body-repatriation?referenceNo=${referenceNo}`;
    return this.http.get<RepatriationDto>(url);
  }
  updateDiseaseAddress(personDetails: Person) {
    let addPersonUrl = '';
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP || this.appToken === ApplicationTypeEnum.PRIVATE) {
      addPersonUrl = `/api/v1/contributor/${this.socialInsuranceNo}/address`;
    } else {
      addPersonUrl = `/api/v1/establishment/${this.registrationNo}/contributor/${this.socialInsuranceNo}/address`;
    }
    return this.http.patch<Person>(addPersonUrl, personDetails.contactDetail);
  }
}
