import { Component, OnInit, Inject, OnChanges, SimpleChanges } from '@angular/core';
import {
  DocumentService,
  DocumentItem,
  RouterDataToken,
  RouterData,
  Role,
  TransactionService,
  TransactionReferenceData,
  RouterConstants,
  BilingualText,
  CurrencySar,
  AlertService,
  ExchangeRateService,
  Transaction
} from '@gosi-ui/core';
import { CurrencyDetails, EstablishmentDetails, PaymentDetails, BranchBreakup } from '../../../../shared/models';
import { assembleCurrencyDetails, createBilingualObject } from '../../../../shared/utils';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import {
  CurrencyArabic,
  CurrencyArabicShortForm,
  EstablishmentDocumentType,
  MOFDocumentType,
  Months,
  PaymentHeader,
  ReceiptType
} from '../../../../shared/enums';
import {
  BillingRoutingService,
  ContributionPaymentService,
  EstablishmentService,
  EventDateService
} from '../../../../shared/services';
import { switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '../../../../shared/constants';

@Component({
  selector: 'blg-receive-payment-sc',
  templateUrl: './receive-payment-sc.component.html',
  styleUrls: ['./receive-payment-sc.component.scss']
})
export class ReceivePaymentScComponent implements OnInit, OnChanges {
  establishmentDetails: EstablishmentDetails = new EstablishmentDetails();
  paymentDetails: PaymentDetails;
  currencyDetails: CurrencyDetails;
  gccFlag: boolean;
  isMOF: boolean;
  showContent = false;
  canReturn = false;
  isGOL = false;
  comments: TransactionReferenceData[] = [];
  paymentbillBatchIndicator = false;
  isEditApprove = false;
  currency: BilingualText;
  documents: DocumentItem[] = [];
  isOutsideGroupPresent: boolean;
  isBranchPresent: boolean;
  branchAmount: BranchBreakup[];
  transaction: Transaction;
  registrationNumber: number;
  receiptNo: number;
  id: number;
  showOutsideGroup: boolean;
  THIRD_PARTY_ID: number;

  constructor(
    readonly eventService: EventDateService,
    readonly exchangeRateService: ExchangeRateService,
    readonly documentService: DocumentService,
    private alertService: AlertService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {}
  /**
   * This method is to detect changes in input property.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentDetails && changes.paymentDetails.currentValue) {
      if (changes.paymentDetails && changes.paymentDetails.currentValue) {
        if (!this.isMOF) {
          this.isOutsideGroupPresent = this.paymentDetails.branchAmount.some(item => item.outsideGroup);
          this.isBranchPresent = this.paymentDetails.branchAmount.some(item => !item.outsideGroup);
        }
      }
    }
  }
  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.registrationNumber = this.transaction?.params?.REGISTRATION_NO;
      this.receiptNo = this.transaction?.params?.RECEIPT_NO;
      this.THIRD_PARTY_ID = this.transaction?.params?.THIRD_PARTY_ID;
    }
    if (this.THIRD_PARTY_ID) this.isMOF = true;
    if (this.routerDataToken.taskId) {
      this.showContent = true;
      this.initialiseTheView(this.routerDataToken);
    }
    this.getDataForView();
  }
  initialiseTheView(validatorDataToken: RouterData) {
    const payload = JSON.parse(validatorDataToken.payload);
    if (this.routerDataToken.assignedRole === Role.VALIDATOR_2 || payload.channel === 'gosi-online') {
      this.canReturn = true;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
    }
    if (validatorDataToken.comments.length > 0) {
      this.comments = validatorDataToken.comments;
    }
    this.isMOF =
      validatorDataToken.resourceType === RouterConstants.TRANSACTION_RECEIVE_CONTRIBUTION_MOF ? true : false;

    this.currencyDetails = new CurrencyDetails(
      createBilingualObject(CurrencySar.ENGLISH, CurrencyArabicShortForm[CurrencySar.ENGLISH])
    );
  }

  getDataForView() {
    if (!this.isMOF) {
      this.establishmentService.getEstablishment(this.registrationNumber).subscribe(res => {
        this.establishmentDetails = res;
        if (this.establishmentDetails.gccEstablishment != null) {
          this.gccFlag = true;
        }
        this.contributionPaymentService
          .getReceiptDetails(this.registrationNumber, this.receiptNo, this.isMOF, ReceiptType.PARENT_RECEIPT)
          .pipe(
            tap(receipt => {
              this.paymentDetails = new PaymentDetails().fromJsonToObject(receipt);
              this.paymentbillBatchIndicator = receipt.billBatchIndicator;
              if (this.paymentbillBatchIndicator) {
                this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
                this.isEditApprove = true;
              }
              if (this.gccFlag && this.paymentDetails.amountReceived.currency !== CurrencySar.ENGLISH) {
                //To get conversion rate for gcc establishments.
                this.checkConversionRate(
                  {
                    transactionDate: moment(this.paymentDetails.transactionDate.gregorian).format('YYYY-MM-DD'),
                    countryCode: this.paymentDetails.amountReceived.currency
                  },
                  Months
                );
              } else {
                this.currency = createBilingualObject(
                  CurrencySar.ENGLISH,
                  CurrencyArabicShortForm[CurrencySar.ENGLISH]
                );
              }
            }),
            switchMap(() => {
              return this.getDocuments(this.receiptNo, this.paymentDetails.receiptMode.english);
            })
          )
          .subscribe();
      });
      if (!this.isMOF) {
        this.isOutsideGroupPresent = this.paymentDetails.branchAmount.some(item => item.outsideGroup);
        this.isBranchPresent = this.paymentDetails.branchAmount.some(item => !item.outsideGroup);
      }
    } else {
      this.contributionPaymentService
        .getReceiptDetails(1, this.receiptNo, this.isMOF, ReceiptType.PARENT_RECEIPT)
        .pipe(
          tap(receipt => (this.paymentDetails = new PaymentDetails().fromJsonToObject(receipt))),
          switchMap(() => {
            return this.getDocuments(this.receiptNo, this.paymentDetails.receiptMode.english);
          })
        )
        .subscribe();
    }
  }
  getDocuments(receiptNo: number, receiptMode: string): Observable<DocumentItem[]> {
    const key = receiptMode.replace(/\s/g, '_').toUpperCase();
    let transactionType: string;
    if (this.isMOF) {
      transactionType = MOFDocumentType[key];
    } else {
      transactionType = EstablishmentDocumentType[key];
    }
    return this.documentService.getDocuments(BillingConstants.SCAN_TRANSACTION_ID, transactionType, receiptNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }

  getConversionRates(currencyDetails) {
    this.exchangeRateService
      .getExchangeRate(currencyDetails?.countryCode, CurrencySar.ENGLISH, currencyDetails?.transactionDate)
      .subscribe(res => {
        this.currencyDetails = assembleCurrencyDetails(
          this.paymentDetails.amountReceived.amount,
          res,
          currencyDetails?.countryCode
        );
        this.currency = createBilingualObject(
          currencyDetails?.countryCode,
          CurrencyArabic[currencyDetails?.countryCode]
        );
      });
  }
  checkConversionRate(currencyDetails, months) {
    const month = this.getMonthFromDate(new Date(currencyDetails?.transactionDate));
    const checkMonth = 'BILLING.' + 'CALENDAR.' + month.toUpperCase();
    if (checkMonth === months.january) {
      this.getEventDates(currencyDetails);
    } else {
      this.getConversionRates(currencyDetails);
    }
  }
  /** Method to get event date details*/
  getEventDates(values) {
    if (values) {
      const eventDate = values.transactionDate ? values.transactionDate : values[0].transactionDate;
      const year = moment(eventDate).toDate().getFullYear() - 1;
      if (year) {
        this.eventService.getEventDetailsByDate(year, 12, year, 12, 'APPROVED').subscribe(res => {
          if (res.eventDateInfo && res.eventDateInfo[0] && res.eventDateInfo[0].eventDate) {
            const eventDifference = moment(res.eventDateInfo[0].eventDate.gregorian).diff(moment(eventDate));
            if (eventDifference >= 0) {
              const transDate = moment(eventDate).toDate().getFullYear() - 1 + '-12-31';
              this.getConversionRates({ transactionDate: transDate, countryCode: values.countryCode });
            } else
              this.getConversionRates({ transactionDate: values.transactionDate, countryCode: values.countryCode });
          }
        });
      }
    }
  }
  getMonthFromDate(date: Date): string {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }
}
