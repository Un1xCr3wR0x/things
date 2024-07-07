import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  AuthTokenService,
  BPMUpdateRequest,
  BilingualText,
  ContributorAssessmenttRequestDto,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  MedicalboardAssessmentService,
  ReportsResponse,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  UserComment,
  WizardItem,
  WorkFlowActions,
  WorkflowService,
  assembleUserComment,
  downloadFile,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import { switchMap, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, noop, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ApproveSuccessResponse,
  AssessmentConstants,
  AssessmentDetail,
  DisabilityAssessment,
  DoctorService,
  MBConstants,
  MedicalBoardService,
  MedicalReportDetails,
  OHTransactionType,
  OhConstants,
  ServiceProviderAddressDto
} from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { RouteConstants } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'mb-contributor-clarification-sc',
  templateUrl: './contributor-clarification-sc.component.html',
  styleUrls: ['./contributor-clarification-sc.component.scss']
})
export class ContributorClarificationScComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('medicalReportModal', { static: true })
  medicalReportModal: TemplateRef<HTMLElement>;
  @ViewChild('assessmentWizard', { static: false })
  assessmentWizard: ProgressWizardDcComponent;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;

  @ViewChild('requestReports', { static: true })
  requestReports: TemplateRef<HTMLElement>;

  medicalReportDetails: MedicalReportDetails;
  lang: string;
  modalRef: BsModalRef;
  items: Lov[] = [];
  comments: FormGroup;
  submitted = false;
  show: number;
  fileUrl;
  occBusinessKey = 'OCC_DISAB_ASSESSMENT';
  disabilityAssessmentId: string;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  documentScanList: DocumentItem[] = [];
  documentList$: Observable<DocumentItem[]>;
  documentCategoryList: DocumentItem[] = [];
  parentForm: FormGroup = new FormGroup({});
  uploadFailed: boolean;
  documentList: DocumentItem[];
  type = 'MEDICAL_BOARD';
  currentTab = 0;
  assessmentWizards: WizardItem[] = [];
  requestDisabilityAssessmentForm = new FormGroup({});
  submitAssessment: ContributorAssessmenttRequestDto = new ContributorAssessmenttRequestDto();
  approveAssessment: ApproveSuccessResponse = new ApproveSuccessResponse();
  previousDisabilityDetails: DisabilityAssessment;
  disabilityMaxLength = 1500;
  injuryId: number;
  registrationNo: number;
  documentItem: DocumentItem[] = [];
  benefitRequestId: Number;
  isDisabilityDetailsNotRequiredScreen = false;
  isRequestMedicalReports = false;
  transactionIdDoc: string;
  transactionTypeDoc: string | string[];
  hospitalList: ServiceProviderAddressDto[];
  tPAReportDetail: ReportsResponse;
  documentListTPA: string[];
  investigationDoc = [];
  medicalReportsDoc = [];
  // Input Variables

  @Input() registrationNumber: number;
  @Input() isScan = true;
  referenceNo: number;
  transactionId: string;
  assessmentRequestId: number;
  socialInsuranceNo: number;
  assessmentDetails: AssessmentDetail;
  disbAssesmsmentId: number;
  documentsList: BilingualText[];
  identifier: number;
  listOfDocs: DocumentItem[];
  comment: TransactionReferenceData[] = [];
  serviceAddress: ServiceProviderAddressDto = new ServiceProviderAddressDto();
  hospital$: Observable<LovList>;
  isSmallScreen: boolean;
  instructions: BilingualText[];
  transactionKey: string;
  reqDocs = [];
  payload;
  selectedHospitalName: BilingualText;
  requiredDocs = [];
  isUploaded = false;
  disabAssessmentId: number;

  //Output Variables
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() submit: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of ScanDocumentDcComponent
   * @param modalService
   * @param language
   * @memberof ScanDocumentDcComponent
   */

  constructor(
    readonly alertService: AlertService,
    private fb: FormBuilder,
    readonly medicalReportService: MedicalBoardService,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly doctorService: DoctorService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly authTokenService: AuthTokenService,
    readonly lookUpService: LookupService,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    private modalService: BsModalService
  ) { }
  //  {
  //   super();
  // }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  /**
   * Initialises ScanDocumentDcComponent
   * @memberof ScanDocumentDcComponent
   */
  ngOnInit() {
    this.instructions = MBConstants.INSTRUCTIONS;
    this.initializeWizard();
    if (this.routerData?.payload) {
      this.payload = JSON.parse(this.routerData?.payload);
      this.transactionId = this.payload.referenceNo;
      this.disabilityAssessmentId = this.payload.disabilityAssessmentId;
      this.assessmentRequestId = this.payload.assessmentRequestId;
      this.socialInsuranceNo = this.payload.socialInsuranceNo;
      this.disbAssesmsmentId = this.payload.disabilityAssessmentId;
      this.referenceNo = this.payload.referenceNo;
      this.identifier = this.payload.identifier;
      this.injuryId = this.payload.id;
      this.registrationNo = this.payload.registrationNo;
      this.benefitRequestId = this.payload.benefitRequestId;
      this.transactionKey = this.setTransactionKey(this.payload?.resource);
      if (this.routerData.comments) {
        this.comment = this.routerData.comments;
      } else {
        this.comment.push({
          ...new TransactionReferenceData(),
          comments: this.payload?.comments,
          userName: { english: this.payload?.assignedUser, arabic: this.payload?.assignedUser }
        });
      }
      if (
        this.payload.previousOutcome === 'CAPTURED' &&
        this.routerData?.resourceType !== 'Request Clarification from Contributor'
      ) {
        this.getClarificationDocuments();
        this.isDisabilityDetailsNotRequiredScreen = true;
        this.getDisabilityDetails();
      } else if (this.payload.previousOutcome === 'REQUESTMEDICALREPORTS') {
        this.isRequestMedicalReports = true;
        this.getTpaMedicalReportDetails();
        this.newMedicalReportsModal();
        this.getHospitalAddress();
      }
    }

    this.requestDisabilityAssessmentForm = this.createrequestDisabilityAssessmentForm();
    this.comments = this.createCommentsForm();
    this.hospital$ = this.lookUpService.getHospitalList();
    this.medicalReportService.getMedicalReportDetails().subscribe(res => (this.medicalReportDetails = res));
    this.getPreviousDisability();
    if (
      !isNaN(Number(this.disbAssesmsmentId)) &&
      this.disbAssesmsmentId !== 0 &&
      this.routerData.resourceType === RouterConstants.CLARIFICATION_FROM_CONTRIBUTOR
    )
      this.getAssessmentDetailsView();
    // request clarification from contributor and request medical reports from TPA
    if (!this.isDisabilityDetailsNotRequiredScreen && !this.isRequestMedicalReports) {
      if (this.routerData && this.routerData.resourceType) {
        if (
          !isNaN(Number(this.identifier)) &&
          this.identifier !== 0 &&
          !isNaN(Number(this.assessmentRequestId)) &&
          this.assessmentRequestId !== 0 &&
          !isNaN(Number(this.referenceNo)) &&
          this.referenceNo !== 0
        )
          this.getAssessmentDocuments();
      }
    }
    // this.getDocuments();
  }

  /**
   * This method is used to detect input changes and handles corresponding functionalities
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentList && changes.documentList.currentValue !== null) {
      this.documentList = changes.documentList.currentValue;
    }
  }
  newMedicalReportsModal() {
    this.showModal(this.requestReports, 'lg');
  }
  initializeWizard() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(AssessmentConstants.ASSESSMENT_DETAILS, 'file-medical')); //TODO: change icon
    wizardItems.push(new WizardItem(AssessmentConstants.DOCUMENTS, 'file-alt'));
    this.assessmentWizards = wizardItems;
    this.assessmentWizards[this.currentTab].isActive = true;
    this.assessmentWizards[this.currentTab].isDisabled = false;
  }
  selectedWizard(index: number) {
    this.currentTab = index;
  }
  nextTab() {
    scrollToTop();
    this.currentTab = 1;
    this.alertService.clearAlerts();
    this.assessmentWizard.setNextItem(this.currentTab);
  }
  previousForm() {
    this.navigateToPreviousTab();
  }
  createrequestDisabilityAssessmentForm() {
    return this.fb.group({
      disabilityDescription: [null, { validators: Validators.required }]
    });
  }
  //Method to call service provider address api
  onServiceProviderSelected(data: BilingualText) {
    this.selectedHospitalName = data;
    this.medicaAssessmentService.getServiceProviderAddress(this.identifier, data).subscribe(
      (serviceAddress: ServiceProviderAddressDto) => {
        this.serviceAddress = serviceAddress;
      },
      err => this.showError(err)
    );
  }
  setTransactionKey(resourceType) {
    switch (resourceType) {
      case OhConstants.TRANSACTION_CLOSE_INJURY:
        return OHTransactionType.CLOSE_INJURY;
      default:
        return null;
    }
  }
  cancelTransaction() {
    this.alertService.clearAlerts();
    this.showModal(this.confirmTemplate);
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.modalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }
  saveDisabilityDescription() {
    // if (this.isNonOcc) {
    if (this.parentForm.invalid) {
      markFormGroupTouched(this.parentForm);
      this.alertService.showMandatoryErrorMessage();
    } else if (this.requestDisabilityAssessmentForm.invalid) {
      markFormGroupTouched(this.requestDisabilityAssessmentForm);
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.submitAssessment.reassessmentDescription =
        this.requestDisabilityAssessmentForm.get('disabilityDescription').value;
      this.submitAssessment.mbAssessmentRequestId = this.assessmentRequestId;
      this.medicaAssessmentService
        .submitAssessment(this.identifier, this.assessmentRequestId, this.submitAssessment)
        .subscribe(
          response => {
            if (response) {
              this.nextTab();
              // this.forContributorReassessments = true;
            }
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /** Method to navigate to previous tab */
  navigateToPreviousTab() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab = 0;
    this.assessmentWizard.setPreviousItem(this.currentTab);
  }
  //Method tp get previous disability details
  getPreviousDisability() {
    this.medicaAssessmentService.getPreviousDisability(this.identifier).subscribe(res => {
      this.previousDisabilityDetails = res;
    });
  }
  /**
   * This method is used to reset the form to initial template
   */
  resetCommentsForm() {
    if (this.comments) {
      this.comments.reset(this.createCommentsForm().getRawValue());
      this.comments.updateValueAndValidity();
      this.comments.markAsPristine();
      this.comments.markAsUntouched();
    }
  }
  /**
   * Method to get the comments from BPM
   */
  getBPMComments(payload): Observable<TransactionReferenceData[]> {
    return of(payload.comments);
  }
  /**
   * This method is used to initialise the form template
   */
  createCommentsForm() {
    return this.fb.group({
      comments: ['', { validators: Validators.compose([Validators.required]), updateOn: 'blur' }]
    });
  }

  /**
   * Trigger to save the documents in the
   */
  saveDocuments(comments) {
    // this.approveAssessment.disabilityAssessmentId = this.disbAssesmsmentId;
    // this.approveAssessment.mbAssessmentReqId = this.assessmentRequestId;
    // this.approveAssessment.message = comments;
    // this.approveAssessment.transactionTraceId = this.referenceNo;
    if (this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null)) {
      this.doctorService
        .submitDocuments({ comments: comments }, this.identifier, this.disbAssesmsmentId, this.referenceNo)
        .subscribe(res => {
          this.alertService.showSuccess(res.message);
          // if(res.message){
          let action;
          // action = WorkFlowActions.APPROVE;
          action = WorkFlowActions.UPDATE;
          const datas = this.setWorkflowData(this.routerData, action);
          this.saveWorkflow(datas);
          this.router.navigate([[RouterConstants.ROUTE_INBOX]]);
          // }
        });
    } else {
      this.documentScanList.forEach((item: DocumentItem, index) => {
        if (item?.required && item?.documentContent) this.documentScanList[index].uploadFailed = true;
      });
      this.showMandatoryDocErrorMessage(true);
    }
  }
  /** Method to set workflow details. */
  setWorkflowData(routerData: RouterData, action: string, comments?): BPMUpdateRequest {
    const datas = new BPMUpdateRequest();
    datas.user = routerData.assigneeId;
    datas.outcome = action;
    datas.taskId = routerData.taskId;
    if (comments) {
      datas.comments = comments;
    }
    return datas;
  }
  /**
   * Method to save workflow details.
   * @param data workflow data
   */
  saveWorkflow(data: BPMUpdateRequest, action?): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey(
            action ? this.getSuccessMessage(action) : 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE'
          );
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
        }),
        catchError(err => {
          this.handleError(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to navigate to inbox on error during view initialization. */
  handleError(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * This method is used to check if the documents has been scanned
   * @param documentItem
   */
  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.assessmentRequestId).subscribe(res => (document = res));
  }

  /**
   * To show the confirmation modal before deleting the document
   * @param template
   */
  // deleteDocument(docsItem: DocumentItem) {
  //   if (docsItem) {
  //     this.delete.emit(docsItem);
  //   }
  // }

  //This method is used to reset form on on reset button
  confirmReset() {
    this.resetDocuments();
    this.modalRef.hide();
  }

  //This method is used to reset form
  resetDocuments() {
    this.submitted = false;
    scrollToTop();
    if (this.documentList) {
      this.documentList.forEach((docsItem: DocumentItem) => {
        docsItem.contentId = null;
        docsItem.documentContent = null;
        docsItem.fileName = null;
        docsItem.icon = null;
        docsItem.documentType = null;
        docsItem.started = false;
        docsItem.valid = false;
      });
    }
    this.resetCommentsForm();
  }
  getDocuments() {
    this.documentList$ = this.doctorService.getClarificationDocs().pipe(
      map(documents => this.documentService.removeDuplicateDocs(documents)),
      catchError(error => of(error))
    );
    this.documentList$.subscribe(documents => {
      documents.forEach(items => {
        if (items) {
          items.canDelete = true;
          items.required = true;
        }
      });
      if (this.documentsList) {
        // for (const doc of this.documentsList) {
        //   this.documentScanList = documents.filter(item => item.name.english === doc.english);
        // }
        this.documentsList.forEach(documentListDocument => {
          const matchingDocument = documents.find(document => document.name.english === documentListDocument.english);
          if (matchingDocument) {
            this.documentScanList.push(matchingDocument);
          }
        });
      }
    });
  }
  uploadedEventDetails(item) {
    for (const documentItem of this.documentList) {
      if (item.name.english === documentItem.name.english) {
        documentItem.uploadFailed = false;
        documentItem.valid = true;
      }
    }
  }
  submitClarification(comments) {
    if (this.requiredDocs.filter(item => item?.required).every(doc => doc?.documentContent !== null)) {
      this.saveTPAClarificationDoc(comments); // api to save doc and BPM api
    } else {
      this.documentScanList.forEach((item: DocumentItem, index) => {
        if (item?.required && item?.documentContent) this.documentScanList[index].uploadFailed = true;
      });
      this.showMandatoryDocErrorMessage(true);
    }
  }

  submitMedicalReports(comment) {
    if (
      this.medicalReportsDoc.filter(item => item?.required).every(doc => doc?.documentContent !== null) ||
      this.investigationDoc.filter(item => item?.required).every(doc => doc?.documentContent !== null)
    ) {
      this.saveTPAClarificationDoc(comment); // api to save doc and BPM api
    } else {
      this.documentScanList.forEach((item: DocumentItem, index) => {
        if (item?.required && item?.documentContent) this.documentScanList[index].uploadFailed = true;
      });
      this.showMandatoryDocErrorMessage(true);
    }
  }
  downloadMedicalReport() {
    const hospitalProvider = this.selectedHospitalName;
    const reportDetails = {
      hospitalProvider,
      assessmentId: this.disabAssessmentId ? this.disabAssessmentId : this.disabilityAssessmentId
    };
    this.medicaAssessmentService.reportDownload(this.identifier.toString(), reportDetails).subscribe(
      response => {
        downloadFile(OhConstants.MEDICAL_REPORT_REQUEST_FORM, 'application/pdf', response);
      },
      err => {
        const er = JSON.parse(err);
        er.status === 'INTERNAL_SERVER_ERROR' || er.status === 500
          ? this.alertService.showErrorByKey('MEDICAL-BOARD.ERROR-MESSASGE-500')
          : this.alertService.showError(er.message);
        scrollToTop();
      }
    );
  }

  requestedDocumentList() {
    if (this.payload.previousOutcome === 'CAPTURED') {
      this.transactionIdDoc = OHTransactionType.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR;
      this.transactionTypeDoc = 'MEDICAL_BOARD';
      this.getAllDoumentList();
    }
  }
  getAllDoumentList() {
    this.documentService.getRequiredDocuments(this.transactionIdDoc, this.transactionTypeDoc).subscribe(res => {
      res.filter(eachDoc =>
        this.documentsList.map(item => {
          if (item?.english === eachDoc?.name?.english && eachDoc?.documentClassification === 'External') {
            // addeed documentClassification as getting duplicate list in all doc response
            eachDoc.required = true;
            this.requiredDocs.push(eachDoc);
          }
        })
      );
    });
  }

  getClarificationDocuments() {
    this.medicalReportService
      .getClarificationDocuments(
        this.routerData.resourceType,
        this.injuryId,
        this.transactionId,
        this.identifier,
        this.assessmentRequestId
      )
      .subscribe(res => {
        this.documentsList = res;
        this.requestedDocumentList();
      });
  }
  ngAfterViewInit(): void {
    if (!this.isRequestMedicalReports) {
      this.showMedicalReportModal(this.medicalReportModal);
    }
  }
  showMedicalReportModal(medicalReportModal: TemplateRef<HTMLElement>) {
    this.modalService.show(medicalReportModal, Object.assign({}, { class: 'modal-xl' }));
  }
  addDocument(items) { }
  hide() {
    this.modalService.hide();
  }
  showMandatoryDocErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }
  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }
  confirmCancel() {
    this.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  getAssessmentDetailsView() {
    this.doctorService
      .getAssessmentDetails(this.identifier, this.disbAssesmsmentId, this.referenceNo)
      .subscribe(res => {
        this.assessmentDetails = res;
        this.documentsList = res.requestedDocs;
        this.getDocuments();
      });
  }
  getAssessmentDocuments() {
    this.medicaAssessmentService
      .getContributoDocumentsAssesment(this.identifier, this.assessmentRequestId, this.referenceNo)
      .subscribe(res => {
        this.documentsList = res;
        this.requestedDocumentList();
      });
  }
  getcheckUnivId() {
    switch (this.routerData.resourceType) {
      case RouterConstants.TRANSACTION_CLOSE_INJURY:
      case RouterConstants.TRANSACTION_CLOSE_COMPLICATION:
        return this.injuryId;
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
        return this.assessmentRequestId;
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
      case RouterConstants.MB_BENEFIT_ASSESSMENT:
        return this.benefitRequestId;
      case 'Request Clarification from Contributor':
        return this.disabAssessmentId ? this.disabAssessmentId : this.disabilityAssessmentId;
    }
  }
  proceedDocuments() {
    this.modalRef?.hide();
  }
  getHospitalAddress() {
    this.medicaAssessmentService.getHospitalAddress(this.identifier).subscribe(
      res => {
        this.hospitalList = res;
      },
      err => this.alertService.showErrorByKey(err.error.message)
    );
  }
  getTpaMedicalReportDetails() {
    this.medicaAssessmentService
      .getMedicalReportsTPA(
        this.routerData.resourceType,
        this.identifier,
        this.assessmentRequestId,
        this.referenceNo,
        this.socialInsuranceNo,
        this.injuryId
      )
      .subscribe(res => {
        this.tPAReportDetail = res;
        const medicalReportsDoctList = this.tPAReportDetail.requestDocumentsDetails.map(
          val => val.requiredDocumentsList[0]
        );
        const investigationDocList = this.tPAReportDetail.investigationDocumentDetails.map(
          val => val.requiredDocumentsList
        );
        if (medicalReportsDoctList) {
          const transactionIdDoc = OHTransactionType.REQUEST_CLARIFICATION_FROM_TPA;
          const transactionTypeDoc = 'MEDICAL_REPORT';
          this.documentService
            .getRequiredDocuments(transactionIdDoc, transactionTypeDoc)
            .pipe(map(docs => this.documentService.removeDuplicateDocs(docs)))
            .subscribe(documentResponse => {
              if (medicalReportsDoctList) {
                for (const doc of medicalReportsDoctList) {
                  let reqdocumentTemp = documentResponse.filter(item => item.name.english === doc.english);
                  reqdocumentTemp = reqdocumentTemp.filter(item => (item.required = true));
                  reqdocumentTemp.forEach(val => {
                    this.medicalReportsDoc.push(val);
                  });
                }
              }
              /**
               *  For medical Report Details get every doc detail and filter using given api response and pass to DC
               */
              this.tPAReportDetail.requestDocumentsDetails.forEach((val, i) => {
                this.medicalReportsDoc.forEach((item, j) => {
                  if (val?.requiredDocumentsList[0]?.english === item.name.english) {
                    // Set description and Speciality inside the array to show the details for medical report s
                    this.medicalReportsDoc[j].description =
                      this.tPAReportDetail?.requestDocumentsDetails[i]?.reportDetails;
                    this.medicalReportsDoc[j].specialty = this.tPAReportDetail?.requestDocumentsDetails[i]?.specialty;
                  }
                });
              });
            });
        }
        if (investigationDocList) {
          const transactionIdDoc = OHTransactionType.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR;
          const transactionTypeDoc = 'MEDICAL_BOARD';
          this.documentService
            .getRequiredDocuments(transactionIdDoc, transactionTypeDoc)
            .pipe(map(docs => this.documentService.removeDuplicateDocs(docs)))
            .subscribe(documentResponse => {
              if (investigationDocList) {
                for (const doc of investigationDocList) {
                  let reqdocumentTemp = documentResponse.filter(item => item.name.english === doc.english);
                  reqdocumentTemp = reqdocumentTemp.filter(item => (item.required = true));
                  reqdocumentTemp.forEach(val => {
                    this.investigationDoc.push(val);
                  });
                }
              }
              /**
               *  For Investigation  Report Details get every doc detail and filter using given api response and pass to DC
               */
              this.tPAReportDetail.investigationDocumentDetails.forEach((val, i) => {
                this.investigationDoc.forEach((item, j) => {
                  if (val?.investigationReportName?.english === item.name.english) {
                    // set investigation reports detail in  description field
                    this.investigationDoc[j].description =
                      this.tPAReportDetail?.investigationDocumentDetails[i]?.reportDetails;
                  }
                });
              });
            });
        }
      });
  }
  saveTPAClarificationDoc(comments) {
    if (
      this.routerData.resourceType === 'Close Injury TPA' ||
      this.routerData.resourceType === 'Close Complication TPA'
    ) {
      this.medicaAssessmentService
        .saveOHDocumentTPA(this.identifier, this.injuryId, this.referenceNo)
        .subscribe(val => {
          if (val) {
            const action = WorkFlowActions.UPDATE;
            const datas = this.setWorkflowData(this.routerData, action, comments);
            this.saveWorkflow(datas, action);
          }
        });
    } else {
      const action = WorkFlowActions.UPDATE;
      const datas = this.setWorkflowData(this.routerData, action, comments);
      this.saveWorkflow(datas, action);
    }
  }
  /** Method to get success message. */
  getSuccessMessage(action: string) {
    let message: string;
    switch (action) {
      case WorkFlowActions.UPDATE:
        message = OhConstants.SUCCESS_MESSAGE;
        break;
      case WorkFlowActions.RETURN:
        message = 'OCCUPATIONAL-HAZARD.RETURN-SUCCESS-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        message = 'OCCUPATIONAL-HAZARD.TRANSACTION-REJECTED';
        break;
    }
    return message;
  }
  getClarificationRefNo() {
    switch (this.routerData.resourceType) {
      case RouterConstants.TRANSACTION_CLOSE_INJURY:
        return 101504;
      case RouterConstants.TRANSACTION_CLOSE_COMPLICATION:
        return 101569;
      case RouterConstants.MB_BENEFIT_ASSESSMENT:
        return this.payload.titleEnglish === RouterConstants.REQUEST_NON_OCC_DISB_ASSESSMENT ||
          this.payload.titleEnglish === RouterConstants.REQUEST_DEP_DISB_ASSESSMENT
          ? 101510
          : 101514;
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
        return '302021';
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
        return '101587';
    }
  }

  getRefNo() {
    switch (this.routerData.resourceType) {
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
      case RouterConstants.MB_BENEFIT_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
      case RouterConstants.TRANSACTION_REQUEST_CLARIFICATION_FROM_CONTRIBUTOR:
        return this.referenceNo;
        default:
          return this.referenceNo;
    }
  }
  getDisabilityDetails() {
    this.medicaAssessmentService.getDisabilityDetails(this.identifier, this.assessmentRequestId).subscribe(res => {
      this.disabAssessmentId = res?.assessmentId;
    });
  }
  downloadPsychiatricForm() {
    this.medicaAssessmentService.psychiatricDownload(this.identifier.toString()).subscribe(
      response => {
        downloadFile(OhConstants.PSYCHIATRIC_FORM, 'application/pdf', response);
      },
      err => {
        const er = JSON.parse(err);
        er.status === 'INTERNAL_SERVER_ERROR' || er.status === 500
          ? this.alertService.showErrorByKey('MEDICAL-BOARD.ERROR-MESSASGE-500')
          : this.alertService.showError(er.message);
        scrollToTop();
      }
    );
  }
  getTransactionId() {
    if (
      this.routerData.resourceType === RouterConstants.CLARIFICATION_FROM_CONTRIBUTOR ||
      this.routerData.resourceType === RouterConstants.TRANSACTION_ASSIGN_TO_HO ||
      this.routerData.resourceType === RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR
    ) {
      if (
        this.payload.titleEnglish === RouterConstants.REQUEST_NON_OCC_DISB_ASSESSMENT ||
        this.payload.titleEnglish === RouterConstants.REQUEST_DEP_DISB_ASSESSMENT ||
        this.payload.titleEnglish === RouterConstants.REQUEST_DEPENDENT_DISB_ASSESSMENT
      ) {
        return 101510;
      } else if (
        this.payload.titleEnglish === RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT ||
        this.payload.titleEnglish === RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT ||
        this.payload.titleEnglish === RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT ||
        this.payload.titleEnglish === RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT
      ) {
        return 101587;
      } else {
        return 101514;
      }
    } else return 101510;
  }
}
