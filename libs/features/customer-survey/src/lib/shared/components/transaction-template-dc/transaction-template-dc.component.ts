/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { Contributor, Person, Alert } from '@gosi-ui/core';

@Component({
  selector: 'cim-transaction-template-dc',
  templateUrl: './transaction-template-dc.component.html',
  styleUrls: ['./transaction-template-dc.component.scss']
})
export class TransactionTemplateDcComponent implements OnInit {
  @Input() transactionName: string;
  @Input() contributor: Contributor;
  @Input() person: Person;
  @Input() showInfo = true;
  @Input() feedbackMessage = new Alert();
  @Input() showFeedback = false;
  @Input() subHeadings: [{ label: string; value: number | Date; isDate: boolean }];
  @Input() showSubHeadings = false;
  @Input() subLabel: string = null;
  @Input() subValue: string = null;
  @Input() isUserLoggedIn = false;

  constructor() {}

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {}
}
