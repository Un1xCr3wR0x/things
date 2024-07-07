/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mb-add-visiting-doctor-dc',
  templateUrl: './add-visiting-doctor-dc.component.html'
})
export class AddVisitingDoctorDcComponent implements OnInit {
  constructor(readonly router: Router) {}

  ngOnInit(): void {
    this.router.navigate(
      [
        `home/medical-board/add-visiting-doctor/edit`
      ], 
    { replaceUrl: true });
  }
}
