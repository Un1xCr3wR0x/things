import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { AlertService, CalendarService, CoreIndividualProfileService, DocumentItem, DocumentService, LanguageToken, LookupService, LovList, RouterConstants, RouterData, RouterDataToken, StorageService, WizardItem, WorkflowService, getFormErrorCount, scrollToTop } from '@gosi-ui/core';
import { CancelContributorService, Contributor, ContributorBPMRequest, ContributorBaseScComponent, ContributorRouteConstants, ContributorService, DocumentTransactionId, DocumentTransactionType, EngagementDetails, EngagementService, EstablishmentService, FormWizardTypes, ManageWageService, ReactivateEngagementRequest, SearchTypeEnum } from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, iif, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ReactivateEngagementDetails } from '../../../shared/models/reactivate-engagement-details';
import { REngagement } from '../../../shared/models/reactivate-engagement';
import { SubmitEEngagementPayload } from '../../../shared/models/submitEEngagementPayload';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'cnt-reactivate-sc',
  templateUrl: './reactivate-sc.component.html',
  styleUrls: ['./reactivate-sc.component.scss']
})
export class ReactivateScComponent extends ContributorBaseScComponent implements OnInit {
  isEditMode: boolean = false;
  view: any;
  totalTab: any;
  valRequestId:number;
  personNin=[];
  contributor: Contributor;
  submitRequest: SubmitEEngagementPayload= new SubmitEEngagementPayload();

  //declarations
  activeTab = 0;
  totalTabs = 2;

  modalRef: BsModalRef;
  wizardItems: WizardItem[] = [];
  TotalEngagement: ReactivateEngagementRequest = new ReactivateEngagementRequest();

  /** Child components */
  
  reactivateReasonList$: Observable<LovList>;
  reactivateEngagements: ReactivateEngagementDetails;
  
  /**Progress wizard */
  @ViewChild('reActivateWizard', { static: false })
  reActivateWizard: ProgressWizardDcComponent;
  valIdentifier: number;
  validatorForm: FormGroup = new FormGroup({});
  canEditPenalty: boolean;
  lang: string = 'en';


   /** Creates an instance of CancelContributorScComponent. */
   constructor(
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly lookupService: LookupService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly cancelContributorService: CancelContributorService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly coreService: CoreIndividualProfileService,
    readonly location: Location,
    readonly calendarService:CalendarService,
    private fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken,
      calendarService
    );
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.checkEditMode();
    super.setKeysForView();
    this.initializeWizard();
    if (this.isEditMode) {
      this.valIdentifier = this.routerDataToken.priority;
      this.valRequestId = this.routerDataToken.transactionId;
    }
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
    this.fetchLovList();
    this.getContributorData();
    this.getCurrentEngagement();
  }
  }


  /** Method to check whether it is edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 0 && res[0].path === 'edit') this.isEditMode = true;
    });
  }
  


  /** Method to get current engagement */
  getCurrentEngagement() {
    this.manageWageService
      .getEngagementsreactivate(this.registrationNo,this.socialInsuranceNo,this.engagementId).subscribe(
        (res) =>{
          this.reactivateEngagements = res;
          this.engagement = this.reactivateEngagements.engagements;
          //console.log(this.reactivateEngagements);
        }
      )
  }



    /** This method is to get contibutor details    */
    getContributorData() {
    this.contributorService.getContributor(this.registrationNo, this.socialInsuranceNo).subscribe(
      (res: Contributor) => {
        this.contributor = res;
        this.personNin[0] = res.person.identity[0];
        //console.log(this.personNin[0]);
        
      },
      err => {
        if (err.error) {
          //console.log(err.error);
        }
      }
    );
  }

  fetchLovList(): void {
    this.reactivateReasonList$ = this.lookupService.getReactivateReasonList();
  }


  /** Method to handle navigation through wizard. */
  selectWizard(index) {
    //this.alertService.clearAlerts();
    this.activeTab = index ;
  }

  /** Method to initialize wizard. */
  initializeWizard() {
    this.getWizardItems();
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
  }

  /** Method to get wizard items */
  getWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(FormWizardTypes.ENGAGEMENT_DETAILS, 'user'));
    wizardItems.push(new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
    this.wizardItems = wizardItems;
  }

  /** Method to confirm cancellation. */
  confirmCancel() {
    this.hideModal();
    this.navigateBack();
  }

 /** Method to check for changes. */
 checkForChanges(template: TemplateRef<HTMLElement>): void {
  // const docStatus = this.checkDocumentStatus();
  // if (getFormErrorCount(this.parentForm) > 0 || this.parentForm.dirty || docStatus) this.showModal(template);
  this.navigateBack();
}

/** Method to show modal. */
showModal(template: TemplateRef<HTMLElement>): void {
  this.modalRef = this.modalService.show(template, {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  });
}

  /** Method to navigate back based on mode. */
  navigateBack(isCompleted = false) {
    if (this.isEditMode)
      this.router.navigate([
        isCompleted ? RouterConstants.ROUTE_INBOX : ContributorRouteConstants.ROUTE_REACTIVATE_VALIDATOR
      ]);
    else
    this.location.back();
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef?.hide();
  }

  submitReactivate(){
    // this.activeTab++;
  }

  previous(){
    this.navigateToPreviousTab()
  }
