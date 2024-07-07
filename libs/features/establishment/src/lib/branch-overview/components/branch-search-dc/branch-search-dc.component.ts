/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'est-branch-search-dc',
  templateUrl: './branch-search-dc.component.html',
  styleUrls: ['./branch-search-dc.component.scss']
})
export class BranchSearchDcComponent implements OnInit {
  /**
   * Local variables
   */
  searchFilterTerm = new FormControl('');
  showSearchBox = false;

  /**
   * Output variables
   */
  @Output() search: EventEmitter<FormControl> = new EventEmitter();
  @Output() keyUp: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onSearch() {
    this.search.emit(this.searchFilterTerm);
  }

  onKeyUp(searchTerm) {
    this.keyUp.emit(searchTerm);
  }
}
