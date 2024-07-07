/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'bnt-ui-validator-dc',
  templateUrl: './validator-dc.component.html'
})
export class ValidatorDcComponent implements OnInit {
  constructor(private router: Router) {}

  commonBreadCrumpNotRequiredUrl = [
    '/home/benefits/validator/approve-stop-benefit',
    '/home/benefits/validator/hold-benefit-payment',
    '/home/benefits/validator/approve-restart-benefit',
    '/home/benefits/validator/validator-retirement-pension',
    '/home/benefits/validator/validator-retirement-lumpsum',
    '/home/benefits/validator/validator-direct-payment'
  ];

  isStopBenefit = false;
  hideBreadCrump = false;

  ngOnInit(): void {
    if (this.router && this.commonBreadCrumpNotRequiredUrl.includes(this.router.url.split('?')[0])) {
      this.hideBreadCrump = true;
    }
  }
}
