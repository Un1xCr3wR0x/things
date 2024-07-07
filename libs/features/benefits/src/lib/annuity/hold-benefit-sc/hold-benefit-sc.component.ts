/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  Lov,
  BilingualText,
  WizardItem,
  LovList,
  ApplicationTypeEnum,
  scrollToTop,
  markFormGroupTouched,
  DocumentItem,
  BPMUpdateRequest,
  WorkFlowActions,
  CoreActiveBenefits
} from '@gosi-ui/core';
import {
  BenefitResponse,
  ActiveBenefits,
  BenefitConstants,
  showErrorMessage,
  clearAlerts,
  EachBenefitHeading,
  StopSubmitRequest,
  UITransactionType,
  HoldPensionDetails,
  HoldBenefit,
  AnnuityResponseDto,
  HoldBenefitHeading,
  HoldBenefitDetails
} from '../../shared';
import { AnnuityBaseComponent } from '../base/annuity.base-component';
import { ProgressWizardDcComponent, BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import moment from 'moment-timezone';

@Component({
  selector: 'bnt-hold-benefit-sc',
  templateUrl: './hold-benefit-sc.component.html',
  styleUrls: ['./hold-benefit-sc.component.scss']
})
export class HoldBenefitScComponent extends AnnuityBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  repayNotesMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  activeBenefitDetails: AnnuityResponseDto;
  holdReasonForm: FormGroup;
  reasonList: BilingualText[];
  reasonRes: BilingualText[];
  uploadDocumentForm: FormGroup;
  reasonForHold: BilingualText;

  holdWizards: WizardItem[] = [];
  requestDetailsForm: FormGroup;
  stopReasonForm: FormGroup;
  reasonListSorted: LovList;
  sin: number;
  referenceNumber: number;
  activeBenefit: CoreActiveBenefits;
  holdResponse: BenefitResponse;
  holdDetails: HoldBenefitDetails;
  heading: string;
  holdHeading: string;
  inHoldEditMode = false;
  stopNotesMaxLength = BenefitConstants.REPAY_NOTES_MAX_LENGTH;
  holdTransactionConstant = BenefitConstants.HOLD_BENEFIT_CONSTANT;
  holdTransactionType = UITransactionType.REQUEST_HOLD_TRANSACTION;

  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('holdBenefitWizard', { static: false })
  holdBenefitWizard: ProgressWizardDcComponent;
  @ViewChild('brdcmb', { static: false })
  holdBnftBrdcmb: BreadcrumbDcComponent;
  documentuuid: string;
  holdBenefitId = 'HOLD_BENEFIT';
  holdBenefitDetails: HoldPensionDetails;

  benefitAmount: number;
  dependantAmount: number;
  totalBenefitAmount: number;
  finalAverageWage: number;
  isPrevClicked: boolean;

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.route.queryParams.subscribe(params => {
      this.inHoldEditMode = params.edit === 'true';
    });
    this.getSystemRunDate();
    this.initializeWizardDetails();
    this.getModificationReason();
    this.holdReasonForm = this.createReasonForm();
    if (!this.inHoldEditMode) {
      this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
      this.setActiveBenefitValues();
      this.heading = new EachBenefitHeading(this.benefitType).getHeading();
      this.holdHeading = new HoldBenefitHeading(this.benefitType).getHeading();
      this.getBenefitDetails();
    } else {
      if (this.routerData.payload) {
        const payload = JSON.parse(this.routerData.payload);
        this.initialiseViewForEdit(payload);
        this.getHoldDetailsForEdit();
        // this.getSystemParamAndRundate();
      }
    }
  }

  ngAfterViewInit() {
    if (this.route.routeConfig) {
      this.route.routeConfig.data = { breadcrumb: this.holdHeading };
      this.holdBnftBrdcmb.breadcrumbs = this.holdBnftBrdcmb.buildBreadCrumb(this.route.root);
    }
  }

  setActiveBenefitValues() {
    if (this.activeBenefit) {
      this.sin = this.activeBenefit.sin;
      this.benefitRequestId = this.activeBenefit.benefitRequestId;
      this.referenceNo = this.activeBenefit.referenceNo;
      this.benefitType = this.activeBenefit.benefitType?.english;
    }
  }

  initialiseViewForEdit(payload) {
    // collecting required data from payload
    this.sin = payload.socialInsuranceNo;
    this.benefitRequestId = payload.id;
    this.referenceNo = payload.referenceNo;
    this.channel = payload.channel;
    this.role = payload.assignedRole;
  }

  getBenefitDetails() {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(this.sin, this.benefitRequestId, this.referenceNo)
      .subscribe(
        res => {
          if (this.isValidator) {
            this.benefitPropertyService
              .validatorEditCall(this.sin, this.benefitRequestId, this.referenceNo)
              .subscribe();
          }
          this.activeBenefitDetails = res;
          this.benefitAmount = this.activeBenefitDetails.benefitAmount;
          this.dependantAmount = this.activeBenefitDetails.dependentAmount;
          this.totalBenefitAmount = this.activeBenefitDetails.finalBenefitAmount;
          this.finalAverageWage = this.activeBenefitDetails.finalAverageWage;
        },
        err => {
          if (err.status === 500 || err.status === 422 || err.status === 400) {
            this.showErrorMessages(err);
            this.goToTop();
          }
        }
      );
    // this.dependentService.getBenefitHistory(this.sin, this.benefitRequestId).subscribe(
    //   res => {
    //     this.activeBenefitDetails = res[0];
    //     this.benefitAmount = this.activeBenefitDetails.amount;
    //     this.dependantAmount = this.activeBenefitDetails.dependentAmount;
    //     this.totalBenefitAmount = this.activeBenefitDetails.totalBenefitAmount;
    //     this.finalAverageWage = this.activeBenefitDetails.finalAverageWage;
    //   },
    //   err => {
    //     if (err.status === 500 || err.status === 422 || err.status === 400) {
    //       this.showErrorMessages(err);
    //       this.goToTop();
    //     }
    //   }
    // );
  }

  getHoldDetailsForEdit() {
    this.modifyBenefitService.getHoldBenefitDetails(this.sin, this.benefitRequestId, this.referenceNo).subscribe(
      res => {
        this.heading = new EachBenefitHeading(res.pension?.annuityBenefitType?.english).getHeading();
        this.holdHeading = new HoldBenefitHeading(res.pension?.annuityBenefitType?.english).getHeading();
        if (this.route.routeConfig) {
          this.route.routeConfig.data = { breadcrumb: this.holdHeading };
          this.holdBnftBrdcmb.breadcrumbs = this.holdBnftBrdcmb.buildBreadCrumb(this.route.root);
        }
        const reason = res.reason;
        this.holdDetails = res;
        this.benefitAmount = res.pension.benefitAmount;
        this.dependantAmount = res.pension.dependantAmount;
        this.totalBenefitAmount = res.pension.totalBenefitAmount;
        this.finalAverageWage = res.pension.finalAverageWage;
        this.holdReasonForm.get('reason').get('english').setValue(reason.english);
        this.holdReasonForm.get('reason').get('arabic').setValue(reason.arabic);
        this.holdReasonForm.get('requestDate').get('gregorian').setValue(moment(res.requestDate.gregorian).toDate());
        this.holdReasonForm.get('notes').patchValue(res.notes);
      },
      err => {
        this.showError(err);
      }
    );
  }

  createReasonForm() {
    return this.fb.group({
      reason: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      requestDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: [null]
      }),
      notes: [null, Validators.required]
    });
  }

  getModificationReason() {
    this.sanedBenefitService.getSanedHoldReasons().subscribe(res => {
      this.reasonRes = res;
      this.reasonList = this.reasonRes;
      // this.reasonRes.forEach((value, reasonIndex) => {
      //   const lov = new Lov();
      //   lov.sequence = reasonIndex;
      //   lov.value = value;
      //   this.reasonList.push(lov);
      // });
    });

    // this.reasonRes = [{ "arabic": "الإشعار السنوي غير متاح", "english": "Annual notification not available" }, { "arabic": "الكشف الطبي معلق", "english": "Medical assessment pending" }, { "arabic": "لم يتم تحديث وفاة الوريث في مركز المعلومات الوطني", "english": "Heir Death is not updated in NIC" }];
    // this.reasonRes.forEach((value, reasonIndex) => {
    //   const lov = new Lov();
    //   lov.sequence = reasonIndex;
    //   lov.value = value;
    //   this.reasonList.push(lov);
    // });
    // console.log("reasonList is", this.reasonList);
  }

  /*** this function will fetch the Lov list required for stop reasons */
  getLookupValues() {
    this.manageBenefitService.getHoldReasonLovList().subscribe(res => {
      const reasonlist: Lov[] = res;
      this.reasonListSorted = new LovList(reasonlist);
    });
  }
  /** Method to initialize the navigation wizards. */
  initializeWizardDetails() {
    this.holdWizards = this.wizardService.getHoldWizardItems();
    this.holdWizards[0].isActive = true;
    this.holdWizards[0].isDisabled = false;
  }
  docUploadSuccess(event) {
    this.submitHoldDetailsFn();
  }
  submitHoldDetailsFn() {
    const submitValues: StopSubmitRequest = {
      comments: this.documentForm.get('uploadDocument').get('comments').value,
      referenceNo: this.referenceNumber
    };
    if (!this.inHoldEditMode) {
      this.modifyBenefitService
        .submitHoldDetails(this.sin, this.benefitRequestId, this.referenceNumber, submitValues)
        .subscribe(res => {
          this.holdResponse = res;
          if (this.holdResponse?.message !== null) {
            this.alertService.showSuccess(this.holdResponse.message);
          }
          this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
        });
    } else {
      this.modifyBenefitService
        .submitHoldDetails(this.sin, this.benefitRequestId, this.referenceNumber, submitValues)
        .subscribe(
          res => {
            this.holdResponse = res;
            if (
              this.role &&
              (this.role === this.rolesEnum.VALIDATOR_1 ||
                this.role === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
                this.role === 'Contributor')
            ) {
              this.saveWorkflowInEdit();
            }
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessages(err);
              this.goToTop();
            }
          }
        );
    }
  }
  submitStopped() {
    const submitValues: StopSubmitRequest = {
      comments: this.documentForm.get('uploadDocument').value,
      referenceNo: this.referenceNumber
    };
    this.modifyBenefitService.submitStoppedDetails(this.sin, this.benefitRequestId, submitValues).subscribe(res => {
      this.holdResponse = res;
      if (this.holdResponse?.message !== null) {
        this.alertService.showSuccess(this.holdResponse.message);
      }
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    });
  }

  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit() {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
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

  /**
   * Method to perform feedback call after scanning.
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.benefitRequestId,
          this.holdBenefitId,
          this.holdTransactionType,
          this.referenceNumber,
          undefined,
          this.documentuuid
        )
        .subscribe(res => {
          if (res) {
            document = res;
          }
        });
    }
  }
  saveAndNext() {
    if (this.holdReasonForm.invalid) {
      this.alertService.clearAllErrorAlerts();
      markFormGroupTouched(this.holdReasonForm);
    } else {
      // const stopValues: StopBenefitRequest = {
      //   requestDate: this.requestDetailsForm.get('requestDate').get('gregorian').value,
      //   reason: this.stopReasonForm.get('stopReason').value,
      //   deathDate: this.stopReasonForm.get('stopReasonDate').get('gregorian').value,
      //   notes: this.stopReasonForm.get('stopNotes').value,
      // };
      const holdDtls: HoldBenefit = this.holdReasonForm.value;
      // const holdDtls: HoldBenefit = {
      //   requestDate: this.holdReasonForm.get('requestDate').get('gregorian').value,
      //   reason: this.holdReasonForm.get('reason').value,
      //   notes: this.holdReasonForm.get('notes').value
      // };
      if (this.inHoldEditMode) {
        holdDtls.referenceNo = this.referenceNo;
      }
      this.modifyBenefitService.holdBenefitDetails(this.sin, this.benefitRequestId, holdDtls).subscribe(
        res => {
          this.holdResponse = res;
          this.referenceNumber = res?.referenceNo;
          if (this.holdResponse?.message != null) {
            this.showSuccessMessage(this.holdResponse.message);
          }
          //  this.getDocuments(UITransactionType.REQUEST_HOLD_TRANSACTION, UITransactionType.FO_REQUEST_SANED, this.benefitRequestId, this.referenceNumber);
          this.nextForm();
        },
        err => {
          if (err.status === 500 || err.status === 422 || err.status === 400) {
            this.showErrorMessages(err);
            this.goToTop();
          }
        }
      );
    }
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(template);
  }
  /** Method to handle cancellation of transaction. */
  cancelTransactions(canceltemplate: TemplateRef<HTMLElement>) {
    //this.showModal(this.confirmTemplate);
    this.commonModalRef = this.modalService.show(canceltemplate);
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
  }
  /** Method to confirm cancellation of the form. */
  confirm() {
    this.commonModalRef.hide();
    this.modifyBenefitService.revertHoldBenefit(this.sin, this.benefitRequestId, this.referenceNumber).subscribe(
      () => {
        if (this.inHoldEditMode) {
          this.manageBenefitService.navigateToInbox();
        } else {
          this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
        }
      },
      () => {
        this.goToTop();
      }
    );
  }
  confirmApplyCancel() {
    this.commonModalRef.hide();
    if (this.isPrevClicked === true) {
      this.revertHoldBenefitFn();
    }
    if (this.inHoldEditMode) {
      this.manageBenefitService.navigateToInbox();
    } else {
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    }
  }
  revertHoldBenefitFn() {
    this.modifyBenefitService.revertHoldBenefit(this.sin, this.benefitRequestId, this.referenceNumber).subscribe();
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
  //This method is to decline cancellation of transaction
  decline() {
    this.commonModalRef.hide();
  }
  /*  Back button Route while displaying an injury */
  routeBack() {
    this.location.back();
  }
  /*
   * This method is to select wizard
   */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  /** Method to navigate back to previous section. */
  previousFormDetails() {
    // this.revertHoldBenefitFn();
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.holdBenefitWizard.setPreviousItem(this.currentTab);
    this.isPrevClicked = true;
  }
  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab = 1;
    if (this.holdBenefitWizard) this.holdBenefitWizard.setNextItem(this.currentTab);
    scrollToTop();
    this.navigateDocWizard();
  }
  navigateDocWizard() {
    if (this.inHoldEditMode) {
      this.getDocuments(
        UITransactionType.REQUEST_HOLD_TRANSACTION,
        UITransactionType.FO_REQUEST_SANED,
        this.benefitRequestId,
        this.referenceNumber
      );
    }
    if (!this.inHoldEditMode && !this.isPrevClicked) {
      this.modifyBenefitService.getReqDocsForHoldBenefit(this.isAppPrivate).subscribe(res => {
        this.requiredDocs = res;
        this.requiredDocs?.forEach(doc => {
          doc.canDelete = true;
        });
      });
    }
  }
  /** this fn will be automatically executed when user leave/redirect from the page */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
