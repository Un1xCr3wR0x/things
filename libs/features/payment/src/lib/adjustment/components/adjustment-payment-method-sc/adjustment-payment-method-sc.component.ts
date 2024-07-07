import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import {
  WizardItem,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LovList,
  LookupService,
  Lov,
  UuidGeneratorService,
  DocumentItem,
  LanguageToken,
  DocumentService,
  GosiCalendar,
  Role,
  RouterDataToken,
  RouterData,
  WorkflowService,
  Channel,
  scrollToTop,
  WorkFlowActions,
  BPMUpdateRequest,
  CoreAdjustmentService,
  CoreBenefitService
} from '@gosi-ui/core';
import {
  ActiveBenefits,
  AdjustmentDocumentService,
  AdjustmentRepaySetValues,
  AdjustmentService,
  AnnuityResponseDto,
  PaymentService,
  SadadOptionDetails,
  SadadResponseData,
  WizardService,
  ReceiptMode,
  ReturnLumpsumPaymentDetails,
  RevertAdjustmentResponse,
  AdjustmentOtherPaymentResponse,
  AdjustmentOtherPaymentDetails,
  SelectPaymentMethodLabels,
  showErrorMessage,
  UITransactionType,
  PaymentConstants
} from '../../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AdjustmentRepayValidatorSetValues } from '../../../shared/models/adjustment-repay-validator-setvalues';

@Component({
  selector: 'pmt-adjustment-payment-method-sc',
  templateUrl: './adjustment-payment-method-sc.component.html',
  styleUrls: ['./adjustment-payment-method-sc.component.scss']
})
export class AdjustmentPaymentMethodScComponent implements OnInit, OnDestroy {
  isSmallScreen: boolean;
  isDateValid: boolean;
  isAdjFormModified = false;
  personId: number;
  adjustmentRepayId: number;
  sadadPaymentForm = new FormGroup({});
  receiveContributionMainForm: FormGroup = new FormGroup({});
  sadadResponse: SadadResponseData;
  revertAdjustmentResponse: RevertAdjustmentResponse;
  adjustmentRepayDetails: AdjustmentRepaySetValues;
  adjustmentRepayValidatorDetails: AdjustmentRepayValidatorSetValues;
  nin: number;
  benefitRequestId: number;
  sin: number;
  repayID: number;
  referenceNumber: number;
  totalAmountToBePaid: number;
  isAppPrivate: boolean;
  role: string;
  rolesEnum = Role;
  inWorkflow = false;
  inEditMode = false;
  isDisplaySadadDetails: boolean;
  isEnabledRestoration: Boolean;
  lang = 'en';
  heading: string;
  paymentType: string;
  benefitType: string;
  documentuuid: string;
  channel: string;
  commonModalRef: BsModalRef;
  benefitAmount: number;
  savedLumpsumBenfitDetails: ActiveBenefits;
  appledBenefitDetails: AnnuityResponseDto;
  receiptDetails: ReturnLumpsumPaymentDetails;
  returnPaymentResponse: AdjustmentOtherPaymentResponse;
  otherPaymentReqDocument: DocumentItem[];
  isSadad = false;

  @ViewChild('adjustmentWizard', { static: false })
  adjustmentWizard: ProgressWizardDcComponent;
  adjustmentWizards: WizardItem[] = [];
  currentTab = 1;

  //LOV lists
  receiptModes$: Observable<LovList>;
  receiptModesFiltered$: LovList;
  saudiBankListSorted: LovList;
  systemRunDate: GosiCalendar;

  constructor(
    private location: Location,
    readonly router: Router,
    public route: ActivatedRoute,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly wizardService: WizardService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly paymentService: PaymentService,
    readonly adjustmentDocumentService: AdjustmentDocumentService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    readonly workflowService: WorkflowService,
    readonly adjustmentService: AdjustmentService,
    readonly documentService: DocumentService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService
  ) {}

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.getScreenSize();
    this.initializeWizard();
    this.coreBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
    // fetching selected language
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.route.queryParams.subscribe(params => {
      this.inEditMode = params.edit === 'true';
    });

