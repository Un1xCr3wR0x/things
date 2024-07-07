/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { scrollToTop, LanguageToken, BilingualText } from '@gosi-ui/core';
import { PaymentDetails, BranchDetails, EstablishmentDetails, CurrencyDetails } from '../../../shared/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blg-payment-summary-dc',
  templateUrl: './payment-summary-dc.component.html',
  styleUrls: ['./payment-summary-dc.component.scss']
})
export class PaymentSummaryDcComponent implements OnInit {
  /**LocaL Variable */
  lang = 'en';

  /**
   * Input variable
   */
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() successMessage: BilingualText;
  @Input() receiptPaymentSummaryDetails: PaymentDetails;
  @Input() branchSummary: BranchDetails[];
  @Input() currencyDetails: CurrencyDetails;
  @Input() gccFlag: boolean;
  @Input() gccCurrency;
  @Input() mofFlag: boolean;
  @Input() establishmentValues = [];

  /**
   * Output variable
   */

  @Output() anotherTransaction: EventEmitter<null> = new EventEmitter();
  @Output() print: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of ReceiptBreakupDcComponent
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Initializes the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
    scrollToTop();
  }
  getAnotherTranscation() {
    this.anotherTransaction.emit();
  }
  printTransaction() {
    this.print.emit();
  }
}
