/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cnt-validator-engagement-view-dc',
  templateUrl: './validator-engagement-view-dc.component.html',
  styleUrls: ['./validator-engagement-view-dc.component.scss']
})
export class ValidatorEngagementViewDcComponent implements OnInit {
  @Input() establishmentDetails;
  @Input() registrationNumber;
  constructor() {}

  ngOnInit(): void {}
}
