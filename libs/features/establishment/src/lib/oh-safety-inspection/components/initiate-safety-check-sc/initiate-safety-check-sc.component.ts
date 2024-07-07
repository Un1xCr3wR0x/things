import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, DocumentService, Establishment, WorkflowService } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  EstablishmentConstants,
  EstablishmentService,
  SafetyInspectionService
} from '../../../shared';

@Component({
  selector: 'est-initiate-safety-check-sc',
  templateUrl: './initiate-safety-check-sc.component.html',
  styleUrls: ['./initiate-safety-check-sc.component.scss']
})
export class InitiateSafetyCheckScComponent extends ChangeEstablishmentScBaseComponent implements OnInit {
  estRegNo: number;
  establishment: Establishment;
  maxLengthComments = EstablishmentConstants.SAFETY_EVALUATION_REASON_LENGTH;
  evaluationForm: FormGroup;
  isApiInProgress: boolean;

  constructor(
    readonly location: Location,
    readonly safetyInspectionService: SafetyInspectionService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly bsModalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly fb: FormBuilder
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
  }

  ngOnInit(): void {
    if (this.safetyInspectionService.registrationNo) {
      this.estRegNo = this.safetyInspectionService.registrationNo;
      this.establishmentService.getEstablishment(this.estRegNo).subscribe(res => {
        this.establishment = res;
      });
    } else {
      this.navigateBack();
    }
    this.evaluationForm = this.createEvaluationForm();
  }

  /** This method is to create form */
  createEvaluationForm(): FormGroup {
    return this.fb.group({
      evaluationReason: [null, { validators: Validators.required }]
    });
  }
  navigateBack() {
    this.location.back();
  }
  navigateToProfile() {
    const url = '/establishment-private/#' + EstablishmentConstants.EST_PROFILE_ROUTE(this.estRegNo);
    window.open(url, '_blank');
  }
  showSubmitModal(template: TemplateRef<HTMLElement>, size: string = 'md') {
    this.evaluationForm?.markAllAsTouched();
    if (!this.isApiInProgress) {
      if (this.evaluationForm?.valid) {
        this.isApiInProgress = true;
        this.bsModalRef = this.bsModalService.show(
          template,
          Object.assign({}, { class: 'modal-' + size + ' modal-dialog-centered', ignoreBackdropClick: true })
        );
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  submitSafetyCheckTransaction() {
    this.safetyInspectionService
      .submitSafetyCheckTransaction(this.estRegNo, this.evaluationForm?.get('evaluationReason').value)
      .subscribe(
        res => {
          this.alertService.showSuccess(res?.successMessage);
          this.isApiInProgress = false;
          this.hideModal();
          this.location.back();
        },
        err => {
          this.hideModal();
          this.isApiInProgress = false;
          this.alertService.showError(err?.error?.message, err?.error?.details);
        }
      );
  }
  hideConfirmModal() {
    this.isApiInProgress = false;
    this.hideModal();
  }
  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.navigateBack();
  }
}
