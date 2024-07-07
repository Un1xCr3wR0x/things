import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  EventEmitter,
  Output,
  Input,
  SimpleChanges
} from '@angular/core';
import { Chart } from 'chart.js';
import { LanguageToken, getChartPlugin, getChartOptions, BilingualText } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { ContributionBreakupColorEnum } from '../../../shared/enums';
import { ContributionCategory } from '../../../shared/enums/contribution-category';

@Component({
  selector: 'cim-contribution-breakup-chart-dc',
  templateUrl: './contribution-breakup-chart-dc.component.html',
  styleUrls: ['./contribution-breakup-chart-dc.component.scss']
})
export class ContributionBreakupChartDcComponent implements OnInit {
  contributionBreakupChartInit: Chart;
  lang = 'en';
  exchangeRate = 100;
  contributionBreakupLabel = [];
  contributionBreakupData = [];
  contributionBreakupColor = [];
  centerTextValue: string;
  @Input() contributionBreakup = [];
  @Input() currencyType: BilingualText;

  @Output() switchView: EventEmitter<number> = new EventEmitter();
  /* Chart reference */
  @ViewChild('contributionBreakupChart', { static: true })
  private contributionBreakupChartCanvas: ElementRef;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly bilingualText: BilingualTextPipe
  ) {}

  /** Method to instantiate the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.centerTextValue = this.bilingualText.transform(this.currencyType);
      this.lang = language;
      this.setChart();
    });
    this.centerTextValue = this.bilingualText.transform(this.currencyType);
    this.setChart();
  }

  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributionBreakup && changes.contributionBreakup.currentValue) {
      this.setChart();
    }

    /** Reassign center text on change of currency */
    if (
      changes.currencyType &&
      changes.currencyType.currentValue &&
      changes.currencyType.previousValue &&
      changes.currencyType.currentValue.english !== changes.currencyType.previousValue.english &&
      !changes.currencyType.isFirstChange()
    ) {
      this.centerTextValue = this.bilingualText.transform(changes.currencyType.currentValue);
      this.setChart();
    }

    /** Draw the chart on change of currency */
    if (changes.exchangeRate && changes.exchangeRate.currentValue && !changes.exchangeRate.isFirstChange()) {
      this.centerTextValue = this.bilingualText.transform(this.currencyType);
      this.setChart();
    }
  }

  /** This method is to create chart data */
  setChart() {
    this.contributionBreakupLabel = [];
    this.contributionBreakupData = [];
    this.contributionBreakupColor = [];
    this.contributionBreakup.forEach(summary => {
      if (summary.type.english.toLowerCase() === ContributionCategory.gosi.toLowerCase() && summary.amount !== 0) {
        this.contributionBreakupData.push(summary.amount * this.exchangeRate);
        this.contributionBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.contributionBreakupColor.push(ContributionBreakupColorEnum.gosi);
      } else if (
        summary.type.english.toLowerCase() === ContributionCategory.ppa.toLowerCase() &&
        summary.amount !== 0
      ) {
        this.contributionBreakupData.push(summary.amount * this.exchangeRate);
        this.contributionBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.contributionBreakupColor.push(ContributionBreakupColorEnum.ppa);
      } else if (
        summary.type.english.toLowerCase() === ContributionCategory.vic.toLowerCase() &&
        summary.amount !== 0
      ) {
        this.contributionBreakupData.push(summary.amount * this.exchangeRate);
        this.contributionBreakupLabel.push(this.bilingualText.transform(summary.type));
        this.contributionBreakupColor.push(ContributionBreakupColorEnum.vic);
      }
    });
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
        plugins: [getChartPlugin(this.centerTextValue, font)],
        options: {
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
