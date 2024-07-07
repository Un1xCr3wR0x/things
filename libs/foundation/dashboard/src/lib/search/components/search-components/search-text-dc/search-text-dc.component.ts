/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'dsb-search-text-dc',
  templateUrl: './search-text-dc.component.html',
  styleUrls: ['./search-text-dc.component.scss']
})
export class SearchTextDcComponent implements OnInit, OnChanges {
  //input variables
  @Input() searchForm: FormGroup;
  @Input() placeholder: string;
  @Input() showContent = false;
  @Input() onlyDigits = false;
  @Input() searchKey = null;
  @Input() maxLength: number;
  @Input() width: number;
  @Input() isReceiptSearch = false;
  @Input() isNumberSearch = false;
  //output variables
  @Output() show: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   * local variables
   */
  isSearchIcon = true;
  searchKeyControl: FormControl = new FormControl(this.searchKey, Validators.compose([Validators.minLength(3)]));
  constructor() {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    if (this.searchForm) {
      this.searchForm.removeControl('searchKey');
      this.searchForm.addControl('searchKey', this.searchKeyControl);
    }
  }
  /**
   * This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.searchKey && changes.searchKey.currentValue) {
        this.searchKey = changes.searchKey.currentValue;
        this.searchKeyControl?.setValue(this.searchKey);
        if (this.searchKey) {
          this.isSearchIcon = false;
        }
      }
      if (changes.width && changes.width.currentValue) {
        this.width = changes.width.currentValue;
      }
    }
  }
  /**
   * method to listen input event
   */
  @HostListener('input', ['$event'])
  onInputEvent() {
    if (this.isSearchIcon === false) {
      this.isSearchIcon = true;
      this.reset.emit();
    }
  }
  /**
   * method to emit search event
   */
  onSearch() {
    if (this.searchKeyControl.value) this.searchKeyControl.setValue(this.searchKeyControl.value.trim());
    if (
      this.searchKeyControl.valid &&
      this.searchKeyControl.value !== null &&
      this.searchKeyControl.value.trim() !== ''
    ) {
      this.isSearchIcon = false;
      this.search.emit(this.searchKeyControl.value);
    } else this.isSearchIcon = true;
  }
  /**
   * method to show advanced search
   */
  showAdvancedSearch() {
    this.show.emit();
  }
  /**
   * method to reset search
   */
  resetSearch() {
    this.searchKeyControl.reset();
    this.isSearchIcon = true;
    this.reset.emit();
  }
}
