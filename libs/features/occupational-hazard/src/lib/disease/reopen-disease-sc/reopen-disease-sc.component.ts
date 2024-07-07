import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DiseaseBaseComponent } from '../base/disease-base.sc.component';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  TransactionReferenceData,
  TransactionService,
  WizardItem,
  WorkflowService,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ComplicationService,
  ContributorService,
  Disease,
  DiseaseService,
  EngagementDetailsDTO,
  EstablishmentService,
  InjuryService,
  NavigationIndicator,
  OccupationDetail,
  OhService,
  ProcessType,
  RouteConstants
} from '../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'oh-reopen-disease-sc',
  templateUrl: './reopen-disease-sc.component.html',
  styleUrls: ['./reopen-disease-sc.component.scss']
})
export class ReopenDiseaseScComponent extends DiseaseBaseComponent implements OnInit {
  @ViewChild('reportOHTabs', { static: false })
  reportOHTabs: TabsetComponent;
  @ViewChild('cancelEngagementTemplate', { static: false })
  private cancelEngagement: TemplateRef<Object>;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly authTokenService: AuthTokenService,
    readonly ohService: OhService,
    readonly contributorService: ContributorService,
    readonly coreContributorService: CoreContributorService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly lookupService: LookupService,
    readonly diseaseService: DiseaseService,
    readonly complicationService: ComplicationService,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly fb: FormBuilder,
    readonly route: ActivatedRoute,
    readonly transactionService: TransactionService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly activatedRoute: ActivatedRoute,
    readonly location: Location,
    readonly pLocation: PlatformLocation
  ) {
    super(
      language,
      alertService,
      complicationService,
      contributorService,
      documentService,
      workflowService,
      establishmentService,
      injuryService,
      diseaseService,
      lookupService,
      ohService,
      router,
      appToken,
      routerData,
      fb,
      location,
      pLocation,
      modalService,
      transactionService
    );
    pLocation.onPopState(() => {
      if (this.routerData.taskId && this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
        this.alertService.clearAlerts();
      }
    });
  }

  /**local varibales */
  occupationDetailsToSave: EngagementDetailsDTO[] = [];

  comment: TransactionReferenceData[];
  currentTab = 0;
  totalTabs = 2;
  editedOccupation = false;
  reopenReason$: Observable<LovList>;
  reopenReason = 'Others';
  isSelectedReasonOthers = false;
  disabled = false;
  ShowToggle = true;
  modifyIndicator = false;

  ngOnInit(): void {
    this.alertService.clearAllSuccessAlerts();
    this.isWorkflow = true;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    this.ohService.setIsWorkflow(this.isWorkflow);
    this.currentTab = 0;
    this.diseaseDetailsForm = this.createDiseaseDetailsForm();
    const url = this.router.url;
    this.taskid = this.routerData.taskId;
    this.processType = url.substr(url.lastIndexOf('/') + 1);
    this.getRouteParam(this.activatedRoute.paramMap);
    this.reopenDiseaseForm = this.createReopenDiseaseForm();
    if (this.routerData && this.routerData.taskId) {
      this.getRouterValues();
    } else {
      this.diseaseId = this.ohService.getDiseaseId();
      this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    }
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.socialInsuranceNo = this.authTokenService.getIndividual();
    }
    this.serviceCalls();
  }

  getEngagementDetails(occupation: OccupationDetail) {
    if (occupation) {
      this.getOccupationEngagementDetail(
        this.socialInsuranceNo,
        occupation.occupationName.english,
        this.registrationNo
      );
    } else {
      this.getOccupationEngagementDetail(this.socialInsuranceNo, null, this.registrationNo);
    }
  }

  onDeleteOccupationDetails(occupationDetails: EngagementDetailsDTO[]) {
    this.occupationDetailsToSave = occupationDetails;
    if (occupationDetails && occupationDetails.length === 0) {
      this.occupationDetailsToSave = [];
    }
  }

  editedOcc(val) {
    this.editedOccupation = val;
  }
  /**
   * Get Router Values and set it to variables
   */
  getRouterValues() {
    const payload = JSON.parse(this.routerData.payload);
    this.channel = payload.channel;
    this.comment = this.routerData.comments;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.assignedRole = this.routerData.assignedRole;
    if (this.routerData.assignedRole === Role.VALIDATOR_1) {
      this.isValidator1 = true;
    } else if (this.routerData.assignedRole === Role.EST_ADMIN_OH) {
      this.isValidator2 = true;
    }
  }
  /**
   * This method is to emit the selected reopen reason
   * @param reopenReason
   */
  selectedReason(reopenReason: Lov) {
    if (this.reopenReason === reopenReason.value.english) {
      this.isSelectedReasonOthers = true;
    } else {
      this.isSelectedReasonOthers = false;
    }
  }
  /**
   *Service calls
   */
  serviceCalls() {
    this.getDiseaseDetails();
    this.getManageDiseaseDocumentList();
    this.initializeLookups();
    this.initializeWizardItems();
    this.getOccupationEngagementDetail(this.socialInsuranceNo, null, this.registrationNo);
  }
  /**
   * Validating the reopen injury form
   */

  saveReopenDiseaseDetails() {
    this.alertService.clearAlerts();
    if (this.reopenDiseaseForm.valid) {
      this?.saveReopenDetails();
    } else {
      markFormGroupTouched(this.reopenDiseaseForm);
      this.alertService.showMandatoryErrorMessage();
    }
  }

  

  /**
   *
   * @param modifyIndicator
   * Method to check whether modification for complication is required while reopening complication
   */
  modifyDisease(modifyIndicator: boolean) {
    this.modifyIndicator = modifyIndicator;
  }

  //Method to hide toggle button
  showToggle(showToggle) {
    this.ShowToggle = showToggle;
    if (this.ShowToggle === false) {
      this.modifyIndicator = true;
    }
  }
  nextForm() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.currentTab < this.totalTabs) {
      this.reportDiseaseTabs.tabs[this.currentTab].active = true;
    }
    if (this.reportDiseaseWizard) {
      this.reportDiseaseWizard.setNextItem(this.currentTab);
    }
  }

  /**
   * method to cancel complication
   */
  cancelDisease() {
    this.router.navigate([RouteConstants.ROUTE_COMPLICATION]);
  }

  /**
   * Validation for form
   */
  isValidForm() {
    markFormGroupTouched(this.reopenDiseaseForm);
    if (this.reopenDiseaseForm.valid) {
      return true;
    }
    return false;
  }

  /**
   * This method is to navigate to previous tab
   * @memberof ManageInjuryDcComponent
   */
  previousForm() {
    scrollToTop();
    this.currentTab--;
    if (this.reportDiseaseWizard) {
      this.reportDiseaseWizard.setPreviousItem(this.currentTab);
    }
  }

  /** Form Validation */
  showFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }
  /** Method to show error message for mandatory documents. */
  showMandatoryDocErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.appToken === ApplicationTypeEnum.PRIVATE && this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }
  /**
   * Method to fetch the content of the document
   * @param item
   */

  refreshDocument(item: DocumentItem) {
    if (item && item.name) {
      this.documentService.refreshDocument(item, this.diseaseId).subscribe(res => {
        item = res;
      });
    }
  }

  /**
   * This method is to decline cancellation of transaction
   */
  decline() {
    this.modalRef.hide();
  }

  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.ohService.deleteTransactionDetails(this.transactionNumber).subscribe(res => {
      res = res;
      this.alertService.clearAlerts();
      this.ohService.setComplicationId(null);
    });
    if (this.appToken === ApplicationTypeEnum.PUBLIC && this.routerData.taskId) {
      this.router.navigate([RouteConstants.ROUTE_INBOX_PUBLIC]);
    } else {
      this.location.back();
    }
  }

  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectWizard(wizardIndex: number) {
    // this.alertService.clearAlerts();
    // this.currentTab = wizardIndex;
  }

  setOccupationDetails(occupationDetails: EngagementDetailsDTO[]) {
    this.occupationDetailsToSave = occupationDetails;
    if (
      this.processType != ProcessType.MODIFY &&
      this.processType != ProcessType.EDIT &&
      this.processType != ProcessType.RE_OPEN
    ) {
      this.getOccupationEngagementDetail(this.socialInsuranceNo, null, this.registrationNo);
    }
  }

  /**
   *  template for cancel
   */
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelEngagement, config);
  }
  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  deleteDocument(document: DocumentItem) {}
}
