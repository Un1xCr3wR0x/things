import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { PaymentHistoryDetails } from '../../models';

@Component({
  selector: 'bnt-adjustment-popup-dc',
  templateUrl: './adjustment-popup-dc.component.html',
  styleUrls: ['./adjustment-popup-dc.component.scss']
})
export class AdjustmentPopupDcComponent implements OnInit {
  @Input() paymentHistory: PaymentHistoryDetails;
  @Output() close: EventEmitter<null> = new EventEmitter();
  @Output() onAdjustmentClicked = new EventEmitter();
  @Output() onBenefitTypeClicked = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  /*
   * This method is to close Modal
   */
  hideModal() {
    this.close.emit();
  }
}
