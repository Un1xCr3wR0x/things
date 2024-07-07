/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cnt-modify-details-table-dc',
  templateUrl: './modify-details-table-dc.component.html',
  styleUrls: ['./modify-details-table-dc.component.scss']
})
export class ModifyDetailsTableDcComponent implements OnInit {
  @Input() engagement;
  @Input() violationDetails;
  @Input() routerDataToken;
  constructor() {}

  ngOnInit(): void {}
}
