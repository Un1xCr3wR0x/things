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
  CancelContributorService,
  Contributor,
  ContributorBPMRequest,
  ContributorService,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementBasicDetails,
  EngagementDetails,
  EngagementPeriod,
  EngagementService,
  Establishment,
  EstablishmentService,
  ManageWageService,
  MaxLengthEnum,
  SubmitActions,
  SystemParameter,
  TransactionId
} from '../../../shared';
@Component({
  selector: 'cnt-change-engagement-ind-sc',
  templateUrl: './change-engagement-ind-sc.component.html',
  styleUrls: ['./change-engagement-ind-sc.component.scss']
})
export class ChangeEngagementIndScComponent implements OnInit {
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
  // cancelEngForm: FormGroup;
  changeEngForm: FormGroup;
  documents: DocumentItem[];
  contributorDocs: DocumentItem[];
  commentMaxLength = MaxLengthEnum.COMMENTS;
  isDocumentUpload: boolean;
  isAnyDoc: boolean;
  changeEngList: LovList = new LovList([]);
  engagementId: any;
  engagementDetails: EngagementDetails;
  // cancelEngData: CancelContributorDetails;
  changeEngData: EngagementBasicDetails;
  infoMessage: string;
  transactionId: number;
  wageDetails: EngagementPeriod[] = [];
  oldWage: EngagementPeriod[] = [];
  changeEngDocs: string[] = [];
  customActions = [];
  docUploaded = false;
  heading = { english: 'Change Engagement Details', arabic: 'تعديل بيانات الاشتراك' };
  channel: string;
  titleEnglish: string;
  titleArabic: string;
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
    readonly manageWageService: ManageWageService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.currentLang = lang;
    });
    this.initialiseChangeEngChoice();
    this.transactionId = TransactionId.CHANGE_ENGAGEMENT;
    this.initialiseForm();
    this.setRouterData();
    this.showPenaltyInfo();
    this.getEstablishment();
    this.getContributor();
    this.getEngagements();
    // this.getCancellationData();
    // this.getViolationRequest();
    this.getUuid();
    this.getSystemParameters();
    this.calculateTimeDiff();
  }
  initialiseForm() {
    this.changeEngForm = this.fb.group({
      choice: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      acknowledge: [false, Validators.requiredTrue]
    });
    this.changeEngForm
      .get('choice')
      .setValue(this.isAnyDoc ? this.changeEngList.items[1]['value'] : this.changeEngList.items[0]['value']);
    this.listenForChangeEng(this.changeEngForm.get('choice.english').value);
  }
  initialiseChangeEngChoice() {
    this.changeEngList.items.push({ value: { english: 'Agree', arabic: 'موافق' }, sequence: 1 });
    this.changeEngList.items.push({ value: { english: 'Disagree', arabic: 'غير موافق' }, sequence: 2 });
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
      if (this.payload.channel) this.channel = this.payload.channel;
      if (this.payload.titleEnglish) this.titleEnglish = this.payload.titleEnglish;
      if (this.payload.titleArabic) this.titleArabic = this.payload.titleArabic;

      // this.isKashefChannel = payload?.roleId === Channel.KASHEF;
    }
    this.customActions = this.routerDataToken?.customActions;
    this.transactionRefData = this.routerDataToken.comments;
  }
  /** Method to get establishment details*/
  getEstablishment() {
    this.establishmentService.getEstablishmentDetails(this.registrationNumber).subscribe(data => {
      this.establishmentDetails = bindToObject(new Establishment(), data);
      this.isPPA = data.ppaEstablishment;
      this.handleTitle();
      this.getChangeEngDetails();
    });
  }
  handleTitle() {
    if (this.isPPA && this.channel === Channel.TAMINATY) {
      this.heading = { english: this.titleEnglish, arabic: this.titleArabic };
    } else {
      this.heading = { english: 'Change Engagement Details', arabic: 'تعديل بيانات الاشتراك' };
    }
    this.showPenaltyInfo();
  }
  /**
   * Method to get contributor details
   */
  getContributor() {
    this.contributorService.getContributor(this.registrationNumber, this.socialInsuranceNumber).subscribe(data => {
      this.contributor = data;
    });
  }
  getChangeEngDetails() {
    this.manageWageService
      .getEngagementInWorkflow(this.registrationNumber, this.socialInsuranceNumber, this.engagementId, this.referenceNo)
      .subscribe(data => {
        this.changeEngData = data?.basicDetails?.updated;
        //wage details
        this.wageDetails = [];
        this.oldWage = [];
        data?.wagePeriods?.forEach(res => {
          this.wageDetails.push(res?.updated[0]);
          this.oldWage.push(res?.current[0]);
        });
        //to fetch documents
        this.changeEngDocs = data.docFetchTypes;
        this.getDocuments();
        if (this.isPPA) this.getContributorUploadedDocs();
      });
  }
  getEngagements() {
    this.engagementService
      .getEngagementDetails(this.registrationNumber, this.socialInsuranceNumber, this.engagementId, null, false, true)
      .subscribe(data => {
        this.engagementDetails = data;
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
        DocumentTransactionId.CHANGE_ENGAGEMENT,
        !approveWithDocs
          ? DocumentTransactionType.CHANGE_ENGAGEMENT_INDIVIDUAL_ADMIN_WITHOUT_DOCUMENT
          : DocumentTransactionType.CHANGE_ENGAGEMENT_INDIVIDUAL_ADMIN_WITH_DOCUMENT
      )
      .subscribe(res => {
        this.documents = this.documentService.removeDuplicateDocs(res);
      });
  }
  getContributorUploadedDocs() {
    this.documentService
      .getDocuments(DocumentTransactionId.CHANGE_ENGAGEMENT, this.changeEngDocs, this.engagementId, this.referenceNo)
      .subscribe(res => {
        this.contributorDocs = res.filter(item => item.documentContent !== null);
      });
  }
  listenForChangeEng(decision) {
    this.changeEngForm?.get('comments')?.get('comments').setValue(null);
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
          DocumentTransactionId.CHANGE_ENGAGEMENT,
          null,
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
  confirmEngagement() {
    this.changeEngForm.markAllAsTouched();
    markFormGroupTouched(this.changeEngForm);
    const action =
      this.changeEngForm.get('choice').get('english').value === 'Agree'
        ? WorkFlowActions.APPROVE
        : WorkFlowActions.REJECT;
    let validDocs = true;
    if (action === WorkFlowActions.APPROVE) {
      this.documentService.checkMandatoryDocuments(this.documents) ? (validDocs = true) : (validDocs = false);
    }
    if (this.changeEngForm.get('acknowledge').valid || (this.isPPA && validDocs)) {
      const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
      action === WorkFlowActions.APPROVE && this.isPPA && this.routerDataToken?.channel === Channel.TAMINATY
        ? this.handleApproveForPPA({
            action: approveWithDocs ? WorkFlowActions.APPROVE_WITH_DOCS : action,
            comments: this.changeEngForm?.get('comments')?.get('comments').value
          })
        : this.updateWorkFlow({ action: action, comments: this.changeEngForm?.get('comments')?.get('comments').value });
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
      const comments = this.changeEngForm.get('comments.comments').value;
      this.manageWageService
        .submitEngagementAfterChange(
          this.registrationNumber,
          this.socialInsuranceNumber,
          this.engagementId,
          SubmitActions.VERIFY_DOCUMENTS,
          comments
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
      message = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-APPROVAL-MESSAGE';
      this.alertService.showSuccessByKey(message, null, 15);
    } else if (action === WorkFlowActions.REJECT) {
      let rejectMessage: string;
      this.transactionId = this.routerDataToken.transactionId;
      rejectMessage = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-REJECTION-MESSAGE'; //ContributorConstants.EST_ADMIN_DISAGREE_MODIFY_INSPECTION;
      let personName = getPersonNameAsBilingual(this.contributor?.person?.name);
      personName.english = personName.english ?? personName.arabic;
      const params = {
        personFullName: personName,
        transactionId: this.transactionId
      };
      // this.alertService.showSuccessByKey(rejectMessage, params, 5);
      this.alertService.showSuccessByKey(rejectMessage, null, 15);
    } else if (action === WorkFlowActions.SUBMIT) {
      message = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-SUBMIT-MESSAGE';
      this.alertService.showSuccessByKey(message, null, 5);
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
