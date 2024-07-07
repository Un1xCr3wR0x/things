import { Component, OnInit, Input, Inject, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { BillHistoryWrapper } from '../../../../shared/models';
import { CalendarTypeEnum, GosiCalendar, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { HijiriMonths, Months } from '../../../../shared/enums';

@Component({
  selector: 'blg-bill-history-header-dc',
  templateUrl: './bill-history-vic-header-dc.component.html',
  styleUrls: ['./bill-history-vic-header-dc.component.scss']
})
export class BillHistoryVicHeaderDcComponent implements OnInit, AfterViewInit {
  /**-----------------Local Variables----------------------------*/
  lang = 'en';
  /**-----------------Input Variables----------------------------*/
  @Input() billHistoryDetails: BillHistoryWrapper;

  @Output() backNavigation: EventEmitter<null> = new EventEmitter();
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {}
  /* This method is to handle the language subscription */
  ngAfterViewInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  backNavigationTo() {
    this.backNavigation.emit();
  }
  getBillPeriod(lastFullyPaidDate: GosiCalendar): string {
    if (lastFullyPaidDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
      const calendarMonth = this.getlastFullyPaidDate(lastFullyPaidDate.gregorian);
      return 'BILLING.' + 'MONTH-YEAR.' + calendarMonth.toUpperCase();
    } else if (lastFullyPaidDate?.entryFormat === CalendarTypeEnum.HIJRI) {
      const calendarMonth = this.getHijirilastFullyPaidDate(lastFullyPaidDate?.hijiri);
      return 'BILLING.' + 'HIJIRI-MONTH-YEAR.' + calendarMonth.toUpperCase();
    }
  }
  getlastFullyPaidDate(date: Date | string) {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }
  getHijirilastFullyPaidDate(date: Date | string) {
    return Object.keys(HijiriMonths)[moment(date).toDate().getMonth()];
  }

  getBillPaymentYears(date: GosiCalendar) {
    if (date?.entryFormat === CalendarTypeEnum.GREGORIAN)
      return moment(date.gregorian).toDate().getFullYear().toString();
    else if (date?.entryFormat === CalendarTypeEnum.HIJRI) return moment(date.hijiri).toDate().getFullYear().toString();
  }
}
