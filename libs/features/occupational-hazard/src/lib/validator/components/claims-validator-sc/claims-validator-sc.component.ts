/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService,
  BilingualText,
  LovList,
  LookupService,
  BPMUpdateRequest,
  WorkFlowActions,
  LanguageToken
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  Route,
  DiseaseService
} from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { AllowanceBaseScComponent } from '../../base/allowance-sc.base-component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'oh-claims-validator-sc',
  templateUrl: './claims-validator-sc.component.html',
  styleUrls: ['./claims-validator-sc.component.scss']
})
export class ClaimsValidatorScComponent extends AllowanceBaseScComponent implements OnInit {
  diseaseIdMessage = '';
  auditResponse: BilingualText;
  auditReasonList$: Observable<LovList>;
  auditForm: FormGroup = new FormGroup({});

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly lookupService: LookupService,
    readonly claimsService: OhClaimsService,
    readonly injuryService: InjuryService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    @Inject(RouterDataToken) readonly routerData: RouterData,   
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    @Inject(ApplicationTypeToken) readonly appToken: string
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
    this.reportAllowanceModal = this.createAllowanceModalForm();
    this.auditReasonList$ = this.lookupService.getAuditReasonList();
    if (this.routerData.taskId === null) {
      this.getRouterData(this.ohService.getRouterData());
    }
    if (this.routerData.taskId !== null) {
      this.getRouterData(this.routerData);
      this.setValidatorActions();
    }
    this.getClaimsInvoice();
  }
  /**
   * navigate by clicking Id
   */
  navigateTo(details) {
    if (details.type === 0) {
      this.ohService.setRoute(Route.CLAIMS_VALIDATOR);
      this.router.navigate([`home/oh/view/${details.regNo}/${details.sin}/${details.id}/injury/info`]);
    } else if (details.type === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.diseaseIdMessage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (details.type === 2) {
      this.ohService.setRoute(Route.CLAIMS_VALIDATOR);
      this.router.navigate([
        `home/oh/view/${details.regNo}/${details.sin}/${details.injuryNo}/${details.id}/complication/info`
      ]);
    }
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }
  /**
   * clear the modal
   */
  clear() {
    this.modalRef.hide();
  }

  /**
   * Cancel  the modal
   */
  auditorworkflowCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * Assign For Auditing
   */
  assignForAudit() {
    if (this.auditForm.valid) {
      this.claimsService.assignAuditing(this.tpaCode, this.invoiceId, this.auditForm.getRawValue()).subscribe(
        response => {
          this.auditResponse = response;
          const workflowData = new BPMUpdateRequest();
          const formData = this.auditForm.getRawValue();
          workflowData.taskId = this.routerData.taskId;
          workflowData.user = this.routerData.assigneeId;
          workflowData.outcome = WorkFlowActions.FLAGGED;
          if (formData?.auditForm?.auditComments) {
            workflowData.comments = formData.auditForm.auditComments;
          }
          this.workflowService.updateTaskWorkflow(workflowData).subscribe(
            () => {
              this.modalRef.hide();
              this.router.navigate([RouterConstants.ROUTE_INBOX]);
              this.alertService.showSuccess(this.auditResponse);
            },
            err => {
              this.showError(err);
            }
          );
        },
        error => {
          this.showError(error);
        }
      );
    }
  }
  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveModal(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef, 'modal-lg');
  }
  /**
   * Approve Transcation
   */
  approve() {
    this.approveWorkflow();
  }
}

