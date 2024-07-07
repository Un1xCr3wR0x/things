/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, Inject, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LanguageToken } from '@gosi-ui/core';
import { PenalityWavier } from '../../models';

@Component({
  selector: 'blg-waiver-terms-condition-dc',
  templateUrl: './waiver-terms-condition-dc.component.html',
  styleUrls: ['./waiver-terms-condition-dc.component.scss']
})
export class WaiverTermsConditionDcComponent implements OnInit {
  /** Constants */
  @Input() wavierDetails: PenalityWavier;
  @Input() isResponse: boolean;
  @Input() parentForm: FormGroup;
  @Input() isLateFeeViolation: boolean;
  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() checkBox: EventEmitter<null> = new EventEmitter();
  checkForm: FormGroup;
  checkForm1: FormGroup;
  lang = 'en';
  isCheckBox = false;

  
  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.checkForm = this.createCheckForm();
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    if (this.parentForm) {
      this.parentForm.addControl('checkForm', this.checkForm);
    }
  }
  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false, { validators: Validators.required }],
        checkBoxFlag1: [false, { validators: Validators.required }]
    });
  }
  downloadDoc(){
   this.download.emit();
  }
  onClick(){
    this.isCheckBox = true;
  }
  onSelect(){
   this.checkBox.emit();
  }
}
