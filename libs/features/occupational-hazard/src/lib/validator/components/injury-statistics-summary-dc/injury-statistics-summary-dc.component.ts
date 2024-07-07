/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApplicationTypeToken, BilingualText, GosiCalendar, ApplicationTypeEnum, RouterDataToken, RouterData } from '@gosi-ui/core';
import { InjuryStatistics } from '../../../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'oh-vtr-injury-statistics-summary-dc',
  templateUrl: './injury-statistics-summary-dc.component.html',
  styleUrls: ['./injury-statistics-summary-dc.component.scss']
})
export class InjuryStatisticsSummaryDcComponent implements OnChanges {
  //TODO: remove unused methods
  /**
   * Creating an instance
   */
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}
  /**
   * Local variables
   */
  lang = 'en';
  lastYearInjuryCount: number = null;
  totalInjuryCount: number = null;
  previousInjuryDate: GosiCalendar = new GosiCalendar();
  previousInjuryStatus: BilingualText = new BilingualText();
  url: string;

  /**
   * Input variables
   */
  @Input() injurySummaryStatistics: InjuryStatistics = new InjuryStatistics();
  @Input() socialInsuranceNo: number;
  @Input() allowanceFlag: boolean;

  /**
   *
   * @param changes Capturing the input changes  for injury summary
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injurySummaryStatistics) {
      this.injurySummaryStatistics = changes.injurySummaryStatistics.currentValue;
      this.lastYearInjuryCount = this.injurySummaryStatistics.lastYearInjuryCount;
      this.totalInjuryCount = this.injurySummaryStatistics.totalInjuryCount;
      this.previousInjuryStatus = this.injurySummaryStatistics.previousInjuryStatus;
      if (
        this.injurySummaryStatistics.previousInjuryDate !== null ||
        this.injurySummaryStatistics.previousInjuryDate !== undefined
      ) {
        this.previousInjuryDate = this.injurySummaryStatistics.previousInjuryDate;
      }
    }
    if (changes && changes.socialInsuranceNo) {
      if (this.appToken === ApplicationTypeEnum.PRIVATE) {
        this.url = '/establishment-private/#/home/oh/injury/history/' + this.socialInsuranceNo + '/true';
      } else {
        this.url = '/establishment-public/#/home/oh/injury/history/' + this.socialInsuranceNo + '/true';
      }
    }
  }
  /**
   * Navigate to Injury History
   */
  goToInjuryHistory() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.url = '/establishment-private/#/home/oh/injury/history/' + this.socialInsuranceNo + '/true';
      window.open(this.url, '_blank');
    } else {
      if (this.allowanceFlag) {
        this.router.navigateByUrl(`home/oh/injury/history/` + this.socialInsuranceNo + `/true`);
      } else {
        this.url = '/establishment-public/#/home/oh/injury/history/' + this.socialInsuranceNo + '/true';
        window.open(this.url, '_blank');
      }
    }
  }
}
