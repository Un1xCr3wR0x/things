/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, GosiCalendar } from '@gosi-ui/core';
import { InjuryStatistics } from '../../shared/models';

@Component({
  selector: 'oh-injury-statistics-dc',
  templateUrl: './injury-statistics-dc.component.html',
  styleUrls: ['./injury-statistics-dc.component.scss']
})
export class InjuryStatisticsDcComponent implements OnChanges {
  /**
   * Creating an instance
   */
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}
  /**
   * Local variables
   */
  @Input() injuryStatistics: InjuryStatistics = new InjuryStatistics();
  @Input() socialInsuranceNo;
  @Output() viewHistory: EventEmitter<null> = new EventEmitter();
  lang = 'en';
  url;
  lastYearInjuryCount: number = null;
  totalInjuryCount: number = null;
  previousInjuryDate: GosiCalendar = new GosiCalendar();
  /**
   *
   * @param changes Capturing the input changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryStatistics) {
      this.injuryStatistics = changes.injuryStatistics.currentValue;
      this.lastYearInjuryCount = this.injuryStatistics?.lastYearInjuryCount;
      this.totalInjuryCount = this.injuryStatistics?.totalInjuryCount;
      if (this.injuryStatistics && this.injuryStatistics.previousInjuryDate) {
        this.previousInjuryDate = this.injuryStatistics.previousInjuryDate;
      }
    }
    if (changes && changes.socialInsuranceNo) {
      this.socialInsuranceNo = changes.socialInsuranceNo.currentValue;
      if (changes && changes.socialInsuranceNo) {
        if (this.appToken === ApplicationTypeEnum.PRIVATE) {
          this.url = '/establishment-private/#/home/oh/injury/history/' + this.socialInsuranceNo + '/true';
        } else {
          this.url = '/establishment-public/#/home/oh/injury/history/' + this.socialInsuranceNo + '/true';
        }
      }
    }
  }
  /**
   * Navigate to injury page
   */
  navigateToOhHistory() {
    this.viewHistory.emit();
  }
  /**
   * Navigate to Injury History
   */
  goToInjuryHistory() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.url = '/establishment-private/#/home/oh/injury/history/' + this.socialInsuranceNo + '/true';
    } else {
      this.url = '/establishment-public/#/home/oh/injury/history/' + this.socialInsuranceNo + '/true';
    }
    window.open(this.url, '_blank');
  }
}
