/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BenefitPaymentDetails } from '../../../shared/models';

@Component({
  selector: 'bnt-add-bank-template-dc',
  templateUrl: './add-bank-template-dc.component.html',
  styleUrls: ['./add-bank-template-dc.component.scss']
})
export class AddBankTemplateDcComponent implements OnInit, OnChanges {
  //Input and output variables
  @Input() benefitDetails: BenefitPaymentDetails = new BenefitPaymentDetails();
  @Output() confirm: EventEmitter<null> = new EventEmitter(null);
  @Output() cancel: EventEmitter<null> = new EventEmitter(null);
  @Output() close: EventEmitter<null> = new EventEmitter();

  constructor() {}
  /**Method to initialise tasks */
  ngOnInit(): void {}
  /**Method to detect changes in input property */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitDetails) this.benefitDetails = changes.benefitDetails.currentValue;
  }
  /**Method to trigger approve commitment */
  approveCommitment() {
    this.confirm.emit();
  }
  /**Method to trigger cancel commitment */
  cancelCommitment() {
    this.cancel.emit();
  }
  closeModal() {
    this.close.emit();
  }
}
