import { _ParseAST } from '@angular/compiler';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { Chart } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { formatNumber } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerContactService } from '../../../shared/services/customer-contact.service';

@Component({
  selector: 'cim-customer-contacts',
  templateUrl: './customer-contacts.component.html',
  styleUrls: ['./customer-contacts.component.scss']
})
export class CustomerContactsComponent implements OnInit {
  contributionBreakupChartInit: Chart;
  exchangeRate = 1;
  breakupLabel = [];
  breakupData = [];
  breakupColor = [];
  centerTextValue: string;
  value = 0;
  lang: string = 'ar';
  personId: number;

  /* Chart reference */
  @ViewChild('contributionBreakupChart', { static: true })
  private contributionBreakupChartCanvas: ElementRef;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly bilingualText: BilingualTextPipe,
    readonly customerTouchService: CustomerContactService,
    readonly activatedRoute: ActivatedRoute
  ) {}

  /** Method to instantiate the component. */
  ngOnInit(): void {
    this.activatedRoute.parent.params.subscribe(param => {
      if (param) this.personId = Number(param.personId);
      this.language.subscribe(l => {
        this.lang = l == 'en' ? 'en' : 'ar';
        this.setChart();
      });
    });
  }

  /** This method is to create chart data */
  setChart() {
    this.breakupLabel = [];
    this.breakupData = [];
    this.breakupColor = [];

    this.customerTouchService.getUsersVisitors(this.personId, this.lang).subscribe(resp => {
      this.breakupLabel = resp.apps;
      this.breakupColor = resp.color;
      this.breakupData = resp.count;
      this.drawcontributionBreakupChart();
    });
  }

  /** This method is to draw contribution Breakup Chart  */
  drawcontributionBreakupChart() {
    if (this.contributionBreakupChartInit) {
      this.contributionBreakupChartInit.destroy();
    }
    if (this.contributionBreakupChartCanvas) {
      //TODO Move as common property of chart
      Chart.defaults.global.defaultFontFamily = "'Noto Kufi Arabic','Roboto'";
      let font = '';
      if (this.lang === 'en') {
        this.centerTextValue = 'CONTACTS';
        font = 'Roboto';
      } else if (this.lang === 'ar') {
        this.centerTextValue = 'تواصل';
        font = 'Noto Kufi Arabic , Roboto';
      }
      const contributionLegend = this.breakupLabel;
      this.contributionBreakupChartInit = new Chart(this.contributionBreakupChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.breakupData,
              backgroundColor: this.breakupColor,
              hoverBackgroundColor: this.breakupColor,
              borderWidth: this.breakupData.length > 1 ? 2 : 0
              // bevelWidth: 3,
              // bevelHighlightColor: 'rgba(255, 255,255,0.75)'
            }
          ],
          labels: this.breakupLabel
        },
        plugins: [this.getChartPlugins(this.centerTextValue, font)],
        options: {
          ...this.getChartOptionss(contributionLegend),
          tooltips: {
            xAlign: 'center',
            yAlign: 'center'
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
                  label += ' Contact';
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
          'display:block; width:auto; height:' + Math.floor(properHeight) / 20 + 'rem;'
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
          'display:block; width:auto; height:' + Math.floor(properHeight) / 20 + 'rem;'
        );
      }
    };
  }
}
