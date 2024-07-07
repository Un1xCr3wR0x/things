/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, TemplateRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LovList,
  markFormGroupTouched,
  RouterConstants,
  RouterData,
  RouterDataToken,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService,
  EstablishmentStatusEnum
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OhConstants } from '../../constants';
import { OHTransactionType, WorkFlowType } from '../../enums';
import { RejectionDetails, setResponse } from '../../models';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../services';
import { OhBPMRequest } from '../../models/oh-bpm-request';
import { OhBaseScComponent } from '../base/oh-base-sc.component';

@Component({
  selector: 'oh-injury-reject-sc',
  templateUrl: './injury-reject-sc.component.html',
  styleUrls: ['./injury-reject-sc.component.scss']
})
export class InjuryRejectScComponent extends OhBaseScComponent implements OnInit {
  /**
   * Local variable
   */
  rejectReasonList$: Observable<LovList>;
  injuryrejectReasonList$: Observable<LovList>;
  errorMessage: string;
  rejectInjuryForm: FormGroup;
  rejectForm: FormGroup;
  maxLengthComments = 300;
  modalHeader: string;
  type: WorkFlowType;
  lang = 'en';
  rejectionDetails: RejectionDetails = new RejectionDetails();
  modalRef: BsModalRef;
  isInjuryRejection = true;
  canAddComments = false;
  rejectTransactionId = OhConstants.REJECT_TRANSACTION_ID;
  resource: string;
  uuid: string;
  checkBoxFlag = false;
  previousOutcome: string;
  /**
   * Child elements
   */
  @ViewChild('cancelInjury', { static: false })
  private cancelInjury: TemplateRef<Object>;
  rejectComments = false;
  rejectComplication = true;