    //---apply screen init
    if (!this.inEditMode) {
      //Accessing the sin and benefitRequestId from services
      this.sin = this.coreAdjustmentService?.sin;
      this.adjustmentRepayDetails = this.adjustmentService.getAdjustmentRepayDetails();
      if (this.adjustmentRepayDetails) {
        this.personId = this.adjustmentRepayDetails.personId;
        this.adjustmentRepayId = this.adjustmentRepayDetails.adjustmentRepayId;
        this.referenceNumber = this.adjustmentRepayDetails.referenceNo;
        this.totalAmountToBePaid = this.adjustmentRepayDetails.totalAmountToBePaid;
      }
      //seting default payment option for apply
      this.paymentType = 'sadad';
      this.sadadPaymentForm = this.createSadadPaymentForm();
      this.paymentTypeChange('other');
      this.heading = new SelectPaymentMethodLabels(this.benefitType).getHeading();
      if (this.sin && this.benefitRequestId && this.referenceNumber) {
        this.getActiveBenefitDetails(this.sin, this.benefitRequestId, this.referenceNumber);
      }
    } else {
      if (this.routerDataToken.payload) {
        this.role = this.routerDataToken.assignedRole;
        const payload = JSON.parse(this.routerDataToken.payload);
        this.adjustmentRepayValidatorDetails = this.adjustmentService.getAdjustmentRepaymentValidatorDetails();
        this.isAdjFormModified = this.adjustmentService.adjFormModified;
        this.adjustmentRepayDetails = this.adjustmentService.getAdjustmentRepayDetails();
        this.totalAmountToBePaid = this.adjustmentRepayDetails.totalAmountToBePaid;
        //this.totalAmountToBePaid = this.adjustmentRepayValidatorDetails.totalPaidAmount;
        this.getLookupValues();
        this.initialiseViewForEdit(payload);
      }
      this.getUploadedDocuments();
    }
    this.getBenefitDetails(this.sin, this.benefitRequestId, this.referenceNumber);

