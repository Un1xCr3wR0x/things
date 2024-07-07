/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'bnt-search-benefit-dc',
  templateUrl: './search-benefit-dc.component.html',
  styleUrls: ['./search-benefit-dc.component.scss']
})
export class SearchBenefitDcComponent implements OnInit {
  @Output() onSearchClicked = new EventEmitter();
  benefitSearchForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.benefitSearchForm = this.fb.group({
      identifier: [null, Validators.required],
      requestId: [null, Validators.required]
    });
  }
  search() {
    this.onSearchClicked.emit(this.benefitSearchForm.value);
  }
}
