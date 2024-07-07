import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  ApplicationTypeEnum,
  BilingualText,
  BPMUpdateRequest,
  convertToStringDDMMYYYY,
  DocumentItem,
  GosiCalendar,
  Lov,
  LovList,
  markFormGroupTouched,
  scrollToTop,
  startOfDay,
  WizardItem,
  WorkFlowActions,
  minDateValidator,
  CoreActiveBenefits
} from '@gosi-ui/core';
import { BreadcrumbDcComponent, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import moment from 'moment';
import {
  ActiveBenefits,
  AnnuityResponseDto,
  BenefitConstants,
  BenefitResponse,
  clearAlerts,
  EachBenefitHeading,
  HoldBenefitDetails,
  showErrorMessage,
  StopBenefitHeading,
  StopBenefitRequest,
  StopSubmitRequest
} from '../../shared';
import { AnnuityBaseComponent } from '../base/annuity.base-component';

@Component({
  selector: 'bnt-stop-benefit-sc',
  templateUrl: './stop-benefit-sc.component.html',
  styleUrls: ['./stop-benefit-sc.component.scss']
})
export class StopBenefitScComponent extends AnnuityBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  stopWizards: WizardItem[] = [];
  requestDetailsForm: FormGroup;
  stopReasonForm: FormGroup;
  validDate: string;
  reasonListSorted: LovList;
  reason: BilingualText;
  sin: number;
  referenceNumber: number;
  activeBenefitDetails: AnnuityResponseDto;
  activeBenefit: CoreActiveBenefits;
  stopResponse: BenefitResponse;
  stopDetails: HoldBenefitDetails;
  heading: string;
  stopHeading: string;
  inStopEditMode = false;
  isPrevClicked = false;
  minReqDate: Date;
  maxDate: Date = new Date();
  isEligibileReqDate: boolean;
  requestDateFormat: moment.Moment;
  stopBenefitId = 'STOP_BENEFIT';
  stopBenefitType: string;
  documentuuid: string;
  stopNotesMaxLength = BenefitConstants.REPAY_NOTES_MAX_LENGTH;
  stopTransactionConstant = BenefitConstants.STOP_TRANSACTION_CONSTANT;

  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('stopBenefitWizard', { static: false })
  stopBenefitWizard: ProgressWizardDcComponent;
  @ViewChild('brdcmb', { static: false })
  stopBenefitBrdcmb: BreadcrumbDcComponent;
  startDate: string;

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.route.queryParams.subscribe(params => {
      this.inStopEditMode = params.edit === 'true';
    });
    this.stopBenefitType = this.isAppPrivate ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
    this.getSystemRunDate();
    this.initializeWizardDetails();
    this.getLookupValues();
    this.getFormValues();
    // this.maxDate = moment(new Date()).toDate();
    if (!this.inStopEditMode) {
      this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
      this.setActiveBenefitValues();
      this.heading = new EachBenefitHeading(this.benefitType).getHeading();
      this.stopHeading = new StopBenefitHeading(this.benefitType).getHeading();
      // this.requestDetailsForm.get('requestDate.gregorian').patchValue(this.maxDate);
      this.getBenefitDetails();
    } else {
      if (this.routerData.payload) {
        const payload = JSON.parse(this.routerData.payload);
        this.initialiseViewForEdit(payload);
        this.getStopBenefitDetailsForEdit();
        this.getBenefitDetails();
      }
    }
    //this.alertService.showWarningByKey('BENEFITS.REQUEST-DATE-ALERT');
  }
  ngAfterViewInit() {
    if (this.route.routeConfig) {
      this.route.routeConfig.data = { breadcrumb: this.stopHeading };
      this.stopBenefitBrdcmb.breadcrumbs = this.stopBenefitBrdcmb.buildBreadCrumb(this.route.root);
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
  getFormValues() {
    this.requestDetailsForm = this.createrequestDetailsForm();
    this.stopReasonForm = this.createstopReasonForm();
    this.stopReasonForm
      .get('stopReason')
      .valueChanges.subscribe(() => this.stopReasonForm.get('stopReasonDate').reset());
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
          //this.minReqDate = new Date(this.activeBenefitDetails?.benefitStartDate?.gregorian);
        },
        err => {
          if (err.status === 500 || err.status === 422 || err.status === 400) {
            this.showErrorMessages(err);
            this.goToTop();
          }
        }
      );
  }
  getStopReasonDate(value: string) {
    if (value === 'Beneficiary is dead' && !this.inStopEditMode && this.activeBenefitDetails?.deathDate) {
      this.stopReasonForm
        .get('stopReasonDate')
        ?.get('gregorian')
        .setValue(new Date(this.activeBenefitDetails?.deathDate?.gregorian));
    }
  }
  // fetch stop benefit details
  getStopBenefitDetailsForEdit() {
    this.modifyBenefitService.getstopDetails(this.sin, this.benefitRequestId, this.referenceNo).subscribe(
      res => {
        this.benefitType = res?.pension?.annuityBenefitType?.english;
        this.stopDetails = res;
        this.reason = this.stopDetails?.reason;
        this.heading = new EachBenefitHeading(this.stopDetails?.pension?.annuityBenefitType?.english).getHeading();
        this.stopHeading = new StopBenefitHeading(this.stopDetails?.pension?.annuityBenefitType?.english).getHeading();
        if (this.route.routeConfig) {
          this.route.routeConfig.data = { breadcrumb: this.stopHeading };
          this.stopBenefitBrdcmb.breadcrumbs = this.stopBenefitBrdcmb.buildBreadCrumb(this.route.root);
        }
        this.requestDetailsForm
          .get('requestDate')
          .get('gregorian')
          .setValue(moment(res?.requestDate?.gregorian).toDate());
        //this.stopReasonForm.get('stopReason.arabic').setValue(this.reason?.arabic);
        this.stopReasonForm.get('stopReason.english').setValue(this.reason?.english); // need to change to english
        this.stopReasonForm.get('stopReasonDate').get('gregorian').setValue(new Date(res?.eventDate?.gregorian));
        this.stopReasonForm.get('stopNotes').patchValue(res?.notes);
      },
      err => {
        this.showError(err);
      }
    );
  }
  createrequestDetailsForm() {
    return this.fb.group({
      requestDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      })
    });
  }
  createstopReasonForm() {
    return this.fb.group({
      stopReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      stopReasonDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      }),
      stopNotes: [null]
    });
  }
  DateCheck() {
    this.validDate = convertToStringDDMMYYYY(
      moment(this.requestDetailsForm.get('requestDate').get('gregorian').value).toString()
    );
    this.startDate = convertToStringDDMMYYYY(moment(this.activeBenefitDetails?.benefitStartDate?.gregorian).toString());
    if (this.validDate === this.startDate) {
      return 1;
    } else {
      return 0;
    }
  }
  /*** this function will fetch the Lov list required for stop reasons */
  getLookupValues() {
    this.manageBenefitService.getStopReasonLovList().subscribe(res => {
      const reasonlist: Lov[] = res;
      this.reasonListSorted = new LovList(reasonlist);
    });
  }
  /** Method to initialize the navigation wizards. */
  initializeWizardDetails() {
    this.stopWizards = this.wizardService.getstopWizardItems();
    this.stopWizards[0].isActive = true;
    this.stopWizards[0].isDisabled = false;
  }
  docUploadSuccess() {
    this.submitStopped();
  }
  submitStopped() {
    const submitValues: StopSubmitRequest = {
      comments: this.documentForm.get('uploadDocument').get('comments').value,
      referenceNo: this.referenceNumber
    };
    if (!this.inStopEditMode) {
      this.modifyBenefitService.submitStoppedDetails(this.sin, this.benefitRequestId, submitValues).subscribe(res => {
        this.stopResponse = res;
        if (this.stopResponse?.message !== null) {
          this.alertService.showSuccess(this.stopResponse.message);
        }
        this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      });
    } else {
      this.modifyBenefitService.submitStoppedDetails(this.sin, this.benefitRequestId, submitValues).subscribe(
        res => {
          this.stopResponse = res;
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
          this.stopBenefitId,
          this.stopBenefitType,
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
    if (this.requestDetailsForm.invalid && this.stopReasonForm.invalid) {
      this.alertService.clearAllErrorAlerts();
      markFormGroupTouched(this.requestDetailsForm);
      markFormGroupTouched(this.stopReasonForm);
    } else {
      const stopValues = new StopBenefitRequest();
      if (!stopValues.requestDate) {
        stopValues.requestDate = new GosiCalendar();
      }
      if (!stopValues.eventDate) {
        stopValues.eventDate = new GosiCalendar();
      }
      stopValues.requestDate.gregorian = startOfDay(
        this.requestDetailsForm?.get('requestDate')?.get('gregorian')?.value
      );
      stopValues.requestDate.hijiri = null;
      stopValues.reason = this.stopReasonForm.get('stopReason').value;
      stopValues.eventDate.gregorian = startOfDay(this.stopReasonForm?.get('stopReasonDate')?.get('gregorian')?.value);
      stopValues.eventDate.hijiri = null;
      stopValues.notes = this.stopReasonForm.get('stopNotes').value;
      this.reqDateCheck(stopValues.requestDate, stopValues.eventDate);
      if (this.inStopEditMode) {
        stopValues.referenceNo = this.referenceNo;
      }
      if (this.isEligibileReqDate) {
        this.modifyBenefitService.saveStopDetails(this.sin, this.benefitRequestId, stopValues).subscribe(
          res => {
            this.stopResponse = res;
            this.referenceNumber = res?.referenceNo;
            if (this.stopResponse?.message != null) {
              this.showSuccessMessage(this.stopResponse.message);
            }
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
  }
  reqDateCheck(reqDate: GosiCalendar, eventDate: GosiCalendar) {
    this.requestDateFormat = moment(reqDate?.gregorian?.toString()); //Death or Missing Date
    this.isEligibileReqDate = this.requestDateFormat.isSameOrAfter(moment(eventDate?.gregorian.toString()));
    if (this.isEligibileReqDate) {
      return this.isEligibileReqDate;
    } else {
      this.alertService.showErrorByKey('BENEFITS.REQUEST-DATE-ELIGIBLE-ALERT');
      return this.isEligibileReqDate;
    }
  }
  /* Method to intialise the view in edit mode */
  initialiseViewForEdit(payload) {
    // collecting required data from payload
    this.sin = payload.socialInsuranceNo;
    this.benefitRequestId = payload.id;
    this.referenceNo = payload.referenceNo;
    this.channel = payload.channel;
    this.role = payload.assignedRole;
    // this.benefitType = payload.benefitType;
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
    this.modifyBenefitService.revertStopBenefit(this.sin, this.benefitRequestId, this.referenceNumber).subscribe(
      () => {
        if (this.inStopEditMode) {
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
      this.modifyBenefitService.revertStopBenefit(this.sin, this.benefitRequestId, this.referenceNumber).subscribe();
    }
    if (this.inStopEditMode) {
      this.manageBenefitService.navigateToInbox();
    } else {
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    }
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
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.stopBenefitWizard.setPreviousItem(this.currentTab);
    this.isPrevClicked = true;
  }
  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab = 1;
    if (this.stopBenefitWizard) this.stopBenefitWizard.setNextItem(this.currentTab);
    scrollToTop();
    this.navigateDocWizard();
  }
  navigateDocWizard() {
    if (!this.inStopEditMode && !this.isPrevClicked) {
      this.modifyBenefitService
        .getReqDocsForStopBenefit(this.sin, this.benefitRequestId, this.referenceNumber)
        .subscribe(res => {
          this.requiredDocs = res;
          this.requiredDocs?.forEach(doc => {
            doc.canDelete = true;
          });
        });
    }
    if (this.inStopEditMode) {
      this.getUploadedDocuments();
    }
  }
  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.sin,
      this.benefitRequestId,
      { english: this.benefitType, arabic: this.benefitType },
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  getUploadedDocuments() {
    const transactionKey = 'STOP_BENEFIT';
    const transactionType = this.isAppPrivate ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
    this.benefitDocumentService
      .getStopBenefitDocuments(this.sin, this.benefitRequestId, this.referenceNo, transactionKey, transactionType)
      .subscribe(res => {
        this.requiredDocs = res;
        this.requiredDocs?.forEach(doc => {
          doc.canDelete = true;
        });
      });
  }
  /** this fn will be automatically executed when user leave/redirect from the page */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
