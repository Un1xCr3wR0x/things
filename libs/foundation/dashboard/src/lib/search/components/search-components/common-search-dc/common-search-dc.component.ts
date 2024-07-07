/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'dsb-common-search-dc',
  templateUrl: './common-search-dc.component.html',
  styleUrls: ['./common-search-dc.component.scss']
})
export class CommonSearchDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() isEstablishment = false;
  @Input() isIndividual = false;
  @Input() isTransaction = false;
  @Input() searchKey = null;
  @Input() parentForm: FormGroup;
  @Input() isAdvancedSearch = false;
  @Input() width: number;
  /**
   * Output variables
   */
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() show: EventEmitter<null> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   * Local variables
   */

  placeholder: string;
  maxLength: number;
  constructor() {}

  ngOnInit(): void {}

  /**
   * method to handle changes in the input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isEstablishment && changes.isEstablishment.currentValue)
      if (this.isEstablishment) {
        this.placeholder = 'ESTABLISHMENT-SEARCH-PLACEHODLER';
        this.maxLength = 100;
      }
    if (changes && changes.isTransaction && changes.isTransaction.currentValue)
      if (this.isTransaction) {
        this.placeholder = 'TRANSACTION-ID';
        this.maxLength = 10;
      }
    if (changes && changes.isIndividual && changes.isIndividual.currentValue)
      if (this.isIndividual) {
        this.placeholder = 'INDIVIDUAL-PLACEHOLDER';
        this.maxLength = 10;
      }
    if (changes && changes.searchKey && changes.searchKey.currentValue) {
      this.searchKey = changes.searchKey.currentValue;
    }
    if (changes && changes.width && changes.width.currentValue) {
      this.width = changes.width.currentValue;
    }
  }
  /**
   * method to emit search event
   */
  onSearch() {
    this.search.emit();
  }
  /**
   * method to emit close event
   */
  onShow() {
    this.show.emit();
  }
  /**
   * method to emit reset event
   */
  onReset() {
    this.reset.emit();
  }
  checkOnlyDigits() {
    if (this.isIndividual) return this.isIndividual;
    else if (this.isTransaction) return this.isTransaction;
    else return false;
  }
}
