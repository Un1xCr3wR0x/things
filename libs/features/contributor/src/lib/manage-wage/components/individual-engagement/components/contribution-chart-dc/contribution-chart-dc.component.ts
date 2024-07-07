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
import Chart from 'chart.js';
import { LanguageToken, DropdownItem } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { SearchEngagementResponse } from '@gosi-ui/features/contributor/lib/shared/models';
import { ContributionBreakupsColorEnum } from '@gosi-ui/features/contributor/lib/shared/enums';

@Component({
  selector: 'cnt-contribution-chart-dc',
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
  tooltipTextValue: string;
  value = 0;
  lan: string;
  totalMonths: number;

  @Input() contributionBreakup = [];
  @Input() contributionValues: SearchEngagementResponse;
  @Input() actionDropDown: Array<DropdownItem>;
  @Input() lang: string;
  @Input() isVic?: boolean;
  @Input() vicContribution: number;
  @Input() engagements = false;
  @Output() switchView: EventEmitter<number> = new EventEmitter();
  @Output() navigateToProfilePage: EventEmitter<string> = new EventEmitter();
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  /* Chart reference */
  @ViewChild('contributionBreakupChart', { static: true })
  private contributionBreakupChartCanvas: ElementRef;
  remainingDays: number;
  vicDays: number;
  vicMonths: number;
  rpaMonths: number;
  rpaDays: number;
  vicContributionDays: number;
  contributorMonths: number;
  contributorDays: number;
  civilMonths: number;
  civilDays: number;
  militaryMonths: number;
  militaryDays: number;
  gccMonths: number;
  gccDays: number;
  lumpsumMonths: number;
  lumpsumDays: number;
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
      this.contributionValues = changes.contributionValues.currentValue;
      this.setChart();
    }
    if (changes && changes.vicContribution && changes.vicContribution.currentValue) {
      this.vicContribution = changes.vicContribution.currentValue;
      this.setChart();
    }
    if (changes && changes.lang && changes.lang.currentValue) {
      this.lan = changes.lang.currentValue;
      // if (this.lan === 'en') {
      //   this.centerTextValue = 'MONTHS';
      //   this.tooltipTextValue = ' Months';
      // } else {
      //   this.centerTextValue = 'شهرين';
      //   this.tooltipTextValue = ' شهر';
      // }
      this.setChart();
    }
  }

  navigateToProfile(value) {
    this.navigateToProfilePage.emit(value);
  }

  /** This method is to create chart data */
  setChart() {
    this.totalMonths = this.contributionValues?.overallContributionMonths;
    this.value = this.contributionValues?.overallContributionDays;
    // this.totalMonths =
    // this.contributionValues?.totalGosiContributionMonths +
    // this.vicContribution +
    // this.contributionValues?.totalCivilContributionMonths +
    // this.contributionValues?.totalMilitartContributionMonths +
    // this.contributionValues?.totalPpaGccContributionMonths +
    // this.contributionValues?.totalLumpSumsPaidMonths;

    // cnt months and days
    this.contributorMonths = this.contributionValues?.totalRegularContributionMonths;
    this.contributorDays = this.contributionValues?.totalRegularContributionDays;
    //  Vic Months and Days
    this.vicMonths = this.contributionValues?.totalVicContributionMonths; // VIC months
    this.vicDays = this.contributionValues?.totalVicContributionDays;
    this.vicContributionDays = 0;
    //  RPA Months and Days
    this.rpaMonths = this.contributionValues?.totalRPAContributionMonths; // Provided data
    this.rpaDays = 0;
    //  civil Months and Days
    this.civilMonths = this.contributionValues?.totalCivilContributionMonths;
    this.civilDays = this.contributionValues?.totalCivilContributionDays;
    // Military Months and Days
    this.militaryMonths = this.contributionValues?.totalMilitaryContributionMonths;
    this.militaryDays = this.contributionValues?.totalMilitaryContributionDays;
    //  GCC Months and Days
    this.gccMonths = this.contributionValues?.totalPpaGccContributionMonths;
    this.gccDays = this.contributionValues?.totalPpaGccContributionDays;
    //  Lumpsum Months and Days
    this.lumpsumMonths = this.contributionValues?.totalLumpSumsPaidMonths;
    this.lumpsumDays = this.contributionValues?.totalLumpSumsPaidDays;

    if (this.lan === 'en') {
      if (this.totalMonths > 1) {
        this.centerTextValue = ` ${this.totalMonths > 1 ? 'Months' : 'Month'} ${this.value} ${
          this.value > 1 ? 'Days' : 'Day'
        }`;
        this.tooltipTextValue = this.totalMonths > 1 ? 'Months' : 'Month';
      } else {
        this.centerTextValue = ` Month ${this.value} ${this.value > 1 ? 'Days' : 'Day'}`;
        this.tooltipTextValue = 'Month';
      }
    } else {
      if (this.totalMonths > 0) {
        if (this.totalMonths === 1) {
          this.centerTextValue = `شهر ${this.value} ${this.value > 1 ? 'أيام' : 'يوم'}`;
          this.tooltipTextValue = 'شهر';
        } else {
          this.centerTextValue = ` شهر ${this.value} ${this.value > 1 ? 'أيام' : 'يوم'}`;
          this.tooltipTextValue = 'أشهر';
        }
      } else {
        this.centerTextValue = `شهر ${this.value} ${this.value > 1 ? 'أيام' : 'يوم'}`;
        this.tooltipTextValue = 'شهر';
      }
    }
    this.contributionBreakupLabel = [];
    this.contributionBreakupData = [];
    this.contributionBreakupColor = [];
    // GOSI - Private Sector
    if (this.contributionValues?.totalRegularContributionMonths !== 0) {
      this.contributionBreakupData.push(this.contributionValues?.totalRegularContributionMonths);
      this.contributionBreakupLabel.push(this.lan === 'en' ? 'GOSI' : 'التأمينات');
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.gosi);
    }
    // if (this.contributionValues?.totalContributionDays !== 0) {
    //   this.contributionBreakupData.push(Math.floor(this.contributionValues?.totalContributionDays / 30));
    //   if (this.lan === 'en') {
    //     this.contributionBreakupLabel.push('Private Sector');
    //   } else {
    //     this.contributionBreakupLabel.push('قطاع خاص');
    //   }
    //   this.contributionBreakupColor.push(ContributionBreakupsColorEnum.gosi);
    // }

    if (this.contributionValues?.totalVicContributionMonths !== 0) {
      this.contributionBreakupData.push(this.contributionValues?.totalVicContributionMonths);
      if (this.lan === 'en') {
        this.contributionBreakupLabel.push('Voluntary Individual Contributor');
      } else {
        this.contributionBreakupLabel.push('اشتراك اختياري');
      }
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.vic);
    }

    //Aggregate contribution removed and PPA added

    // if (this.contributionValues?.totalRPAContributionMonths !== 0) {
    //   this.contributionBreakupData.push(this.contributionValues?.totalRPAContributionMonths);
    //   if (this.lan === 'en') {
    //     this.contributionBreakupLabel.push('Aggregate Contribution');
    //   } else {
    //     this.contributionBreakupLabel.push('تبادل المنافع');
    //   }
    //   this.contributionBreakupColor.push(ContributionBreakupsColorEnum.ppa);
    // }

    if (this.contributionValues?.totalCivilContributionMonths !== 0) {
      this.contributionBreakupData.push(this.contributionValues?.totalCivilContributionMonths);
      this.contributionBreakupLabel.push(this.lan === 'en' ? 'Civil' : 'مدني');
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.ppa_civil);
    }
    if (this.contributionValues?.totalMilitaryContributionMonths !== 0) {
      this.contributionBreakupData.push(this.contributionValues?.totalMilitaryContributionMonths);
      this.contributionBreakupLabel.push(this.lan === 'en' ? 'Military' : 'العسكرية');
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.ppa_military);
    }
    if (this.contributionValues?.totalPpaGccContributionMonths !== 0) {
      this.contributionBreakupData.push(this.contributionValues?.totalPpaGccContributionMonths);
      this.contributionBreakupLabel.push(this.lan === 'en' ? 'PPA GCC' : 'مد الحماية الخليجي');
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.ppa_gcc);
    }
    if (this.contributionValues?.totalLumpSumsPaidMonths !== 0) {
      this.contributionBreakupData.push(this.contributionValues?.totalLumpSumsPaidMonths);
      this.contributionBreakupLabel.push(this.lan === 'en' ? 'Paid to Contributor' : 'المدفوعة للمساهم');
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.paid);
    }
    if (this.totalMonths === 0) {
      this.contributionBreakupData = [];
      this.contributionBreakupColor = [];
      this.contributionBreakupLabel = [];
      this.contributionBreakupData.push(1);
      this.contributionBreakupColor.push(ContributionBreakupsColorEnum.no_months);
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
      // if(this.totalMonths == 0){
      //   this.contributionBreakupColor.push(ContributionBreakupsColorEnum.no_months);
      // }
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
        plugins: [this.getChartPlugins(this.centerTextValue, font, this.totalMonths)],
        options: {
          ...this.getChartOptionss(
            contributionLegend,
            true,
            this.lan,
            this.totalMonths,
            this.vicDays,
            this.vicMonths,
            this.civilMonths,
            this.civilDays,
            this.militaryMonths,
            this.militaryDays,
            this.gccMonths,
            this.gccDays,
            this.lumpsumMonths,
            this.lumpsumDays,
            this.rpaDays,
            this.rpaMonths,
            this.contributorMonths,
            this.contributorDays,
            this.value
          ),
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

  getChartOptionss(
    chartLegend,
    isToolTip = true,
    lang?: string,
    totalMonths?: number,
    vicDays?: number,
    vicMonths?: number,
    civilMonths?: number,
    civilDays?: number,
    militaryMonths?: number,
    militaryDays?: number,
    gccMonths?: number,
    gccDays?: number,
    lumpsumMonths?: number,
    lumpsumDays?: number,
    rpaDays?: number,
    rpaMonths?: number,
    contributorMonths?: number,
    contributorDays?: number,
    value?: number
  ) {
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
            yAlign: 'center',
            xAlign: lang === 'en' ? 'left' : 'right',
            rtl: lang === 'ar' ? true : false,
            backgroundColor: 'rgba(0, 0, 0)',
            callbacks: {
              label: function (tooltipItem, data) {
                let label = data.labels[tooltipItem.index] || '';
                if (label) {
                  label = ' ';
                  if (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) {
                    if (data.labels[tooltipItem.index] == 'GOSI' || data.labels[tooltipItem.index] == 'التأمينات') {
                      if (contributorMonths > 0 || contributorDays > 0) {
                        if (lang === 'en') {
                          label += `${contributorMonths} ${contributorMonths > 1 ? 'Months' : 'Month'} `;
                          if (contributorDays > 0) {
                            label += `${contributorDays} ${contributorDays > 1 ? 'Days' : 'Day'}`;
                          }
                        } else {
                          if (contributorDays > 0) {
                            label += `${contributorDays > 1 ? 'أيام' : 'يوم'}` + '\u200E' + ` ${contributorDays} `;
                          }
                          label += `${contributorMonths > 1 ? 'أشهر' : 'شهر'}` + '\u200E' + ` ${contributorMonths} `;
                        }
                      }
                    }
                    if (
                      data.labels[tooltipItem.index] == 'Voluntary Individual Contributor' ||
                      data.labels[tooltipItem.index] == 'اشتراك اختياري'
                    ) {
                      if (vicMonths > 0 || vicDays > 0) {
                        if (lang === 'en') {
                          label += `${vicMonths} ${vicMonths > 1 ? 'Months' : 'Month'} `;
                          if (vicDays > 0) {
                            label += `${vicDays} ${vicDays > 1 ? 'Days' : 'Day'}`;
                          }
                        } else {
                          if (vicDays > 0) {
                            label += `${vicDays > 1 ? 'أيام' : 'يوم'}` + '\u200E' + ` ${vicDays} `;
                          }
                          label += `${vicMonths > 1 ? 'أشهر' : 'شهر'}` + '\u200E' + ` ${vicMonths} `;
                        }
                      }
                    }
                    // if (
                    //   data.labels[tooltipItem.index] == 'Aggregate Contribution' ||
                    //   data.labels[tooltipItem.index] == 'تبادل المنافع'
                    // ) {
                    //   if (rpaMonths > 0 || rpaDays > 0) {
                    //     if (lang === 'en') {
                    //       label += `${rpaMonths} ${rpaMonths > 1 ? 'Months' : 'Month'} `;
                    //       if (rpaDays > 0) {
                    //         label += `${rpaDays} ${rpaDays > 1 ? 'Days' : 'Day'}`;
                    //       }
                    //     } else {
                    //       if (rpaDays > 0) {
                    //         label += `${rpaDays > 1 ? 'أيام' : 'يوم'}` + '\u200E' + ` ${rpaDays} `;
                    //       }
                    //       label += `${rpaMonths > 1 ? 'أشهر' : 'شهر'}` + '\u200E' + ` ${rpaMonths} `;
                    //     }
                    //   }
                    // }

                    if (data.labels[tooltipItem.index] == 'Civil' || data.labels[tooltipItem.index] == 'مدني') {
                      if (civilMonths > 0 || civilDays > 0) {
                        if (lang === 'en') {
                          label += `${civilMonths} ${civilMonths > 1 ? 'Months' : 'Month'} `;
                          if (civilDays > 0) {
                            label += `${civilDays} ${civilDays > 1 ? 'Days' : 'Day'}`;
                          }
                        } else {
                          if (civilDays > 0) {
                            label += `${civilDays > 1 ? 'أيام' : 'يوم'}` + '\u200E' + ` ${civilDays} `;
                          }
                          label += `${civilMonths > 1 ? 'أشهر' : 'شهر'}` + '\u200E' + ` ${civilMonths} `;
                        }
                      }
                    }

                    if (data.labels[tooltipItem.index] == 'Military' || data.labels[tooltipItem.index] == 'العسكرية') {
                      if (militaryMonths > 0 || militaryDays > 0) {
                        if (lang === 'en') {
                          label += `${militaryMonths} ${militaryMonths > 1 ? 'Months' : 'Month'} `;
                          if (militaryDays > 0) {
                            label += `${militaryDays} ${militaryDays > 1 ? 'Days' : 'Day'}`;
                          }
                        } else {
                          if (militaryDays > 0) {
                            label += `${militaryDays > 1 ? 'أيام' : 'يوم'}` + '\u200E' + ` ${militaryDays} `;
                          }
                          label += `${militaryMonths > 1 ? 'أشهر' : 'شهر'}` + '\u200E' + ` ${militaryMonths} `;
                        }
                      }
                    }

                    if (
                      data.labels[tooltipItem.index] == 'PPA GCC' ||
                      data.labels[tooltipItem.index] == 'مد الحماية الخليجي'
                    ) {
                      if (gccMonths > 0 || gccDays > 0) {
                        if (lang === 'en') {
                          label += `${gccMonths} ${gccMonths > 1 ? 'Months' : 'Month'} `;
                          if (gccDays > 0) {
                            label += `${gccDays} ${gccDays > 1 ? 'Days' : 'Day'}`;
                          }
                        } else {
                          if (gccDays > 0) {
                            label += `${gccDays > 1 ? 'أيام' : 'يوم'}` + '\u200E' + ` ${gccDays} `;
                          }
                          label += `${gccMonths > 1 ? 'أشهر' : 'شهر'}` + '\u200E' + ` ${gccMonths} `;
                        }
                      }
                    }

                    if (
                      data.labels[tooltipItem.index] == 'Paid to Contributor' ||
                      data.labels[tooltipItem.index] == 'المدفوعة للمساهم'
                    ) {
                      if (lumpsumMonths > 0 || lumpsumDays > 0) {
                        if (lang === 'en') {
                          label += `${lumpsumMonths} ${lumpsumMonths > 1 ? 'Months' : 'Month'} `;
                          if (lumpsumDays > 0) {
                            label += `${lumpsumDays} ${lumpsumDays > 1 ? 'Days' : 'Day'}`;
                          }
                        } else {
                          if (lumpsumDays > 0) {
                            label += `${lumpsumDays > 1 ? 'أيام' : 'يوم'}` + '\u200E' + ` ${lumpsumDays} `;
                          }
                          label += `${lumpsumMonths > 1 ? 'أشهر' : 'شهر'}` + '\u200E' + ` ${lumpsumMonths} `;
                        }
                      }
                    }
                  }
                  label += ' ';
                } else {
                  if (lang === 'en') {
                    label = ' 0 Months' + ` ${value} ` + `${value > 1 ? 'Days' : 'Day'} `;
                  } else {
                    label =
                      `${value > 1 ? 'أيام' : 'يوم'}` + '\u200E' + ` ${value} ` + '\u200E' + 'شهر' + '\u200E' + ' 0 ';
                  }
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

  getChartPlugins(centerText: string, font: string, totalAmt: number, isDecimalPoint = true) {
    return {
      beforeInit: this.getBeforeInitPlugin(),
      resize: this.getResizePlugin(),
      afterDraw: function (chart) {
        const dataSets = [];
        dataSets.push(chart.data.datasets[0].data);
        const totalAmount = totalAmt > 0 ? totalAmt : 0;
        const width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        const fontSize = (height / 300).toFixed(2);
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

  navigateTo() {
    this.navigate.emit();
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
