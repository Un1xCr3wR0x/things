/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BaseComponent } from '@gosi-ui/core';
import { PersonBankDetails } from '../../../shared';

//This component is to get the bank account details of the person

@Component({
  selector: 'cim-bank-details-card-dc',
  templateUrl: './bank-details-card-dc.component.html',
  styleUrls: ['./bank-details-card-dc.component.scss']
})
export class BankDetailsCardDcComponent extends BaseComponent implements OnInit {
  //Input variables
  @Input() bankDetails: PersonBankDetails;
  @Input() isIbanVerified = false;
  @Input() isCsr = false;

  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();

  constructor() {
    super();
  }
  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {}

  // Method to emit edit details

  editEventDetails() {
    this.editEvent.emit();
  }
}
