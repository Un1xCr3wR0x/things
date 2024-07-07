/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, OnDestroy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {
  ActiveBenefits,
  AnnuityResponseDto,
  ImprisonmentPeriod,
  ImprisonmentVerifyResponse
} from '../../shared/models';
import { ApplicationTypeEnum, Channel, Role, RoleIdEnum, WorkFlowActions } from '@gosi-ui/core/lib/enums';
import { BenefitDocumentService, ManageBenefitService, ModifyBenefitService } from '../../shared/services';
import {
  ApplicationTypeToken,
  DocumentItem,
  UuidGeneratorService,
  DocumentService,
  AlertService,
  scrollToTop,
  RouterDataToken,
  RouterData,
  BPMUpdateRequest,
  GosiCalendar,
  startOfDay,
  CoreBenefitService,
  CoreActiveBenefits,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import { BenefitConstants, markFormGroupTouched, showErrorMessage, UITransactionType } from '../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'bnt-imprisonment-modify-sc',
  templateUrl: './imprisonment-modify-sc.component.html',
  styleUrls: ['./imprisonment-modify-sc.component.scss']
})
export class ImprisonmentModifyScComponent implements OnInit, OnDestroy {
  /** Local variables */
  activeBenefit: CoreActiveBenefits;
  benefitRequestId: number;
  documentList: DocumentItem[];
  imprisonmentDetails: AnnuityResponseDto;
  imprisonmentData: ImprisonmentPeriod;
  imprisonmentForm: FormGroup;
  imprisonmentVerifyRsp: ImprisonmentVerifyResponse;
  isAppPrivate = false;
  isSubmitDisable = true;
  inImprisonmentEditMode = false;
  rolesEnum = Role;
  channel: string;
  role: string;
  minDateGregorian: Date;
  modalRef: BsModalRef;
  sin: number;
  referenceNo: number;
  repayID: number;
  transactionId: string;
  uploadDocumentForm: FormGroup;
  uuid: string;
  validDocs = [];
  tempDocs = [];
  selectedDocument: DocumentItem;
  accessForActionPrivate = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_ACCESS;
  accessForActionPublic = [RoleIdEnum.SUBSCRIBER, RoleIdEnum.AUTH_PERSON, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];

