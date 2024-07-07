import { Directive, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  DocumentService,
  IdentityTypeEnum,
  Iqama,
  LookupService,
  LovList,
  NIN,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService,
  BilingualText,
  BPMUpdateRequest,
  ApplicationTypeEnum,
  InspectionTypeEnum,
  getPersonNameAsBilingual,
  Transaction,
  BPMMergeUpdateParamEnum
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin, throwError, noop } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ViolationsEnum } from '@gosi-ui/features/violations/lib/shared';
import {
  AppealService,
  AppealOnViolation,
  RequestorDetails,
  IAppealPayloadDetails,
  AppealValidatorRoles
} from '@gosi-ui/features/appeals';
import { convertKeysToCamelCase } from '../../utilites/toCamelCase';

@Directive()
export class VlidatorBaseScComponent extends BaseComponent implements OnInit {
  /**
   * Local Varibles
   */
  assignedRole: AppealValidatorRoles = null;
  channel: string;
  documentList: DocumentItem[];
  documents: DocumentItem[] = [];
  sequenceNumber: number;
  modalRef: BsModalRef;
  validatorForm: FormGroup = new FormGroup({});
  appeal: AppealOnViolation;
  transactionDetails: Transaction;
  personIdentifier: number; // #Revisit
  initiatedDate: string; // #Revisit
  appealId: number;
  opinionList$: Observable<LovList>;
  legalOpinionList$: Observable<LovList>;
  estRegNo: number;
  isReturn: boolean;
  canReturn: boolean;
  canReject: boolean = false;
  canEdit: boolean;
  isButtonApprove: boolean;
  comments: TransactionReferenceData[] = [];
  transactionType: string = 'APPEAL_ON_VIOLATION';
  businessKey: string = '300394';
  canUserModified: boolean = false;
  transactionTitle: BilingualText;
  status: BilingualText;
  e_Inspection = false;
  isRasedInspection = false;
  checkFAN = false;
  isRaiseVioFoVcm: boolean;
  //new
  requestor;
  referenceNo: number;
  transactionReferenceNo: number;
  Requestor: RequestorDetails;
  payloadDetails: IAppealPayloadDetails;
  lang = 'en';
  assigneeName: string;
  assigneeId: string;
  bpmTaskId: string;
  actions: WorkFlowActions[] = [];
  appealsDocData: any;
  taskId: string;
  resourceType: string;
  // appealDetail: AppealDetail = new AppealDetail();
  private requestInProgress = false;

  /**
   *
   * @param lookupService
   * @param documentService
   * @param alertService
   * @param workflowService
   * @param modalService
   * @param validatorService
   * @param router
   * @param routerDataToken
   * @param appToken
   */
  constructor(
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly validatorService: AppealService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string // @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super();
  }

  ngOnInit(): void {
    // this.language.subscribe(language => {
    //   this.lang = language;
    // });
  }

  /**
   * Method to set data from token.
   * @param token token
   */
  getDataFromToken(tokenData: RouterData) {
    if (tokenData.payload) {
      const token = JSON.parse(tokenData.payload);
      if (token.referenceNo) this.referenceNo = token.referenceNo;
      if (token.registrationNo) this.estRegNo = token.registrationNo;
      if (token.channel) this.channel = token.channel;
      if (token.violationId) this.transactionReferenceNo = token.violationId;
      if (token.appealId) this.appealId = token.appealId;
      if (token.status) this.status = token.status;
      if (token.userId) this.personIdentifier = token.userId;
      if (token.assignedRole) {
        // this.assignedRole = token.assignedRole.replace(/ /g, '');
        this.assignedRole = token.assignedRole;
        // this.canReturn = this.assignedRole === AppealValidatorRoles.IS_reviewer_private ? true : false;
      }
      if (token.titleEnglish && token.titleArabic)
        this.transactionTitle = { arabic: token.titleArabic, english: token.titleEnglish };
      // if (token.previousOutcome === 'RETURN' && this.assignedRole === AppealValidatorRoles.IS_reviewer_private)
      this.isReturn = true;
      // if (this.assignedRole == Role.ESTABLISHMENT_ADMIN && token.previousOutcome == WorkFlowActions.RETURN)
      //   this.canUserModified = true;

      this.getRolesForView(tokenData);
      // this.initiatedDate = token.olaDueDate;
      this.initiatedDate = token.currentDate;
      this.payloadDetails = token;
      // this.getAppealDataService();
    }
    this.comments = this.routerDataToken.comments;
    this.taskId = tokenData.taskId;
    this.resourceType = tokenData.resourceType;

    this.actions = tokenData.customActions;
  }

