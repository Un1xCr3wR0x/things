/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { TransactionSearchResponse, IndividualSearchResponse } from '../../../models';
import { Establishment } from '@gosi-ui/core';

@Component({
  selector: 'dsb-recently-searched-dc',
  templateUrl: './recently-searched-dc.component.html',
  styleUrls: ['./recently-searched-dc.component.scss']
})
export class RecentlySearchedDcComponent implements OnInit {
  /*
   * Input variables
   */
  @Input() establishmentEntry: Establishment[] = [];
  @Input() transactionEntry: TransactionSearchResponse[] = [];
  @Input() individualEntry: IndividualSearchResponse[] = [];
  @Input() isEstablishment = false;
  @Input() isIndividual = false;
  @Input() isTransaction = false;
  constructor() {}

  ngOnInit(): void {}
}
