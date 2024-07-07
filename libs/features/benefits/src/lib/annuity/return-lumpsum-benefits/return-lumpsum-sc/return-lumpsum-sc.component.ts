/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  LovList,
  LookupService,
  AlertService,
  DocumentItem,
  DocumentService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  UuidGeneratorService,
  Lov,
  WorkflowService,
  RouterData,
  RouterDataToken,
  Channel,
  scrollToTop,
  Role,
  BPMUpdateRequest,
  WorkFlowActions,
  LanguageToken,
  CoreBenefitService,
  GosiCalendar
} from '@gosi-ui/core';
import { ReturnLumpsumService } from '../../../shared/services/return-lumpsum.service';
import { map } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  ActiveBenefits,
  AnnuityResponseDto,
  ReturnLumpsumResponse,
  BenefitConstants,
  ReceiptMode,
  ReturnLumpsumPaymentDetails,
  SelectPaymentMethodLabels,
  UITransactionType,
  BenefitDocumentService,
  ManageBenefitService,
  showErrorMessage
} from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'bnt-return-lumpsum-sc',
  templateUrl: './return-lumpsum-sc.component.html',
  styleUrls: ['./return-lumpsum-sc.component.scss']
})
export class ReturnLumpsumScComponent implements OnInit, OnDestroy {
  nin: number;
  benefitRequestId: number;
  sin: number;
  repayID: number;
  referenceNumber: number;
  isAppPrivate: boolean;
  role: string;
  rolesEnum = Role;
  inWorkflow = false;
  inEditMode = false;
  isDisplaySadadDetails: boolean;
  isEnabledRestoration: Boolean = false;
  lang = 'en';
  heading: string;
  paymentType: string;
  benefitType: string;
  documentuuid: string;
  channel: string;
  commonModalRef: BsModalRef = new BsModalRef();
  benefitAmount: number;
  savedLumpsumBenfitDetails: ActiveBenefits;
  appledBenefitDetails: AnnuityResponseDto;
  receiptDetails: ReturnLumpsumPaymentDetails;
  returnPaymentResponse: ReturnLumpsumResponse;
  otherPaymentReqDocument: DocumentItem[];

  //LOV lists
  receiptModes$: Observable<LovList>;
  receiptModesFiltered$: Observable<LovList>;
  saudiBankListSorted: LovList;
  //Forms
  sadadPaymentForm = new FormGroup({});
  receiveContributionMainForm: FormGroup = new FormGroup({});
  systemRunDate: GosiCalendar;

  constructor(
    private location: Location,
    readonly router: Router,
    public route: ActivatedRoute,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly returnLumpsumService: ReturnLumpsumService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly manageBenefitService: ManageBenefitService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    readonly workflowService: WorkflowService,
    readonly coreBenefitService: CoreBenefitService
  ) {}

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.coreBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
    // fetching selected language
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    if (this.route && this.route.queryParams)
      this.route?.queryParams?.subscribe(params => {
        this.inEditMode = params?.edit === 'true';
      });

    //---apply screen init
    if (!this.inEditMode) {
      //Accessing the sin and benefitRequestId from services
      this.savedLumpsumBenfitDetails = this.returnLumpsumService.getSavedActiveBenefit();
      if (this.savedLumpsumBenfitDetails) {
        this.sin = this.savedLumpsumBenfitDetails.sin;
        this.benefitRequestId = this.savedLumpsumBenfitDetails.benefitRequestId;
        this.referenceNumber =
          this.savedLumpsumBenfitDetails.referenceNo > 0 ? this.savedLumpsumBenfitDetails.referenceNo : null;
        this.benefitType = this.savedLumpsumBenfitDetails.benefitType.english;
      }
      //seting default payment option for apply
      this.paymentType = 'sadad';
      this.sadadPaymentForm = this.createSadadPaymentForm();
      this.paymentTypeChange('other');
      this.heading = new SelectPaymentMethodLabels(this.benefitType).getHeading();
      if (this.sin && this.benefitRequestId) {
        this.getActiveBenefitDetails(this.sin, this.benefitRequestId, this.referenceNumber);
      }
    }

