import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { InstallmentSummary } from '../../../shared/models';
import moment from 'moment';
import { Chart } from 'chart.js';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'blg-installment-summary-dc',
  templateUrl: './installment-summary-dc.component.html',
  styleUrls: ['./installment-summary-dc.component.scss']
})
export class InstallmentSummaryDcComponent implements OnInit, AfterViewInit, OnChanges {
  newInstallmentPeriodEnd: BilingualText = new BilingualText();
  @Input() installmentDetails: InstallmentSummary;
  @Input() lang;

  @ViewChildren('canvas') private chartRef: QueryList<HTMLCanvasElement>;

  daysLeft;
  chartWindowList: Chart[] = [];
  data = [];
  doughnutChart: Chart;
  resizeWindowObservable$: Observable<Event>;
  resizeWindowSubscription$: Subscription;

  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.installmentDetails.currentValue) {
      this.installmentDetails = changes?.installmentDetails.currentValue;
      this.installmentDetails.schedule.forEach((value, i) => {
        if (value.status.english === 'Advance payment') {
          return;
        } else {
          this.newInstallmentPeriodEnd = this.installmentDetails.schedule[i].installmentMonth;
        }
      });
    }
  }
  ngOnInit(): void {
    if (this.installmentDetails) {
      this.daysLeft = moment(this.installmentDetails.nextInstallmentDate.gregorian).diff(new Date(), 'days');
      this.data = [
        {
          paid: this.installmentDetails.installmentAmountPaid,
          remaining: this.installmentDetails.installmentAmountRemaining,
          bgColor: 'rgb(95, 198, 122)'
        },
        {
          paid: this.installmentDetails.numberOfMonthsPaid,
          remaining: this.installmentDetails.numberOfMonthsRemaining,
          bgColor: 'rgb(14, 152, 171)'
        }
      ];
    }
  }

  /**
   * Calling the chart by using Native reference
   *
   */
  ngAfterViewInit() {
    this.callChart();
    this.resizeWindowObservable$ = fromEvent(window, 'resize');
    this.resizeWindowSubscription$ = this.resizeWindowObservable$.subscribe(() => {
      const dpr = window.devicePixelRatio || 1;
      if (dpr > 0.65 && dpr < 0.85) {
        for (let i = 0; i < this.chartWindowList.length; i++) {
          this.chartWindowList[i].canvas.setAttribute('style', 'display:block; width:auto; height:6.42rem');
        }
      }
      if (dpr > 0.85 && dpr < 2) {
        for (let i = 0; i < this.chartWindowList.length; i++) {
          this.chartWindowList[i].canvas.setAttribute('style', 'display:block; width:auto; height:6.35rem');
        }
      }
    });
  }
  callChart() {
    this.chartWindowList = [];
    if (this.chartRef) {
      this.chartRef.forEach((chartRef, index) => {
        if (this.chartWindowList.length <= 2) {
          this.chartWindowList.push(this.createChart(chartRef, this.data[index]));
          return false;
        }
      });
    }
  }
  /**
   * chart will be created
   */
  createChart(chartRef, data) {
    {
      return new Chart(chartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['', ''],
          datasets: [
            {
              backgroundColor: [data.bgColor],
              data: [data.paid, data.remaining],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutoutPercentage: 80,
          tooltips: {
            enabled: false
          },
          legend: {
            display: false
          }
        }
      });
    }
  }
}
