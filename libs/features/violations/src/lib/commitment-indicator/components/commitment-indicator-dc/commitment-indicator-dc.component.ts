import { Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { AlertService, BilingualText, LovList } from '@gosi-ui/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IndicatorsDateFilterConstants } from '../../constants/indicators-date-filter'
import { IndicatorsBreakupsColorsEnum } from '../../enums/indicators-breakups-colors-enum'
import { IndicatorsService } from '../../services/indicators.service';
import { Indicators } from '../../models/commitment-indicators-response';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'vol-commitment-indicator-dc',
  templateUrl: './commitment-indicator-dc.component.html',
  styleUrls: ['./commitment-indicator-dc.component.scss']
})
export class CommitmentIndicatorDcComponent implements OnInit, OnChanges, OnDestroy {

  commitmentIndicatorsBreakupInit: Chart;
  commitmentIndicatorsBreakupLabel: number[] = [];
  commitmentIndicatorsBreakupLegends: BilingualText[] = [];
  commitmentIndicatorsData: number[] = [];
  indicatorsApiCallResponse = []
  commitmentIndicatorsBreakupColor = Object.values(IndicatorsBreakupsColorsEnum);
  monthsList: LovList;
  yearsList: LovList;
  indicatorList: LovList;
  monthsForm: FormGroup;
  yearsForm: FormGroup;
  indicatorForm: FormGroup;
  indicatorPercentageForm: FormControl = new FormControl();
  currentDate = new Date();
  lastUpdateMonth: string;
  lastUpdateYear: number;
  nextMonthUpdate: string;
  currentYear: number = this.currentDate.getFullYear();
  nextYearUpdate: number;
  response: Indicators;
  totalCommitment: number;
  monthParameter: number = this.currentDate.getMonth()+1;
  yearParameter: number;
  indicatorCalculationsEnglish: string[] = [];
  indicatorCalculationsArabic: string[] = [];
  indicatorPercentage: number = 30;
  @Input() lang: string;
  @Input() regiterationNo: number;
  @ViewChild('commitmentIndicatorsBreakup', { static: true })
  private commitmentIndicatorsBreakupCanvas: ElementRef;

  constructor(private formBuilder: FormBuilder,
    readonly alertService: AlertService,
    readonly indicatorsService: IndicatorsService) { }

