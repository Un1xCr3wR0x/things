import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'gosi-loadmore-dc',
  templateUrl: './loadmore-dc.component.html',
  styleUrls: ['./loadmore-dc.component.scss']
})
export class LoadmoreDcComponent implements OnChanges {
  /**
   * Input variables
   */
  @Input() currentPage = 0;
  @Input() pageSize = 10;
  @Input() totalCount: number;

  /**
   * Output variables
   */
  @Output() loadMore = new EventEmitter();

  /**
   * Local variables
   */
  hide = true;
  totalPages = 0;

  constructor() {}

  /**
   * method to catch the changes of the component
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes && changes.pageSize && changes.pageSize.currentValue) ||
      (changes.totalCount && changes.totalCount.currentValue) ||
      (changes && changes.currentPage)
    ) {
      this.setVisibility();
    }
  }

  //TODO: add comments
  setVisibility() {
    if (this.totalCount && this.totalCount > 0) {
      this.totalPages = Math.floor(this.totalCount / this.pageSize);
      if (this.totalCount % this.pageSize > 0) {
        this.totalPages++;
      }
      this.hide = this.currentPage >= this.totalPages - 1 || this.totalPages <= 1 ? true : false;
    }
  }

  //TODO: add comments
  onLoadMore() {
    this.currentPage++;
    this.setVisibility();
    this.loadMore.emit({ currentPage: this.currentPage, pageSize: this.pageSize });
  }

  //TODO: add comments
  reset() {
    this.currentPage = 0;
    this.hide = false;
  }
}
