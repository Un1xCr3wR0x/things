/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'blg-contributor-search-dc',
  templateUrl: './contributor-search-dc.component.html',
  styleUrls: ['./contributor-search-dc.component.scss']
})
export class ContributortSearchDcComponent implements OnInit {
  socailInsurancenNumber = new FormControl(); //Identifier for search

  @Output() socailInsurancenNo: EventEmitter<string> = new EventEmitter();
  ngOnInit() {}

  /***
   * Method to emit registrationNo
   */
  searchContributorDetails() {
    this.socailInsurancenNo.emit(this.socailInsurancenNumber.value);
  }
}
