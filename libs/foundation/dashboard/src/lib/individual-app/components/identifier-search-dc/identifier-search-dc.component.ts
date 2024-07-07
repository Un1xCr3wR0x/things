/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'dsb-identifier-search-dc',
  templateUrl: './identifier-search-dc.component.html',
  styleUrls: ['./identifier-search-dc.component.scss']
})
export class IdentifierSearchDcComponent {
  @Output() idNum: EventEmitter<null> = new EventEmitter();
  idNumber = new FormControl(null, {
    validators: Validators.required
  });

  /**
   * This method is used to search establishment
   */
  searchValues() {
    this.idNum.emit(this.idNumber.value);
  }
}
