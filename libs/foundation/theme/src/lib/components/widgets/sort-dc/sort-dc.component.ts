/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, LanguageToken, LovList, SortDirectionEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

/**
 * This component is to handle input select fields.
 *
 * @export
 * @class SortDcComponent
 */
@Component({
  selector: 'gosi-sort-dc',
  templateUrl: './sort-dc.component.html',
  styleUrls: ['./sort-dc.component.scss']
})
export class SortDcComponent implements OnInit, OnChanges {
  //Input Variables
  @Input() list: LovList = null;
  @Input() hidePlaceholder: boolean;
  @Input() initialValue: BilingualText;
  @Input() initialDirection: string;
  @Input() isBackgroundWhite = true;
  //Output Variables
  @Output() direction: EventEmitter<string> = new EventEmitter();
  @Output() sortItemSelected: EventEmitter<number> = new EventEmitter();

  //variables
  sortListForm: FormGroup;
  selectedLang = 'en';
  isDescending = true;
  sortingDirection: string;
  // sortItem: RequestSort = new RequestSort();

  /**
   * Creates an instance of SortDcComponent.
   * @memberof SortDcComponent
   */
  constructor(
    @Inject(LanguageToken)
    readonly language: BehaviorSubject<string>,
    private fb: FormBuilder
  ) {
    this.sortListForm = this.createSortListForm();
  }

  /**
   * This method is to handle the initialization tasks.
   *
   * @memberof SortDcComponent
   */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialValue && changes.initialValue.currentValue) {
      this.sortListForm?.get('sortMode')?.get('english').patchValue(changes.initialValue.currentValue.english);
      this.sortListForm?.get('sortMode')?.get('arabic').patchValue(changes.initialValue.currentValue.arabic);
    }
    if (changes.initialDirection && changes.initialDirection.currentValue) {
      if (changes.initialDirection.currentValue === SortDirectionEnum.DESCENDING) this.isDescending = true;
      else this.isDescending = false;
    }
  }

  //creation of sort form
  createSortListForm() {
    return this.fb.group({
      sortMode: this.fb.group({
        english: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        arabic: [
          null,
          {
            updateOn: 'blur'
          }
        ]
      })
    });
  }

  //method to emit selected item to sort
  sortedItemSelected(value) {
    this.sortItemSelected.emit(value);
  }

  //method to emit direction to sort
  sortDirection(): void {
    if (this.isDescending) {
      this.sortingDirection = SortDirectionEnum.ASCENDING;
      this.isDescending = false;
    } else {
      this.sortingDirection = SortDirectionEnum.DESCENDING;
      this.isDescending = true;
    }
    this.direction.emit(this.sortingDirection);
  }
}
