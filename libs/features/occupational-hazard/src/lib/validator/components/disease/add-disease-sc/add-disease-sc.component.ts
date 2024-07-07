import { Component, HostListener, Inject, OnInit, TemplateRef } from '@angular/core';
import {
  AlertService,
  ApplicationTypeToken,
  BPMMergeUpdateParamEnum,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService,
  markFormGroupUntouched,
  LookupService,
  BilingualText,
  markFormGroupTouched,
  AuthTokenService,
  Transaction,
  MedicalAssessmentService,
  CoreContributorService,
  DisabilityDetailsDtos,
  AssessmentMBOHEnum
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorBaseScComponent } from '../../../base/validator-sc.base-component';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ComplicationService,
  ContributorService,
  DiseaseService,
  EstablishmentHealth,
  EstablishmentService,
  HealthInspection,
  InjuryService,
  InjuryStatus,
  OhConstants,
  OhService,
  Route,
  RouteConstants,
  ValidatorConstants,
  setWorkFlowDataForInspection,
  setWorkFlowDataForTpa
} from '@gosi-ui/features/occupational-hazard/lib/shared';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlatformLocation, Location } from '@angular/common';
import { specialtyList } from '@gosi-ui/features/occupational-hazard/lib/shared/models/disabiliy-dto-list';
import {
  EstablishmentDetails,
  EstablishmentDetailsDto
} from '@gosi-ui/features/occupational-hazard/lib/shared/models/establishmentDetailsDto';
@Component({
  selector: 'oh-add-disease-sc',
  templateUrl: './add-disease-sc.component.html',
  styleUrls: ['./add-disease-sc.component.scss']
})
export class AddDiseaseScComponent extends ValidatorBaseScComponent implements OnInit {
  // Local Variables
  canEdit: boolean;
  bodyPartsCategoryList: LovList;
  parentForm: FormGroup = new FormGroup({});
  returnDiseasecomment: FormControl = new FormControl(null, { updateOn: 'blur' });
  specialtyList: LovList;
  specialtyArray: specialtyList[] = [];
  documents: DocumentItem[];
  visitingReasonList$: Observable<LovList>;
  reasonForReturnList$: Observable<LovList>;
  healthReasonList$: Observable<LovList>;
  establishmentList$: Observable<LovList> = new Observable<LovList>(null);
  mainSpecialtyerror = OhConstants.SELECT_MAIN_SPECIALTY();
  specialityError = OhConstants.MIN_SPECIALITY_ERROR_MESSAGE();
  duplicateErrror = OhConstants.DUPLICATE_SPECILAITY();

