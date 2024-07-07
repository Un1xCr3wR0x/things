import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BPMUpdateRequest,
  BilingualText,
  DocumentService,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  StorageService,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService,
  bindToObject,
  downloadFile
} from '@gosi-ui/core';
import { RouteConstants } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PenaltyWaiverBaseScComponent } from '../../../shared/components/base/penalty-waiver-base-sc.component';
import { BillingConstants, ReportConstants } from '../../../shared/constants';
import { LanguageTypeEnum, TransactionOutcome } from '../../../shared/enums';
import { EstablishmentDetails, PaymentResponse, PenalityWavier, PenaltyWaiverRequest } from '../../../shared/models';
import {
  BillingRoutingService,
  ContributionPaymentService,
  EstablishmentService,
  PenalityWavierService,
  ReportStatementService
} from '../../../shared/services';
@Component({
  selector: 'blg-violation-late-fee-sc',
  templateUrl: './violation-late-fee-sc.component.html',
  styleUrls: ['./violation-late-fee-sc.component.scss']
})
export class ViolationLateFeeScComponent extends PenaltyWaiverBaseScComponent implements OnInit {
  @ViewChild('tranactionAllowed', { static: true })
  tranactionAllowed: TemplateRef<HTMLElement>;
  // local variables
  establishmentDetails: EstablishmentDetails;
  lang = 'en';
  regNo: number;
  wavierDetails: PenalityWavier;
  isLateFeeViolation = true;
  paymentResponse: PaymentResponse = new PaymentResponse();
  documentTransactionId = BillingConstants.PENALTY_WAIVER_DOCUMENT_TRANSACTION_ID;
  warningMessageOne: BilingualText;
  warningMessageTwo: BilingualText;
  warningMessageFive: BilingualText;
  warningMessageSix: BilingualText;
  warningMessageSeven: BilingualText;
  warningMessageEight: BilingualText;
  warningMessageNine: BilingualText;
  warningMessageTen: BilingualText;
  warningMessageEleven: BilingualText;
  languageType: string;
  contType: string;
  contfileName: string;
  isClicked: boolean;
  disableSubmit = false;
  isError = false;
  hideSubmit = false;
  validForm = false;
  isResponse: boolean;
  isApiTriggred = true;

  /**
   *
   * @param language
   * @param routerDataToken
   * @param router
   * @param route
   * @param routerToken
   * @param establishmentService
   * @param alertService
   * @param documentService
   * @param modalService
   * @param penalityWavierService
   * @param routingService
   */

