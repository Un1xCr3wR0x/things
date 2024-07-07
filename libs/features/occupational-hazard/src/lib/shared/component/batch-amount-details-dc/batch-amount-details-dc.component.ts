/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, Input, SimpleChanges, OnChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { InvoiceDetails } from '../../models/invoice-details';
import { MonthYearLabel } from '../../enums';
import moment from 'moment';

@Component({
  selector: 'oh-batch-amount-details-dc',
  templateUrl: './batch-amount-details-dc.component.html',
  styleUrls: ['./batch-amount-details-dc.component.scss']
})
export class BatchAmountDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  lang = 'en';
  /**
   * Input variables
   */

  @Input() amountDetails: InvoiceDetails = new InvoiceDetails();
  @Input() templateView = false;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
  ngOnInit(): void {}
  /** Method to detect chnages in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.templateView && changes.templateView.currentValue) {
      this.templateView = changes.templateView.currentValue;
    }
    if (changes.batchDetails && changes.batchDetails.currentValue) {
      this.amountDetails = changes.batchDetails.currentValue;
      if (this.amountDetails) {
        this.amountDetails.batchMonthString = Object.values(MonthYearLabel)[
          moment(this.amountDetails.batchMonth.gregorian).toDate().getMonth()
        ];
      }
    }
  }
}
