import { Component, OnInit, Input, Inject, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { BillHistoryWrapper, ItemizedMiscRequest, ItemizedMiscResponse } from '../../../../shared/models';
import { AlertService, LanguageToken } from '@gosi-ui/core';
import { Months } from '../../../../shared/enums';
import moment from 'moment';
import { MiscellaneousAdjustmentService } from '../../../../shared/services';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blg-last-paid-bill-details-dc',
  templateUrl: './last-paid-bill-details-dc.component.html',
  styleUrls: ['./last-paid-bill-details-dc.component.scss']
})
export class LastPaidBillDetailsDcComponent implements OnInit, AfterViewInit {
  /**-----------------Local Variables----------------------------*/
  lang = 'en';
  lastPaidMonth: string;
  total = 0;
  /**-----------------Input Variables----------------------------*/
  @Input() billHistoryDetails: BillHistoryWrapper;
  @Input() debtStartDate : Date;
  @Input() debtStartMonth : string;
  @Input() establishmentRegistrationNo : any;
  @Input() exchangeRate = 1;
  @Input() isMofFlag : Boolean;
  @Input() miscAdjustmentResponse: ItemizedMiscResponse;

  @Output() backNavigation: EventEmitter<null> = new EventEmitter();
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>,
   readonly miscAdjustmentService: MiscellaneousAdjustmentService,
   readonly alertService: AlertService) {}

  ngOnInit(): void {}
  /* This method is to handle the language subscription */
  ngAfterViewInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  getMonth() {
    const date = new Date(this.billHistoryDetails?.lastMigratedBillStartDate?.gregorian);
    this.lastPaidMonth = this.getMonthFromDate(date);
    return 'BILLING.CALENDAR-LABEL.' + this.lastPaidMonth.toUpperCase();
  }
  getMonthFromDate(date: Date) {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }
  backNavigationToPage() {
    this.backNavigation.emit();
  }
}
