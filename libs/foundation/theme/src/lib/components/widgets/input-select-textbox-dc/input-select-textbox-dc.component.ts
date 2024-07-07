/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Inject, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { InputBaseComponent, LanguageToken, LovList, BilingualText, bindToObject, getErrorMsg } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'gosi-input-select-textbox-dc',
  templateUrl: './input-select-textbox-dc.component.html',
  styleUrls: ['./input-select-textbox-dc.component.scss']
})
export class InputSelectTextboxDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  @Input() defaultValue = 'sa';
  @Input() defaultOnly = false;
  @Input() standerdControl: FormControl | AbstractControl;
  @Input() standerdControlValue: BilingualText = new BilingualText();
  @Input() dropDownOptions: LovList = new LovList([]);
  @Output() select: EventEmitter<BilingualText> = new EventEmitter();
  selectedLang = 'en';
  selectedStanderd: BilingualText = new BilingualText();
  /**
   * Constructor
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>, protected fb: FormBuilder) {
    super();
  }

  /**
   * Init method
   */
  ngOnInit() {
    super.ngOnInit();
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });

    if (this.standerdControl.value.english) {
      this.setDefaultValue(this.standerdControl.value);
    } else {
      this.setDefaultValue(this.defaultValue);
    }
  }

  /**
   * Method to catch the changes in @input
   * @param changes
   */

  ngOnChanges(changes: SimpleChanges) {
    if (changes.standerdControlValue && changes.standerdControlValue.currentValue) {
      if (this.standerdControlValue?.english) {
        this.setDefaultValue(this.standerdControl.value);
        if (this.control.dirty || this.control.touched) {
          this.setErrorMsgs(this.control);
        }
      }
    }
  }

  /**
   * Method to set default value for country dropdown
   */
  setDefaultValue(selectedStanderd) {
    this.selectedStanderd = bindToObject(new BilingualText(), selectedStanderd);
  }
  selectStanderd(workStanderd) {
    if (workStanderd.english) {
      this.selectedStanderd = bindToObject(new BilingualText(), workStanderd);
      this.select.emit(this.selectedStanderd);
    }
  }
  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }
}
