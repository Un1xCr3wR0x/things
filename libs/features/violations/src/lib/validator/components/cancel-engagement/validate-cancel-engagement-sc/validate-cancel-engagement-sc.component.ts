/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { ViolationsValidatorService } from '../../../../shared/services';
import { ClassValueEmit } from '@gosi-ui/features/violations/lib/shared';

@Component({
  selector: 'vol-validate-cancel-engagement-sc',
  templateUrl: './validate-cancel-engagement-sc.component.html',
  styleUrls: ['./validate-cancel-engagement-sc.component.scss']
})
export class ValidateCancelEngagementScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  transactionNumber: number;
  cancelEngagementForm: FormGroup = new FormGroup({});

  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;
  /**
   *
   * @param modalService
   * @param alertService
   * @param workflowService
   * @param router
   * @param lookupService
   * @param documentService
   * @param routerDataToken
   */
  constructor(
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly validatorService: ViolationsValidatorService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appTokenValue: string
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
      appTokenValue
    );
  }
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.initializeParameters();
    this.alertService.clearAlerts();
    this.transactionNumber = this.referenceNo;
    super.initializeView();
    super.getLovList();
  }
  /**
   * Method to save workflow actions
   * @param key
   */
  saveWorkFlowActions(key: number) {
    const action = this.getWorkflowActions(key);
    const data = this.setWorkflowData(this.routerDataToken, action);
    super.saveWorkflow(data);
    super.hideModal();
  }
  initializeParameters() {
    super.getDataFromToken(this.routerDataToken);
    super.getRolesForView(this.routerDataToken);
  }

  /**
   * This method is to show  Modal Reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isSubmitted: boolean): void {
    if (this.showVcAlert && isSubmitted) {
      this.showVcRestrictionModal();
    } else {
      this.alertService.clearAlerts();
      const isValid = isSubmitted ? this.submitPenalty() && this.ValidateContributor() : true;
      if (isValid) {
        this.isButtonApprove = true;
        this.modalRef = this.modalService.show(templateRef, {
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true
        });
      }
    }
  }

  /** This method is to show the modal reference for penalty details. */
  // getPenaltyDetails(index) {
  //   this.transactionDetails.index = index;
  //   const initialState = {
  //     index: index,
  //     penaltyInfoDetails: this.penaltyInfoData
  //   };
  //   this.modalRef = this.modalService.show(PenaltyDetailsDcComponent, {
  //     backdrop: true,
  //     ignoreBackdropClick: true,
  //     class: 'modal-xl modal-dialog-centered',
  //     initialState
  //   });
  // }

  getClassValue(classValueEmit?: ClassValueEmit) {
    if (classValueEmit?.violationClassType) {
      super.getClassValueChange(
        this.cancelEngagementForm,
        classValueEmit?.violationClassType,
        classValueEmit?.isPrepopulate
      );
    }
  }
  /**
   * Method to submit penalty details
   */
  submitPenalty() {
    if (
      this.cancelEngagementForm &&
      this.cancelEngagementForm.get('penalty.penalty.english')?.valid &&
      this.cancelEngagementForm.get('justification').valid
    ) {
      return true;
    } else {
      this.cancelEngagementForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /** Method to handle workflow events. */
  manageWorkflowEvents(val: number) {
    if (val === 0) {
      this.memberDto.outcome = this.getWorkflowActions(val);
      this.updateValidateResponse();
    } else {
      const actions = this.getWorkflowActions(val);
      const data = this.setWorkflowData(this.routerDataToken, actions);
      super.saveWorkflow(data);
    }
    val === 0 ? super.hideModal(true) : super.hideModal();
  }

  /**Method to return to inbox */
  confirmCancel() {
    super.routeToInbox();
    this.modalRef.hide();
  }

  /**
   * Method to update the response
   */
  updateValidateResponse() {
    if (this.cancelEngagementForm) {
      this.verifyCompensated();
      this.memberDto.justification = this.cancelEngagementForm.get('justification')?.value;
      this.memberDto.comments =
        'APPROVE::' +
        (this.cancelEngagementForm.get('comments')?.value ? this.cancelEngagementForm.get('comments')?.value : '');
      this.memberDto.commentScope = 'BPM';
      const isEstablishmentProactive = this.cancelEngagementForm.get('violations.correction.english')?.value;
      this.memberDto.establishmentProactiveAction = isEstablishmentProactive === 'Yes' ? true : false;
      this.memberDto.selectedViolationClass = this.cancelEngagementForm.get('penalty.penalty.english')?.value;
      super.contributorInfoDtoData();
      super.submitMemberDecision(this.memberDto);
    }
  }
  /**
   * Method to get if contributor is compensated
   * @param index
   */
  verifyCompensated() {
    this.transactionDetails?.contributors.forEach((contributor, index) => {
      if (contributor) {
        const compensatedValue = (this.cancelEngagementForm.get('contributordetails') as FormArray)?.controls[index].get('compensated')?.get('english')?.value;
        contributor.compensated= new BilingualText();
        contributor.compensated.english = compensatedValue;
      }
    });
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
