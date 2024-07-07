/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, TemplateRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  LookupCategory,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  RouterData,
  RouterDataToken,
  scrollToTop,
  WizardItem,
  WorkflowService,
  ApplicationTypeEnum,
  Role,
  TransactionReferenceData,
  LanguageToken
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Complication,
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhConstants,
  OhService,
  RouteConstants,
  NavigationIndicator,
  DiseaseService
} from '../../shared';
import { ComplicationBaseScComponent } from '../base/complication-base-sc.component';
import { Location } from '@angular/common';

@Component({
  selector: 'oh-reopen-complication-sc',
  templateUrl: './reopen-complication-sc.component.html',
  styleUrls: ['./reopen-complication-sc.component.scss']
})
export class ReopenComplicationScComponent extends ComplicationBaseScComponent implements OnInit {
  /**
   * viewchild components
   */
  @ViewChild('reportOHTabs', { static: false })
  reportOHTabs: TabsetComponent;
  @ViewChild('reportComplicationWizard', { static: false })
  reportComplicationWizard: ProgressWizardDcComponent;
  @ViewChild('cancelEngagementTemplate', { static: false })
  private cancelEngagement: TemplateRef<Object>;
  /**
   * Local Variables
   */
  reopenWizardItems: WizardItem[] = [];  
  currentTab = 0;
  totalTabs = 2;
  reopenComplicationForm: FormGroup;
  disabled = false;
  modifyIndicator = false;
  processType: string;
  isSelectedReasonOthers = false;
  ShowToggle = true;
  reopenReason = 'Others';
  reopenReason$: Observable<LovList>;
  reportComplicationMainForm: FormGroup = new FormGroup({});
  isValidator1 = false;
  assignedRole: string;
  comment: TransactionReferenceData[];

