import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, LovList } from '@gosi-ui/core';
import { Chart } from 'chart.js';
import { IndicatorsDateFilterConstants } from '../../constants/indicators-date-filter';
import { IndicatorsService } from '../../services/indicators.service';
import { Indicators } from '../../models/commitment-indicators-response';
@Component({
  selector: 'vol-commitment-indicator-history-dc',
  templateUrl: './commitment-indicator-history-dc.component.html',
  styleUrls: ['./commitment-indicator-history-dc.component.scss']
})
export class CommitmentIndicatorHistoryDcComponent implements OnInit, OnChanges, OnDestroy {

  commitmentIndicatorsLineChartInit: Chart;
  indicatorList: LovList = new LovList(IndicatorsDateFilterConstants.INDICATORS_LIST);
  indicatorForm: FormGroup = this.createCommitmentIndicatorsForm();
  yearsList: LovList;
  yearsForm: FormGroup;
  currentDate = new Date();
  commitmentIndicatorsYAxisData: string[] = [];
  commitmentIndicatorsXAxisData: number[] = [];
  indicatorsColorsLis = IndicatorsDateFilterConstants.INDICATORS_DETAILS_LIST;
  backgroundColor: string = null;
  isRightToLeft: boolean = false;
  response: Indicators[];
  yearParameter: number = this.currentDate.getFullYear();
  indicatorsApiCallResponse = [];
  maxTicks = 30;
  stepSizeTicks = 10;
  @ViewChild('commitmentIndicatorsLineChart', { static: true })
  private commitmentIndicatorsLineChartCanvas: ElementRef;
  @Input() lang: string;
  @Input() regiterationNo: number;
  constructor(private formBuilder: FormBuilder,
    readonly indicatorsService: IndicatorsService,
    readonly alertService: AlertService) { }

