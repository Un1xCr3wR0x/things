import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BilingualText, getChartOptions, LanguageToken } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { Chart } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { ContributionBreakupColorEnum } from '../../../shared/enums';

@Component({
  selector: 'cim-contributor-timeline-dc',
  templateUrl: './contributor-timeline-dc.component.html',
  styleUrls: ['./contributor-timeline-dc.component.scss']
})
export class ContributorTimelineDcComponent implements OnInit {
  contributionTimelineChartInit: Chart;
  centerTextValue: string;
  exchangeRate = 100;
  contributionTimelineIndex = [];
  contributionTimelineLabel = [];
  contributionTimelineData = [];
  contributionTimelineColor = [];
  lang = 'en';
  @Input() contributionTimline = [];
  @Input() currencyType: BilingualText;
  @Output() switchView: EventEmitter<number> = new EventEmitter();

  /* Chart reference */
  @ViewChild('contributionTimelineChart', { static: true })
  private contributionTimelineChartCanvas: ElementRef;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly bilingualText: BilingualTextPipe
  ) {}
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.centerTextValue = this.bilingualText.transform(this.currencyType);
      this.lang = language;
      this.setChart();
    });
    this.setChart();
  }
  setChart() {
    this.contributionTimelineLabel = [];
    this.contributionTimelineData = [];
    this.contributionTimelineColor = [];
    this.contributionTimline.forEach(summary => {
      this.contributionTimelineIndex.push(summary.indexLabel);
      this.contributionTimelineData.push(summary.amount * this.exchangeRate);
      this.contributionTimelineLabel.push(this.bilingualText.transform(summary.month));
      this.contributionTimelineColor.push(ContributionBreakupColorEnum.month);
      if (summary.amount === null) {
        this.contributionTimelineColor.push();
      }
    });
    this.drawcontributionTimelineChart(this.switchView);
  }
  drawcontributionTimelineChart(chartEvent: EventEmitter<Object>) {
    if (this.contributionTimelineChartInit) {
      this.contributionTimelineChartInit.destroy();
    }
    if (this.contributionTimelineChartCanvas) {
      //TODO Move as common property of chart
      Chart.defaults.global.defaultFontFamily = "'Noto Kufi Arabic','Roboto'";
      const contributionLegend = this.contributionTimelineLabel;

      this.contributionTimelineChartInit = new Chart(this.contributionTimelineChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          datasets: [
            {
              data: this.contributionTimelineData,
              backgroundColor: this.contributionTimelineColor,
              hoverBackgroundColor: this.contributionTimelineColor,
              barThickness: 15,
              borderWidth: 0
            }
          ],
          indexLabel: '{x}, {y}',
          labels: this.contributionTimelineLabel
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 5000
                }
              }
            ]
          },
          hover: {
            mode: 'index',
            intersect: true
          },
          ...getChartOptions(contributionLegend, this.currencyType, this.lang),
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
