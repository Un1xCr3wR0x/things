/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AllowancePayee,
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  WorkFlowType,
  OHTransactionType,
  Route,
  DiseaseService
} from '../../../shared';
import { AllowanceBaseScComponent } from '../../base/allowance-sc.base-component';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';

@Component({
  selector: 'oh-allowance-payee-sc',
  templateUrl: './allowance-payee-sc.component.html',
  styleUrls: ['./allowance-payee-sc.component.scss']
})
export class AllowancePayeeScComponent extends AllowanceBaseScComponent implements OnInit {
  /**
   * Local Variables
   */
  payeeId: number;
  rejectReasonList: Observable<LovList>;
  allowancePayee: AllowancePayee;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  diseaseIdMessage = '';
  dismissible = false;
  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   * Creating Instance
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly claimsService: OhClaimsService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,  
    @Inject(RouterDataToken) readonly routerData: RouterData,
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


  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.reportAllowanceForm = this.createAllowanceDetailsForm();
    this.reportAllowanceModal = this.createAllowanceModalForm();
    this.bindQueryParamsToForm(this.routerData);
    this.ohService.setRouterData(this.routerData);
    if (this.routerData.taskId === null) {
      this.getValues(this.ohService.getRouterData());
    }
    if (this.routerData.taskId !== null) {
      this.getValues(this.routerData);
    }
    this.setValues();
    this.getContributor();
    this.getEstablishment();
    this.getDocuments();
    this.getAllowancePayee();
    if (!this.routerData.taskId && !this.ohService.getRouterData().taskId) {
      this.alertService.clearAlerts();
      this.navigateToInbox();
    }
    this.rejectReasonList = this.injuryService.getRejectReasonValidator();
  }
  setValues() {
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setIdForValidatorAction(this.payeeId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
  }
  /**
   *
   * @param routerData Assigning values from Router token
   */
  getValues(routerData: RouterData) {
    if (routerData.payload) {
      this.ohService.setRouterData(routerData);
      const payload = JSON.parse(routerData.payload);
      this.registrationNo = payload.registrationNo;
      this.socialInsuranceNo = payload.socialInsuranceNo;
      this.payeeId = payload.id;
      this.referenceNo = routerData.transactionId;
      this.transactionNumber = payload.referenceNo;
      this.workflowType = WorkFlowType.UPDATE_PAYEE;
      this.setValidatorActions();
    }
  }
  /**
   * Fetching documents
   */
  getDocuments() {
    this.transactionKey = OHTransactionType.UPDATE_ALLOWANCE_PAYEE;
    this.transactionType = OHTransactionType.UPDATE_PAYEE;
    this.documentService
      .getDocuments(this.transactionKey, this.transactionType, this.payeeId)
      .subscribe(documentsResponse => {
        this.documents = documentsResponse.filter(item => item.documentContent !== null);
      });
  }
  /**
   * This method is used to show the cancellation template on click of cancel
   * @param changes
   */
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
  allowancePayeeCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Approve Payee
   */
  approvePayee() {
    this.confirmApprove();
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
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }

  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveModal(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef, 'modal-lg');
  }
  /**
   * Reject payee
   */
  confirmRejectPayee() {
    const action = WorkFlowActions.REJECT;
    this.reportAllowanceForm.get('status').setValue('REJECT');
    this.updateCofirmation(action);
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectPayee(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef, 'modal-lg');
  }
  /**
   * Fetch Allowance Payee
   */
  getAllowancePayee() {
    this.ohService.getPayeeDetails(this.registrationNo, this.socialInsuranceNo, this.payeeId, true).subscribe(
      response => {
        this.allowancePayee = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * Navigate to Details
   */
  navigate() {
    if (this.allowancePayee.ohType === 0) {
      this.ohService.setRoute(Route.ALLOWANCE_PAYEE);
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.payeeId}/injury/info`
      ]);
    } else if (this.allowancePayee.ohType === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.diseaseIdMessage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (this.allowancePayee.ohType === 2) {
      this.ohService.setRoute(Route.ALLOWANCE_PAYEE);
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/${this.payeeId}/complication/info`
      ]);
    }
  }
  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.modalRef.hide();
  }
}
