/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { SearchRequest } from '../../../../shared';
import { LanguageEnum, BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'dsb-search-results-label-dc',
  templateUrl: './search-results-label-dc.component.html',
  styleUrls: ['./search-results-label-dc.component.scss']
})
export class SearchResultsLabelDcComponent implements OnInit {
  //input variables
  @Input() searchRequest: SearchRequest;
  @Input() count: number;
  @Input() isEstablishment = false;
  @Input() isIndividual = false;
  @Input() isTransaction = false;
  @Input() lang: LanguageEnum;
  constructor() {}

  ngOnInit(): void {}
  getLabelFromBilingualArray(items: BilingualText[]) {
    return items.map(item => (this.lang === LanguageEnum.ENGLISH ? item.english : item.arabic)).join(',');
  }
}
