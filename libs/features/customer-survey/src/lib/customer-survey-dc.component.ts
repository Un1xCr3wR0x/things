/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit } from '@angular/core';
import { ManagePersonRoutingService } from './shared';

@Component({
  selector: 'cim-customer-survey-dc',
  templateUrl: './customer-survey-dc.component.html'
})
export class CustomerSurveyDcComponent implements OnInit {
  constructor(private managePersonRoutingService: ManagePersonRoutingService) {}

  ngOnInit() {
    this.managePersonRoutingService.setToLocalToken();
  }
}