/** Method to navigate to next tab on successful save */
navigateToNextTab() {
  this.isApiTriggered = false;
  this.alertService.clearAlerts();
  this.activeTab++;
  this.reActivateWizard.setNextItem(this.activeTab);
  scrollToTop();
}
/** Method to navigate to the previous tab */
navigateToPreviousTab() {
  this.isApiTriggered = false;
  this.alertService.clearAlerts();
  this.activeTab--;
  this.reActivateWizard.setPreviousItem(this.activeTab);
  scrollToTop();
}

  /** Method to alert details if present */
  showAlertDetails(err): void {
    this.isApiTriggered = false;
    if (err.error?.details?.length > 0) this.alertService.showError(null, err.error.details);
    else this.showError(err);
  }

  /** This method is to submit employment details for adding engagement */
  saveEngagementDetails(ReactivateEngagementRequest){
    this.TotalEngagement=ReactivateEngagementRequest;
    if(this.isEditMode){
      this.TotalEngagement.editFlow = true;
    }
    if (
      (this.referenceNo != null && this.referenceNo != undefined) ||
      (this.valRequestId != null && this.valRequestId != undefined)
    )  {
      this.contributorService.onUpdateReactivateDetails(this.TotalEngagement,this.registrationNo,this.socialInsuranceNo,this.engagementId,this.referenceNo).subscribe(
        res => {
          //console.log(res,'update engagement details');
          
          if (this.isEditMode) {
            this.getDocument();
          } 
          else {
            this.getRequiredDocuments(
              this.engagementId,
              DocumentTransactionId.REACTIVATE_ENGAGEMENT,
              DocumentTransactionType.REACTIVATE_ENGAGEMENT,
              true,
              res.referenceNo
            );
          }
          this.navigateToNextTab();
        },
        err => {
        this.showAlertDetails(err);
        }
      );
    }  else {
      this.contributorService.onSaveReactivateDetails(this.TotalEngagement,this.registrationNo,this.socialInsuranceNo,this.engagementId).subscribe(
        res => {
          this.referenceNo=res.referenceNo;
          //console.log(res,'engagement details save and next');
          
          if (this.isEditMode) {
            this.getDocument();
          } 
          else {
            this.getRequiredDocuments(
              this.referenceNo,
              DocumentTransactionId.REACTIVATE_ENGAGEMENT,
              DocumentTransactionType.REACTIVATE_ENGAGEMENT,
              true
            );
          }
          this.navigateToNextTab();
        },
        err => {
        this.showAlertDetails(err)
        }
      );
    }
    
    
    
    
   
  }

  /** Method is to refresh document */
  refreshDocumentItem(doc: DocumentItem): void {
    super.refreshDocument(
      doc,
      this.engagementId,
      DocumentTransactionId.REACTIVATE_ENGAGEMENT,
      null,
      this.referenceNo
    );
  }


  /** Method to show error alert by key */
  showAlertError(key: string): void {
    key ? this.alertService.showErrorByKey(key) : this.alertService.clearAllErrorAlerts();
  }


  /** Method to get documents. */
  getDocument() {
    this.documentService
      .getDocuments(DocumentTransactionId.REACTIVATE_ENGAGEMENT, DocumentTransactionType.REACTIVATE_ENGAGEMENT,this.engagementId,this.valRequestId)
      .subscribe(res => (this.documents = res));
  }

  submit(comments){

    this.submitRequest.comments = comments;
    this.submitRequest.uuid = '';
    this.submitRequest.editFlow=false
    if(this.isEditMode)this.submitRequest.editFlow = true;
    this.contributorService.submitReactivate(this.submitRequest,this.registrationNo,this.socialInsuranceNo,this.engagementId,this.referenceNo).pipe(
      tap(res => {
        if (!this.isEditMode) {
          this.navigateBack(true);
          this.alertService.showSuccess(res.message, null, 10);
          this.coreService.setSuccessMessage(res.message, true);
        }
      }),
      switchMap(() => iif(() => this.isEditMode, this.submitTransactionOnEdit())),
      catchError(err => {
        // this.apiTriggered = false;
        this.showError(err);
        return throwError(err);
      })
    )
    .subscribe(noop, noop);
}


/** Method to submit transaction on edit mode. */
submitTransactionOnEdit() {
  const workflowPayload: ContributorBPMRequest = this.assembleWorkflowPayload(
    this.routerDataToken,
    this.submitRequest.comments
  );
  return this.workflowService.updateTaskWorkflow(workflowPayload).pipe(
    tap(() => {
      this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.VALIDATOR-EDIT-MESSAGE');
      this.navigateBack(true);
    })
  );
}



  /** Method to check whether revert is required. */
  checkRevertRequired(): void {
    this.hideModal();
    if (this.isEditMode) this.revertCancelRequest();
    else this.navigateBack();
  }

  /** Method to revert termination request. */
  revertCancelRequest(): void {
    this.contributorService
      .revertTransaction(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .subscribe(
        () => this.navigateBack(),
        err => this.showError(err)
      );
  }
  
}
