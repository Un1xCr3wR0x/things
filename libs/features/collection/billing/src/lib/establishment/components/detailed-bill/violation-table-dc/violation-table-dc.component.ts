import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { DetailedBillViolationDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-violation-table-dc',
  templateUrl: './violation-table-dc.component.html',
  styleUrls: ['./violation-table-dc.component.scss']
})
export class ViolationTableDcComponent implements OnInit, OnChanges {
  paginationId = 'violation';
  itemsPerPage = 10;
  lang = 'en';
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  @Input() violationDetails: DetailedBillViolationDetails;

  /* Output variables */
  @Output() onPageChange: EventEmitter<number> = new EventEmitter();
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.violationDetails?.currentValue) {
      this.violationDetails = changes.violationDetails.currentValue;
    }
  }
  selectPage(page: number) {
    this.pageDetails.currentPage = page;
    this.onPageChange.emit(page);
  }
}
