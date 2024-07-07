/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'dsb-search-header-dc',
  templateUrl: './search-header-dc.component.html',
  styleUrls: ['./search-header-dc.component.scss']
})
export class SearchHeaderDcComponent implements OnInit, OnChanges {
  /**
   *  Input variables
   */
  @Input() isSearch = false;
  @Input() isPrivate = false;
  @Input() commonSortFilter: TemplateRef<HTMLElement>;
  @Input() searchCount: TemplateRef<HTMLElement>;
  constructor() {}

  ngOnInit(): void {}

  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isSearch) {
      this.isSearch = changes.isSearch.currentValue;
    }
  }
}
