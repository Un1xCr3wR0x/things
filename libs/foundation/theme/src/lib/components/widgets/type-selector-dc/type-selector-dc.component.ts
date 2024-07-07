/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gosi-type-selector-dc',
  templateUrl: './type-selector-dc.component.html',
  styleUrls: ['./type-selector-dc.component.scss']
})
export class TypeSelectorDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  isActive = false;

  /**
   * Input variables
   */
  @Input() value: string;
  @Input() icon: string;
  @Input() selectedValue: string;
  @Input() label: string;
  @Input() index: number;

  /**
   * Output event emitters
   */
  @Output() selectType: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedValue) {
      this.isActive = changes.selectedValue.currentValue === this.value ? true : false;
    }
  }

  /**
   * select event of radio
   */
  selectValue(type: string) {
    this.selectType.emit(type);
  }
}
