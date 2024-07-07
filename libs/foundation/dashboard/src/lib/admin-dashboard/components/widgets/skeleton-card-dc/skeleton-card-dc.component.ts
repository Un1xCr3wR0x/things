/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DashboardConstants } from '../../../constants';

@Component({
  selector: 'dsb-skeleton-card-dc',
  templateUrl: './skeleton-card-dc.component.html',
  styleUrls: ['./skeleton-card-dc.component.scss']
})
export class SkeletonCardDcComponent implements OnInit, OnChanges {
  //input variables
  @Input() isError: boolean;
  @Input() width: number;
  // output variables
  @Output() reload: EventEmitter<null> = new EventEmitter();
  minHeight = DashboardConstants.BRANCH_CARD_MIN_HEIGHT;
  constructor() {}

  ngOnInit(): void {}
  /**
   *
   * @param changes This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.isError && changes.isError.currentValue) {
        this.isError = changes.isError.currentValue;
      }
    }
  }
  /**
   * method to emit reload event
   */
  onReload() {
    this.reload.emit();
  }
}
