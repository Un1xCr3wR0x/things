/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  BPMUpdateRequest,
  CalendarService,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LookupService,
  LovList,
  OTPService,
  Person,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import * as WizardUtil from '../../../shared/utils/wizard-util';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  ContributorTypesEnum,
  DocumentTransactionId,
  DocumentTransactionType,
  TransactionId
} from '../../../shared/enums';
import { Contributor, Establishment, VicEngagementDetails } from '../../../shared/models';
import {
  AddVicService,
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../shared/services';
import { Location } from '@angular/common';
import { ERegisterEngagementBaseScComponent } from './e-registration-base-sc.component';
import * as ContributorHelper from '../../../add-contributor/components/add-contributor-sc/add-contributor-helper';
import { ERequestDetailsDcComponent } from '../e-request-details-dc/e-request-details-dc.component';
import { EEngagement } from '../../../shared/models/e-engagement';
import { EEngagementDetails } from '../../../shared/models/e-engagement-details';
import { SubmitEEngagementPayload } from '../../../shared/models/submitEEngagementPayload';
import { ContributorConstants } from '../../../shared';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'cnt-e-register-engagement-sc',
  templateUrl: './e-register-engagement-sc.component.html',
  styleUrls: ['./e-register-engagement-sc.component.scss']
})
export class ERegisterEngagementScComponent extends ERegisterEngagementBaseScComponent implements OnInit, OnDestroy {
  @Input() isSubmit: boolean;
  @Input() isApiTriggered: boolean;

  /**Event Emiters */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @ViewChild(ERequestDetailsDcComponent, { static: false })
  eRequestDetailsDcComponent: ERequestDetailsDcComponent;

  /** Local variables */
  mob: string;
  role: string;
  birth: string;
  view: number = 1;
  parentForm = new FormGroup({ vicSubmitCheck: new FormControl(false, { validators: Validators.requiredTrue }) });
  registrationSummary: VicEngagementDetails;
  purposeOfRegistration: string;
  modalRef: BsModalRef;
  vicEngagement: VicEngagementDetails;
  comments: string;
  hasCurrentYearVicEngagement: boolean;
  validatorForm: FormGroup = new FormGroup({});
  systemRunDate: GosiCalendar;
  maxDate: Date;
  minDate: Date;
  documentUploadForm: FormGroup;
  isPrivate: boolean;
  isIndividual: boolean;
  contTransactionId = TransactionId.E_REGISTER_ENGAGEMENT;
  bsModal: BsModalRef;
  hasChanged = false;
  tempEngagementDetails;
  tmpVar: Person;
  coverageTypeForm = ContributorHelper.getCoverageTypeForm();
  establishmentDetails: Establishment;
  errorRes: BilingualText;
  xOtp: string;
  personNin: any[] = [];
  ninNumber: number;
  registered: boolean;
  documentUploadEngagementId: number;
  uuid: string;
  isEditMode = false;
  isEdit = false;

  eEngagement: EEngagementDetails;
  eTotalEngagement: EEngagement = new EEngagement();
  submitRequest: SubmitEEngagementPayload = new SubmitEEngagementPayload();
  refNO: string;
  userRoleArray: string[];
  regUser: boolean;
  isValid: boolean;
  deathdate: GosiCalendar = new GosiCalendar();
  message: BilingualText = new BilingualText();

