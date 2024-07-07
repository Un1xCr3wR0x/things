/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ViolationsValidatorService } from '../../../../shared/services';

@Component({
  selector: 'vol-validate-modify-joining-date-sc',
  templateUrl: './validate-modify-joining-date-sc.component.html',
  styleUrls: ['./validate-modify-joining-date-sc.component.scss']
})
export class ValidateModifyJoiningDateScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  transactionNo: number;
  modalRef: BsModalRef;
  modifyJoiningDateForm: FormGroup = new FormGroup({});

  constructor(
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly validatorService: ViolationsValidatorService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      validatorService,
      router,
      routerDataToken,
      appToken
    );
  }

  ngOnInit(): void {
    this.initializeParameters();
    super.initializeView();
    this.alertService.clearAlerts();
    this.transactionNo = this.referenceNo;
    super.getViolationDetails();
    super.getLovList();
  }

  /**
   * This method is to initialize parameters.
   */
  initializeParameters() {
    super.getDataFromToken(this.routerDataToken);
    super.getRolesForView(this.routerDataToken);
  }

  /**Method to return to inbox */
  confirmCancel() {
    this.modalRef.hide();
    super.routeToInbox();
  }

  verifyPenalty() {
    if (
      this.modifyJoiningDateForm.get('penalty.penalty.english').valid &&
      this.modifyJoiningDateForm.get('justification').valid
    ) {
      return true;
    } else {
      this.modifyJoiningDateForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isSubmit: boolean): void {
    if (this.showVcAlert && isSubmit) {
      this.showVcRestrictionModal();
    } else {
      this.alertService.clearAlerts();
      const isValid = isSubmit ? this.verifyPenalty() && this.ValidateContributor() : true;
      if (isValid) {
        this.isButtonApprove = true;
        this.modalRef = this.modalService.show(templateRef, {
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true
        });
      }
    }
  }

  /** Method to handle workflow events. */
  manageWorkflowEvents(key: number) {
    if (key === 0) {
      this.memberDto.outcome = super.getWorkflowActions(key);
      this.updateValidateResponse();
    } else {
      const actionItem = super.getWorkflowActions(key);
      const data = super.setWorkflowData(this.routerDataToken, actionItem);
      super.saveWorkflow(data);
    }
    key === 0 ? super.hideModal(true) : super.hideModal();
  }

  updateValidateResponse() {
    this.memberDto.justification = this.modifyJoiningDateForm.get('justification')?.value;
    this.memberDto.comments =
      'APPROVE::' +
      (this.modifyJoiningDateForm.get('comments')?.value ? this.modifyJoiningDateForm.get('comments')?.value : '');
    this.memberDto.commentScope = 'BPM';
    const isEstablishmentProactive = this.modifyJoiningDateForm.get('violations.correction.english')?.value;
    this.memberDto.establishmentProactiveAction = isEstablishmentProactive === 'Yes' ? true : false;
    this.memberDto.selectedViolationClass = this.modifyJoiningDateForm.get('penalty.penalty.english')?.value;
    super.contributorInfoDtoData();
    super.submitMemberDecision(this.memberDto);
  }
  getClassValue(violationClass?: BilingualText) {
    if (violationClass) {
      super.getClassValueChange(this.modifyJoiningDateForm, violationClass);
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
