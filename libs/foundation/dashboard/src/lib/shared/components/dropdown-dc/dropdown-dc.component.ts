/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropDownItems } from '@gosi-ui/features/contributor/lib/shared/models/drop-down';

@Component({
  selector: 'ds-dropdown-dc',
  templateUrl: './dropdown-dc.component.html',
  styleUrls: ['./dropdown-dc.component.scss']
})
export class DropdownDcComponent {
  // input variable
  @Input() list: DropDownItems[];
  @Input() disableDropdown = false;
  //output variable
  @Output() selectedItem: EventEmitter<number | string> = new EventEmitter();

  /** This method is used to emit the events on click. */
  selectItem(id: number | string) {
    this.selectedItem.emit(id);
  }

  /** This method is for stoping the clcik event. */
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
