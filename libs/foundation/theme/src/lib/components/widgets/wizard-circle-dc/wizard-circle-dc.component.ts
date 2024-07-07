/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

enum WizardSize {
  xs = 'xs', //32
  sm = 'sm', //40
  md = 'md', //50
  lg = 'lg' //60
}
enum WizardType {
  primary = 'primary',
  info = 'info'
}

@Component({
  selector: 'gosi-wizard-circle-dc',
  templateUrl: './wizard-circle-dc.component.html',
  styleUrls: ['./wizard-circle-dc.component.scss']
})
export class WizardCircleDcComponent implements OnInit, OnChanges {
  @Input() value: string;
  @Input() icon: string;
  @Input() size = WizardSize.md;
  @Input() type = WizardType.primary;
  @Input() isBold = true;

  shortForm: string;

  constructor() {}

  ngOnInit() {
    this.shortForm = this.setIconName(this.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && changes.value.currentValue) {
      this.shortForm = this.setIconName(this.value);
    }
  }

  /**
   * This method is set Icon Name
   * @param name
   */
  setIconName(name: string) {
    if (name) {
      const namesArray: string[] = name.split(' ');
      let iconName = namesArray[0].substring(0, 1);
      if (namesArray[namesArray.length - 1] && namesArray.length > 1) {
        if (namesArray[namesArray.length - 1].substring(0, 1) !== ' ') {
          iconName += namesArray[namesArray.length - 1].substring(0, 1);
        }
      }
      return iconName;
    } else {
      return '';
    }
  }
}
