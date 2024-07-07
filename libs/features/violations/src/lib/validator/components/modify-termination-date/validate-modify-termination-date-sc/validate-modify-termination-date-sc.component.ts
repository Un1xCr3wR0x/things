/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
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
import { InspectionChannel } from '../../../../shared/enums';
import { ViolationsValidatorService } from '../../../../shared/services';

@Component({
  selector: 'vol-validate-modify-termination-date-sc',
  templateUrl: './validate-modify-termination-date-sc.component.html',
  styleUrls: ['./validate-modify-termination-date-sc.component.scss']
})
export class ValidateModifyTerminationDateScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  transactionId: number;
  modifyTerminationForm: FormGroup = new FormGroup({});
  channelIsRased = InspectionChannel.RASED;
  constructor(
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
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
    this.alertService.clearAlerts();
    this.initializePageParameters();
    this.transactionId = this.referenceNo;
    super.initializeView();
    super.getLovList();
  }
  /**
   * This method is to initialize parameters.
   */
  initializePageParameters() {
    super.getDataFromToken(this.routerDataToken);
    super.getRolesForView(this.routerDataToken);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isValid: boolean): void {
    if (this.showVcAlert && isValid) {
      this.showVcRestrictionModal();
    } else {
      this.alertService.clearAlerts();
      const isRequired = isValid ? this.submitPenalityValues() && this.ValidateContributor() : true;
      if (isRequired) {
        this.isButtonApprove = true;
        this.modalRef = this.modalService.show(templateRef, {
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true
        });
      }
    }
  }

  /**Method to return to inbox */
  confirmCancel() {
    this.modalRef.hide();
    super.routeToInbox();
  }
  /** Method to handle workflow events. */
  manageWorkflowTransaction(value: number) {
    if (value === 0) {
      this.memberDto.outcome = super.getWorkflowActions(value);
      this.updateResponseData();
    } else {
      const action = super.getWorkflowActions(value);
      const details = super.setWorkflowData(this.routerDataToken, action);
      super.saveWorkflow(details);
    }
    value === 0 ? super.hideModal(true) : super.hideModal();
  }
  updateResponseData() {
    this.verifyCompensated();
    this.memberDto.comments =
      'APPROVE::' +
      (this.modifyTerminationForm.get('comments')?.value ? this.modifyTerminationForm.get('comments')?.value : '');
    this.memberDto.commentScope = 'BPM';
    const isEstablishmentProactive = this.modifyTerminationForm.get('violations.correction.english')?.value;
    this.memberDto.establishmentProactiveAction = isEstablishmentProactive === 'Yes' ? true : false;
    this.memberDto.justification = this.modifyTerminationForm?.get('justification')?.value;
    this.memberDto.selectedViolationClass = this.modifyTerminationForm?.get('penalty.penalty.english')?.value;
    super.contributorInfoDtoData();
    super.submitMemberDecision(this.memberDto);
  }
  submitPenalityValues() {
    if (
      this.modifyTerminationForm.get('penalty.penalty.english').valid &&
      this.modifyTerminationForm?.get('justification').valid
    ) {
      return true;
    } else {
      this.modifyTerminationForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  getClassValue(violationClassValue?: BilingualText) {
    if (violationClassValue) {
      super.getClassValueChange(this.modifyTerminationForm, violationClassValue);
    }
  }
  /**
   * Method to get if contributor is compensated
   * @param index
   */
  verifyCompensated() {
    this.transactionDetails?.contributors.forEach((contributors, index) => {
      if (contributors) {
        const compensatedValue = (this.modifyTerminationForm.get('contributordetails') as FormArray)?.controls[index].get(
          'compensated.english'
        )?.value;
        contributors.compensated.english = compensatedValue;
      }
    });
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
