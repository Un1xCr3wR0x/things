import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Adjustment } from '../../../shared/models/adjustment';
import { Router } from '@angular/router';

@Component({
  selector: 'pmt-adjustment-details-view-dc',
  templateUrl: './adjustment-details-view-dc.component.html',
  styleUrls: ['./adjustment-details-view-dc.component.scss']
})
export class AdjustmentDetailsViewDcComponent implements OnInit {
  @Input() adjustment: Adjustment;
  @Input() limit? = 100;
  @Output() onNavigateToBenefitDetails = new EventEmitter();
  showFlag = false;
  showMoreText = 'ADJUSTMENT.READ-MORE';
  limitvalue: number;
  constructor(readonly router: Router) {}

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
  navigateToBenefittDetails(adjustment) {
    this.onNavigateToBenefitDetails.emit(adjustment);
  }
}
