import { Directive, Inject, OnDestroy } from '@angular/core';
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
  Role,
  BilingualText,
  BPMUpdateRequest,
  ApplicationTypeEnum,
  InspectionTypeEnum,
  getPersonNameAsBilingual,
  Lov
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin, throwError, noop, iif, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppealContributors, AppealOnViolation, CustomerInfo } from '../../models/appeal-on-violation';
import { IAppealOnViolation, ViolationTransaction } from '../../models';
import {
  AppealValidatorRolesIds,
  DocumentTransactionId,
  DocumentTransactionType,
  InspectionChannel,
  ViolationRouteConstants,
  ViolationsEnum,
  ViolationsValidatorService,
  getKeyByValue
} from '@gosi-ui/features/violations/lib/shared';
import { AppealValidatorRoles, AppealValidatorSpecialistsRoles } from '../../enums/appeal-validator-roles';
import { AppealViolationsService } from '../../services/appeal-violations.service';

@Directive()
export class AppealVlidatorBaseScComponent extends BaseComponent {
  /**
   * Local Varibles
   */
  assignedRole: string = null;
  channel: string;
  documentList: DocumentItem[];
  documents: DocumentItem[] = [];
  sequenceNumber: number;
  modalRef: BsModalRef;
  referenceNo: number;
  validatorForm: FormGroup = new FormGroup({});
  violationId: number;
  appeal: AppealOnViolation;
  transactionDetails: ViolationTransaction;
  personIdentifier: number;
  appealId: number;
  roleId: number;
  opinionList$: Observable<LovList>;
  legalOpinionList$: Observable<LovList>;
  appealSpecialistList: Lov[] = [];
  estRegNo: number;
  isReturn: boolean;
  canReturn: boolean;
  canReject: boolean = false;
  canAssignToSpecialist: boolean = false;
  canEdit: boolean;
  isButtonApprove: boolean;
  transactionReferenceData: TransactionReferenceData[] = [];
  transactionType: string = 'APPEAL_ON_VIOLATION';
  businessKey: string = '300394';
  canUserModified: boolean = false;
  transactionTitle: BilingualText;
  status: BilingualText;
  e_Inspection = false;
  isRasedInspection = false;
  checkFAN = false;
  isRaiseVioFoVcm: boolean;
  actions: WorkFlowActions[] = [];
  isSpecialist: boolean = false;
  employeeComment: string;

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
    readonly validatorService: ViolationsValidatorService,
    readonly appealVlcService: AppealViolationsService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
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
      if (token.violationId) this.violationId = token.violationId;
      if (token.appealId) this.appealId = token.appealId;
      if (token.status) this.status = token.status;
      this.employeeComment = tokenData.userComment[0]?.comment;

