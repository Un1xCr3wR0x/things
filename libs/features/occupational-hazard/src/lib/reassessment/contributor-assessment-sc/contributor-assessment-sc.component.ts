import { Location, PlatformLocation } from '@angular/common';
import { Component, HostListener, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  AssessmentData,
  AuthTokenService,
  BilingualText,
  ContributorAssessmenttRequestDto,
  CoreAdjustmentService,
  CoreBenefitService,
  DisabilityData,
  DisabilityDetails,
  DocumentItem,
  DocumentService,
  downloadFile,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  MedicalAssessmentService,
  MedicalboardAssessmentService,
  RouterData,
  RouterDataToken,
  scrollToTop,
  WizardItem,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import {
  AssessmentConstants,
  DisabilityAssessmentService,
  DocumentTransactionId,
  DocumentTransactionType,
  MedicalBoardService
} from '@gosi-ui/features/medical-board';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  ComplicationService,
  ContributorService,
  DiseaseService,
  EstablishmentService,
  InjuryService,
  OhService
} from '../../shared';
import { OhConstants } from '../../shared/constants/oh-constants';

import { ServiceProviderAddressDto } from '../../shared/models/service-provider-address';
import { ValidatorBaseScComponent } from '../../validator/base/validator-sc.base-component';
import { TransactionTraceId } from '../../shared/models/transaction-trace';

@Component({
  selector: 'oh-contributor-assessment-sc',
  templateUrl: './contributor-assessment-sc.component.html',
  styleUrls: ['./contributor-assessment-sc.component.scss']
})
export class ContributorAssessmentScComponent extends ValidatorBaseScComponent implements OnInit {
  @ViewChild('assessmentWizard', { static: false })
  assessmentWizard: ProgressWizardDcComponent;
  @ViewChild('instrcutionModal', { static: true })
  instrcutionModal: TemplateRef<HTMLElement>;

  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;

