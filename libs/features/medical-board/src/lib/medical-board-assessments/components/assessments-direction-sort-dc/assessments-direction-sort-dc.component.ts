import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, Inject, OnChanges } from '@angular/core';
import { LanguageToken, SortDirectionEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mb-assessments-direction-sort-dc',
  templateUrl: './assessments-direction-sort-dc.component.html',
  styleUrls: ['./assessments-direction-sort-dc.component.scss']
})
export class AssessmentsDirectionSortDcComponent implements OnInit, OnChanges {
  // @Input() list: LovList = null;
  // @Input() hidePlaceholder: boolean;
  // @Input() initialValue: BilingualText;
  @Input() initialDirection: string;
  @Input() isBackgroundWhite = true;
  //Output Variables
  @Output() direction: EventEmitter<string> = new EventEmitter();
  // @Output() sortItemSelected: EventEmitter<number> = new EventEmitter();

  //variables
  // sortListForm: FormGroup;
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
    readonly language: BehaviorSubject<string> // private fb: FormBuilder
  ) {
    // this.sortListForm = this.createSortListForm();
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
    if (changes.initialDirection && changes.initialDirection.currentValue) {
      if (changes.initialDirection.currentValue === SortDirectionEnum.DESCENDING) this.isDescending = true;
      else this.isDescending = false;
    }
  }

  //creation of sort form
  // createSortListForm() {
  //   return this.fb.group({
  //     sortMode: this.fb.group({
  //       english: [
  //         null,
  //         {
  //           updateOn: 'blur'
  //         }
  //       ],
  //       arabic: [
  //         null,
  //         {
  //           updateOn: 'blur'
  //         }
  //       ]
  //     })
  //   });
  // }

  //method to emit selected item to sort
  // sortedItemSelected(value) {
  //   this.sortItemSelected.emit(value);
  // }

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
