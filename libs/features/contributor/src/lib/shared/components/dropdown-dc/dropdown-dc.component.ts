/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { DropDownItems } from '../../models/drop-down';

@Component({
  selector: 'cnt-dropdown-dc',
  templateUrl: './dropdown-dc.component.html',
  styleUrls: ['./dropdown-dc.component.scss']
})
export class DropdownDcComponent implements OnInit, OnChanges{
  // input variable
  @Input() list: DropDownItems[] = [];
  @Input() isNin: boolean;
  @Input() disableDropdown = false;
  @Input() isDecoration: any;
  @Input() individualApp: boolean;
  @Input() isBtn:boolean = false;
  //output variable
  @Output() selectedItem: EventEmitter<number | string> = new EventEmitter();

  ngOnInit(): void {
    if(!this.isBtn){ 
    if (this.individualApp === true) {
      this.sortListIndividual();
    } else {
      this.sortList();
    }
  }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isNin && changes.isNin.currentValue) {
      this.isNin = changes.isNin.currentValue;
    }
  }
  sortList() {
    const data = this.list?.filter(item => {
      if (
        item.id !== 'CONTRIBUTOR.MODIFY-JOINING-DATE' &&
        item.id !== 'CONTRIBUTOR.CANCEL-CON.CANCEL-ENGAGEMENT' &&
        item.id !== 'CONTRIBUTOR.TERMINATE-ENGAGEMENT' &&
        item.id !== 'CONTRIBUTOR.MODIFY-LEAVING-DATE'
      )
        return item;
    });
    this.list = data;
  }
  sortListIndividual() {
    const data = this.list?.filter(item => {
      if (
        item.id === 'CONTRIBUTOR.MODIFY-JOINING-DATE' ||
        item.id === 'CONTRIBUTOR.CANCEL-CON.CANCEL-ENGAGEMENT' ||
        item.id === 'CONTRIBUTOR.TERMINATE-ENGAGEMENT' ||
        item.id === 'CONTRIBUTOR.MODIFY-LEAVING-DATE' ||
        item.id === 'CONTRIBUTOR.VIEW-CONTRACTS' ||
        item.id === 'CONTRIBUTOR.CANCEL' ||
        item.id === 'CONTRIBUTOR.MODIFY'
      )
        return item;
    });
    this.list = data;
  }
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
