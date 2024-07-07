import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mb-medical-board-assessments-heading-dc',
  templateUrl: './medical-board-assessments-heading-dc.component.html',
  styleUrls: ['./medical-board-assessments-heading-dc.component.scss']
})
export class MedicalBoardAssessmentsHeadingDcComponent implements OnInit {
  @Output() searchAssessment: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterAssessment: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() onDirection: EventEmitter<string> = new EventEmitter();
  isSearched = false;
  @Input() searchParams = '';
  @Input() initialValue = 'DESC';

  constructor() {}

  ngOnInit(): void {}
  searchAssessments(value: string) {
    if (value && (value.length >= 3 || value === null)) {
      this.searchAssessment.emit(value);
      this.isSearched = true;
      this.searchParams = value;
    }
  }
  // onsearchSessionId(value: string) {

  // }
  onSearchEnable(key: string) {
    if (!key && this.isSearched) {
      this.isSearched = false;
      this.searchParams = key;
      this.searchAssessment.emit(key);
    }
  }
  resetSearch() {
    this.searchAssessment.emit(null);
  }

  onFilter(value) {
    this.filterAssessment.emit(value);
  }
  onSortDirection(value) {
    this.onDirection.emit(value);
  }
}
