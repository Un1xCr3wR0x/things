/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { InvoiceDetails } from '../../models/invoice-details';
import { MonthYearLabel } from '../../enums';

@Component({
  selector: 'oh-batch-details-dc',
  templateUrl: './batch-details-dc.component.html',
  styleUrls: ['./batch-details-dc.component.scss']
})
export class BatchDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  lang = 'en';
  /**
   * Input variables
   */

  @Input() batchDetails: InvoiceDetails = new InvoiceDetails();
  @Input() auditorFlow = false;
  @Input() templateView = false;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
  ngOnInit(): void {}
  /** Method to detect chnages in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.batchDetails && changes.batchDetails.currentValue) {
      this.batchDetails = changes.batchDetails.currentValue;
      if (this.batchDetails) {
        this.batchDetails.batchMonthString = Object.values(MonthYearLabel)[
          moment(this.batchDetails.batchMonth.gregorian).toDate().getMonth()
        ];
      }
    }
  }
}
