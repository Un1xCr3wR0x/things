/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  BPMUpdateRequest,
  DocumentService,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  StorageService,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PenaltyWaiverBaseScComponent } from '../../../shared/components';
import { BillingConstants, RouteConstants } from '../../../shared/constants';
import { ReceiptApprovalStatus, TransactionOutcome } from '../../../shared/enums';
import {
  EstablishmentDetails,
  PaymentResponse,
  PenalityWavier,
  PenaltyWaiverRequest,
  PreviousInstallment
} from '../../../shared/models';
import {
  BillingRoutingService,
  ContributionPaymentService,
  EstablishmentService,
  InstallmentService,
  PenalityWavierService
} from '../../../shared/services';
import { Location } from '@angular/common';
@Component({
  selector: 'blg-penalty-waiver-sc',
  templateUrl: './penalty-waiver-sc.component.html',
  styleUrls: ['./penalty-waiver-sc.component.scss']
})
export class PenaltyWaiverScComponent extends PenaltyWaiverBaseScComponent implements OnInit, OnDestroy {
  //View Child components
  @ViewChild('tranactionAllowed', { static: true })
  tranactionAllowed: TemplateRef<HTMLElement>;
  /**
   * Local variables.
   * */
  paymentResponse: PaymentResponse = new PaymentResponse();
  establishmentDetails: EstablishmentDetails;
  lang = 'en';
  wavierDetails: PenalityWavier;
  previousNewInstallments: PreviousInstallment[];
  warningMessageOne: BilingualText;
  warningMessageTwo: BilingualText;
  warningMessageThree: BilingualText;
  warningMessageFour: BilingualText;
  warningMessageFive: BilingualText;
  warningMessageSeven: BilingualText;
  warningMessageEight: BilingualText;
  previousInstallment: PreviousInstallment[];
  documentTransactionId = BillingConstants.PENALTY_WAIVER_DOCUMENT_TRANSACTION_ID;
  disableSubmit = false;
  isError = false;
  isPpa: boolean;