    // this.adjustmentRepayDetails = this.adjustmentService.getAdjustmentRepayDetails();
    // if (this.adjustmentRepayDetails) {
    //   this.personId = this.adjustmentRepayDetails.personId;
    //   this.adjustmentRepayId = this.adjustmentRepayDetails.adjustmentRepayId;
    //   this.referenceNumber = this.adjustmentRepayDetails.referenceNo;
    // }
    // this.paymentType = 'sadad';
    // this.sadadPaymentForm = this.createSadadPaymentForm();
  }

  initializeWizard() {
    this.adjustmentWizards = [];
    this.adjustmentWizards = this.wizardService.getAdjustmentWizradItems();
    this.adjustmentWizards[1].isActive = true;
    this.adjustmentWizards[1].isDisabled = false;
    this.adjustmentWizards[0].isDisabled = true;
    this.adjustmentWizards[0].isDone = true;

    // const wizardItems: WizardItem[] = [];
    // wizardItems.push(new WizardItem(AdjustmentConstants.ADJUSTMENT_DETAILS, 'file-invoice-dollar')); //TODO: change icon
    // wizardItems.push(new WizardItem(AdjustmentConstants.PAYMENT_DETAILS, 'file-alt'));
    // this.adjustmentWizards = wizardItems;
    // this.adjustmentWizards[this.currentTab].isActive = true;
    // this.adjustmentWizards[this.currentTab].isDisabled = false;
  }

  // selectedWizard(index: number) {
  //   this.alertService.clearAlerts();
  //   this.currentTab = index;
  // if(this.currentTab == 0) {
  //   this.adjustmentService.setPageName('PAYMENT_DETAILS');
  //   this.router.navigate(['home/adjustment/pay-adjustment']);
  // }
  // this.selectWizard(index, this.restoreLumpsumDetailsTab, this.restoreWizards);
  // }

  /**this method will toggle the payment method */
  paymentTypeChange(paymentType) {
    if (paymentType === 'sadad') {
      this.paymentType = 'sadad';
      this.isSadad = true;
      this.adjustmentService
        .revertAdjustmentRepayment(this.personId, this.adjustmentRepayId, this.referenceNumber, this.isSadad, this.sin)
        .subscribe();
    } else if (paymentType === 'other') {
      this.paymentType = 'other';
      this.getLookupValues();
      this.getDocumentRelatedValues();
      if (this.inEditMode) this.getUploadedDocuments();
    }
  }
  /** ---------------------------SADAD Payment------------------------------- */
  /** this fuction will create form for sadad payment  */
  createSadadPaymentForm() {
    return this.fb.group({
      transactionDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      })
    });
  }

  /** Method to fetch account number when benefit request id is available */
  getBenefitDetails(sin: number, benefitRequestId: number, referenceNumber: number) {
    if (sin && benefitRequestId) {
      this.paymentService.getActiveBenefitDetails(sin, benefitRequestId, referenceNumber).subscribe(res => {
        this.appledBenefitDetails = res;
        this.nin = this.appledBenefitDetails.nin;
        this.benefitType = res.benefitType.english;
        this.heading = new SelectPaymentMethodLabels(this.benefitType).getHeading();
      });
    }
    this.benefitAmount = this.totalAmountToBePaid;
  }

  /**
   * this function will make POST call for proceeding to pay through SADAD payment
   */
  sadadProceedTopay(sadadPaymentDetails: SadadOptionDetails) {
    if (sadadPaymentDetails) {
      this.adjustmentService
        .proceedToPay(this.personId, this.adjustmentRepayId, sadadPaymentDetails, this.sin)
        .subscribe(
          res => {
            this.referenceNumber = res.referenceNo;
            this.isDisplaySadadDetails = true;
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessage(err);
            }
          }
        );
    }
  }
  /**
   * this function will make PATCH call for submitting SADAD payment
   */
  sadadPaymentSubmit() {
    if (this.sadadPaymentForm.valid) {
      const TranscationDate: GosiCalendar = this.sadadPaymentForm.get('transactionDate').value;
      const sadadPaymentDetails: SadadOptionDetails = {
        paymentMethod: {
          english: 'SADAD',
          arabic: 'سداد'
        },
        referenceNo: this.referenceNumber,
        transactionDate: TranscationDate
      };
      this.adjustmentService
        .submitSadadPayment(this.personId, this.adjustmentRepayId, sadadPaymentDetails, this.sin)
        .subscribe(
          res => {
            this.sadadResponse = res;
            this.alertService.showSuccess(this.sadadResponse.message);
            this.router.navigate(['/home/adjustment/adjustment-details']);
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              //this.alertService.showErrorByKey('BENEFITS.SUBMIT-FAILED-MSG');
              this.showErrorMessage(err);
            }
          }
        );
    }
  }

  /**----------------------Other payment methods fn------------------------------------- */

  /*** this function will fetch the Lov list required for the other payment method */
  getLookupValues() {
    // this.receiptModes$ = this.lookupService.getReceiptMode();
    this.adjustmentService.getReceiptMode().subscribe(res => {
      const receiptModes: Lov[] = res;
      this.receiptModesFiltered$ = new LovList(receiptModes);
    });
    this.adjustmentService.getBankLovList().subscribe(res => {
      const banklist: Lov[] = res;
      this.saudiBankListSorted = new LovList(banklist);
    });
    // this.filterrecepitModes();
  }
  getDocumentRelatedValues() {
    this.documentuuid = this.uuidGeneratorService.getUuid();
    this.adjustmentService.getReqDocsForOtherPayment(this.isAppPrivate).subscribe(res => {
      this.otherPaymentReqDocument = res;
      this.otherPaymentReqDocument.forEach(doc => {
        doc.canDelete = true;
      });
    });
  }

  /** this fn will fetch the uploaded proof of payment doc  */
  getUploadedDocuments() {
    const transactionKey = UITransactionType.MNT_ADJUSTMENT_REPAYMENT;
    const transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.adjustmentDocumentService
      .getUploadedDocuments(this.adjustmentRepayId, transactionKey, transactionType)
      .subscribe(res => {
        this.otherPaymentReqDocument = res;
      });
  }

  /** this function will filterout unwanted recepit modes from the API */
  // filterrecepitModes() {
  //   if (this.receiptModes$) {
  //     this.receiptModesFiltered$ = this.receiptModes$.pipe(
  //       map(list => {
  //         if (list) {
  //           return new LovList(
  //             list.items.filter(lov => {
  //               if (
  //                 lov.value.english === ReceiptMode.BANKERS_CHEQUE ||
  //                 lov.value.english === ReceiptMode.SAMA_VOUCHER ||
  //                 lov.value.english === ReceiptMode.PERSONNEL_CHEQUE
  //               ) {
  //                 return false;
  //               } else {
  //                 return true;
  //               }
  //             })
  //           );
  //         }
  //       })
  //     );
  //   }
  // }

  /**
   * Methpd to sort lov list.
   * @param list lov list
   * @param isBank bank identifier
   */
  sortLovList(list: Observable<LovList>, isBank: boolean) {
    if (list) {
      return list.pipe(
        map(res => {
          if (res) {
            return this.paymentService.sortLovList(res, isBank, this.lang);
          }
        })
      );
    }
  }

  /** this fuction will execute when user submit other payment options */
  submitOtherPaymentDetails() {
    const otherPaymentvalues: AdjustmentOtherPaymentDetails = {
      paymentMethod: {
        english: 'Other Options',
        arabic: ''
      },
      amountPaid: !this.inEditMode
        ? this.totalAmountToBePaid
        : this.receiveContributionMainForm.get('repaymentDetails.amountTransferred.amount').value,
      comments: this.receiveContributionMainForm.get('repaymentDetails.comments').value,
      receiptMode: this.receiveContributionMainForm.get('receiptMode.receiptMode').value,
      additionalPaymentDetails: this.receiveContributionMainForm.get('repaymentDetails.additionalPaymentDetails').value,
      // amountTransferred: this.receiveContributionMainForm.get('repaymentDetails.amountTransferred.amount').value,
      // bankName: this.receiveContributionMainForm.get('repaymentDetails.bankName').value,
      paymentReferenceNo: parseInt(
        this.receiveContributionMainForm.get('repaymentDetails.paymentReferenceNo').value,
        10
      ),
      //receiptNumber: this.receiveContributionMainForm.get('repaymentDetails.receiptNumber').value,
      transactionDate: this.receiveContributionMainForm.get('repaymentDetails.transactionDate').value,
      // uuid: this.documentuuid,
      referenceNo: this.referenceNumber
    };
    if (!this.inEditMode) {
      this.adjustmentService
        .submitOtherPayment(this.personId, this.adjustmentRepayId, otherPaymentvalues, this.sin)
        .subscribe(
          res => {
            this.returnPaymentResponse = res;
            this.paymentService.setIsUserSubmitted();
            this.router.navigate(['/home/adjustment/adjustment-details']);
            if (this.returnPaymentResponse.message != null) {
              this.alertService.showSuccess(this.returnPaymentResponse.message);
            }
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessage(err);
              this.goToTop();
            }
          }
        );
    } else {
      /******need to check *******/
      // const repayID = this.returnLumpsumService.getRepayId();
      this.adjustmentService
        .validatorModifysubmitOtherPayment(this.personId, this.adjustmentRepayId, otherPaymentvalues, this.sin)
        .subscribe(
          res => {
            this.returnPaymentResponse = res;
            if (this.role && this.role === this.rolesEnum.VALIDATOR_1) {
              this.saveWorkflowInEdit();
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
  }

  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit() {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.taskId = this.routerDataToken.taskId;
    workflowData.user = this.routerDataToken.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.comments = this.receiveContributionMainForm.get('repaymentDetails.comments').value || '';
    this.adjustmentService.updateAnnuityWorkflow(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.paymentService.navigateToInbox();
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
          this.adjustmentRepayId,
          undefined,
          undefined,
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
  getActiveBenefitDetails(sin: number, benefitRequestId: number, referenceNumber: number) {
    this.paymentService.getActiveBenefitDetails(sin, benefitRequestId, referenceNumber).subscribe(res => {
      this.isEnabledRestoration = res.enabledRestoration;
      if (this.isEnabledRestoration === true) {
        return this.isEnabledRestoration;
      }
      this.paymentType = 'sadad';
    });
  }
  /***-----------------------Edit fuction---------------------------------- */

  /* Method to intialise the view in edit mode */
  initialiseViewForEdit(payload) {
    // collecting required data from payload
    this.sin = payload.socialInsuranceNo;
    this.benefitRequestId = payload.id;
    this.repayID = payload.repayId;
    this.referenceNumber = payload.referenceNo;
    this.channel = payload.channel;
    this.role = payload.assignedRole;
    this.personId = payload.beneficiaryId;
    this.adjustmentRepayId = payload.adjustmentRepayId;
    // calling the lumpsum repayment api with repay id
    this.receiptDetails = this.adjustmentService.getAdjustmentRepaymentValidatorDetails().repaymentDetails;
    this.paymentType = 'other';
    // this.returnLumpsumService.getLumpsumRepaymentDetails(this.sin, this.benefitRequestId, this.repayID).subscribe(
    //   res => {
    //     this.receiptDetails = res.repaymentDetails;
    //     this.paymentType = 'other';
    //   },
    //   err => {
    //     this.alertService.showError(err.error.message);
    //   }
    // );
  }

  /** this function called when user clicked on the cancel button  */
  cancelForm() {
    this.callRevertAdjustmentAPI();
  }

  callRevertAdjustmentAPI() {
    this.adjustmentService
      .revertAdjustmentRepayment(this.personId, this.adjustmentRepayId, this.referenceNumber, this.isSadad, this.sin)
      .subscribe(
        res => {
          this.revertAdjustmentResponse = res;
          if (this.revertAdjustmentResponse?.message)
            this.alertService.showSuccess(this.revertAdjustmentResponse.message);
          if (this.inEditMode) {
            this.router.navigate([PaymentConstants.APPROVE_ADJUSTMENT_REPAYMENT]);
          } else {
            this.router.navigate(['/home/adjustment/adjustment-details']);
          }
        },
        err => {
          if (err.status === 500 || err.status === 422 || err.status === 400) {
            this.showErrorMessage(err);
          }
        }
      );
  }

  /** Route back to previous page */
  routeBack() {
    // Defect 496200
    this.location.back();
    //this.router.navigate(['home/payment/adjustment/validator/approve-adjustment-repayment']);
  }

  /** This method is to hide Modal */
  hideModal() {
    this.commonModalRef.hide();
  }
  /** This method is to show Modal */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
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

  /** Wrapper method to scroll to top of modal*/
  goToTop() {
    scrollToTop();
  }

  /** this fn will be automatically executed when user leave/redirect from the page */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.commonModalRef.hide();
    this.callRevertAdjustmentAPI();
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(template);
  }
  /** Method to decline the popUp. */
  decline() {
    this.commonModalRef.hide();
  }

  goToPrevAction() {
    // this.coreAdjustmentService.socialNumber = this.sin;
    this.adjustmentService.setPageName('PAYMENT_DETAILS');
    this.router.navigate(['home/adjustment/pay-adjustment']);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
}
