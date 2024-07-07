/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */ import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  HostListener
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService,
  markFormGroupTouched,
  LanguageToken
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../../shared/services';
import { AllowanceBaseScComponent } from '../../base/allowance-sc.base-component';
import { Location, PlatformLocation } from '@angular/common';
import { Route, setWorkFlowDataForInspection, setWorkFlowDataForTpa } from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'oh-vtr-allowance-details-sc',
  templateUrl: './allowance-details-sc.component.html',
  styleUrls: ['./allowance-details-sc.component.scss']
})
export class AllowanceDetailsScComponent extends AllowanceBaseScComponent implements OnInit {
  /**
   * Local variables
   */
  canEdit = false;
  isValidator = false;
  color: string;
  message: string;
  claimComments: string;
  lang = 'en';
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  reportAllowanceForm: FormGroup;
  reportAllowanceModal: FormGroup;
  maxLengthComments = 300;
  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   *Creating  instance
   * @param fb
   * @param routerData
   * @param manageInjuryService
   * @param router
   * @param modalServce
   * @param validatorRoutingService
   */

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly claimsService: OhClaimsService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,    
    readonly fb: FormBuilder,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly workflowService: WorkflowService
  ) {
    super(
      language,
      ohService,
      claimsService,
      injuryService,
      establishmentService,
      alertService,
      router,
      documentService,
      contributorService,
      fb,
      complicationService,
      diseaseService,
      routerData,     
      location,   
      pLocation,
      appToken,     
      workflowService
    );
  }
  /**
   * This method is for initializing tasks
   */
  ngOnInit(): void {
    this.isValidator = true;
    this.color = '#f6f6f6';
    if (this.routerData.taskId === null) {
      this.intialiseTheView(this.ohService.getRouterData());
    }
    if (this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
    }
    if (!this.routerData.taskId && !this.ohService.getRouterData().taskId) {
      this.navigateToInbox();
    }
  }
  /**
   * Navigate to injury page on validator 1 edit
   */
  navigateToInjuryPage() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/injury/modify']);
  }
  requestTpaForClaims() {
    this.returnTpa = true;
    this.tpaCode = this.allowanceDetailsWrapper.tpaCode;
    const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportAllowanceForm, 'request');
    this.tpaRequestedDocs = this.tpaRequestedDocs.reduce((acc, val) => {
      if (!acc.find(el => el.docName === val.docName)) {
        acc.push(val);
      }
      return acc;
    }, []);
    const dataforClaims = setWorkFlowDataForTpa(
      this.routerData,
      workflowData,
      this.tpaRequestedDocs,
      this.reportAllowanceModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportAllowanceModal && this.reportAllowanceModal?.valid) {
      this.workflowService.mergeAndUpdateTask(dataforClaims).subscribe(
        () => {
          this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-CLARIFICATION');
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
          this.resetModal();
        },
        err => {
          this.showError(err);
          this.resetModal();
        }
      );
    } else {
      this.claimComments = this.reportAllowanceModal.get('comments').value;
      if (this.claimComments === null) {
        this.alertService.clearAlerts();
        this.commentAlert = true;
        markFormGroupTouched(this.reportAllowanceModal);
      }
    }
  }
  navigateToContributor() {
    this.router.navigate([`home/profile/contributor/${this.registrationNo}/${this.socialInsuranceNo}/info`]);
  }
  navigateToEstProfile() {
    if (this.registrationNo) this.router.navigate([`home/establishment/profile/${this.registrationNo}/view`]);
    else {
      this.router.navigate(['home/establishment/profile']);
    }
  }

  /**
   *  Method to navigate to scan documents screen on edit.
   */
  navigateToScan() {
    this.routerData.tabIndicator = 3;
    this.router.navigate(['home/oh/injury/edit?activeTab=3']);
  }
  resetModalAllowance() {
    this.reportAllowanceModal.reset();
    this.resetModal();
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
  /**
   * Method to navigate to view injury page
   */
  viewInjury() {
    if (this.allowanceDetailsWrapper.ohType === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.message = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else {
      this.ohService.setRoute(Route.ALLOWANCE);
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
      ]);
    }
  }

  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.returnTpa = true;
    this.reportAllowanceModal.get('comments').setValidators(Validators.required);
    this.requestedDocumentList();
    this.modalRef = this.modalService.show(
      templateRef,
      Object.assign({}, { class: size, ignoreBackdropClick: true, backdrop: true })
    );
  }

  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef, 'modal-lg');
  }

  /**
   * Navigate to injury page on validator 1 edit
   */
  navigate() {
    this.router.navigate(['home/oh/injury/edit']);
  }

  /**
   * This method is used to show the cancellation template on click of cancel
   * @param changes
   */

  showAllowanceCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.clear();
    this.reset.emit();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  confirmApproveAllowance() {
    this.confirmApprove();
  }
  /**
   * Clear the modal
   */
  clear() {
    this.modalRef.hide();
  }
}

