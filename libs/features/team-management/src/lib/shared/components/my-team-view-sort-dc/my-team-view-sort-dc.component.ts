/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'tm-my-team-view-sort-dc',
  templateUrl: './my-team-view-sort-dc.component.html',
  styleUrls: ['./my-team-view-sort-dc.component.scss']
})
export class MyTeamViewSortDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() sortOptions = [];
  @Input() defaultOption = '';
  /**
   * local variables
   */
  selectedOption: string;
  isDescending = true;
  /**
   * output variables
   */
  @Output() sortEvent = new EventEmitter();
  constructor() {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.sort();
    this.selectedOption = this.defaultOption;
  }
  /**
   * method to sort
   */
  sort() {
    this.sortEvent.emit({
      option: this.selectedOption,
      order: this.isDescending
    });
  }
  /**
   * This method is to set default values
   */
  clearSort(): void {
    this.selectedOption = this.defaultOption;
    this.isDescending = true;
  }
  /**
   * This method is to change the sort direction and fetch the list
   */
  changeSortDirection(): void {
    if (this.isDescending) {
      this.isDescending = false;
    } else {
      this.isDescending = true;
    }
    this.sort();
  }
}
