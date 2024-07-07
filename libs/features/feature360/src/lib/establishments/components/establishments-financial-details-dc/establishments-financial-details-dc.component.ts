import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { Chart } from 'chart.js';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BilingualText, getChartOptions, getChartPlugin } from '@gosi-ui/core';
import { GetCntLastPaidInf } from '../../../models/establishments/get-cnt-last-paid-inf';
import { GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths } from '../../../models/establishments/get-cnt-total-installment-amount-and-number-of-installment-months';
import { GetCntUnPaidViolation } from '../../../models/establishments/get-cnt-un-paid-violation';
import { GetCntClosingCredit } from '../../../models/establishments/get-cnt-closing-credit';
import { GetCntClosingDebit } from '../../../models/establishments/get-cnt-closing-debit';
import { GetCntPaymentPeriod } from '../../../models/establishments/get-cnt-payment-period';
import { GetCntLastMonthContribution } from '../../../models/establishments/get-cnt-last-month-contribution';
import { GetCntLastMonthPenalty } from '../../../models/establishments/get-cnt-last-month-penalty';
import { CreditBalanceDetails } from '../../../models/establishments/credit-balance-details';

@Component({
  selector: 'fea-establishments-financial-details',
  templateUrl: './establishments-financial-details-dc.component.html',
  styleUrls: ['./establishments-financial-details-dc.component.scss']
})
export class EstablishmentsFinancialDetailsComponent implements OnInit, OnChanges {
  /* Local variables. */
  contributionBreakupChartFinancialInit: Chart;
  lang = 'en';
  contributionBreakupFinancialLabel = [];
  contributionBreakupFianancialData = [];
  contributionBreakupFinancialColor = [];
  centerText = 'SAR';
  paymentStatus = 0;

  @Input() cntLastPaidInf: GetCntLastPaidInf;
  @Input()
  cntTotalInstallmentAmountAndNumberOfInstallmentMonths: GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths;

  @Input() cntUnPaidViolation: GetCntUnPaidViolation;
  @Input() cntClosingCredit: GetCntClosingCredit;
  @Input() cntClosingDebit: GetCntClosingDebit;
  @Input() cntPaymentPeriod: GetCntPaymentPeriod;
  @Input() cntLastMonthContribution: GetCntLastMonthContribution;
  @Input() cntLastMonthPenalty: GetCntLastMonthPenalty;
  //
  @Input() creditBalanceDetails: CreditBalanceDetails;

  @ViewChild('contributionBreakupChart', { static: true })
  private contributionBreakupChartCanvas: ElementRef;

  constructor(readonly bilingualText: BilingualTextPipe) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.paymentStatus = this.cntClosingCredit?.closingcredit - this.cntClosingDebit?.totaldebit;
      if (!this.paymentStatus) {
        this.paymentStatus = 0;
      }
      this.setChartData();
    }
  }

  /** This method is to create chart data */
  setChartData() {
    this.contributionBreakupFianancialData = [];
    this.contributionBreakupFinancialLabel = [];
    this.contributionBreakupFinancialColor = [];

    this.contributionBreakupFianancialData.push(this.cntLastMonthPenalty?.penalty || 0);
    this.contributionBreakupFianancialData.push(this.cntLastMonthContribution?.contribution || 0);
    this.contributionBreakupFinancialLabel.push('FEATURE360.ESTABLISHMENTS.CHART-LATE-FINES');
    this.contributionBreakupFinancialLabel.push('FEATURE360.ESTABLISHMENTS.CHART-CONTRIBUTION');
    this.contributionBreakupFinancialColor.push('#5FC67A');
    this.contributionBreakupFinancialColor.push('#0E98AB');

    this.drawContributionBreakupChart();
  }

  /** This method is to draw Contribution Breakup Chart */
  drawContributionBreakupChart() {
    if (this.contributionBreakupChartFinancialInit) {
      this.contributionBreakupChartFinancialInit.destroy();
    }
    if (this.contributionBreakupChartCanvas) {
      const contributionLegend = this.contributionBreakupFinancialLabel;

      let font = '';

      if (this.lang === 'en') {
        font = 'Roboto';
      } else if (this.lang === 'ar') {
        font = 'Noto Kufi Arabic ,Roboto';
      }

      const text = new BilingualText();
      text.english = '';
      text.arabic = '';

      this.contributionBreakupChartFinancialInit = new Chart(this.contributionBreakupChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.contributionBreakupFianancialData,
              backgroundColor: this.contributionBreakupFinancialColor,
              hoverBackgroundColor: this.contributionBreakupFinancialColor,
              borderWidth: 0
            }
          ],

          labels: this.contributionBreakupFinancialLabel
        },
        plugins: [getChartPlugin(this.centerText, font)],
        options: {
          ...getChartOptions(contributionLegend, text, this.lang),
          tooltips: {
            xAlign: 'center',
            yAlign: 'bottom'
          }
        }
      });
    }
  }
}
