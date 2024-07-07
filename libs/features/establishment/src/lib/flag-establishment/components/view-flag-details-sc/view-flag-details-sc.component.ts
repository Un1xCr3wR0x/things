/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  Establishment,
  EstablishmentStatusEnum,
  LookupService,
  Lov,
  LovList,
  SortDirectionEnum,
  DropdownItem as Tab,
  WorkflowService,
  bindToObject,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, throwError } from 'rxjs';
import { incorrectRoute } from '../../../manage-admin/components';
import {
  EstLookupService,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  FilterKeyEnum,
  FilterKeyValue,
  FlagConstants,
  FlagDetails,
  FlagEstablishmentService,
  FlagFilter,
  FlagQueryParam,
  SORT_FLAG_LOV_VALUE_END_DATE,
  SORT_FLAG_LOV_VALUE_START_DATE
} from '../../../shared';
import { EstablishmentScBaseComponent } from '../../../shared/base/establishment-sc.base-component';
import { EstablishmentConstants } from '../../../shared/constants/establishment-constants';
import { ActiveFlagsDcComponent } from '../active-flags-dc/active-flags-dc.component';
import { FlagHistoryDcComponent } from '../flag-history-dc/flag-history-dc.component';

@Component({
  selector: 'est-view-flag-details-sc',
  templateUrl: './view-flag-details-sc.component.html',
  styleUrls: ['./view-flag-details-sc.component.scss']
})
export class ViewFlagDetailsScComponent extends EstablishmentScBaseComponent implements OnInit, OnDestroy {
  tabs: Tab[] = [
    {
      key: 'ESTABLISHMENT.ACTIVE-FLAGS',
      id: 'ESTABLISHMENT.ACTIVE-FLAGS',
      icon: 'flag'
    },
    {
      key: 'ESTABLISHMENT.INACTIVE-FLAGS',
      id: 'ESTABLISHMENT.INACTIVE-FLAGS',
      icon: 'history'
    }
  ];
  selectedTab: string = this.tabs[0].key;
  estRegNo: number;
  activeFlags: FlagDetails[] = [];
  flagHistory: FlagDetails[] = [];
  flagMap: Map<string, FlagDetails[]>;
  flagNameMap: Map<
    string,
    {
      name: BilingualText;
      isOpen: boolean;
      searchParam: number;
      filters: FilterKeyValue[];
      filterReasons: LovList;
      creationTypeLovList: LovList;
    }
  >;
  sortFlagsLovList: LovList;
  historyCreationTypeLovList: LovList;
  lastRoute = EstablishmentRoutesEnum.PROFILE_SEARCH;
  establishment: Establishment;
  addFlagRestrictMsg = 'ESTABLISHMENT.RESTRICT-ADD-FLAG';
  historyFlagReasons: LovList;
  flagFilterValue: FilterKeyValue[] = [];
  activeFlagForm: FormGroup;
  addFlagAccessRoles = FlagConstants.ADD_FLAG_ACCESS_ROLES;
  hasModifyEligibility: boolean;

  /** Child components */
  @ViewChild('restrictAddFlagTemplate', { static: true })
  restrictAddFlagTemplate: TemplateRef<HTMLElement>;
  @ViewChild('historyFlags', { static: false })
  historyFlagComponent: FlagHistoryDcComponent;
  @ViewChild('activeFlags', { static: false })
  activeFlagComponent: ActiveFlagsDcComponent;

  constructor(
    readonly bsModalService: BsModalService,
    readonly estLookUpService: EstLookupService,
    readonly location: Location,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly flagService: FlagEstablishmentService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly lookUpService: LookupService,
    readonly fb: FormBuilder,
    readonly workflowService: WorkflowService
  ) {
    super(bsModalService, workflowService);
    this.activeFlagForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initialiseFromRoutes(this.route.paramMap);
    this.viewFlagDetails();
    const search = new FlagFilter();
    this.getFlagHistory(search);
    this.sortFlagsLovList = this.estLookUpService.getSortByList();
    this.getEstablishment();
  }

  navigateBack() {
    this.location.back();
  }

  selectTab(key: string) {
    this.historyFlagComponent.cancelFilter();
    this.activeFlagComponent.cancelFilter();
    this.selectedTab = key;
  }

