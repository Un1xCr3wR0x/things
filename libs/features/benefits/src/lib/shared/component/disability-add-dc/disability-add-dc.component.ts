/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { LookupService, LovList } from '@gosi-ui/core';
import { DisabilityDetails } from '../../../shared/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'bnt-add-disability-details-dc',
  templateUrl: './disability-add-dc.component.html',
  styleUrls: ['./disability-add-dc.component.scss']
})
export class AnnuityDisabilityDcComponent implements OnInit {
  listYesNo$ = new Observable<LovList>();
  disabilityForm: FormGroup;

  /**
   * Input variables
   */
  @Input() disabilityDetails: DisabilityDetails;
  @Input() parentForm: FormGroup;

  /**
   *
   */
  constructor(readonly fb: FormBuilder, readonly lookupService: LookupService) {}

  /**
   *  This method if for initialization tasks
   */
  ngOnInit() {
    this.listYesNo$ = this.lookupService.getYesOrNoList();
    this.disabilityForm = this.createDisabilityForm();
    if (this.parentForm) {
      this.parentForm.addControl('disabilityForm', this.disabilityForm);
    }
  }

  /*
   * This method is to create disability form
   */
  createDisabilityForm() {
    return this.fb.group({
      disabledB: this.fb.group({
        english: ['Yes', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      helperRequired: this.fb.group({
        english: ['Yes', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      disabilityDt: this.fb.group({
        gregorian: [new Date(), { validators: Validators.required }],
        hijiri: [null]
      }),
      disabilityPct: [100, { validators: Validators.required }]
    });
  }
}
