import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
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
import { BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ClassValueEmit, ViolationTransaction } from '../../../../shared/models';
import { ViolationsValidatorService } from '../../../../shared/services';

@Component({
  selector: 'vol-validate-incorrect-termination-sc',
  templateUrl: './validate-incorrect-termination-sc.component.html',
  styleUrls: ['./validate-incorrect-termination-sc.component.scss']
})
export class ValidateIncorrectTerminationScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /**Local variables */
  transactionNumber: number;
  transactionDetails: ViolationTransaction;
  violationClass: BilingualText;
  incorrectReasonForm: FormGroup = new FormGroup({});

  /**
   *
   * @param alertService
   * @param validatorService
   * @param documentService
   * @param modalService
   * @param lookupService
   * @param workflowService
   * @param router
   * @param routerDataToken
   */
  constructor(
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly lookupService: LookupService,
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
  /** Method to initialize tasks*/
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.initializeParameters();
    this.transactionNumber = this.referenceNo;
    super.initializeView();
    super.getLovList();
  }

  /**Method to  initialize the Parameters */
  initializeParameters() {
    super.getDataFromToken(this.routerDataToken);
    super.getRolesForView(this.routerDataToken);
  }

  /**
   * This method is to display the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isSubmits: boolean): void {
    if (this.showVcAlert && isSubmits) {
      this.showVcRestrictionModal();
    } else {
      this.alertService.clearAlerts();
      const isValid = isSubmits ? this.submitPenalty() && this.ValidateContributor() : true;
      if (isValid) {
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
    super.routeToInbox();
    this.modalRef.hide();
  }

  /**Method to get Violation Class */
  getClassValue(classValueEmit?: ClassValueEmit) {
    if (classValueEmit?.violationClassType) {
      super.getClassValueChange(
        this.incorrectReasonForm,
        classValueEmit?.violationClassType,
        classValueEmit?.isPrepopulate
      );
    }
  }

  submitPenalty() {
    if (
      this.incorrectReasonForm.get('penalty.penalty.english').valid &&
      this.incorrectReasonForm.get('justification').valid
    ) {
      return true;
    } else {
      this.incorrectReasonForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /** Method to handle workflow events. */
  manageWorkflowEvents(val: number) {
    if (val === 0) {
      this.memberDto.outcome = super.getWorkflowActions(val);
      this.updateValidateResponse();
    } else {
      const actions = super.getWorkflowActions(val);
      const data = super.setWorkflowData(this.routerDataToken, actions);
      super.saveWorkflow(data);
    }
    val === 0 ? super.hideModal(true) : super.hideModal();
  }

  updateValidateResponse() {
    this.memberDto.justification = this.incorrectReasonForm.get('justification')?.value;
    this.memberDto.comments =
      'APPROVE::' +
      (this.incorrectReasonForm.get('comments')?.value ? this.incorrectReasonForm.get('comments')?.value : '');
    this.memberDto.commentScope = 'BPM';
    this.verifyCompensated();
    this.memberDto.selectedViolationClass = this.incorrectReasonForm.get('penalty.penalty.english')?.value;
    this.memberDto.establishmentProactiveAction =
      this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.establishmentProactiveAction;
    super.contributorInfoDtoData();
    super.submitMemberDecision(this.memberDto);
  }
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
        const compensatedValue = (this.incorrectReasonForm.get('contributordetails') as FormArray)?.controls[index].get('compensated')?.get('english')?.value;
        contributor.compensated= new BilingualText();
        contributor.compensated.english = compensatedValue;
      }
    });
  }
}
