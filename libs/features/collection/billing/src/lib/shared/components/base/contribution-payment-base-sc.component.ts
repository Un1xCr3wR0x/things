/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BaseComponent,
  LovList,
  WizardItem,
  LookupService,
  AlertService,
  scrollToTop,
  DocumentItem,
  DocumentService,
  CurrencySar,
  GosiCalendar,
  BilingualText
} from '@gosi-ui/core';
import { Observable, of } from 'rxjs';
import { Directive, OnDestroy, ViewChild } from '@angular/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BillingConstants, PaymentConstants, RouteConstants } from '../../constants';
import { map, tap, catchError } from 'rxjs/operators';
import {
  ContributionPaymentService,
  EstablishmentService,
  BillingRoutingService,
  EventDateService
} from '../../services';
import {
  PaymentHeader,
  ReceiptMode,
  GCCBankDomain,
  EstablishmentDocumentType,
  MOFDocumentType,
  Months
} from '../../enums';
import {
  EstablishmentDetails,
  BranchDetails,
  PaymentDetails,
  BranchFilter,
  PenaltyWaiverEventDate,
  WorkFlowStatus
} from '../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ReportStatementService } from '../../services/report-statement.service';
@Directive()
export abstract class ContributionPaymentBaseScComponent extends BaseComponent implements OnDestroy {
  /** Local variables */
  receiveContributionWizardItems: WizardItem[] = [];
  paymentReceived = false;
  isPaymentSaved = false;
  successMessage: BilingualText;
  inWorkflow = false;
  gccFlag = false;
  isAppPrivate = false;
  lang = 'en';
  languageType: string;
  mofFlag = false;
  searchResult = true;
  isPrivateEst = false;
  isChequeScanned = false;
  isPaymentScanned = false;
  isBranchesClosed: boolean;
  headerValue = PaymentHeader.RECEIVE_PAYMENT;
  idNumber: number;
  establishmentDetails: EstablishmentDetails = new EstablishmentDetails();
  branchDetails: BranchDetails[] = [];
  outSideBranchDetails: BranchDetails[];
  branchFilterDetails: BranchDetails[] = [];
  noFilterResult = false;
  outsideData: BranchDetails[] = [];
  documentList: DocumentItem[] = [];
  paymentDetails: PaymentDetails = new PaymentDetails();
  receiptNumber: number;
  currentTab = 0;
  receiptPaymentSummaryDetails: PaymentDetails = new PaymentDetails();
  branchSummary: BranchDetails[];
  penaltyWaiverEventDate: PenaltyWaiverEventDate;
  establishmentValues: EstablishmentDetails = new EstablishmentDetails();
  fieldArray: BranchDetails[];
  branchFilterValues: BranchFilter;
  workFLowResp: WorkFlowStatus[];
  receiveContributionMainForm: FormGroup = new FormGroup({});
  /** Child components */
  @ViewChild('receiveContributionWizard', { static: false })
  receiveContributionWizard: ProgressWizardDcComponent;
  /** Observables */
  receiptModes$: Observable<LovList>;
  receiptModesFilter$: Observable<LovList>;
  saudiBankList$: Observable<LovList>;
  saudiBankListSorted$: Observable<LovList>;
  gccCountryList$: Observable<LovList>;
  gccCountryListSorted$: Observable<LovList>;
  gccBankList$: Observable<LovList>;
  gccBankListSorted$: Observable<LovList>;
  bankType$: Observable<LovList>;
  establishmentLocationList$: Observable<LovList>;
  establishmentStatusList$: Observable<LovList>;
  internationalCountryList$: Observable<LovList>;
  internationalCountryListSorted$: Observable<LovList>;
  yesOrNoList$: Observable<LovList>;
  establishmentTypeList$: Observable<LovList>;
  establishment: BranchDetails[] = [];
  /**
   * Creates an instance of ContributionPaymentBaseScComponent
   */
  constructor(
    readonly lookupService: LookupService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly billingRoutingService: BillingRoutingService,
    readonly route: ActivatedRoute,
    readonly eventService: EventDateService,
    readonly reportStatementService: ReportStatementService
  ) {
    super();
  }
  initializeWizard() {
    this.receiveContributionWizardItems = this.getWizards();
    this.receiveContributionWizardItems[0].isDisabled = false;
    this.receiveContributionWizardItems[0].isActive = true;
  } /** Method to get wizard items */
  getWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BillingConstants.CONTRIBUTION_PAYMENT_DETAILS, 'file-invoice-dollar'));
    wizardItems.push(new WizardItem(BillingConstants.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  /** Method to set screen heading. */
  getScreenHeading() {
    if (this.isAppPrivate) {
      if (this.mofFlag) this.headerValue = PaymentHeader.RECEIVE_PAYMENT_MOF;
      else this.headerValue = PaymentHeader.RECEIVE_PAYMENT;
    } else this.headerValue = PaymentHeader.PAYMENT_NOTICE;
  } /** Method to get look up values for the component. */
  getLookupValues() {
    this.receiptModes$ = this.lookupService.getReceiptMode();
    this.saudiBankList$ = this.lookupService.getSaudiBankList();
    this.saudiBankListSorted$ = this.sortLovList(this.saudiBankList$, true);
    this.establishmentStatusList$ = this.lookupService.getEstablishmentStatusList();
    this.establishmentLocationList$ = this.lookupService.getEstablishmentLocationList();
    this.internationalCountryList$ = this.lookupService.getInternationalCountryList();
    this.internationalCountryListSorted$ = this.sortLovList(this.internationalCountryList$, false);
    this.bankType$ = this.lookupService.getBankType();
    this.yesOrNoList$ = this.lookupService.getYesOrNoList();
    this.establishmentTypeList$ = this.lookupService.getEstablishmentMOFTypeList();
    this.filterReceiptModes();
  }
  checkEventDate(date: string) {
    return Object.values(Months)[moment(date).toDate().getMonth()] === Months.january ? true : false;
  }
  /** Method to filter receipt modes. */
  filterReceiptModes() {
    if (this.receiptModes$) {
      this.receiptModesFilter$ = this.receiptModes$.pipe(
        map(list => {
          if (list) {
            if (!this.mofFlag) {
              if (this.gccFlag) {
                return new LovList(
                  list.items.filter(item => BillingConstants.GCC_RECEIPT_MODE.indexOf(item.value.english) === -1)
                );
              } else {
                return new LovList(
                  list.items.filter(item => PaymentConstants.NON_GCC_RECEIPT_MODE.indexOf(item.value.english) === -1)
                );
              }
            } else if (this.mofFlag) {
              return new LovList(
                list.items.filter(
                  lov =>
                    lov.value.english !== ReceiptMode.CASH_DEPOSIT &&
                    lov.value.english !== BillingConstants.SADAD_NETWORK &&
                    lov.value.english !== PaymentConstants.DIRECT_DEBIT &&
                    lov.value.english !== PaymentConstants.ATM &&
                    lov.value.english !== PaymentConstants.CASH
                )
              );
            }
          }
          return list;
        })
      );
    }
  }
  navigateBack() {
    this.navigateToBack(this.isAppPrivate);
  }
  /** * Metod to fech gcc banklist based on gcc country.
   * @param country contry name*/
  getGCCBankList(country: string) {
    if (country) {
      this.gccBankList$ = this.lookupService.getGCCBankList(GCCBankDomain[country.replace(/\s/g, '_').toUpperCase()]);
      this.gccBankListSorted$ = this.sortLovList(this.gccBankList$, true);
    }
  }
  /*** Methpd to sort lov list.
   * @param list lov list * @param isBank bank identifier */
  sortLovList(list: Observable<LovList>, isBank: boolean) {
    if (list) {
      return list.pipe(
        map(res => {
          if (res) return this.contributionPaymentService.sortLovList(res, isBank, this.lang);
        })
      );
    }
  }
  /**  * This method is used to search establishment details.
   * @param idNumber
   * @param branchRequired */
  getEstablishmentDetails(idNumber: number, branchRequired?: boolean) {
    this.idNumber = idNumber;
    this.establishmentService.getEstablishment(idNumber).subscribe(
      establishment => {
        if(establishment.gccCountry !== false) this.gccFlag = true; 
        if (establishment.legalEntity.english === BillingConstants.PRIVATE && !this.isAppPrivate && !this.gccFlag)
          this.isPrivateEst = true;
        else this.isPrivateEst = false;
        if (establishment.status !== null && establishment.status !== undefined) {
          if (!this.isAppPrivate) {
            if (
              establishment.legalEntity.english === BillingConstants.SEMI_GOVERNMENT ||
              establishment.legalEntity.english === BillingConstants.GOVERNMENT ||
              this.establishmentDetails.gccEstablishment != null
            ) {
              if (establishment.status.english === BillingConstants.REG_STATUS || establishment.status.english === BillingConstants.REOPENED_STATUS) {
                this.getChangeType(establishment, branchRequired);
                this.alertService.clearAlerts();
              } else {
                this.searchResult = false;
                this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
              }
            } else {
              this.searchResult = false;
              this.alertService.showErrorByKey('BILLING.SORRY-AN-ERROR');
            }
          } else if (establishment.status.english === BillingConstants.REG_STATUS || establishment.status.english === BillingConstants.REOPENED_STATUS || establishment.status.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS) {
            this.getChangeType(establishment, branchRequired);
            this.alertService.clearAlerts();
            this.searchResult = false;
          } else {
            this.searchResult = false;
            this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
          }
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  /* This method is to get another transaction details*/
  getAnotherTransaction() {
    this.receiptNumber = null;
    this.isPaymentSaved = false;
    this.paymentReceived = false;
    this.currentTab = 0;
    this.receiveContributionMainForm = new FormGroup({});
    if (this.isAppPrivate) this.navigateOnCancel();
  }
  getBranchDetails(establishment: EstablishmentDetails, branchRequired?: boolean) {
    if (this.establishmentDetails.gccEstablishment != null) {
      this.gccFlag = true;
      if (this.isAppPrivate) this.headerValue = PaymentHeader.RECEIVE_GCC_PAYMENT;
    } else this.gccFlag = false;
    this.gccCountryList$ = this.lookupService.getGccCountryList(this.gccFlag);
    this.gccCountryListSorted$ = this.sortLovList(this.gccCountryList$, false);
    if (branchRequired && this.searchResult && this.establishmentDetails?.establishmentType?.english === 'Main') {
      this.establishmentService.getBranchDetails(this.idNumber).subscribe(
        branches => {
          this.branchDetails = branches;
          this.isBranchesClosed = this.checkBranchesClosed(this.branchDetails);
        },
        err => this.alertService.showError(err.error.message)
      );
    }
    if (this.establishmentDetails?.establishmentType?.english === 'Branch') {
      const estBranchDetails = new BranchDetails();
      this.branchDetails = [];
      estBranchDetails.fromJsonToObject({
        establishmentType: establishment.establishmentType,
        registrationNo: establishment.registrationNo,
        name: establishment.name,
        status: establishment.status,
        allocatedAmount: { amount: 0 },
        fieldOffice: establishment.fieldOfficeName,
        location: { english: '', arabic: '' },
        closingDate: new GosiCalendar()
      });
      this.branchDetails.push(estBranchDetails);
    }
  }
  getChangeType(establishment: EstablishmentDetails, branchRequired?: boolean) {
    this.contributionPaymentService.getWorkFlowStatus(this.idNumber).subscribe(res => {
      this.workFLowResp = res;
      if (res.length !== 0) {
        res.forEach(value => {
          if (value.type === BillingConstants.LEGAL_ENTITY_CHANGE) {
            this.alertService.showErrorByKey('BILLING.CHANGE-IN-LEGAL-ENTITY');
            this.searchResult = false;
          } else if (value.type === BillingConstants.DELINK_BRANCH_CHANGE) {
            this.alertService.showErrorByKey('BILLING.CHANGE-IN-DELINK');
            this.searchResult = false;
          } else this.searchResult = true;
        });
      } else this.searchResult = true;
      this.getBranchDetails(establishment, branchRequired);
    });
    this.establishmentDetails.fromJsonToObject(establishment);
  }
  /**  * Method to check whether the branches are closed or not.
   * @param branches branches */
  checkBranchesClosed(branches: BranchDetails[]): boolean {
    let flag = true;
    branches.forEach(branch => {
      if (branch.establishmentType.english !== 'Main' && branch.status.english !== 'CLOSED') {
        flag = false;
      }
    });
    return flag;
  }
  /** Method to navigate to next form */
  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab++;
    if (this.receiveContributionWizard !== undefined) this.receiveContributionWizard.setNextItem(this.currentTab);
    scrollToTop();
  }
  /** Method to enable navigation through wizard. */
  selectWizard(index) {
    this.alertService.clearAllErrorAlerts();
    this.currentTab = index;
  }
  /**  * Method to fetch the required document for scanning.
   * @param receiptMode receipt mode  */
  getDocuments(receiptMode: string) {
    const key = receiptMode.replace(/\s/g, '_').toUpperCase();
    let docType: string;
    if (!this.mofFlag) docType = EstablishmentDocumentType[key];
    else docType = MOFDocumentType[key];
    return this.documentService.getRequiredDocuments(BillingConstants.SCAN_TRANSACTION_ID, docType).pipe(
      map(docs => this.documentService.removeDuplicateDocs(docs)),
      catchError(error => of(error)),
      tap(res => (this.documentList = res))
    );
  } /** Method to check whether mandatory documents are scanned/uploaded or not. */
  checkMandatoryDocuments() {
    return this.documentService.checkMandatoryDocuments(this.documentList);
  }
  /** * Method to perform feedback call after scanning.
   * @param document  */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.isPaymentScanned = false;
      this.isChequeScanned = false;
      this.documentService
        .refreshDocument(document, this.receiptNumber, BillingConstants.SCAN_TRANSACTION_ID)
        .subscribe(res => {
          if (res) {
            document = res;
            if (document.name.english === BillingConstants.COPY_CHEQUE && document.documentContent !== null)
              this.isChequeScanned = true;
            if (document.name.english === BillingConstants.PROOF_PAYMENT && document.documentContent !== null)
              this.isPaymentScanned = true;
          }
        });
    }
  }
  /** * Method to retrieve scanned documents based on receipt mode.*/
  retrieveScannedDocuments(receiptMode: string) {
    this.getDocuments(receiptMode).subscribe((documents: DocumentItem[]) => {
      this.documentList = documents;
      this.documentList.forEach(doc => {
        this.refreshDocument(doc);
      });
      this.nextForm();
    });
  }
  /** * Method to get summary page details  */
  getSumaryPageDetails() {
    if (!this.mofFlag) {
      this.establishmentService.getBranchDetails(Number(this.idNumber)).subscribe(res => {
        this.branchSummary = res;
        this.receiptPaymentSummaryDetails.branchAmount.forEach(data => {
          if (data.outsideGroup === true) {
            this.establishmentService.getEstablishment(data.registrationNo).subscribe(response => {
              this.establishmentValues = response;
            });
          }
        });
      });
    }
    if (this.receiveContributionWizard) this.receiveContributionWizard.setNextItem(0);
  }
  searchOutsideBranchesDetails(registerNumber: string) {
    if (typeof this.fieldArray === 'undefined') {
      this.fieldArray = [];
    }
    this.establishmentService.getEstablishment(Number(registerNumber)).subscribe(
      res => {
        if (res.gccEstablishment && res.gccEstablishment.gccCountry === true) {
          this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-IS-GCC');
        } else {
          this.establishmentService.getBranchDetails(Number(registerNumber)).subscribe(
            result => {
              this.fieldArray = result;
            },
            err => this.alertService.showError(err.error.message)
          );
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  } // Method to navigate to cancel
  navigateOnCancel() {
    this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.idNumber)]);
  } // Method to navigate to back
  navigateToBack(isAppPrivate) {
    if (isAppPrivate) this.billingRoutingService.navigateToValidator();
    else this.billingRoutingService.navigateToInbox();
  } //  Method to check form validity */
  checkFormValidity(form: AbstractControl) {
    if (form) return form.valid;
    return false;
  }
  identifyModeOfTransaction() {
    /** Method to identify the mode of transaction. */
    this.route.url.subscribe(res => {
      if (res[0].path === 'establishment-payment') {
        this.mofFlag = false;
        this.searchResult = false;
        if (res[1] && res[1].path === 'edit') this.inWorkflow = true;
      } else if (res[0].path === 'mof-payment') {
        this.mofFlag = true;
        this.idNumber = 1;
        this.searchResult = true;
        if (res[1] && res[1].path === 'edit') this.inWorkflow = true;
      }
    });
  } /** Method toget branch details based on filter conditions. */
  searchBrancDetails(registrationNo: string, branchFilterValues?: BranchFilter) {
    this.establishmentService.getBranchDetails(this.idNumber, registrationNo, branchFilterValues).subscribe(
      res => {
        this.branchFilterDetails = res;
        if (res) this.noFilterResult = false;
      },
      err => {
        if (err) this.noFilterResult = true;
      }
    );
  }
  setAmount(mofFlag, gccFlag) {
    if (mofFlag) {
      if (this.paymentDetails.bank.nonListedBank && this.paymentDetails.bank.type.english !== 'GCC Bank') {
        this.paymentDetails.branchAmount.forEach(data => {
          data.allocatedAmount.currency = CurrencySar.ENGLISH;
        });
      } else if (gccFlag) {
        this.paymentDetails.branchAmount.forEach(data => {
          data.allocatedAmount.currency = CurrencySar.ENGLISH;
        });
        this.paymentDetails.amountReceived.currency = CurrencySar.ENGLISH;
      }
    }
  }
  printTransaction() {
    this.reportStatementService
      .generatePaymentsReport(Number(this.idNumber), Number(this.receiptNumber), this.mofFlag, this.languageType)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
  outSideBranchValidate(statusFlag: boolean) {
    if (statusFlag === true) this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-EXISTS');
  }
  searchOutsideBranches(registerNumber: string) {
    this.searchOutsideBranchesDetails(registerNumber);
  }
  searchBranches(registrationNo: string) {
    this.searchBrancDetails(registrationNo, this.branchFilterValues);
  }
  getbranchFilter(branchFilter: BranchFilter) {
    this.branchFilterValues = branchFilter;
    this.establishmentService.getBranchDetails(this.idNumber, null, branchFilter).subscribe(
      res => {
        this.branchFilterDetails = res;
        if (res) this.noFilterResult = false;
      },
      err => {
        if (err) this.noFilterResult = true;
      }
    );
  }
}
