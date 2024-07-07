import { Component, HostListener, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ValidatorBaseScComponent } from '../../validator/base/validator-sc.base-component';
import {
  AlertService,
  ApplicationTypeToken,
  AssessmentData,
  AuthTokenService,
  BilingualText,
  CoreAdjustmentService,
  CoreBenefitService,
  DisabilityData,
  DocumentItem,
  DocumentService,
  EarlyReassessmentDto,
  EarlyReassessmentResponseDto,
  LanguageToken,
  LookupService,
  LovList,
  MedicalAssessmentService,
  MedicalboardAssessmentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  SelectedParticipantDetails,
  ServiceProviderAddressDto,
  SubmitResponse,
  TransactionReferenceData,
  WizardItem,
  WorkFlowActions,
  WorkflowService,
  downloadFile,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ComplicationService,
  ContributorService,
  DiseaseService,
  EstablishmentService,
  InjuryService,
  OhConstants,
  OhService
} from '../../shared';
import { Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AssessmentConstants, DisabilityAssessmentService } from '@gosi-ui/features/medical-board';
@Component({
  selector: 'oh-early-participant-reassessment-sc',
  templateUrl: './early-participant-reassessment-sc.component.html',
  styleUrls: ['./early-participant-reassessment-sc.component.scss']
})
export class EarlyParticipantReassessmentScComponent extends ValidatorBaseScComponent implements OnInit {
  @ViewChild('assessmentWizard', { static: false })
  assessmentWizard: ProgressWizardDcComponent;
  @ViewChild('instrcutionModal', { static: true })
  instrcutionModal: TemplateRef<HTMLElement>;

  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;

  assessmentWizards: WizardItem[] = [];
  // modalRef: BsModalRef;
  parentForm: FormGroup = new FormGroup({});
  requestDisabilityAssessmentForm = new FormGroup({});
  isSmallScreen: boolean;
  currentTab = 0;
  hospital$: Observable<LovList>;
  serviceAddress: ServiceProviderAddressDto = new ServiceProviderAddressDto();
  type: BilingualText;
  heading: string;
  documentScanList: DocumentItem[] = [];
  documentCategoryList: DocumentItem[] = [];
  documentList$: Observable<DocumentItem[]>;
  uploadFailed: boolean;
  selectedHospitalName: BilingualText;
  EarlyReassessmentDto: EarlyReassessmentDto = new EarlyReassessmentDto();
  EarlyReassessmentResponseDto: EarlyReassessmentResponseDto = new EarlyReassessmentResponseDto();
  SubmitResponse: SubmitResponse = new SubmitResponse();
  selectedPerson: SelectedParticipantDetails;
  previousDisabilityDetails: DisabilityData;
  mbReassessmentReqId: number;
  disabilityAssessmentId: number;
  ismbOfficer: boolean;
  occEarlyReassessment: boolean;
  reasonList: LovList = new LovList([]);
  txnId = 101583; // Oh doc dc early reassessment
  comment: TransactionReferenceData[];
  payload;

