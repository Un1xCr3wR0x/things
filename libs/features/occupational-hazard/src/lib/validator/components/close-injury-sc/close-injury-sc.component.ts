/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, TemplateRef, Output, EventEmitter, HostListener } from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';
import {
  RouterDataToken,
  RouterData,
  Role,
  AlertService,
  DocumentService,
  ApplicationTypeToken,
  RouterConstants,
  BilingualText,
  WorkflowService,
  WorkFlowActions,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  DropdownValues,
  AuthTokenService,
  SpecialtyList,
  MedicalboardAssessmentService,
  DisabilityData,
  AssessmentData,
  AssessmentMBOHEnum,
  CoreAdjustmentService,
  CoreBenefitService,
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
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  InjuryStatus,
  OhConstants,
  Route,
  RouteConstants,
  setWorkFlowDataForInspection,
  setWorkFlowDataForTpa
} from '../../../shared';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { AssessmentConstants, DisabilityAssessmentService } from '@gosi-ui/features/medical-board';

@Component({
  selector: 'oh-close-injury-sc',
  templateUrl: './close-injury-sc.component.html',
  styleUrls: ['./close-injury-sc.component.scss']
})
export class CloseInjuryScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local variables
   */
  canEdit = false;
  isClosed = false;
  statusAlertKey = '';
  injuryClosingStatus: BilingualText;
  updateStatus: BilingualText;
  previousStatus: BilingualText;
  closeInjuryAlert = 'OCCUPATIONAL-HAZARD';
  closingAlert = '';
  isStatusChanged = false;
  maxLengthComments = 300;
  injuryComplicationNo: number;
  headingApprove: string;
  /**
   * lov s and Form control
   */
  parentForm: FormGroup = new FormGroup({});
  disabilityForm: FormGroup = new FormGroup({});
  specialtyList: LovList;
  bodyPartsCategoryList: LovList;
  visitingReasonList$: Observable<LovList>;
  selected: { bodyParts: DropdownValues[] }[] = [];
  complicationInjuryId: number;
  mbAssessmentRequestId: number;
  socialInsuranceNo: number;
  injuryComplicationID: number;
  isReturn = false;
  assessmentDetails: AssessmentData;
  assessmentRequestId: number;
  assessmentTypeEnum = AssessmentMBOHEnum;
  previousDisabilityDetails: DisabilityData;
  role: string;
  personIdentifier: number;

  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();
  specialtyArray: SpecialtyList[];

  /**
   *Creating  instance
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
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
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

  /**
   * This method is to initialise tasks
   */
  ngOnInit(): void {
    const payload = JSON.parse(this.routerData.payload);
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.parsedPayload = JSON.parse(this.routerData.payload);
    this.identifier = this.parsedPayload?.contributorIdentifier || this.parsedPayload?.identifier;
    this.registrationNo = payload.registrationNo;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.injuryId = payload.id === 'NULL' ? payload.injuryId : parseInt(payload.id);
    this.mbAssessmentRequestId = payload.assessmentRequestId;
    this.role = payload?.roleId;
    this.personIdentifier = payload?.identifier || this.routerData?.idParams?.get('id');
    this.comment = this.routerData.comments;
    this.transactionNumber = this.parsedPayload.referenceNo;
    this.canApprove = true; // as part of oh button they have made a check we have used as true for every scenarios
    if (this.routerData.state === WorkFlowActions.RETURN) {
      this.isReturn = true;
    }
    this.getMbAssessmentDetails();
    this.initializeMbFormdetails(); // initialize these foems for medical board
    /** this.mbAssessmentRequestId = payload.assessmentRequestId;
    if (this.mbAssessmentRequestId) {
      this.getDisabiltyAssessmentDetails(this.mbAssessmentRequestId);
    }
    if (this.routerData.state === WorkFlowActions.RETURN) {
      this.isReturn = true;
      // this.mbAssessmentRequestId = payload.assessmentRequestId;
      // this.getDisabiltyAssessmentDetails(this.mbAssessmentRequestId);
      setTimeout(() => {
        this.documentFetch(this.injuryId, this.disabilityDetails?.referenceNo);
      }, 0);
    } */
    this.getSpecialityList();
    this.getContributorDocumentList(); // request clarification from contributor doc list
    //not for medical board
    const medicalBoardResource = [
      'Close Injury TPA',
      'Occupational Disability Assessment',
      'MB Benefit Assessment',
      'Occupational Disability Reassessment',
      'Non-Occupational Disability Reassessment',
      'Heir Disability Reassessment',
      'Non-Occupational Dependent Disability Reassessment'
    ];
    if (medicalBoardResource.findIndex(data => data === this.routerData.resourceType) === -1) {
      if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
        this.intialiseTheView(this.ohService.getRouterData());
      } else {
        this.intialiseTheView(this.routerData);
      }
    }
    // this.injuryApiOhMb();
    /** this.reportInjuryModal = this.createInjuryModalForm();
    this.reportInjuryForm = this.createInjuryDetailsForm();
    if (this.routerData.taskId !== null && this.routerData.taskId !== undefined) {
      this.intialiseTheView(this.routerData);*/

    this.reportInjuryModal = this.createInjuryModalForm();
    this.reportInjuryForm = this.createInjuryDetailsForm();
    if (
      this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_INJURY ||
      this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT ||
      this.isReturn
    ) {
      if (this.routerData.assignedRole === Role.OH_DOCTOR || this.routerData.assignedRole === Role.GOSI_DOCTOR_CAPS) {
        this.reportInjuryModal.get('comments').clearValidators();
        this.canEdit = true;
      }
    }
    /** this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_INJURY ? (this.injuryAssessment = true) : null;
    this.routerData.resourceType === 'Occupational Disability Assessment' && this.isReturn 
      ? (this.returnedInjuryAssessment = true)
      : null; */
    this.getNinIqamaGccId();
    this.visitingReasonList$ = this.lookupService.getMBVisitingDoctorReasonsList();
    this.getDisabilityLovs();
    this.getPreviousDisability();
    /** if (this.socialInsuranceNo && this.injuryId && this.nonOccDisabilityReassessment !== true) {
      this.getPreviousDisability();
    }
    if (
      this.heirDisabilityAssessment ||
      this.showNonOCCDisability ||
      this.nonOccDisabilityReassessment ||
      this.heirDisabilityReassessment
    ) {
      this.mbAssessmentRequestId = payload.assessmentRequestId;
      this.getDisabiltyAssessmentDetails(this.mbAssessmentRequestId);
    }
    this.forOCCInjuryTransaction(payload);
    if (
      this.routerData.resourceType === 'Close Injury TPA' &&
      this.injuryId &&
      this.transactionNumber &&
      !this.isReturn
    ) {
      this.documentFetch(this.injuryId, this.transactionNumber);
    } */
  }
  /** forOCCInjuryTransaction(payload?) {
    if (payload?.id === 'NULL') {
      this.injuryId = payload.injuryId;
    }
    if (
      !isNaN(Number(this.registrationNo)) &&
      this.registrationNo !== 0 &&
      !isNaN(this.socialInsuranceNo) &&
      this.socialInsuranceNo !== 0 &&
      !isNaN(this.injuryId) &&
      this.injuryId !== 0
    ) {
      const isChangeRequired = false;
      this.injuryService
        .getInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, isChangeRequired)
        .subscribe(response => {
          this.injuryDetailsWrapper = response;
          this.injuryComplicationNo = this.injuryDetailsWrapper.injuryDetailsDto.injuryNo;
          this.isClosed = this.ohService.getIsClosed();

          if (this.isClosed ) {
            this.injuryClosingStatus = this.ohService.getClosingstatus();
            this.updateStatus = this.injuryClosingStatus;
          } else {
            if (this.injuryDetailsWrapper.injuryDetailsDto) {
              this.injuryClosingStatus = this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus;
              this.previousStatus = this.injuryClosingStatus;
            }
          }
          //To show disability details only if <cured with disabiity>
          if (this.injuryClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY) {
            this.isWithDisability = true;
          } else this.isWithDisability = false;
          this.previousStatus = this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus;
          if (this.isClosed ) {
            if (this.updateStatus.english !== this.previousStatus.english) {
              this.isStatusChanged = true;
            }
            this.statusAlertKey = this.closeInjuryAlert + '.INJURY-STATUS-INFO';
          }
        });
    }
    if (
      // this.isWithDisability ||
      // !this.isWithDisability ||
      this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT
    ) {
      if (this.socialInsuranceNo && this.injuryId !== null && this.nonOccDisabilityReassessment === false) {
        if (!isNaN(Number(this.injuryId))) {
          this.getComplication(); // for occ assessment transaction
        }
      }
    }
    if (!isNaN(Number(this.registrationNo)) && this.registrationNo !== 0) {
      this.ohService.setRegistrationNo(this.registrationNo);
      this.getEstablishment();
    }
  }
  injuryApiOhMb() {
    if (
      !isNaN(Number(this.registrationNo)) &&
      this.registrationNo !== 0 &&
      !isNaN(this.socialInsuranceNo) &&
      this.socialInsuranceNo !== 0 &&
      !isNaN(this.injuryId) &&
      this.injuryId !== 0
    ) {
      const isChangeRequired = false;
      this.injuryService
        .getInjuryDetails(
          this.registrationNo,
          this.socialInsuranceNo,
          this.injuryId,
          this.isIndividualApp,
          isChangeRequired
        )
        .subscribe(response => {
          this.injuryDetailsWrapper = response;
          this.injury = this.injuryDetailsWrapper?.injuryDetailsDto;
          this.isClosed = this.ohService.getIsClosed();
          if (this.isClosed ) {
            this.injuryClosingStatus = this.ohService.getClosingstatus();
            this.updateStatus = this.injuryClosingStatus;
          } else {
            if (this.injuryDetailsWrapper.injuryDetailsDto) {
              this.injuryClosingStatus = this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus;
              this.previousStatus = this.injuryClosingStatus;
            }
          }
          this.previousStatus = this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus;
          if (this.isClosed ) {
            if (this.updateStatus.english !== this.previousStatus.english) {
              this.isStatusChanged = true;
            }

            this.statusAlertKey = this.closeInjuryAlert + '.INJURY-STATUS-INFO';
          }
        });
    }
  } */
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
  /**
   * Navigate to modify closing injury status page
   */
  navigateToStatus() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/validator/modify-close-injury']);
  }
  /**
   *  Method to navigate to scan documents screen on edit.
   */
  navigateToScan() {
    this.routerData.tabIndicator = 3;
    this.router.navigate(['home/oh/injury/edit?activeTab=3']);
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  requestClarification() {
    this.returnAction(this.reportInjuryModal);
  }
  requestTpaClose() {
    this.returnTpa = true;
    const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforCloseInjury = setWorkFlowDataForTpa(
      this.routerData,
      workflowData,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal && this.reportInjuryModal?.valid) {
      this.confirmInspection(dataforCloseInjury, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportInjuryModal);
    }
  }
  /**
   * Method to navigate to view injury page
   */
  viewInjury() {
    this.ohService.setRoute(Route.CLOSE_INJURY);
    if (this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus) {
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
      ]);
    }
  }
  specialtyArraylist(specialtyArray: SpecialtyList[]) {
    this.specialtyArray = specialtyArray;
  }
  /**
   * Approving by the validator.
   */
  confirmApproveInjury() {
    if (
      this.showNonOCCDisability ||
      this.heirDisabilityAssessment ||
      this.nonOccDisabilityReassessment ||
      this.injuryReassessment ||
      this.heirDisabilityReassessment ||
      this.dependentDisabilityAssessment ||
      this.dependentDisabilityReAssessment
    ) {
      this.getFormValues();
    } else {
      this.ohService.setClosingstatus(this.injuryClosingStatus);
      this.injuryClosingStatus = this.ohService.getClosingstatus();
      if (this.injuryClosingStatus.english === InjuryStatus.CURED_WITH_DISABILITY) {
        this.disabilityDetailsDto.vdDetails = this.parentForm.get('visitingDoctorFormValue').value; // from oh-visiting-doctor-dc
        if (this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'No') {
          this.disabilityDetailsDto.vdDetails;
        }
        if (this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'Yes') {
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
        this.disabilityDetailsDto.specialtyList = this.specialtyArray;
        this.disabilityDetailsDto.transactionTraceId = this.transactionNumber.toString(); //for transacation number
        //change yes or no to true or false  for participant required
        // const isParticipantAttendanceRequired: boolean =
        //   this.parentForm.get('disabilityAttendenceForm').value.isParticipantAttendanceRequired.english === 'Yes';
        // this.disabilityDetailsDto.isParticipantAttendanceRequired = isParticipantAttendanceRequired ? true : false;
        /**
         * Story 359128 isParticipantAttendanceRequired boolean changed to string added virtual
         */
        this.disabilityDetailsDto.isParticipantAttendanceRequired = (
          this.parentForm.get('disabilityAttendenceForm') as FormGroup
        ).value.isParticipantAttendanceRequired.english;
        //change yes or no to true or false for visiting doctor need
        const visitingDoctor: boolean =
          this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'Yes';
        this.disabilityDetailsDto.isVdRequired = visitingDoctor ? true : false;
        delete this.disabilityDetailsDto?.vdDetails?.visitingDoctor;
        if (this.isReturn) {
          this.disabilityDetailsDto.bodyPartsList = this.disabilityDetails?.bodyPartsList; // TODO bdyparts return trans is empty
          this.forReturnFlowApi(this.mbAssessmentRequestId, this.disabilityDetailsDto);
        } else this.disabilityFormDetails();
      }
    }
    // BPM MB api to call if status is cured without andtransaction to be moved to MB
    if (
      this.injuryClosingStatus?.english === InjuryStatus.CURED_WITHOUT_DISABILITY &&
      this.routerData.resourceType === 'Occupational Disability Assessment'
    ) {
      this.isCuredWithoutDisabMB();
    }
    if (
      this.injuryClosingStatus?.english === InjuryStatus.CURED_WITHOUT_DISABILITY &&
      this.routerData.resourceType !== 'Occupational Disability Assessment'
    ) {
      const action = WorkFlowActions.SUBMIT;
      this.reportInjuryForm.get('status').setValue('SUBMIT');
      this.updateConfirmation(action);
    }
  }
  getDisabilityFormValue() {
    return (this.parentForm.get('bodyPartsList') as FormArray).value;
  }
  getVisitingDoctorFormValue() {
    return (this.parentForm.get('visitingDoctorFormValue.visitingDoctorSpecialty.english') as FormGroup).value;
  }
  getFormValues() {
    this.disabilityDetailsDto.vdDetails = this.parentForm.get('visitingDoctorFormValue').value; // from oh-visiting-doctor-dc
    if (this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'No') {
      this.disabilityDetailsDto.vdDetails;
    }
    if (this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'Yes') {
      this.disabilityDetailsDto.vdDetails.vdSpecialties = this.getVisitingDoctorFormValue().map(speciality => {
        const specialityIndex = this.specialtyList.items.map(item => item?.value?.english).indexOf(speciality?.english);
        return {
          english: speciality?.english,
          // arabic: this.specialtyList.items[specialityIndex]?.items[speciality?.sequence - 1]?.value?.arabic
          arabic: speciality?.arabic
        };
      }); // from oh-visiting-doctor-dc
      delete this.disabilityDetailsDto.vdDetails.visitingDoctorSpecialty;
    }
    this.disabilityDetailsDto.specialtyList = this.specialtyArray;
    this.disabilityDetailsDto.transactionTraceId = this.transactionNumber.toString();
    // const isParticipantAttendanceRequired: boolean =
    // this.parentForm.get('disabilityAttendenceForm').value.isParticipantAttendanceRequired.english === 'Yes';
    // this.disabilityDetailsDto.isParticipantAttendanceRequired = isParticipantAttendanceRequired ? true : false;
    /**
     * Story 359128 isParticipantAttendanceRequired boolean changed to string added virtual
     */
    this.disabilityDetailsDto.isParticipantAttendanceRequired = (
      this.parentForm.get('disabilityAttendenceForm') as FormGroup
    ).value.isParticipantAttendanceRequired.english;
    //change yes or no to true or false for visiting doctor need
    const visitingDoctor: boolean =
      this.parentForm.get('visitingDoctorFormValue').value?.visitingDoctor?.english === 'Yes';
    this.disabilityDetailsDto.isVdRequired = visitingDoctor ? true : false;
    delete this.disabilityDetailsDto?.vdDetails?.visitingDoctor;
    if (this.injuryReassessment) {
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
    }
    this.forReturnFlowApi(this.mbAssessmentRequestId, this.disabilityDetailsDto);
  }
  //If cured with Disability put Api
  disabilityFormDetails() {
    // for close injury request by TPA
    this.disabilityDetailsDto.comments = this.reportInjuryModal.get('comments').value; // bpm api value
    this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.OCC_DIS;
    if (
      this.disabilityDetailsDto &&
      this.disabilityDetailsDto.bodyPartsList &&
      this.disabilityDetailsDto.bodyPartsList.length > 0
    ) {
      this.injuryService
        .putDisabilityDetails(this.disabilityDetailsDto, this.injuryId, this.registrationNo, this.socialInsuranceNo)
        .subscribe(
          response => {
            const value = response;
            if (value) {
              this.confirmApprove();
              this.navigateToInbox();
              this.alertService.showSuccess(value, null, 10);
            }
          },
          err => {
            this.showErrorMessageAPI(err, this.alertService);
            this.hideModal();
          }
        );
    }
  }

  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveCloseTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.getApproveHeading();
    if (
      this.isWithDisability === false ||
      this.injuryClosingStatus?.english === InjuryStatus.CURED_WITHOUT_DISABILITY
    ) {
      this.showModal(templateRef);
    } else if (this.isWithDisability && this.hasDuplicateBodyParts()) {
      this.alertService.showError(this.duplicateBodyPart); // for duplicate Body Parts
    } else if (this.injuryReassessment && this.disabilityDetailsDto.bodyPartsList.length === 0) {
      this.alertService.showError(this.nullCategory); // for nulll Body Parts //this.disabilityDetailsDto.bodyPartsList
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
      this.injuryClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY ||
      this.isWithDisability ||
      this.showNonOCCDisability ||
      this.heirDisabilityAssessment ||
      this.nonOccDisabilityReassessment ||
      this.heirDisabilityReassessment ||
      this.dependentDisabilityAssessment ||
      this.dependentDisabilityReAssessment
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

  /**
   * To get SpecialtyList LOV
   */
  getSpecialityList() {
    this.lookupService.getSpecialityList().subscribe(res => {
      if (res) this.specialtyList = res;
    });
  }

  navigateToDashboard() {
    if (this.registrationNo) this.router.navigate([`home/establishment/profile/${this.registrationNo}/view`]);
    else {
      this.router.navigate(['home/establishment/profile']);
    }
  }
  onSelectedParts(selected) {
    this.selected = selected;
  }
  /** getDisabiltyAssessmentDetails(mbAssessmentRequestId) {
    this.medicaAssessmentService.getDisabilityDetails(this.personIdentifier, mbAssessmentRequestId).subscribe(
      res => {
        this.disabilityDetails = res;
        this.specialtyArray = this.disabilityDetails.specialtyList;
        if (this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT) {
          this.disabilityDetails.ohType === 0 ? (this.injuryReassessment = true) : null;
        }
        if (this.injuryReassessment ) {
          this.forOCCReassessmentApi();
          this.forOCCInjuryTransaction();
        }
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  } */
  forReturnFlowApi(mbAssessmentRequestId, disabilityDetailsDto) {
    const payload = JSON.parse(this.routerData.payload);
    (this.isReturn && this.role === 'Work Injuries and Occupational Diseases Doctor') ||
    payload?.resourceType === 'Close Injury TPA' ||
    payload?.resourceType === 'Close Complication TPA'
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.OCC_DIS) //for occupational disability
      : this.heirDisabilityAssessment
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.HEIR_DISABILITY_ASSSESSMENT)
      : this.dependentDisabilityAssessment
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.DEPENDANT_DISABILITY_ASSESSMENT)
      : this.dependentDisabilityReAssessment
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.DEPENDANT_DISABILITY_REASSESSMENT)
      : this.nonOccDisabilityReassessment
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.NON_OCC_DISABILITY_REASSESSMENT)
      : this.injuryReassessment
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.OCC_DISABILITY_REASSESSMENT)
      : this.heirDisabilityReassessment
      ? (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.HEIR_DISABILITY_REASSSESSMENT)
      : (this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.NON_OCC_DIS);
    this.disabilityDetailsDto.description = this.description;
    if (this.disabilityDetailsDto) {
      this.injuryService
        .putParamTransactionDetails(this.personIdentifier, disabilityDetailsDto, mbAssessmentRequestId, this.isReturn,null, this.transactionNumber)
        .subscribe(
          response => {
            const value = response;
            if (value && value.mbAssessmentRequestId) {
              const visitingDoctorRequired = this.disabilityDetailsDto.isVdRequired;
              // this.nonOccDisabilityReassessment ? payload : null;
              this.nonOCCAssessmentAndReassessment =
                this.showNonOCCDisability ||
                this.heirDisabilityAssessment ||
                this.nonOccDisabilityReassessment ||
                this.injuryReassessment ||
                this.heirDisabilityReassessment ||
                this.dependentDisabilityAssessment ||
                this.dependentDisabilityReAssessment;
              this.confirmBPMApprove(visitingDoctorRequired, this.nonOCCAssessmentAndReassessment, payload);
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
  getPreviousDisability() {
    this.medicaAssessmentService.getPreviousDisability(this.personIdentifier).subscribe(res => {
      this.previousDisabilityDetails = res;
      if (res?.data) {
        this.assessmentDetails = res.data.filter(result => result.assessmentId === this.assessmentRequestId)[0];
      }
    });
  }
  previousAssessmentDetails(data: AssessmentData) {
    this.medicaAssessmentService.setIsFromOh(true);
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.socialNumber = this.socialInsuranceNo;
    this.coreBenefitService.injuryId = this.injuryId || this.benefitRequestId;
    this.coreBenefitService.regNo = this.registrationNo;
    this.disabilityAssessmentService.disabilityAssessmentId = data.assessmentId;
    this.disabilityAssessmentService.disabilityType = data.disabilityType;
    this.disabilityAssessmentService.contractDoctor = false;
    this.disabilityAssessmentService.assessmentTypes = data?.assessmentType;
    this.disabilityAssessmentService.benefitReqId = data?.benefitReqId;
    this.disabilityAssessmentService.referenceNo = data?.referenceNo;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  getApproveHeading() {
    if (this.heirDisabilityAssessment) {
      this.headingApprove = 'OCCUPATIONAL-HAZARD.HEIR-ASSESSMENT-APPROVE';
    } else if (this.dependentDisabilityAssessment) {
      this.headingApprove = 'OCCUPATIONAL-HAZARD.DEPENDENT-ASSESSMENT-APPROVE';
    } else if (this.showNonOCCDisability) {
      this.headingApprove = 'OCCUPATIONAL-HAZARD.CONTRIBUTOR-ASSESSMENT-APPROVE';
    } else if (this.dependentDisabilityReAssessment) {
      this.headingApprove = 'OCCUPATIONAL-HAZARD.DEPENDENT-REASSESSMENT-APPROVE';
    } else if (this.nonOccDisabilityReassessment) {
      this.headingApprove = 'OCCUPATIONAL-HAZARD.CONTRIBUTOR-REASSESSMENT-APPROVE';
    } else if (this.heirDisabilityReassessment) {
      this.headingApprove = 'OCCUPATIONAL-HAZARD.HEIR-REASSESSMENT-APPROVE';
    } else {
      this.headingApprove = 'OCCUPATIONAL-HAZARD.CLS-APPROVE';
    }
  }
  getMbAssessmentDetails() {
    if (this.mbAssessmentRequestId) this.getDisabiltyAssessmentDetails(this.mbAssessmentRequestId);
    else if (this.routerData.resourceType === WorkFlowActions.CLOSE_INJURY_TPA) {
      this.getInjuryDetails(true);
      if (!isNaN(Number(this.registrationNo))) {
        this.ohService.setRegistrationNo(this.registrationNo);
        this.getEstablishment();
      }
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.getContributor(); // get Contributor details
      this.getDisability();
      this.documentFetch(this.injuryId, this.transactionNumber);
    }
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
        this.specialtyArray = this.disabilityDetails.specialtyList;
        if (this.disabilityDetails.ohType === 0) {
          this.routerData.resourceType !== 'Occupational Disability Assessment'
            ? (this.injuryReassessment = true)
            : (this.injuryReassessment = false);
          this.injuryId = this.disabilityDetails?.injuryId;
        }
        const disabilityType = this.disabilityDetails.disabilityType.english;
        this.getDisabilityAssessmentRoute(disabilityType, this.disabilityDetails?.assessmentId); // for assessment transactions
        this.getDisabilityReassessmentRoute(disabilityType,this.disabilityDetails?.assessmentId); // for reassessment transactions
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  isNonOccAssessment() {
    switch (this.routerData?.resourceType) {
      case 'MB Benefit Assessment':
        return true;
      default:
        return false;
    }
  }
}
