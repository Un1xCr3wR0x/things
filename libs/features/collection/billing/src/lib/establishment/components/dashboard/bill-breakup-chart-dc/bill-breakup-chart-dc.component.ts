/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BilingualText, getChartOptions, getChartPlugin, LanguageToken } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { Chart } from 'chart.js';
//import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { BillBreakupColorCode, BillCategory } from '../../../../shared/enums';
import { BillSummary } from '../../../../shared/models';

@Component({
  selector: 'blg-bill-breakup-chart-dc',
  templateUrl: './bill-breakup-chart-dc.component.html',
  styleUrls: ['./bill-breakup-chart-dc.component.scss']
})
export class BillBreakupChartDcComponent implements OnInit, OnChanges {
  /* Local variables. */
  billBreakupChartInit: Chart;
  lang = 'en';
  billBreakupLabel = [];
  billBreakupData = [];
  billBreakupColor = [];
  centerTextValue: string;

  /* Input variables */
  @Input() billBreakup: BillSummary[];
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;

  /* Output variables */
  @Output() switchView: EventEmitter<number> = new EventEmitter();

  /* Chart reference */
  @ViewChild('billBreakupChart', { static: true })
  private billBreakupChartCanvas: ElementRef;

  /**
   * Creates an instance of BillBreakupChartDcComponent
   * @param language language token
   * @param bilingualText bilingual text pipe
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly bilingualText: BilingualTextPipe
  ) {}

  /** Method to instantiate the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.centerTextValue = this.bilingualText.transform(this.currencyType);
      this.lang = language;
      this.setChart();
    });
    this.centerTextValue = this.bilingualText.transform(this.currencyType);
    this.setChart();
  }

  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.billBreakup && changes.billBreakup.currentValue) {
      this.setChart();
    }

    /** Reassign center text on change of currency */
    if (
      changes.currencyType &&
      changes.currencyType.currentValue &&
      changes.currencyType.previousValue &&
      changes.currencyType.currentValue.english !== changes.currencyType.previousValue.english &&
      !changes.currencyType.isFirstChange()
    ) {
      this.centerTextValue = this.bilingualText.transform(changes.currencyType.currentValue);
      this.setChart();
    }

    /** Draw the chart on change of currency */
    if (changes.exchangeRate && changes.exchangeRate.currentValue && !changes.exchangeRate.isFirstChange()) {
      this.centerTextValue = this.bilingualText.transform(this.currencyType);
      this.setChart();
    }
  }

  /** This method is to create chart data */
  setChart() {
    this.billBreakupLabel = [];
    this.billBreakupData = [];
    this.billBreakupColor = [];
    this.billBreakup.forEach(summary => {
      if (summary.type.english.toLowerCase() === BillCategory.contribution.toLowerCase() && summary.amount !== 0) {
        this.billBreakupData.push(summary.amount * this.exchangeRate);
        this.billBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.billBreakupColor.push(BillBreakupColorCode.contribution);
      } else if (summary.type.english.toLowerCase() === BillCategory.adjustment.toLowerCase() && summary.amount !== 0) {
        this.billBreakupData.push(summary.amount * this.exchangeRate);
        this.billBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.billBreakupColor.push(BillBreakupColorCode.adjustment);
      } else if (summary.type.english.toLowerCase() === BillCategory.violations.toLowerCase() && summary.amount !== 0) {
        this.billBreakupData.push(summary.amount * this.exchangeRate);
        this.billBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.billBreakupColor.push(BillBreakupColorCode.violations);
      } else if (summary.type.english.toLowerCase() === BillCategory.rejectedOH.toLowerCase() && summary.amount !== 0) {
        this.billBreakupData.push(summary.amount * this.exchangeRate);
        this.billBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.billBreakupColor.push(BillBreakupColorCode.rejectedOH);
      } else if (
        summary.type.english.toLowerCase() === BillCategory.installment.toLowerCase() &&
        summary.amount !== 0
      ) {
        this.billBreakupData.push(summary.amount * this.exchangeRate);
        this.billBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.billBreakupColor.push(BillBreakupColorCode.installment);
      } else if (summary.type.english.toLowerCase() === BillCategory.unpaidDues.toLowerCase() && summary.amount !== 0) {
        this.billBreakupData.push(summary.amount * this.exchangeRate);
        this.billBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.billBreakupColor.push(BillBreakupColorCode.unpaidDues);
      }
    });
    this.drawBillBreakupChart(this.switchView);
  }

  /** This method is to draw Bill Breakup Chart  */
  drawBillBreakupChart(chartEvent: EventEmitter<Object>) {
    if (this.billBreakupChartInit) {
      this.billBreakupChartInit.destroy();
    }
    if (this.billBreakupChartCanvas) {
      //TODO Move as common property of chart
      Chart.defaults.global.defaultFontFamily = "'Noto Kufi Arabic','Roboto'";
      let font = '';
      if (this.lang === 'en') {
        font = 'Roboto';
      } else if (this.lang === 'ar') {
        font = 'Noto Kufi Arabic , Roboto';
      }
      const billLegend = this.billBreakupLabel;
      this.billBreakupChartInit = new Chart(this.billBreakupChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.billBreakupData,
              backgroundColor: this.billBreakupColor,
              hoverBackgroundColor: this.billBreakupColor,
              borderWidth: 0
              // bevelWidth: 3,
              // bevelHighlightColor: 'rgba(255, 255,255,0.75)'
            }
          ],
          labels: this.billBreakupLabel
        },
        plugins: [getChartPlugin(this.centerTextValue, font)],
        options: {
          ...getChartOptions(billLegend, this.currencyType, this.lang),
          onClick: function (event, data) {
            if (event && data.length > 0) {
              chartEvent.emit({
                tabIndicator: data[0]._index,
                selectedChart: data[0]._view.label
              });
            }
          }
        }
      });
    }
  }
}