  constructor(
    readonly alertService: AlertService,
    readonly authTokenService: AuthTokenService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly lookUpService: LookupService,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly router: Router,
    readonly contributorService: ContributorService,
    readonly workflowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    diseaseService: DiseaseService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService
  ) {
    super(
      language,
      ohService,
      injuryService,
      establishmentService,
      complicationService,
      diseaseService,
      alertService,
      router,
      modalService,
      documentService,
      contributorService,
      workflowService,
      fb,
      routerData,
      location,
      pLocation,
      appToken,
      authTokenService,
      coreMedicalAssessmentService
    );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  ngOnInit(): void {
    if (this.routerData && this.routerData.payload) {
      this.payload = JSON.parse(this.routerData.payload); //for returned transaction from GosiDoctor
      if (this.payload && this.payload.assignedRole === 'Contributor') {
        this.identifier = this.payload.identifier;
        this.disabilityAssessmentId = this.payload.disabilityAssessmentId;
        this.assessmentRequestId = this.payload.assessmentRequestId;
        this.referenceNo = this.payload.referenceNo;
        this.comment = this.routerData.comments;
        this.routerData.state === 'RETURN' ? (this.isReturn = true) : (this.isReturn = false);
        this.getDisabilityDetails(this.payload.identifier, this.assessmentRequestId);
        this.getDocumentList();
      }
    } else {
      this.identifier = this.ohService.getParticipantDetail().identitynumber;
      this.getDocumentCategory();
    }
    this.hospital$ = this.lookUpService.getHospitalList();
    this.selectedPerson = this.ohService.getParticipantDetail(); // for mbo||contributor route details
    this.selectedPerson ? (this.getHeading(), this.getOccNonOccType(), this.getPreviousDisability()) : null;
    this.initializeWizard();
    this.getReasonLov();
    this.alertService.clearAlerts();
  }
  getDisabilityDetails(identifier, mbAssessmentReqId) {
    this.medicaAssessmentService.getDisabilityDetails(identifier, mbAssessmentReqId).subscribe(res => {
      this.disabilityDetails = res;
      if (this.disabilityDetails.disabilityType) {
        this.getHeading();
        this.getOccNonOccType();
        this.getPreviousDisability();
      }
    });
  }
  hideInstructionModal() {
    this.modalService.hide();
  }
  getHeading() {
    if (this.selectedPerson || this.disabilityDetails) {
      this.type = this.selectedPerson ? this.selectedPerson.assessmentType : this.disabilityDetails.disabilityType;
      switch (this.type.english) {
        case 'Dependent Disability Reassessment':
        case 'Reassessment Dependent Disability':
        case 'Dependent Disability':
          this.heading = 'OCCUPATIONAL-HAZARD.REQ-EARLY-DEPENDENT-DISABILITY-REASSESSMENT';
          break;
        case 'Heir Disability Reassessment':
        case 'Heir Disability':
        case 'Reassessment Heir Disability':
          this.heading = 'OCCUPATIONAL-HAZARD.REQUEST-EARLY-HEIR-DISABILITY-REASSESSMENT';
          break;
        case 'Non-Occupational Disability Reassessment':
        case 'Non-Occupational Disability':
        case 'Reassessment Non-Occupational Disability':
          this.heading = 'OCCUPATIONAL-HAZARD.REQ-EARLY-NON-OCC-DISABILITY-REASSESSMENT';
          break;
        case 'Occupational Disability Reassessment':
        case 'Occupational Disability':
        case 'Reassessment Occupational Disability':
          this.heading = 'OCCUPATIONAL-HAZARD.REQ-EARLY-OCCUPATIONAL-DISABILITY-REASSESSMENT';
          break;
      }
      return this.heading;
    }
  }

  /**
   * To hide modal and cancel modal
   */
  confirmCancel() {
    this.hideModal();
    this.location.back();
  }
  //Method to call service provider address api
  onServiceProviderSelected(data: BilingualText) {
    this.selectedHospitalName = data;
    const identifier = this.selectedPerson ? this.selectedPerson.identitynumber : this.identifier;
    this.ohService.getServiceProviderAddress(identifier, data).subscribe(
      res => {
        this.serviceAddress = res;
      },
      err => this.showError(err)
    );
  }
  onHospitalPatch(data: BilingualText) {
    this.selectedHospitalName = data;
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
  /** Method to navigate to previous tab */
  navigateToPreviousTab() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab = 0;
    this.assessmentWizard.setPreviousItem(this.currentTab);
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
  assessmentInstruction(TemplateValue: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
  }
  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    this.alertService.clearAlerts;
    this.showModal(this.confirmTemplate);
  }
  initializeWizard() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem('OCCUPATIONAL-HAZARD.DISABILITY-DETAILS', 'user'));
    wizardItems.push(new WizardItem(OhConstants.DOCUMENTS, 'file-alt'));
    this.assessmentWizards = wizardItems;
    this.assessmentWizards[this.currentTab].isActive = true;
    this.assessmentWizards[this.currentTab].isDisabled = false;
  }

  selectedWizard(index: number) {
    this.currentTab = index;
  }
  saveDisabilityDescription() {
    if (this.parentForm.invalid) {
      markFormGroupTouched(this.parentForm);
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.toGetpayloadData();
      const identifier = this.selectedPerson ? this.selectedPerson.identitynumber : this.identifier;
      this.ohService
        .saveEarlyReassessmentDetails(
          identifier,
          this.EarlyReassessmentDto,
          this.assessmentRequestId,
          this.referenceNo,
          this.isReturn
        )
        .subscribe(
          response => {
            this.EarlyReassessmentResponseDto = response;
            this.mbReassessmentReqId = this.EarlyReassessmentResponseDto.mbReassessmentReqId;
            this.referenceNo = this.EarlyReassessmentResponseDto.transactionTraceId;
            this.disabilityAssessmentId = this.EarlyReassessmentResponseDto.disabilityAssessmentId;
            if (this.EarlyReassessmentResponseDto && this.EarlyReassessmentResponseDto.transactionTraceId) {
              this.nextTab();
            }
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  getDocumentCategory() {
    const transactionId = 'EARLY_REASSESSMENT_REQUEST';
    const type = 'MEDICAL_BOARD';
    this.documentList$ = this.ohService.getReqDocEarlyReassessment(transactionId, type).pipe(
      map(documents => this.documentService.removeDuplicateDocs(documents)),
      catchError(error => of(error))
    );
    this.documentList$.subscribe((documents: DocumentItem[]) =>
      documents.forEach(items => {
        if (items) {
          items.canDelete = true;
          this.documentCategoryList.push(items);
          this.documentScanList.push(items);
        }
      })
    );
  }
  submitDocument() {
    if (this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null)) {
      this.patchEarlyDisabilityDetails(); // to pass mbassessment req id to BE
    } else {
      this.documentScanList.forEach((item: DocumentItem, index) => {
        item?.required && item?.documentContent == null ? (this.documentScanList[index].uploadFailed = true) : null;
      });
      this.showMandatoryDocErrorMessage(true);
    }
  }
  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.assessmentRequestId).subscribe(res => (document = res));
  }
  showTemplate(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }
  showMandatoryDocErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.isAppPrivate && this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }
  //Patch api to update Early Reassessment details
  patchEarlyDisabilityDetails() {
    this.identifier = this.selectedPerson ? this.selectedPerson.identitynumber : this.identifier;
    this.assessmentRequestId = this.EarlyReassessmentResponseDto.mbReassessmentReqId;
    this.disabilityAssessmentId = this.EarlyReassessmentResponseDto.disabilityAssessmentId;
    this.referenceNo = this.EarlyReassessmentResponseDto.transactionTraceId;
    this.ohService
      .updateEarlyDisabDetails(
        this.identifier,
        this.assessmentRequestId,
        this.disabilityAssessmentId,
        this.referenceNo,
        this.isReturn
      )
      .subscribe(
        res => {
          this.SubmitResponse = res;
          if (this.SubmitResponse && this.SubmitResponse.transactionTraceId) {
            this.isReturn
              ? this.submitReturnedTransaction()
              : (this.router.navigate([RouterConstants.ROUTE_INBOX]),
                this.alertService.showSuccess(this.SubmitResponse.message)); // BPM api to move workitem from Inbox for
          }
        },
        err => this.showError(err)
      );
  }
  //Download file
  fileDownload(val: ServiceProviderAddressDto) {
    const hospitalProvider = this.selectedHospitalName;
    const reportDetails = {
      hospitalProvider,
      assessmentId:
        this.payload && this.payload.assignedRole === 'Contributor'
          ? this.disabilityAssessmentId
          : this.selectedPerson.assessmentId
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
  //post Api payload data
  toGetpayloadData() {
    this.EarlyReassessmentDto.description = this.parentForm
      .get('earlyDisabilityForm')
      .get('disabilityDescription').value;
    this.EarlyReassessmentDto.disabilityAssessmentId = this.selectedPerson
      ? this.selectedPerson.assessmentId
      : this.disabilityAssessmentId;
    this.EarlyReassessmentDto.disabilityType = this.selectedPerson
      ? this.selectedPerson.assessmentType
      : this.disabilityDetails.disabilityType;
    this.EarlyReassessmentDto.reason = this.parentForm.get('earlyDisabilityForm').get('earlyReason').value;
    this.EarlyReassessmentDto.comments = this.parentForm.get('earlyDisabilityForm').get('specificComments').value;
    this.EarlyReassessmentDto.hospitalProvider = this.parentForm?.get('reportForm')?.get('provider')?.value;
  }
  getPreviousDisability() {
    const _identityNinIqama = this.selectedPerson ? this.selectedPerson.identitynumber : this.identifier;
    if (_identityNinIqama) {
      this.medicaAssessmentService.getPreviousDisability(_identityNinIqama).subscribe(res => {
        this.previousDisabilityDetails = res;
      });
    }
  }
  getReasonLov() {
    this.lookUpService.getEarlyReassessmentReason().subscribe(res => {
      this.reasonList = res;
    });
  }
  getOccNonOccType() {
    this.occEarlyReassessment = false;
    if (
      this.disabilityDetails &&
      (this.disabilityDetails.disabilityType.english === 'Occupational Disability' ||
        this.disabilityDetails.disabilityType.english === 'Reassessment Occupational Disability' ||
        this.disabilityDetails.disabilityType.english === 'Occupational Disability Reassessment')
    ) {
      this.occEarlyReassessment = true;
    }
    if (
      this.selectedPerson &&
      (this.selectedPerson.assessmentType.english === 'Occupational Disability' ||
        this.selectedPerson.assessmentType.english === 'Reassessment Occupational Disability' ||
        this.selectedPerson.assessmentType.english === 'Occupational Disability Reassessment')
    ) {
      this.occEarlyReassessment = true;
    }
  }
  //Returned transaction document fetch and show
  getDocumentList() {
    const transactionKey = 'EARLY_REASSESSMENT_REQUEST';
    const transactionType = 'MEDICAL_BOARD';
    this.documentService
      .getDocuments(transactionKey, transactionType, this.assessmentRequestId, this.referenceNo)
      .subscribe(res => {
        res.forEach(item => {
          if (item.name.english !== null) {
            this.documentCategoryList.push(item);
            this.documentScanList.push(item);
          }
        });
      });
  }
  previousAssessmentDetails(data: AssessmentData) {
    this.medicaAssessmentService.setIsFromOh(true);
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.socialNumber = this.socialInsuranceNo;
    this.coreBenefitService.injuryId = this.injuryId;
    this.coreBenefitService.regNo = this.registrationNo;
    this.disabilityAssessmentService.disabilityAssessmentId = data.assessmentId;
    this.disabilityAssessmentService.disabilityType = data.disabilityType;
    this.disabilityAssessmentService.contractDoctor = false;
    this.disabilityAssessmentService.assessmentTypes =data?.assessmentType;
    this.disabilityAssessmentService.benefitReqId = data?.benefitReqId;
    this.disabilityAssessmentService.referenceNo = data?.referenceNo;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  submitReturnedTransaction() {
    const action = WorkFlowActions.SUBMIT;
    const workflowData = this.setReturnWorkflowData(this.routerData, action);
    this.saveWorkflow(workflowData);
    this.hideModal();
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
}
