import { Component, OnInit, Output, EventEmitter, Inject, TemplateRef, HostListener, OnDestroy } from '@angular/core';
import {
  BilingualText,
  AlertService,
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  DocumentService,
  Role,
  RouterConstants,
  LanguageToken,
  WorkflowService,
  WorkFlowActions,
  LovList,
  LookupService,
  markFormGroupTouched,
  AuthTokenService,
  DisabilityData,
  DisabilityDetails,
  AssessmentMBOHEnum,
  MedicalboardAssessmentService,
  SpecialtyList,
  InjuryHistoryResponse,
  InjuryHistory,
  CoreAdjustmentService,
  CoreBenefitService,
  AssessmentData,
  MedicalAssessmentService
} from '@gosi-ui/core';
import {
  OhService,
  InjuryService,
  EstablishmentService,
  ComplicationService,
  ContributorService,
  Route,
  setWorkFlowDataForInspection,
  setWorkFlowDataForTpa,
  DiseaseService,
  InjuryStatus,
  RouteConstants
} from '../../../shared';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { OhConstants } from '../../../shared';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { Location, PlatformLocation } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssessmentConstants, DisabilityAssessmentService } from '@gosi-ui/features/medical-board';

@Component({
  selector: 'oh-close-complication-sc',
  templateUrl: './close-complication-sc.component.html',
  styleUrls: ['./close-complication-sc.component.scss']
})
export class CloseComplicationScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /**
   * Local variables
   */

  canEdit = false;
  isClosed = false;
  statusAlertKey = '';
  complicationClosingStatus: BilingualText;
  updateStatus: BilingualText;
  previousStatus: BilingualText;
  closeComplicationAlert = 'OCCUPATIONAL-HAZARD';
  closingAlert = '';
  isStatusChanged = false;
  maxLengthComments = 300;
  previousComplicationStatus: BilingualText;
  updateComplicationStatus: BilingualText;
  isWithDisability: boolean;
  bodyPartsCategoryList: LovList;
  parentForm: FormGroup = new FormGroup({});
  specialtyList: LovList;
  specialtyArray: SpecialtyList[];
  isReturn: boolean = false;
  assessmentRequestId: number;
  mbAssessmentRequestId: number;
  visitingReasonList$: Observable<LovList>;
  InjuryHistoryResponse: InjuryHistoryResponse;
  injuryHistoryList: InjuryHistory[];
  injuryComplicationID: number;
  isComplication: boolean;
  assessmentTypeEnum = AssessmentMBOHEnum;
  role: string;
  previousDisabilityDetails: DisabilityData;
  complicationAssessment: boolean;
  returnedComplicationAssessment: boolean;
  heading: string;

  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();

  /**
   *Creating  instance
   * @param ohService
   * @param injuryService
   * @param establishmentService
   * @param fb
   * @param routerData
   * @param manageInjuryService
   * @param router
   * @param documentService
   * @param modalService
   * @param validatorRoutingService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly contributorService: ContributorService,
    readonly workflowService: WorkflowService,
    readonly fb: FormBuilder,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly lookupService: LookupService,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    readonly authTokenService: AuthTokenService,
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
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.parsedPayload = JSON.parse(this.routerData.payload);
    this.mbAssessmentRequestId = this.parsedPayload.assessmentRequestId;
    this.socialInsuranceNo = this.parsedPayload.socialInsuranceNo;
    this.registrationNo = this.parsedPayload?.registrationNo;
    this.identifier = this.parsedPayload?.identifier
      ? this.parsedPayload.identifier
      : this.parsedPayload?.contributorIdentifier;
    this.comment = this.routerData.comments;
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.reportInjuryModal = this.createInjuryModalForm();
    /** if (this.ohService.getClosingstatus()?.english) {
      this.complicationClosingStatus = this.ohService.getClosingstatus(); */
    if (this.ohService?.getClosingstatus()?.english === InjuryStatus.CURED_WITH_DISABILITY) {
      this.isWithDisability = true;
      this.specialtyArray = this.ohService?.specialtyArray;
    }
    // }
    this.getSpeciality();
    this.initializeMbFormdetails(); // initialize these foems for medical board
    /**
     * No need to use Base Files for Medical Board Transactions
     */
    const medicalBoardResource = [
      'Close Complication TPA',
      'Occupational Disability Assessment',
      'Occupational Disability Reassessment'
    ];
    if (medicalBoardResource.findIndex(data => data === this.routerData.resourceType) == -1) {
      if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
        this.intialiseTheView(this.ohService.getRouterData());
      }
      if (this.routerData.taskId !== null && this.routerData.taskId !== null) {
        this.intialiseTheView(this.routerData);
      }
    }
    /** if (
      this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_COMPLICATION ||
      this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT ||
      this.isReturn 
    ) { */
    if (this.routerData.assignedRole === Role.OH_DOCTOR || this.routerData.assignedRole === Role.GOSI_DOCTOR_CAPS) {
      this.reportInjuryModal.get('comments').clearValidators();
      this.canEdit = true;
    }
    // this.isComplication = true;
    // }
    this.personIdentifier = this.routerData?.idParams?.get('identifier');
    /** if (this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_COMPLICATION) {
      this.complicationAssessment = true;
    }
    : null;
    this.routerData.resourceType === 'Occupational Disability Assessment' && this.isReturn 
      ? (this.returnedComplicationAssessment = true)
       : null; */
    if (this.routerData.payload !== null && this.routerData.payload !== undefined) {
      const isChangeRequired = false;
      const payload = JSON.parse(this.routerData.payload);
      this.registrationNo = payload.registrationNo;
      this.socialInsuranceNo = payload.socialInsuranceNo;
      this.transactionNumber = this.parsedPayload.referenceNo; // get transaction number from payload
      this.complicationId = payload.id;
      this.injuryId = payload.injuryId;
      this.role = payload?.roleId;
      this.visitingReasonList$ = this.lookupService.getMBVisitingDoctorReasonsList();

      /** if (this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT) {
        this.mbAssessmentRequestId = payload.assessmentRequestId;
        this.documentFetch(this.mbAssessmentRequestId, this.transactionNumber);
        this.mbAssessmentRequestId
          ? this.getcomplicationReassessmentDetails(this.mbAssessmentRequestId)
          : (this.disabilityDetails = new DisabilityDetails());
        // this.getComplicationDetails(); // get complicationd detals with gviven injn and comp id
        // this.getCompDetails();
       } */
      if (this.routerData.state === WorkFlowActions.RETURN) {
        this.isReturn = true;
      }
      /** if (
        this.isReturn ||
        (this.routerData.resourceType !== WorkFlowActions.OCC_DISABILITY_REASSESSMENT &&
          this.routerData.resourceType !== WorkFlowActions.CLOSE_COMPLICATION_TPA)
      ) {
        this.documentFetch(this.complicationId, this.transactionNumber);
       }*/
      if (this.routerData.resourceType === WorkFlowActions.CLOSE_COMPLICATION_TPA) {
        this.documentFetch(this.complicationId, null);
      }
      /** if (
        this.routerData.state === WorkFlowActions.RETURN ||
        this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT
      ) {
        this.mbAssessmentRequestId = payload.assessmentRequestId;
        this.mbAssessmentRequestId
          ? this.getcomplicationReassessmentDetails(this.mbAssessmentRequestId)
          : (this.disabilityDetails = new DisabilityDetails());
      }
      if (this.routerData.resourceType !== WorkFlowActions.OCC_DISABILITY_REASSESSMENT) {
        this.getComplicationDetails();
      }
       if ((this.registrationNo && this.socialInsuranceNo && this.injuryId) || this.isReturn ) { */
      this.getSpeciality();
      this.getDisabilityLovs();
      if (this.mbAssessmentRequestId) {
        this.canApprove = true; // for mb transaction approve button should show
        this.getDisabiltyAssessmentDetails(this.mbAssessmentRequestId);
      } else {
        this.canApprove = true; // for mb transaction approve button should show
        this.disabilityDetails = new DisabilityDetails();
        // this.getCompDetail();
        this.getCompDetails();
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setRegistrationNo(this.registrationNo);
        this.getContributor();
        if (!isNaN(Number(this.registrationNo))) {
          this.ohService.setRegistrationNo(this.registrationNo);
          this.getEstablishment();
        }
      }
      // }
    }
    this.visitingReasonList$ = this.lookupService.getMBVisitingDoctorReasonsList();
    this.getContributorDocumentList(); // request clarification from contributor doc list
    this.getSpeciality();
    this.getDisabilityLovs();
    this.getPreviousDisability();
    this.setHeading();
  }
  getDisabiltyAssessmentDetails(mbAssessmentRequestId) {
    this.medicaAssessmentService.getDisabilityDetails(this.identifier, mbAssessmentRequestId).subscribe(
      res => {
        this.disabilityDetails = res;
        this.socialInsuranceNo = !isNaN(Number(this.socialInsuranceNo))
          ? this.socialInsuranceNo
          : this.disabilityDetails.socialInsuranceNo;
        this.registrationNo = !isNaN(Number(this.registrationNo))
          ? this.registrationNo
          : this.disabilityDetails.registrationNumber;
        if (
          this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT &&
          this.disabilityDetails.ohType === 2
        ) {
          this.complicationReassessment = true;
          this.documentFetch(this.mbAssessmentRequestId, this.transactionNumber, true);
        }
        this.getEstablishment();
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setRegistrationNo(this.registrationNo);
        this.getContributor();
        this.specialtyArray = this.disabilityDetails?.specialtyList;
        if (this.disabilityDetails?.ohType === 2) {
          this.injuryId = this.disabilityDetails?.injuryNumber; // for getting complication injurydetails
          this.complicationId = this.disabilityDetails?.injuryId;
          this.getCompDetails();
          this.getComplication();
        }
        if (this.routerData.resourceType === 'Occupational Disability Assessment') {
          this.documentFetch(null, this.disabilityDetails?.referenceNo);
        }
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
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
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
  /**
   * Navigate to modify closing injury status page
   */
  navigateToStatus() {
    // this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/validator/modify-close-complication']);
  }
  /**
   *  Method to navigate to scan documents screen on edit.
   */
  navigateToScan() {
    this.routerData.tabIndicator = 3;
    this.router.navigate(['home/oh/injury/edit?activeTab=3']);
  }
  /**
   * Method to navigate to view injury page
   */
  viewInjury(injurId: number) {
    this.ohService.setRoute(Route.CLOSE_COMP);
    this.router.navigate([`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${injurId}/injury/info`]);
  }
  specialtyArraylist(specialtyArray: SpecialtyList[]) {
    this.specialtyArray = specialtyArray;
    this.ohService.specialtyArray = this.specialtyArray;
  }

  /**
   * Approving by the validator.
   */
  confirmApproveComplication() {
    this.ohService.setClosingstatus(this.complicationClosingStatus);
    if (this.complicationClosingStatus.english === InjuryStatus.CURED_WITH_DISABILITY) {
      this.disabilityDetailsDto.vdDetails = this.parentForm.get('visitingDoctorFormValue').value; // from oh-visiting-doctor-dc
      if (this.parentForm.get('visitingDoctorFormValue').value.visitingDoctor.english === 'No') {
        this.disabilityDetailsDto.vdDetails;
      }
      if (this.parentForm.get('visitingDoctorFormValue').value.visitingDoctor.english === 'Yes') {
        this.disabilityDetailsDto.vdDetails.vdSpecialties = this.getVisitingDoctorFormValue().map(speciality => {
          const specialityIndex = this.specialtyList.items
            .map(item => item?.value?.english)
            .indexOf(speciality?.english);
          return {
            english: speciality?.english,
            arabic: speciality?.arabic
          };
        }); // from oh-visiting-doctor-dc
        delete this.disabilityDetailsDto.vdDetails.visitingDoctorSpecialty;
      }
      //TO remove visitingDoctorSpecialty
      this.disabilityDetailsDto.bodyPartsList = this.getDisabilityFormValue();
      //to get bodyParts value and arabic and english name for bodyparts
      this.disabilityDetailsDto.bodyPartsList.forEach((val, i) => {
        const bodyParts = val?.bodyParts?.english;
        const bpIndex = this.disabilityDetailsDto?.bodyPartsList[i]?.bodyPartsIndex;
        const nestedArray = bodyParts?.map(bP => {
          return {
            english: bP?.english,
            arabic: this.bodyPartsCategoryList?.items[bpIndex]?.items[bP?.sequence - 1]?.value.arabic
          };
        });
        delete this.disabilityDetailsDto.bodyPartsList[i].bodyPartsIndex; //to remove index to payload
        this.disabilityDetailsDto.bodyPartsList[i].bodyParts = nestedArray;
        this.disabilityDetailsDto.bodyPartsList[i].category = val?.category;
      });
      // //toDo for subspecialty Array
      this.disabilityDetailsDto.specialtyList = this.specialtyArray; // from oh-disability-assessment-details-dc
      this.disabilityDetailsDto.transactionTraceId = this.transactionNumber.toString(); //for transacation number
      //change yes or no to true or false  for participant required
      // const isParticipantAttendanceRequired: boolean =
      //   (this.parentForm.get('disabilityAttendenceForm') as FormGroup).value.isParticipantAttendanceRequired.english ===
      //   'Yes';
      // this.disabilityDetailsDto.isParticipantAttendanceRequired = isParticipantAttendanceRequired ? true : false;
      /**
       * Story 359128 isParticipantAttendanceRequired boolean changed to string added virtual
       */
      this.disabilityDetailsDto.isParticipantAttendanceRequired = (
        this.parentForm.get('disabilityAttendenceForm') as FormGroup
      ).value.isParticipantAttendanceRequired.english;
      //change yes or no to true or false for visiting doctor need
      const visitingDoctor: boolean =
        this.parentForm.get('visitingDoctorFormValue').value.visitingDoctor.english === 'Yes';
      this.disabilityDetailsDto.isVdRequired = visitingDoctor ? true : false;
      delete this.disabilityDetailsDto?.vdDetails?.visitingDoctor;
      if (this.isReturn || this.complicationReassessment) {
        this.forReturnFlowApi(this.mbAssessmentRequestId, this.disabilityDetailsDto);
      } else this.disabilityFormDetails();
    }
    // BPM MB api to call if status is cured without andtransaction to be moved to MB
    if (
      this.complicationClosingStatus?.english === InjuryStatus.CURED_WITHOUT_DISABILITY &&
      this.routerData.resourceType === 'Occupational Disability Assessment'
    ) {
      this.isCuredWithoutDisabMB();
    }
    if (
      this.complicationClosingStatus.english === InjuryStatus.CURED_WITHOUT_DISABILITY &&
      this.routerData.resourceType !== 'Occupational Disability Assessment'
    ) {
      this.confirmApprove();
    }
  }
  getVisitingDoctorFormValue() {
    return (this.parentForm.get('visitingDoctorFormValue.visitingDoctorSpecialty.english') as FormGroup).value;
  }
  getDisabilityFormValue() {
    return (this.parentForm.get('bodyPartsList') as FormArray).value;
  }

  navigateToDashboard() {
    if (this.registrationNo) this.router.navigate([`home/establishment/profile/${this.registrationNo}/view`]);
    else {
      this.router.navigate(['home/establishment/profile']);
    }
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.returnTpa = true;
    this.reportInjuryModal.get('comments').setValidators(Validators.required);
    this.requestedDocumentList(this.returnTpa);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveCloseComplicationTransaction(templateRef: TemplateRef<HTMLElement>) {
    if (this.complicationClosingStatus?.english === InjuryStatus.CURED_WITHOUT_DISABILITY) {
      this.showModal(templateRef);
    } else if (
      (this.complicationClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY || this.isWithDisability) &&
      this.hasDuplicateBodyParts()
    ) {
      this.alertService.showError(this.duplicateBodyPart); // for duplicate Body Parts
    } else if (this.disabilityDetailsDto.bodyPartsList.length === 0) {
      this.alertService.showError(this.nullCategory); // for nulll Body Parts
    } else if (
      this.parentForm.value.visitingDoctorFormValue.visitingDoctorSpecialty.arabic === null &&
      (this.specialtyArray === undefined || (this.specialtyArray && this.specialtyArray.length === 0))
    ) {
      this.alertService.showError(this.specialityError); //For atleast one speciality
    } else if (
      this.specialtyArray &&
      this.specialtyArray.length > 0 &&
      this.specialtyArray.findIndex(rowValue => rowValue.isMainSpecialty) === -1
    ) {
      this.alertService.showError(this.mainSpecialtyerror); // for atleast one main speciality
    } else if (this.hasDuplicateValue(this.specialtyArray)) {
      this.alertService.showError(this.duplicateErrror); // for duplicated speciality
    } else if (
      this.complicationClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY ||
      this.isWithDisability
    ) {
      if (this.isReturn) {
        this.parentForm.removeControl('disabilitySpecialtyForm');
      }
      if (this.parentForm.invalid) {
        markFormGroupTouched(this.parentForm);
        this.alertService.showMandatoryErrorMessage();
      } else this.showModal(templateRef);
    }
    this.reportInjuryModal.get('comments').clearValidators();
  }
  /**
   * This method is used to show the cancellation template on click of cancel
   * @param changes
   */

  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  requestTpaCloseComplication() {
    const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforCloseComp = setWorkFlowDataForTpa(
      this.routerData,
      workflowData,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal && this.reportInjuryModal?.valid) {
      this.confirmInspection(dataforCloseComp, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportInjuryModal);
    }
  }

  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.reset.emit();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * To get disabled body parts
   */
  getDisabilityLovs() {
    this.lookupService.getBodyPartsList().subscribe(res => {
      this.bodyPartsCategoryList = res;
    });
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
  disabilityFormDetails() {
    // for close injury request by TPA
    this.disabilityDetailsDto.comments = this.reportInjuryModal.get('comments').value;
    if (this.disabilityDetailsDto.bodyPartsList.length > 0) {
      this.injuryService
        .putDisabilityDetails(
          this.disabilityDetailsDto,
          this.complicationWrapper.complicationDetailsDto.complicationId,
          this.registrationNo,
          this.socialInsuranceNo
        )
        .subscribe(response => {
          const value = response;
          if (value) {
            this.confirmApprove();
            this.navigateToInbox();
            this.alertService.showSuccess(value, null, 10);
          }
          err => {
            this.showErrorMessageAPI(err, this.alertService);
          };
        });
    }
  }
  getSpeciality() {
    this.lookupService.getSpecialityList().subscribe(res => {
      if (res) this.specialtyList = res;
    });
  }
  getComplicationDisabledParts() {
    this.injuryComplicationID = this.complicationWrapper.complicationDetailsDto.complicationId;
    this.injuryService
      .getDisabilityDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.injuryComplicationID,
        this.transactionNumber
      )
      .subscribe(
        response => {
          this.injuredPerson = response;
        },
        err => {
          this.showError(err);
        }
      );
  }
  forReturnFlowApi(mbAssessmentRequestId, disabilityDetailsDto) {
    const payload = JSON.parse(this.routerData.payload);
    (this.isReturn && this.role === 'Work Injuries and Occupational Diseases Doctor') ||
    payload?.resourceType === 'Close Injury TPA' ||
    payload?.resource === 'Reassessment' ||
    payload?.resourceType === 'Close Complication TPA'
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.OCC_DIS)
      : this.complicationReassessment
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.OCC_DISABILITY_REASSESSMENT)
      : null;
    if (this.isReturn) {
      this.disabilityDetailsDto.bodyPartsList = this.disabilityDetails?.bodyPartsList;
    } //To pass bodypartslist in payload for returned transaction
    if (this.disabilityDetailsDto) {
      // this.isReturn  ? this.returnAction() : this.confirmApprove();
      this.injuryService
        .putParamTransactionDetails(this.personIdentifier, disabilityDetailsDto, mbAssessmentRequestId, this.isReturn)
        .subscribe(response => {
          const value = response;
          if (value && value.mbAssessmentRequestId) {
            const visitingDoctorRequired = this.disabilityDetailsDto.isVdRequired;
            this.nonOCCAssessmentAndReassessment = this.complicationReassessment;
            this.confirmBPMApprove(visitingDoctorRequired, this.nonOCCAssessmentAndReassessment, payload);
            this.alertService.showSuccess(value.message, null, 10);
            this.navigateToInbox();
          }
          err => {
            this.showErrorMessageAPI(err, this.alertService);
          };
        });
    }
  }
  getPreviousDisability() {
    this.medicaAssessmentService.getPreviousDisability(this.personIdentifier).subscribe(res => {
      this.previousDisabilityDetails = res;
    });
  }
  ngOnDestroy(): void {
    this.ohService.visitingDoctorFormValue = null;
  }
  setHeading() {
    if (this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_COMPLICATION) {
      this.heading = 'OCCUPATIONAL-HAZARD.CLOSE-COMP-APPROVE';
    } else if (this.routerData.resourceType === OhConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT) {
      this.heading = 'OCCUPATIONAL-HAZARD.OCC-DISABILITY-REASSESSMENT-APPROVE';
    } else {
      this.heading = 'OCCUPATIONAL-HAZARD.CLS-COMP-APPROVE';
    }
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
}