  /**
   * Creating instance
   * @param ohService
   * @param injuryService
   * @param lookupService
   * @param coreContributorService
   * @param establishmentService
   * @param complicationService
   * @param alertService
   * @param router
   * @param modalService
   * @param documentService
   * @param contributorService
   * @param fb
   * @param routerData
   * @param appToken
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly lookupService: LookupService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    readonly coreContributorService: CoreContributorService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerData: RouterData,    
    readonly location: Location,
    readonly activatedRoute: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      language,
      ohService,
      injuryService,
      lookupService,
      coreContributorService,
      establishmentService,
      complicationService,
      diseaseService,
      alertService,
      router,
      modalService,
      documentService,
      workflowService,
      contributorService,
      fb,
      routerData,
      appToken,      
      activatedRoute,
      location     
    );
  }



  ngOnInit(): void {
    //if isWorkflow is true it will call the update api's not post api
    this.isWorkflow = true;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.ohService.setIsWorkflow(this.isWorkflow);
    this.currentTab = 0;
    const url = this.router.url;
    this.taskid = this.routerData.taskId;
    this.processType = url.substr(url.lastIndexOf('/') + 1);
    this.getRouteParam(this.activatedRoute.paramMap);
    this.reopenComplicationForm = this.createReopenComplicationForm();
    if (this.routerData && this.routerData.taskId) {
      this.getRouterValues();
    } else {
      this.injuryNumber = this.ohService.getInjuryNumber();
      this.injuryId = this.ohService.getInjuryId();
      this.registrationNo = this.ohService.getRegistrationNumber();
      this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
      this.complicationId = this.ohService.getComplicationId();
    }
    

    this.serviceCalls();
    
  }
  /**
   *Service calls
   */
  serviceCalls() {
    this.getComplicationDetails(this.registrationNo, this.socialInsuranceNo, this.injuryNumber, this.complicationId);
    this.initializeLookUps();
    this.initializeWizardItems();
    this.getManageInjuryDocumentList();
    this.setNavigationIndicators();
    this.getReopenReason();
  }
  /**
   * Get Router Values and set it to variables
   */
  getRouterValues() {
    const payload = JSON.parse(this.routerData.payload);
    this.channel = payload.channel;
    this.comment = this.routerData.comments;
    this.registrationNo = payload.registrationNo;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.injuryId = payload.injuryId;
    this.injuryNumber = payload.injuryId;
    this.complicationId = payload.id;
    this.ohService.setComplicationId(this.complicationId);
    this.assignedRole = this.routerData.assignedRole;
    if (this.routerData.assignedRole === Role.VALIDATOR_1) {
      this.isValidator1 = true;
    } else if (this.routerData.assignedRole === Role.EST_ADMIN_OH) {
      this.isValidator2 = true;
    }
  }
  /**
   * Setting navigation indicator for reopen
   */
  setNavigationIndicators() {
    if (this.routerData && this.routerData.taskId) {
      this.ohService.setNavigationIndicator(NavigationIndicator.REOPEN_COMPLICATION_EDIT);
    } else if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.ohService.setNavigationIndicator(NavigationIndicator.REOPEN_COMPLICATION_CSR);
    } else {
      this.ohService.setNavigationIndicator(NavigationIndicator.REOPEN_COMPLICATION_EST_ADMIN);
    }
  }
  /**
   * Getting reopen reasons
   */
  getReopenReason() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.reopenReason$ = this.lookupService.getReopenReason(LookupCategory.REGISTRATION);
    } else {
      this.reopenReason$ = this.lookupService.getReopenReason(LookupCategory.COLLECTION);
    }
  }
  /**
   * This method is to initialize progress wizard
   */
  initializeWizardItems() {
    this.reopenWizardItems = [];
    const wizardItem: WizardItem = new WizardItem(OhConstants.REOPEN_WIZARD, 'Reopen');
    wizardItem.isImage = true;
    this.reopenWizardItems.push(wizardItem);
    this.reopenWizardItems.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    this.reopenWizardItems[0].isActive = true;
    this.reopenWizardItems[0].isDisabled = false;
  }

  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.currentTab = wizardIndex;
  }
  /**
   * Validating the reopen injury form
   */

  createReopenComplicationForm() {
    return this.fb.group({
      reopenReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      modifyComplicationIndicator: [false, { updateOn: blur }]
    });
  }
  /**
   *
   * @param comments final submit of injury
   */
  submitDocuments(comments: string) {
    if (!this.routerData.taskId) {
      this.actionflag = true;
    } else {
      this.actionflag = false;
    }
    this.injuryId = this.ohService.getInjuryId();
    if (this.documentForm.get('uploadDocument')) {
      this.documentForm.markAllAsTouched();
      //TODO: try to use rxjs operators switchMap, forkJoin etc instead of cascading the subscribe
      if (this.documentForm.valid) {
        this.submitDocument(this.complicationId, this.injuryId, this.actionflag, comments);
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  /**
   *
   * @param modifyIndicator
   * Method to check whether modification for complication is required while reopening complication
   */
  modifyComplication(modifyIndicator: boolean) {
    this.modifyIndicator = modifyIndicator;
  }
  //Method to hide toggle button
  showToggle(showToggle) {
    this.ShowToggle = showToggle;
    if (this.ShowToggle === false) {
      this.modifyIndicator = true;
    }
  }
  /**
   * method to cancel complication
   */
  cancelComplication() {
    this.router.navigate([RouteConstants.ROUTE_COMPLICATION]);
  }
  /**
   * Validation for form
   */
  isValidForm() {
    markFormGroupTouched(this.reopenComplicationForm);
    if (this.reopenComplicationForm.valid) {
      return true;
    }
    return false;
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
   * This method is to navigate to previous tab
   * @memberof ManageInjuryDcComponent
   */
  previousForm() {
    scrollToTop();
    this.currentTab--;
    if (this.reportComplicationWizard) {
      this.reportComplicationWizard.setPreviousItem(this.currentTab);
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
      this.documentService.refreshDocument(item, this.complicationId).subscribe(res => {
        item = res;
      });
    }
  }
  /**
   *
   * @param complicationDetails Saving the complication Details
   */
  /**
   *
   * Save Complication Details
   */
  saveReopenComplicationDetails(reportComplicationDetails: Complication) {
    this.alertService.clearAlerts();
    if (!this.reopenComplicationForm.invalid) {
      reportComplicationDetails.reopenReason = this.reopenComplicationForm.get('reopenReason').value;
      reportComplicationDetails.modifyComplicationIndicator = this.reopenComplicationForm.get(
        'modifyComplicationIndicator'
      ).value;

      if (this.routerData && this.routerData.taskId) {
        if (this.isEdit) {
          reportComplicationDetails.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
        } else {
          reportComplicationDetails.navigationIndicator = NavigationIndicator.REOPEN_COMPLICATION_EDIT;
        }
      } else if (this.appToken === ApplicationTypeEnum.PRIVATE) {
        if (this.isEdit) {
          reportComplicationDetails.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
        } else {
          reportComplicationDetails.navigationIndicator = NavigationIndicator.REOPEN_COMPLICATION_CSR;
        }
      } else {
        if (this.isEdit) {
          reportComplicationDetails.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
        } else {
          reportComplicationDetails.navigationIndicator = NavigationIndicator.REOPEN_COMPLICATION_EST_ADMIN;
        }
      }

      this.saveComplicationDetails(reportComplicationDetails);
    } else {
      markFormGroupTouched(this.reopenComplicationForm);
      this.alertService.showMandatoryErrorMessage();
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
}
