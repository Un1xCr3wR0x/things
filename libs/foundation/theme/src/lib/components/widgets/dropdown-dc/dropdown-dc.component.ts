/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownItem } from '@gosi-ui/core';

@Component({
  selector: 'gosi-dropdown-dc',
  templateUrl: './dropdown-dc.component.html',
  styleUrls: ['./dropdown-dc.component.scss']
})
export class DropdownDcComponent implements OnInit {
  @Input() list: DropdownItem[];
  @Input() minWidthInRem: string;

  @Output() selectedItem: EventEmitter<number | string> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  selectItem(id: number | string) {
    this.selectedItem.emit(id);
  }

  doNothing() {}

  isAnyDisabled(): boolean {
    for (const item of this.list) {
      if (item.disabled) {
        return true;
      }
    }
  }
}
