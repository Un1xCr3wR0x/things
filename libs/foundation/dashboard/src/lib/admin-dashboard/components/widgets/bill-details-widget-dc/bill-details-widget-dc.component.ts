/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  Inject,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { Chart } from 'chart.js';
import { getChartPlugin, getChartOptions, BilingualText, LanguageToken } from '@gosi-ui/core';
import { BillDetails } from '../../../models';
import { BehaviorSubject } from 'rxjs';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { DashboardConstants } from '../../../constants';
@Component({
  selector: 'dsb-bill-details-widget-dc',
  templateUrl: './bill-details-widget-dc.component.html',
  styleUrls: ['./bill-details-widget-dc.component.scss']
})
export class BillDetailsWidgetDcComponent implements OnInit, OnChanges {
  /* Local variables. */
  billDetailChart: Chart;
  billDetailLabel = [];
  billData = [];
  billDetailColor = [];
  centerTextValue: string;
  lang = 'en';
  minHeight = DashboardConstants.CARD_MIN_HEIGHT;
  /* Chart reference */
  @ViewChild('billDetailsChart', { static: true })
  private billDetailChartCanvas: ElementRef;
  // input variables
  @Input() currencyType: BilingualText = {
    english: 'SAR',
    arabic: 'ر.س'
  };
  @Input() billDetails: BillDetails[];
  //output variables
  @Output() switchView: EventEmitter<number> = new EventEmitter();
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly bilingualText: BilingualTextPipe
  ) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.centerTextValue = this.bilingualText.transform(this.currencyType);
      this.lang = language;
      this.setBillChart();
    });
    this.centerTextValue = this.bilingualText.transform(this.currencyType);
    this.setBillChart();
  }
  /**
   * This method is used to handle the changes in the input variables
   *  */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.billDetails && changes.billDetails.currentValue) {
      this.setBillChart();
    }
  }
  /**
   * method to set chart values
   */
  setBillChart() {
    this.billDetailLabel = [];
    this.billData = [];
    this.billDetailColor = [];
    this.billDetails.forEach(summary => {
      if (summary.type.english.toLowerCase() === 'contributions' && summary.amount !== 0) {
        this.billData.push(summary.amount);
        this.billDetailLabel.push(this.bilingualText.transform(summary.type));
        this.billDetailColor.push('#006AA7');
      } else if (summary.type.english.toLowerCase() === 'adjustments' && summary.amount !== 0) {
        this.billData.push(summary.amount);
        this.billDetailLabel.push(this.bilingualText.transform(summary.type));
        this.billDetailColor.push('#5FC67A');
      }
    });
    this.drawBillDetailChart(this.switchView);
  }
  /** This method is to draw Bill Chart  */
  drawBillDetailChart(chartEvent: EventEmitter<Object>) {
    if (this.billDetailChart) {
      this.billDetailChart.destroy();
    }
    if (this.billDetailChartCanvas) {
      Chart.defaults.global.defaultFontFamily = "'Noto Kufi Arabic','Roboto'";
      const billingValue = this.billDetailLabel;
      let font = '';
      if (this.lang === 'en') {
        font = 'Roboto';
      } else if (this.lang === 'ar') {
        font = 'Noto Kufi Arabic , Roboto';
      }
      this.billDetailChart = new Chart(this.billDetailChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.billData,
              backgroundColor: this.billDetailColor,
              hoverBackgroundColor: this.billDetailColor,
              borderWidth: 0
            }
          ],
          labels: this.billDetailLabel
        },
        plugins: [getChartPlugin(this.centerTextValue, font)],
        options: {
          ...getChartOptions(billingValue, this.currencyType, this.lang),
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