  initialiseFromRoutes(paramMap: Observable<ParamMap>) {
    paramMap.subscribe(params => {
      if (params && params.get('regNo')) {
        this.estRegNo = +params.get('regNo');
        this.flagService.registrationNo = this.estRegNo;
      } else {
        this.router.navigate([this.lastRoute]);
        return throwError(incorrectRoute);
      }
    });
  }

  /**
   * Method to get active flags
   */
  viewFlagDetails() {
    const params = new FlagQueryParam();
    params.status = EstablishmentQueryKeysEnum.ACTIVE;
    params.getWorkflow = true;
    this.flagService.getFlagDetails(this.estRegNo, params).subscribe(
      res => {
        this.activeFlags = res;
        this.activeFlags.forEach(flag => {
          flag.startDate.gregorian = startOfDay(moment(flag.startDate?.gregorian, 'YYYY-MM-DD').toDate());
          if (flag.endDate) {
            flag.endDate.gregorian = startOfDay(moment(flag?.endDate?.gregorian, 'YYYY-MM-DD').toDate());
          }
        });
        this.flagMap = this.groupByFlagType(this.activeFlags, flag => flag.flagType.english);
        this.flagNameMap = this.getFlagNameMap(this.flagMap);
      },
      err => this.alertService.showError(err.error.message)
    );
  }

  /**
   *
   * @param flagMap method to get the flag name map
   */
  getFlagNameMap(flagMap: Map<string, FlagDetails[]>): Map<
    string,
    {
      name: BilingualText;
      isOpen: boolean;
      searchParam: number;
      filters: FilterKeyValue[];
      filterReasons: LovList;
      creationTypeLovList: LovList;
    }
  > {
    const map_var = new Map();
    flagMap.forEach((item, key) => {
      const collection = map_var.get(key);
      if (!collection) {
        map_var.set(key, {
          name: item[0].flagType,
          isOpen: false,
          searchParam: null,
          filters: [],
          filterReasons: this.getFlagReasonsLov(item),
          creationTypeLovList: this.getFlagCreationTypeLov(item)
        });
      }
    });
    return map_var;
  }

  /**
   *
   */
  navigateToModifyFlag(flagId) {
    this.router.navigate([EstablishmentConstants.MODIFY_FLAG_ROUTE(this.estRegNo, flagId)]);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAlerts();
  }
  /**
   * Method to navigate to add flag page
   */
  addFlag() {
    if (this.establishment.status.english !== EstablishmentStatusEnum.REGISTERED) {
      this.showModal(this.restrictAddFlagTemplate, 'lg');
    } else {
      this.router.navigate([EstablishmentConstants.ADD_FLAG_ROUTE()]);
    }
  }

  getEstablishment() {
    this.establishmentService.getEstablishment(this.estRegNo).subscribe(
      res => {
        this.establishment = bindToObject(new Establishment(), res);
        this.hasModifyEligibility = this.establishmentService.isUserEligible(
          FlagConstants.ADD_FLAG_ACCESS_ROLES.map(role => +role),
          this.establishment.registrationNo
        );
      },
      err => this.alertService.showError(err.error.message)
    );
  }

  searchActiveFlags(searchValue: FlagFilter) {
    this.flagService
      .getFlagDetails(this.estRegNo, this.getSearchParams(EstablishmentQueryKeysEnum.ACTIVE, searchValue))
      .subscribe(
        res => {
          res.forEach(flag => {
            flag.startDate.gregorian = startOfDay(moment(flag.startDate?.gregorian, 'YYYY-MM-DD').toDate());
            if (flag.endDate) {
              flag.endDate.gregorian = startOfDay(moment(flag?.endDate?.gregorian, 'YYYY-MM-DD').toDate());
            }
          });
          this.flagMap.set(searchValue.flagType?.english, res);
          this.flagMap = new Map(this.flagMap); //to detect the change in child component
        },
        err => this.alertService.showError(err.error.message)
      );
  }