  /** Creates an instance of AddVicScComponent. */
  constructor(
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly contractService: ContractAuthenticationService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly engagementService: EngagementService,
    readonly addVicService: AddVicService,
    readonly vicService: VicService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly lookupService: LookupService,
    readonly otpService: OTPService,
    private uuidGeneratorService: UuidGeneratorService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly calenderService: CalendarService,
    readonly location: Location,
    readonly authTokenService: AuthTokenService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      lookupService,
      workflowService,
      modalService,
      manageWageService,
      router,
      vicService,
      routerDataToken,
      calenderService
    );
  }

  /** Method to handle initialise for ERegisterEngagementScComponent. */
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    // this.role = 'contributor';
    // this.birth = '2023-05-05';
    this.alertService.clearAlerts();
    this.getSystemParameters();
    this.getUuid();
    this.checkEditMode();
    //this.handleRefresh();

    if (this.isEditMode) {
      this.initializeViewForEdit();
      this.valIdentifier = this.routerDataToken.priority;
      this.valRequestId = this.routerDataToken.transactionId;
    }

    if (this.routerDataToken.tabIndicator == 1 && !this.isEditMode) {
      this.flag = 0;
      this.activeTab = this.routerDataToken.tabIndicator;
      this.ninNumber = this.routerDataToken.priority;
      //console.log(this.ninNumber);
      this.wizardItems = this.getWizardItems();
      WizardUtil.initializeWizard(this.getWizardItems(), this.activeTab);
      this.initializeFirstWizardItem();
      this.registered = true;
    } else this.initializeWizard();
    if (this.activeTab == 0) {
      this.initializeFirstWizardItem();
    }
    if (this.isEditMode) {
      this.getPersonDetails(this.valIdentifier);
      this.getValidatorDetails();
      this.getDocument();
    }
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.isIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;

    if (this.ninNumber && this.isIndividual) {
      this.contributorService.getUserStatus(this.ninNumber).subscribe(res => {
        if (res) {
          this.deathdate = res.person.deathDate;
          this.fetchLovList();
        }
        err => {
          this.errorRes = err['error']['message'];
        };
      });
    }
    this.fetchLovList();
  }

  handleRefresh() {
    //handle refreshing the page
    if (!this.isEditMode) {
      const gosiscp = this.authTokenService.getEntitlements();
      this.userRoleArray = gosiscp?.length > 0 ? gosiscp?.[0]?.role?.map(r => r.toString()) : [];
      this.regUser = this.userRoleArray.includes('11') && this.userRoleArray.includes('12');
      if (this.regUser) {
        this.view = 1;
      } else {
        this.view = 0;
      }
    }
  }

  getUuid() {
    this.uuid = this.uuidGeneratorService.getUuid();
  }
  /** Method is to refresh document */
  refreshDocumentItem(doc: DocumentItem): void {
    super.refreshDocument(
      doc,
      this.documentUploadEngagementId,
      DocumentTransactionId.ADD_ENGAGEMENT_E_INSPECTION,
      null,
      this.referenceNo,
      this.uuid
    );
  }
  //  function to send OTP on page load
  sendOTP() {
    if (this.isEditMode) {
      this.submitRequest.editFlow = true;
      this.onSubmit();
    } else {
      this.contributorService.sendOtp(this.ninNumber, this.requestId).subscribe(
        res => {
          this.mob = res.mobileNo;
          this.alertService.clearAlerts();
        },
        err => {
          if (err?.status === 401) {
            this.uuid = err['error']['uuid'];
            this.isValid = true;
          } else {
            this.errorRes = err['error']['message'];
          }
        }
      );
      this.alertService.clearAlerts();
      this.navigateToNextTab();
    }
  }

  showModal(templateRef: TemplateRef<HTMLElement>, isAutoSize = false, disableEsc = false): void {
    const style = isAutoSize ? '' : 'modal-lg ';
    this.modalRef = this.modalService.show(templateRef, {
      class: style + 'modal-dialog-centered',
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: !disableEsc
    });
  }

  handleApprove(): void {
    this.submitRequest.editFlow = true;
    this.onSubmit();
  }
  /* on verify click verify OTP. */
  verifyOTP(otpValue) {
    this.xOtp = this.uuid + ':' + otpValue;
    //console.log('nin', this.ninNumber, 'reqID', this.requestId);
    this.contributorService.verifyOTP(this.ninNumber, this.requestId, this.xOtp).subscribe(
      data => {
        //this.contributorService.authorization = data.headers.get('Authorization');
        //console.log(data);
        this.alertService.clearAlerts();
        this.onSubmit();
      },
      err => this.showAlertDetails(err)
    );
  }

  /** Method to resend otp. */
  reSendOTP() {
    this.otpService.reSendOTP(this.uuid, false).subscribe({
      error: err => (this.errorRes = err['error']['message'])
    });
  }

  /** Method to navigate between form wizard steps while clicking on individual wizard icon */
  selectFormWizard(selectedWizardIndex) {
    this.alertService.clearAlerts();
    if (this.routerDataToken.tabIndicator == 1 && !this.isEditMode) {
      this.activeTab = selectedWizardIndex + 1;
    } else this.activeTab = selectedWizardIndex;
  }

  /** Method to check for edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res?.length > 0) if (res[1]?.path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to initialize view for edit mode. */
  initializeViewForEdit() {
    this.initializeFromToken();
    this.activeTab = this.routerDataToken.tabIndicator;
    this.totalTabs = 3;
  }

  /** This method is to save the  personal details */
  onSavePersonalDetails(personalDetails: Person) {
    this.tmpVar = personalDetails;
    this.savePersonalDetails(personalDetails);
  }

  savePersonalDetails(personalDetails: Person) {
    if (this.isEditMode) {
      personalDetails.identity = this.personDetails.identity;
      this.personNin[0] = this.personDetails.identity[0];
      this.ninNumber = this.personNin[0].newNin;
    } else {
      this.personNin[0] = personalDetails.identity[0];
      this.ninNumber = this.personNin[0].newNin;
    }
    this.contributorService.onSavePersonalDetails(personalDetails, this.ninNumber).subscribe(
      res => {
        this.alertService.clearAlerts();
        this.navigateToNextTab();
        if (this.isEditMode) {
          this.getValidatorDetails();
          this.fetchLovList();
        }
      },
      err => this.showAlertDetails(err)
    );
  }
  /** Method to alert details if present */
  showAlertDetails(err): void {
    this.isApiTriggered = false;
    if (err.error?.details?.length > 0) this.alertService.showError(null, err.error.details);
    else this.showError(err);
  }

  showError(error) {
    this.isApiTriggered = false;
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }

  /** This method is to save the  engagement details */
  onSaveEngagementDetails(engagementDetails) {
    this.tempEngagementDetails = engagementDetails;
    this.alertService.clearAlerts();
    this.saveEngagementDetails(
      this.tempEngagementDetails,
      this.coverageTypeForm.get('english').value ? this.coverageTypeForm.value : null
    );
  }

  /** This method is to submit employment details for adding engagement */
  saveEngagementDetails(engagementWageDetails, coverage?: BilingualText) {
    this.eEngagement = this.setWageDetails(engagementWageDetails, coverage);
    this.establishmentDetails = this.eRequestDetailsDcComponent.estaDetails;
    this.eEngagement.workType = null;
    this.eTotalEngagement.engagementRequestDto = this.eEngagement;
    this.eTotalEngagement.engagementRequestDto.leavingReason = engagementWageDetails.engagementDetails.leavingReason;
    this.eTotalEngagement.establishmentName = this.establishmentDetails.establishmentName?.english;
    this.eTotalEngagement.unifiedNationalNumber = this.establishmentDetails.unifiedNationalNumber?.id;
    this.eTotalEngagement.hrsdEstablishmentId = this.establishmentDetails.hrsdEstablishmentId?.id;
    this.eTotalEngagement.commercialRegistrationNumber = this.establishmentDetails.commercialRegistrationNumber?.id;
    this.eTotalEngagement.ownerId = this.establishmentDetails.ownerId?.id;
    this.eTotalEngagement.gosiRegistrationNumber = this.establishmentDetails.gosiRegistrationNumber?.id;
    if (this.isEditMode) {
      this.personNin[0] = this.personDetails.identity[0];
      this.eTotalEngagement.nin = this.personNin[0].newNin;
      this.ninNumber = this.eTotalEngagement.nin;
      this.eTotalEngagement.editFlow = true;
    } else {
      this.eTotalEngagement.nin = this.ninNumber;
    }
    if (
      (this.requestId != null && this.requestId != undefined) ||
      (this.valRequestId != null && this.valRequestId != undefined)
    ) {
      if (this.isEditMode) {
        this.requestId = this.valRequestId;
      }
      this.contributorService.onUpdateRequestDetails(this.eTotalEngagement, this.ninNumber, this.requestId).subscribe(
        res => {
          if (this.isEditMode) {
            this.getDocument();
          } else {
            this.getRequiredDocuments(
              res.engViolationReqId,
              DocumentTransactionId.ADD_ENGAGEMENT_E_INSPECTION,
              DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION,
              true,
              res.transactionId
            );
          }
          this.navigateToNextTab();
        },
        err => this.showAlertDetails(err)
      );
    } else {
      this.contributorService.onSaveRequestDetails(this.eTotalEngagement, this.ninNumber).subscribe(
        res => {
          this.requestId = res.engViolationReqId;
          this.referenceNo = res.transactionId;
          if (this.isEditMode) {
            this.getDocument();
          } else {
            this.getRequiredDocuments(
              res.engViolationReqId,
              DocumentTransactionId.ADD_ENGAGEMENT_E_INSPECTION,
              DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION,
              true,
              res.transactionId
            );
          }
          this.navigateToNextTab();
        },
        err => this.showAlertDetails(err)
      );
    }
  }

  /** This method is to save the  document details */
  onSubmitDocuments() {
    this.alertService.clearAlerts();
    this.navigateToNextTab();
  }
  /** This method is to save the  complete details */
  onSubmit() {
    this.submitRequest.comments = '';
    this.submitRequest.uuid = '';
    this.contributorService.submitEinspection(this.submitRequest, this.ninNumber, this.requestId).subscribe(
      res => {
        if (res && this.isEditMode) this.valDetailSubmit();
        else {
          if (this.isIndividual) {
            this.message = res.message;
            //this.vicService.message=this.message;
            //this.vicService.flag=true;
            this.router.navigate(['/home/contributor/individual/contributions']);
          } else this.navigateToHome(res.message);
        }
      },
      err => this.showAlertDetails(err)
    );
  }

  //bpm aprove api
  valDetailSubmit() {
    const bpmRequest = new BPMUpdateRequest();
    bpmRequest.outcome = WorkFlowActions.SUBMIT;
    bpmRequest.taskId = this.routerDataToken.taskId;
    bpmRequest.comments = this.validatorForm.get('comments').value;
    this.workflowService.updateTaskWorkflow(bpmRequest).subscribe(
      res => {
        if (res) {
          this.hideModal();
          this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-SUBMIT-MESSAGE', null, 5);
          this.router.navigate([RouterConstants.ROUTE_HOME]);
        }
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  /** This method is to cancel the newly added contributor if the transaction is cancelled */
  cancelAddedContributor() {
    if (this.modalRef) this.hideModal();
    this.resetToFirstForm();
  }
  /** This method is to reset form to first screen */
  resetToFirstForm() {
    if (this.requestId)
      this.contributorService.cancelTransaction(this.ninNumber, this.requestId).subscribe(res => {
        if (res) this.navigateBack();
      });
    this.navigateBack();
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef?.hide();
  }
  navigateBack() {
    this.location.back();
  }

  /**
   * This method is used to show given template
   * @param template
   * @memberof FileUploadDcComponent
   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to show error alert by key */
  showAlertError(key: string): void {
    key ? this.alertService.showErrorByKey(key) : this.alertService.clearAllErrorAlerts();
  }

  fetchLovList(): void {
    this.filterLeavingReason();
    //  this.isIndividual?this.filterLeavingReason():this.leavingReasonList$ = this.lookupService.getReasonForLeavingList('1');
    this.occupationList$ = this.lookupService.getOccupationList();
  }

  filterLeavingReason(): void {
    //To fetch leaving reason based on nationality of the person.
    // const nationalityType: string = this.contributorType === ContributorTypesEnum.SAUDI ? '1' : '2';
    let reqList: string[] = !this.deathdate.gregorian ? ContributorConstants.DEAD_LEAVING_REASONS : [];
    reqList =
      this.engagement?.leavingReason?.english !== ContributorConstants.LEAVING_REASON_BACKDATED
        ? [...reqList, ContributorConstants.LEAVING_REASON_BACKDATED]
        : reqList;
    if (reqList) {
      this.leavingReasonList$ = this.lookupService.getReasonForLeavingList('1').pipe(
        filter(res => res && res !== null),
        map(res => new LovList(res.items.filter(item => reqList.indexOf(item.value.english) === -1)))
      );
    } else this.leavingReasonList$ = this.lookupService.getReasonForLeavingList('1');
  }

  /**Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
