/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

class PasswordInfo {
  infoText: string;
  infoClass: string;
}
enum InfoIcon {
  GRAY_CHECK = 'gray-check-circle',
  GREEN_CHECK = 'green-check-circle'
}

@Component({
  selector: 'cim-password-info-dc',
  templateUrl: './password-info-dc.component.html',
  styleUrls: ['./password-info-dc.component.scss']
})
export class PasswordInfoDcComponent implements OnInit, OnChanges {
  // input variables
  @Input() control: FormControl;
  // local variables
  infoItem = new PasswordInfo();
  infoList = [
    {
      infoText: 'MIN-CHARACTERS',
      RegExp: '.{8,}',
      infoClass: InfoIcon.GRAY_CHECK
    },
    {
      infoText: 'ATLEAST-UPPERCASE',
      RegExp: '[A-Z]',
      infoClass: InfoIcon.GRAY_CHECK
    },
    {
      infoText: 'ATLEAST-LOWERCASE',
      RegExp: '[a-z]',
      infoClass: InfoIcon.GRAY_CHECK
    },
    {
      infoText: 'ATLEAST-DIGIT',
      RegExp: '[0-9]',
      infoClass: InfoIcon.GRAY_CHECK
    },
    {
      infoText: 'ONE-SPECIAL-CHARACTER',
      RegExp: '[!@#$%^&]',
      infoClass: InfoIcon.GRAY_CHECK
    },
    {
      infoText: 'START-ALPHA',
      RegExp: '^([A-Za-z]{1})',
      infoClass: InfoIcon.GRAY_CHECK
    }
  ];

  constructor() {}

  ngOnInit(): void {}
  /**
   * This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.control && changes.control.currentValue) {
      this.control = changes.control.currentValue;
      if (this.control.value !== null) this.checkValidity(this.control.value);
      else this.infoList.forEach(info => this.updateValidity(info.infoText, false));
    }
  }
  /**
   * method to check password validation
   */
  checkValidity(password: string): void {
    this.infoList.forEach(info => {
      if (new RegExp(info.RegExp).test(password)) {
        this.updateValidity(info.infoText, true);
      } else {
        this.updateValidity(info.infoText, false);
      }
    });
  }
  /**
   *
   * @param field method to update the validaion
   * @param complete
   */
  updateValidity(field: string, complete: boolean) {
    this.infoList.map(item => {
      if (item.infoText === field) item.infoClass = complete ? InfoIcon.GREEN_CHECK : InfoIcon.GRAY_CHECK;
    });
  }
}
