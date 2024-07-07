/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, BilingualText, TransactionFeedback } from '@gosi-ui/core';

@Component({
  selector: 'est-success-dc',
  templateUrl: './success-dc.component.html',
  styleUrls: ['./success-dc.component.scss']
})
export class SuccessDcComponent implements OnInit, OnDestroy {
  @Input() routeForView;
  @Input() message: BilingualText;
  @Input() transactionId: number;
  @Input() buttonName = 'ESTABLISHMENT.HOME';
  @Input() id: string;
  @Input() goBack = false;
  @Input() transactionFeedbackGroup: TransactionFeedback[] = [];
  @Input() noMarginTop = false;

  constructor(readonly alertService: AlertService, readonly router: Router, readonly location: Location) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }

  navigateBack() {
    if (this.goBack === true) {
      this.location.back();
    } else {
      this.router.navigate([this.routeForView]);
    }
  }
}
