import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  SimpleChanges,
  OnChanges,
  OnInit,
  Inject
} from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { MBConstants } from '../../../../shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationList, SessionLimitRequest } from '../../../../shared/models';

@Component({
  selector: 'mb-configuration-list-dc',
  templateUrl: './configuration-list-dc.component.html',
  styleUrls: ['./configuration-list-dc.component.scss']
})
export class ConfigurationListDcComponent implements OnInit, OnChanges {
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  adHocValue = MBConstants.ADHOC;
  lang = 'en';
  @Input() totalCount: number;
  @Input() list: ConfigurationList[];
  @Input() limitItem: SessionLimitRequest = new SessionLimitRequest();
  @Output() navigate: EventEmitter<ConfigurationList> = new EventEmitter();
  @Output() select: EventEmitter<SessionLimitRequest> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to initialize changes in input property */

  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }
  /** Method to detect changes in input property */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.limitItem && changes.limitItem.currentValue) {
      this.limitItem = changes.limitItem.currentValue;
      this.pageDetails.currentPage = this.pageDetails.goToPage = this.limitItem.pageNo + 1;
    }
    if (changes && changes.list) {
      this.list = changes.list.currentValue;
      if (this.list)
        this.list.forEach(item => {
          const dateArray = item.startTime.split('::');
          const endDateArray = item.endTime.split('::');
          dateArray[1] = dateArray[1] !== undefined ? dateArray[1] : '00';
          endDateArray[1] = endDateArray[1] !== undefined ? endDateArray[1] : '00';
          if (dateArray[0].length === 1) dateArray[0] = ('0' + dateArray[0]).slice(-2);
          else dateArray[0] = dateArray[0];
          if (endDateArray[0].length === 1) endDateArray[0] = ('0' + endDateArray[0]).slice(-2);
          else endDateArray[0] = endDateArray[0];
          if (dateArray[1].length === 1) dateArray[1] = ('0' + dateArray[1]).slice(-2);
          else dateArray[1] = dateArray[1];
          if (endDateArray[1].length === 1) endDateArray[1] = ('0' + endDateArray[1]).slice(-2);
          else endDateArray[1] = endDateArray[1];

          if (Number(dateArray[0]) > 12) {
            item.startTime = Number(dateArray[0]) - 12 + ':' + dateArray[1];
            item.startTimeAmOrPm = MBConstants.PM;
          } else if (Number(dateArray[0]) === 12) {
            item.startTime = 12 + ':' + dateArray[1];
            item.startTimeAmOrPm = MBConstants.PM;
          } else {
            item.startTime = dateArray[0] + ':' + dateArray[1];
            item.startTimeAmOrPm = MBConstants.AM;
          }
          if (Number(endDateArray[0]) > 12) {
            item.endTime = Number(endDateArray[0]) - 12 + ':' + endDateArray[1];
            item.endTimeAmOrPm = MBConstants.PM;
          } else if (Number(endDateArray[0]) === 12) {
            item.endTime = 12 + ':' + endDateArray[1];
            item.endTimeAmOrPm = MBConstants.PM;
          } else {
            item.endTime = endDateArray[0] + ':' + endDateArray[1];
            item.endTimeAmOrPm = MBConstants.AM;
          }
        });
    }
  }
  onNavigate(item: ConfigurationList) {
    this.navigate.emit(item);
  }
  selectPage(pageNumber: number) {
    if (pageNumber - 1 !== this.limitItem.pageNo) {
      this.pageDetails.currentPage = pageNumber;
      this.limitItem.pageNo = pageNumber - 1;
      this.select.emit(this.limitItem);
    }
  }
  /**
   * method to reset pagination
   */
  onResetPagination() {
    this.limitItem.pageNo = 0;
    this.pageDetails.currentPage = 1;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
}