    //------ init view for edit
    else {
      if (this.routerDataToken && this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.getLookupValues();
        this.initialiseViewForEdit(payload);
      }
      this.getUploadedDocuments();
      this.isEnabledRestoration = true;
    }
    this.getBenefitDetails(this.sin, this.benefitRequestId, this.referenceNumber);
  }

  /**this method will toggle the payment method */
  paymentTypeChange(paymentType) {
    if (paymentType === 'sadad') {
      this.paymentType = 'sadad';
    } else if (paymentType === 'other') {
      this.paymentType = 'other';
      this.getLookupValues();
      this.getDocumentRelatedValues();
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
      this.returnLumpsumService.getActiveBenefitDetails(sin, benefitRequestId, referenceNumber)?.subscribe(res => {
        if (res) {
          this.appledBenefitDetails = res;
          this.nin = this.appledBenefitDetails.nin;
          this.benefitAmount = this.appledBenefitDetails.benefitAmount;
          this.benefitType = res.benefitType.english;
          this.heading = new SelectPaymentMethodLabels(this.benefitType).getHeading();
        }
      });
    }
  }

  /**
   * this function will make POST call for proceeding to pay through SADAD payment
   */
  sadadProceedTopay(sadadPaymentDetails: ReturnLumpsumPaymentDetails) {
    this.returnLumpsumService.repaymentPost(this.sin, this.benefitRequestId, sadadPaymentDetails)?.subscribe(
      res => {
        if (res) {
          this.repayID = res.lumpsumRepaymentId;
          this.referenceNumber = res.referenceNo;
          this.isDisplaySadadDetails = true;
        }
      },
      err => {
        if (err.status === 500 || err.status === 422 || err.status === 400) {
          this.showErrorMessage(err);
        }
      }
    );
  }

  /**
   * this function will make PUT call for the SADAD payment submit
   */
  sadadPaymentFormSubmit(sadadPaymentDetails: ReturnLumpsumPaymentDetails) {
    sadadPaymentDetails.referenceNo = this.referenceNumber;
    this.returnLumpsumService
      .submitSadadPayment(this.sin, this.benefitRequestId, this.repayID, sadadPaymentDetails)
      ?.subscribe(
        res => {
          if (res) {
            this.returnPaymentResponse = res;
            this.alertService.showSuccess(this.returnPaymentResponse.message);
            this.returnLumpsumService.setIsUserSubmitted();
            this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
          }
        },
        err => {
          if (err.status === 500 || err.status === 422 || err.status === 400) {
            //this.alertService.showErrorByKey('BENEFITS.SUBMIT-FAILED-MSG');
            this.showErrorMessage(err);
          }
        }
      );
  }

  /**----------------------Other payment methods fn------------------------------------- */

  /*** this function will fetch the Lov list required for the other payment method */
  getLookupValues() {
    this.receiptModes$ = this.lookupService.getReceiptMode();

    // this.returnLumpsumService.getBankLovList()?.subscribe(res => {
    //   if (res) {
    //     const banklist: Lov[] = res;
    //     this.saudiBankListSorted = new LovList(banklist);
    //   }
    // });
    this.filterrecepitModes();
  }

  getDocumentRelatedValues() {
    this.documentuuid = this.uuidGeneratorService.getUuid();
    this.returnLumpsumService.getReqDocsForReturnLumpsum(this.isAppPrivate)?.subscribe(res => {
      if (res) {
        this.otherPaymentReqDocument = res;
        this.otherPaymentReqDocument.forEach(doc => {
          doc.canDelete = true;
        });
      }
    });
  }

  /** this fn will fetch the uploaded proof of payment doc  */
  getUploadedDocuments() {
    const transactionKey = UITransactionType.REPAY_LUMPSUM_BENEFIT;
    const transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.benefitDocumentService
      .getUploadedDocuments(this.benefitRequestId, transactionKey, transactionType, this.referenceNumber)
      .subscribe(res => {
        if (res) this.otherPaymentReqDocument = res;
      });
  }

  /** this function will filterout unwanted recepit modes from the API */
  filterrecepitModes() {
    if (this.receiptModes$) {
      this.receiptModesFiltered$ = this.receiptModes$.pipe(
        map(list => {
          if (list) {
            return new LovList(
              list.items.filter(lov => {
                if (
                  lov.value.english === ReceiptMode.BANKERS_CHEQUE ||
                  lov.value.english === ReceiptMode.SAMA_VOUCHER ||
                  lov.value.english === ReceiptMode.PERSONNEL_CHEQUE ||
                  lov.value.english === ReceiptMode.DIRECT_DEBIT ||
                  lov.value.english === ReceiptMode.CASH ||
                  lov.value.english === ReceiptMode.ATM ||
                  lov.value.english === ReceiptMode.SADAD_NETWORK
                ) {
                  return false;
                } else {
                  return true;
                }
              })
            );
          }
        })
      );
    }
  }

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
            return this.returnLumpsumService.sortLovList(res, isBank, this.lang);
          }
        })
      );
    }
  }

  /** this fuction will execute when user submit other payment options */
  submitOtherPaymentDetails() {
    const otherPaymentvalues: ReturnLumpsumPaymentDetails = {
      paymentMethod: {
        english: 'Other Options',
        arabic: ''
      },
      receiptMode: this.receiveContributionMainForm.get('receiptMode.receiptMode').value,
      receiptNumber: this.receiveContributionMainForm.get('repaymentDetails.receiptNumber').value,
      additionalPaymentDetails: this.receiveContributionMainForm.get('repaymentDetails.additionalPaymentDetails').value,
      amountTransferred: this.receiveContributionMainForm.get('repaymentDetails.amountTransferred.amount').value,
      // bankName: this.receiveContributionMainForm.get('repaymentDetails.bankName').value,
      // paymentReferenceNo: this.receiveContributionMainForm.get('repaymentDetails.paymentReferenceNo').value,
      transactionDate: this.receiveContributionMainForm.get('repaymentDetails.transactionDate').value,
      uuid: this.documentuuid,
      referenceNo: this.referenceNumber
    };
    if (!this.inEditMode) {
      this.returnLumpsumService.repaymentPost(this.sin, this.benefitRequestId, otherPaymentvalues).subscribe(
        res => {
          if (res) {
            this.returnPaymentResponse = res;
            this.returnLumpsumService.setIsUserSubmitted();
            if (this.returnPaymentResponse.message != null) {
              this.alertService.showSuccess(this.returnPaymentResponse.message);
            }
            this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
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
      const repayID = this.returnLumpsumService.getRepayId();
      this.returnLumpsumService
        .otherPaymentSubmit(this.sin, this.benefitRequestId, repayID, otherPaymentvalues)
        .subscribe(
          res => {
            if (res) {
              this.returnPaymentResponse = res;
              if (
                this.role &&
                (this.role === this.rolesEnum.VALIDATOR_1 ||
                  this.role === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
                  this.role === 'Contributor')
              ) {
                this.saveWorkflowInEdit();
              }
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
    workflowData.taskId = this.routerDataToken?.taskId;
    workflowData.user = this.routerDataToken?.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    this.manageBenefitService.updateAnnuityWorkflow(workflowData)?.subscribe(
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
        .refreshDocument(document, this.benefitRequestId, undefined, undefined, undefined, undefined, this.documentuuid)
        .subscribe(res => {
          if (res) {
            document = res;
          }
        });
    }
  }

  getActiveBenefitDetails(sin: number, benefitRequestId: number, referenceNumber: number) {
    this.returnLumpsumService.getActiveBenefitDetails(sin, benefitRequestId, referenceNumber).subscribe(res => {
      if (res) {
        this.isEnabledRestoration = !res.enabledRestoration;
        if (this.isEnabledRestoration === true) {
          return this.isEnabledRestoration;
        }
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
    // calling the lumpsum repayment api with repay id
    this.returnLumpsumService.getLumpsumRepaymentDetails(this.sin, this.benefitRequestId, this.repayID)?.subscribe(
      res => {
        if (res) this.receiptDetails = res.repaymentDetails;
        this.paymentType = 'other';
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  /**------------------------ Helper Functions------------------------ */

  /** this function called when user clicked on the cancel button  */
  cancelForm() {
    if (this.inEditMode) {
      this.manageBenefitService.revertAnnuityBenefit(this.sin, this.benefitRequestId, this.referenceNumber).subscribe(
        () => {
          this.routeBack();
        },
        () => {
          this.goToTop();
        }
      );
    } else {
      this.routeBack();
    }
  }

  /** Route back to previous page */
  routeBack() {
    this.location.back();
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
}