  assessmentWizards: WizardItem[] = [];
  documentScanList: DocumentItem[] = [];
  documentCategoryList: DocumentItem[] = [];
  documentList$: Observable<DocumentItem[]>;
  // modalRef: BsModalRef;
  parentForm: FormGroup = new FormGroup({});
  requestDisabilityAssessmentForm = new FormGroup({});
  isSmallScreen: boolean;
  currentTab = 0;
  documentList: DocumentItem[];
  documentForm: FormGroup = new FormGroup({});
  uploadFailed: boolean;
  hospital$: Observable<LovList>;
  serviceAddress: ServiceProviderAddressDto = new ServiceProviderAddressDto();
  assessmentRequestId: number;
  isNonOcc: true;
  benefitRequestId: number;
  submitAssessment: ContributorAssessmenttRequestDto = new ContributorAssessmenttRequestDto();
  identifier: number;
  occReassessment: boolean;
  disabilityAssessmentId: number;
  hospitalName: BilingualText;
  TransactionTraceId: TransactionTraceId = new TransactionTraceId();
  disabiliyDtoList: DisabilityDetails;
  type: BilingualText;
  heading: string;
  forContributorReassessments: boolean;
  previousDisabilityDetails: DisabilityData;
  isReassessment = true;
  personIdentifier: number;
  successMessage: BilingualText;

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
    readonly medicalBoarsService: MedicalBoardService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly diseaseService: DiseaseService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
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
    const payload = JSON.parse(this.routerData.payload);
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.personIdentifier = payload.identifier;
    payload.resource === 'Occupational Disability Reassessment' ? (this.occReassessment = true) : null;
    this.transactionNumber = payload.referenceNo; //  to provide trance did in participant conform api
    this.setValues(this.routerData);
    this.getDisabilityDetails();
    this.getPreviousDisability();
    this.requestDisabilityAssessmentForm = this.createrequestDisabilityAssessmentForm();
    this.initializeWizard();
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalService.show(this.instrcutionModal, config);
    this.reportInjuryModal = this.createInjuryModalForm();
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.hospital$ = this.lookUpService.getHospitalList();
    // this.getDocumentList();
    this.getDocumentCategory();
  }
  fileDownload(val) {
    const hospitalProvider = this.hospitalName;
    const reportDetails = {
      hospitalProvider,
      assessmentId: this.disabilityAssessmentId
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
  setValues(routerData) {
    const payload = JSON.parse(routerData.payload);
    if (routerData.resourceType === OhConstants.TRANSACTION_NON_OCC_DISABILITY_REASSESSMENT) {
      this.isNonOcc = true;
    }
    if (routerData.resourceType === OhConstants.TRANSACTION_HEIR_DISABILITY_REASSESSMENT) {
      this.isNonOcc = true;
    }
    this.disabilityAssessmentId = payload.disabilityAssessmentId;
    this.assessmentRequestId = payload.assessmentRequestId;
    this.benefitRequestId = payload.benefitRequestId;
    this.identifier = payload.identifier;
  }
  initializeWizard() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(OhConstants.ASSESSMENT_DETAILS, 'file-medical')); //TODO: change icon
    wizardItems.push(new WizardItem(OhConstants.DOCUMENTS, 'file-alt'));
    this.assessmentWizards = wizardItems;
    this.assessmentWizards[this.currentTab].isActive = true;
    this.assessmentWizards[this.currentTab].isDisabled = false;
  }

  selectedWizard(index: number) {
    this.currentTab = index;
  }
  /*
   * This method create Disability assessment form
   */
  createrequestDisabilityAssessmentForm() {
    return this.fb.group({
      disabilityDescription: [null, { validators: Validators.required }]
    });
  }
  hideInstructionModal() {
    this.getHeading();
    this.modalService.hide();
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
      this.ohService.submitAssessment(this.identifier, this.assessmentRequestId, this.submitAssessment).subscribe(
        response => {
          if (response) {
            this.successMessage = response.message;
            this.nextTab();
            this.forContributorReassessments = true;
          }
        },
        err => {
          this.showError(err);
        }
      );
    }
    // }
    //  else if (this.requestDisabilityAssessmentForm.invalid) {
    //   markFormGroupTouched(this.requestDisabilityAssessmentForm);
    //   this.alertService.showMandatoryErrorMessage();
    // } else {
    //   this.submitAssessment.reassessmentDescription = this.requestDisabilityAssessmentForm.get(
    //     'disabilityDescription'
    //   ).value;
    //   this.submitAssessment.mbAssessmentRequestId = this.assessmentRequestId;
    //   this.ohService.submitAssessment(this.assessmentRequestId, this.submitAssessment).subscribe(
    //     response => {
    //       if (response) this.nextTab();
    //     },
    //     err => {
    //       this.showError(err);
    //     }
    //   );
    // }
  }
  getDocumentCategory() {
    this.documentList$ = this.ohService.getReqDocsForReassessmentRequest().pipe(
      map(documents => this.documentService.removeDuplicateDocs(documents)),
      catchError(error => of(error))
    );
    this.documentList$.subscribe((documents: DocumentItem[]) =>
      documents.forEach(items => {
        if (items?.documentClassification === 'External') {
          items.canDelete = true;
          if (items?.documentClassification === 'External' && items?.name?.english === 'Detailed Medical Report') {
            items.required = true;
          }
          this.documentCategoryList.push(items);
          this.documentScanList.push(items);
        }
      })
    );
  }
  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.assessmentRequestId).subscribe(res => (document = res));
  }
  showTemplate(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }
  submitDocument(event) {
    if (this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null)) {
      this.TransactionTraceId.transactionTraceId = this.transactionNumber;
      this.participantSubmitApi(this.assessmentRequestId, this.TransactionTraceId); // to pass mbassessment req id to BE
    } else {
      this.documentScanList.forEach((item: DocumentItem, index) => {
        item?.required && item?.documentContent == null ? (this.documentScanList[index].uploadFailed = true) : null;
      });
      this.showMandatoryDocErrorMessage(true);
    }
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
  /** Form Validation */
  showFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }
  //Method to handle pagination logic
  showMandatoryDocErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.isAppPrivate && this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }
  //Method to call service provider address api
  onServiceProviderSelected(data: BilingualText) {
    this.hospitalName = data;
    this.ohService.getServiceProviderAddress(this.identifier, data).subscribe(
      (data: ServiceProviderAddressDto) => {
        this.serviceAddress = data;
      },
      err => this.showError(err)
    );
  }
  getDocumentList() {
    this.ohService.getReqDocsForReassessmentRequest().subscribe(docs => {
      this.documentList = docs;
      this.documentList?.forEach(doc => {
        doc.canDelete = true;
      });
    });
  }
  /**
   * To pass assessmentRequestId in post api  for approving participant
   *  post mbassessmentRequest id for submitting participant
   * @param assessmentRequestId
   * @param transactiontraceid
   */
  participantSubmitApi(assessmentRequestId: number, TransactionTraceId: TransactionTraceId) {
    // const bPMcomments = this.documentForm.get('uploadDocument').value?.comments;
    // for reassessment comments to get passed in bpm api
    // this.ohService.putAssessmentRequestId(this.personIdentifier, assessmentRequestId, TransactionTraceId).subscribe(
    //   res => {
    //     const successMsg = res;
    //     if (successMsg.message.english) {
    //       this.confirmApprove(assessmentRequestId); //BPM api
    //     }
    //   },
    //   err => this.showError(err)
    // );
    const action = WorkFlowActions.UPDATE;
    this.reportInjuryForm.get('status').setValue('UPDATE');
    this.updateConfirmation(action);
    this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-APPROVED');
  }
  /**
   * To hide modal and cancel modal
   */
  confirmCancel() {
    this.hideModal();
    this.location.back();
  }
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  getDisabilityDetails() {
    if (this.assessmentRequestId) {
      this.medicalBoarsService
        .getDisabilityDetails(this.identifier, this.assessmentRequestId)
        .subscribe(res => (this.disabiliyDtoList = res));
    }
  }
  getHeading() {
    if (this.disabiliyDtoList) {
      this.type = this.disabiliyDtoList.disabilityType;
      if (this.type.english === 'Dependent Disability') {
        this.heading = 'OCCUPATIONAL-HAZARD.REQ-DEPENDENT-NON-OCC';
      } else if (this.type.english === 'Heir Disability') {
        this.heading = 'OCCUPATIONAL-HAZARD.REQUEST-HEIR-DISABILITY-REASSESSMENT';
      } else if (this.type.english === 'Non-Occupational Disability') {
        this.heading = 'OCCUPATIONAL-HAZARD.REQ-NON-OCC-DISABILITY-REASSESSMENT';
      } else if (this.type.english === 'Occupational Disability') {
        if (this.disabiliyDtoList?.ohType === 0) {
          this.heading = 'OCCUPATIONAL-HAZARD.CLOSE-OCCUPATIONAL-INJURY-REASSESSMENT';
        }
        if (this.disabiliyDtoList?.ohType === 2) {
          this.heading = 'OCCUPATIONAL-HAZARD.CLOSE-COMPLICATON-REASSESSMENT-TRANSACTION';
        }
      } else if (
        this.type.english === 'Reassessment Occupational Disability' ||
        this.type.english === 'Occupational Disability Reassessment'
      ) {
        if (this.disabiliyDtoList?.ohType === 0) {
          this.heading = 'OCCUPATIONAL-HAZARD.CLOSE-OCCUPATIONAL-INJURY-REASSESSMENT';
        }
        if (this.disabiliyDtoList?.ohType === 2) {
          this.heading = 'OCCUPATIONAL-HAZARD.CLOSE-COMPLICATON-REASSESSMENT-TRANSACTION';
        }
      } else if (
        this.type.english === 'Reassessment Non-Occupational Disability' ||
        this.type.english === 'Non-Occupational Disability Reassessment'
      ) {
        this.heading = 'OCCUPATIONAL-HAZARD.REQ-NON-OCC-DISABILITY-REASSESSMENT';
      } else if (
        this.type.english === 'Reassessment Dependent Disability' ||
        this.type.english === 'Dependent Disability Reassessment'
      ) {
        this.heading = 'OCCUPATIONAL-HAZARD.REQ-DEPENDENT-NON-OCC';
      } else if (
        this.type.english === 'Reassessment Heir Disability' ||
        this.type.english === 'Heir Disability Reassessment'
      ) {
        this.heading = 'OCCUPATIONAL-HAZARD.REQUEST-HEIR-DISABILITY-REASSESSMENT';
      }
    }
  }
  //Method tp get previous disability details
  getPreviousDisability() {
    this.ohService.getPreviousDisability(this.personIdentifier).subscribe(res => {
      this.previousDisabilityDetails = res;
    });
  }
  previousAssessmentDetails(data: AssessmentData) {
    this.medicaAssessmentService.setIsFromOh(true);
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.socialNumber = this.socialInsuranceNo;
    this.coreBenefitService.injuryId = this.injuryId;
    this.coreBenefitService.regNo = this.registrationNo;
    this.disabilityAssessmentService.disabilityAssessmentId = data.assessmentId;
    this.disabilityAssessmentService.disabilityType = data.assessmentType;
    this.disabilityAssessmentService.contractDoctor = false;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
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
