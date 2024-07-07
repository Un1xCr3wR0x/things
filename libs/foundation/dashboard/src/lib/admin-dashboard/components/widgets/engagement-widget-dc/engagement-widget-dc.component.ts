/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  ElementRef,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  Input,
  Inject
} from '@angular/core';
import { Chart } from 'chart.js';
import { EngagementDetails } from '../../../models';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { LanguageToken, getChartPlugin, getChartOptions } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { DashboardConstants } from '../../../constants';
@Component({
  selector: 'dsb-engagement-widget-dc',
  templateUrl: './engagement-widget-dc.component.html',
  styleUrls: ['./engagement-widget-dc.component.scss']
})
export class EngagementWidgetDcComponent implements OnInit, OnChanges {
  //local variables
  engagementDetailChart: Chart;
  engagementDetailLabels = [];
  engagementDetailColors = [];
  engagementCount = [];
  lang = 'en';
  centerText: string;
  minHeight = DashboardConstants.CARD_MIN_HEIGHT;
  /* Chart reference */
  @ViewChild('engagementDetailsChart', { static: true })
  private engagementDetailsChartCanvas: ElementRef;
  // input variables
  @Input() engagement: EngagementDetails[];
  @Input() currencyType = { english: '', arabic: '' };
  //output variables
  @Output() chartView: EventEmitter<number> = new EventEmitter();

  constructor(
    readonly bilingualText: BilingualTextPipe,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.centerText = this.bilingualText.transform(null);
      this.lang = language;
      this.setEngagementChart();
    });
    this.centerText = this.bilingualText.transform(null);
    this.setEngagementChart();
  }
  /**
   * This method is used to handle the changes in the input variables
   *  */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.engagement && changes.engagement.currentValue) {
      this.setEngagementChart();
    }
  }
  /**
   * method to set chart values
   */
  setEngagementChart() {
    this.engagementDetailLabels = [];
    this.engagementCount = [];
    this.engagementDetailColors = [];
    this.engagement.forEach(values => {
      if (values.nationality.english.toLowerCase() === 'saudi' && values.count !== 0) {
        this.engagementCount.push(values.count);
        this.engagementDetailColors.push('#006AA7');
        this.engagementDetailLabels.push(this.bilingualText.transform(values.nationality));
      } else if (values.nationality.english.toLowerCase() === 'non saudi' && values.count !== 0) {
        this.engagementCount.push(values.count);
        this.engagementDetailColors.push('#5FC67A');
        this.engagementDetailLabels.push(this.bilingualText.transform(values.nationality));
      }
    });
    this.drawEngagementDetailChart(this.chartView);
  }
  /**
   *
   * @param chartEvent method to draw chart
   */
  drawEngagementDetailChart(chartEvent: EventEmitter<Object>) {
    if (this.engagementDetailChart) {
      this.engagementDetailChart.destroy();
    }
    if (this.engagementDetailsChartCanvas) {
      Chart.defaults.global.defaultFontFamily = "'Noto Kufi Arabic','Roboto'";
      const engagementValue = this.engagementDetailLabels;
      let font = '';
      if (this.lang === 'en') {
        font = 'Roboto';
      } else if (this.lang === 'ar') {
        font = 'Noto Kufi Arabic , Roboto';
      }
      this.engagementDetailChart = new Chart(this.engagementDetailsChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.engagementCount,
              backgroundColor: this.engagementDetailColors,
              hoverBackgroundColor: this.engagementDetailColors,
              borderWidth: 0
            }
          ],
          labels: this.engagementDetailLabels
        },
        plugins: [getChartPlugin(null, font, false)],
        options: {
          pieceLabel: {
            render: function (d) {
              return d;
            },
            fontColor: '#000',
            position: 'outside',
            segment: true
          },
          ...getChartOptions(engagementValue, this.currencyType, this.lang, false),
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
