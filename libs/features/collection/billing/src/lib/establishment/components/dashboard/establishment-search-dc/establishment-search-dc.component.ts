/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'blg-establishment-search-dc',
  templateUrl: './establishment-search-dc.component.html',
  styleUrls: ['./establishment-search-dc.component.scss']
})
export class EstablishmentSearchDcComponent implements OnInit {
  isAppPrivate = true;
  isSearchRequired: boolean;
  registerNumber = new FormControl(); //Identifier for search

  @Output() registrationNo: EventEmitter<string> = new EventEmitter();
  ngOnInit() {
    this.isSearchRequired = this.checkSearchRequired();
  }
  /** Method to check whether search is required. */
  checkSearchRequired() {
    //Search is required for Field Office and Contributor
    return this.isAppPrivate;
  }
  /***
   * Method to emit registrationNo
   */
  searchEstablishmentDetails() {
    this.registrationNo.emit(this.registerNumber.value);
  }
}