  constructor(
    readonly establishmentService: EstablishmentService,
    private uuidGeneratorService: UuidGeneratorService,
    readonly route: ActivatedRoute,
    readonly storageService: StorageService,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly penalityWavierService: PenalityWavierService,
    readonly reportStatementService: ReportStatementService,
    readonly routingService: BillingRoutingService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
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

  ngOnInit(): void {
    this.hideSubmit = true;
    this.language.subscribe(language => {
      this.lang = language;
    }, noop);
    this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
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
    } else {
      this.uuid = this.uuidGeneratorService.getUuid();
    }
    this.idNumber = this.establishmentRegistrationNo.value;
    this.getEstablishmentDetails(this.idNumber);
  }
  getEstablishmentDetails(idNumber) {
    this.establishmentService
      .getEstablishment(idNumber)
      .pipe(
        tap(
          res => {
            this.establishmentDetails = res;
            this.idNumber = idNumber;
            if (this.establishmentDetails?.status?.english === BillingConstants.REG_STATUS) {
              this.isEstRegistered = true;
              this.alertService.clearAlerts();
              this.contributionPaymentService.getWorkFlowStatus(idNumber).subscribe(response => {
                if (response.length !== 0) {
                  response.forEach(value => {
                    if (value) {
                      if (value.type === BillingConstants.CHANGE_OWNER) {
                        this.alertService.showErrorByKey('BILLING.CHANGE-IN-OWNER');
                      } else this.getPenalityAccountDetails();
                    } else this.getPenalityAccountDetails();
                  });
                } else this.getPenalityAccountDetails();
              });
              this.getPenalityAccountDetails();
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
  getDataForValidatorEdit(registrationNo) {
    if (this.penaltyWaiveId && registrationNo) {
      this.penalityWavierService
        .getWavierPenalityDetailsForView(this.idNumber, this.penaltyWaiveId)
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
  getPenalityAccountDetails() {
    if (!this.isValidator) {
      this.penalityWavierService
        .getWavierPenalityDetails(this.idNumber, 'GOSI_INITIATIVE')
        .pipe(
          tap(
            res => {
              this.searchResult = false;
              this.alertService.clearAlerts();
              this.wavierDetails = res;
              if (!res && res.terms.gracePeriod! == null) this.isResponse = false;
              else this.isResponse = true;
              // if(res?.qiwaCompliance?.english  === 'No' || res?.mudadCompliance?.english === 'No' )
              // {
              //
              // }
            },
            err => {
              this.isError = true;
              err.error.details?.forEach(element => {
                switch (element.message.english) {
                  case BillingConstants.WARNING_ONE:
                    this.warningMessageOne = element.message;
                    this.warningMessageListOne = true;
                    break;
                  case BillingConstants.WARNING_TWO:
                    this.warningMessageListTwo = true;
                    this.warningMessageTwo = element.message;
                    break;
                  case BillingConstants.WARNING_FIVE:
                    this.warningMessageListFive = true;
                    this.warningMessageFive = element.message;
                    break;
                  case BillingConstants.WARNING_SIX:
                    this.warningMessageListSeven = true;
                    this.warningMessageSix = element.message;
                    break;
                  case BillingConstants.WARNING_SEVEN:
                    this.warningMessageListEight = true;
                    this.warningMessageSeven = element.message;
                    break;
                  case BillingConstants.WARNING_EIGHT:
                    this.warningMessageListNine = true;
                    this.warningMessageEight = element.message;
                    break;
                  case BillingConstants.WARNING_NINE:
                    this.warningMessageListTen = true;
                    this.warningMessageNine = element.message;
                    break;
                  case BillingConstants.WARNING_TEN:
                    this.warningMessageListEleven = true;
                    this.warningMessageTen = element.message;
                    break;
                  case BillingConstants.WARNING_THIRTEEN:
                    this.warningMessageListThirteen = true;
                    this.warningMessageEleven = element.message;
                    break;
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
  }
  getModalView() {
    this.searchResult = true;
    this.csrFlag = true;
    this.modalFlag = false;
    this.success = true;
    this.showModal(this.tranactionAllowed, 'md');
  }
  createFormData() {
    this.wavierDetailsReq = bindToObject(
      new PenaltyWaiverRequest(),
      this.wavierPenalityMainForm.get('wavierDetailForm').value
    );
    this.wavierDetailsReq = bindToObject(
      this.wavierDetailsReq,
      this.wavierPenalityMainForm.get('penaltyWaiverDetails').value
    );
    if (this.isGracePeriodExtended) {
      this.wavierDetailsReq = bindToObject(
        this.wavierDetailsReq,
        this.wavierPenalityMainForm.get('gracePeriodForm').value
      );
    }
    if (!this.isAppPrivate) {
      this.isValid = this.wavierPenalityMainForm.get('checkForm').get('checkBoxFlag').value;
      this.validForm = this.wavierPenalityMainForm.get('checkForm').get('checkBoxFlag1').value;
    }
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
      this.createFormData();
      if (!this.isValid && !this.isAppPrivate) {
        const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
        this.modalRef = this.modalService.show(template, config);
      } else {
        this.wavierDetailsReq.exceptionReason = null;
        this.wavierDetailsReq.paymentRequired = true;
        this.wavierDetailsReq.waiveOffType = 'GOSI_INITIATIVE';
        this.wavierDetailsReq.waiverEndDate = null;
        this.wavierDetailsReq.waiverStartDate = null;
        this.wavierDetailsReq.waiverPercentage = this.wavierDetails?.waivedPenaltyPercentage;
        this.wavierDetailsReq.gracePeriod = this.wavierDetails?.terms?.gracePeriod;
        this.wavierDetailsReq.uuid = this.uuid;
        this.wavierDetailsReq.extendedGracePeriod = 0;
        this.penalityWavierService
          .submitWavierPenalityDetails(this.idNumber, this.wavierDetailsReq)
          .pipe(
            tap(res => {
              this.paymentResponse.fromJsonToObject(res);
              this.successMessage = this.paymentResponse.message; //Setting success message
              if (this.successMessage) {
                this.success = true;
                this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.idNumber)]);
              }
              this.alertService.showSuccess(this.successMessage, null, 10);
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
    }
    if (this.isValidator) {
      this.createFormData();
      if (!this.isValid) {
        const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
        this.modalRef = this.modalService.show(template, config);
      } else {
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
      this.handleWorkflowActions();
    } else this.alertService.showMandatoryErrorMessage();
  }
  /**
   *  this method is used to approve workflow details on validator edit
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
  }
  navigateToMyTranscation() {
    this.modalService.hide();
    this.router.navigate(['home/transactions/list/history']);
  }
  downloadTrainingDocument() {
    this.penalityWavierService.GenerateTrainingDoc(this.idNumber, this.languageType).subscribe(data => {
      downloadFile(ReportConstants.COL_REP_WAIVE_LATEFEE_VIO_RPRT, 'application/pdf', data);
    });
  }
  checkBox() {
    if (this.isResponse) this.hideSubmit = false;
  }
}
