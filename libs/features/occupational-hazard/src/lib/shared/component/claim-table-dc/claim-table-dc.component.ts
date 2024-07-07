/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { InvoiceDetails } from '../../models/invoice-details';

@Component({
  selector: 'oh-claim-table-dc',
  templateUrl: './claim-table-dc.component.html',
  styleUrls: ['./claim-table-dc.component.scss']
})
export class ClaimTableDcComponent implements OnInit, OnChanges {
  constructor() {}
  icon = [];
  claims = [];
  class = 'arrow-down-reg';
  showBox = [];
  @Input() invoiceDetails: InvoiceDetails;
  @Output() navigate: EventEmitter<Object> = new EventEmitter();
  ngOnInit(): void {
    this.claims.push(1);
    this.claims.push(1);
  }
  /*Method to handle Toggle icon in table*/
  toggleFunction(index, icon) {
    if (icon === 'chevron-up') {
      this.class = 'arrow-down-reg';
      this.showBox[index] = false;
      this.icon[index] = 'chevron-down';
    } else {
      this.icon[index] = 'chevron-up';
      this.showBox[index] = true;
      this.class = 'arrow-up-reg';
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.invoiceDetails) {
      this.invoiceDetails = changes.invoiceDetails.currentValue;
    }
  }
  /**
   * Get Paid Amount
   */
  getPaid(total, discount, vat, policyDeduction, medicalDeduction) {
    if (total && discount && vat && policyDeduction && medicalDeduction) {
      return total - discount - policyDeduction - medicalDeduction + vat;
    }
  }
  /**
   *
   * @param id Emit Values for navigating
   * @param type
   */
  selectItem(id, type, injuryNo, sin, regNo) {
    this.navigate.emit({ id, type, injuryNo, sin, regNo });
  }
}
