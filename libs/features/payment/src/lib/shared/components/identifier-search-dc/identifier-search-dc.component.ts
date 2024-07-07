/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pmt-identifier-search-dc',
  templateUrl: './identifier-search-dc.component.html',
  styleUrls: ['./identifier-search-dc.component.scss']
})
export class IdentifierSearchDcComponent implements OnInit {
  @Input() verifyBeneficiaryForm;

  @Output() onSearch = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  search() {
    this.onSearch.emit();
  }
}
