/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, HostListener } from '@angular/core';
import { RouterConstants } from '@gosi-ui/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mb-validator-dc',
  templateUrl: './validator-dc.component.html'
})
export class ValidatorDcComponent implements OnInit {
  constructor(readonly router: Router) {}

  ngOnInit(): void {}
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
}
