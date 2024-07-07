/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { Allowance } from '../../models/allowance-wrapper';
import { AuditRejectAllowanceDetails } from '../../models/audit-reject-details';

@Component({
  selector: 'oh-rejected-accordion-view-dc',
  templateUrl: './rejected-accordion-view-dc.component.html',
  styleUrls: ['./rejected-accordion-view-dc.component.scss']
})
export class RejectedAccordionViewDcComponent implements OnInit {
  constructor() {}
  /**
   * Input variables
   */

  @Input() rejectedList: AuditRejectAllowanceDetails[];
  @Input() detailsClubbed: Allowance;
  ngOnInit(): void {}
  getAmount() {
    let amount = 0;
    this.rejectedList.forEach(element => {
      if (element?.rejectionRequestDate?.hijiri === this.detailsClubbed?.startDate?.hijiri) {
        amount = amount + element.rejectedAllowance;
      }
    });
    return amount;
  }
  getStatus() {
    let recovered = true;
    this.rejectedList.forEach(element => {
      if (element?.rejectionRequestDate?.hijiri === this.detailsClubbed?.startDate?.hijiri) {
        if (element.status.english !== 'Recovered') {
          recovered = false;
        }
      }
    });
    return recovered;
  }
}
