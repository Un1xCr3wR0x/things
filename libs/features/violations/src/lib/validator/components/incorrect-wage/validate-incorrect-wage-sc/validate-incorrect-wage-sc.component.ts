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
import { BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ClassValueEmit, PenaltyInfo } from '../../../../shared/models';
import { ViolationsValidatorService } from '../../../../shared/services';

@Component({
  selector: 'vol-validate-incorrect-wage-sc',
  templateUrl: './validate-incorrect-wage-sc.component.html',
  styleUrls: ['./validate-incorrect-wage-sc.component.scss']
})
export class ValidateIncorrectWageScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /**
   * Local variables
   */
  transactionNo: number;
  allExcluded: boolean;
  notallExcluded: boolean;
  violationClass: BilingualText;
  penaltyRequest: PenaltyInfo;
  incorrectWageForm: FormGroup = new FormGroup({});
  /**
   *
   * @param alertService
   * @param lookupService
   * @param workflowService
   * @param documentService
   * @param modalService
   * @param validatorService
   * @param router
   * @param routerDataToken
   */
  constructor(
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly modalService: BsModalService,
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
  /**
   * Method to initailise tasks
   */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.initializePage();
    this.transactionNo = this.referenceNo;
    super.initializeView();
    super.getLovList();
  }

  initializePage() {
    super.getDataFromToken(this.routerDataToken);
    super.getRolesForView(this.routerDataToken);
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
      const isValid = isSubmit ? this.submitPenalty() && this.ValidateContributor() : true;
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

  getClassValue(classValueEmit?: ClassValueEmit) {
    if (classValueEmit?.violationClassType) {
      super.getClassValueChange(
        this.incorrectWageForm,
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
      this.incorrectWageForm &&
      this.incorrectWageForm.get('penalty.penalty.english')?.valid &&
      this.incorrectWageForm.get('justification').valid
    ) {
      return true;
    } else {
      this.incorrectWageForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /** Method to handle workflow events. */
  manageWorkflowEvents(value: number) {
    if (value === 0) {
      this.memberDto.outcome = this.getWorkflowActions(value);
      this.updateValidateResponse();
    } else {
      const action = this.getWorkflowActions(value);
      const data = this.setWorkflowData(this.routerDataToken, action);
      super.saveWorkflow(data);
    }
    value === 0 ? super.hideModal(true) : super.hideModal();
  }
  /**
   * Method to update the response
   */
  updateValidateResponse() {
    if (this.incorrectWageForm) {
      this.verifyCompensated();
      this.memberDto.justification = this.incorrectWageForm.get('justification')?.value;
      this.memberDto.comments =
        'APPROVE::' +
        (this.incorrectWageForm.get('comments')?.value ? this.incorrectWageForm.get('comments')?.value : '');
      this.memberDto.commentScope = 'BPM';
      this.memberDto.establishmentProactiveAction =
        this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.establishmentProactiveAction;
      this.memberDto.selectedViolationClass = this.incorrectWageForm.get('penalty.penalty.english')?.value;
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
        const compensatedValue = (this.incorrectWageForm.get('contributordetails') as FormArray)?.controls[index].get('compensated')?.get('english')?.value;
        contributor.compensated= new BilingualText();
        contributor.compensated.english = compensatedValue;
      }
    });
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
