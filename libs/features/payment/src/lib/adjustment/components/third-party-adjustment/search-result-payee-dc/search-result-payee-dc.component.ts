/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PayeeDetails } from '@gosi-ui/features/payment/lib/shared';

@Component({
  selector: 'pmt-search-result-payee-dc',
  templateUrl: './search-result-payee-dc.component.html',
  styleUrls: ['./search-result-payee-dc.component.scss']
})
export class SearchResultPayeeDcComponent implements OnInit {
  // Input  variables
  @Input() payee: PayeeDetails;

  @Output() changePayee: EventEmitter<null> = new EventEmitter();
  constructor() {}

  // Method to initialise the component
  ngOnInit(): void {}
}