  payload: any;
  warning = 'OCCUPATIONAL-HAZARD.REJECT-TRANSACTION-INFO';
  type = 'warning';
  showConfirmReturnBtnAddDisease = false;
  showConfirmSubmitBtnAddDisease = false;
  showConfirmSubmitBtnCloseDisease = false;
  headingTextAddDisease = 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD';
  noteRequestAddDisease: boolean;
  result = [];
  maxLengthComments = 300;
  transaction: Transaction;
  healthInspectionForm: FormGroup;
  commonModalRef: BsModalRef;
  selectedEst: BilingualText[];
  specialityform: FormGroup;
  visitingDocform: FormGroup;
  newArray = [];
  healthInspectionDetails: HealthInspection;
  showMandatoryMessage: boolean = false;
  establishmentHealth: EstablishmentHealth[];
  establishmentlist: LovList = new LovList([]);
  establishmentDto: EstablishmentDetailsDto = new EstablishmentDetailsDto();
  validationUrl: string;
  showWarning: boolean = false;
  warningMessage: string;
  assessmentTypeEnum = AssessmentMBOHEnum;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public coreContributorService: CoreContributorService,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
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
    if (!this.routerData.resourceType) {
      if (this.routerData.payload) {
        const payload = JSON.parse(this.routerData.payload);
        this.routerData.resourceType = payload.resource;
      }
    }
    if (this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
    } else if (this.routerData.taskId === null) {
      this.intialiseTheView(this.ohService.getRouterData());
    }
    this.coreContributorService.selectedSIN = this.socialInsuranceNo;
    this.alertService.clearAlerts();
    this.setEditOption();
    this.getSpecialityList();
    this.healthInspectionForm = this.createHealthInspectionForm();
    this.visitingReasonList$ = this.lookupService.getMBVisitingDoctorReasonsList();
    this.reasonForReturnList$ = this.lookupService.getDiseaseReturnReasonList();
    this.healthReasonList$ = this.lookupService.getHealthInspectionReasonsList();
    if (this.gosiDoctor) {
      if (!this.diseaseId) {
        const payload = JSON.parse(this.routerData.payload);
        this.diseaseId = payload.diseaseId ? payload.diseaseId : payload.id;
      }
      this.ohService.getEstablishmentNameList(this.socialInsuranceNo, this.diseaseId).subscribe(
        res => {
          this.establishmentHealth = res;
          const establishmentlist = this.establishmentHealth.map(item => ({
            value: {
              english: item?.establishmentName?.english
                ? item?.establishmentName?.english
                : item?.establishmentName?.arabic,
              arabic: item?.establishmentName?.arabic
                ? item?.establishmentName?.arabic
                : item?.establishmentName?.english
            },
            code: item?.establishmentId,
            sequence: item?.sequenceNo
          }));
          this.establishmentlist = new LovList(establishmentlist);
        },
        err => {
          this.showError(err.error.message);
        }
      );
    }
    if (this.closeDisease) {
      this.getDisabledParts();
      this.diseaseClosingStatus = this.ohService.getClosingstatus();
      if (this.diseaseClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY) {
        this.isWithDisability = true;
      } else this.isWithDisability = false;
    }
    this.parentForm.reset();
    this.healthInspectionForm.reset();
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.parentForm.reset();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  previousMbAssesment() {}
  previousOH() {
    this.ohService.setIsFromPreviousOHHistoryPage(true);
    this.ohService.setIsFromValidatorPage(false);
    this.validationUrl = this.router.url;
    this.ohService.setValidatorPath(this.validationUrl);
    this.router.navigate([`/home/oh/injury/history/${this.ohService.getSocialInsuranceNo()}/true`]);
  }

