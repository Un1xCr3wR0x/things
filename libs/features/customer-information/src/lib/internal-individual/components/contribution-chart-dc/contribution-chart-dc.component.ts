import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { formatNumber } from '@angular/common';
import { Chart } from 'chart.js';
import { LanguageToken, DropdownItem } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { SearchEngagementResponse } from '../../../shared';
import { ContributionBreakupsColorEnum } from '@gosi-ui/features/contributor/lib/shared/enums';

@Component({
  selector: 'cim-contribution-chart-dc',
  templateUrl: './contribution-chart-dc.component.html',
  styleUrls: ['./contribution-chart-dc.component.scss']
})
export class ContributionChartDcComponent implements OnInit, OnChanges {
  contributionBreakupChartInit: Chart;
  exchangeRate = 1;
  contributionBreakupLabel = [];
  contributionBreakupData = [];
  contributionBreakupColor = [];
  centerTextValue: string;
  value = 0;
  lan: string;

  @Input() contributionBreakup = [];
  @Input() contributionValues: SearchEngagementResponse;
  @Input() actionDropDown: Array<DropdownItem>;
  @Input() lang: string;
  @Input() engagements = false;

  @Output() switchView: EventEmitter<number> = new EventEmitter();
  @Output() navigateToProfilePage: EventEmitter<string> = new EventEmitter();
  /* Chart reference */
  @ViewChild('contributionBreakupChart', { static: true })
  private contributionBreakupChartCanvas: ElementRef;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly bilingualText: BilingualTextPipe
  ) {}

  /** Method to instantiate the component. */
  ngOnInit(): void {
    this.setChart();
  }

  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributionValues && changes.contributionValues.currentValue) {
      this.setChart();
    }
    if (changes && changes.lang && changes.lang.currentValue) {
      this.lan = changes.lang.currentValue;
      if (this.lan === 'en') {
        this.centerTextValue = 'MONTHS';
      } else {
        this.centerTextValue = 'شهر';
      }
      this.setChart();
    }
  }

  navigateToProfile(value) {
    this.navigateToProfilePage.emit(value);
  }

  /** This method is to create chart data */
  setChart() {
    this.contributionBreakupLabel = [];
    this.contributionBreakupData = [];
    this.contributionBreakupColor = [];
    if (this.contributionValues?.totalContributionDays !== 0) {
      this.contributionBreakupData.push(Math.floor(this.contributionValues?.totalContributionDays / 30));
      if (this.lan === 'en') {
        this.contributionBreakupLabel.push('GOSI');
      } else {
        this.contributionBreakupLabel.push('المؤسسة العامة للتأمينات الاجتماعية');
      }
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.gosi);
    }
    if (this.contributionValues?.totalRPAContributionMonths !== 0) {
      this.contributionBreakupData.push(this.contributionValues?.totalRPAContributionMonths);
      if (this.lan === 'en') {
        this.contributionBreakupLabel.push('Public Pension Agency');
      } else {
        this.contributionBreakupLabel.push('وكالة التقاعد العامة');
      }
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.ppa);
    }
    if (this.contributionValues?.totalVicContributionDays !== 0) {
      this.contributionBreakupData.push(Math.floor(this.contributionValues?.totalVicContributionDays / 30));
      if (this.lan === 'en') {
        this.contributionBreakupLabel.push('Voluntary Individual Contribution');
      } else {
        this.contributionBreakupLabel.push('مشترك اختياري');
      }
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.vic);
    }
    this.drawcontributionBreakupChart(this.switchView);
  }

  /** This method is to draw contribution Breakup Chart  */
  drawcontributionBreakupChart(chartEvent: EventEmitter<Object>) {
    if (this.contributionBreakupChartInit) {
      this.contributionBreakupChartInit.destroy();
    }
    if (this.contributionBreakupChartCanvas) {
      //TODO Move as common property of chart
      Chart.defaults.global.defaultFontFamily = "'Noto Kufi Arabic','Roboto'";
      let font = '';
      if (this.lang === 'en') {
        font = 'Roboto';
      } else if (this.lang === 'ar') {
        font = 'Noto Kufi Arabic , Roboto';
      }
      const contributionLegend = this.contributionBreakupLabel;
      this.contributionBreakupChartInit = new Chart(this.contributionBreakupChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.contributionBreakupData,
              backgroundColor: this.contributionBreakupColor,
              hoverBackgroundColor: this.contributionBreakupColor,
              borderWidth: 0
              // bevelWidth: 3,
              // bevelHighlightColor: 'rgba(255, 255,255,0.75)'
            }
          ],
          labels: this.contributionBreakupLabel
        },
        plugins: [this.getChartPlugins(this.centerTextValue, font)],
        options: {
          ...this.getChartOptionss(contributionLegend),
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
  getChartOptionss(chartLegend, isToolTip = true) {
    return {
      legend: {
        display: false,
        labels: {
          filter: function (item) {
            return chartLegend.indexOf(item.text) > -1;
          }
        },
        position: 'bottom',
        onClick: null
      },
      tooltips: !isToolTip
        ? { enabled: false }
        : {
            enabled: true,
            displayColors: true,
            backgroundColor: 'rgba(0, 0, 0)',
            callbacks: {
              label: function (tooltipItem, data) {
                let label = data.labels[tooltipItem.index] || '';
                if (label) {
                  label = ' ';
                  if (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) {
                    label += formatNumber(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index], 'en-US');
                  }
                  label += ' Months';
                }
                return label;
              }
            }
          },
      maintainAspectRatio: false,
      responsive: true,
      cutoutPercentage: 60,
      series: [{ center: ['60%', '50%'] }]
    };
  }
  getChartPlugins(centerText: string, font: string, isDecimalPoint = true) {
    return {
      beforeInit: this.getBeforeInitPlugin(),
      resize: this.getResizePlugin(),
      afterDraw: function (chart) {
        const dataSets = [];
        dataSets.push(chart.data.datasets[0].data);
        const totalAmount = dataSets[0].reduce((a, b) => a + b, 0);
        const width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        const fontSize = (height / 160).toFixed(2);
        ctx.font = fontSize + 'em ' + font;
        ctx.textBaseline = 'middle';
        let text = isDecimalPoint ? formatNumber(totalAmount, 'en-US') : totalAmount,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = centerText ? height / 2.1 : height / 1.9;

        ctx.fillText(text, textX, textY);
        if (centerText) {
          (text = centerText), (textX = Math.round((width - ctx.measureText(text).width) / 2)), (textY = height / 1.7);
          ctx.fillText(text, textX, textY);
        }
        ctx.save();
      }
    };
  }
  getBeforeInitPlugin() {
    return function (chart) {
      const dpr = window.devicePixelRatio || 1;
      if (dpr > 0.75 && dpr < 2) {
        const properHeight = dpr * 100 + 100;
        chart.canvas.setAttribute(
          'style',
          'display:block; width:auto; height:' + Math.floor(properHeight) / 14 + 'rem;'
        );
      }
    };
  }

  getResizePlugin() {
    return function (chart) {
      const dpr = window.devicePixelRatio || 1;
      if (dpr > 0.75 && dpr < 2) {
        const properHeight = dpr * 100 + 100;
        chart.canvas.setAttribute(
          'style',
          'display:block; width:auto; height:' + Math.floor(properHeight) / 14 + 'rem;'
        );
      }
    };
  }
}
