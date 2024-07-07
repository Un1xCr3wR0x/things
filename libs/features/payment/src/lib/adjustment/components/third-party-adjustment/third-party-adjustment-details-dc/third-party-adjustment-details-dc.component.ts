/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { BilingualText, DocumentItem, DropdownItem } from '@gosi-ui/core';
import { Adjustment, AdjustmentConstants, PayeeDetails, PaymentList } from '@gosi-ui/features/payment/lib/shared';
import { AdjustmentHistoryDetail } from '@gosi-ui/features/payment/lib/shared/models/adjustment-history-detail';
@Component({
  selector: 'pmt-third-party-adjustment-details-dc',
  templateUrl: './third-party-adjustment-details-dc.component.html',
  styleUrls: ['./third-party-adjustment-details-dc.component.scss']
})
export class ThirdPartyAdjsutmentDetailsDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() payeeDetails: PayeeDetails;
  @Input() adjustmentValues: Adjustment[];
  @Input() adjustmentTabs: DropdownItem[];
  @Input() benefitList: AdjustmentHistoryDetail[];
  @Input() otherDocs: DocumentItem[];
  @Input() transactionDocs: DocumentItem[];
  @Input() paymentList: Map<number, PaymentList>;
  @Input() benefitStatus: BilingualText;

  // Output values
  @Output() addDocsPage: EventEmitter<null> = new EventEmitter();
  @Output() onTransactionIdClicked = new EventEmitter();
  // Local Variables
  limitChar: number;
  requestedByMoj = AdjustmentConstants.REQUESTED_BY_MOJ;
  readMoreNotes = false;
  limit = 100;
  showMoreTextField = 'ADJUSTMENT.READ-FULL-NOTE';
  constructor() {}
  ngOnChanges() {}
  ngOnInit() {
    this.limitChar = this.limit;
  }
  readFull(noteText) {
    this.readMoreNotes = !this.readMoreNotes;
    if (this.readMoreNotes) {
      this.limit = noteText.length;
      this.showMoreTextField = 'ADJUSTMENT.READ-LESS-NOTE';
    } else {
      this.limit = this.limitChar;
      this.showMoreTextField = 'ADJUSTMENT.READ-FULL-NOTE';
    }
  }
  navigate() {}
  addDocs() {
    this.addDocsPage.emit();
  }
}
