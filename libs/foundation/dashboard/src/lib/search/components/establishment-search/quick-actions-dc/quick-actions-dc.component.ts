/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuickAction } from '../../../models';
@Component({
  selector: 'dsb-quick-actions-dc',
  templateUrl: './quick-actions-dc.component.html',
  styleUrls: ['./quick-actions-dc.component.scss']
})
export class QuickActionsDcComponent implements OnInit, OnChanges {
  //Input variables
  @Input() registrationNo: number;
  @Input() quickAction: QuickAction[] = [];
  //Output variables
  @Output() navigate: EventEmitter<string> = new EventEmitter();
  //Local variables

  constructor() {}

  //Method to initialise tasks
  ngOnInit(): void {}
  /**
   * Method  to emit the selected page
   * @param url
   */
  navigateTo(url: string) {
    this.navigate.emit(url);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.quickAction?.currentValue) {
      this.quickAction = changes.quickAction.currentValue;
    }
  }
}
