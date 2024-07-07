/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MaxLengthEnum } from '../../../enums';

@Component({
  selector: 'cnt-establishment-search-dc',
  templateUrl: './establishment-search-dc.component.html',
  styleUrls: ['./establishment-search-dc.component.scss']
})
export class EstablishmentSearchDcComponent implements OnInit {
  /**
   * Variable declarations & initialization
   */
  regNoLength = MaxLengthEnum.REG_NO;
  registrationNumber = new FormControl(null, {
    validators: [Validators.required]
  });
  /**
   * Input & output event emitters
   */

  @Output() establishmentSearch: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  /**
   * Method to emit entered registration number
   */
  searchEstablishment() {
    if (this.registrationNumber.valid) this.establishmentSearch.emit(this.registrationNumber.value);
  }
}
