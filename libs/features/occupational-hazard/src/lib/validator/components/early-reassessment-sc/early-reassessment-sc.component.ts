/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';
import {
  RouterDataToken,
  RouterData,
  AlertService,
  DocumentService,
  ApplicationTypeToken,
  WorkflowService,
  LookupService,
  LovList,
  WorkFlowActions,
  Role,
  markFormGroupTouched,
  RouterConstants,
  AuthTokenService,
  LanguageToken,
  EarlyReassessmentDto,
  SpecialtyList,
  DisabilityData,
  AssessmentData,
  DisabilityDetailsDtoList,
  MedicalboardAssessmentService,
  AssessmentDetail,
  RoleIdEnum,
  CoreAdjustmentService,
  CoreBenefitService,
  assembleUserComment,
  TransactionReferenceData,
  MedicalAssessmentService
} from '@gosi-ui/core';
import {
  OhService,
  InjuryService,
  EstablishmentService,
  ComplicationService,
  ContributorService,
  DiseaseService
} from '../../../shared/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Route, RouteConstants, createLovList } from '../../../shared';
import { AssessmentConstants, DisabilityAssessmentService } from '@gosi-ui/features/medical-board';

@Component({
  selector: 'oh-early-reassessment-sc',
  templateUrl: './early-reassessment-sc.component.html',
  styleUrls: ['./early-reassessment-sc.component.scss']
})
export class EarlyReassessmentScComponent extends ValidatorBaseScComponent implements OnInit {
  specialtyList: LovList;
  visitingReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;
  bodyPartsCategoryList: LovList;
  rejectEarlyReassessment: Observable<LovList>;
  previousDisabilityDetails: DisabilityData;
  complicationInjuryId: number;
  maxLengthComments = 300;
  payload;
  showReturnBtn = false;
  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   * Local Variable
   */
  dependentEarlyReAssessment: boolean;
  nonOCCEarlyReAssessment: boolean;
  heirEarlyReAssessment: boolean;
  complicationEarlyReAssessment: boolean;
  injuryEarlyReAssessment: boolean;
  isAppealedAssessment: boolean;
  contributorFormControl = new FormGroup({});
  reportsFormControl = new FormGroup({});
  requestReportsForm: FormArray = new FormArray([]);
  disabilityAssessmentId: number;
  earlyReassessmentDto: EarlyReassessmentDto = new EarlyReassessmentDto();
  singleAssessmentDetails: AssessmentData;
  assessmentDetails: AssessmentDetail;
  reAssessReason: string;
  identifier: number;
  heading: string;
  lang = 'en';
  appealDisabilityAssessmentId: number;
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
  ngOnInit(): void {
    this.getLang();
    this.payloadDetails();
    this.toGetListOfValues();
    this.toGetApiDetails();
    this.formDetails();
  }
  payloadDetails() {
    if (this.routerData && this.routerData.payload) {
      // if (this.routerData.userComment) {
      //   this.transactionReferenceData = this.routerData.userComment.map(eachComment => {
      //     return assembleUserComment(eachComment);
      //   });
      // }


      this.payload = JSON.parse(this.routerData.payload);
      this.mbAssessmentRequestId = this.payload.assessmentRequestId;
      this.registrationNo = this.payload.registrationNo;
      this.socialInsuranceNo = this.payload.socialInsuranceNo;
      this.transactionNumber = this.payload.referenceNo;
      this.disabilityAssessmentId = this.payload.disabilityAssessmentId;
      if (this.routerData.resourceType === RouterConstants.TRANSACTION_ASSIGN_APPEAL) {
       if(!this.comment){this.comment =[]} 
        this.comment.push({...new TransactionReferenceData(),comments: this.payload?.comments,userName:this.payload?.assignedUser})
      } else { this.comment = this.routerData.comments; }
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.ohService.setRegistrationNo(this.registrationNo);
      this.identifier = this.payload.identifier;
      this.personId = this.payload.id;
      this.routerData &&
        this.routerData.resourceType === WorkFlowActions.APPEAL_ASSESSMENT &&
        (this.routerData.assignedRole === Role.HEAD_OFFICE_GOSI_DOCTOR ||
          this.routerData.assignedRole === Role.HO_DOCTOR ||
          this.routerData.assignedRole === Role.HO_OFFICER ||
          this.routerData.assignedRole === Role.HEAD_GOSI_DOCTOR)
        ? (this.isAppealedAssessment = true)
        : (this.isAppealedAssessment = false);
      if (
        this.routerData.assignedRole ===
        (Role.OH_DOCTOR || Role.HEAD_OFFICE_GOSI_DOCTOR || Role.HEAD_GOSI_DOCTOR || Role.GOSI_DOCTOR_CAPS)
      )
        this.canEdit = false;
      if (this.routerData.state === WorkFlowActions.RETURN) this.isReturn = true;
      this.payload.initiatorRoleId === RoleIdEnum.CONTRIBUTOR
        ? (this.showReturnBtn = true)
        : (this.showReturnBtn = false); // Return btn hide for EarlyReAssessment initiated by MBO show for initiated by CONTRIBUTOR
    }
  }
  formDetails() {
    this.reportInjuryModal = this.createInjuryModalForm();
    this.reportsFormControl = this.createReportsFormGroup();
    this.contributorFormControl = this.createContributorFormGroup();
    this.requestReportsForm.push(this.createReportsForm());
    this.reportInjuryForm = this.createInjuryDetailsForm();
  }
  toGetListOfValues() {
    this.getSpecialityList();
    this.visitingReasonList$ = this.lookupService.getMBVisitingDoctorReasonsList();
    this.getDisabilityLovs();
    this.getRejectReason();
    this.getContributorDocumentList(); // get clarification from contgributor doc list
    this.documentListLov = createLovList(this.injuryItemList);
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
  }
  toGetApiDetails() {
    this.getDisabiltyAssessmentDetails(this.mbAssessmentRequestId);
    this.getPreviousDisability();
    this.getDocument(this.identifier, this.disabilityAssessmentId)
    // this.documentFetch(this.mbAssessmentRequestId, this.transactionNumber);
  }
  getSpecialityList() {
    this.lookupService.getSpecialityList().subscribe(res => {
      if (res) this.specialtyList = res;
    });
  }
  getDisabilityLovs() {
    this.lookupService.getBodyPartsList().subscribe(res => {
      this.bodyPartsCategoryList = res;
    });
  }
  getPreviousDisability() {
    this.medicaAssessmentService.getPreviousDisability(this.identifier).subscribe(res => {
      this.previousDisabilityDetails = res;
      this.singleAssessmentDetails = res.data.filter(result => result?.assessmentId === this.disabilityAssessmentId)[0];
      this.singleAssessmentDetails ? this.getAssessmentDetailsView() : null;
    });
  }
  getAssessmentDetailsView() {
    this.medicaAssessmentService
      .getAssessmentDetail(this.identifier, this.singleAssessmentDetails?.assessmentId)
      .subscribe(res => {
        this.assessmentDetails = res;
        this.injuryId = res.injuryId;
      });
  }
  getDisabiltyAssessmentDetails(mbAssessmentRequestId) {
    this.medicaAssessmentService.getDisabilityDetails(this.identifier, mbAssessmentRequestId).subscribe(
      res => {
        this.disabilityDetails = res;
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
        this.getHeading();
        this.specialtyArray = this.disabilityDetails.specialtyList;
        this.disabilityDetails.ohType === 2
          ? (this.complicationEarlyReAssessment = true)
          : this.disabilityDetails.ohType === 0
            ? (this.injuryEarlyReAssessment = true)
            : null;
        const disabilityType = this.disabilityDetails.disabilityType.english;
        !this.complicationEarlyReAssessment && !this.injuryEarlyReAssessment
          ? this.getDisabilitytype(disabilityType)
          : null;
        if (this.complicationEarlyReAssessment) {
          this.injuryId = this.disabilityDetails?.injuryNumber; // for getting complication injurydetails
          this.complicationId = this.disabilityDetails?.injuryId;
          this.getCompDetails();
          this.getComplication();
        } else if (this.injuryEarlyReAssessment) {
          this.isEarlyReassessment = true; // for getting only injury details neglecting rased documents method
          this.injuryId = this.disabilityDetails?.injuryId;
          this.getInjuryDetails(this.isEarlyReassessment);
        }
        this.appealDisabilityAssessmentId = this.disabilityDetails.primaryAssessmentDetails.disabilityAssessmentId;
        if (
          this.disabilityDetails.medicalBoard.english === 'Appeal Medical Board' &&
          this.appealDisabilityAssessmentId
        ) {
          this.getDocument(this.identifier,this.appealDisabilityAssessmentId);
          // this.documentFetch(this.appealDisabilityAssessmentId, null);
        }
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  getHeading() {
    if (this.disabilityDetails) {
      const type = this.disabilityDetails.disabilityType.english;
      if (this.isAppealedAssessment) {
        switch (type) {
          case 'Dependent Disability':
          case 'Dependent Disability Reassessment':
          case 'Reassessment Dependent Disability':
            this.heading = 'OCCUPATIONAL-HAZARD.REQ-APPEAL-DEPENDENT-DISABILITY-ASSESSMENT';
            break;
          case 'Heir Disability':
          case 'Reassessment Heir Disability':
          case 'Heir Disability Reassessment':
            this.heading = 'OCCUPATIONAL-HAZARD.REQUEST-APPEAL-HEIR-DISABILITY-ASSESSMENT';
            break;
          case 'Non-Occupational Disability':
          case 'Reassessment Non-Occupational Disability':
          case 'Non-Occupational Disability Reassessment':
            this.heading = 'OCCUPATIONAL-HAZARD.REQ-APPEAL-NON-OCC-DISABILITY-ASSESSMENT';
            break;
          case 'Occupational Disability':
          case 'Reassessment Occupational Disability':
          case 'Occupational Disability Reassessment':
            this.heading = 'OCCUPATIONAL-HAZARD.REQ-APPEAL-OCCUPATIONAL-DISABILITY-ASSESSMENT';
        }
        return this.heading;
      } else {
        switch (type) {
          case 'Dependent Disability':
          case 'Dependent Disability Reassessment':
          case 'Reassessment Dependent Disability':
            this.heading = 'OCCUPATIONAL-HAZARD.REQ-EARLY-DEPENDENT-DISABILITY-REASSESSMENT';
            break;
          case 'Heir Disability':
          case 'Reassessment Heir Disability':
          case 'Heir Disability Reassessment':
            this.heading = 'OCCUPATIONAL-HAZARD.REQUEST-EARLY-HEIR-DISABILITY-REASSESSMENT';
            break;
          case 'Non-Occupational Disability':
          case 'Reassessment Non-Occupational Disability':
          case 'Non-Occupational Disability Reassessment':
            this.heading = 'OCCUPATIONAL-HAZARD.REQ-EARLY-NON-OCC-DISABILITY-REASSESSMENT';
            break;
          case 'Occupational Disability':
          case 'Reassessment Occupational Disability':
          case 'Occupational Disability Reassessment':
            this.heading = 'OCCUPATIONAL-HAZARD.REQ-EARLY-OCCUPATIONAL-DISABILITY-REASSESSMENT';
        }
        return this.heading;
      }
    }
  }
  navigateToDashboard() {
    if (this.registrationNo) this.router.navigate([`home/establishment/profile/${this.registrationNo}/view`]);
    else {
      this.router.navigate(['home/establishment/profile']);
    }
  }
  viewInjury() {
    this.ohService.setRoute(Route.CLOSE_INJURY);
    if (this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus) {
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
      ]);
    }
  }
  navigateToStatus() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/validator/modify-close-injury']);
  }
  navigateToComplicationEdit() {
    // this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/validator/modify-close-complication']);
  }
  /**
   * Method to navigate to view complication page
   */
  viewComplication() {
    this.ohService.setRoute(Route.CLOSE_COMP);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/${this.complicationId}/complication/info`
    ]);
  }
  getDisabilitytype(disabilityType) {
    if (
      ((this.routerData.resourceType === WorkFlowActions.NON_OCC_DISABILITY_ASSESSMENT ||
        this.routerData.resourceType === WorkFlowActions.APPEAL_ASSESSMENT) &&
        disabilityType === 'Dependent Disability') ||
      (this.routerData.resourceType === WorkFlowActions.EARLY_REASSESSMENT &&
        disabilityType === 'Dependent Disability Reassessment')
    ) {
      this.dependentEarlyReAssessment = true;
      if (this.heirEarlyReAssessment || this.dependentEarlyReAssessment || this.nonOCCEarlyReAssessment) {
        this.getBenefitsDescription(this.socialInsuranceNo, this.benefitRequestId);
      }
    } else if (
      ((this.routerData.resourceType === WorkFlowActions.NON_OCC_DISABILITY_ASSESSMENT ||
        this.routerData.resourceType === WorkFlowActions.APPEAL_ASSESSMENT) &&
        disabilityType !== 'Dependent Disability') ||
      (this.routerData.resourceType === WorkFlowActions.EARLY_REASSESSMENT &&
        disabilityType === 'Non-Occupational Disability Reassessment')
    ) {
      this.nonOCCEarlyReAssessment = true; // To fetch document for assessments except injury and complication
      if (this.heirEarlyReAssessment || this.dependentEarlyReAssessment || this.nonOCCEarlyReAssessment) {
        this.getBenefitsDescription(this.socialInsuranceNo, this.benefitRequestId);
      }
    } else if (
      this.routerData.resourceType === WorkFlowActions.HEIR_DISABILITY_ASSESSMENT ||
      this.routerData.resourceType === WorkFlowActions.APPEAL_ASSESSMENT ||
      (this.routerData.resourceType === WorkFlowActions.EARLY_REASSESSMENT &&
        disabilityType === 'Heir Disability Reassessment')
    ) {
      this.heirEarlyReAssessment = true; // To fetch document for assessments except injury and complication
      if (this.heirEarlyReAssessment || this.dependentEarlyReAssessment || this.nonOCCEarlyReAssessment) {
        this.getBenefitsDescription(this.socialInsuranceNo, this.benefitRequestId);
      }
    }
  }
  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveCloseTransaction(templateRef: TemplateRef<HTMLElement>) {
    if (this.isWithDisability === false) {
      this.showModal(templateRef);
    } else if (this.isWithDisability === true && this.hasDuplicateBodyParts()) {
      this.alertService.showError(this.duplicateBodyPart); // for duplicate Body Parts
    } else if (
      (this.injuryEarlyReAssessment === true || this.complicationEarlyReAssessment) &&
      this.disabilityDetailsDto?.bodyPartsList?.length === 0
    ) {
      this.alertService.showError(this.nullCategory); // for nulll Body Parts //this.disabilityDetailsDto.bodyPartsList
    } else if (
      this.parentForm?.value?.visitingDoctorFormValue?.visitingDoctorSpecialty?.arabic === null &&
      (this.specialtyArray === undefined || (this.specialtyArray && this.specialtyArray.length === 0))
    ) {
      this.alertService.showError(this.specialityError); //For atleast one speciality
    } else if (
      this.specialtyArray &&
      this.specialtyArray.length > 0 &&
      this.specialtyArray.findIndex(rowValue => rowValue.isMainSpecialty === true) === -1
    ) {
      this.alertService.showError(this.mainSpecialtyerror); // for atleast one main speciality
    } else if (this.hasDuplicateValue(this.specialtyArray)) {
      this.alertService.showError(this.duplicateErrror); // for duplicated speciality
    } else if (
      this.isWithDisability === true ||
      this.nonOCCEarlyReAssessment ||
      this.heirEarlyReAssessment ||
      this.dependentEarlyReAssessment
    ) {
      if (this.isReturn === true) {
        this.parentForm.removeControl('disabilitySpecialtyForm');
      }
      if (this.parentForm.invalid) {
        markFormGroupTouched(this.parentForm);
        this.alertService.showMandatoryErrorMessage();
      } else this.showModal(templateRef);
    }
    this.reportInjuryModal.get('comments').clearValidators();
  }

  getVisitingDoctorFormValue() {
    return (this.parentForm.get('visitingDoctorFormValue.visitingDoctorSpecialty.english') as FormGroup).value;
  }
  approveButton() {
    this.getEveryFormData();
  }
  getEveryFormData() {
    this.disabilityDetailsDto.vdDetails = this.parentForm.get('visitingDoctorFormValue').value; // from oh-visiting-doctor-dc
    if (this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'No') {
      this.disabilityDetailsDto.vdDetails;
    }
    if (this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'Yes') {
      this.disabilityDetailsDto.vdDetails.vdSpecialties = this.getVisitingDoctorFormValue().map(speciality => {
        return {
          english: speciality?.english,
          arabic: speciality?.arabic
        };
      });
      delete this.disabilityDetailsDto.vdDetails.visitingDoctorSpecialty;
    }
    this.disabilityDetailsDto.specialtyList = this.specialtyArray;
    this.disabilityDetailsDto.transactionTraceId = this.transactionNumber.toString();
    // const isParticipantAttendanceRequired: boolean =
    //   this.parentForm.get('disabilityAttendenceForm').value.isParticipantAttendanceRequired.english === 'Yes';
    // this.disabilityDetailsDto.isParticipantAttendanceRequired = isParticipantAttendanceRequired ? true : false;
    /**
     * Story 359128 isParticipantAttendanceRequired boolean changed to string added virtual
     */
    this.disabilityDetailsDto.isParticipantAttendanceRequired = (
      this.parentForm.get('disabilityAttendenceForm') as FormGroup
    ).value.isParticipantAttendanceRequired.english;
    const visitingDoctor: boolean =
      this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'Yes';
    this.disabilityDetailsDto.isVdRequired = visitingDoctor ? true : false;
    delete this.disabilityDetailsDto?.vdDetails?.visitingDoctor;
    //for early reassessment
    //Patching get api values in  put api
    this.disabilityDetailsDto.disabilityType = this.disabilityDetails?.disabilityType;
    this.disabilityDetailsDto.injuryId = this.disabilityDetails.injuryId;
    this.disabilityDetailsDto.isReturn = this.routerData.state === WorkFlowActions.RETURN ? true : false;
    this.disabilityDetailsDto.mbAssessmentRequestId = this.disabilityDetails.mbAssessmentRequestId;
    this.disabilityDetailsDto.mbContractId = this.disabilityDetails.mbContractId;
    this.disabilityDetailsDto.mbProfessionalId = this.disabilityDetails.mbProfessionalId;
    this.disabilityDetailsDto.sessionId = this.disabilityDetails.sessionId;
    this.disabilityDetailsDto.comments = this.reportInjuryModal.get('comments').value; // bpm api value
    if (this.injuryEarlyReAssessment === true || this.complicationEarlyReAssessment === true) {
      this.disabilityDetailsDto.bodyPartsList = this.getDisabilityFormValue();
      this.disabilityDetailsDto.bodyPartsList.forEach((val, i) => {
        const bodyParts = val?.bodyParts?.english;
        const bpIndex = this.disabilityDetailsDto?.bodyPartsList[i]?.bodyPartsIndex;
        const nestedArray = bodyParts?.map(bP => {
          return {
            english: bP?.english,
            arabic: this.bodyPartsCategoryList?.items[bpIndex]?.items[bP?.sequence - 1]?.value.arabic
          };
        });
        delete this.disabilityDetailsDto.bodyPartsList[i].bodyPartsIndex;
        this.disabilityDetailsDto.bodyPartsList[i].bodyParts = nestedArray;
        this.disabilityDetailsDto.bodyPartsList[i].category = val?.category;
      });
      this.disabilityDetailsDto.isVDRequired = visitingDoctor ? true : false;
      this.disabilityDetailsDto.reassessmentDescription = this.disabilityDetails.disabilityDescription;
      this.disabilityDetailsDto.slotSequence = this.disabilityDetails.slotSequence;
    }
    this.earlyReAssessmentTransaction(this.mbAssessmentRequestId, this.disabilityDetailsDto);
  }
  earlyReAssessmentTransaction(mbAssessmentRequestId, disabilityDetailsDto: DisabilityDetailsDtoList) {
    if (this.routerData.state === WorkFlowActions.RETURN) {
      this.disabilityDetailsDto.bodyPartsList = this.disabilityDetails.bodyPartsList;
    }
    this.disabilityDetailsDto.description = this.description;
    if (this.isAppealedAssessment) {
      this.isEarlyReassessment = false;
    } else {
      this.isEarlyReassessment = true;
    }
    if (this.disabilityDetailsDto) {
      this.injuryService
        .putParamTransactionDetails(
          this.identifier,
          disabilityDetailsDto,
          mbAssessmentRequestId,
          this.isReturn,
          this.isEarlyReassessment
        )
        .subscribe(
          response => {
            const value = response;
            if (value && value.mbAssessmentRequestId) {
              const visitingDoctorRequired = this.disabilityDetailsDto.isVdRequired;
              this.confirmBPMApprove(
                visitingDoctorRequired,
                (this.isEarlyReassessment = true),
                JSON.parse(this.routerData.payload)
              );
              this.alertService.showSuccess(value.message, null, 10);
              this.navigateToInbox();
            }
          },
          err => {
            this.showErrorMessageAPI(err, this.alertService);
            this.hideModal();
          }
        );
    }
  }
  createContributorFormGroup(): FormGroup {
    return this.fb.group({
      requestedDocuments: this.fb.group({
        english: [null],
        arabic: ''
      }),
      comments: [null, { validators: Validators.required }]
    });
  }
  createReportsFormGroup(): FormGroup {
    return this.fb.group({
      comments: [null, { validators: Validators.required }]
    });
  } // form for table in Request Reports
  createReportsForm() {
    return this.fb.group({
      specialty: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      reportDetails: [null, { validators: Validators.required }]
    });
  }

  navigateToScan() {
    this.routerData.tabIndicator = 3;
    this.router.navigate(['home/oh/injury/edit?activeTab=3']);
  }
  specialtyArraylist(specialtyArray: SpecialtyList[]) {
    this.specialtyArray = specialtyArray;
  }
  /**
   * Method to navigate to view injury page
   */
  viewInj(injurId: number) {
    this.ohService.setRoute(Route.CLOSE_COMP);
    this.router.navigate([`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${injurId}/injury/info`]);
  }
  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.reset.emit();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  // Show modal for rejection
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  // Show modal for return
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  // for rejecting a early reassessment
  reject() {
    const rejectEarlyReassessment = true;
    this.rejectEarlyReassessment.subscribe(res => {
      this.reasonCode = res.items
        .find(data => data.value.english == this.reportInjuryForm.get('rejectionReason')?.value?.english)
        .code.toString();
      this.confirmRejectWithReason(rejectEarlyReassessment, this.reasonCode); //BPM api
    });
  }
  getRejectReason() {
    this.rejectEarlyReassessment = this.lookupService.getEarlyReassessmentReject();
  }
  returnEarlyReassessment() {
    if (this.reportInjuryModal.get('comments').valid) {
      super.confirmReturn();
    } else {
      markFormGroupTouched(this.reportInjuryModal);
    }
  }
  getLang() {
    this.language.subscribe(language => {
      this.lang = language;
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
    this.disabilityAssessmentService.assessmentTypes = data?.assessmentType;
    this.disabilityAssessmentService.benefitReqId = data?.benefitReqId;
    this.disabilityAssessmentService.referenceNo = data?.referenceNo;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  requestReports() {
    this.getNinIqamaGccId();
    const payload = JSON.parse(this.routerData.payload);
    this.referenceNo = payload?.referenceNo;
    const newReportDetails = {
      resourceType: this.routerData.resourceType,
      regNo: this.registrationNo,
      socNo: this.socialInsuranceNo,
      injId: this.injuryId,
      identityNumber: this.identifier,
      mbAssessmentRequestId: this.mbAssessmentRequestId,
      refNo: this.referenceNo
    };
    this.injuryService.setMedicalReportDetails(newReportDetails);
    this.router.navigate([RouteConstants.ROUTE_NEW_MEDICAL_REPORTS]);
  }
  getDocument(identifier,disbAssessmentId) {
    this.coreMedicalAssessmentService.getMedicalBoardDocuments(identifier, disbAssessmentId).subscribe(documents => {
      this.documents = documents?.filter(item => item.documentContent !== null);
    });
  }
}
