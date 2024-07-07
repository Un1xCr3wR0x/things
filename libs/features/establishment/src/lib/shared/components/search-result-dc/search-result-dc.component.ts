import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'est-search-result-dc',
  templateUrl: './search-result-dc.component.html',
  styleUrls: ['./search-result-dc.component.scss']
})
export class SearchResultDcComponent implements OnChanges {
  readonly oneResult = 'ESTABLISHMENT.SEARCH-RESULT-ONE-COUNT';
  readonly twoResults = 'ESTABLISHMENT.SEARCH-RESULT-TWO-COUNT';
  readonly threeToTen = 'ESTABLISHMENT.SEARCH-RESULT-THREE-COUNT';
  readonly moreThanEleven = 'ESTABLISHMENT.SEARCH-RESULT-ELEVEN-COUNT';

  searchResults: string;

  @Input() value: string;
  @Input() count: number;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.count) {
      this.setResultMessage();
    }
  }

  setResultMessage() {
    if (!this.count || this.count === 1) {
      this.searchResults = this.oneResult;
    } else if (this.count === 2) {
      this.searchResults = this.twoResults;
    }
    if (this.count >= 3 && this.count <= 10) {
      this.searchResults = this.threeToTen;
    } else {
      this.searchResults = this.moreThanEleven;
    }
  }
}
