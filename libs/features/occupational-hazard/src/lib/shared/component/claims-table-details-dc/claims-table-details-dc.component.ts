/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ClaimsSummary } from '../../../shared/models/claims-summary';

@Component({
  selector: 'oh-claims-table-details-dc',
  templateUrl: './claims-table-details-dc.component.html',
  styleUrls: ['./claims-table-details-dc.component.scss']
})
export class ClaimsTableDetailsDcComponent implements OnChanges {
  lang: string;
  @Input() claimsSummary: ClaimsSummary;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  getDateDifference(startDate, endDate) {
    const started = moment(startDate);
    const ended = moment(endDate);
    return ended.diff(started, 'days') + 1;
  }
  /**
   *
   * @param changes Capturing input  on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.claimsSummary) {
      this.claimsSummary = changes.claimsSummary.currentValue;
    }
  }
}