  ngOnDestroy(): void {
    this.alertService.clearAlerts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.lang && changes.lang.currentValue) {
      this.lang = changes.lang.currentValue;
      this.isRightToLeft = this.lang == 'en' ? false : true;
      this.setCommitmentIndicatorsChartLineXAxisLabels();
      this.drawComplianceIndicatorHistoryChart();
    }
  }

  ngOnInit(): void {
    this.yearsForm = this.createCommitmentIndicatorsFormYears();
    this.yearsList = this.setYearsOfIndicatorsFilterByDate();
    this.isRightToLeft = this.lang == 'en' ? false : true;
    this.setCommitmentIndicatorsChartLineXAxisLabels();
    this.alertService.clearAlerts();
    this.getEstablishmentIndicatorsHistory(this.regiterationNo, this.yearParameter);
  }

  drawComplianceIndicatorHistoryChart() {
    this.destroyChart();
    this.commitmentIndicatorsLineChartInit = new Chart(this.commitmentIndicatorsLineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            data: this.commitmentIndicatorsXAxisData,
            backgroundColor: this.backgroundColor,
            borderColor: this.backgroundColor,
            fill: false,
            borderWidth: 2
          }
        ],
        labels: this.commitmentIndicatorsYAxisData
      },
      options: {
        tooltips: {
          callbacks:
            this.setAllIndicatorsTooltip()
        },
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                reverse: this.isRightToLeft ? true : false
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                borderDash: [8, 4],
                zeroLineBorderDash: [8, 4],
                drawBorder: false,
              },
              ticks: {
                beginAtZero: true,
                stepSize: this.stepSizeTicks,
                min: 0,
                max: this.maxTicks,
                padding: 15
              },
              position: this.isRightToLeft ? 'right' : 'left',
            },
          ]
        },
      },
      plugins: [
        this.drawIndicatorHistoryLineChartDataPoints(),
      ]
    });
  }
  drawIndicatorHistoryLineChartDataPoints() {
    return {
      afterDatasetsDraw: (chart, args, options) => {
        const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
        chart.data.datasets.forEach((dataset, index) => {
          chart.getDatasetMeta(index).data.forEach((datapoint, i) => {
            const { x, y } = datapoint.tooltipPosition();

            // position of prcentages points labels
            let yDisplacement = dataset.data[i] <= (datapoint._yScale.max / 2) ? y - 7 : y + 15;
            let xDisplacement;
            // const xDisplacement = (dataset.data[i] == Math.floor(dataset.data[i]) && dataset.data[i] < 10 ) ? x - 3 :x - 8 ;
            if (this.lang == 'en') {
              xDisplacement = (dataset.data[i] == Math.floor(dataset.data[i]) && dataset.data[i] < 10) ? x - 3 : x - 8;
            } else {
              xDisplacement = (dataset.data[i] == Math.floor(dataset.data[i]) && dataset.data[i] < 10) ? x + 10 : x + 15;
            }
            ctx.font = '0.9em Roboto';
            ctx.textAlign = 'top';
            ctx.fillStyle = '#000';
            // ctx.fillStyle = dataset.backgroundColor;
            ctx.fillText(`${dataset.data[i]}%`, xDisplacement, yDisplacement);
          })
        })
      }
    }
  }

  setAllIndicatorsTooltip() {
    if (this.indicatorForm.value.english == 'All Indicators') {
      return {
        title: () => {
          return '';
        },
        label: (tooltipText) => {
          const totalReference = 100;
          return this.lang == 'en' ? `${tooltipText['value']}% OUT OF ${totalReference}% ` :
            `${tooltipText['value']}% من ${totalReference}% `
        },
        beforeFooter: () => {
          return this.lang == 'en' ? "Indicator Calculations : " : "المؤشرات : "
        },
        footer: () => {
          let footer = '';
          IndicatorsDateFilterConstants.INDICATORS_DETAILS_LIST.forEach(indicatorName => {
            if (indicatorName.indicator.english !== 'All Indicators') {
              footer += this.lang == 'en' ? `${indicatorName.indicator.english} ${indicatorName.percentage}%\n` :
                `${indicatorName.indicator.arabic} ${indicatorName.percentage}%\n`
            }
          });
          return footer
        },
        footerAlign: () => {
          return this.isRightToLeft ? 'right' : 'left'
        }
      }
    } else {
      return {
        title: () => {
          return '';
        },
        label: (tooltipText) => {
          let label = null
          this.indicatorsApiCallResponse.forEach(indicator => {
            if (indicator.name == this.indicatorForm.value.english) {
              this.lang == 'en' ? label = `${tooltipText['value']}% OUT OF ${indicator.reference}% ` :
                label = `${tooltipText['value']}% من ${indicator.reference}% `
            }
          });
          return label
        }
      }
    }
  }

  getSizePlugin() {
    return {
      beforeInit: this.getResizePlugin(),
      resize: this.getResizePlugin()
    }
  }
  getResizePlugin() {
    return function (chart) {
      const dpr = window.devicePixelRatio || 1;
      chart.canvas.setAttribute('style', 'display:block; width:auto; height:' + 20 + 'rem;');
    }
  }
  setBackgroundColor() {
    this.indicatorsColorsLis.filter(color => {
      if (this.indicatorForm.value.english == color.indicator.english) {
        this.backgroundColor = color.color;
      }
    });
  }
  createCommitmentIndicatorsFormYears() {
    return this.formBuilder.group({
      english: [this.currentDate.getFullYear(), { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }

  createCommitmentIndicatorsForm() {
    return this.formBuilder.group({
      english: IndicatorsDateFilterConstants.INDICATORS_LIST[0].value.english,
      arabic: IndicatorsDateFilterConstants.INDICATORS_LIST[0].value.arabic
    });
  }

  setYearsOfIndicatorsFilterByDate() {
    let listOfYears = []
    let sequence = 1;
    const minYear = 2024
    for (let i = minYear; i <= this.currentDate.getFullYear(); i++) {
      let lovObjYear = { value: { english: i, arabic: i }, sequence: sequence }
      sequence++;
      listOfYears.push(lovObjYear)
    };
    return new LovList(listOfYears);
  }

  selectedYear(event) {
    this.yearParameter = event;
    this.getEstablishmentIndicatorsHistory(this.regiterationNo, this.yearParameter);
  }

  selectedIndicator(event) {
    this.setCommitmentIndicatorsChartLineXAxisData(event);
    this.setBackgroundColor();
    this.drawComplianceIndicatorHistoryChart();
  }

  destroyChart() {
    if (typeof this.commitmentIndicatorsLineChartInit != 'undefined') this.commitmentIndicatorsLineChartInit.destroy();
  }

  setCommitmentIndicatorsChartLineXAxisData(indicatorName: string) {
    if (this.commitmentIndicatorsXAxisData.length > 0) this.commitmentIndicatorsXAxisData = []
    if (indicatorName == 'All Indicators') {
      this.response.forEach(indicators => {
        this.commitmentIndicatorsXAxisData.push(indicators.COMPOUND_VALUE_1)
      });
      this.stepSizeTicks = 20;
      this.maxTicks = 100;
    }
    else {
      this.indicatorsApiCallResponse.forEach(indicator => {
        if (indicator.name == indicatorName) {
          this.commitmentIndicatorsXAxisData.push(indicator.percentage)
        }
      });
      this.stepSizeTicks = 10;
      this.maxTicks = 30;
    }
  }

  setCommitmentIndicatorsChartLineXAxisLabels() {
    if (this.commitmentIndicatorsYAxisData.length > 0) this.commitmentIndicatorsYAxisData = []
    IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS.forEach(label => {
      this.lang == 'en' ? this.commitmentIndicatorsYAxisData.push(label.value.english) :
        this.commitmentIndicatorsYAxisData.push(label.value.arabic);
    });
  }

  getEstablishmentIndicatorsHistory(regNo: number, year: number) {
    this.indicatorsService.getEstablishmentIndicatorsHistory(regNo, year).subscribe(list => {
      if (list && list.length !== 0) {
        this.response = list;
        this.response.forEach(indicator => {
          indicator.CMP_VALUE = (indicator.CMP_VALUE * indicator.CMP_PERCENTAGE_RF) / 100;
          indicator.BILL_VALUE = (indicator.BILL_VALUE * indicator.BILL_PERCENTAGE_RF) / 100;
          indicator.VIOLATIONID_COUNT = (indicator.VIOLATIONID_COUNT * indicator.VIOLATIONID_PERCENTAGE_RF) / 100;
          indicator.OH_PERCENTAGE = (indicator.OH_PERCENTAGE * indicator.OH_PERCENTAGE_RF) / 100;
          indicator.CERTIFICATE_ELIGIBILITY = (indicator.CERTIFICATE_ELIGIBILITY * indicator.CERTIFICATE_ELIGIBILITY_PERCENTAGE_RF) / 100;
          indicator.CREATION_DATE = ((new Date(indicator.CREATION_DATE).getMonth()) + 1).toString();
        });
        this.response.forEach(indicator => {
          this.indicatorsApiCallResponse.push(
            {
              name: 'WPS',
              reference: indicator.CMP_PERCENTAGE_RF,
              percentage: indicator.CMP_VALUE,
              month: indicator.CREATION_DATE
            },
            {
              name: 'Payments',
              reference: indicator.BILL_PERCENTAGE_RF,
              percentage: indicator.BILL_VALUE,
              month: indicator.CREATION_DATE
            },
            {
              name: 'Violations',
              reference: indicator.VIOLATIONID_PERCENTAGE_RF,
              percentage: indicator.VIOLATIONID_COUNT,
              month: indicator.CREATION_DATE
            },
            {
              name: 'OH & Safety',
              reference: indicator.OH_PERCENTAGE_RF,
              percentage: indicator.OH_PERCENTAGE,
              month: indicator.CREATION_DATE
            },
            {
              name: 'Certificate Eligibilty',
              reference: indicator.CERTIFICATE_ELIGIBILITY_PERCENTAGE_RF,
              percentage: indicator.CERTIFICATE_ELIGIBILITY,
              month: indicator.CREATION_DATE
            });
        });
        this.selectedIndicator(this.indicatorForm.value.english);
      } else {
        this.alertService.showWarningByKey('VIOLATIONS.COMPLIANCE-INDICATOR-ERROR-MESSAGE', null, null, null, true);
      }
    }
      , () => {
        this.alertService.showErrorByKey('VIOLATIONS.COMPLIANCE-INDICATOR-ERROR-ALERT', null, null, null, true);
      });
  }

}