      if (token.assignedRole) {
        this.assignedRole = token.assignedRole.replace(/ /g, '');
      }
      if (token.titleEnglish && token.titleArabic)
        this.transactionTitle = { arabic: token.titleArabic, english: token.titleEnglish };
      if (token.previousOutcome === 'RETURN' && this.assignedRole === AppealValidatorRoles.IS_REVIEWER_VIOLATION)
        this.isReturn = true;
      if (this.assignedRole == Role.ESTABLISHMENT) this.canUserModified = true;
    }
    this.transactionReferenceData = this.routerDataToken.comments;
    this.actions = tokenData.customActions;

    const key = getKeyByValue(AppealValidatorRoles, this.assignedRole as AppealValidatorRoles);
    this.roleId = AppealValidatorRolesIds[key];

    this.isSpecialist = Object.values(AppealValidatorSpecialistsRoles).includes(
      this.assignedRole as unknown as AppealValidatorSpecialistsRoles
    );
    this.canReturn = this.actions.includes(WorkFlowActions.RETURN);
    this.checkIfCanAssignToSpecialist();
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
      case 5:
        action = WorkFlowActions.ASSIGN_TO_SPECIALIST;
        break;
    }
    return action;
  }

  // getRolesForView(tokenData: RouterData) {
  //   if (tokenData) {
  //     this.bpmTaskId = tokenData.taskId;
  //     this.assignedRole = tokenData.assignedRole;
  //     this.assigneeId = tokenData.assigneeId;
  //     this.assigneeName = tokenData.assigneeName;
  //   }
  // }

  /** Method to get lovlist . */
  getLovList() {
    this.opinionList$ = this.lookupService.getAovOpinionList();
    this.legalOpinionList$ = this.lookupService.getAovLegalOpinionList();
    this.lookupService.getAppealOnViolationSpecialist().subscribe(res => {
      this.appealSpecialistList = res;
    });
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
    if (this.appealId && this.violationId) {
      this.appealVlcService
        .getAppealDetailsAov(this.appealId, this.referenceNo)
        .subscribe((response: IAppealOnViolation) => {
          let mappedResponse = new AppealOnViolation();
          mappedResponse.contributors = response.decisions as unknown as AppealContributors[];
          mappedResponse.appealId = response?.appealId;
          this.appeal = mappedResponse;
          this.personIdentifier = response.objector;
          this.getPersonDetails();
        });
    }
  }

  /** Method to retrieve violation data. */
  getViolationDetails() {
    if (this.estRegNo && this.violationId) {
      this.validatorService
        .getTransactionDetails(this.violationId, this.estRegNo)
        .pipe(
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
            this.mapContributorName();
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
          )
          /*   catchError(err => {
              this.handleErrors(err, true);
              return throwError(err);
            })*/
        )
        .subscribe(noop, noop);
    }
  }

  /** Method for getting person detail. */
  getPersonDetails() {
    if (this.personIdentifier)
      this.appealVlcService
        .getPersonById(this.personIdentifier)
        .pipe(
          tap(res => {
            this.appeal.customerSummary = new CustomerInfo();
            this.appeal.customerSummary.customerName = getPersonNameAsBilingual(res && res.name);
            this.appeal.customerSummary.emailId =
              res && res.contactDetail && res.contactDetail.emailId && res.contactDetail.emailId.primary;
            if (res && res.identity)
              res.identity.forEach((item, index) => {
                if (item.idType === IdentityTypeEnum.NIN) this.appeal.customerSummary.id = <NIN>res.identity[index];
                else if (item.idType === IdentityTypeEnum.IQAMA)
                  this.appeal.customerSummary.id = <Iqama>res.identity[index];
              });
            //return customerInfo;
          })
        )
        ?.subscribe();
  }

  mapContributorName() {
    this.appeal.contributors.forEach(cont => {
      let fullContributorData = this.transactionDetails.contributors.find(
        contributor => contributor.contributorId === cont.contributorId
      );
      cont.contributorName = fullContributorData.contributorName;
      cont.penaltyAmount = fullContributorData.penaltyAmount;
    });
  }

  /** Method to get document list*/
  getDocuments(referenceNo: number) {
    if (referenceNo) {
      this.documentService
        .getOldDocumentContentId(null, null, null, this.referenceNo)
        .pipe(
          tap(
            (documentResponse: DocumentItem[]) => {
              if (documentResponse.length === 0) this.sequenceNumber = 1;
              else this.sequenceNumber = Math.max(...documentResponse.map(doc => doc.sequenceNumber)) + 1;
            },
            () => {
              this.sequenceNumber = 1;
            }
          ),
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
        ?.subscribe(response => (this.documents = response.filter(item => item.documentContent !== null)));
    }
  }

  saveWorkflow(data: BPMUpdateRequest): void {
    this.workflowService
      .mergeAndUpdateTask(data)
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

  navigateToViolationProfile() {
    const regNo = this.estRegNo;
    const violationId = this.violationId;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
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
        messageKey = 'VIOLATIONS.APPEAL-WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        messageKey = 'VIOLATIONS.APPEAL-WORKFLOW-FEEDBACKS.TRANSACTION-REJECTION-MESSAGE';
        break;
      case WorkFlowActions.RETURN:
        messageKey = 'VIOLATIONS.APPEAL-WORKFLOW-FEEDBACKS.TRANSACTION-RETURN-MESSAGE';
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
          ViolationsEnum.VIOLATION_TYPE,
          this.transactionDetails.inspectionInfo.visitId
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
          this.transactionDetails.contributors[0].socialInsuranceNo,
          ViolationsEnum.CONTRIBUTOR_NUMBER,
          this.transactionDetails.inspectionInfo.visitId
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

  checkIfCanAssignToSpecialist(): void {
    this.canAssignToSpecialist =
      this.actions.includes(WorkFlowActions.ASSIGN_TO_SPECIALIST) ||
      this.actions.includes(WorkFlowActions.TO_SPECIALIST);
  }
}
