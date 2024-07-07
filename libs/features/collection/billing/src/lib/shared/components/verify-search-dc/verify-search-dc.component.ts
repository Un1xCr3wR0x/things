/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'blg-verify-search-dc',
  templateUrl: './verify-search-dc.component.html',
  styleUrls: ['./verify-search-dc.component.scss']
})
export class VerifySearchDcComponent {
  @Input() type: string; // for contributor pass 'cont' and for establishment pass 'est'
  @Output() idNum: EventEmitter<null> = new EventEmitter();
  idNumber = new FormControl(null, {
    validators: Validators.required
  });

  /**
   * This method is used to search establishment
   */
  searchEstablishment() {
    this.idNum.emit(this.idNumber.value);
  }
}
