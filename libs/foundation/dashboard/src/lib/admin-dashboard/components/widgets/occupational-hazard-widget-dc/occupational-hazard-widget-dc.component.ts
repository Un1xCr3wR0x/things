/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { getOtherChartOptions } from '@gosi-ui/core';
import Chart from 'chart.js';
import { MonthlyViewDetails } from '../../../models';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { DashboardConstants } from '../../../constants';
@Component({
  selector: 'dsb-occupational-hazard-widget-dc',
  templateUrl: './occupational-hazard-widget-dc.component.html',
  styleUrls: ['./occupational-hazard-widget-dc.component.scss']
})
export class OccupationalHazardWidgetDcComponent implements OnInit, OnChanges {
  // local variables
  barChart: Chart;
  chartColor = [];
  chartLabels = [];
  chartCount = [];
  minHeight = DashboardConstants.CARD_MIN_HEIGHT;
  // input variables
  @Input() ohDetails = null;
  @Input() monthlyView: MonthlyViewDetails[];
  @ViewChild('barChart', { static: true })
  private barChartRef: ElementRef;
  constructor(readonly bilingualText: BilingualTextPipe) {}

  ngOnInit(): void {}
  /**
   *
   * @param changes This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.monthlyView && changes.monthlyView.currentValue) {
      this.setChartValues();
    }
  }
  /**
   * set chart values
   */
  setChartValues() {
    this.chartColor = [];
    this.chartLabels = [];
    this.chartCount = [];
    this.monthlyView.forEach(values => {
      if (values.component.english.toLowerCase() !== 'january') {
        this.chartLabels.push('');
      } else {
        this.chartLabels.push(this.bilingualText.transform(values.component));
      }
      this.chartColor.push(values.background);
      values.monthlyView.forEach(item => {
        this.chartCount.push(item.count);
      });
    });
    this.createMonthlyChart();
  }
  /* This method is to handle the creation of chart with multiple month details */
  createMonthlyChart() {
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.barChartRef) {
      return new Chart(this.barChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              backgroundColor: this.chartColor,
              data: this.chartCount
            }
          ]
        },
        options: getOtherChartOptions()
      });
    }
  }
}
