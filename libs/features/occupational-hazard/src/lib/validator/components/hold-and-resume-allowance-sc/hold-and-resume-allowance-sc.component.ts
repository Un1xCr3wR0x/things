/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  HoldResumeDetails,
  InjuryService,
  OhConstants,
  OhService,
  Route,
  WorkFlowType,
  DiseaseService
} from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { AllowanceBaseScComponent } from '../../base/allowance-sc.base-component';

@Component({
  selector: 'oh-hold-and-resume-allowance-sc',
  templateUrl: './hold-and-resume-allowance-sc.component.html',
  styleUrls: ['./hold-and-resume-allowance-sc.component.scss']
})
export class HoldAndResumeAllowanceScComponent extends AllowanceBaseScComponent implements OnInit {
  resourceType: string;
  mainHeading: string;
  payeeId: number;
  infoMesssage = null;
  holdResumeDetails: HoldResumeDetails;
  subHeading: string;
  idLabel: string;
  dateLabel: string;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  comment: TransactionReferenceData[] = [];
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
    readonly router: Router,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    readonly pLocation: PlatformLocation,
    @Inject(RouterDataToken) readonly routerData: RouterData,   
    readonly location: Location,
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
    this.reportAllowanceForm = this.createAllowanceDetailsForm();
    this.rejectReasonList = this.injuryService.getRejectReasonValidator();
    this.alertService.clearAlerts();
    this.reportAllowanceModal = this.createAllowanceModalForm();
    this.bindQueryParamsToForm(this.routerData);
    this.ohService.setRouterData(this.routerData);
    if (this.routerData.taskId === null) {
      this.getData(this.ohService.getRouterData());
    }
    if (this.routerData.taskId !== null) {
      this.getData(this.routerData);
    }
    this.setData();
    this.getContributor();
    this.getEstablishment();
    this.fetchHoldAndAllowanceDetails();
    this.comment = this.routerData.comments;
    if (!this.routerData.taskId && !this.ohService.getRouterData().taskId) {
      this.alertService.clearAlerts();
      this.navigateToInbox();
    }
  }
  setData() {
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setIdForValidatorAction(this.payeeId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    if (this.resourceType === OhConstants.HOLD_ALLOWANCE) {
      this.mainHeading = 'OCCUPATIONAL-HAZARD.ALLOWANCE.HOLD-ALLOWANCE';
      this.subHeading = 'OCCUPATIONAL-HAZARD.ALLOWANCE.HOLD-ALLOWANCE-SUBHEADING';
    } else {
      this.mainHeading = 'OCCUPATIONAL-HAZARD.ALLOWANCE.RESUME-ALLOWANCE';
      this.subHeading = 'OCCUPATIONAL-HAZARD.ALLOWANCE.RESUME-ALLOWANCE-SUBHEADING';
    }
  }
  getData(routerData) {
    if (routerData.payload) {
      this.ohService.setRouterData(routerData);
      const payload = JSON.parse(routerData.payload);
      this.registrationNo = payload.registrationNo;
      this.socialInsuranceNo = payload.socialInsuranceNo;
      this.payeeId = payload.id;
      this.referenceNo = routerData.transactionId;
      this.transactionNumber = routerData.transactionId;
      this.resourceType = routerData.resourceType;
      if (this.resourceType === OhConstants.HOLD_ALLOWANCE) {
        this.workflowType = WorkFlowType.HOLD_ALLOWANCE;
      } else {
        this.workflowType = WorkFlowType.RESUME_ALLOWANCE;
      }
      this.setValidatorActions();
    }
  }
  /**
   * This method is used to show the cancellation template on click of cancel
   * @param changes
   */

  allowanceCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Approve Payee
   */
  approveAllowance() {
    this.confirmApprove();
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.reset.emit();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  //Method to show approve modal
  approveModal(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef, 'modal-lg');
  }

  /**
   * Fetch Allowance Payee
   */
  fetchHoldAndAllowanceDetails() {
    this.ohService.fetchHoldAndAllowanceDetails(this.registrationNo, this.socialInsuranceNo, this.payeeId).subscribe(
      response => {
        this.holdResumeDetails = response;
        if (this.holdResumeDetails.type === 0) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.INJURY.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.INJURY.DATE';
        } else if (this.holdResumeDetails.type === 1) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.DISEASE.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.DISEASE.DATE';
        } else if (this.holdResumeDetails.type === 2) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.COMPLICATION.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.COMPLICATION.DATE';
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * Navigate to Details
   */
  viewDetails() {
    if (this.holdResumeDetails.type !== 1) {
      if (this.resourceType === OhConstants.HOLD_ALLOWANCE) {
        this.ohService.setRoute(Route.HOLD_ALLOWANCE);
      } else {
        this.ohService.setRoute(Route.RESUME_ALLOWANCE);
      }
    }
    if (this.holdResumeDetails.type === 0) {
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.payeeId}/injury/info`
      ]);
    } else if (this.holdResumeDetails.type === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.infoMesssage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (this.holdResumeDetails.type === 2) {
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.holdResumeDetails.injuryNo}/${this.payeeId}/complication/info`
      ]);
    }
  }
  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.modalRef.hide();
  }
  /**
   * Reject payee
   */
  confirmRejectAllowance() {
    const action = WorkFlowActions.REJECT;
    this.reportAllowanceForm.get('status').setValue('REJECT');
    this.updateCofirmation(action);
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectAllowance(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef, 'modal-lg');
  }
}

