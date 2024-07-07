/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  BPMUpdateRequest,
  CurrencySar,
  DocumentService,
  ExchangeRateService,
  GccCountryCode,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  scrollToTop,
  startOfDay,
  StorageService,
  TransactionReferenceData,
  UuidGeneratorService,
  WorkflowService,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BehaviorSubject, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ContributionPaymentBaseScComponent } from '../../../shared/components';
import { BillingConstants } from '../../../shared/constants';
import { CurrencyArabicShortForm, GccCountry, LanguageTypeEnum, ReceiptMode, ReceiptType } from '../../../shared/enums';
import {
  BranchBreakup,
  BranchDetails,
  CancelReceiptPayload,
  CurrencyDetails,
  PaymentDetails,
  PaymentResponse,
  UpdatePayment
} from '../../../shared/models';
import {
  BillingRoutingService,
  ContributionPaymentService,
  EstablishmentService,
  EventDateService,
  ReportStatementService
} from '../../../shared/services';
@Component({
  selector: 'blg-contribution-payment-sc',
  templateUrl: './contribution-payment-sc.component.html',
  styleUrls: ['./contribution-payment-sc.component.scss']
})
export class ContributionPaymentScComponent extends ContributionPaymentBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  values;
  newTransactionDate = '';
  countryValue = '';
  cancelDetails: CancelReceiptPayload = new CancelReceiptPayload();
  paymentResponse: PaymentResponse = new PaymentResponse();
  receiptDetails: PaymentDetails = new PaymentDetails();
  editFlag = false;
  currencyDetails: CurrencyDetails;
  initialExchangeRate: number;
  gccCurrency: BilingualText = new BilingualText();
  branchSummary: BranchDetails[];
  estCount = 0;
  newAttribute = {};
  errorFlag: boolean;
  penalityIndicator = false;
  estType: string;
  comments: TransactionReferenceData[] = [];
  isCommentsPresent = false;
  isGovPayment = false;
  govPaymentDetails = undefined;
  isCurrent = false;
  currentReceiptMode: string;

  /** Creates an instance of ContributionPaymentScComponent*/
  constructor(
    readonly contributionPaymentService: ContributionPaymentService,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly billingRoutingService: BillingRoutingService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly storageService: StorageService,
    readonly route: ActivatedRoute,
    readonly exchangeRateService: ExchangeRateService,
    readonly establishmentService: EstablishmentService,
    readonly uuidService: UuidGeneratorService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly eventService: EventDateService,
    readonly workflowService: WorkflowService,
    readonly reportStatementService: ReportStatementService
  ) {
    super(
      lookupService,
      contributionPaymentService,
      establishmentService,
      alertService,
      documentService,
      router,
      billingRoutingService,
      route,
      eventService,
      reportStatementService
    );
  }
  /** This method is to initialize the component */
  ngOnInit() {
    this.alertService.clearAllErrorAlerts();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.idNumber = this.establishmentRegistrationNo.value;
    this.identifyModeOfTransaction();
    this.filterReceiptModes();
    this.getScreenHeading();
    this.language.subscribe(language => {
      this.lang = language;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
      this.saudiBankListSorted$ = this.sortLovList(this.saudiBankList$, true);
      this.internationalCountryListSorted$ = this.sortLovList(this.internationalCountryList$, false);
      this.gccCountryListSorted$ = this.sortLovList(this.gccCountryList$, false);
      this.gccBankListSorted$ = this.sortLovList(this.gccBankList$, true);
    }, noop);
    this.getLookupValues();
    this.initializeWizard();
    this.checkIsEditMode();
    if (history.state.paymentDetails) {
      this.getGovernmentPaymentDetails(history.state.paymentDetails);
    }
  }

  // Method to set the receive payment details for record government payments
  getGovernmentPaymentDetails(paymentDetails) {
    this.isGovPayment = true;
    this.govPaymentDetails = paymentDetails;
    this.establishmentService.getBranchDetails(this.establishmentRegistrationNo.value).subscribe(
      res => {
        this.branchDetails = res;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  //Check whether edit mode or not.
  checkIsEditMode() {
    if (this.inWorkflow) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.initialiseViewForEdit(this.routerDataToken, payload);
        if (this.routerDataToken.comments) {
          if (this.routerDataToken.comments.length > 0) {
            this.comments = this.routerDataToken.comments;
            this.isCommentsPresent = true;
          }
        }
      }
    } else {
      if (!this.isAppPrivate) {
        if (this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY))
          this.getEstablishmentDetails(
            Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY)),
            true
          );
      } else {
        if (!this.mofFlag) this.getEstablishmentDetails(this.idNumber, true);
      }
    }
  }
  /** Method to save the contirbution payment details */
  savePaymentDetails() {
    if (
      this.isGovPayment ||
      (this.checkFormValidity(this.receiveContributionMainForm.get('paymentDetails')) &&
        this.checkFormValidity(this.receiveContributionMainForm.get('receiptMode')))
    ) {
      this.errorFlag = false;
      this.createFormData();
      //If payment is already saved update the payment details or in workflow.
      if (!this.errorFlag) {
        if (this.isPaymentSaved || this.inWorkflow) {
          this.setAmount(!this.mofFlag, !this.gccFlag);
          this.contributionPaymentService
            .updatePayment(this.idNumber, this.receiptNumber, this.paymentDetails, this.mofFlag)
            .subscribe(
              () => this.retrieveScannedDocuments(this.paymentDetails.receiptMode.english),
              err => this.alertService.showError(err.error.message)
            );
          this.editFlag = true;
        }
        //If payment is not saved and rules are valid.
        else if (!this.isPaymentSaved) {
          if (!this.gccFlag) this.paymentDetails.amountReceived.currency = CurrencySar.ENGLISH;
          this.setAmount(!this.mofFlag, !this.gccFlag);
          this.contributionPaymentService
            .savePaymentDetails(
              this.idNumber,
              this.paymentDetails,
              this.mofFlag,
              this.isGovPayment,
              this.isGovPayment ? this.govPaymentDetails.receiptDetails.referenceNo : undefined
            )
            .pipe(
              tap(res => {
                this.paymentResponse.fromJsonToObject(res);
                this.receiptNumber = Number(this.paymentResponse.parentReceiptNo);
                if (this.receiptNumber !== null) {
                  this.isPaymentSaved = true;
                  this.nextForm();
                }
              }),
              switchMap(() => {
                return this.getDocuments(this.paymentDetails.receiptMode.english);
              }),
              catchError(err => {
                this.alertService.showError(err.error.message);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
        }
      }
    } else this.alertService.showMandatoryErrorMessage();
  } /** Method to create data from form and check validations. */
  createFormData() {
    this.paymentDetails = bindToObject(new PaymentDetails(), this.receiveContributionMainForm.get('receiptMode').value);
    this.paymentDetails = bindToObject(
      this.paymentDetails,
      (this.receiveContributionMainForm.get('paymentDetails') as FormArray).getRawValue()
    ); //In case of gcc establishment amount received should be gcc amount received
    if (this.gccFlag)
      this.paymentDetails.amountReceived.amount = this.receiveContributionMainForm
        .get('paymentDetails')
        .get('gccAmountReceived').value;
    if (this.mofFlag) {
      this.paymentDetails.branchAmount = null;
      this.paymentDetails.amountReceived.currency = 'SAR';
    if(this.estType === 'GOSI')
      this.paymentDetails.mofIndicator = BillingConstants.MOF_GOSI_ESTABLISHMENT;
     if (this.estType === 'PPA') 
     this.paymentDetails.mofIndicator = BillingConstants.MOF_PPA_ESTABLISHMENT;
    }
    if(this.isCurrent){
      this.paymentDetails.receiptMode.english = this.currentReceiptMode;
    }
    this.checkDataValidity();
  } /** Method to check the whether data entered is valid. */
  checkDataValidity() {
    if (!this.mofFlag) {
      let sum = 0;
      (this.receiveContributionMainForm.get('branchBreakupForm') as FormArray)
        .getRawValue()
        .forEach((item: BranchBreakup) => {
          if (item.allocatedAmount.amount == null) {
            item.allocatedAmount.amount = 0;
          }
          this.paymentDetails.branchAmount.push(new BranchBreakup().fromJsonToObject(item));
          sum += Number(item.allocatedAmount.amount);
        });
      if (this.receiveContributionMainForm.get('outSideBranchBreakupForm')) {
        (this.receiveContributionMainForm.get('outSideBranchBreakupForm') as FormArray)
          .getRawValue()
          .forEach((item: BranchBreakup) => {
            if (item.allocatedAmount.amount == null) item.allocatedAmount.amount = 0;
            this.paymentDetails.branchAmount.push(new BranchBreakup().fromJsonToObject(item));
            sum += Number(item.allocatedAmount.amount);
          });
      }
      sum = this.addTemporaryValues(sum); //To handle pagination scenarios.
      if (
        Number(parseFloat(this.paymentDetails.amountReceived.amount.toString()).toFixed(2)) !==
        Number(parseFloat(sum.toString()).toFixed(2))
      ) {
        //Check whether amount received is equal to total allocated amount.
        this.errorFlag = true;
        this.alertService.showErrorByKey('BILLING.TOTAL-AMOUNT-ERROR');
      }
    } //Check whether transaction date is before cheque date in case of non gcc establishments.
    if (
      (this.paymentDetails.receiptMode.english === ReceiptMode.BANKERS_CHEQUE ||
        this.paymentDetails.receiptMode.english === ReceiptMode.PERSONNEL_CHEQUE) &&
      !this.gccFlag
    ) {
      //To correct the date selected
      this.paymentDetails.transactionDate.gregorian = startOfDay(this.paymentDetails.transactionDate.gregorian);
      this.paymentDetails.chequeDate.gregorian = startOfDay(this.paymentDetails.chequeDate.gregorian);
      const transactionDate = moment(this.paymentDetails.transactionDate.gregorian).toDate();
      const chequeDate = moment(this.paymentDetails.chequeDate.gregorian).toDate();
      if (transactionDate < chequeDate) {
        this.errorFlag = true;
        this.alertService.showErrorByKey('BILLING.TRANSACTION-DATE-ERROR');
      }
    } else this.paymentDetails.transactionDate.gregorian = startOfDay(this.paymentDetails.transactionDate.gregorian);
  }
  /** * Method to add branches back to main list.
   * @param sum sum  */
  addTemporaryValues(sum: number): number {
    if (this.receiveContributionMainForm.get('tempBranchList')) {
      (this.receiveContributionMainForm.get('tempBranchList') as FormArray)
        .getRawValue()
        .forEach((temp: BranchBreakup) => {
          let matched = false;
          (this.receiveContributionMainForm.get('branchBreakupForm') as FormArray)
            .getRawValue()
            .forEach((item: BranchBreakup) => {
              if (temp.registrationNo === item.registrationNo) {
                matched = true;
              }
            });
          if (!matched) {
            this.paymentDetails.branchAmount.push(new BranchBreakup().fromJsonToObject(temp));
            sum += Number(temp.allocatedAmount.amount);
          }
        });
    }
    return sum;
  }
  /** Method to submit payment details. */
  submitPaymentDetails() {
    let updatePayment: UpdatePayment = new UpdatePayment();
    updatePayment = bindToObject(updatePayment, this.receiveContributionMainForm.get('comments').value);
    if (this.checkMandatoryDocuments()) {
      if (!this.inWorkflow) {
        this.contributionPaymentService
          .submitPaymentDetails(
            this.idNumber,
            this.receiptNumber,
            updatePayment,
            this.mofFlag,
            this.isGovPayment,
            this.isGovPayment ? this.govPaymentDetails.receiptDetails.referenceNo : undefined
          )
          .pipe(
            tap(res => {
              this.paymentReceived = true;
              this.paymentResponse.fromJsonToObject(res);
              this.alertService.clearAlerts();
              this.successMessage = this.paymentResponse.transactionMessage; //Setting success message
              this.getPaymentSummary();
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      } else {
        const bpmUpdateRequest = new BPMUpdateRequest();
        bpmUpdateRequest.taskId = this.routerDataToken.taskId;
        bpmUpdateRequest.user = this.routerDataToken.assigneeId;
        bpmUpdateRequest.isExternalComment = !this.isAppPrivate && this.inWorkflow ? true : false;
        bpmUpdateRequest.commentScope = 'BPM';
        bpmUpdateRequest.comments = this.receiveContributionMainForm.get('comments.comments').value;
        this.workflowService.updateTaskWorkflow(bpmUpdateRequest).subscribe(
          res => {
            if (res) {
              this.alertService.showSuccessByKey('BILLING.VALIDATOR-SUCCESS-MESSAGE', null, 4);
              if (this.isAppPrivate) this.billingRoutingService.navigateToInbox();
              else this.billingRoutingService.navigateToPublicInbox();
            }
          },
          err => this.alertService.showError(err.error.message)
        );
      }
    } else this.alertService.showMandatoryDocumentsError();
  }
  /** Method to get gcc conversion rate.e */
  getConversionRate(values) {
    this.countryValue = values.countryName ? values.countryName : values[0]?.countryName;
    this.newTransactionDate = values.transactionDate ? values.transactionDate : values[0]?.transactionDate;
    const currency: CurrencyDetails = new CurrencyDetails();
    const currencyValue: BilingualText = new BilingualText();
    if (this.countryValue !== undefined) {
      currency.countryCode = GccCountryCode[GccCountry[this.countryValue].replace(/\s/g, '_').toUpperCase()];
      currency.currencyCode.english = this.countryValue;
      currency.currencyCode.arabic = CurrencyArabicShortForm[this.countryValue];
      currencyValue.english = this.countryValue;
      currencyValue.arabic = CurrencyArabicShortForm[this.countryValue];
      if (this.countryValue !== CurrencySar.ENGLISH) {
        this.exchangeRateService
          .getExchangeRate(this.countryValue, CurrencySar.ENGLISH, this.newTransactionDate)
          .subscribe(res => {
            this.initialExchangeRate = currency.exchangeRate = res;
            if (this.paymentReceived) {
              currency.convertedAmount = Number(
                parseFloat(
                  (this.receiptPaymentSummaryDetails.amountReceived.amount * currency.exchangeRate).toString()
                ).toFixed(2)
              );
            }
            this.currencyDetails = { ...currency };
          });
      }
      this.gccCurrency = currencyValue;
    }
  } /** This method is to trigger revert api in validator edit mode on cancel click. */
  cancelForm() {
    if (this.isGovPayment) {
      this.router.navigate([BillingConstants.RECORD_GOVERNMENT_PAYMENT]);
    } else if (this.inWorkflow) {
      if (this.editFlag) {
        this.contributionPaymentService.revertPaymentDetails(this.idNumber, this.receiptNumber, this.mofFlag).subscribe(
          () => this.navigateBack(),
          err => this.alertService.showError(err.error.message)
        );
      } else this.navigateBack();
    } else {
      if (this.isPaymentSaved) {
        this.cancelDetails.comments = null;
        this.cancelDetails.reasonForCancellation = null;
        this.cancelDetails.penaltyIndicator = null;
        this.contributionPaymentService
          .cancelPaymentDetails(this.idNumber, this.receiptNumber, this.mofFlag, this.cancelDetails)
          .subscribe(
            () => this.navigateOnCancel(),
            err => this.alertService.showError(err.error.message)
          );
      } else this.navigateOnCancel();
    }
  }
  /* Method to intialise the view in edit mode */
  initialiseViewForEdit(token: RouterData, payload) {
    this.idNumber = payload.registrationNo;
    this.receiptNumber = payload.id;
    if (!this.mofFlag) {
      if (this.idNumber) this.getEstablishmentDetails(this.idNumber, false);
      this.establishmentService.getBranchDetails(this.idNumber).subscribe(
        branches => {
          this.searchResult = true;
          this.branchDetails = branches;
          this.getReceiptDetails(token);
        },
        err => this.alertService.showError(err.error.message)
      );
    } else this.getReceiptDetails(token);
  }
  /** Method to retrieve receipt details.
   * @param token contribution payment token */
  getReceiptDetails(token: RouterData) {
    this.contributionPaymentService
      .getReceiptDetails(this.idNumber, this.receiptNumber, this.mofFlag, ReceiptType.PARENT_RECEIPT)
      .subscribe(
        receipt => {
          if (this.branchDetails && receipt && !this.mofFlag) {
            this.branchDetails.forEach((branch: BranchDetails) => {
              receipt.branchAmount.forEach((breakup: BranchBreakup) => {
                if (breakup.outsideGroup === false) {
                  if (branch.registrationNo === breakup.registrationNo)
                    branch.allocatedAmount = breakup.allocatedAmount;
                }
              });
            });
            receipt.branchAmount.forEach((outSideBrancheakup: BranchBreakup) => {
              if (outSideBrancheakup.outsideGroup === true) {
                this.establishmentService.getBranchDetails(outSideBrancheakup.registrationNo).subscribe(branches => {
                  branches.forEach((branchData: BranchDetails) => {
                    if (branchData.registrationNo === outSideBrancheakup.registrationNo) {
                      branchData.allocatedAmount = outSideBrancheakup.allocatedAmount;
                      this.outsideData.push(branchData);
                    }
                  });
                  this.outSideBranchDetails = [...this.outsideData];
                });
              }
            });
          }
          this.receiptDetails = new PaymentDetails().fromJsonToObject(receipt);
          if (this.receiptDetails.bank.country.english) {
            Object.keys(GccCountry).forEach(key => {
              this.values = [];
              if (GccCountry[key] === this.receiptDetails.bank.country.english) {
                const transactionDate = moment(this.receiptDetails.transactionDate.gregorian).format('YYYY-MM-DD');
                const obj = {
                  countryName: key,
                  transactionDate: transactionDate
                };
                this.values.push(obj);
                if (this.gccFlag) this.getConversionRate(this.values);
              }
            });
          }
          //If edit scanned documents.
          if (token.tabIndicator === 1) {
            this.retrieveScannedDocuments(this.receiptDetails.receiptMode.english);
            this.editFlag = true;
          }
        },
        err => this.alertService.showError(err.error.message)
      );
  } /** This method is to get summary page details*/
  getPaymentSummary() {
    this.contributionPaymentService
      .getReceiptDetails(this.idNumber, this.receiptNumber, this.mofFlag, ReceiptType.PARENT_RECEIPT)
      .subscribe(receipt => {
        this.receiptPaymentSummaryDetails = new PaymentDetails().fromJsonToObject(receipt);
        this.values = [];
        const transactionDate = moment(this.receiptPaymentSummaryDetails.transactionDate.gregorian).format(
          'YYYY-MM-DD'
        );
        const obj = {
          countryName: this.receiptPaymentSummaryDetails.amountReceived.currency,
          transactionDate: transactionDate
        };
        this.values.push(obj);
        if (this.gccFlag) {
          this.checkEventDate(transactionDate) ? this.getEventDate(this.values) : this.getConversionRate(this.values);
        } else this.gccCurrency = BillingConstants.CURRENCY_SAR;
        this.getSumaryPageDetails();
      });
    this.getSumaryPageDetails();
  } /** Method to get event date details*/
  getEventDate(values) {
    if (values) {
      const eventDate = values.transactionDate ? values.transactionDate : values[0].transactionDate;
      const currency = values.countryName ? values.countryName : values[0].countryName;
      const actualDate = moment(eventDate).toDate().getFullYear() - 1;
      if (actualDate) {
        this.eventService.getEventDetailsByDate(actualDate, 12, actualDate, 12, 'APPROVED').subscribe(res => {
          if (res.eventDateInfo && res.eventDateInfo[0] && res.eventDateInfo[0].eventDate) {
            const eventDifference = moment(res.eventDateInfo[0].eventDate.gregorian).diff(moment(eventDate));
            if (eventDifference >= 0) {
              const transDate = moment(eventDate).toDate().getFullYear() - 1 + '-12-31';
              this.getConversionRate({ transactionDate: transDate, countryName: currency });
            } else this.getConversionRate({ transactionDate: eventDate, countryName: currency });
          }
        });
      }
    }
  }
  getPenlaityIndicator(evt) {
    this.penalityIndicator = evt;
  }
  getCurrentMode(event) {
    this.isCurrent = event;
  }
  getCurrentReceipt(event){
    this.currentReceiptMode = event;
  }
  getEstType(type) {
    this.estType = type;
  }
  previousForm() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.receiveContributionWizard.setPreviousItem(this.currentTab);
  }
}
