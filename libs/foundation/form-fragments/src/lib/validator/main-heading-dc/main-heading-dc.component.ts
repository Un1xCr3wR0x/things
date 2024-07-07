/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'frm-main-heading-dc',
  templateUrl: './main-heading-dc.component.html',
  styleUrls: ['./main-heading-dc.component.scss']
})
export class MainHeadingDcComponent implements OnInit {
  //Input Variables
  @Input() heading: string;
  @Input() subLabel: string = null;
  @Input() subValue: string = null;
  @Input() formSubmissionDate: string;
  @Input() transactionRefNo: string;
  @Input() badge: string;

  /**
   * Creates an instance of MainHeadingDcComponent
   * @memberof  MainHeadingDcComponent
   *
   */
  constructor() {}

  /**
   * This method handles the initialization tasks.
   * @memberof  MainHeadingDcComponent
   */
  ngOnInit() {}
}