  /**
   * Creates an instance of InjuryRejectScComponent
   * @memberof  InjuryRejectScComponent
   *
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly injuryService: InjuryService,
    readonly workflowService: WorkflowService,
    readonly ohService: OhService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerData: RouterData,    
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly uuidService: UuidGeneratorService
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohService,
      router,
      fb,
      complicationService,
      diseaseService,
      location,
      appToken
    );
  }
  /**
   * This method is for initialization tasks
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    this.rejectInjuryForm = this.createRejectInjuryForm();
    this.rejectForm = this.createRejectForm();
    this.language.subscribe(language => (this.lang = language));
    this.uuid = this.uuidService.getUuid();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type === 'complication') {
        this.type = WorkFlowType.REJECT_COMPLICATION;
        this.isInjuryRejection = false;
      } else {
        this.type = WorkFlowType.REJECT_INJURY;
      }
    });
    if (this.routerData.payload != null && this.ohService.getNavigation() !== 'rejectByOh') {
      const payload = JSON.parse(this.routerData.payload);
      this.resource = payload.resource;
      this.referenceNo = payload.referenceNo;
      if (this.referenceNo) {
        this.uuid = null;
      }
      this.previousOutcome = payload.previousOutcome;
      if (this.resource === 'OH Rejection Complication') {
        this.type = WorkFlowType.REJECT_COMPLICATION;
        this.isInjuryRejection = false;
      } else {
        this.type = WorkFlowType.REJECT_INJURY;
      }
      this.registrationNo = payload.registrationNo;
      this.socialInsuranceNo = payload.socialInsuranceNo;
      this.injuryId = payload.id;
      this.canAddComments = true;
      this.transactionReferenceData = this.routerData.comments;
      this.rejectReasonList$ = this.injuryService.getInjuryRejectReasonList(this.type);
      this.injuryrejectReasonList$ = this.injuryService.getInjuryRejectReasonList(WorkFlowType.REJECT_INJURY);
      this.enableField(this.rejectInjuryForm.get('comments'));
      if (this.routerData.resourceType === OhConstants.TRANSACTION_REJECT_COMPLICATION) {
        this.isInjuryRejection = false;
        this.complicationId = payload.id;
        this.injuryNumber = payload.injuryNo;
        this.ohService.setComplicationId(this.complicationId);
        this.ohService.setInjuryNumber(this.injuryNumber);
        setTimeout(() => {
          this.getComplicationForReject(true);
        }, 2000);
        this.documentService
          .getDocuments(OHTransactionType.REJECT_OH, OHTransactionType.REJECT_INJURY, this.complicationId)
          .subscribe(documentResponse => {
            this.documents = documentResponse;
          });
      } else if (this.routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY) {
        this.getInjuryDetailsForReject();
        if (this.rejectReasonList$) {
          setTimeout(() => {
            if (this.injuryDetailsWrapper.injuryDetailsDto.rejectionReason) {
              this.rejectInjuryForm
                .get('rejectionReason')
                .get('english')
                .setValue(this.injuryDetailsWrapper.injuryDetailsDto.rejectionReason.english);
              this.rejectInjuryForm
                .get('rejectionReason')
                .get('arabic')
                .setValue(this.injuryDetailsWrapper.injuryDetailsDto.rejectionReason.arabic);
              this.rejectInjuryForm.get('rejectionReason').updateValueAndValidity();
            }
          }, 2000);
        }
        this.documentService
          .getDocuments(OHTransactionType.REJECT_OH, OHTransactionType.REJECT_INJURY, this.injuryId)
          .subscribe(documentResponse => {
            this.documents = documentResponse;
          });
      }
    } else if (this.ohService.getNavigation() === 'rejectByOh') {
      this.activatedRoute.paramMap.subscribe(res => {
        this.registrationNo = parseInt(res.get('registrationNo'), 10);
        this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
        /**
         * In case of complication, complication id will be set
         */
        this.injuryId = parseInt(res.get('injuryId'), 10);
        this.canAddComments = false;
        this.disableField(this.rejectInjuryForm.get('comments'));
        this.rejectReasonList$ = this.injuryService.getInjuryRejectReasonList(this.type);
        this.injuryrejectReasonList$ = this.injuryService.getInjuryRejectReasonList(WorkFlowType.REJECT_INJURY);
        this.getDocuments(OHTransactionType.REJECT_OH, OHTransactionType.REJECT_INJURY);
      });
    }
    if (!this.socialInsuranceNo) {
      this.location.back();
    }
    this.getEstablishment();
    if (this.type === WorkFlowType.REJECT_COMPLICATION) {
      this.injuryNumber = this.ohService.getInjuryNumber();
      this.complicationId = this.ohService.getComplicationId();
      this.getComplicationForReject();
    }
  }

  getInjuryDetailsForReject() {
    const isChangeRequired = false;
    this.injuryService
      .getInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.isIndividualApp, isChangeRequired)
      .subscribe(res => {
        this.injuryDetailsWrapper = res;
        this.ohService.setInjurystatus(this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus);
        if (this.injuryDetailsWrapper.injuryDetailsDto.foregoExpenses) {
          this.rejectInjuryForm.get('checkBoxFlag').setValue(this.injuryDetailsWrapper.injuryDetailsDto.foregoExpenses);
          this.rejectInjuryForm.get('checkBoxFlag').updateValueAndValidity();
        }
      });
  }
  getComplicationForReject(value?: Boolean) {
    this.complicationService
      .getComplication(this.registrationNo, this.socialInsuranceNo, this.injuryNumber, this.complicationId, false)
      .subscribe(res => {
        this.complicationDetails = res.complicationDetailsDto;
        if (this.rejectReasonList$ && value) {
          if (this.complicationDetails.rejectionReason) {
            this.rejectInjuryForm
              .get('rejectionReason')
              .get('english')
              .setValue(this.complicationDetails.rejectionReason.english);
            this.rejectInjuryForm
              .get('rejectionReason')
              .get('arabic')
              .setValue(this.complicationDetails.rejectionReason.arabic);
            this.rejectInjuryForm.get('rejectionReason').updateValueAndValidity();
          }
          if (this.complicationDetails.parentInjuryRejectionReason) {
            this.rejectForm
              .get('rejectionReason')
              .get('arabic')
              .setValue(this.complicationDetails.parentInjuryRejectionReason.arabic);
            this.rejectForm
              .get('rejectionReason')
              .get('english')
              .setValue(this.complicationDetails.parentInjuryRejectionReason.english);
            this.rejectForm.get('rejectionReason').updateValueAndValidity();
          }
        }
        if (this.complicationDetails.foregoExpenses) {
          this.rejectInjuryForm.get('checkBoxFlag').setValue(this.complicationDetails.foregoExpenses);
        }
        if (this.complicationDetails.parentInjuryForegoExpenses) {
          this.rejectForm.get('checkBoxFlag').setValue(this.complicationDetails.parentInjuryForegoExpenses);
        }
      });
    return this.complicationDetails;
  }
  /**
   * Method to disable form control.
   * @param formControl form control
   */
  disableField(formControl: AbstractControl) {
    formControl.setValue(null);
    formControl.disable();
    formControl.clearValidators();
    formControl.markAsPristine();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }

  /**
   * Nethod to enable form control.
   * @param formControl form control
   */
  //TODO: check is available in utils
  enableField(formControl: AbstractControl) {
    formControl.setValidators([Validators.required]);
    formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }

  /**
   * This method is to create rejectInjuryForm and initialize
   * @memberof InjuryRejectScComponent
   */
  createRejectInjuryForm() {
    return this.fb.group({
      rejectionReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      }),
      checkBoxFlag: [false],
      comments: [null]
    });
  }
  /**
   * This method is to create rejectInjuryForm and initialize
   * @memberof InjuryRejectScComponent
   */
  createRejectForm() {
    return this.fb.group({
      rejectionReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      }),
      checkBoxFlag: [false]
    });
  }

  /**
   *  template for cancel
   */
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelInjury, config);
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.alertService.clearAlerts();
    this.location.back();
  }
  /**
   * Api call for rejecting injury
   */
  submitRejection() {
    this.ohService.setNavigation(null);
    this.rejectInjuryForm.updateValueAndValidity();
    if (this.rejectInjuryForm && this.rejectInjuryForm.valid) {
      this.alertService.clearAlerts();
      this.rejectionDetails = setResponse(new RejectionDetails(), this.rejectInjuryForm.getRawValue());
      if (this.rejectForm && this.rejectForm.valid) {
        if (this.rejectForm.get('rejectionReason')) {
          this.rejectionDetails.parentInjuryRejectionReason = this.rejectForm.get('rejectionReason').value;
          this.rejectionDetails.parentInjForegoExpenses = this.rejectForm.get('checkBoxFlag')?.value;
        }
      } else {
        this.rejectionDetails.parentInjuryRejectionReason.english = null;
        this.rejectionDetails.parentInjuryRejectionReason.arabic = null;
        this.rejectionDetails.parentInjForegoExpenses = null;
      }
      this.rejectionDetails.foregoExpenses = this.rejectInjuryForm.get('checkBoxFlag')?.value;
      this.rejectionDetails.rejectionIndicator = true;
      this.rejectionDetails.uuid = this.uuid;
      if (
        ((!this.rejectForm.get('checkBoxFlag').value && this.rejectForm.valid) ||
          !this.rejectInjuryForm.get('checkBoxFlag').value) &&
        this.isEstClosed
      ) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.ERR-FLAG-NOT-CHECKED');
      } else {
        this.injuryService
          .updateInjuryRejection(
            this.rejectionDetails,
            this.registrationNo,
            this.socialInsuranceNo,
            this.injuryId,
            this.canAddComments
          )
          .pipe(map(res => res.responseMessage))
          .subscribe(
            response => {
              if (this.canAddComments) {
                if (this.routerData && this.rejectionDetails) {
                  const updateRequest: OhBPMRequest = new OhBPMRequest();
                  updateRequest.foregoExpenses = this.rejectInjuryForm.get('checkBoxFlag').value;
                  updateRequest.comments = this.rejectInjuryForm.get('comments').value;
                  updateRequest.outcome = WorkFlowActions.UPDATE;
                  updateRequest.taskId = this.routerData.taskId;
                  updateRequest.user = this.routerData.assigneeId;
                  updateRequest.rejectionReason = this.rejectionDetails.rejectionReason;
                  updateRequest.rejectionIndicator = this.rejectionDetails.rejectionIndicator;
                  this.workflowService.updateTaskWorkflow(updateRequest).subscribe(
                    () => {
                      this.router.navigate([RouterConstants.ROUTE_INBOX]);
                    },
                    err => {
                      this.alertService.showError(err.error.message, err.error.details);
                    }
                  );
                }
              }
              if (this.isInjuryRejection && !this.canAddComments) {
                this.router.navigate(
                  [`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`],
                  {
                    queryParams: {
                      status: 'rejected'
                    }
                  }
                );
              } else if (!this.canAddComments) {
                this.router.navigate(
                  [
                    `home/oh/view/${this.registrationNo}/${
                      this.socialInsuranceNo
                    }/${this.ohService.getInjuryNumber()}/${this.injuryId}/complication/info`
                  ],
                  {
                    queryParams: {
                      status: 'rejected'
                    }
                  }
                );
              }
              this.alertService.showSuccess(response);
            },
            err => {
              this.showError(err);
            }
          );
      }
    } else {
      markFormGroupTouched(this.rejectInjuryForm);
      this.showFormValidation();
    }
  }

  /**
   * Form Validation
   */
  showFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }

  /**
   * Get document list
   */
  getDocuments(transaction, type) {
    this.documentService
      .getRequiredDocuments(transaction, type)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      )
      .subscribe((documents: DocumentItem[]) => {
        this.documents = documents;
      });
  }
  /**

  /**
   * Method to fetch the content of the document
   * @param item
   */
  refreshDocument(item: DocumentItem) {
    if (item && item.name) {
      this.documentService.refreshDocument(item, this.injuryId).subscribe(res => {
        item = res;
      });
    }
  }

  onSelectFlag(value) {
    if (this.rejectInjuryForm.get('checkBoxFlag').value === true) {
      this.rejectComments = true;
      this.settingValidation();
      if (this.isInjuryRejection) {
        this.modalHeader = 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION';
      } else {
        this.modalHeader = 'OCCUPATIONAL-HAZARD.COMPLICATION.REJECT-COMPLICATION-TRANSACTION';
      }
    } else if (
      this.rejectInjuryForm.get('checkBoxFlag').value === false &&
      this.rejectForm.get('checkBoxFlag').value === false
    ) {
      this.rejectComments = false;
      this.removingValidation();
    }
  }
  onSelectFlagComplication() {
    if (this.rejectForm.get('checkBoxFlag').value === true) {
      this.rejectComplication = true;
      this.settingValidation();
    } else if (
      this.rejectInjuryForm.get('checkBoxFlag').value === false &&
      this.rejectForm.get('checkBoxFlag').value === false
    ) {
      this.rejectComplication = false;
      this.removingValidation();
    }
  }
  removingValidation() {
    this.checkBoxFlag = false;
    this.rejectInjuryForm.get('comments').clearValidators();
    this.rejectInjuryForm.get('comments').disable();
  }
  settingValidation() {
    if (this.previousOutcome !== WorkFlowActions.RETURN) {
      this.checkBoxFlag = true;
      this.rejectInjuryForm.get('comments').setValidators(Validators.required);
      this.rejectInjuryForm.get('comments').enable();
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.APPROVAL_OF_AUTHORIZATION';
    }
  }
  clearModal() {
    this.hideModal();
  }
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  otherValueSelect() {
    const otherField = this.rejectInjuryForm.get('rejectionReason').get('english');
    if (
      otherField.value === 'The complication is rejected because the injury is rejected' &&
      this.complicationDetails.injuryDetails.hasOpenComplication
    ) {
      this.alertService.showWarningByKey('OCCUPATIONAL-HAZARD.REJECTION-INFO');
    } else {
      this.alertService.clearAllWarningAlerts();
    }
  }
  rejectValueSelect() {
    if (this.rejectForm.get('checkBoxFlag').value === false) {
      this.onSelectFlagComplication();
    }
  }
}

