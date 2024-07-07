import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Role,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentRoutesEnum,
  EstablishmentService
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-late-fee-sc',
  templateUrl: './validate-late-fee-sc.component.html'
})
export class ValidateLateFeeScComponent extends ValidatorScBaseComponent implements OnInit {
  form: FormGroup;
  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router
  ) {
    super(
      lookupService,
      changeEstablishmentService,
      establishmentService,
      alertService,
      documentService,
      fb,
      workflowService,
      modalService,
      appToken,
      estRouterData,
      router
    );
    this.documentTransactionKey = DocumentTransactionTypeEnum.MODIFY_LATE_FEE;
    this.documentTransactionType = DocumentTransactionTypeEnum.MODIFY_LATE_FEE;
  }

  ngOnInit(): void {
    this.initialise(this.estRouterData);
  }

  initialise(estRouterData: EstablishmentRouterData) {
    this.transactionNumber = Number(estRouterData.referenceNo);
    this.canReturn = estRouterData.assignedRole === Role.VALIDATOR_2 || estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    if (estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getComments(estRouterData);

    this.getValidatingEstablishmentDetails(estRouterData.registrationNo, estRouterData.referenceNo);
    this.form = this.createForm();
    this.form.patchValue({
      referenceNo: estRouterData.referenceNo,
      registrationNo: estRouterData.registrationNo,
      taskId: estRouterData.taskId,
      user: estRouterData.user
    });
  }

  /**
   * Method to create form to handle validator operations
   */
  createForm(): FormGroup {
    return this.fb.group({
      taskId: [null],
      user: [null],
      referenceNo: [null],
      action: [null],
      registrationNo: [null]
    });
  }

  goToEdit() {
    this.alertService.clearAlerts();
    this.router.navigate([EstablishmentRoutesEnum.MODIFY_LATE_FEE]);
  }
}
