/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import Chart from 'chart.js';
import { fromEvent, Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
// import { Observable, Subscription, fromEvent } from 'rxjs';

//****************Plugin for Chart */
const plugin = {
  beforeInit: function (InputChart) {
    const dpr = window.devicePixelRatio || 1;
    if (dpr > 0.75 && dpr < 2) {
      //const properHeight = dpr * 100 + 100;
      InputChart.canvas.setAttribute('style', 'display:block; max-width:65px; height:65px;');
    }
  },
  resize: function (InputChart) {
    const dpr = window.devicePixelRatio || 1;
    if (dpr > 0.75 && dpr < 2) {
      //const properHeight = dpr * 100 + 100;
      InputChart.canvas.setAttribute('style', 'display:block; width:auto; height:65px;');
    }
  },
  afterDraw: function (InputChart) {
    const dataSets = [];
    dataSets.push(InputChart.data.datasets[0].data);
    const count = InputChart.data.datasets[0].data[0];
    const width = InputChart.width,
      height = InputChart.height,
      ctx = InputChart.ctx;
    ctx.restore();
    //const fontSize = (height / 100).toFixed(2);
    ctx.font = '2rem Roboto';
    ctx.textBaseline = 'top';
    const text = count,
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height / 2 - 8;
    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};
//****************Plugin for Chart Ends********************* */

@Component({
  selector: 'gosi-transaction-priority-dc',
  templateUrl: './transaction-priority-dc.component.html',
  styleUrls: ['./transaction-priority-dc.component.scss']
})
export class TransactionPriorityDcComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() highCount = 0;
  @Input() mediumCount = 0;
  @Input() lowCount = 0;
  @Input() totalCount = 0;
  chartLists: Chart[] = [];
  chartResponsiveObservable$: Observable<Event>;
  chartResponsiveSubscription$: Subscription;
  @ViewChildren('canvas') private chartRef: QueryList<ElementRef>;
  constructor() {}
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.initiateChart();
  }
  ngOnInit(): void {}
  ngAfterViewInit() {
    this.initiateChart();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.highCount && changes.highCount.currentValue) {
      this.highCount = changes.highCount.currentValue;
    }
    if (changes && changes.mediumCount && changes.mediumCount.currentValue) {
      this.mediumCount = changes.mediumCount.currentValue;
    }
    if (changes && changes.lowCount && changes.lowCount.currentValue) {
      this.lowCount = changes.lowCount.currentValue;
    }
    if (changes && changes.totalCount && changes.totalCount.currentValue) {
      this.totalCount = changes.totalCount.currentValue;
    }
    this.initiateChart();
  }
  chartStabilizer() {
    // Call this function in ngAfterViewInit, if chart is flickering
    this.chartResponsiveObservable$ = fromEvent(window, 'resize');
    this.chartResponsiveSubscription$ = this.chartResponsiveObservable$.subscribe(() => {
      const dp = window.devicePixelRatio || 1;
      if (dp > 0.65 && dp < 0.85) {
        for (let i = 0; i < this.chartLists.length; i++) {
          this.chartLists[i].canvas.setAttribute('style', 'display:block; width:auto; height:5rem');
        }
      }
      if (dp > 0.85 && dp < 2) {
        for (let i = 0; i < this.chartLists.length; i++) {
          this.chartLists[i].canvas.setAttribute('style', 'display:block; width:auto; height:5rem');
        }
      }
    });
  }
  initiateChart() {
    this.totalCount = this.highCount + this.lowCount + this.mediumCount;
    //function to set data for creating chart
    if (this.chartLists.length > 0) {
      this.chartLists.forEach(chart => chart.destroy());
    }
    this.chartLists = [];
    if (this.chartRef) {
      setTimeout(() => {
        this.chartRef.forEach(chartRef => {
          if (this.chartLists.length <= 0) {
            this.chartLists.push(this.createChart(chartRef, this.highCount, '#FF4040', this.totalCount));
            return false;
          }
          if (this.chartLists.length <= 1) {
            this.chartLists.push(this.createChart(chartRef, this.mediumCount, '#FFA200', this.totalCount));
            return false;
          }
          if (this.chartLists.length <= 2) {
            this.chartLists.push(this.createChart(chartRef, this.lowCount, '#1BAF5D', this.totalCount));
            return false;
          }
        });
      }, 1500);
    }
  }
  createChart(chartRef, response, color, total) {
    /* chart will be created*/
    return new Chart(chartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [
          {
            backgroundColor: [color],
            data: [response, total - response],
            borderWidth: 2
          }
        ]
      },
      plugins: [plugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 84,
        angle: 10,
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          labels: {
            fontSize: 16,
            fontColor: '#666666'
          }
        }
      }
    });
  }
}
