import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SessionLimitRequest,
  SessionFilterRequest,
  ConfigurationBaseScComponent,
  MbRouteConstants,
  IndividualSessionDetails,
  ConfigurationFilterConstants,
  ConfigurationList,
  SessionRequest,
  SessionSortValuesEnum,
  SortQueryParam
} from '../../../../shared';
import { ConfigurationListDcComponent } from '../configuration-list-dc/configuration-list-dc.component';
import { AlertService, BilingualText, LookupService, Lov, LovList, SortDirectionEnum } from '@gosi-ui/core';
import { SessionConfigurationService, SessionStatusService, SORT_SESSION_SORT_VALUE_DATE_CREATED } from '../../../../shared/services';
import { Observable } from 'rxjs';
@Component({
  selector: 'mb-session-configuration-sc',
  templateUrl: './session-configuration-sc.component.html',
  styleUrls: ['./session-configuration-sc.component.scss']
})
export class SessionConfigurationScComponent extends ConfigurationBaseScComponent implements OnInit {
  gosiAdjustmentSort$: Observable<LovList>;
  SortByinit: BilingualText = SORT_SESSION_SORT_VALUE_DATE_CREATED;
  isDescending = false;
  //ViewChild components
  @ViewChild('sessionList') sessionList: ConfigurationListDcComponent;

  sortList: BilingualText[] = [];
  sortQueryParam: SortQueryParam = new SortQueryParam();
  sortOrder = 'ASC';
  constructor(
    readonly sessionStatusService: SessionStatusService,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly lookUpService: LookupService,
    readonly configurationService: SessionConfigurationService,
    readonly alertService: AlertService
  ) {
    super(sessionStatusService, lookUpService, activatedRoute, configurationService, alertService);
  }

  ngOnInit(): void {
    // this.sortList = this.configurationService.getSortList().map(item => item.value);
    this.sortQueryParam.sortBy = SessionSortValuesEnum.SESSION_DATE;
    this.sortQueryParam.sortOrder = this.sortOrder;
    this.getSessionRecords(this.sortQueryParam);
    this.getOfficeList();
    this.getSessionType();
    this.getSessionChannel();
    this.getSessionStatus();
    this.gosiAdjustmentSort$ = this.lookUpService.getSessionSortBy();

    // this.gosiAdjustmentSort = this.configurationService.sessionSortList();
  }
  /**
   * method for pagination
   * @param limitItem
   */
  onLimit(limit: SessionLimitRequest) {
    if (this.sessionRequest) {
      this.sessionRequest.limit = limit;
      this.getSessionRecords(this.sortQueryParam);
    }
  }
  onFilter(filter: SessionFilterRequest) {
    if (this.sessionRequest) {
      this.sessionRequest.filter = filter;
      this.resetPagination();

      this.getSessionRecords(this.sortQueryParam);
    }
  }
  resetPagination() {
    this.sessionList.onResetPagination();
  }
  navigateToSessionDetails(item: ConfigurationList) {
    if (item.sessionType?.english === ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[0]?.value?.english) {
      this.templateId = item.sessionTemplateId;
      this.router.navigate([MbRouteConstants.ROUTE_SESSION_CONFIGURATION_DETAILS], {
        queryParams: {
          templateId: this.templateId,
          sessionType: item.sessionType?.english?.replace(/\s/g, '')
        }
      });
    } else if (item.sessionType?.english === ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[1]?.value?.english) {
      this.sessionId = item.sessionId;
      this.router.navigate([MbRouteConstants.ROUTE_SESSION_CONFIGURATION_DETAILS], {
        queryParams: {
          sessionId: this.sessionId,
          sessionType: item.sessionType?.english?.replace(/\s/g, '')
        }
      });
    }
  }
  /**
   * method to get the sort value
   * @param sortBy
   */
  getSortByValue(sortBy: string): string {
    return sortBy === 'Configuration Date'
      ? SessionSortValuesEnum.SESSION_CONFIGURATION_DATE
      : sortBy === 'Session Date'
      ? SessionSortValuesEnum.SESSION_DATE
      : SessionSortValuesEnum.CREATION_DATE;
  }
  directionToggle(order: string){
    this.sortQueryParam.sortOrder = order;
    this.onSort();
  }
  onSort() {
    this.getSessionRecords(this.sortQueryParam);
  }
  onSortItemSelected(item: Lov){
  this.sortQueryParam.sortBy = this.getSortByValue(item.value.english);
  this.sortQueryParam.sortOrder = this.sortOrder;
  this.getSessionRecords(this.sortQueryParam);
  }
}
