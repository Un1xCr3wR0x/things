import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Adjustment } from '../../../shared';

@Component({
  selector: 'pmt-adjustment-modification-dc',
  templateUrl: './adjustment-modification-dc.component.html',
  styleUrls: ['./adjustment-modification-dc.component.scss']
})
export class AdjustmentModificationDcComponent implements OnInit {
  /**Local Variable */
  @Input() adjustment: Adjustment;
  @Input() limit? = 100;

  @Output() onTransactionIdClicked = new EventEmitter();

  showFlag = false;
  showMoreText = 'ADJUSTMENT.READ-MORE';
  isAngleDown = true;
  limitvalue: number;
  constructor() {}

  ngOnInit(): void {
    this.limitvalue = this.limit;
  }
  readFull(noteText) {
    this.showFlag = !this.showFlag;
    if (this.showFlag) {
      this.limit = noteText.length;
      this.showMoreText = 'ADJUSTMENT.READ-LESS';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'ADJUSTMENT.READ-MORE';
    }
  }
}
