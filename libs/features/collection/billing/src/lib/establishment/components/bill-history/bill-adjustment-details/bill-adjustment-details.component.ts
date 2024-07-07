import {
  Component,
  OnInit,
  Inject,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import {
  LookupService,
  LovList,
  StorageService,
  BilingualText,
  CurrencyToken,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber,
  AlertService,
} from '@gosi-ui/core';
import { catchError, tap } from 'rxjs/operators';

import {
  EstablishmentHeader,
  ItemizedMiscRequest,
  ItemizedMiscResponse, ReceiptWrapper, RecordDetails
} from '../../../../shared/models';
import { Observable, Observer, BehaviorSubject, noop, throwError } from 'rxjs';
import { DetailedBillService, ReportStatementService, MiscellaneousAdjustmentService, BillRecordService } from '../../../../shared/services';

import moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingConstants } from '../../../../shared/constants';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'bill-adjustment-details',
  templateUrl: './bill-adjustment-details.component.html',
  styleUrls: ['./bill-adjustment-details.component.scss']
})
export class BillAdjustmentDetailsComponent implements OnInit {
  lang = 'en';
  miscAdjustmentRequest: ItemizedMiscRequest = new ItemizedMiscRequest();
  miscAdjustmentResponse: ItemizedMiscResponse = new ItemizedMiscResponse();


  recordEstablishmentList: LovList;
  recordHeaderValue: EstablishmentHeader = new EstablishmentHeader();
  recordListForm: FormGroup;
  recordidNumber: number;
  receiptList: RecordDetails[];
  receiptSortFields$: Observable<LovList>;
  regNo: number;
  selectedCurrency: string;

  // Local variables
  total = 0;
  hidenDetails = {
    oh: true,
    annuity: true,
    ui: true,
    rejectedOh: true,
    violation: true,
    ppaAnnuity: true,
    ppaPension: true
  };
  exchangeRate = 1;
  currencyType: BilingualText;


  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly miscAdjustmentService: MiscellaneousAdjustmentService,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly translate: TranslateService,
    readonly detailedBillService: DetailedBillService,
    readonly storageService: StorageService,
    readonly billRecordService: BillRecordService,
    readonly reportService: ReportStatementService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>
  ) { }


  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    //console.log(this.establishmentRegistrationNo);
    this.getAdjustmentDetails(this.establishmentRegistrationNo.value);
    this.receiptSortFields$ = this.lookupService.getReceiptSortFields();
    this.currency.subscribe(currentCurrencyKey => {
      this.selectedCurrency = currentCurrencyKey;
    });
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.recordidNumber = this.establishmentRegistrationNo.value;

  }


  ngChanges(changes: SimpleChanges) {
    if (changes) {
      changes.exchangeRate = changes.exchangeRate.currentValue;
      changes.currencyType = changes.currencyType.currentValue;
    }
  }

  navigateBackToBillDashBoard() {
    //this.navigateToBillDashBoard.emit();
  }


  /**
   * Method to handle search on key up.
   * @param receiptNo receipt number
   */
  onKeyUp(receiptNo: string) {


  }

  /**
   * Method to handle search on clicking search icon.
   * @param receiptNo receipt number
   */
  onSearch(receiptNo: string) {

  }
  backNavigationToPage() {
    this.router.navigate([BillingConstants.ROUTE_BILL_HISTORY]);
  }

  getAdjustmentDetails(idNumber: number) {
    this.miscAdjustmentRequest.startDate = null;
    this.miscAdjustmentRequest.miscellaneousAdjustmentType = null

    this.miscAdjustmentService.getMiscProcessedAdjustment(idNumber, this.miscAdjustmentRequest)
      .pipe(
        tap(res => {
          this.miscAdjustmentResponse = res;

          for (const adjustment of this.miscAdjustmentResponse.adjustments) {
            this.total += adjustment.totalAmount;
            this.hideAdjustmentDetails();
          }
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err.error.message);
        })
      )
      .subscribe(noop, noop);
  }



  hideAdjustmentDetails() {
    this.miscAdjustmentResponse.adjustments.forEach(adjustment => {
      if (adjustment.annContribution || adjustment.annPenality) {
        this.hidenDetails["annuity"] = false;
      }
      if(adjustment.ppaAnnContribution || adjustment.ppaAnnPenality) {
        this.hidenDetails["ppaAnnuity"] = false;
      }
      if(adjustment.prAnnContribution || adjustment.prAnnPenality) {
        this.hidenDetails["ppaPension"] = false;
      }
      if (adjustment.ohcontribution || adjustment.ohpenality) {
        this.hidenDetails["oh"] = false;
      }
      if (adjustment.uicontribution || adjustment.uipenality) {
        this.hidenDetails["ui"] = false;
      }
      if (adjustment.violationAmount) {
        this.hidenDetails["violation"] = false;
      }
      if (adjustment.rejectedOHAmount) {
        this.hidenDetails["rejectedOh"] = false;
      }
    });
  }

}


