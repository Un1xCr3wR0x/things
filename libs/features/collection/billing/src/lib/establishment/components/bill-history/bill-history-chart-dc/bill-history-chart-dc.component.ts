import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Inject,
  SimpleChanges,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import Chart from 'chart.js';
import { BillHistory } from '../../../../shared/models';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/lib/pipes/bilingual-text.pipe';
@Component({
  selector: 'blg-bill-history-chart-dc',
  templateUrl: './bill-history-chart-dc.component.html',
  styleUrls: ['./bill-history-chart-dc.component.scss']
})
export class BillHistoryChartDcComponent implements OnInit, OnChanges, AfterViewInit {
  //-------- local variables ---------------------
  barChart: Chart;
  monthLabels = [];
  datasetLabels = [];
  data0 = [];
  data1 = [];
  data2 = [];
  data3 = [];
  data4 = [];
  data5 = [];
  data6 = [];
  lang = 'en';
  //-------- Input variables ---------------------
  @Input() billHistory: BillHistory[] = [];

  //-------- View Child ---------------------
  @ViewChild('barChart', { static: false }) private chartRef: ElementRef;

  constructor(
    readonly bilingualText: BilingualTextPipe,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  /* This method is to handle the value change for the variables */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.billHistory) {
      this.setLabels();
    }
  }

  ngOnInit(): void {}

  /* This method is to handle the language subscription */
  ngAfterViewInit() {
    this.language.subscribe(language => {
      this.lang = language;
      this.setLabels(); /* Charts will be recreated on language change */
    });
  }

  // This method will recreate chart
  setLabels() {
    this.monthLabels = [];
    this.datasetLabels = [];
    this.resetChartData();
    if (this.billHistory !== undefined) {
      this.billHistory.forEach(value => {
        this.monthLabels.push(this.bilingualText.transform(value.billPeriod));
      });

      for (const type of this.billHistory[0].breakUp) {
        this.datasetLabels.push(this.bilingualText.transform(type.type));
      }

      for (const data of this.billHistory) {
        this.data0.push(data.breakUp[0].amount);
        this.data1.push(data.breakUp[1].amount);
        this.data2.push(data.breakUp[2].amount);
        this.data3.push(data.breakUp[3].amount);
        this.data4.push(data.breakUp[4].amount);
        this.data5.push(data.breakUp[5].amount);
        this.data6.push(data.breakUp[6].amount);
      }
    }
    setTimeout(() => {
      this.barChart = this.createMonthlyChart();
    }, 1500);
  }

  /* This method is to reset the chart data array */
  resetChartData() {
    this.data0 = [];
    this.data1 = [];
    this.data2 = [];
    this.data3 = [];
    this.data4 = [];
    this.data5 = [];
    this.data6 = [];
  }
  /* This method is to handle the creation of chart with multiple month details */
  createMonthlyChart() {
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.chartRef) {
      return new Chart(this.chartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: this.monthLabels,
          datasets: [
            {
              label: this.datasetLabels[0],
              backgroundColor: '#006AA7',
              data: this.data0,
              maxBarThickness: 56,
              categoryPercentage: 0.4,
              barPercentage: 0.6
            },
            {
              label: this.datasetLabels[1],
              backgroundColor: '#801F8B',
              data: this.data1,
              maxBarThickness: 56,
              categoryPercentage: 0.4,
              barPercentage: 0.6
            },
            {
              label: this.datasetLabels[2],
              backgroundColor: '#FFA200',
              data: this.data2,
              maxBarThickness: 56,
              categoryPercentage: 0.4,
              barPercentage: 0.6
            },
            {
              label: this.datasetLabels[3],
              backgroundColor: '#2979ff',
              data: this.data3,
              maxBarThickness: 56,
              categoryPercentage: 0.4,
              barPercentage: 0.6
            },
            {
              label: this.datasetLabels[4],
              backgroundColor: '#f44336',
              data: this.data4,
              maxBarThickness: 56,
              categoryPercentage: 0.4,
              barPercentage: 0.6
            },
            {
              label: this.datasetLabels[5],
              backgroundColor: '#4caf50',
              data: this.data5,
              maxBarThickness: 56,
              categoryPercentage: 0.4,
              barPercentage: 0.6
            },
            {
              label: this.datasetLabels[6],
              backgroundColor: '#004d40',
              data: this.data6,
              maxBarThickness: 56,
              categoryPercentage: 0.4,
              barPercentage: 0.6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              fontSize: 10,
              fontStyle: 'bold'
            }
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                stacked: true,
                gridLines: {
                  display: true,
                  borderDash: [5, 5],
                  zeroLineBorderDash: [5, 5],
                  drawBorder: false
                }
              }
            ]
          }
        }
      });
    }
  }
}