  viewInjury() {
    this.ohService.setIsFromPreviousOHHistoryPage(false);
    this.ohService.setIsFromValidatorPage(true);
    this.ohService.setIsTransferInjuryIdClicked(true);
    this.ohService.setRoute(Route.VALIDATOR_DISEASE);
    this.validationUrl = this.router.url;
    this.ohService.setValidatorPath(this.validationUrl);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
    ]);
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    if (this.ohService.getIsFromValidatorPage() || this.ohService.getIsFromPreviousOHHistoryPage()) {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  navigateToClose() {
    this.routerData.tabIndicator = 2;
    this.router.navigate([RouteConstants.ROUTE_MODIFY_CLOSE_DISEASE]);
  }

  setRoute() {
    this.ohService.setTransactionId(this.transaction?.transactionId);
    this.ohService.setTransactionRefId(this.transaction?.transactionRefNo);
    this.ohService.setRoute(Route.TRANSACTION_TRACE);
  }

  /**
   * Setting ISD code
   */
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(ValidatorConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.contributor?.person?.contactDetail?.mobileNo?.isdCodePrimary) {
        prefix = ValidatorConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  onSelectedEst(items) {
    this.selectedEst = items;
    items.forEach(element => {
      this.inspectionDetail.forEach(item => {
        if (element.code.toString() === item.inspectionTypeInfo.registrationNumber) {
          this.showWarning = true;
          this.warningMessage = 'OCCUPATIONAL-HAZARD.INSPECTION-WARNING-EA';
        }
      });
    });
  }

  commentMandatory(event) {
    this.reportDiseaseModal.get('comments').clearValidators();

    if (this.reportDiseaseModal.get('reasonForReturn').get('english').value === 'Other') {
      this.reportDiseaseModal.get('comments').setValidators(Validators.required);
    } else {
      this.reportDiseaseModal.get('comments').clearValidators();
    }
    this.reportDiseaseModal.get('comments').markAsUntouched();
    this.reportDiseaseModal.get('comments').markAsPristine();
    this.reportDiseaseModal.get('comments').updateValueAndValidity();
  }

  /**
   *  Method to navigate to scan documents screen on edit.
   */
  navigateToScan() {
    this.routerData.tabIndicator = 3;
    this.router.navigate(['home/oh/disease/edit']);
  }
  /**
   * Navigate to injury page on validator 1 edit
   */
  navigateToDiseasePage() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/disease/edit']);
  }
  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showMandatoryMessage = false;
    if (
      this.parentForm?.value?.visitingDoctorFormValue?.visitingDoctorSpecialty?.arabic === null &&
      (this.specialtyArray === undefined || (this.specialtyArray && this.specialtyArray.length === 0))
    ) {
      this.alertService.showError(this.specialityError);
    } else if (
      this.specialtyArray &&
      this.specialtyArray.length > 0 &&
      this.specialtyArray.findIndex(rowValue => rowValue.isMainSpecialty === true) === -1
    ) {
      this.alertService.showError(this.mainSpecialtyerror); // for atleast one main speciality
    } else if (this.hasDuplicateValue(this.specialtyArray)) {
      this.alertService.showError(this.duplicateErrror); // for duplicated speciality
    } else if (this.parentForm.invalid) {
      markFormGroupTouched(this.parentForm);
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.showModal(templateRef);
    }
  }
  /**
   * To get SpecialtyList LOV
   */
  getSpecialityList() {
    this.lookupService.getSpecialityList().subscribe(res => {
      if (res) this.specialtyList = res;
    });
  }
  cancel() {
    this.modalRef.hide();
    this.healthInspectionForm.reset();
    this.reportDiseaseModal.get('comments').reset();
    this.selectedEst = [];
    this.showMandatoryMessage = false;
    this.showWarning = false;
  }
  /*
   * This method is to create Health Inspection Form
   */
  createHealthInspectionForm() {
    return this.fb.group({
      inspectionReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      establishementrequired: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      comments: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  showPreviousAssessments(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  requestTpa() {
    const workflowDatas = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforReopenDisease = setWorkFlowDataForTpa(
      this.routerData,
      workflowDatas,
      this.tpaRequestedDocs,
      this.reportDiseaseModal,
      this.transactionNumber,
      this.tpaCode
    );
    this.reportDiseaseModal.get('reasonForReturn').get('english').setValidators(null);
    this.reportDiseaseModal.get('reasonForReturn').get('english').updateValueAndValidity();

    if (this.reportDiseaseModal && this.reportDiseaseModal?.valid) {
      this.confirmInspection(dataforReopenDisease, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportDiseaseModal);
    }
  }
  requestContributor() {}

  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, templateNameAddDisease = '') {
    if (templateNameAddDisease === 'showReturnAddDisease') {
      this.headingTextAddDisease = 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD';
      this.noteRequestAddDisease = true;
      this.requestedDocumentList(false);
      this.showConfirmSubmitBtnAddDisease = false;
      this.showConfirmReturnBtnAddDisease = true;
    }
    if (templateNameAddDisease === 'showRequestAddDisease') {
      this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
    }
    if (templateNameAddDisease === 'showSubmitAddDisease') {
      this.headingTextAddDisease = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.noteRequestAddDisease = false;
      this.showConfirmSubmitBtnAddDisease = true;
      this.showConfirmReturnBtnAddDisease = false;
    }
    if (templateNameAddDisease === 'showSubmitCloseDisease') {
      this.headingTextAddDisease = 'OCCUPATIONAL-HAZARD.ASK-CONTRIBUTOR';
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.noteRequestAddDisease = false;
      this.showConfirmSubmitBtnCloseDisease = true;
      this.showConfirmReturnBtnAddDisease = false;
    }
    this.commentAlert = false;
    markFormGroupUntouched(this.reportDiseaseModal);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * Approving by the validator.
   */
  confirmApproveDisease() {
    if (this.gosiDoctor && !this.closeDisease) {
      this.formValidation();
      if (this.parentForm.valid) {
        this.doctorSubmit(this.healthInspectionDetails);
      } else {
        markFormGroupTouched(this.parentForm);
        this.alertService.showMandatoryErrorMessage();
        this.hideModal();
      }
    } else if (this.gosiDoctor && this.closeDisease && this.parentForm.valid) {
      this.confirmCloseDiseaseApprove();
    } else if (this.healthController) {
      this.confirmRasedHealthInspection(null,WorkFlowActions.SEND_FOR_INSPECTION);
    } else {
      this.confirmApprove();
    }
  }
  confirmCloseDiseaseApprove() {
    if (this.diseaseClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY) {
      this.formValidation();
      this.disabilityFormDetails();
    }
    if (
      this.diseaseClosingStatus?.english === InjuryStatus.CURED_WITHOUT_DISABILITY &&
      this.routerData.resourceType !== 'Occupational Disability Assessment'
    ) {
      const action = WorkFlowActions.APPROVE_WITHOUT;
      this.reportInjuryForm.get('status').setValue('SUBMIT');
      this.updateConfirmation(action);
    }
  }

  disabilityFormDetails() {
    // for close disease request by TPA
    this.disabilityDetailsDto = new DisabilityDetailsDtos();
    this.disabilityDetailsDto.comments = this.reportInjuryModal.get('comments').value; // bpm api value
    this.disabilityDetailsDto.assessmentType = this.assessmentTypeEnum.OCC_DIS;
    this.disabilityDetailsDto.isParticipantAttendanceRequired =
      this.healthInspectionDetails.isParticipantAttendanceRequired;
    this.disabilityDetailsDto.isVDRequired = this.healthInspectionDetails.isVdRequired;
    this.disabilityDetailsDto.specialtyList = this.healthInspectionDetails.specialtyList;

    if (this.parentForm.get('visitingDoctorFormValue').valid) {
      this.parentForm.get('visitingDoctorFormValue')?.get('visitingDoctor').get('english').value === 'Yes'
        ? (this.disabilityDetailsDto.isVdRequired = true)
        : (this.disabilityDetailsDto.isVdRequired = false);
      if (this.disabilityDetailsDto.isVdRequired === true) {
        this.parentForm.get('visitingDoctorFormValue').clearValidators();
        this.parentForm
          .get('visitingDoctorFormValue')
          ?.get('vdReason')
          .get('english')
          .setValidators([Validators.required]);
        this.disabilityDetailsDto.vdDetails.vdreason = this.parentForm
          .get('visitingDoctorFormValue')
          .get('vdReason')?.value;
        this.disabilityDetailsDto.vdDetails.vdReasonDescription = this.parentForm
          .get('visitingDoctorFormValue')
          .get('vdReasonDescription')?.value;
        this.disabilityDetailsDto.vdDetails.vdSpecialties = this.parentForm
          .get('visitingDoctorFormValue')
          .get('visitingDoctorSpecialty')
          .get('english').value;
      }
    }
    const injuredPersonList = this.injuredPersonDisease;
    if (injuredPersonList && Array.isArray(injuredPersonList)) {
      this.disabilityDetailsDto.bodyPartsList = [];
      injuredPersonList.forEach((item: any) => {
        this.disabilityDetailsDto.bodyPartsList.push({
          bodyParts: item.bodyParts,
          category: item.category
        });
      });
    }
    this.disabilityDetailsDto.transactionTraceId = this.transactionNumber.toString(); //for transacation number
    if (this.disabilityDetailsDto) {
      this.injuryService
        .putDisabilityDetails(this.disabilityDetailsDto, this.diseaseId, this.registrationNo, this.socialInsuranceNo)
        .subscribe(
          response => {
            const value = response;
            if (value) {
              const action = WorkFlowActions.APPROVE_WITH;
              this.reportInjuryForm.get('status').setValue('SUBMIT');
              this.updateConfirmation(action);
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
  getDisabledParts() {
    this.injuryComplicationID = this.complicationWrapper.complicationDetailsDto.complicationId;
    this.injuryService
      .getDisabilityDetailsDisease(this.registrationNo, this.socialInsuranceNo, this.diseaseId, this.transactionNumber)
      .subscribe(
        response => {
          this.injuredPersonDisease = response.injuredPerson;
        },
        err => {
          this.showError(err);
        }
      );
  }
  formValidation() {
    this.healthInspectionDetails = new HealthInspection();
    this.healthInspectionDetails.inspectionReason = this.healthInspectionForm?.get('inspectionReason').value
      ? this.healthInspectionForm?.get('inspectionReason').value
      : null;
    this.healthInspectionDetails.establishmentList = [];
    if (this.healthInspectionForm.get('establishementrequired')?.get('english').value) {
      this.healthInspectionDetails.establishmentList = this.healthInspectionForm
        .get('establishementrequired')
        ?.get('english')
        .value.map(val => {
          return val.code;
        });
    }
    if (this.parentForm.get('disabilityAttendenceForm').value?.isParticipantAttendanceRequired) {
      this.healthInspectionDetails.isParticipantAttendanceRequired =
        this.parentForm.get('disabilityAttendenceForm').value?.isParticipantAttendanceRequired.english;
    }
    this.healthInspectionDetails.specialtyList = this.specialtyArray;
    if (this.parentForm.get('visitingDoctorFormValue').valid) {
      this.parentForm.get('visitingDoctorFormValue')?.get('visitingDoctor').get('english').value === 'Yes'
        ? (this.healthInspectionDetails.isVdRequired = true)
        : (this.healthInspectionDetails.isVdRequired = false);
      if (this.healthInspectionDetails.isVdRequired === true) {
        this.parentForm.get('visitingDoctorFormValue').clearValidators();
        this.parentForm
          .get('visitingDoctorFormValue')
          ?.get('vdReason')
          .get('english')
          .setValidators([Validators.required]);
        this.healthInspectionDetails.vdDetails.vdReason = this.parentForm
          .get('visitingDoctorFormValue')
          .get('vdReason')?.value;
        this.healthInspectionDetails.vdDetails.vdReasonDescription = this.parentForm
          .get('visitingDoctorFormValue')
          .get('vdReasonDescription')?.value;
        this.healthInspectionDetails.vdDetails.vdSpecialties = this.parentForm
          .get('visitingDoctorFormValue')
          .get('visitingDoctorSpecialty')
          .get('english').value;
      }
    }
  }
  confirmHealthInspection() {
    this.showMandatoryMessage = false;
    this.formValidation();
    this.getEstablishmentDetails();
    if (this.healthInspectionForm.valid) {
      this.confirmHealthInspectionBPM();
      this.saveHealthInspection(this.establishmentDto);
    } else {
      this.showMandatoryMessage = true;
      markFormGroupTouched(this.healthInspectionForm);
    }
  }
  getEstablishmentDetails() {
    const data = this.healthInspectionForm?.get('establishementrequired')?.get('english').value;
    data.forEach((element, i) => {
      this.establishmentDto.establishmentDetails[i] = new EstablishmentDetails();
      this.establishmentDto.establishmentDetails[i].establishmentName.english = element.english;
      this.establishmentDto.establishmentDetails[i].establishmentName.arabic = element.arabic;
      this.establishmentDto.establishmentDetails[i].establishmentRegNo = element.code;
    });
    this.establishmentDto.inspectionReason = this.healthInspectionForm.get('inspectionReason').value;
    return this.establishmentDto;
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnDisease() {
    this.diseaseReturnAction(this.reportDiseaseModal);
  }
  diseaseReturnAction(reportInjuryModal) {
    const action = WorkFlowActions.RETURN;
    this.reportInjuryForm.get('taskId').setValue(this.routerData.taskId);
    this.reportInjuryForm.get('user').setValue(this.routerData.assigneeId);
    this.reportInjuryForm.get('status').setValue('RETURN');
    if (this.validator1 || this.validator2 || this.gosiDoctor || this.fcController || this.healthController) {
      if (this.validator1) {
        reportInjuryModal.get('reasonForReturn').get('english').setValidators(null);
        reportInjuryModal.get('reasonForReturn').get('english').updateValueAndValidity();
      }
      if (reportInjuryModal && reportInjuryModal.valid) {
        this.updateDiseaseConfirmation(action, reportInjuryModal);
      } else {
        this.validateComments(reportInjuryModal);
        markFormGroupTouched(reportInjuryModal);
        this.reportInjuryModal.get('document').setValidators(Validators.required);
        this.reportInjuryModal.get('document').updateValueAndValidity();
      }
    } else {
      if (reportInjuryModal.get('document').valid && reportInjuryModal.get('comments').valid) {
        this.updateConfirmation(action);
      } else {
        this.validateComments(reportInjuryModal);
      }
    }
  }
  /**
   * While rejecting from validator
   */
  confirmRejectDisease() {
    this.reportInjuryForm.get('status').setValue('REJECT');
    this.reportInjuryForm.updateValueAndValidity();
    const formData = this.reportInjuryForm.getRawValue();
    const reason = formData.rejectionReason.english;
    const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'reject');
    const injuryRejectFlag = this.reportInjuryForm.get('injuryRejectFlag')?.value;
    if (this.isEstClosed && !injuryRejectFlag) {
      this.warning = 'OCCUPATIONAL-HAZARD.ERR-FLAG-NOT-CHECKED';
      this.type = 'danger';
    } else {
      if (this.rejectReasonList) {
        this.rejectReasonList.subscribe(element => {
          this.result = element.items.filter(item => item.value.english === reason);
          if (this.result) {
            workflowData.updateMap.set(
              BPMMergeUpdateParamEnum.FOREGOEXPENSES,
              injuryRejectFlag === undefined ? false : injuryRejectFlag
            );
            workflowData.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON, this.result[0].code);
            workflowData.payload = this.routerData.content;
            this.workflowService.mergeAndUpdateTask(workflowData).subscribe(
              () => {
                this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-REJECTED-DISEASE');
                this.router.navigate([RouterConstants.ROUTE_INBOX]);
                this.hideModal();
              },
              err => {
                this.showError(err);
                this.hideModal();
              }
            );
          }
        });
      }
    }
  }
  specialtyArraylist(specialtyArray: specialtyList[]) {
    this.specialtyArray = specialtyArray;
  }

  healthInspectionModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
    this.showWarning = false;
  }
  closeModal() {
    this.modalRef.hide();
  }
  // To Find Duplicate or same array of values and show erroe message for specialty
  hasDuplicateValue(specialtyArray: specialtyList[]) {
    const duplicateSet = new Set();
    specialtyArray?.forEach(val => {
      if (val.subSpecialty === null || val.subSpecialty === undefined) {
        const hasOnlySpecialty = JSON.stringify(val.specialty);
        if (duplicateSet.has(hasOnlySpecialty)) {
          return true;
        }
        duplicateSet.add(hasOnlySpecialty);
      }
      return false;
    });
    // for removing isMainSpecialty field and check if duplicate values are there
    const withoutIsMainSpec = specialtyArray?.map(item => {
      return {
        specialty: item.specialty,
        subSpecialty: item.subSpecialty
      };
    });
    const newArray = new Set();
    for (const eachSpecialityArray of withoutIsMainSpec) {
      const eachSpec = JSON.stringify(eachSpecialityArray);
      if (newArray.has(eachSpec)) {
        return true;
      }
      newArray.add(eachSpec);
    }
    return false;
  }
}
