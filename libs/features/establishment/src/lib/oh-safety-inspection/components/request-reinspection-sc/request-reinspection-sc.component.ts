/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentService,
  InspectionDetails,
  OHRate,
  ReinspectionRequest,
  SafetyInspectionConstants,
  SafetyInspectionService,
  isDocumentsValid
} from '../../../shared';

@Component({
  selector: 'est-request-reinspection-sc',
  templateUrl: './request-reinspection-sc.component.html',
  styleUrls: ['./request-reinspection-sc.component.scss']
})
export class RequestReinspectionScComponent extends ChangeEstablishmentScBaseComponent implements OnInit, OnDestroy {
  /**
   * Local Variables
   */
  reInspectionForm: FormGroup;
  reInspectionDocuments: DocumentItem[];
  documentTransactionType = DocumentTransactionTypeEnum.SAFETY_INSPECION_CHECK;
  documentTransactionKey = DocumentTransactionTypeEnum.SAFETY_INSPECION_CHECK;
  documentTransactionId = DocumentTransactionIdEnum.SAFETY_INSPECION_CHECK;
  deltaValue: Map<string, number> = SafetyInspectionConstants.DELTA_VALUES();
  uuid: string;
  registrationNo: number;
  isPrivate: boolean;
  estbalishmentOHRate: OHRate;
  declaration: string;
  inspectionDetails: InspectionDetails;

  constructor(
    readonly bsModalService: BsModalService,
    readonly location: Location,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly workflowService: WorkflowService,
    readonly changeGrpEstablishmentService: ChangeGroupEstablishmentService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly safetyInspectionService: SafetyInspectionService,
    readonly uuidService: UuidGeneratorService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.reInspectionForm = this.createReInspectionForm();
  }

  ngOnInit(): void {
    if (this.safetyInspectionService.registrationNo) {
      this.registrationNo = this.safetyInspectionService.registrationNo;
      this.estbalishmentOHRate = this.safetyInspectionService.estbalishmentOHRate;
      this.inspectionDetails = this.safetyInspectionService.inspectionDetails;
      if (
        this.estbalishmentOHRate.currentOhRate - this.estbalishmentOHRate.baseRate ===
        this.deltaValue.get('medium')
      ) {
        this.declaration = 'ESTABLISHMENT.MID-REINSPECTION-DECLARATION';
        // 3 to 2
      } else if (
        this.estbalishmentOHRate.currentOhRate - this.estbalishmentOHRate.baseRate ===
        this.deltaValue.get('max')
      ) {
        this.declaration = 'ESTABLISHMENT.MAX-REINSPECTION-DECLARATION';
      }
      this.uuid = this.uuidService.getUuid();
      this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
      if (this.isPrivate) {
        this.reInspectionForm.get('declaration').clearValidators();
        this.reInspectionForm.get('declaration').updateValueAndValidity();
      }
      this.getDocuments().subscribe();
    } else {
      this.navigateBack();
    }
  }

  navigateBack() {
    this.location.back();
  }
  /**
   * method to create  form
   */
  createReInspectionForm() {
    return this.fb.group({
      comments: '',
      declaration: [false, { validators: Validators.requiredTrue }]
    });
  }
  getDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        this.documentTransactionKey,
        this.documentTransactionType,
        this.registrationNo,
        undefined,
        null,
        this.uuid
      )
      .pipe(
        tap(res => (this.reInspectionDocuments = res)),
        catchError(err => {
          this.alertService.showError(err.error?.message, err.error?.details);
          return throwError(err);
        })
      );
  }
  /**
   * Method to navigate back
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.navigateBack();
  }

  /**
   *Method to submit the transaction
   */
  submitTransaction() {
    this.alertService.clearAlerts();
    this.reInspectionForm.markAllAsTouched();
    if (this.reInspectionForm.valid) {
      if (isDocumentsValid(this.reInspectionDocuments) || !this.isPrivate) {
        const request = new ReinspectionRequest();
        request.registrationNumber = this.registrationNo?.toString();
        request.reason = SafetyInspectionConstants.REINSPECTION_REASON;
        request.type = SafetyInspectionConstants.REINSPECTION_TYPE;
        request.inspRefNumber = this.inspectionDetails?.inspectionRefNo
          ? this.inspectionDetails?.inspectionRefNo
          : null;
        request.currentOHRate = this.estbalishmentOHRate?.currentOhRate;
        request.uuid = this.uuid;
        this.safetyInspectionService.createReinspection(request).subscribe(
          transactionFeedback => {
            this.alertService.showSuccess(transactionFeedback?.successMessage);
            this.location.back();
          },
          err => {
            this.alertService.showError(err.error.message, err.error.details);
          }
        );
      } else {
        this.alertService.showMandatoryDocumentsError();
      }
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
}
