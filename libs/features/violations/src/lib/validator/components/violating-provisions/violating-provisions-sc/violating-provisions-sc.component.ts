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
import { ViolationsValidatorService } from '@gosi-ui/features/violations/lib/shared';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'vol-violating-provisions-sc',
  templateUrl: './violating-provisions-sc.component.html',
  styleUrls: ['./violating-provisions-sc.component.scss']
})
export class ViolatingProvisionsScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  transactionNum: number;
  violatingProvisionsForm: FormGroup = new FormGroup({});

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
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly validatorService: ViolationsValidatorService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
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

  ngOnInit() {
    this.alertService.clearAlerts();
    this.initializePageParameters();
    this.transactionNum = this.referenceNo;
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
  showModal(templateRef: TemplateRef<HTMLElement>, isRequired: boolean): void {
    if (this.showVcAlert && isRequired) {
      this.showVcRestrictionModal();
    } else {
      this.alertService.clearAlerts();
      const isValid = isRequired ? this.submitPenalityDetails() && this.ValidateContributor() : true;
      if (isValid) {
        this.isButtonApprove = true;
        this.modalRef = this.modalService.show(templateRef, {
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true
        });
      }
    }
  }

  confirmCancel() {
    this.modalRef.hide();
    this.routeToInbox();
  }

  submitPenalityDetails() {
    if (
      (this.violatingProvisionsForm.get('selectNotImposePenalty').value === true ||
      (this.transactionDetails?.contributors.length > 0 &&
        this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.violatedContributors?.length === 0)
        ? true
        : this.violatingProvisionsForm.get('penaltyAmount').valid) &&
      this.violatingProvisionsForm.get('justification').valid
    ) {
      return true;
    } else {
      this.violatingProvisionsForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /** Method to handle workflow events. */
  manageWorkflowTransaction(value: number) {
    if (value === 0) {
      this.memberDto.outcome = super.getWorkflowActions(value);
      this.updateResponse();
    } else {
      const action = super.getWorkflowActions(value);
      const details = super.setWorkflowData(this.routerDataToken, action);
      super.saveWorkflow(details);
    }
    value === 0 ? super.hideModal(true) : super.hideModal();
  }

  updateResponse() {
    this.memberDto.comments =
      'APPROVE::' +
      (this.violatingProvisionsForm.get('comments')?.value ? this.violatingProvisionsForm.get('comments')?.value : '');
    this.memberDto.commentScope = 'BPM';
    this.verifyCompensated();
    this.memberDto.establishmentProactiveAction =
      this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.establishmentProactiveAction;
    this.memberDto.justification = this.violatingProvisionsForm?.get('justification')?.value;
    this.memberDto.penaltyAmount =
      this.violatingProvisionsForm?.get('penaltyAmount')?.value != null
        ? this.violatingProvisionsForm?.get('penaltyAmount')?.value
        : 0;
    if (this.memberDto.penaltyAmount === 0) {
      this.memberDto.selectedViolationClass = this.violatingProvisionsForm?.get(
        'othersExcludedPenaltyForm.english'
      )?.value;
    }
    super.contributorInfoDtoData();
    super.submitMemberDecision(this.memberDto);
  }
  // getClassValue(violationClassValue?: BilingualText) {
  //   if (violationClassValue) {
  //     super.getClassValueChange(this.violatingProvisionsForm, violationClassValue);
  //   }
  // }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  /**
   * Method to get if contributor is compensated
   * @param index
   */
  verifyCompensated() {
    this.transactionDetails?.contributors.forEach((contributor, index) => {
      if (contributor) {
        const compensatedValue = (this.violatingProvisionsForm.get('contributordetails') as FormArray)?.controls[
          index
        ].get('compensated.english')?.value;
        contributor.compensated.english = compensatedValue;
      }
    });
  }
}