  getWorkflowActions(key: number): string {
    let action: string;
    switch (key) {
      case 0:
        action = WorkFlowActions.APPROVE;
        break;
      case 1:
        action = WorkFlowActions.REJECT;
        break;
      case 2:
        action = WorkFlowActions.RETURN;
        break;
      case 3:
        action = WorkFlowActions.SUBMIT;
        break;
      case 4:
        action = WorkFlowActions.RESUBMIT;
        break;
    }
    return action;
  }

  getRolesForView(tokenData: RouterData) {
    if (tokenData) {
      this.bpmTaskId = tokenData.taskId;
      // this.assignedRole = tokenData.assignedRole;
      this.assigneeId = tokenData.assigneeId;
      this.assigneeName = tokenData.assigneeName;
    }
  }

  /** Method to get lovlist . */
  getLovList() {
    //  this.opinionList$ = this.lookupService.getAovOpinionList();
    //  this.legalOpinionList$ = this.lookupService.getAovLegalOpinionList();
  }

  /** Method to navigate to inbox. */
  routeToInbox(): void {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /** Method to navigate to inbox on error during view initialization. */
  handleErrors(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.routeToInbox();
  }

  scrollToContributor() {
    const element = document.getElementById('contributorSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  hideModal(isApprove?: boolean): void {
    this.isButtonApprove = !isApprove ? false : true;
    this.modalRef.hide();
  }

  /** Method to get documents for the modify/cancel. */
  getAppealDocuments(
    documentId: string,
    documentType: string | string[],
    contractId: number,
    referenceNo: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(documentId, documentType, contractId, referenceNo).pipe(
      tap(res => {
        this.documentList = res.filter(item => item.documentContent !== null);
      })
    );
  }

  /** Method to retrieve violations data. */
  getAppealDetails() {
    if (this.appealId && this.transactionReferenceNo) {
      /*   this.appealVlcService.getAppealDetails(this.violationId, this.appealId)
            .subscribe((response: AppealOnViolation) => {
              this.appeal = response;
              this.personIdentifier = response.personId;
              this.getPersonDetails();
            });*/
    }
  }

  /** Method to retrieve violation data. */
  getViolationDetails() {
    if (this.estRegNo && this.transactionReferenceNo) {
      /*     this.validatorService.getTransactionDetails(this.violationId, this.estRegNo).pipe(
              tap(transactionResponse => {
               this.transactionDetails = transactionResponse;
              if (this.transactionDetails.inspectionInfo.channel.english === InspectionChannel.RASED)
                this.isRasedInspection = true;
              if (this.transactionDetails.inspectionInfo.channel.english === InspectionChannel.E_INSPECTION)
                this.e_Inspection = true;
              if (this.transactionDetails.inspectionInfo.visitId) this.checkFAN = true;
              if (this.transactionDetails?.manualViolation) {
                this.isRaiseVioFoVcm = true;
              } else {
                this.isRaiseVioFoVcm = false;
              }
              }),
              switchMap(() => iif(() => this.isRasedInspection, this.getRasedInspectionDocuments(), of(true))),
              switchMap(() => iif(() => this.e_Inspection && this.checkFAN, this.getEinspectionDocuments(), of(true))),
              switchMap(() =>
              iif(
                () => this.isRaiseVioFoVcm,
                this.getViolationDocuments(
                  DocumentTransactionId.MANUALLY_TRIGGERED_VIOLATION,
                  DocumentTransactionType.REGISTER_VIOLATION_THROUGH_FO,
                  this.violationId,
                  this.transactionDetails?.violationReferenceNumber
                ),
                of(true)
              )
            ),
         /*   catchError(err => {
              this.handleErrors(err, true);
              return throwError(err);
            })*/
      /*  )
          .subscribe(noop, noop);*/
    }
  }

  /** Method for getting person detail. */
  getPersonDetails(id: number) {
    if (id)
      this.validatorService
        .getPersonById(id)
        .pipe(
          tap(res => {
            this.requestor = new RequestorDetails();
            this.requestor.name = getPersonNameAsBilingual(res && res.name);
            this.requestor.emailId =
              res && res.contactDetail && res.contactDetail.emailId && res.contactDetail.emailId.primary;
            if (res && res.identity)
              res.identity.forEach((item, index) => {
                if (item.idType === IdentityTypeEnum.NIN) this.requestor.id = <NIN>res.identity[index];
                else if (item.idType === IdentityTypeEnum.IQAMA) this.requestor.id = <Iqama>res.identity[index];
              });
            return res;
          })
        )
        .subscribe(res => {});
  }

  /** Method to get document list*/
  getDocuments(referenceNo: number): Observable<any[]> {
    return new Observable<any[]>(observer => {
      if (referenceNo) {
        this.documentService
          .getOldDocumentContentId(null, null, null, this.referenceNo)
          .pipe(
            tap((documentResponse: DocumentItem[]) => {
              if (documentResponse.length === 0) this.sequenceNumber = 1;
              else this.sequenceNumber = Math.max(...documentResponse.map(doc => doc.sequenceNumber)) + 1;
            }),
            switchMap(response => {
              return forkJoin(
                response.map(doc => {
                  if (response) {
                    return this.documentService.getDocumentContent(doc.contentId).pipe(
                      map(documentResponse => {
                        return this.documentService.setContentToDocument(doc, documentResponse);
                      })
                    );
                  }
                })
              );
            })
          )
          .subscribe(
            response => {
              const documents = response.filter(item => item.documentContent !== null);
              observer.next(documents);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

  saveWorkflow(data: BPMUpdateRequest): void {
    data.payload = this.routerDataToken.content;

    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
          this.routeToInbox();
        }),
        catchError(err => {
          this.isButtonApprove = false;
          this.handleErrors(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  mergeAndUpdateTask(data: BPMUpdateRequest, formData?: any): void {
    if (WorkFlowActions.APPROVE === data.outcome || WorkFlowActions.REJECT === data.outcome) {
      const UpdatedData = convertKeysToCamelCase(formData);
      this.validatorService.updateAppealDecision(this.appealId, data.roleId, UpdatedData).subscribe(res => {
        this.callBbmApi(data);
      });
    } else {
      this.callBbmApi(data);
    }
  }

  callBbmApi(data): void {
    // Check if a request is already in progress
    if (this.requestInProgress) {
      return;
    }

    let bpmRequest = new BPMUpdateRequest();
    bpmRequest.outcome = data.outcome;
    bpmRequest.payload = this.routerDataToken.content;
    bpmRequest.taskId = this.routerDataToken.taskId;
    bpmRequest.user = this.routerDataToken.assigneeId;
    bpmRequest.roleId = data.roleId;
    bpmRequest = this.setUserToPayload(bpmRequest);
    if (data.comments) {
      bpmRequest.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, data.comments);
      bpmRequest.comments = data.comments;
    }
    if (data.isExternalComment) bpmRequest.isExternalComment = data.isExternalComment;

    this.requestInProgress = true;
    this.workflowService
      .mergeAndUpdateTask(bpmRequest)
      .pipe(
        tap(
          () => {
            this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
            this.routeToInbox();
            this.requestInProgress = false;
          },
          err => {
            this.isButtonApprove = false;
            this.handleErrors(err, false);
            this.requestInProgress = false;
            return throwError(err);
          }
        )
      )
      .subscribe(noop, noop);
  }
  setUserToPayload(request: BPMUpdateRequest): BPMUpdateRequest {
    request.updateMap.set(BPMMergeUpdateParamEnum.USER_ID, this.routerDataToken.assigneeId);
    request.updateMap.set(BPMMergeUpdateParamEnum.REQUEST_USER_ID, this.routerDataToken.assigneeId);
    request.updateMap.set(BPMMergeUpdateParamEnum.ROLE_ID, request.roleId);
    request.updateMap.set(BPMMergeUpdateParamEnum.REQUEST_ROLE_ID, request.roleId);
    return request;
  }
  navigateToViolationProfile() {
    const regNo = this.estRegNo;
    //const violationId = this.violationId;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      //     url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    } else {
      //      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    }
    window.open(url, '_blank');
  }

  navigateToInboxPage() {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = RouterConstants.ROUTE_INBOX;
    } else {
      url = RouterConstants.ROUTE_TODOLIST;
    }
    this.router.navigate([url]);
  }

  getSuccessMessage(outcome: string) {
    let messageKey: string;
    switch (outcome) {
      case WorkFlowActions.APPROVE:
        messageKey = 'APPEALS.SUCCESS-MESSAGES.APPEAL-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        messageKey = 'APPEALS.SUCCESS-MESSAGES.APPEAL-REJECTION-MESSAGE';
        break;
      case WorkFlowActions.RETURN:
        messageKey = 'APPEALS.SUCCESS-MESSAGES.APPEAL-RETURN-MESSAGE';
        break;
      case WorkFlowActions.ASSIGN_TO_SPECIALIST:
        messageKey =
          this.transactionTitle.english === 'Appeal'
            ? 'APPEALS.SUCCESS-MESSAGES.APPEAL-ASSIGN-TO-SPECIALIST'
            : 'APPEALS.SUCCESS-MESSAGES.REVIEW-REQUEST-ASSIGN-TO-SPECIALIST';

        break;
    }
    return messageKey;
  }
  getRasedInspectionDocuments() {
    if (this.isRasedInspection) {
      return this.documentService
        .getRasedDocuments(
          InspectionTypeEnum.EMPLOYEE_AFFAIRS,
          //    this.transactionDetails.violationTypeForRased,
          ViolationsEnum.VIOLATION_TYPE
          // this.transactionDetails.inspectionInfo.visitId
        )
        .pipe(
          tap(docs => {
            if (docs.length > 0) this.documentList = this.documentList.concat(docs);
          })
          /*  catchError(error => {
            this.handleErrors(error, false);
            return of(this.documentList);
          })*/
        );
    }
  }
  getEinspectionDocuments() {
    if (this.e_Inspection) {
      return this.documentService
        .getRasedDocuments(
          InspectionTypeEnum.EMPLOYEE_AFFAIRS,
          // this.transactionDetails.contributors[0].socialInsuranceNo,
          ViolationsEnum.CONTRIBUTOR_NUMBER
          //this.transactionDetails.inspectionInfo.visitId
        )
        .pipe(
          tap(res => {
            if (res.length > 0) this.documentList = this.documentList.concat(res);
          })
          /* catchError(error => {
            this.handleErrors(error, false);
            return of(this.documentList);
          })*/
        );
    }
  }
  /** Method to get documents for the modify/cancel Violations. */
  getViolationDocuments(
    documentId: string,
    documentType: string | string[],
    contractId: number,
    referenceNo: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(documentId, documentType, contractId, referenceNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }
  cancelAndBack(): void {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  updateAppealDecision(roleId: number, formData: any): void {
    const UpdatedData = convertKeysToCamelCase(formData);
    this.validatorService.updateAppealDecision(this.appealId, roleId, UpdatedData).subscribe(res => {
      //console.log(res);
    });
  }
}
