import { Component, OnInit, Inject, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import {
  Transaction,
  BilingualText,
  TransactionReferenceData,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  TransactionService,
  WorkflowService,
  BpmTaskRequest,
  TransactionWorkflowDetails,
  TransactionStatus,
  BaseComponent,
  AlertService,
  MenuService,
  ItTicketStatusEnum,
  RouterConstants,
  RouterDataToken,
  RouterData,
  AuthTokenService,
  RoleIdEnum,
  AppealRequest,
  AppealDetailsResponse,
  JWTPayload,
  StorageService,
  LovList,
  LookupService,
  BPMUpdateRequest,
  CoreBenefitService
} from '@gosi-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { LovListConstants, TransactionConstants } from '@gosi-ui/features/complaints/lib/shared/constants';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { NotesTimelineResponse } from '../../models';

declare const require;

@Component({
  selector: 'trn-transaction-view-sc',
  templateUrl: './transaction-view-sc.component.html',
  styleUrls: ['./transaction-view-sc.component.scss']
})
export class TransactionViewScComponent extends BaseComponent implements OnInit, OnDestroy {
  transactionsJson = require('transactions.json');
  transaction: Transaction;
  transactionId: string;
  transactionRefId: string;
  header: BilingualText;
  comment: TransactionReferenceData[] = [];
  workflow: TransactionWorkflowDetails;
  modalRef: BsModalRef;
  reassignForm: FormGroup;
  applicationType = ApplicationTypeEnum;
  previousRequest: AppealDetailsResponse;
  isAdmin = false;
  showWorkflow = true;
  isItsm = false;
  incidentNumber: String;
  backPath: string;
  isIndividualApp = false;
  IsReopenTransaction: boolean = false;
  showReopen: boolean = false;
  userRoles: string[];
  isReopenRole: boolean = false;
  userId: number;
  showAppealForm = false;
  showAppealButton = false;
  appealView: string;
  isNotAppeal = false;
  psFeatures: string[] = [];
  estAppealActive: string = null;
  systemParameter: any;
  priorityList$: Observable<LovList> ;
  noteForm: FormGroup;
  notesTimeLine: NotesTimelineResponse[] = [];
  reassignUserId: string;
  @ViewChild('actBehalfParticipantModal', { static: true })
  actBehalfParticipantModal: TemplateRef<HTMLElement>;
  isBehalfParticipant = false;
  @ViewChild('submitNoteModal', {static: true})
  submitNoteModal: TemplateRef<HTMLElement>;
  showNoteBlock = false;
  acknowledgementMessage = {
    english: 'The transaction is currently in inbox of contributor',
    arabic: 'المعاملة حاليا في بريد المشترك '
  };
  constructor(
    readonly transactionService: TransactionService,
    readonly workflowService: WorkflowService,
    readonly route: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    readonly datePipe: DatePipe,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) private routerData: RouterData,
    readonly menuService: MenuService,
    readonly authTokenService: AuthTokenService,
    readonly lookUpService: LookupService,
    private storageService: StorageService,
    readonly coreBenefitService: CoreBenefitService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getUserRoles();
    this.noteForm = this.createNoteForm();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.appealView = localStorage.getItem('view');
    this.priorityList$ =  this.lookUpService.getPrioirtyList(LovListConstants.CATEGORY, LovListConstants.PRIORITY);
    this.estAppealActive = localStorage.getItem('Appeal_Est');
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.transactionService.getSystemParams().subscribe(res => {
        this.systemParameter = res.filter(item => item.name == 'REOPEN_COMPLAINT_ENQUIRY_EFFECTIVE_DATE');
        this.getTransactionDetails();
      });
    });
    this.goToTxnScreen();
    this.userId = this.authTokenService.getEstablishmentUID();
    const token = this.decodeToken(this.storageService.getLocalValue('AUTH_TOKEN_PRIVATE'));
    this.reassignUserId = token.uid ? token.uid : token.userreferenceid;
    this.transactionService.setReassignSuccessMsg(null);
  }

  getNoteTimeline() {
    this.transactionService.getNotesTimeline(this.transaction?.transactionRefNo).subscribe(
      response=> {
        this.notesTimeLine = response;
      },
      err => {
        this.alertService.showError(err?.error?.message);
      },
      ()=> {}
    );
  }

  createNoteForm(): FormGroup {
    return this.fb.group({
      priority: this.fb.group({
        english: [null, {validators: Validators.compose([Validators.required]), updateOn: 'change' }],
        arabic: [null]
      }),
      note: [null, { validators: Validators.compose([Validators.required]), updateOn: 'change' }],

    });
  }

  submitNote() {
    if(this.noteForm.valid){
      let payload = {
        note: this.noteForm.get('note').value,
        priority: this.noteForm.get('priority.english').value,
        transactionRefNo: this.transaction?.transactionRefNo,
      }
      this.transactionService.submitNote(payload).subscribe(
        successMsg => {
          this.alertService.showSuccess(successMsg);
          this.modalRef?.hide();
        },
        err => {
          this.alertService.showError(err?.error.message);
        },
        () => {}
      );
    }

    else {
      this.noteForm.markAllAsTouched();
    }
    
  }

  cancel() {
    this.modalRef?.hide();
    this.alertService.clearAlerts();
  }

  getTransactionDetails() {
    this.alertService.clearAlerts();
    this.transaction = this.route.snapshot.data.transaction;
    if (this.transaction) {
      (this.appToken === ApplicationTypeEnum.PRIVATE && this.showNoteBlock) ? this.getNoteTimeline() : '';
      const dateOne = moment(this.transaction.initiatedDate.gregorian);
      const dateTwo = moment(this.systemParameter[0]?.value);
      let a: any = dateOne.isAfter(dateTwo) ? -1 : 0;

      let noOfDays = this.calculateDiff(this.transaction.initiatedDate.gregorian);
      if (noOfDays <= 30 && this.transaction.status.english != 'Reopened' && a == -1) {
        this.showReopen = true;
      } else {
        this.showReopen = false;
      }
    }
    if (this.routerData.idParams.get('isreopen')) {
      this.IsReopenTransaction = true;
    } else {
      this.IsReopenTransaction = false;
    }
    if (this.transaction) {
      if (this.IsReopenTransaction) {
        let title: BilingualText;
        if (this.transaction.title.english.trim() == 'Complaint') {
          title = {
            arabic: 'إعادة فتح شكاوى',
            english: 'Reopen Complaint'
          };
        } else if (this.transaction.title.english.trim() == 'Enquiry') {
          title = {
            arabic: 'إعادة فتح استفسار',
            english: 'Reopen Enquiry'
          };
        }
        this.header = title;
      } else {
        this.header = this.transaction?.title;
        this.showAppealButton = this.transaction.canRequestReview;
        this.isNotAppeal = !TransactionConstants.APPEAL_DOCUMENT_DETAILS.find(
          item => item.transactionId == this.transaction.transactionId
        );
        if (this.transaction?.canAppeal) {
          this.transactionService.getAppealDetails(this.transaction.transactionRefNo).subscribe(
            response => {
              this.previousRequest = response;
              this.previousRequest == null || this.previousRequest?.decisionStatus.english != 'Approve'
                ? (this.showAppealButton = true)
                : '';
            },
            err => {
              this.alertService.showError(err.error.message);
            },
            () => {}
          );
        }
        if (this.header?.arabic?.toString().trim() === 'إضافة إصابة') {
          this.header.arabic = 'إبلاغ عن إصابة';
        }
      }
      this.transactionService.setTransactionDetails(this.transaction);
      this.getWorkflow();
      this.getComments();
    }
    if (this.appealView != 'appealview') {
      const txnDomain = this.transactionsJson?.transactionsList?.filter(
        txn => txn?.transactionId === this.transaction?.transactionId
      );
      if (txnDomain.length > 0) {
        //TODO: Common implementation for domains
        if (
          txnDomain[0].domain === 'benefits' &&
          this.transaction?.stepStatus?.english?.toUpperCase() === TransactionStatus.REJECTED
        ) {
          this.routeToRejectedTransaction(txnDomain);
          return;
        }
        const url = `${this.router.url}/${[txnDomain[0].domain, 'transactions', txnDomain[0].path].join('/')}`;
        if (this.menuService.checkURLPermission(url)) {
          this.router.navigate([txnDomain[0].domain, 'transactions', txnDomain[0].path], {
            queryParams: txnDomain[0]?.queryParams,
            relativeTo: this.route,
            replaceUrl: true
          });
        }
      }
    }
  }

  getWorkflow() {
    this.workflowService.getWorkFlowDetails(Number(this.transaction.transactionRefNo)).subscribe(response => {
      this.workflow = response;
      this.transactionService.setWorkflowDetails(this.workflow);
      if (this.transaction.status.english.toUpperCase() === TransactionStatus.COMPLETED.toUpperCase()) {
        const result = this.workflow?.transactionList?.filter(
          f =>
            f.status.english.toUpperCase() === TransactionStatus.APPROVED.toUpperCase() ||
            f.status.english.toUpperCase() === TransactionStatus.REJECTED.toUpperCase() ||
            f.status.english.toUpperCase() === TransactionStatus.WITHDRAWN.toUpperCase()
        );
        if (result?.length > 0) {
          this.showWorkflow = true;
        } else {
          this.showWorkflow = false;
        }
      }
      this.workflow?.transactionList?.forEach(element => {
        if (element.status.english.toUpperCase() === 'SUSPENDED') {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            element.approverName.english = element.actionedBy;
            element.approverRole.english = 'Manager';
            element.approverRole.arabic = 'مدير';
          }
        }
      });
      this.workflow?.workFlowList?.forEach(element => {
        if (element.approverRole?.english?.toUpperCase() === 'ITSM') {
          this.isItsm = true;
        }
        if (element.status.english.toUpperCase() === 'SUSPENDED') {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            element.approverName.english = element.actionedBy;
            element.approverRole.english = 'Manager';
            element.approverRole.arabic = 'مدير';
          }
        }
      });
    });
    if (this.transaction.transactionId === 101530) {
      this.showWorkflow = false;
    }
  }

  getComments() {
    const transactionName = this.transaction?.title?.english?.toString()?.trim();
    const transactionId = this.transaction?.transactionId;
    if (transactionId === 302020) {
      // FO comments
      const bpmTaskRequest = new BpmTaskRequest();
      bpmTaskRequest.taskId = this.transaction.taskId;
      bpmTaskRequest.workflowUser = '';
      this.workflowService.getCommentsUsingTask(bpmTaskRequest).subscribe((response: TransactionReferenceData[]) => {
        this.comment = response;
      });
    } else if (this.transaction.taskId || transactionName === 'Reimbursement Request') {
      const bpmTaskRequest = new BpmTaskRequest();
      bpmTaskRequest.taskId = this.transaction.taskId;
      bpmTaskRequest.workflowUser = '';
      this.workflowService
        .getCommentsById(
          bpmTaskRequest,
          this.appToken === ApplicationTypeEnum.PRIVATE || this.isIndividualApp
            ? this.transaction.transactionRefNo
            : null,
          true
        )
        .subscribe((response: TransactionReferenceData[]) => {
          this.incidentNumber = response?.length > 0 ? response[0]?.ticketNumber : null;
          this.comment = response.filter(item => item.ticketStatus !== ItTicketStatusEnum.OPEN);
        });
    }
  }

  routeToRejectedTransaction(txnDomain) {
    if (txnDomain[0]?.queryParams) txnDomain[0].queryParams.status = TransactionStatus.REJECTED;
    this.router.navigate([txnDomain[0].domain, 'transactions', txnDomain[0].path], {
      queryParams: txnDomain[0]?.queryParams,
      relativeTo: this.route,
      replaceUrl: true
    });
  }
  goToTxnScreen() {
    if (this.isIndividualApp) {
      // For individual app, there will be only transactions/list/history screen
      // For pvt, there will be "My Transactions" tab and "Transaction History" from overview page
      // Defect 557956: UAT Regression |Track Request- When click on the Injury ID from injury details page---> then click on back navigation icon:  it will shows the worklist summary
      this.backPath = RouterConstants.ROUTE_TRANSACTION_HISTORY;
    }
  }
  onBack() {
    if (!this.routerData.idParams.get('quickLinkReopen')) {
      this.IsReopenTransaction = false;
      this.routerData.idParams.delete('isreopen');
      this.routerData.idParams.delete('Complaint_ID');

      let title: BilingualText;
      if (this.transaction.title.english.trim() == 'Complaint') {
        title = {
          arabic: 'شكاوى',
          english: 'Complaint'
        };
      } else if (this.transaction.title.english.trim() == 'Enquiry') {
        title = {
          arabic: 'استفسار',
          english: 'Enquiry'
        };
      }
      this.header = title;
    }
  }

  // This is toggler method to show Appeal Form
  activateAppealForm() {
    this.showAppealForm = true;
  }

  deactivateAppealForm() {
    this.showAppealForm = false;
  }

  // This method is used to submit Appeal form
  submitAppeal(appealRequest: AppealRequest) {
    this.transactionService.submitAppeal(appealRequest).subscribe(
      response => {
        this.alertService.showSuccess(response.message);
        setTimeout(() => this.location.back(), 2000);
      },
      err => {
        this.alertService.showError(err.error.message);
      },
      () => {}
    );
  }

  addNote(){
    this.noteForm.reset();
    this.modalRef = this.modalService.show(
        this.submitNoteModal,
        Object.assign({},
          {
            class: `modal-${'md'}`,
            backdrop: true,
            ignoreBackdropClick: true
          }
        )
      );
  }

  ngOnDestroy() {
    this.workflowService.ticketHistory = [];
    this.transactionService.setTransactionDetails(null);
    this.alertService.clearAlerts();
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
    localStorage.removeItem('view');
    super.ngOnDestroy();
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor(
      (Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) -
        Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  onReopenClick() {
    this.IsReopenTransaction = true;
    let title: BilingualText;
    if (this.transaction.title.english.trim() == 'Complaint') {
      title = {
        arabic: 'إعادة فتح شكاوى',
        english: 'Reopen Complaint'
      };
    } else if (this.transaction.title.english.trim() == 'Enquiry') {
      title = {
        arabic: 'إعادة فتح استفسار',
        english: 'Reopen Enquiry'
      };
    }
    this.header = title;
    this.routerData.idParams.set('isreopen', true);
    this.routerData.idParams.set('Complaint_ID', this.transaction.businessId);
    this.routerData.idParams.set('quickLinkReopen', false);
    this.router.navigate([
      `home/transactions/view/${this.transaction.transactionId}/${
        this.transaction.transactionRefNo
      }/complaints/transactions/reopen/${true}`
    ]);
  }

  /** Method to get user roles. */
  getUserRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    if (gosiscp) {
      this.userRoles = gosiscp?.[0].role?.map(r => r?.toString());
      if (
        this.userRoles?.includes(RoleIdEnum.CUSTOMER_CARE_OFFICER.toString()) ||
        this.userRoles?.includes(RoleIdEnum.CALL_CENTRE_AGENT.toString()) ||
        this.userRoles?.includes(RoleIdEnum.CSR.toString())
      ) {
        this.isReopenRole = true;
      } else {
        this.isReopenRole = false;
      }
      this.actBehalfRole(); // story 323301
      this.getNoteTimelineRoles();
    }
  }

  getNoteTimelineRoles() {
    this.userRoles?.forEach(role => {
      if (+role === 121 || +role === 101 || +role === 184 || +role === 109 ||+role === 296) {
          //CCO || CSR || 360 All Users
        this.showNoteBlock = true;
      }
    });

  }

  actBehalfParticipant() {
    this.modalRef = this.modalService.show(
      this.actBehalfParticipantModal,
      Object.assign(
        {},
        {
          class: `modal-${'md'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
    // To fix the conflict between the two modals
    // this.modalRef ? this.alertService.showWarning(this.acknowledgementMessage) : '';
    // please don't uncomment this.alertService.showWarning(this.acknowledgementMessage) // for 323301
  }
  decodeToken(token) {
    if (token) {
      try {
        return jwtDecode<JWTPayload>(token);
      } catch (error) {
        return null;
      }
    }
  }
  actBehalfYes() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.transaction.taskId;
    bpmUpdateRequest.outcome = 'CAPTURED';
    bpmUpdateRequest.commentScope = 'BPM';
    bpmUpdateRequest.user = this.reassignUserId;
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest).subscribe(
      () => {
        this.modalRef?.hide();
        const message = {
          english: `The Transaction ${this.transaction?.transactionRefNo} is currently in your inbox`,
          arabic: `توجد معاملة ${this.transaction?.transactionRefNo} حاليًا في بريدك الوارد `
        };
        this.coreBenefitService.setBenefitAppliedMessage(message);
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
        setTimeout(() => {
          this.coreBenefitService.setBenefitAppliedMessage(null);
        }, 4000);
      },
      err => {
        this.modalRef?.hide();
        this.alertService.showErrorByKey(err?.messsage ? err?.message : err?.error?.message);
      }
    );
  }
  actBehalfParticipantApi() {
    const payloadRequestClarification = {
      reassignedUser: this.reassignUserId,
      taskId: this.transaction?.taskId,
      transactionId: this.transaction?.transactionRefNo
    };
    // As Discussed changes has been made in BE api to reassign transaction as per newPayload from UI 
    const reassignTask = {
      taskAssignees: { taskAssignee: this.reassignUserId },
      isGroup: 'false',
      type: 'user',
      taskId: [this.transaction?.taskId],
      commentScope: 'BPM',
      comments: ''
    };
    const newPayload = { ...payloadRequestClarification, reassignTask };
    this.transactionService
      .reassignRequestClarification(
        newPayload,
        this.header?.english?.trim(),
        this.transaction?.params?.SIN,
        this.transaction?.params?.BUSINESS_ID,
        +this.transaction?.assignedTo,
        this.transaction?.params?.MB_ASSESSMENT_REQUEST_ID
      )
      .subscribe(res => {
        if (res) {
          setTimeout(() => {
            this.actBehalfYes();
          }, 4000);
        }
      });
  }
  actBehalfRole() {
    this.userRoles?.forEach(role => {
      if (+role === 132) {
        //PMBO
        this.isBehalfParticipant = true;
      }
    });
  }
}
