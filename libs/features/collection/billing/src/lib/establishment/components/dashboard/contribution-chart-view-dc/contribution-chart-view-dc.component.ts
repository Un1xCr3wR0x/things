/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, ElementRef, Inject, Input, OnInit, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { BilingualText, getChartOptions, getChartPlugin, LanguageToken } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { Chart } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { ContributionBreakupColorCode, ContributionCategory } from '../../../../shared/enums';
import { ContributionBreakup } from '../../../../shared/models';

@Component({
  selector: 'blg-contribution-chart-view-dc',
  templateUrl: './contribution-chart-view-dc.component.html',
  styleUrls: ['./contribution-chart-view-dc.component.scss']
})
export class ContributionChartViewDcComponent implements OnInit, OnChanges {
  /* Local variables. */
  contributionBreakupChartInit: Chart;
  lang = 'en';
  contributionBreakupLabel = [];
  contributionBreakupData = [];
  contributionBreakupColor = [];
  centerText: string;

  /* Input variables. */
  @Input() currencyType: BilingualText;
  @Input() contributionBreakup: ContributionBreakup;
  @Input() exchangeRate = 1;

  /* Chart reference */
  @ViewChild('contributionBreakupChart', { static: true })
  private contributionBreakupChartCanvas: ElementRef;

  /**
   * Creates an instance of ContributionChartViewDcComponent.
   * @param language langugae token
   * @param bilingualText bilingual text pipe
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly bilingualText: BilingualTextPipe
  ) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.centerText = this.bilingualText.transform(this.currencyType);
      this.lang = language;
      this.setChartData();
    });
    this.centerText = this.bilingualText.transform(this.currencyType);
    this.setChartData();
  }

  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributionBreakup && changes.contributionBreakup.currentValue) {
      this.setChartData();
    }

    /** Change center text on change of currency */
    if (
      changes.currencyType &&
      changes.currencyType.previousValue &&
      changes.currencyType.currentValue?.english !== changes.currencyType.previousValue?.english &&
      !changes.currencyType.isFirstChange()
    ) {
      this.centerText = this.bilingualText.transform(changes.currencyType.currentValue);
      this.setChartData();
    }

    /** Draw the chart on change of currency */
    if (changes.exchangeRate && changes.exchangeRate.currentValue && !changes.exchangeRate.isFirstChange()) {
      this.centerText = this.bilingualText.transform(this.currencyType);
      this.setChartData();
    }
  }

  /** This method is to create chart data */
  setChartData() {
    this.contributionBreakupData = [];
    this.contributionBreakupLabel = [];
    this.contributionBreakupColor = [];
    if (this.contributionBreakup) {
      this.contributionBreakup.contributionDetails.forEach(element => {
        if (
          element.productType.english.toLowerCase() === ContributionCategory.annuity.toLowerCase() &&
          element.contributionAmount !== 0
        ) {
          this.contributionBreakupData.push(element.contributionAmount * this.exchangeRate);
          this.contributionBreakupLabel.push(this.bilingualText.transform(element.productType));
          this.contributionBreakupColor.push(ContributionBreakupColorCode.annuity);
        } else if (
          element.productType.english.toLowerCase() === ContributionCategory.oh.toLowerCase() &&
          element.contributionAmount !== 0
        ) {
          this.contributionBreakupData.push(element.contributionAmount * this.exchangeRate);
          this.contributionBreakupLabel.push(this.bilingualText.transform(element.productType));
          this.contributionBreakupColor.push(ContributionBreakupColorCode.oh);
        } else if (
          element.productType.english.toLowerCase() === ContributionCategory.ui.toLowerCase() &&
          element.contributionAmount !== 0
        ) {
          this.contributionBreakupData.push(element.contributionAmount * this.exchangeRate);
          this.contributionBreakupLabel.push(this.bilingualText.transform(element.productType));
          this.contributionBreakupColor.push(ContributionBreakupColorCode.ui);
        }
        else if (
          element.productType.english.toLowerCase() === ContributionCategory.ppa.toLowerCase() &&
          element.contributionAmount !== 0
        ) {
          this.contributionBreakupData.push(element.contributionAmount * this.exchangeRate);
          this.contributionBreakupLabel.push(this.bilingualText.transform(element.productType));
          this.contributionBreakupColor.push(ContributionBreakupColorCode.ppa);
        }
        else if (element.productType.english.toLowerCase() === ContributionCategory.pension.toLowerCase() &&
        element.contributionAmount !==0 
        ) {
          this.contributionBreakupData.push(element.contributionAmount * this.exchangeRate);
          this.contributionBreakupLabel.push(this.bilingualText.transform(element.productType));
          this.contributionBreakupColor.push(ContributionBreakupColorCode.pension)
        }

      });
    }
    this.drawContributionBreakupChart();
  }

  /** This method is to draw Contribution Breakup Chart */
  drawContributionBreakupChart() {
    if (this.contributionBreakupChartInit) {
      this.contributionBreakupChartInit.destroy();
    }
    if (this.contributionBreakupChartCanvas) {
      const contributionLegend = this.contributionBreakupLabel;

      let font = '';
      if (this.lang === 'en') {
        font = 'Roboto';
      } else if (this.lang === 'ar') {
        font = 'Noto Kufi Arabic ,Roboto';
      }

      this.contributionBreakupChartInit = new Chart(this.contributionBreakupChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.contributionBreakupData,
              backgroundColor: this.contributionBreakupColor,
              hoverBackgroundColor: this.contributionBreakupColor,
              borderWidth: 0
            }
          ],
          labels: this.contributionBreakupLabel
        },
        plugins: [getChartPlugin(this.centerText, font)],
        options: { ...getChartOptions(contributionLegend, this.currencyType, this.lang) }
      });
    }
  }
}
