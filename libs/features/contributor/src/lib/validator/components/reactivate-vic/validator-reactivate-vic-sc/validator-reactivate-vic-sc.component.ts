import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  CommonIdentity,
  DocumentService,
  InspectionService,
  LanguageToken,
  LookupService,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import {
  Contributor,
  ContributorRouteConstants,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementDetails,
  ReactivateEngagementDetails,
  ReactivateEngagementRequest,
  ValidatorBaseScComponent
} from '@gosi-ui/features/contributor/lib/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  CancelContributorService,
  ContractAuthenticationService,
  ContributorService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-validator-reactivate-vic-sc',
  templateUrl: './validator-reactivate-vic-sc.component.html',
  styleUrls: ['./validator-reactivate-vic-sc.component.scss']
})
export class ValidatorReactivateVicScComponent extends ValidatorBaseScComponent implements OnInit {
  // local variables
  reactivateEngagements: ReactivateEngagementDetails;
  engagement: EngagementDetails;
  contributor: Contributor;
  crmId: number;
  isValidator2: boolean = false;
  reactivationReason: BilingualText = new BilingualText();
  transactionTypes: string[] = [DocumentTransactionType.REACTIVATE_VIC_ENGAGEMENT];
  canReject = true;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  lang = 'en';
  canEditPenalty = false;
  TotalEngagement: ReactivateEngagementRequest = new ReactivateEngagementRequest();
  isValidator1: boolean;
  penaltyIndicator: number;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly cancelContributorService: CancelContributorService,
    readonly contractService: ContractAuthenticationService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly inspectionService: InspectionService,
    readonly manageWageService: ManageWageService,
    readonly router: Router,
    private fb: FormBuilder,
    @Inject(RouterDataToken) private routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
    this.language.subscribe(res => (this.lang = res));
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getDefaultLookupValues();
    this.validatorForm.addControl('penaltyIndicator', this.fb.control([false]));
    if (this.routerData.assignedRole === Role.VALIDATOR_1 || this.routerData.assignedRole === Role.VALIDATOR__1) {
      this.canEditPenalty = true;
      this.isValidator1 = true;
      this.validatorForm.get('penaltyIndicator').setValue(false);
    } else if (
      this.routerData.assignedRole === Role.VALIDATOR_2 ||
      this.routerData.assignedRole === Role.VALIDATOR__2
    ) {
      this.isValidator2 = true;
      this.canEditPenalty = false;
      //this.validatorForm.get('penaltyIndicator').setValue(false);
    }
    super.getSystemParameters();
    // this.getCurrentEngagement();
    // this.getContributorDetails();
    console.log(this.routerData.transactionId, 'tran.id');
    this.initializeView();
    // this.getDocuments(DocumentTransactionId.REACTIVATE_VIC_ENGAGEMENT,DocumentTransactionType.REACTIVATE_VIC_ENGAGEMENT,this.engagementId,this.routerData.transactionId);
    this.checkPenaltyIndicator(this.engagement);
  }
  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isAutoSize = false, disableEsc = false): void {
    const style = isAutoSize ? '' : 'modal-lg ';
    this.modalRef = this.modalService.show(templateRef, {
      class: style + 'modal-dialog-centered',
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: !disableEsc
    });
  }

  /** Method to initialize validator view. */
  initializeView() {
    // this.manageWageService
    //       .getEngagementsreactivatevic(this.socialInsuranceNo,this.engagementId).subscribe(res=>{
    //         this.reactivateEngagements = res;
    //         this.engagement = this.reactivateEngagements.engagements;
    //       },err=>{
    //         super.handleError(err, true);
    //         return throwError(err);
    //       })
    this.getContributorDetails()
      .pipe(
        switchMap(() => {
          return this.manageWageService.getEngagementsreactivatevic(this.socialInsuranceNo, this.engagementId).pipe(
            tap(res => {
              this.reactivateEngagements = res;
              this.engagement = this.reactivateEngagements.engagements;
            })
          );
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.REACTIVATE_VIC_ENGAGEMENT,
            DocumentTransactionType.REACTIVATE_VIC_ENGAGEMENT,
            this.engagementId,
            this.routerData.transactionId
          );
        }),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get contributor details. */
  getContributorDetails(): Observable<Contributor> {
    return this.contributorService
      .getContributorBySin(
        this.socialInsuranceNo,
        new Map().set('includeBankAccountInfo', true).set('checkBeneficiaryStatus', true)
      )
      .pipe(tap(res => ((this.contributor = res), (this.isBeneficiary = this.contributor.isBeneficiary))));
  }

  /** Method to navigate to inbox. */
  navigateToInbox(): void {
    this.modalRef?.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  // Method to get Contributor details
  // getContributorDetails(){
  //   this.contributorService.getContributorBySin( this.socialInsuranceNo).subscribe(res=>{
  //     this.contributor=res;
  //     this.primaryIdentity=getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
  //     console.log(this.primaryIdentity);

  //   })
  // }

  /** Method to get current engagement */
  getCurrentEngagement() {
    this.manageWageService.getEngagementsreactivatevic(this.socialInsuranceNo, this.engagementId).subscribe(res => {
      this.reactivateEngagements = res;
      this.engagement = this.reactivateEngagements.engagements;
      this.crmId = res.crmid;
      console.log(this.reactivateEngagements, '1');
    });
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.router.navigate([ContributorRouteConstants.ROUTE_REACTIVATE_VIC_ENGAGEMENT_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    // if(key == 0 && this.isValidator1){
    //   this.setPenality();
    // }else{
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    this.saveWorkflow(data);
    super.hideModal();
    // }
  }

  /** Method to handle cancel events. */
  confirmCancel() {
    this.hideModal();
    this.navigateBack();
  }

  /** Method to navigate back to inbox page. */
  navigateBack() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  setPenality() {
    this.penaltyIndicator = this.validatorForm.get('penaltyIndicator').value ? 1 : 0;
    this.contributorService
      .updatePenaltyIndicator(
        this.registrationNo,
        this.socialInsuranceNo,
        this.engagementId,
        this.penaltyIndicator,
        this.routerData.transactionId
      )
      .subscribe(
        res => {
          const action = super.getWorkflowAction(0);
          const data = super.setWorkflowData(this.routerData, action);
          this.saveWorkflow(data);
          super.hideModal();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
  }

  /** Method to set penalty indicator */
  checkPenaltyIndicator(engagement: EngagementDetails) {
    const penaltyIndicator = this.validatorForm.get('penaltyIndicator');
    if (this.routerData.assignedRole === Role.VALIDATOR_1 || this.routerData.assignedRole === Role.VALIDATOR__1) {
      if (engagement.penaltyIndicator === null) {
        penaltyIndicator.setValue(true);
      } else {
        penaltyIndicator.setValue(engagement.penaltyIndicator);
      }
    }
  }
}
