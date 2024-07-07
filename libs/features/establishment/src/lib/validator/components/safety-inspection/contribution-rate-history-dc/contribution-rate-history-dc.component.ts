/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { Component, OnInit, Inject, Input } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import {
  OHRate,
  OHRateHistory,
  SafetyInspectionConstants,
  TimelineColourEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'est-contribution-rate-history-dc',
  templateUrl: './contribution-rate-history-dc.component.html',
  styleUrls: ['./contribution-rate-history-dc.component.scss']
})
export class ContributionRateHistoryDcComponent implements OnInit {
  private _baseRate: number;
  private _ohRateDetails: OHRate;
  private _ohRateHistoryColorMap: Map<number, string> = new Map();
  delataValue: Map<string, number> = SafetyInspectionConstants.DELTA_VALUES();
  lang: string;
  timelineColourMap: Map<string, TimelineColourEnum> = new Map([
    ['min', TimelineColourEnum.GREEN],
    ['medium', TimelineColourEnum.ORANGE],
    ['max', TimelineColourEnum.RED]
  ]);
  pageSize = 5;
  currentPage = 0;
  loadedHistoryData: OHRateHistory[] = [];

  @Input() set OHRateDetails(OHRateDetails: OHRate) {
    this._baseRate = OHRateDetails?.baseRate;
    this._ohRateDetails = OHRateDetails;
    if (OHRateDetails?.ohRateHistory?.length > 0) {
      this.loadedHistoryData = [];
      this.loadMore({ currentPage: 0, pageSize: this.pageSize });
      OHRateDetails?.ohRateHistory?.forEach((history, index) => {
        this._ohRateHistoryColorMap.set(
          index,
          history?.contributionPercentage - this._baseRate === this.delataValue.get('min')
            ? this.timelineColourMap.get('min')
            : history?.contributionPercentage - this._baseRate === this.delataValue.get('medium')
            ? this.timelineColourMap.get('medium')
            : this.timelineColourMap.get('max')
        );
      });
    }
  }
  get OHRateDetails() {
    return this._ohRateDetails;
  }

  get baseRate() {
    return this._baseRate;
  }

  get ohRateHistoryColorMap() {
    return this._ohRateHistoryColorMap;
  }

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => (this.lang = language));
  }
  /**
   * Method to load more items in view
   * @param event
   */
  loadMore(event: { currentPage: number; pageSize: number }) {
    this.currentPage = event.currentPage;
    const currentIndex = event.currentPage * event.pageSize;
    this.loadedHistoryData.push(
      ...this.OHRateDetails?.ohRateHistory?.slice(currentIndex, currentIndex + event.pageSize)
    );
  }
}
