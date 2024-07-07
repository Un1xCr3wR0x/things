/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Directive, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BPMTask,
  BilingualText,
  BpmTaskRequest,
  DocumentItem,
  DocumentService,
  Environment,
  EnvironmentToken,
  ItTicketHistory,
  LookupService,
  Lov,
  LovList,
  MenuService,
  Role,
  RoleIdEnum,
  RouterConstants,
  RouterData,
  RouterDataToken,
  RouterService,
  Transaction,
  TransactionReferenceData,
  TransactionService,
  TransactionWorkflowDetails,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService,
  getChannel,
  setTicketCommentResponse,
  AuthTokenService,
  removeEscapeChar,
  BPMUpdateRequest,
  BPMMergeUpdateParamEnum,
  ItTicketResponse,
  AppealDetailsResponse
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  RouterConstants as ContactRouterConstants,
} from '../../../shared/constants';
import {
  ActionSequence,
  ComplaintConstants,
  LovListConstants,
  PriorityListConstants,
  TransactionActionMessageConstants,
  TransactionConstants
} from '../../constants';
import { CategoryEnum } from '../../enums';
import { ClerkDetails, DepartmentDetails, TransactionSummary } from '../../models';
import { TransactionType } from '../../models/transaction-Type-List';
import { ValidatorRoutingService, ValidatorService } from '../../services';
import { ContactBaseHelperScComponent } from './contact-base-helper-sc.component';
import { ITSMDetails } from '../../models/itsm-details';
import { ITSMReopenRequest } from '../../models/ITSM-Reopen-Request';
import { AppealOnViolationDetailsResponse } from '@gosi-ui/core/lib/models/appeal-on-violation-details-response';
import { IAppealOnViolation } from '@gosi-ui/features/violations/lib/shared/models';
import { AppealOnViolation, AppealContributors } from '@gosi-ui/features/violations/lib/shared/models/appeal-on-violation';
@Directive()
export abstract class ContactBaseScComponent extends ContactBaseHelperScComponent implements OnInit, OnDestroy {
  isTracking = false;
  actionForm: FormGroup = new FormGroup({});
  actions: string[] = [];
  assignedRole: string = null;
  buttonLabel = ComplaintConstants.SUBMIT;
  canEdit = true;
  canEditPriorityOnly: boolean;
  categoryList$: Observable<LovList>;
  clerkList$: Observable<ClerkDetails[]>;
  comment: TransactionReferenceData[] = [];
  commentsMandatory: boolean;
  complaint = ComplaintConstants.COMPLAINT;
  currentAction: string = null;
  dateLabel: string;
  departmentList$: Observable<DepartmentDetails[]>;
  detailLabel: string;
  header: string;
  heading: string;
  isTypeLabel = true;
  isPrivate: boolean;
  isTypeSelected = false;
  locationList$: Observable<LovList>;
  message: string;
  modalHeader: string;
  modalRef: BsModalRef;
  previousOutcome: string;
  previousRole: string;
  priorityList: LovList = new LovList([]);
  registrationNo: string;
  resubmitHeader: string;
  simisTransactionSummary: TransactionSummary;
  subCategoryList$: Observable<LovList>;
  subTypeLabel: string;
  subTypeList$: Observable<LovList>;
  subTypeList: BehaviorSubject<LovList>;
  subtype: BilingualText;
  summaryHeading: string;
  transactionId: number = null;
  transactionSummary: TransactionSummary = new TransactionSummary();
  transactionTypeForm: FormGroup = new FormGroup({});
  type: BilingualText;
  typeLabel: string;
  typeList$: Observable<LovList>;
  workflow: TransactionWorkflowDetails;
  canRaiseItsm = false;
  taskId: string;
  assigneeId: string;
  documentLoaded = new BehaviorSubject<boolean>(false);
  documentLoaded$ = this.documentLoaded.asObservable();
  ticketHistory: ItTicketHistory[];
  customerIdentifier: number = null;
  isNavigateToTracking = false;
  transactionTypeList: TransactionType[] = [];
  timeLabel: string;
  isTicketNumber: boolean = false;
  itsmDetails: ITSMDetails;
  appealDetails: AppealDetailsResponse;
  appealOnViolationDetails: AppealOnViolationDetailsResponse;
  decisionDocument: DocumentItem[] = []
  appeal: AppealOnViolation;

