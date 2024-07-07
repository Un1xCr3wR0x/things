import { Component, OnInit, Inject, TemplateRef, OnDestroy } from '@angular/core';
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
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ViolationsValidatorService } from '@gosi-ui/features/violations/lib/shared/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { routerData } from 'testing';
import { FormArray, FormGroup } from '@angular/forms';
import { ClassValueEmit } from '@gosi-ui/features/violations/lib/shared';

@Component({
  selector: 'vol-validate-wrong-benefits-sc',
  templateUrl: './validate-wrong-benefits-sc.component.html',
  styleUrls: ['./validate-wrong-benefits-sc.component.scss']
})
export class ValidateWrongBenefitsScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  transactionNum: number;
  wrongBenefitsForm: FormGroup = new FormGroup({});

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

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.initializePageParameters();
    this.transactionNum = this.referenceNo;
  }
  /**
   * This method is to initialize parameters.
   */
  initializePageParameters() {
    this.getDataFromToken(this.routerDataToken);
    this.getRolesForView(this.routerDataToken);
    super.initializeView();
    super.getLovList();
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

  submitPenalityDetails() {
    if (
      this.wrongBenefitsForm.get('penalty.penalty.english').valid &&
      this.wrongBenefitsForm.get('justification').valid
    ) {
      return true;
    } else {
      this.wrongBenefitsForm.markAllAsTouched();
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
      (this.wrongBenefitsForm.get('comments')?.value ? this.wrongBenefitsForm.get('comments')?.value : '');
    this.memberDto.commentScope = 'BPM';
    this.verifyCompensated();
    this.memberDto.establishmentProactiveAction =
      this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.establishmentProactiveAction;
    this.memberDto.justification = this.wrongBenefitsForm?.get('justification')?.value;
    this.memberDto.selectedViolationClass = this.wrongBenefitsForm?.get('penalty.penalty.english')?.value;

    super.contributorInfoDtoData();
    super.submitMemberDecision(this.memberDto);
  }

  /**
   * Method to get if contributor is compensated
   * @param index
   */
  verifyCompensated() {
    this.transactionDetails?.contributors.forEach((contributor, index) => {
      if (contributor) {
        const compensatedValue = (this.wrongBenefitsForm.get('contributordetails') as FormArray)?.controls[index].get('compensated')?.get('english')?.value;
        contributor.compensated= new BilingualText();
        contributor.compensated.english = compensatedValue;
      }
    });
  }
  getClassValue(classValueEmit?: ClassValueEmit) {
    if (classValueEmit?.violationClassType) {
      super.getClassValueChange(
        this.wrongBenefitsForm,
        classValueEmit?.violationClassType,
        classValueEmit?.isPrepopulate
      );
    }
  }
  confirmCancel() {
    this.modalRef.hide();
    this.routeToInbox();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