  ngOnDestroy(): void {
    this.alertService.clearAlerts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.lang && changes.lang.currentValue) {
      this.lang = changes.lang.currentValue;
      this.drawIndicatorsBreakupChart();
      this.setReminderText();
    }
  }

  ngOnInit(): void {
    this.indicatorList = new LovList(IndicatorsDateFilterConstants.INDICATORS_LIST.filter(
      item => item.sequence !== 6
    ));
    if (this.currentDate.getDate() >= 17) {
      this.monthParameter = this.currentDate.getMonth() + 1;
      this.yearParameter = this.currentYear;
    } else {
      if ((this.currentDate.getMonth() + 1) == 1) {
        this.monthParameter = 12;
        this.yearParameter = this.currentYear - 1;
      } else {
        this.monthParameter = this.currentDate.getMonth();
        this.yearParameter = this.currentYear;
      }
    }
    this.yearsForm = this.createCommitmentIndicatorsFormYears();
    this.monthsForm = this.createCommitmentIndicatorsFormMonths();
    this.indicatorForm = this.createCommitmentIndicatorsForm();
    this.yearsList = this.setYearsOfIndicatorsFilterByDate();
    this.monthsList = this.setMonthssOfIndicatorsFilterByDate();
    this.indicatorList.items.forEach(indicator => {
      this.commitmentIndicatorsBreakupLegends.push(indicator.value);
    });
    this.setReminderText();
    this.alertService.clearAlerts();
    this.getIndicatorsBreakupChart(this.regiterationNo, this.yearParameter, this.monthParameter);
    this.displySelectedIndicatorCalculation(IndicatorsDateFilterConstants.INDICATORS_LIST[1].value.english);
  }

  drawIndicatorsBreakupChart() {
    this.destroyChart();
    this.commitmentIndicatorsBreakupInit = new Chart(this.commitmentIndicatorsBreakupCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.commitmentIndicatorsData,
            backgroundColor: this.commitmentIndicatorsBreakupColor,
            borderWidth: 0
          }
        ],
        labels: this.commitmentIndicatorsBreakupLabel
      },
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: (tooltipText, data) => {
              return this.lang == 'en' ? `${data['datasets'][0]['data'][tooltipText['index']]}% OUT OF ${data['labels'][tooltipText['index']]}%` :
                `${data['datasets'][0]['data'][tooltipText['index']]}% من ${data['labels'][tooltipText['index']]}%`
            }
          }
        },
        layout: {
          padding: {
            top: 25,
            bottom: 25,
            left: 35,
            right: 35
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        cutoutPercentage: 55
      },
      plugins: [
        this.drawIndicatorsDataLines(),
        this.getSizePlugin()
      ]
    }
    );
  }
  drawIndicatorsDataLines() {
    return {
      afterDraw: (chart, args, options) => {
        const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;

        chart.data.datasets.forEach((dataset, index) => {
          chart.getDatasetMeta(index).data.forEach((datapoint, i) => {
            const { x, y } = datapoint.tooltipPosition();

            const xCenter = datapoint._model.x;
            const yCenter = datapoint._model.y;
            const width = datapoint._chart.width;
            const height = datapoint._chart.height;

            //center text
            //commitment text
            ctx.beginPath();
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center'
            ctx.font = 'lighter ' + (height / 300).toFixed(2) + 'em Roboto';
            ctx.fillStyle = '#999997';
            const centerText = this.lang == 'en' ? 'Total Commitment' : 'مجموع الالتزام';
            ctx.fillText(centerText, xCenter, height / 1.7);
            //current month text
            ctx.beginPath();
            IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS.forEach(month => {
              if (month.value.english == this.monthsForm.value.english) {
                const centerTextMonth = this.lang == 'en' ? `${month.value.english}`
                  : `${month.value.arabic}`;
                ctx.font = 'normal ' + (height / 300).toFixed(2) + 'em Roboto';
                ctx.fillText(centerTextMonth, xCenter, height / 1.9);
              }
            });
            //total percentages
            ctx.beginPath();
            const dataSets = [];
            dataSets.push(chart.data.datasets[0].data);
            // const totalCommitment = dataSets[0].reduce((a, b) => a + b, 0);
            ctx.font = (height / 160).toFixed(2) + 'em Roboto';
            ctx.fillStyle = '#666666';
            ctx.fillText(`${this.totalCommitment}%`, xCenter, height / 2.4);

            if (dataset.data[i] !== 0) {
              //drwa line
              const xDisplacement = datapoint._model.innerRadius / 4;
              const yDisplacement = datapoint._model.innerRadius / 4;
              const xStart = x >= xCenter ? x + xDisplacement : x - xDisplacement;
              const yStart = y >= yCenter ? y + yDisplacement : y - yDisplacement;
              const xEnd = x >= xCenter ? xStart + 15 : xStart - 15;
              const yEnd = y >= yCenter ? yStart + 15 : yStart - 15;
              const dataLine = x >= xCenter ? 35 : -35;

              ctx.beginPath();
              ctx.moveTo(xStart, yStart);
              ctx.lineTo(xEnd, yEnd);
              ctx.lineTo(xEnd + dataLine, yEnd);
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = '#000';
              ctx.stroke();

              //circles
              ctx.beginPath();
              ctx.arc(xStart, yStart, 7, 0, 2 * Math.PI, false);
              ctx.fillStyle = datapoint._model.backgroundColor;
              ctx.fill();
              ctx.lineWidth = 3;
              ctx.strokeStyle = 'white';
              ctx.stroke();

              //percentages
              const textWidth = ctx.measureText(chart.data.labels[i]).width;
              ctx.font = (height / 210).toFixed(2) + 'em Roboto';
              // ctx.font = '15px Roboto';

              // position
              // const textXPosition = x >= halfWidth ? 'left' : 'right';
              const plusPxs = xEnd >= xCenter ? 21 : -20;
              ctx.textAlign = 'top';
              ctx.fillStyle = '#000';
              ctx.fillText(`${dataset.data[i]}%`, xEnd + plusPxs, yEnd - 7);
            }
          })
        })
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
  createCommitmentIndicatorsFormMonths() {
    return this.formBuilder.group({
      english: IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[this.monthParameter - 1].value.english,
      arabic: IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[this.monthParameter - 1].value.arabic
    });
  }

  createCommitmentIndicatorsFormYears() {
    return this.formBuilder.group({
      english: this.yearParameter,
      arabic: this.yearParameter
    });
  }

  createCommitmentIndicatorsForm() {
    return this.formBuilder.group({
      english: IndicatorsDateFilterConstants.INDICATORS_LIST[1].value.english,
      arabic: IndicatorsDateFilterConstants.INDICATORS_LIST[1].value.arabic
    });
  }

  setMonthssOfIndicatorsFilterByDate() {
    const currentMonth = this.currentDate.getMonth() + 1;
    if (this.currentDate.getDate() >= 17) {
      return new LovList(IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS.filter(month => month.sequence <= currentMonth));
    } else {
      return new LovList(IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS.filter(month => month.sequence < currentMonth));
    }
  }

  setYearsOfIndicatorsFilterByDate() {
    let listOfYears = []
    let sequence = 1;
    const minYear = 2024
    for (let i = minYear; i <= this.currentYear; i++) {
      let lovObjYear = {
        value: { english: i, arabic: i },
        sequence: sequence
      }
      sequence++;
      listOfYears.push(lovObjYear)
    };
    return new LovList(listOfYears);
  }

  selectedMonth(event) {
    IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS.forEach(val => {
      if (val.value.english == event) {
        this.monthParameter = val.sequence
      }
    });
    this.getIndicatorsBreakupChart(this.regiterationNo, this.yearParameter, this.monthParameter);
  }

  selectedYear(event) {
    this.yearParameter = event
    this.getIndicatorsBreakupChart(this.regiterationNo, this.yearParameter, this.monthParameter);
  }

  selectedIndicator(event) {
    this.displySelectedIndicatorCalculation(event);
  }

  displySelectedIndicatorCalculation(indicatorName: string) {
    if (this.indicatorCalculationsEnglish.length > 0 && this.indicatorCalculationsArabic.length > 0) {
      this.indicatorCalculationsEnglish = [];
      this.indicatorCalculationsArabic = [];
    }
    IndicatorsDateFilterConstants.INDICATORS_CALCULATIONS.forEach(indicator => {
      if (indicatorName === indicator.indicator) {
        this.indicatorCalculationsEnglish = indicator.describtion.english.split(".");
        this.indicatorCalculationsArabic = indicator.describtion.arabic.split(".");
      }
    });
    this.indicatorsApiCallResponse.forEach(indicator => {
      if (indicatorName == indicator.value.english) this.indicatorPercentage = indicator.reference
    });
  }

  setReminderText() {
    this.lastUpdateMonth = this.lang == 'en' ? IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[this.monthParameter - 1].value.english :
      IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[this.monthParameter - 1].value.arabic;
    this.lastUpdateYear = this.currentDate.getMonth() == 0 && this.currentDate.getDate() < 17 ? this.currentYear - 1 : this.currentYear;
    this.nextYearUpdate = this.currentDate.getMonth() == 11 ? this.currentYear + 1 : this.currentYear;
    if (this.currentDate.getDate() >= 17) {
      if (this.currentDate.getMonth() == 11) {
        this.nextMonthUpdate = this.lang == 'en' ? IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[0].value.english :
          IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[0].value.arabic;
      } else {
        this.nextMonthUpdate = this.lang == 'en' ? IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[this.currentDate.getMonth() + 1].value.english :
          IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[this.currentDate.getMonth() + 1].value.arabic;
      }
    } else {
      this.nextMonthUpdate = this.lang == 'en' ? IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[this.currentDate.getMonth()].value.english :
        IndicatorsDateFilterConstants.DATE_FILTER_FOR_INDICATORS[this.currentDate.getMonth()].value.arabic;
    }
  }

  destroyChart() {
    if (typeof this.commitmentIndicatorsBreakupInit != 'undefined') this.commitmentIndicatorsBreakupInit.destroy();
  }

  getIndicatorsBreakupChart(regNo: number, year: number, month: number) {
    if (this.indicatorsApiCallResponse.length > 0) {
      this.indicatorsApiCallResponse = [];
      this.commitmentIndicatorsData = []
    }
    this.indicatorsService.getEstablishmentIndicators(regNo, year, month).subscribe((res) => {
      if (res && Object.keys(res).length !== 0) {
        this.response = res;
        this.totalCommitment = this.response.COMPOUND_VALUE_1;
        this.response.CMP_VALUE = (this.response.CMP_VALUE * this.response.CMP_PERCENTAGE_RF) / 100;
        this.response.BILL_VALUE = (this.response.BILL_VALUE * this.response.BILL_PERCENTAGE_RF) / 100;
        this.response.VIOLATIONID_COUNT = (this.response.VIOLATIONID_COUNT * this.response.VIOLATIONID_PERCENTAGE_RF) / 100;
        this.response.OH_PERCENTAGE = (this.response.OH_PERCENTAGE * this.response.OH_PERCENTAGE_RF) / 100;
        this.response.CERTIFICATE_ELIGIBILITY = (this.response.CERTIFICATE_ELIGIBILITY * this.response.CERTIFICATE_ELIGIBILITY_PERCENTAGE_RF) / 100;
        this.indicatorsApiCallResponse.push(
          {
            value: { english: 'WPS', arabic: 'التزام حماية الأجور' },
            reference: this.response.CMP_PERCENTAGE_RF,
            percentage: this.response.CMP_VALUE
          },
          {
            value: { english: 'Payments', arabic: 'سداد التأمينات' },
            reference: this.response.BILL_PERCENTAGE_RF,
            percentage: this.response.BILL_VALUE
          },
          {
            value: { english: 'Violations', arabic: 'المخالفات' },
            reference: this.response.VIOLATIONID_PERCENTAGE_RF,
            percentage: this.response.VIOLATIONID_COUNT
          },
          {
            value: { english: 'OH & Safety', arabic: 'السلامة والصحة المهنية' },
            reference: this.response.OH_PERCENTAGE_RF,
            percentage: this.response.OH_PERCENTAGE
          },
          {
            value: { english: 'Certificate Eligibilty', arabic: 'أهلية الشهادة' },
            reference: this.response.CERTIFICATE_ELIGIBILITY_PERCENTAGE_RF,
            percentage: this.response.CERTIFICATE_ELIGIBILITY
          });
        this.indicatorsApiCallResponse.forEach(indicator => {
          this.commitmentIndicatorsData.push(indicator.percentage);
          this.commitmentIndicatorsBreakupLabel.push(indicator.reference);
        });
        this.drawIndicatorsBreakupChart();
      } else {
        this.alertService.showWarningByKey('VIOLATIONS.COMPLIANCE-INDICATOR-ERROR-MESSAGE', null, null, null, true);
      }
    }
      , () => {
        this.alertService.showErrorByKey('VIOLATIONS.COMPLIANCE-INDICATOR-ERROR-ALERT', null, null, null, true);
      });
  }
}