  constructor(
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly location: Location,
    private modalService: BsModalService,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public modifyPensionService: ModifyBenefitService,
    public manageBenefitService: ManageBenefitService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly coreBenefitService: CoreBenefitService
  ) {}

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.imprisonmentForm = this.createImprisonmentForm();
    this.uploadDocumentForm = this.createUploadForm();
    this.route.queryParams.subscribe(params => {
      this.inImprisonmentEditMode = params.edit === 'true';
    });
    this.uuid = this.uuidGeneratorService.getUuid();
    this.transactionId = BenefitConstants.REQUEST_JAILED_IMPRISONMENT_ID;
    this.validDocs = new Array(2);
    if (!this.inImprisonmentEditMode) {
      this.getDocumentRelatedValues();
      this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
      if (this.activeBenefit) {
        this.sin = this.activeBenefit.sin;
        this.benefitRequestId = this.activeBenefit.benefitRequestId;
        this.referenceNo = this.activeBenefit.referenceNo;
      }
      this.imprisonmentDetails = this.modifyPensionService.getAnnuityDetails();
      if (this.imprisonmentDetails) {
        this.setMinimumDate(this.imprisonmentDetails);
      }
    } else {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.initialiseViewForEdit(payload);
      }
      this.getUploadedDocuments();
    }
  }

  setMinimumDate(imprisonmentDetails: AnnuityResponseDto) {
    this.minDateGregorian = moment(imprisonmentDetails?.imprisonmentPeriod?.enteringDate?.gregorian)
      .add(1, 'days')
      .toDate();
  }

  createImprisonmentForm() {
    return this.fb.group({
      releaseDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      })
    });
  }
  /** Method to autopopulate fields in edit mode */
  bindImprisonmentDetailsToForm(data: AnnuityResponseDto, formGroup: FormGroup) {
    if (data?.imprisonmentPeriod?.appliedReleaseDate?.gregorian) {
      formGroup
        .get('releaseDate')
        .get('gregorian')
        .setValue(new Date(data?.imprisonmentPeriod?.appliedReleaseDate?.gregorian));
    }
    formGroup.updateValueAndValidity();
    formGroup.markAsPristine();
  }
  /** Method to verify release date */
  verifyReleaseDate() {
    const verify = true;
    if (this.imprisonmentForm.valid) {
      if (!this.inImprisonmentEditMode) this.referenceNo = null;
      let releaseDate: GosiCalendar = new GosiCalendar();
      releaseDate = this.imprisonmentForm.get('releaseDate').value;
      releaseDate.gregorian = startOfDay(releaseDate.gregorian);
      const imprisonmentDetails = {
        enteringDate: this.imprisonmentDetails?.imprisonmentPeriod?.enteringDate,
        releaseDate: releaseDate,
        referenceNo: this.referenceNo
      };
      this.modifyPensionService
        .updateImprisonmentDetails(this.sin, this.benefitRequestId, imprisonmentDetails, verify)
        .subscribe(
          res => {
            this.imprisonmentVerifyRsp = res;
            if (this.imprisonmentVerifyRsp?.verified) {
              this.isSubmitDisable = false;
            } else {
              this.checkSubmitDisable();
            }
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessage(err);
              this.goToTop();
              this.isSubmitDisable = true;
            }
          }
        );
    } else {
      this.imprisonmentForm.markAllAsTouched();
    }
  }

  /** Method to reset imprisonment form */
  reset() {
    this.validDocs = [];
    this.tempDocs = [];
    this.imprisonmentVerifyRsp = null;
    this.imprisonmentForm.reset();
    this.checkSubmitDisable();
    this.getDocumentRelatedValues();
  }
  /** Method to call document api */
  getDocumentRelatedValues() {
    this.modifyPensionService.getReqDocsForModifyImprisonment(this.isAppPrivate).subscribe(res => {
      this.documentList = res;
      this.documentList.forEach(doc => {
        doc.canDelete = true;
      });
    });
  }
  initialiseViewForEdit(payload) {
    // collecting required data from payload
    this.sin = payload.socialInsuranceNo;
    this.benefitRequestId = payload.id;
    this.referenceNo = payload.referenceNo;
    this.repayID = payload.repayId;
    this.channel = payload.channel;
    this.role = payload.assignedRole;
    // calling the imprisonment api
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(this.sin, this.benefitRequestId, this.referenceNo)
      .subscribe(
        res => {
          this.imprisonmentDetails = res;
          this.bindImprisonmentDetailsToForm(this.imprisonmentDetails, this.imprisonmentForm);
          if (this.imprisonmentDetails) {
            this.setMinimumDate(this.imprisonmentDetails);
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  /**
   * Creating Upload Form and initialize
   */
  createUploadForm() {
    return this.fb.group({
      comments: []
    });
  }
  /** Method to submit modified imprisonment Details. */
  submit() {
    if (this.uploadDocumentForm.valid && this.imprisonmentForm.valid) {
      const verify = false;
      if (!this.inImprisonmentEditMode) this.referenceNo = null;
      let releaseDate: GosiCalendar = new GosiCalendar();
      releaseDate = this.imprisonmentForm.get('releaseDate').value;
      releaseDate.gregorian = startOfDay(releaseDate.gregorian);
      const imprisonmentDetails = {
        enteringDate: this.imprisonmentDetails?.imprisonmentPeriod?.enteringDate,
        releaseDate: releaseDate,
        referenceNo: this.referenceNo,
        uuid: this.uuid,
        comments: this.uploadDocumentForm.get('comments').value
      };
      if (!this.inImprisonmentEditMode) {
        this.modifyPensionService
          .updateImprisonmentDetails(this.sin, this.benefitRequestId, imprisonmentDetails, verify)
          .subscribe(
            res => {
              this.imprisonmentVerifyRsp = res;
              if (this.imprisonmentVerifyRsp?.message !== null) {
                this.alertService.showSuccess(this.imprisonmentVerifyRsp.message);
                this.coreBenefitService.setBenefitAppliedMessage(this.imprisonmentVerifyRsp.message);
              }
              this.router.navigate([BenefitConstants.ROUTE_INDIVIDUAL(this.manageBenefitService.socialInsuranceNo)]);
              // { state: { loadPageWithLabel: 'BENEFITS' } }
            },
            err => {
              if (err.status === 500 || err.status === 422 || err.status === 400) {
                this.showErrorMessage(err);
                this.goToTop();
              }
            }
          );
      } else {
        this.modifyPensionService
          .submitImprisonmentModifyDetails(this.sin, this.benefitRequestId, imprisonmentDetails, verify)
          .subscribe(
            res => {
              this.imprisonmentVerifyRsp = res;
              this.alertService.showSuccess(this.imprisonmentVerifyRsp.message);
              this.coreBenefitService.setBenefitAppliedMessage(this.imprisonmentVerifyRsp.message);
              if (
                this.role &&
                (this.role === this.rolesEnum.VALIDATOR_1 ||
                  this.role === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
                  this.role === 'Contributor')
              ) {
                this.saveWorkflowInEdit(this.uploadDocumentForm.get('comments').value);
              }
            },
            err => {
              if (err.status === 500 || err.status === 422 || err.status === 400) {
                this.showErrorMessage(err);
                this.goToTop();
              }
            }
          );
      }
    } else {
      markFormGroupTouched(this.uploadDocumentForm);
      markFormGroupTouched(this.imprisonmentForm);
    }
  }
  /** this fn will fetch the uploaded proof of payment doc  */
  getUploadedDocuments() {
    const transactionKey = UITransactionType.REQUEST_MODIFY_IMPRISONMENT_TRANSACTION;
    const transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.benefitDocumentService
      .getUploadedDocuments(this.benefitRequestId, transactionKey, transactionType, this.referenceNo)
      .subscribe(res => {
        this.documentList = res;
        this.documentList.forEach(doc => {
          if (doc.documentContent === null || doc.documentContent === 'NULL') {
            this.validDocs[doc?.sequenceNumber - 1] = 0;
          } else {
            this.validDocs[doc?.sequenceNumber - 1] = 1;
          }
        });
      });
  }
  /**
   * Method to perform feedback call after scanning.
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(document, this.benefitRequestId, undefined, undefined, undefined, undefined, this.uuid)
        .subscribe(res => {
          if (res) {
            document = res;
            if (document?.valid && this.validDocs) {
              this.validDocs[document?.sequenceNumber - 1] = 1;
            } else {
              this.validDocs[document?.sequenceNumber - 1] = 0;
            }
            this.checkSubmitDisable(document);
          }
        });
    }
  }
  /**method to chnage the disable status of a button */
  checkSubmitDisable(document?) {
    if (document?.valid === false) {
      this.validDocs[document?.sequenceNumber - 1] = 0;
    }
    if (this.uploadDocumentForm?.valid && this.imprisonmentForm?.valid) {
      this.tempDocs = this.validDocs?.filter(item => item === 1);
      if (this.tempDocs?.length > 0) {
        this.isSubmitDisable = false;
      } else {
        this.isSubmitDisable = true;
      }
    } else {
      this.isSubmitDisable = true;
    }
  }
  docUploadStatus(document: DocumentItem) {
    if (document.documentContent === null || document.documentContent === 'NULL') {
      this.validDocs[document?.sequenceNumber - 1] = 0;
    } else {
      this.validDocs[document?.sequenceNumber - 1] = 1;
    }
    if (this.uploadDocumentForm?.valid && this.imprisonmentForm?.valid) {
      this.tempDocs = this.validDocs?.filter(item => item === 1);
      if (this.tempDocs?.length > 0) {
        this.isSubmitDisable = false;
      } else {
        this.isSubmitDisable = true;
      }
    } else {
      this.isSubmitDisable = true;
    }
  }
  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(comments: string) {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.comments = comments;
    workflowData.taskId = this.routerDataToken.taskId;
    workflowData.user = this.routerDataToken.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    this.manageBenefitService.updateAnnuityWorkflow(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.manageBenefitService.navigateToInbox();
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  /** Helper functions */
  /**
   * Method to enable form control.
   * @param formControl form control
   */
  enableField(formControl: AbstractControl) {
    formControl.setValidators([Validators.required]);
    formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }

  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /** Wrapper method to scroll to top of modal*/
  goToTop() {
    scrollToTop();
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    if (this.inImprisonmentEditMode) {
      this.location.back();
    } else {
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT], {
        queryParams: {
          fromJailed: true
        }
      });
    }
  }
  // @param err This method to show the page level error
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err.error.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err.error.message);
    }
  }

  /** this fn will be automatically executed when user leave/redirect from the page */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
