/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'blg-establishment-search-dc',
  templateUrl: './establishment-search-dc.component.html',
  styleUrls: ['./establishment-search-dc.component.scss']
})
export class EstablishmentSearchDcComponent implements OnInit {
  @Output() idNum: EventEmitter<null> = new EventEmitter();
  idNumber = new FormControl(null, {
    validators: Validators.required
  });
  constructor() {}
  ngOnInit() {}
  /**
   * This method is used to search establishment
   */
  searchEstablishment() {
    this.idNum.emit(this.idNumber.value);
  }
}
