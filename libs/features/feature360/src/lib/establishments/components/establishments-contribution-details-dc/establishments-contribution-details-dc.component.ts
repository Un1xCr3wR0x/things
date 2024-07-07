import { Chart } from 'chart.js';
import { Component, ElementRef, Input, OnInit, ViewChild, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { BilingualText, getChartPlugin, getChartOptions, LanguageToken } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';

import { Contributors } from '../../../models/establishments/contributors';
import { LastWageYear } from '../../../models/establishments/last-wage-year';
import { CountedEmployeesNitaqat } from '../../../models/establishments/counted-employees-nitaqat';
import { UnCountedEmployeesNitaqat } from '../../../models/establishments/un-counted-employees-nitaqat';
import { BehaviorSubject } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

/* Global variables. */
const NON_SAUDI = 'NON SAUDI';
const SAUDI = 'SAUDI';
const NON_SAUDI_WAITING = 'NON SAUDI WAITING';

@Component({
  selector: 'fea-establishments-contribution-details',
  templateUrl: './establishments-contribution-details-dc.component.html',
  styleUrls: ['./establishments-contribution-details-dc.component.scss']
})
export class EstablishmentsContributionDetailsComponent implements OnInit, OnChanges {
  /* Local variables. */
  contributionBreakupChartInit: Chart;
  lang = 'en';
  contributionBreakupLabel = [];
  contributionBreakupData = [];
  contributionBreakupColor = [];
  centerText: string;
  nonSaudiContributors = 0;
  saudiContributors = 0;
  nonSaudiWaitingContributors = 0;

  @Input() contributorDetails: Contributors[] = [];
  @Input() lastWageYearDetails: LastWageYear;
  @Input() countedEmployeesNitaqat: CountedEmployeesNitaqat;
  @Input() unCountedEmployeesNitaqat: UnCountedEmployeesNitaqat;

  @ViewChild('contributionBreakupChart', { static: true })
  private contributionBreakupChartCanvas: ElementRef;

  constructor(
    readonly bilingualText: BilingualTextPipe,
    @Inject(LanguageToken) private language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(l => {
      if (l === 'en') this.contributionBreakupLabel = [NON_SAUDI, SAUDI, NON_SAUDI_WAITING];
      else this.contributionBreakupLabel = ['غير سعودي', 'سعودي', 'انتظار غير سعودي'];
      this.drawContributionBreakupChart();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributorDetails) {
      this.nonSaudiContributors = 0;
      this.saudiContributors = 0;
      this.nonSaudiWaitingContributors = 0;
      for (let i = 0; i < this.contributorDetails.length; i++) {
        if (this.contributorDetails[i].nationality === NON_SAUDI) {
          this.nonSaudiContributors = this.contributorDetails[i].count_0;
        } else if (this.contributorDetails[i].nationality === SAUDI) {
          this.saudiContributors = this.contributorDetails[i].count_0;
        } else {
          this.nonSaudiWaitingContributors = this.contributorDetails[i].count_0;
        }
      }
      this.setChartData();
    }
  }

  /** This method is to create chart data */
  setChartData() {
    this.contributionBreakupData = [];

    this.contributionBreakupColor = [];

    this.contributionBreakupData.push(this.nonSaudiContributors);
    this.contributionBreakupData.push(this.saudiContributors);
    this.contributionBreakupData.push(this.nonSaudiWaitingContributors);

    this.contributionBreakupColor.push('#5173BA');
    this.contributionBreakupColor.push('#0E98AB');
    this.contributionBreakupColor.push('#E61717');

    this.drawContributionBreakupChart();
  }

  /** This method is to draw Contribution Breakup Chart */
  drawContributionBreakupChart() {
    if (this.contributionBreakupChartInit) {
      this.contributionBreakupChartInit.destroy();
    }
    if (this.contributionBreakupChartCanvas) {
      const contributionLegend = this.contributionBreakupLabel;

      let font = '';
      if (this.lang === 'en') {
        font = 'Roboto';
      } else if (this.lang === 'ar') {
        font = 'Noto Kufi Arabic ,Roboto';
      }

      const text = new BilingualText();
      text.english = '';
      text.arabic = '';
      this.contributionBreakupChartInit = new Chart(this.contributionBreakupChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.contributionBreakupData,
              backgroundColor: this.contributionBreakupColor,
              hoverBackgroundColor: this.contributionBreakupColor,
              borderWidth: 0
            }
          ],
          labels: this.contributionBreakupLabel
        },
        plugins: [getChartPlugin('', font)],
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