  /**
   *
   * @param establishmentService
   * @param router
   * @param documentService
   * @param modalService
   * @param routingService
   * @param language
   * @param routerDataToken
   * @param appToken
   * @param penalityWavierService
   * @param storageService
   * @param uuidGeneratorService
   * @param workflowService
   * @param installmentService
   * @param contributionPaymentService
   * @param alertService
   * @param route
   */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    readonly storageService: StorageService,
    private uuidGeneratorService: UuidGeneratorService,
    readonly workflowService: WorkflowService,
    readonly installmentService: InstallmentService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly alertService: AlertService,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerToken: RouterData,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly routingService: BillingRoutingService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly penalityWavierService: PenalityWavierService,
    readonly location: Location
  ) {
    super(
      alertService,
      documentService,
      route,
      routerToken,
      modalService,
      penalityWavierService,
      router,
      routingService,
      location
    );
  }

  /** This method handles initializaton task. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    }, noop);
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.identifyModeOfTransaction();
    if (!this.csrFlag) {
      if (this.routerToken.assignedRole === 'GDIC') {
        this.isGDIC = this.gracePeriodFlag = true;
      } else {
        this.isGDIC = false;
      }
      if (this.routerToken.payload) {
        const payload = JSON.parse(this.routerToken.payload);
        this.isValidator = true;
        this.idNumber = payload.registrationNo;
        this.penaltyWaiveId = payload.waiverId ? Number(payload.waiverId) : null;
        this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
        this.getEstablishmentDetails(this.idNumber);
        this.getRequiredDocument();
      }
    } else {
      /**UUID generator for scan and upload */
      this.isValidator = false;
      this.uuid = this.uuidGeneratorService.getUuid(); // Should not generate uuid for validator view
      if (!this.isAppPrivate) {
        this.getEstablishmentDetails(Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY)));
      } else {
        this.idNumber = this.establishmentRegistrationNo.value;
        this.getEstablishmentDetails(this.idNumber);
      }
    }
  }
  /**
   * this method is used to get details for validator edit
   * */
  getDataForValidatorEdit(registrationNumber) {
    if (this.penaltyWaiveId && registrationNumber) {
      this.penalityWavierService
        .getWavierPenalityDetailsForView(registrationNumber, this.penaltyWaiveId)
        .pipe(
          tap(res => {
            this.wavierDetails = res;
            this.csrFlag = false;
          }),
          catchError(err => {
            this.alertService.showError(err.error.message);
            this.handleError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }

  /**
   * Method to get installment details
   * */
  getInstallmentDetails(registrationNo: number) {
    this.installmentService.getInstallmentactive(registrationNo, false)?.subscribe(res => {
      if (res && res['installmentDetails']) this.previousInstallment = res['installmentDetails'];
      this.previousNewInstallments = this.previousInstallment.filter(
        value => value?.status?.english === ReceiptApprovalStatus.NEW
      );
      if (this.previousNewInstallments?.length === 0) this.searchResult = false;
      else if (this.previousNewInstallments?.length > 0) this.warningMessageListSix = true;
      if (this.warningMessageListSix && !this.isError) this.getModalView();
    });
  }
  /**
   * This method is used to search establishment details.
   * @param idNumber
   */
  getPenalityAccountDetails() {
    if (!this.isValidator) {
      this.penalityWavierService
        .getWavierPenalityDetails(this.idNumber, 'NORMAL')
        .pipe(
          tap(
            res => {
              this.searchResult = false;
              this.alertService.clearAlerts();
              this.wavierDetails = res;
              this.exceptionalSocietyFlag = this.wavierDetails.exceptionalSociety;
            },
            err => {
              this.isError = true;
              err.error.details?.forEach(element => {
                switch(element.message.english) {
                  case BillingConstants.WARNING_ONE:
                    this.warningMessageOne = element.message;
                    this.warningMessageListOne = true;
                    break;
                  case BillingConstants.WARNING_TWO:
                    this.warningMessageListTwo = true;
                    this.warningMessageTwo = element.message;
                    break;
                  case BillingConstants.WARNING_THREE:
                    this.warningMessageListThree = true;
                    this.warningMessageThree = element.message;
                    break;
                  case BillingConstants.WARNING_FOUR:
                    this.warningMessageListFour = true;
                    this.warningMessageFour = element.message;
                    break;
                  case BillingConstants.WARNING_FIVE:
                    this.warningMessageListFive = true;
                    this.warningMessageFive = element.message;
                    break;
                  case BillingConstants.WARNING_SEVEN:
                    this.warningMessageListEight = true;
                    this.warningMessageSeven = element.message;
                    break;
                  case BillingConstants.WARNING_ELEVEN:
                    this.warningMessageListEight = true;
                    this.warningMessageSeven = element.message;
                    break;
                  case BillingConstants.WARNING_TWELVE:
                    this.warningMessageListTwelve = true;
                    this.warningMessageEight = element.message;
                }
                if (this.isEstRegistered) this.getModalView();
              });
              this.isError = true;
              this.alertService.showError(err.error.message);
              this.disableSubmit = true;
            }
          )
        )
        .subscribe(() => {
          this.getRequiredDocument();
        });
    }
    this.getInstallmentDetails(this.idNumber);
  }
  /**
   * Method is used to get waive establishment penalty details
   * */
  getEstablishmentDetails(idNumber) {
    this.establishmentService
      .getEstablishment(idNumber)
      .pipe(
        tap(
          res => {
            this.establishmentDetails = res;
            this.isPpa = this.establishmentDetails.ppaEstablishment;
            this.idNumber = idNumber;
            if(!this.isAppPrivate){
            if (this.establishmentDetails?.status?.english === BillingConstants.REG_STATUS || BillingConstants.REOPENED_STATUS) {
              this.isEstRegistered = true;
              this.alertService.clearAlerts();
              this.contributionPaymentService.getWorkFlowStatus(idNumber).subscribe(response => {
                if (response.length !== 0) {
                  response.forEach(value => {
                    if (value && !this.establishmentDetails?.gccCountry) {
                      if (value.type === BillingConstants.CHANGE_OWNER) {
                        this.alertService.showErrorByKey('BILLING.CHANGE-IN-OWNER');
                      } else this.getPenalityAccountDetails();
                    } else this.getPenalityAccountDetails();
                  });
                } else this.getPenalityAccountDetails();
              });
              this.getPenalityAccountDetails();
              this.getInstallmentDetails(idNumber);
              if (this.isValidator) this.getDataForValidatorEdit(idNumber);
            }
          }
            else if (this.establishmentDetails?.status?.english === BillingConstants.REG_STATUS || BillingConstants.REOPENED_STATUS || this.establishmentDetails?.status?.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS) {
              this.isEstRegistered = true;
              this.alertService.clearAlerts();
              this.contributionPaymentService.getWorkFlowStatus(idNumber).subscribe(response => {
                if (response.length !== 0) {
                  response.forEach(value => {
                    if (value && !this.establishmentDetails?.gccCountry) {
                      if (value.type === BillingConstants.CHANGE_OWNER) {
                        this.alertService.showErrorByKey('BILLING.CHANGE-IN-OWNER');
                      } else this.getPenalityAccountDetails();
                    } else this.getPenalityAccountDetails();
                  });
                } else this.getPenalityAccountDetails();
              });
              this.getPenalityAccountDetails();
              this.getInstallmentDetails(idNumber);
              if (this.isValidator) this.getDataForValidatorEdit(idNumber);
            } else {
              this.isEstRegistered = false;
              this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
            }
          },
          err => this.alertService.showError(err.error.message)
        )
      )
      .subscribe(noop, noop);
  }

  /**
   * Method to get modal details
   */
  getModalView() {
    this.searchResult = true;
    this.csrFlag = true;
    this.modalFlag = false;
    this.success = true;
    this.showModal(this.tranactionAllowed, 'md');
  }

  /**
   * Method used to save penalty waiver details.
   * */
  submitPenaltyWaiverDetails(template?: TemplateRef<HTMLElement>, size?: string) {
    if (
      this.checkFormValidity(this.wavierPenalityMainForm.get('wavierDetailForm')) &&
      this.wavierPenalityMainForm.get('penaltyWaiverDetails')
    ) {
      this.alertService.clearAlerts();
      if (this.csrFlag) {
        this.createFormData();
        if (!this.isValid && !this.isAppPrivate) {
          const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
          this.modalRef = this.modalService.show(template, config);
        } else {

          this.wavierDetailsReq.exceptionReason = null;
          this.wavierDetailsReq.paymentRequired = true;
          this.wavierDetailsReq.waiveOffType = 'NORMAL';
          this.wavierDetailsReq.waiverEndDate = null;
          this.wavierDetailsReq.waiverStartDate = null;
          this.wavierDetailsReq.waiverPercentage = 0;
          this.wavierDetailsReq.gracePeriod = this.wavierDetails?.terms?.gracePeriod;
          this.wavierDetailsReq.uuid = this.uuid;
          if (this.wavierDetailsReq?.extensionReason === null || this.wavierDetailsReq?.extensionReason === undefined)
            this.wavierDetailsReq.extendedGracePeriod = 0;
          this.penalityWavierService
            .submitWavierPenalityDetails(this.idNumber, this.wavierDetailsReq)
            .pipe(
              tap(res => {
                this.paymentResponse.fromJsonToObject(res);
                this.successMessage = this.paymentResponse.message; //Setting success message
                this.disableSubmit = true;
                if (this.successMessage) {
                  this.success = true;
                  this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.idNumber)]);
                }
                this.alertService.showSuccess(this.successMessage, null, 3);
                this.isSubmit = true;
              }),
              catchError(err => {
                this.isError = true;
                this.alertService.showError(err.error.message);
                this.disableSubmit = true;
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
        }
      } else if (!this.csrFlag) {
        this.createFormData();
        if (!this.isValid && !this.isAppPrivate) {
          const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
          this.modalRef = this.modalService.show(template, config);
        } else {
          if (this.wavierDetailsReq?.extensionReason === null || this.wavierDetailsReq?.extensionReason === undefined)
            this.wavierDetailsReq.extendedGracePeriod = 0;
          this.penalityWavierService
            .submitDetailsAfterEdit(this.idNumber, this.penaltyWaiveId, this.wavierDetailsReq)
            .pipe(
              tap(res => {
                if (this.isGDIC) {
                  this.alertService.showSuccessByKey(BillingConstants.TRANSACTION_APPROVED, null, 3);
                } else {
                  this.paymentResponse.fromJsonToObject(res);
                  this.successMessage = this.paymentResponse.message; //Setting success message
                  this.alertService.showSuccess(this.successMessage, null, 3);
                }
              }),
              catchError(err => {
                this.alertService.showError(err.error.message);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
        }
        if (!this.isAppPrivate) this.navigateBack();
        this.handleWorkflowActions();
      }
    } else this.alertService.showMandatoryErrorMessage();
  }
  /**
   *  this method is used to approve workflow details om validator edit
   * */
  handleWorkflowActions() {
    if (!this.gracePeriodFlag) {
      const bpmRequest = new BPMUpdateRequest();
      if (this.wavierDetailsReq?.extendedGracePeriod > 0) bpmRequest.outcome = WorkFlowActions.EXTEND;
      else bpmRequest.outcome = WorkFlowActions.UPDATE;
      bpmRequest.taskId = this.routerToken.taskId;
      bpmRequest.user = this.routerToken.assigneeId;
      bpmRequest.isExternalComment = !this.isAppPrivate && !this.csrFlag ? true : false;
      bpmRequest.commentScope = 'BPM';
      if (
        this.wavierPenalityMainForm &&
        this.wavierPenalityMainForm.value &&
        this.wavierPenalityMainForm.value.wavierDetailForm
      )
        bpmRequest.comments = this.wavierPenalityMainForm.value.wavierDetailForm.comments;
      this.workflowService.updateTaskWorkflow(bpmRequest).subscribe(
        () => this.navigateBackToInbox(),
        err => this.alertService.showError(err.error.message)
      );
    } else if (this.gracePeriodFlag) {
      const data = new BPMUpdateRequest();
      data.taskId = this.routerToken.taskId;
      data.outcome = TransactionOutcome.APPROVE;
      data.user = this.routerToken.assigneeId;
      data.isExternalComment = !this.isAppPrivate && !this.csrFlag ? true : false;
      this.workflowService.updateTaskWorkflow(data).subscribe(
        () => this.navigateBackToInbox(),
        err => this.alertService.showError(err.error.message)
      );
    }
  }

  /**
   * Method to create data from form and check validations.
   * */
  createFormData() {
    this.wavierDetailsReq = bindToObject(
      new PenaltyWaiverRequest(),
      this.wavierPenalityMainForm.get('wavierDetailForm').value
    );
    this.wavierDetailsReq = bindToObject(
      this.wavierDetailsReq,
      this.wavierPenalityMainForm.get('penaltyWaiverDetails').value
    );
    if (this.isAppPrivate) {
      if (this.isGracePeriodExtended) {
        this.wavierDetailsReq = bindToObject(
          this.wavierDetailsReq,
          this.wavierPenalityMainForm.get('gracePeriodForm').value
        );
      }
    }
    if (!this.isAppPrivate) this.isValid = this.wavierPenalityMainForm.get('checkForm').get('checkBoxFlag').value;
  }

  // Method to set grace period values
  getGracePeriodExtended(value) {
    this.isGracePeriodExtended = value;
  }

  // Method to navigate back to inbox
  navigateBackToInbox() {
    if (this.isAppPrivate) this.routingService.navigateToInbox();
    else this.routingService.navigateToPublicInbox();
  }
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
  // Method to stay back on login page when cancelling the popup
  cancelPopup() {
    this.modalService.hide();
    if (!this.isAppPrivate) this.router.navigate(['/login']);
    else {
      this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.idNumber)]);
      this.searchResult = true;
      this.csrFlag = true;
    }
  }
  navigateToMyTranscation() {
    this.modalService.hide();
    this.router.navigate(['home/transactions/list/history']);
  }
}
