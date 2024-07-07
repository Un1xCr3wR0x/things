/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { DocumentItem, DropdownItem } from '@gosi-ui/core';
import { PaymentList } from '@gosi-ui/features/payment/lib/shared';
import { AdjustmentHistoryDetail } from '@gosi-ui/features/payment/lib/shared/models/adjustment-history-detail';

@Component({
  selector: 'pmt-third-party-adjustment-tabset-dc',
  templateUrl: './third-party-adjustment-tabset-dc.component.html',
  styleUrls: ['./third-party-adjustment-tabset-dc.component.scss']
})
export class ThirdPartyAdjustmentTabset implements OnInit, OnChanges {
  constructor() {}
  // Input Variables
  @Input() adjustmentTabValues: DropdownItem[];
  @Input() benefitList: AdjustmentHistoryDetail[];
  @Input() document: DocumentItem[];
  @Input() transactionDocs: DocumentItem[];
  @Input() showSequenceNo = false;
  @Input() paymentList: Map<number, PaymentList>;

  // Output Variables
  @Output() addDocs: EventEmitter<null> = new EventEmitter();
  @Output() onTransactionIdClicked = new EventEmitter();
  // Local Variables
  limitChar: number;
  readMoreNotes = false;
  limit = 100;
  showMoreTextField = 'ADJUSTMENT.READ-FULL-NOTE';
  currentab = 0;
  ngOnChanges() {}
  ngOnInit(): void {}

  selectTab(val) {
    if (val === 0) {
      this.currentab = 0;
    } else if (val === 1) {
      this.currentab = 1;
    } else {
      this.currentab = 2;
    }
  }
  addDocumentButton() {
    this.addDocs.emit();
  }
  readFullNote(noteText) {
    this.readMoreNotes = !this.readMoreNotes;
    if (this.readMoreNotes) {
      this.limit = noteText.length;
      this.showMoreTextField = 'ADJUSTMENT.READ-LESS-NOTE';
    } else {
      this.limit = this.limitChar;
      this.showMoreTextField = 'ADJUSTMENT.READ-FULL-NOTE';
    }
  }
}