  appealId: number;

  /**
   * @param modalService
   * @param validatorService
   * @param documentService
   * @param uuidService
   * @param alertService
   * @param router
   * @param workflowService
   * @param route
   * @param routerData
   * @param appToken
   * @param routerService
   * @param lookUpService
   * @param validatorRoutingService
   */
  constructor(
    readonly formBuilder: FormBuilder,
    readonly modalService: BsModalService,
    readonly validatorService: ValidatorService,
    readonly documentService: DocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly routerService: RouterService,
    readonly lookUpService: LookupService,
    readonly validatorRoutingService: ValidatorRoutingService,
    readonly location: Location,
    readonly menuService: MenuService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly authTokenService: AuthTokenService
  ) {
    super(
      formBuilder,
      validatorService,
      documentService,
      uuidService,
      alertService,
      lookUpService,
      modalService,
      appToken
    );
  }
  /*
   * Method to initialize tasks
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    this.setApplicationType();
    this.typeLabel = ComplaintConstants.TYPE_LABEL;
    this.subTypeLabel = ComplaintConstants.SUBTYPE_LABEL;
    if (
      this.validatorRoutingService.complaintRouterData &&
      this.validatorRoutingService.complaintRouterData.taskId !== undefined &&
      !this.isTracking
    ) {
      this.transactionTraceId = this.validatorRoutingService.complaintRouterData.transactionTraceId;
      this.businessKey = this.validatorRoutingService.complaintRouterData.businessKey;
      this.category = this.validatorRoutingService.complaintRouterData.requestType;
      this.assignedRole = this.validatorRoutingService.complaintRouterData.assignedRole;
      this.assigneeId = this.validatorRoutingService.complaintRouterData.assigneeId;
      this.taskId = this.validatorRoutingService.complaintRouterData.taskId;
      this.customerIdentifier = this.validatorRoutingService.complaintRouterData.complainant;
      this.setTransactionId(this.category);
      this.setLabels(this.category);
      this.getDocuments();
      this.getTransactionDetails();
      this.getComments();
      this.getworkflowDetails(this.transactionTraceId);
      if (
        this.isPrivate === true &&
        (this.assignedRole === Role.CUSTOMER_CARE_OFFICER ||
          this.assignedRole === Role.CUSTOMER_CARE_SENIOR_OFFICER ||
          this.category === CategoryEnum.SUGGESTION)
      ) {
        this.canEdit = true;
      } else this.canEdit = false;
      const roles = this.menuService.getRoles();
      if (
        roles.find(
          item =>
            item === RoleIdEnum.CUSTOMER_CARE_OFFICER.toString() ||
            item === RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER.toString()
        ) ||
        (this.validatorRoutingService.complaintRouterData.requestType === CategoryEnum.SUGGESTION &&
          roles.includes(RoleIdEnum.COMPLAINT_MANAGER.toString()))
      ) {
        this.canEdit = true;
      } else this.canEdit = false;
    } else this.navigateToInbox();
    this.getTransactionsTypesList();
  }
  /*
   * Method to get bpm task details
   */
  getTaskDetails(updateAll: boolean = true, isLocationBack = false) {
    if (this.taskId) {
      const bpmTaskRequest = new BpmTaskRequest();
      bpmTaskRequest.taskId = this.taskId;
      bpmTaskRequest.workflowUser = '';
      if (this.validatorRoutingService.complaintRouterData && this.validatorRoutingService.complaintRouterData.taskId) {
        this.transactionSummary.priority = PriorityListConstants.PRIORITY_LIST.find(
          item => item.code?.toString() === this.validatorRoutingService.complaintRouterData.priority?.toString()
        )?.value;
        this.previousOutcome = this.validatorRoutingService.complaintRouterData.previousOutcome;
        this.previousRole = this.validatorRoutingService.complaintRouterData.returnToCustomerUser;
      } else {
        if (!this.isTracking) {
          this.workflowService.getBPMTask(bpmTaskRequest).subscribe(
            (res: BPMTask) => {
              this.transactionSummary.priority = PriorityListConstants.PRIORITY_LIST.find(
                item => item.code?.toString() === res.priority?.toString()
              )?.value;
              this.previousOutcome = res.previousOutcome;
              this.previousRole = res.returnToCustomerUser;
            },
            () => {
              if (!this.isTracking) {
                if (isLocationBack) this.location.back();
                else this.navigateToInbox();
              }
            }
          );
        }
      }
      if (updateAll) {
        this.clearActions();
        if (
          this.validatorRoutingService.complaintRouterData &&
          this.validatorRoutingService.complaintRouterData.customActions
        ) {
          ActionSequence.GET_ORDER.forEach(order => {
            this.validatorRoutingService.complaintRouterData.customActions.forEach(item => {
              if (order === item) {
                if (
                  item === WorkFlowActions.RETURN_TO_CUSTOMER &&
                  this.validatorRoutingService.complaintRouterData.assignedRole === Role.DEPARTMENT_HEAD
                )
                  this.actions.push(WorkFlowActions.RETURN_TO_CUSTOMER_CARE);
                else if (
                  item === WorkFlowActions.REQUEST_ITSM &&
                  (this.validatorRoutingService.complaintRouterData.requestType === CategoryEnum.COMPLAINT ||
                    this.validatorRoutingService.complaintRouterData.requestType === CategoryEnum.ENQUIRY ||
                    this.validatorRoutingService.complaintRouterData.requestType === CategoryEnum.SUGGESTION)
                )
                  this.canRaiseItsm = true;
                else this.actions.push(item);
              }
            });
          });
        }
      } else {
        if (!this.isTracking)
          this.workflowService.getBPMTask(bpmTaskRequest).subscribe((res: BPMTask) => {
            this.transactionSummary.priority = PriorityListConstants.PRIORITY_LIST.find(
              item => item.code?.toString() === res.priority?.toString()
            )?.value;
          });
      }
    }
  }
  /**Method to set the application type */
  setApplicationType() {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }
  /** Method to set transaction ID @param category */
  setTransactionId(category: string) {
    if (
      TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.filter(
        item => item.category.toLowerCase() === category.toLowerCase()
      ).length > 0
    ) {
      this.transactionId = TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
        item => item.category.toLowerCase() === category.toLowerCase()
      ).transactionId;
    }
  }
  /** Method to set labels @param category*/
  setLabels(category: string) {
    if (LovListConstants?.LABELS?.filter(item => item.value === category)) {
      const constantItem = LovListConstants?.LABELS?.find(
        item => item?.value?.toLowerCase() === category?.toLowerCase()
      );
      this.typeLabel = constantItem?.typeLabel;
      this.subTypeLabel = constantItem?.subTypeLabel;
      this.dateLabel = constantItem?.dateLabel;
      this.timeLabel = constantItem?.timeLabel;
      this.detailLabel = constantItem?.detailLabel;
      this.summaryHeading = constantItem?.heading;
      this.resubmitHeader = constantItem?.resubmitHeader;
    }
    if (
      (CategoryEnum.COMPLAINT &&
        this.category &&
        this.category.toLowerCase() === CategoryEnum.COMPLAINT.toLowerCase()) ||
      this.category === CategoryEnum.ENQUIRY
    ) {
      this.header = ComplaintConstants.COMPLAINT_AGAINST;
    } else if (this.category === CategoryEnum.APPEAL) {
      this.header = ComplaintConstants.APPEAL_AGAINST;
    } else if (this.category === CategoryEnum.PLEA) {
      this.header = ComplaintConstants.PLEA_AGAINST;
    }
  }
  /** This method is to show the modal reference.@param templateRef */
  showModal(templateRef: TemplateRef<HTMLElement>, value: string) {
    if (value === this.complaint) {
      this.commentsMandatory = false;
      this.modalHeader = ComplaintConstants.COMPLAINT_HEADER;
    }
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }
  /** This method is to get workflow details  @param transactionId */
  getworkflowDetails(transactionId: number) {
    this.workflowService.getWorkFlowDetails(transactionId).subscribe(res => {
      this.workflow = res;
    });
  }
  /* This method is to handle confirm modal*/
  approveEvent() {
    if (this.modalRef) this.modalRef.hide();
  }


  /**
   * Method to get general appeal transaction details
   */

  getAppealDetails() {
    if(this.appealId){
      this.transactionService.getAppealDetailsById(this.appealId).subscribe(
        response => {
          this.appealDetails = response;
          this.getCustomerDetails(this.appealDetails.objector);
        },
        err => {
          this.alertService.showError(err.error.message);
        },
        () => { }
      );
    }
  }

  /**
   * Method to get Appeal on Violation Details 
   */
  getAppealOnViolationDetails() {
    this.transactionService.getAppealOnViolationDetailsById(this.appealId).subscribe(
      response => {
        this.appealOnViolationDetails = response;
      },
      err => {
        this.alertService.showError(err.error.message);
      },
      () => { }
    );
  }

  /** Method to retrieve violations data. */
  getAppealViolationDecisionDetails() {
    if (this.appealId) {
      this.transactionService
        .getAppealDetailsAov(this.appealId, this.transactionId)
        .subscribe((response: IAppealOnViolation) => {
          let mappedResponse = new AppealOnViolation();
          mappedResponse.contributors = response.decisions as unknown as AppealContributors[];
          this.appeal = mappedResponse;
        });
    }
  }

  populateViolativeUsers() {

  }

  /**
   * Method to get transaction details
   */
  getTransactionDetails(isModified: boolean = true) {
    if (this.businessKey) {
      this.validatorService.getTransactionDetails(this.businessKey).subscribe((res: TransactionSummary) => {
        new TransactionSummary().fromJsonToObject(res, this.transactionSummary);
        if (this.transactionSummary) {
          if (this.transactionSummary.category) {
            if (
              this.transactionSummary.category.english === CategoryEnum.APPEAL ||
              this.transactionSummary.category.english === CategoryEnum.PLEA
            )
              this.isTypeLabel = false;
          }
          this.type = this.transactionSummary.type;
          this.subtype = this.transactionSummary.subtype;
          this.transactionSummary.entryChannel = getChannel(this.validatorRoutingService.complaintRouterData.channel);
          if (this.transactionSummary.transactionRefNo && isModified) {
            this.validatorService
              .getSimisTransactionDetails(this.transactionSummary.transactionRefNo)
              .subscribe((resp: TransactionSummary) => {
                this.simisTransactionSummary = resp;
              });
          }
        }
        if (isModified) {
          if (this.transactionSummary && this.category !== CategoryEnum.SUGGESTION) {
            if (this.transactionSummary.registrationNos.length > 0) {
              for (const regNo of this.transactionSummary.registrationNos) {
                this.getEstablishmentDetails(regNo);
              }
            } else {
              this.getEstablishmentDetails(this.transactionSummary.registrationNo);
            }
            this.getCustomerDetails(this.transactionSummary.complainant, this.transactionSummary.registrationNo);
          }
        }
      });
    }
  }
  /**
   * method to get entered comments
   */
  getComments() {
    if (this.validatorRoutingService.complaintRouterData && this.validatorRoutingService.complaintRouterData.comments) {
      if (this.category !== CategoryEnum.APPEAL && this.category !== CategoryEnum.PLEA)
        this.getTicketHistory(this.transactionTraceId, this.validatorRoutingService.complaintRouterData.comments);
      else this.comment = this.validatorRoutingService.complaintRouterData.comments;
    }
  }
  /**
   * Method to get ticket history
   * @param referenceNo
   * @param validatorComments
   */
  getTicketHistory(referenceNo: number, validatorComments?: TransactionReferenceData[]) {
    this.workflowService.getTicketHistory(referenceNo).subscribe(
      (res: ItTicketHistory[]) => {
        this.ticketHistory = res;
        const ticketComments: TransactionReferenceData[] = setTicketCommentResponse(res);
        const comments = validatorComments;
        comments?.push(...ticketComments);
        this.comment = comments?.sort(
          (v1, v2) => Number(new Date(v2.createdDate.gregorian)) - Number(new Date(v1.createdDate.gregorian))
        );
      },
      () => {
        this.comment = validatorComments;
      }
    );
  }
  /** This method is to navigate to inbox */
  navigateToInbox() {
    this.router.navigate([this.isPrivate ? RouterConstants.ROUTE_INBOX : RouterConstants.ROUTE_TODOLIST]);
  }
  /**
   * Method to handle confirm on cancel popup
   */
  confirmCancel() {
    if (this.modalRef) {
      this.modalRef.hide();
      this.navigateToInbox();
    }
  }
  /** Method to handle decline on cancel popup*/
  decline() {
    if (this.modalRef) this.modalRef.hide();
  }
  /**
   * method to det department details
   * @param location
   */
  getDepartmentDetails(location: Lov) {
    this.departmentList$ = this.validatorService.getDepartmentDetails(location.code);
  }
  /** This method is to clear all actions */
  clearActions(): void {
    this.actions = [];
  }

  /** method to set success message @param action @param role*/
  setMessage(action: string, role: string): string {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP || this.appToken === ApplicationTypeEnum.PUBLIC) {
      return TransactionActionMessageConstants.GET_MESSAGE.find(item => item.action === action)?.message;
    } else {
      if (this.previousOutcome === WorkFlowActions.DELEGATE && this.previousRole) {
        return TransactionActionMessageConstants.GET_MESSAGE.find(
          item => item.action === action && item.role === this.previousRole
        )?.message;
      } else
        return TransactionActionMessageConstants.GET_MESSAGE.find(item => item.action === action && item.role === role)
          ?.message;
    }
  }
  /** Method to get document list @param isTaskDetails*/
  getDocuments(isTaskDetails = true) {
    this.documentService
      .getOldDocumentContentId(this.transactionTraceId)
      .pipe(
        tap(
          (documentResponse: DocumentItem[]) => {
            if (documentResponse.length === 0) this.sequenceNumber = 1;
            else this.sequenceNumber = Math.max(...documentResponse.map(doc => doc.sequenceNumber)) + 1;
          },
          () => {
            this.sequenceNumber = 1;
          },
          () => {
            if (isTaskDetails) this.getTaskDetails();
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
      .subscribe(response => (this.documents = response.filter(item => item.documentContent !== null)));
  }



  getAppealDocuments(referenceNo: number) {
    this.documentService
      .getOldDocumentContentId(null, null, null, referenceNo)
      .pipe(
        tap(
          (documentResponse: DocumentItem[]) => {
            if (documentResponse.length === 0) this.sequenceNumber = 1;
            else this.sequenceNumber = Math.max(...documentResponse.map(doc => doc.sequenceNumber)) + 1;
          },
          () => {
            this.sequenceNumber = 1;
          },
          () => {
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
      .subscribe(
        response => {
          response.forEach(item => { item.required = true; item.canDelete = true });
          this.documents = response.filter(item => item.documentContent !== null &&
            item.documentTypeId != 2517 &&
            item.documentTypeId != 2519
          );
          this.decisionDocument = response.filter(item => item.documentContent !== null &&
            (item.documentTypeId == 2517 ||
              item.documentTypeId == 2519)
          );
        });
  }

  getDocumentsObservable(referenceNo: number): Observable<DocumentItem[]> {
    return this.documentService
      .getOldDocumentContentId(null, null, null, referenceNo)
      .pipe(
        tap(
          (documentResponse: DocumentItem[]) => {
            if (documentResponse.length === 0) this.sequenceNumber = 1;
            else this.sequenceNumber = Math.max(...documentResponse.map(doc => doc.sequenceNumber)) + 1;
          },
          () => {
            this.sequenceNumber = 1;
          },
          () => {
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
  }

  onNavigateToSaedni(ticketNumber: string) {
    if (ticketNumber || this.ticketHistory[0].ticketNumber)
      this.isTicketNumber = true;
    ticketNumber = ticketNumber ? ticketNumber : this.ticketHistory[0].ticketNumber;
    this.validatorService.getITSMDetails(ticketNumber).subscribe(res => {
      this.itsmDetails = res;
      this.itsmDetails.category = this.category;
      this.itsmDetails.resolvedDate = this.ticketHistory[0].resolvedDate;

      if (this.isTracking) {
        this.router.navigate([`/home/complaints/itsm/itsmDetails/${ticketNumber}`]);
      }
    })
  }

  /** Method to redirect to saedni application @param ticketNumber */
  onITSMDetails(ticketNumber: string) {
    if (this.environment.saedniUrlNew && ticketNumber)
      window.open(this.environment.saedniUrlNew.replace('{incidentNumber}', ticketNumber), '_blank');
  }

  onSubmit1(data) {
    this.alertService.clearAlerts();
    const request: ITSMReopenRequest = new ITSMReopenRequest();
    request.notes = `${removeEscapeChar(data.value.additionalNote)} ${this.validatorRoutingService.complaintRouterData.transactionTraceId}`;
    request.incidentNumber = this.itsmDetails.incidentNumber;
    this.workflowService.raiseItTicketReopen(request).subscribe(
      res => {
        const itTicketResponse: ItTicketResponse = new ItTicketResponse().fromJsonToObject(res);
        if (itTicketResponse && this.validatorRoutingService.complaintRouterData) {
          const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
          bpmUpdateRequest.taskId = this.validatorRoutingService.complaintRouterData.taskId;
          bpmUpdateRequest.payload = this.validatorRoutingService.complaintRouterData.content;
          bpmUpdateRequest.outcome = WorkFlowActions.REQUEST_ITSM;
          bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.ITSMNUMBER, itTicketResponse.incidentNumber);
          this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
            () => {
              if (this.modalRef) this.modalRef.hide();
              this.router.navigate([RouterConstants.ROUTE_INBOX]);
              this.alertService.showSuccessByKey(ComplaintConstants.REOPEN_ITSM_SUCCESS, {
                referenceNo: this.validatorRoutingService.complaintRouterData.transactionTraceId,
                incidentNumber: itTicketResponse.incidentNumber
              });
              this.validatorRoutingService.removeRouterToken();
            },
            err => {
              if (this.modalRef) this.modalRef.hide();
              this.alertService.showError(err.error.message);
            }
          );
        }
      })
  }

  onNavigateToTransaction(transaction: Transaction) {
    this.isNavigateToTracking = true;
    this.transactionService.navigate(transaction);
  }

  /** This method is to get tran lookups */
  getTransactionsTypesList(): void {
    this.categoryList$ = this.lookUpService
      .getContactLists(LovListConstants.CATEGORY, LovListConstants.DOMAIN_CATEGORY)
      .pipe(
        map((res: LovList) => {
          if (res && res.items && res.items.length > 0) {
            return new LovList(res.items);
          }
        })
      );
    /** get lookup api */
    this.validatorService.getTransactionsTypesList().subscribe(response => {
      this.transactionTypeList = response;
    });
  }
}
