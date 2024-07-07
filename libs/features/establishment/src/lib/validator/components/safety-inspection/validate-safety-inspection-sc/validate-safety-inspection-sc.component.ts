/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  Role,
  WorkFlowActions,
  WorkflowService,
  bindToObject,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import {
  ChangeEstablishmentService,
  EstablishmentConstants,
  EstablishmentService
} from '@gosi-ui/features/establishment';
import {
  EstablishmentQueryKeysEnum,
  InspectionDecisionNameEnum,
  InspectionDetails,
  OHQueryParam,
  OHRate,
  OhUpdateRequest,
  RasedDoc,
  SafetyCheckData,
  SafetyCheckListQuestionare,
  SafetyInspectionService,
  ScFullChecklistDcComponent,
  SubmittedCheckList,
  SystemParamsEnum,
  navigateToTransactionTracking,
  setPreviousSubmissionDatesDropdown
} from '@gosi-ui/features/establishment/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-safety-inspection-sc',
  templateUrl: './validate-safety-inspection-sc.component.html',
  styleUrls: ['./validate-safety-inspection-sc.component.scss']
})
export class ValidateSafetyInspectionScComponent extends ValidatorScBaseComponent implements OnInit, OnDestroy {
  canEdit = false;
  estIcon = 'building';
  estHeading = 'ESTABLISHMENT.ESTABLISHMENT-DETAILS';
  safetyInspectionValidationForm: FormGroup;
  canReturn = false;
  isReturn = false;
  canReject = false;
  referenceNo: number;
  registrationNo: number;
  OHRateDetails: OHRate;
  contributionList: LovList = null;
  inspectionId: number;
  inspectionDetails: InspectionDetails;
  recommendation = '';
  isOperationManagerTransaction: boolean;
  newOHRateDetails: OHRate;
  isApproveCommentsMandatory: boolean;
  rasedDocs: RasedDoc[];
  documents: DocumentItem[];
  lang: string;
  billBatchInProgress = false;
  checkList: SafetyCheckListQuestionare;
  estData: SafetyCheckData;
  violationSelectionForm: FormControl = new FormControl('');
  previousSubmissionDatesList: LovList;
  previousSubmittedData: SubmittedCheckList;
  previousSubmissionDateForm: FormGroup;
  modalRef: BsModalRef;
  isSafetyTransaction = false;

  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly safetyInspectionService: SafetyInspectionService
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
    this.safetyInspectionValidationForm = this.createForm();
  }

  ngOnInit(): void {
    scrollToTop();
    if (this.estRouterData.registrationNo) {
      this.initialiseView();
    } else {
      this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
    }
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  /**
   *  Method to initialise the view for showing Owner details and comments
   * @param referenceNumber
   */
  initialiseView() {
    const previousOwnerRole = this.estRouterData?.previousOwnerRole?.replace(/\s/g, '');
    this.referenceNo = this.estRouterData.referenceNo;
    this.registrationNo = this.estRouterData.registrationNo;
    this.inspectionId = this.estRouterData.inspectionId;
    this.isOperationManagerTransaction = this.estRouterData.assignedRole === Role.INSURANCE_OP_HEAD;
    this.canReturn = this.estRouterData.assignedRole === Role.INSURANCE_DIRECTOR;
    this.isReturn = previousOwnerRole === Role.INSURANCE_DIRECTOR;
    this.safetyInspectionValidationForm.patchValue({
      referenceNo: this.referenceNo,
      registrationNo: this.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    if (!this.isOperationManagerTransaction) {
      this.safetyInspectionValidationForm.get('contributionRate').get('english').setValidators(null);
      this.safetyInspectionValidationForm.get('contributionRate').get('english').updateValueAndValidity();
    }
    if (this.isReturn || !this.isOperationManagerTransaction) {
      this.getEstablishmentNewOHDeatils(this.registrationNo, this.referenceNo);
    }
    this.getComments(this.estRouterData);
    if (this.inspectionId >= 0) {
      this.getRasedDoc();
      this.getEstablishmentInspectionDeatils(this.inspectionId);
    }
    this.getEstablishmentDetails(this.registrationNo);
    this.getEstablishmentOHDeatils(this.registrationNo);
    // this.getRejectReasonList();
    if (this.canReturn) this.getReturnReasonList();
    this.establishmentService
      .getSystemParams()
      .pipe(
        tap(params => {
          const billBatchParamter = params.filter(param => param.name === SystemParamsEnum.billBatchIndicator)?.[0];
          this.billBatchInProgress = +billBatchParamter?.value === 1;
          if (this.billBatchInProgress) {
            this.alertService.setInfoByKey('CORE.INFO.BILL-BATCH-IN-PROGRESS');
          }
        })
      )
      .subscribe();
    this.previousSubmissionDateForm = this.fb.group({
      english: null,
      arabic: null
    });
  }

  goToEstProfile() {
    this.router.navigate([EstablishmentConstants.EST_PROFILE_ROUTE(this.establishment.registrationNo)]);
  }
  createForm(): FormGroup {
    return this.fb.group({
      taskId: [null],
      user: [null],
      referenceNo: [null],
      action: [null],
      establishmentAction: [null],
      registrationNo: [null],
      contributionRate: this.fb.group({
        english: ['', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      }),
      effectiveStartDate: this.fb.group({
        gregorian: [''],
        hijri: ['']
      })
    });
  }

  /**
   * method to get the OH details of an establishment
   * @param registrationNo
   */
  getEstablishmentOHDeatils(registrationNo: number) {
    const params = new OHQueryParam();
    params.excludeHistory = false;
    this.safetyInspectionService.getEstablishmentOHRate(registrationNo, params).subscribe(
      res => {
        this.OHRateDetails = res;
        const items = this.OHRateDetails.applicableRates?.map((rate, i) => {
          const lov = new Lov();
          lov.value.english = rate + '%';
          lov.value.arabic = '%' + rate;
          lov.sequence = i;
          return lov;
        });
        this.contributionList = new LovList(items);
        if (res?.scSelfEvaluationTransactionId && !this.inspectionId) {
          this.getSCSelfEvaluationData(registrationNo, res?.scSelfEvaluationTransactionId);
          this.isSafetyTransaction = true;
        }
      },
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }

  /**
   * method to get the OH details of an establishment
   * @param registrationNo
   */
  getEstablishmentNewOHDeatils(registrationNo: number, referenceNumber: number) {
    const params = new OHQueryParam();
    params.excludeHistory = false;
    params.referenceNumber = referenceNumber;
    this.safetyInspectionService.getEstablishmentOHRate(registrationNo, params).subscribe(
      res => {
        this.newOHRateDetails = res;
        if (this.isReturn) {
          this.safetyInspectionValidationForm
            .get('contributionRate')
            .get('english')
            .setValue(this.newOHRateDetails.currentOhRate + '%');
          this.safetyInspectionValidationForm
            .get('contributionRate')
            .get('arabic')
            .setValue('%' + this.newOHRateDetails.currentOhRate);
        }
      },
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }

  /**
   * method to get the OH details of an establishment
   * @param registrationNo
   */
  getEstablishmentInspectionDeatils(inspectionId: number) {
    this.safetyInspectionService
      .getEstablishmentInspectionDetails(this.registrationNo, [
        {
          queryKey: EstablishmentQueryKeysEnum.INSPECTION_ID,
          queryValue: inspectionId
        }
      ])
      .subscribe(
        inspectionRes => {
          this.inspectionDetails = inspectionRes;
          this.recommendation =
            this.inspectionDetails?.inspectionDecision?.filter(
              decision => decision.name === InspectionDecisionNameEnum.SAFETY_CHECK_DECISION_TYPE
            )[0]?.comments || '';
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    this.alertService.clearAlerts();
    markFormGroupTouched(form);
    if (this.isOperationManagerTransaction && !form.valid) {
      this.alertService.showMandatoryErrorMessage();
      return false;
    } else {
      this.isApproveCommentsMandatory =
        this.isReturn &&
        Number(this.safetyInspectionValidationForm.get('contributionRate')?.get('english')?.value.replace('%', '')) ===
          this.newOHRateDetails?.currentOhRate;
      this.showModal(templateRef);
    }
  }

  /**
   * Method to approve the transaction
   * @param form
   */
  updateOHRate() {
    if (this.isOperationManagerTransaction) {
      const updateRequest = new OhUpdateRequest();
      updateRequest.previousVisitDate = this.inspectionDetails?.previousVisitDate
        ? this.inspectionDetails?.previousVisitDate
        : null;
      updateRequest.ohRate = Number(
        this.safetyInspectionValidationForm.get('contributionRate')?.get('english')?.value.replace('%', '') || 0
      );
      updateRequest.inspectionReferenceNo = this.inspectionDetails?.inspectionRefNo
        ? this.inspectionDetails?.inspectionRefNo
        : null;
      updateRequest.referenceNo = this.referenceNo;
      updateRequest.comments = this.safetyInspectionValidationForm.get('comments').value;
      this.safetyInspectionService.updateOHRate(this.registrationNo, updateRequest).subscribe(
        feedBack => {
          this.updateBpmTransaction(
            this.estRouterData,
            this.safetyInspectionValidationForm.get('comments').value,
            WorkFlowActions.UPDATE
          ).subscribe(
            () => {
              this.hideModal();
              this.estRouterData.resetRouterData();
              this.alertService.showSuccess(feedBack.successMessage);
              this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
            },
            err => {
              this.alertService.showError(err.error.message);
              this.hideModal();
            }
          );
        },
        err => {
          this.alertService.showError(err.error.message);
          this.hideModal();
        }
      );
    } else {
      this.confirmApprove(this.safetyInspectionValidationForm);
    }
  }

  /** Method to get Rased Documents */
  getRasedDoc() {
    this.safetyInspectionService
      .getRasedDoc(this.registrationNo)
      .pipe(
        switchMap(doc => {
          this.rasedDocs = doc.filter(d => d['documentUrl'] !== '.pdf');
          return forkJoin(
            this.rasedDocs.map(rasedDoc => {
              return this.safetyInspectionService.getDocumentByteArray(rasedDoc.documentUrl).pipe(
                map(docByte => {
                  return bindToObject(new DocumentItem(), {
                    documentContent: docByte?.docByte,
                    name: rasedDoc?.documentName,
                    fileName: rasedDoc?.documentName
                  });
                })
              );
            })
          );
        })
      )
      .subscribe(
        res => {
          this.documents = res;
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllInfoAlerts();
  }
  getSCSelfEvaluationData(registrationNo: number, safetyCheckTransactionId: number) {
    this.safetyInspectionService.getSafetyCheckList(registrationNo).subscribe(
      res => {
        this.checkList = res;
        this.getEstData(registrationNo, safetyCheckTransactionId);
      },
      err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
      }
    );
  }
  getEstData(registrationNo: number, safetyCheckTransactionId: number) {
    this.safetyInspectionService.getEstablishmentSafetyData(registrationNo, safetyCheckTransactionId).subscribe(
      res => {
        this.estData = res;
        this.setViolationDetails(res);
      },
      err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
      }
    );
  }
  setViolationDetails(safetyData: SafetyCheckData) {
    if (safetyData?.latestSubmissions !== null) {
      this.setViolationType('Latest');
    } else if (safetyData?.allSubmissions?.length > 0) {
      this.setViolationType('Previous');
    }
    if (safetyData?.allSubmissions?.length > 0) {
      this.previousSubmissionDatesList = setPreviousSubmissionDatesDropdown(safetyData?.allSubmissions);
      this.previousSubmittedData = safetyData?.allSubmissions[0];
      this.previousSubmissionDateForm.setValue(this.previousSubmissionDatesList?.items[0]?.value);
    }
  }
  setViolationType(value: string) {
    this.violationSelectionForm.setValue(value);
  }
  selectPreviousSubmissionDate(dateLov: Lov) {
    this.previousSubmittedData = this.estData?.allSubmissions.find(data => data?.referenceNumber === dateLov?.code);
  }
  navigateToTransactionTracking(refNumber) {
    const url = navigateToTransactionTracking(refNumber, this.appToken);
    window.open(url, '_blank');
  }
  viewFullCheckList(refNumber, isLatest) {
    let initialState = {};
    if (isLatest) {
      initialState = {
        safetyChecklists: JSON.parse(JSON.stringify(this.checkList?.establishmentSafetyChecklists)),
        adminSelectedList: JSON.parse(JSON.stringify(this.estData?.latestSubmissions))
      };
    } else {
      initialState = {
        safetyChecklists: JSON.parse(JSON.stringify(this.checkList?.establishmentSafetyChecklists)),
        adminSelectedList: JSON.parse(
          JSON.stringify(this.estData?.allSubmissions.find(submission => submission?.referenceNumber === refNumber))
        )
      };
    }

    this.modalRef = this.modalService.show(ScFullChecklistDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
      initialState
    });
  }
}
