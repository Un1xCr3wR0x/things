/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'pmt-payment-options-dc',
  templateUrl: './payment-options-dc.component.html',
  styleUrls: ['./payment-options-dc.component.scss']
})
export class PaymentOptionsDcComponent implements OnInit {
  @Output() close = new EventEmitter();
  ngOnInit(): void {}
  // method to close the modal
  closeModal() {
    this.close.emit();
  }
}
