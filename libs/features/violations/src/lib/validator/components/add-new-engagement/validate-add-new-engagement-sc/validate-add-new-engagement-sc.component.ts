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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { InspectionChannel } from '../../../../shared/enums';
import { ViolationsValidatorService } from '../../../../shared/services';
import { ClassValueEmit } from '@gosi-ui/features/violations/lib/shared/models';

@Component({
  selector: 'vol-validate-add-new-engagement-sc',
  templateUrl: './validate-add-new-engagement-sc.component.html',
  styleUrls: ['./validate-add-new-engagement-sc.component.scss']
})
export class ValidateAddNewEngagementScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /**Local variables */
  transactionNum: number;
  contractId: number;
  modalRef: BsModalRef;
  addEngagementForm: FormGroup = new FormGroup({});
  channelIsRased = InspectionChannel.RASED;

  /** Method to initialize AddMemberScComponent*/
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
      this.addEngagementForm.get('penalty.penalty.english').valid &&
      this.addEngagementForm.get('justification').valid
    ) {
      return true;
    } else {
      this.addEngagementForm.markAllAsTouched();
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
      (this.addEngagementForm.get('comments')?.value ? this.addEngagementForm.get('comments')?.value : '');
    this.memberDto.commentScope = 'BPM';
    this.verifyCompensated();
    this.memberDto.establishmentProactiveAction =
      this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.establishmentProactiveAction;
    this.memberDto.justification = this.addEngagementForm?.get('justification')?.value;
    this.memberDto.selectedViolationClass = this.addEngagementForm?.get('penalty.penalty.english')?.value;
    super.contributorInfoDtoData();
    super.submitMemberDecision(this.memberDto);
  }
  getClassValue(classValueEmit?: ClassValueEmit) {
    if (classValueEmit?.violationClassType) {
      super.getClassValueChange(
        this.addEngagementForm,
        classValueEmit?.violationClassType,
        classValueEmit?.isPrepopulate
      );
    }
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
        const compensatedValue = (this.addEngagementForm.get('contributordetails') as FormArray)?.controls[index].get('compensated')?.get('english')?.value;
        contributor.compensated= new BilingualText();
        contributor.compensated.english = compensatedValue;
      }
    });
  }
}