  /**
   * method to get the lov of flag reasons
   */
  getFlagReasonsLov(flagDetails: FlagDetails[]): LovList {
    return flagDetails.reduce((prevReasons, flag) => {
      if (
        !prevReasons.items.some(prevReason => {
          return prevReason?.value?.english === flag.flagReason?.english;
        })
      ) {
        const lov = new Lov();
        lov.sequence = prevReasons.items.length + 1;
        lov.value = flag.flagReason;
        prevReasons.items.push(lov);
      }
      return prevReasons;
    }, new LovList([]));
  }
  /**
   * method to get the lov of flag creation type
   */
  getFlagCreationTypeLov(flagDetails: FlagDetails[]) {
    return flagDetails.reduce((prevResult, flag) => {
      const initiatedBy = new BilingualText();
      initiatedBy.english = flag.initiatedBy.english;
      initiatedBy.arabic = flag.initiatedBy.arabic;
      if (
        !prevResult.items.some(prevReason => {
          return prevReason?.value?.english === flag.initiatedBy.english;
        })
      ) {
        const lov = new Lov();
        lov.sequence = prevResult.items.length + 1;
        lov.value = initiatedBy;
        prevResult.items.push(lov);
      }
      return prevResult;
    }, new LovList([]));
  }

  /**
   * Method to get flag history
   */
  getFlagHistory(searchTerm: FlagFilter) {
    this.flagService
      .getFlagDetails(this.estRegNo, this.getSearchParams(EstablishmentQueryKeysEnum.HISTORY, searchTerm))
      .subscribe(
        res => {
          this.flagHistory = res;
          if (this.historyFlagReasons === undefined) {
            this.historyFlagReasons = this.getFlagReasonsLov(this.flagHistory);
          }
          if (this.historyCreationTypeLovList === undefined) {
            this.historyCreationTypeLovList = this.getFlagCreationTypeLov(this.flagHistory);
          }
        },
        err => this.alertService.showError(err.error.message)
      );
  }

  /**
   * Method to create the search params for the api
   * @param flagStatus
   * @param searchTerm
   */
  getSearchParams(flagStatus: string, searchTerm: FlagFilter): FlagQueryParam {
    const params = new FlagQueryParam();
    params.status = flagStatus;
    params.status = flagStatus;
    if (flagStatus === EstablishmentQueryKeysEnum.ACTIVE) {
      params.flagType = searchTerm.flagType?.english;
      params.getWorkflow = true;
    }
    if (searchTerm?.transactionId) {
      params.transactionTraceId = searchTerm.transactionId;
    }
    if (searchTerm?.sortBy && searchTerm?.sortOrder) {
      params.sortBy =
        searchTerm?.sortBy?.value.english === SORT_FLAG_LOV_VALUE_START_DATE.english
          ? EstablishmentQueryKeysEnum.REASON_START_DATE
          : searchTerm?.sortBy?.value.english === SORT_FLAG_LOV_VALUE_END_DATE.english
          ? EstablishmentQueryKeysEnum.REASON_END_DATE
          : searchTerm?.sortBy?.value.english;
      params.orderBy =
        searchTerm?.sortOrder === SortDirectionEnum.DESCENDING
          ? EstablishmentQueryKeysEnum.DESCENDING
          : EstablishmentQueryKeysEnum.ASCENDING;
    }
    if (searchTerm?.flagFilter) {
      const filters = searchTerm.flagFilter;
      const period = filters.filter(item => item.key === FilterKeyEnum.PERIOD);
      const reasonList = filters.filter(item => item.key === FilterKeyEnum.REASON);
      const typeList = filters.filter(item => item.key === FilterKeyEnum.APPLIED_BY);
      if (reasonList?.length > 0) {
        params.flagReason = reasonList[0].bilingualValues.map(item => item.english);
      }
      if (period[0]?.values.length > 0) {
        const startDate = moment(new Date(period[0]?.values[0])).format('YYYY-MM-DD');
        const endDate = moment(new Date(period[0]?.values[1])).format('YYYY-MM-DD');
        params.startDate = startDate;
        params.endDate = endDate;
      }
      if (typeList?.length > 0 && typeList[0]?.bilingualValues?.length > 0) {
        params.initiatedBy = typeList[0]?.bilingualValues.map(item => item.english);
      }
    }
    return params;
  }
}
