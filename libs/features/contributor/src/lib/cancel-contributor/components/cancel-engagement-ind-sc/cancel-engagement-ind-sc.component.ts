import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Alert,
  AlertIconEnum,
  AlertService,
  AlertTypeEnum,
  Channel,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  TransactionService,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService,
  bindToObject,
  getPersonNameAsBilingual,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import {
  CancelContributorDetails,
  CancelContributorService,
  Contributor,
  ContributorBPMRequest,
  ContributorConstants,
  ContributorService,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementDetails,
  EngagementService,
  Establishment,
  EstablishmentService,
  MaxLengthEnum,
  SystemParameter,
  TransactionId
} from '../../../shared';

@Component({
  selector: 'cnt-cancel-engagement-ind-sc',
  templateUrl: './cancel-engagement-ind-sc.component.html',
  styleUrls: ['./cancel-engagement-ind-sc.component.scss']
})
export class CancelEngagementIndScComponent implements OnInit {
  penaltyInfo: Alert;
  currentLang = 'en';
  registrationNumber: number;
  socialInsuranceNumber: number;
  referenceNo: number;
  taskId: string = undefined;
  isUnclaimed: boolean;
  transactionRefData: TransactionReferenceData[];
  establishmentDetails: Establishment;
  isPPA: boolean;
  contributor: Contributor;
  uuid: string;
  isBillBatch: boolean;
  systemParams: SystemParameter;
  cancelEngForm: FormGroup;
  documents: DocumentItem[];
  contributorDocs: DocumentItem[];
  commentMaxLength = MaxLengthEnum.COMMENTS;
  isDocumentUpload: boolean;
  isAnyDoc: boolean;
  cancelEngList: LovList = new LovList([]);
  engagementId: any;
  engagementDetails: EngagementDetails;
  cancelEngData: CancelContributorDetails;
  infoMessage: string;
  transactionId: number;
  customActions = [];
  docUploaded = false;
  payload;
  minDiff: any;
  seconds: string;
  secDiff: any;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly cancelContributorService: CancelContributorService,
    private alertService: AlertService,
    private uuidGeneratorService: UuidGeneratorService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    protected fb: FormBuilder,
    readonly documentService: DocumentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.currentLang = lang;
    });
    this.initialiseCancelChoice();
    this.transactionId = TransactionId.CANCEL_CONTRIBUTOR;
    this.initialiseForm();
    this.setRouterData();
    this.showPenaltyInfo();
    this.getEstablishment();
    this.getContributor();
    this.getEngagements();
    // this.getViolationRequest();
    this.getUuid();
    this.getSystemParameters();
    this.getDocuments();
    this.calculateTimeDiff();
  }
  initialiseForm() {
    this.cancelEngForm = this.fb.group({
      choice: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      acknowledge: [false, Validators.requiredTrue]
    });
    this.cancelEngForm
      .get('choice')
      .setValue(this.isAnyDoc ? this.cancelEngList.items[1]['value'] : this.cancelEngList.items[0]['value']);
    this.listenForCancelEng(this.cancelEngForm.get('choice.english').value);
  }
  initialiseCancelChoice() {
    this.cancelEngList.items.push({ value: { english: 'Agree', arabic: 'موافق' }, sequence: 1 });
    this.cancelEngList.items.push({ value: { english: 'Disagree', arabic: 'غير موافق' }, sequence: 2 });
  }
  /** Method to show penalty information Alert */
  showPenaltyInfo() {
    this.infoMessage = this.isPPA ? `CONTRIBUTOR.COMPLIANCE.E-INFO-PPA` : `CONTRIBUTOR.COMPLIANCE.E-INFO`;
    this.penaltyInfo = new Alert();
    this.penaltyInfo.messageKey = this.infoMessage;
    this.penaltyInfo.type = AlertTypeEnum.INFO;
    this.penaltyInfo.dismissible = false;
    this.penaltyInfo.icon = AlertIconEnum.INFO;
  }
  setRouterData() {
    if (this.routerDataToken.payload) {
      this.payload = JSON.parse(this.routerDataToken.payload);
      this.registrationNumber = this.payload.registrationNo;
      this.socialInsuranceNumber = this.payload.socialInsuranceNo;
      // this.requestId = payload.requestId;
      this.referenceNo = parseInt(this.payload.referenceNo, 10);
      // this.state = payload?.previousOutcome;
      this.taskId = this.routerDataToken.taskId;
      this.isUnclaimed = this.payload?.isPool;
      this.engagementId = this.payload?.engagementId;
      this.customActions = this.routerDataToken?.customActions;
      // this.isKashefChannel = payload?.roleId === Channel.KASHEF;
    }
    this.transactionRefData = this.routerDataToken.comments;
  }
  /** Method to get establishment details*/
  getEstablishment() {
    this.establishmentService.getEstablishmentDetails(this.registrationNumber).subscribe(data => {
      this.establishmentDetails = bindToObject(new Establishment(), data);
      this.isPPA = data.ppaEstablishment;
      this.showPenaltyInfo();
      this.getCancellationData();
    });
  }
  /**
   * Method to get contributor details
   */
  getContributor() {
    this.contributorService.getContributor(this.registrationNumber, this.socialInsuranceNumber).subscribe(data => {
      this.contributor = data;
    });
  }
  getEngagements() {
    this.engagementService
      .getEngagementDetails(this.registrationNumber, this.socialInsuranceNumber, this.engagementId, null, false, true)
      .subscribe(data => {
        this.engagementDetails = data;
      });
  }
  getCancellationData() {
    this.cancelContributorService
      .getCancellationDetails(this.registrationNumber, this.socialInsuranceNumber, this.engagementId, this.referenceNo)
      .subscribe(res => {
        this.cancelEngData = res;
        if (this.isPPA) this.getContributorUploadedDocs();
      });
  }
  getUuid() {
    this.uuid = this.uuidGeneratorService.getUuid();
  }
  /** Method to get system parameters. */
  getSystemParameters() {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParams = new SystemParameter().fromJsonToObject(res);
      if (this.systemParams.BILL_BATCH_INDICATOR === 1) {
        this.alertService.setInfoByKey('CONTRIBUTOR.SERVICE-MAINTANACE');
        this.isBillBatch = true;
      }
    });
  }
  /** Method to fetch required documents for the transaction. */
  getDocuments() {
    const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
    this.documentService
      .getRequiredDocuments(
        DocumentTransactionId.CANCEL_CONTRIBUTOR,
        !approveWithDocs
          ? DocumentTransactionType.CANCEL_ENGAGEMENT_INDIVIDUAL_ADMIN
          : DocumentTransactionType.CANCEL_INDIVIDUAL_ADMIN_WITH_DOCS
      )
      .subscribe(res => {
        this.documents = this.documentService.removeDuplicateDocs(res);
      });
  }
  getContributorUploadedDocs() {
    this.documentService
      .getDocuments(
        DocumentTransactionId.CANCEL_CONTRIBUTOR,
        DocumentTransactionType.CANCEL_ENGAGEMENT_INDIVIDUAL,
        this.engagementId,
        this.referenceNo
      )
      .subscribe(res => {
        this.contributorDocs = res.filter(item => item.documentContent !== null);
      });
  }

  confirmEngagement() {
    this.cancelEngForm.markAllAsTouched();
    markFormGroupTouched(this.cancelEngForm);
    const action =
      this.cancelEngForm.get('choice').get('english').value === 'Agree'
        ? WorkFlowActions.APPROVE
        : WorkFlowActions.REJECT;
    let validDocs = true;
    if (action === WorkFlowActions.APPROVE) {
      this.documentService.checkMandatoryDocuments(this.documents) ? (validDocs = true) : (validDocs = false);
    }
    if (this.cancelEngForm.get('acknowledge').valid || (this.isPPA && validDocs)) {
      const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
      action === WorkFlowActions.APPROVE && this.isPPA && this.routerDataToken?.channel === Channel.TAMINATY
        ? this.handleApproveForPPA({
            action: approveWithDocs ? WorkFlowActions.APPROVE_WITH_DOCS : action,
            comments: this.cancelEngForm?.get('comments')?.get('comments').value
          })
        : this.updateWorkFlow({ action: action, comments: this.cancelEngForm?.get('comments')?.get('comments').value });
    } else {
      if (!validDocs) {
        this.alertService.showMandatoryDocumentsError();
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  handleApproveForPPA(action) {
    if (!this.documentService.checkMandatoryDocuments(this.documents)) {
      this.alertService.showMandatoryErrorMessage();
    } else {
      // const comments = this.cancelEngForm.get('comments.comments').value;
      this.cancelContributorService
        .adminApproveTransaction(
          this.registrationNumber,
          this.socialInsuranceNumber,
          this.engagementId,
          this.referenceNo
        )
        .subscribe(
          () => {
            this.updateWorkFlow(action);
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  showError(error) {
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }
  cancelTransaction() {
    this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
  }
  /* Method to update theworkflow */
  updateWorkFlow(userInput) {
    const workflowData = new ContributorBPMRequest();
    workflowData.taskId = this.routerDataToken.taskId;
    workflowData.user = this.routerDataToken.assigneeId;
    workflowData.outcome = userInput.action;
    workflowData.comments = userInput.comments;
    if (
      (this.documents && this.documentService.checkMandatoryDocuments(this.documents)) ||
      userInput.action === WorkFlowActions.REJECT
    ) {
      this.workflowService.updateTaskWorkflow(workflowData).subscribe(
        res => {
          if (res) {
            this.getInspectionSuccessMessage(workflowData.outcome);
            this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }

  /*Methode to successmessage after workflow save  **/
  getInspectionSuccessMessage(action: string) {
    let message: string;
    if (action === WorkFlowActions.APPROVE || action === WorkFlowActions.APPROVE_WITH_DOCS) {
      if (this.isPPA) {
        this.transactionId = this.routerDataToken.transactionId;
        let agreeMessage = 'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-AGREE-SUCCES-MESSAGE-CANCEL-PPA';
        let personName = getPersonNameAsBilingual(this.contributor?.person?.name);
        personName.english = personName.english ?? personName.arabic;
        const params = {
          personFullName: personName,
          transactionId: this.transactionId
        };
        this.alertService.showSuccessByKey(agreeMessage, params, 15);
      } else {
        message = 'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-AGREE-SUCCES-MESSAGE';
        this.alertService.showSuccessByKey(message, null, 5);
      }
    } else if (action === WorkFlowActions.REJECT) {
      let rejectMessage: string;
      this.transactionId = this.routerDataToken.transactionId;
      rejectMessage = this.isPPA
        ? 'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-DISAGREE-CANCEL-INSPECTION-PPA'
        : ContributorConstants.EST_ADMIN_DISAGREE_CANCEL_INSPECTION;
      let personName = getPersonNameAsBilingual(this.contributor?.person?.name);
      personName.english = personName.english ?? personName.arabic;
      const params = {
        personFullName: personName,
        transactionId: this.transactionId
      };
      this.alertService.showSuccessByKey(rejectMessage, params, 15);
    } else if (action === WorkFlowActions.SUBMIT) {
      message = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-SUBMIT-MESSAGE';
      this.alertService.showSuccessByKey(message, null, 5);
    }
  }
  listenForCancelEng(decision) {
    this.cancelEngForm?.get('comments')?.get('comments').setValue(null);
    if (decision === 'Agree') {
      this.isDocumentUpload = true;
    } else {
      this.isDocumentUpload = false;
    }
  }
  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService;
      this.documentService
        .refreshDocument(
          doc,
          this.engagementId,
          DocumentTransactionId.CANCEL_CONTRIBUTOR,
          DocumentTransactionType.CANCEL_ENGAGEMENT_INDIVIDUAL_ADMIN,
          this.referenceNo,
          this.uuid
        )
        .subscribe(res => {
          doc = res;
          if (!this.isAnyDoc && doc?.documentContent) {
            this.isAnyDoc = true;
          }
        });
    }
  }
  checkForDocumentUpload() {
    const flag = this.documents?.filter(doc => doc?.uploaded === true).length > 0;
    if (flag) this.docUploaded = true;
    else this.docUploaded = false;
    return flag;
  }

  claimTask() {
    this.calculateTimeDiff();
    this.transactionService.accquireTasks(this.taskId).subscribe(
      (res: any) => {
        const value = {
          english:
            'Transaction has been assigned . You can now process the transaction or release it back to Establishment inbox ',
          arabic: 'تم إسناد المعاملة، بإمكانك البدء بمعالجة المعاملة او ارجعاها إلى صندوق بريد المنشاة '
        };
        this.alertService.showSuccess(value);
        this.isUnclaimed = false;
      },
      err => {
        //console.log(err.error.status, err.headers.status);
        const value = {
          english: 'This Transaction can’t be assigned. Another admin have already assigned it to him ',
          arabic: 'لا يمكن اسناد المعاملة. لقد تم اسناد المعاملة من قبل مشرف آخر'
        };
        this.router.navigate(['home/transactions/list/todolist']);
        this.alertService.showError(value);
        setTimeout(() => {
          this.alertService.showError(value);
        }, 500);
      }
    );
    //  this.onClaimClicked.emit();
  }
  calculateTimeDiff() {
    var currentDate: any = this.payload.currentDate;
    var convertedDate: any = moment.tz(currentDate, 'Asia/Riyadh');
    var expDate: any = this.payload.claimTaskExpiry;
    // console.log(currentDate,convertedDate.format())
    var updated = moment(convertedDate.format(), 'DD-MM-YYYY HH:mm:ss'); //now
    var expiry = moment(expDate, 'DD-MM-YYYY HH:mm:ss');
    if (expDate == 'NULL') {
      this.minDiff = '89';
      this.seconds = '0';
    } else {
      this.minDiff = Math.floor(expiry.diff(updated, 'seconds') / 60);
      this.secDiff = expiry.diff(updated, 'seconds');
      this.seconds = (this.secDiff % 60).toString();
    }
  }
  release() {
    this.minDiff = '89';
    this.seconds = '0';
    this.payload.claimTaskExpiry = 'NULL';
    this.transactionService.releaseTasks(this.taskId).subscribe((res: any) => {
      const value = {
        english: 'Transaction released to Establishment Inbox',
        arabic: 'تم إعادة تعيين المعاملة إلى صندوق المنشأة'
      };
      this.alertService.showSuccess(value);
      this.isUnclaimed = true;
      setTimeout(() => {
        this.router.navigate(['home/transactions/list/todolist']);
      }, 2000);
    });
  }
}
