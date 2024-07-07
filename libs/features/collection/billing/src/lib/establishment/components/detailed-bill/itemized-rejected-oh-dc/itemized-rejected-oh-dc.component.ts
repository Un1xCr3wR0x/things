import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ItemizedRejectedOHWrapper } from '../../../../shared/models/itemized-rejected-OH-wrapper';
import { RejectedOHDetails } from '../../../../shared/models/rejected-OH-details';

@Component({
  selector: 'blg-itemized-rejected-oh-dc',
  templateUrl: './itemized-rejected-oh-dc.component.html',
  styleUrls: ['./itemized-rejected-oh-dc.component.scss']
})
export class ItemizedRejectedOHDcComponent implements OnInit, OnChanges {
  paginationId = 'itemizedRejectedOh';
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  lang = 'en';
  items: RejectedOHDetails[] = [];
  /**
   * Input variable
   */
  @Input() rejectedOHDetails: ItemizedRejectedOHWrapper;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() pageNo: number;
  /**
   * output variable
   */
  @Output() selectPage: EventEmitter<number> = new EventEmitter();
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to instantiate the component. */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.rejectedOHDetails &&
      changes.rejectedOHDetails.currentValue &&
      !changes.rejectedOHDetails.isFirstChange()
    ) {
      const data = changes.rejectedOHDetails.currentValue;
      this.getItemizedValues(data);
      this.pageDetails.currentPage = this.pageNo + 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    }
    this.getItemizedValues(this.rejectedOHDetails);
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
  }
  getItemizedValues(rejectedOHDetails: ItemizedRejectedOHWrapper) {
    this.items = rejectedOHDetails.cases;
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectedPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPage.emit(this.currentPage - 1);
    }
  }
}
