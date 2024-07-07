import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import {
  AlertService,
  ApplicationTypeToken,
  AssessmentDetail,
  AuthTokenService,
  BilingualText,
  CoreAdjustmentService,
  CoreBenefitService,
  DisabilityData,
  DisabilityDetails,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  MbAllowance,
  MedicalAssessmentService,
  MedicalboardAssessmentService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import {
  ComplicationService,
  ContributorService,
  DiseaseService,
  InjuryService,
  OhService,
  EstablishmentService,
  setWorkFlowDataForContributorClarification
} from '../../../shared';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PlatformLocation, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContributorBPMRequest } from '@gosi-ui/features/contributor';
import { DisabilityAssessmentService } from '@gosi-ui/features/medical-board';

@Component({
  selector: 'oh-mb-conveyance-allowance-sc',
  templateUrl: './mb-conveyance-allowance-sc.component.html',
  styleUrls: ['./mb-conveyance-allowance-sc.component.scss']
})
export class MbConveyanceAllowanceScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local Variable
   */
  dependentConveyance = false;
  nonOccConveyance = false;
  heirConveyance = false;
  complicationConveyance = false;
  injuryConveyance = false;
  payload;
  disabilityDetails: DisabilityDetails;
  previousDisabilityDetails: DisabilityData;
  returnReasonList$: Observable<LovList> = new Observable<LovList>(null);
  conveyanceRejectLovList: Observable<LovList> = new Observable<LovList>(null);
  color: string;
  collapseView = true;
  medicalBoardType: BilingualText;
  returnForm: FormGroup = new FormGroup({});
  mbAllowanceDto: MbAllowance = new MbAllowance();
  address: string;
  geoCoder: google.maps.Geocoder;
  originLongitude: string;
  originLatitude: string;
  assessmentDetails: AssessmentDetail;
  disabilityAssessmentId: number;

  constructor(
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly complicationService: ComplicationService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly lookupService: LookupService,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly diseaseService: DiseaseService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly disabilityAssessmentService: DisabilityAssessmentService,
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

  ngOnInit(): void {
    this.getLang();
    this.getPayloadDetails();
    this.getApiDetails();
    this.formDetails();
  }
  getPayloadDetails() {
    if (this.routerData && this.routerData.payload) {
      this.payload = JSON.parse(this.routerData.payload);
      this.mbAssessmentRequestId = this.payload.assessmentRequestId;
      this.registrationNo = this.payload.registrationNo;
      this.socialInsuranceNo = this.payload.socialInsuranceNo;
      this.transactionNumber = this.payload.referenceNo;
      this.identifier = this.payload.identifier;
      this.personId = this.payload.id;
      this.disabilityAssessmentId = this.payload?.disabilityAssessmentId;
    }
  }
  getLang() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  getApiDetails() {
    this.getDisabiltyAssessmentDetails(this.mbAssessmentRequestId);
    this.getPreviousDisability();
    this.getReasonLov();
    this.getAllowance();
    this.getAssessmentDetails(this.identifier, this.disabilityAssessmentId);
  }
  formDetails() {
    this.reportInjuryModal = this.createInjuryModalForm();
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.returnForm = this.createReturnForm();
  }
  getDisabiltyAssessmentDetails(mbAssessmentRequestId) {
    this.medicaAssessmentService.getDisabilityDetails(this.identifier, mbAssessmentRequestId).subscribe(
      res => {
        this.disabilityDetails = res;
        this.medicalBoardType = this.disabilityDetails.medicalBoard;
        this.socialInsuranceNo = !isNaN(Number(this.socialInsuranceNo))
          ? this.socialInsuranceNo
          : this.disabilityDetails.socialInsuranceNo;
        this.benefitRequestId = !isNaN(Number(this.benefitRequestId))
          ? this.benefitRequestId
          : this.disabilityDetails.benefitRequestId;
        this.registrationNo = !isNaN(Number(this.registrationNo))
          ? this.registrationNo
          : this.disabilityDetails.registrationNumber;
        this.getContributorDetails(this.socialInsuranceNo); // get Contributor details
        this.disabilityDetails.ohType === 2
          ? (this.complicationConveyance = true)
          : this.disabilityDetails.ohType === 0
          ? (this.injuryConveyance = true)
          : null;
        const disabilityType = this.disabilityDetails.disabilityType.english;
        this.getDisabilitytype(disabilityType);
        if (this.complicationConveyance) {
          this.injuryId = this.disabilityDetails?.injuryNumber; // for getting complication injurydetails
          this.complicationId = this.disabilityDetails?.injuryId;
          this.getCompDetails();
        } else if (this.injuryConveyance) {
          this.injuryId = this.disabilityDetails?.injuryId;
          this.getInjuryDetails(true);
        }
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  selectedLov(val: string) {
    if (val && val === 'Others') {
      this.returnForm.get('comments').setValidators(Validators.required);
      this.returnForm.get('comments').updateValueAndValidity();
    } else {
      this.returnForm.get('comments').clearValidators();
      this.returnForm.get('comments').updateValueAndValidity();
    }
  }
  getReasonLov() {
    this.conveyanceRejectLovList = this.lookupService.getConveyanceRejection();
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
  }
  getDisabilitytype(disabilityType) {
    if (
      // this.routerData.resourceType === WorkFlowActions.NON_OCC_DISABILITY_ASSESSMENT &&
      disabilityType === 'Dependent Disability' || disabilityType === 'Dependent Disability Reassessment'
    ) {
      this.dependentConveyance = true;
      this.heirDisabilityApi();
    } else if (
      // this.routerData.resourceType === WorkFlowActions.NON_OCC_DISABILITY_ASSESSMENT &&
      disabilityType === 'Non-Occupational Disability' || disabilityType === 'Non-Occupational Disability Reassessment'
    ) {
      this.nonOccConveyance = true;
      this.forNonOccApiValues();
    } else if (disabilityType === 'Heir Disability' || disabilityType === 'Heir Disability Reassessment') {
      this.heirConveyance = true;
      this.heirDisabilityApi();
    }
  }
  getPreviousDisability() {
    this.medicaAssessmentService.getPreviousDisability(this.identifier).subscribe(res => {
      this.previousDisabilityDetails = res;
    });
  }
  cancelTransacation(templateRef: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(templateRef, config);
  }
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
    this.getReasonLov();
  }
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  previousAssessmentDetails(val) {
    this.coreAdjustmentService.identifier = this.disabilityDetails.personId;
    this.coreAdjustmentService.socialNumber = this.disabilityDetails.socialInsuranceNo;
    this.coreBenefitService.injuryId = val?.injuryId;
    this.coreBenefitService.regNo = this.disabilityDetails.registrationNumber;
    this.disabilityAssessmentService.disabilityAssessmentId = val.assessmentId;
    this.disabilityAssessmentService.disabilityType = val.assessmentType;
    this.router.navigate([`/home/medical-board/disability-assessment/view`]);
  }
  navigateToDashboard() {
    if (this.registrationNo) this.router.navigate([`home/establishment/profile/${this.registrationNo}/view`]);
    else {
      this.router.navigate(['home/establishment/profile']);
    }
  }
  navigateToAssessmentPage() {
    this.coreAdjustmentService.identifier = this.disabilityDetails.personId;
    this.coreAdjustmentService.socialNumber = this.disabilityDetails.socialInsuranceNo;
    this.coreBenefitService.injuryId = this.disabilityDetails?.injuryId;
    this.coreBenefitService.regNo = this.disabilityDetails.registrationNumber;
    this.disabilityAssessmentService.disabilityAssessmentId = this.mbAllowanceDto.assessmentId;
    this.disabilityAssessmentService.disabilityType = this.disabilityDetails?.disabilityType;
    this.disabilityAssessmentService.contractDoctor = false;
    this.router.navigate([`/home/medical-board/disability-assessment/view`]);
  }
  approveButton() {
    const action = WorkFlowActions.APPROVE;
    const data = setWorkFlowDataForContributorClarification(this.routerData, this.reportInjuryModal, null, action);
    this.bPmMergeAndUpdate(data, action);
  }
  // if (this.reportsFormControl.invalid || this.requestReportsForm.invalid) {
  // markFormGroupTouched(this.reportsFormControl);
  reject() {
    if (this.reportInjuryForm.get('rejectionReason').value && this.reportInjuryForm.valid) {
      const action = WorkFlowActions.REJECT;
      const data = this.setWorkflowData(this.routerData, action);
      this.saveWorkflow(data);
    } else {
      this.reportInjuryForm.get('rejectionReason').setValidators([Validators.required]);
      this.reportInjuryForm.markAllAsTouched();
      this.reportInjuryForm.get('rejectionReason').updateValueAndValidity();
    }
  }
  returnConveyance() {
    if (this.returnForm.get('returnReason').value && this.returnForm.valid) {
      const action = WorkFlowActions.RETURN;
      const data = this.setWorkflowData(this.routerData, action);
      this.saveWorkflow(data);
    } else {
      this.returnForm.get('returnReason').setValidators([Validators.required]);
      this.returnForm.markAllAsTouched();
      this.returnForm.get('returnReason').updateValueAndValidity();
    }
    //return to MBO officer if returned
  }
  getAllowance() {
    this.medicaAssessmentService.getAllowanceDetails(this.identifier, this.mbAssessmentRequestId).subscribe(
      res => {
        this.mbAllowanceDto = res;
        if (this.mbAllowanceDto?.originLongitude && this.mbAllowanceDto?.originLatitude) {
          this.originLongitude = this.mbAllowanceDto?.originLongitude;
          this.originLatitude = this.mbAllowanceDto?.originLatitude;
          this.getPlaceByLocation();
        }
      },
      err => {
        err.error.status === 'INTERNAL_SERVER_ERROR' || err.status === 500
          ? this.alertService.showErrorByKey('MEDICAL-BOARD.ERROR-MESSASGE-500')
          : this.alertService.showError(err.error.message);
      }
    );
  }
  createReturnForm() {
    return this.fb.group({
      returnReason: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      comments: [null]
    });
  }
  setWorkflowData(routerData: RouterData, action: string): ContributorBPMRequest {
    const datas = new ContributorBPMRequest();
    //show comments and reason for Return and Reject tRansaction
    if (action === WorkFlowActions.REJECT && this.reportInjuryForm.valid) {
      datas.rejectionReason = this.reportInjuryForm.get('rejectionReason').value;
      datas.comments = this.reportInjuryForm.get('comments')?.value;
    } else if (action === WorkFlowActions.RETURN && this.returnForm.valid) {
      datas.returnReason = this.returnForm.get('returnReason').value;
      datas.comments = this.returnForm.get('comments')?.value;
    } else if (action === WorkFlowActions.APPROVE && this.reportInjuryModal.get('comments').value) {
      datas.comments = this.reportInjuryModal.get('comments').value;
    }
    datas.taskId = routerData.taskId;
    datas.user = routerData.assigneeId;
    datas.outcome = action;
    return datas;
  }
  bPmMergeAndUpdate(data, action) {
    this.workflowService.mergeAndUpdateTask(data).subscribe(
      () => {
        this.navigateToInbox(action);
        this.hideModal();
      },
      err => {
        this.showError(err);
        this.hideModal();
      }
    );
  }
  viewInjury() {
    this.ohService.setRoute('Close Injury');
    if (this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus) {
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
      ]);
    }
  }
  viewInj(injurId: number) {
    this.ohService.setRoute('Close Complication');
    this.router.navigate([`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${injurId}/injury/info`]);
  }
  viewComplication() {
    this.ohService.setRoute('Close Complication');
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/${this.complicationId}/complication/info`
    ]);
  }
  getPlaceByLocation() {
    this.geoCoder = new google.maps.Geocoder();
    this.geoCoder.geocode(
      { location: { lat: Number(this.originLatitude), lng: Number(this.originLongitude) } },
      results => {
        this.address = results[5].formatted_address;
      }
    );
  }
  getAssessmentDetails(identifier, disabilityAssessmentId) {
    this.medicaAssessmentService.getAssessmentDetail(identifier, disabilityAssessmentId).subscribe(res => {
      this.assessmentDetails = res;
    });
  }
}
