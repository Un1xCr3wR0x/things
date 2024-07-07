/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ElementRef,
  HostListener,
  Inject
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { convertToYYYYMMDD, RouterDataToken, RouterData } from '@gosi-ui/core';
import { BilingualText, DropdownValues, Lov, LovList } from '@gosi-ui/core/lib/models';
import { ContributionCategory } from '@gosi-ui/features/contributor/lib/shared/enums';
import {
  Contributor,
  Coverage,
  CoveragePeriod,
  EngagementPeriod,
  EngagementFilter,
  VicContributionDetails
} from '@gosi-ui/features/contributor/lib/shared/models';
import { EmployerList } from '@gosi-ui/features/contributor/lib/shared/models/employer-list';
import { EngagementDetails } from '@gosi-ui/features/contributor/lib/shared/models/engagement-details';

import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme/src';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'cnt-engagement-history-dc',
  templateUrl: './engagement-history-dc.component.html',
  styleUrls: ['./engagement-history-dc.component.scss']
})
export class EngagementHistoryDcComponent implements OnInit, OnChanges {
  tempDate: Date;
  closeEvent: any;
  closeButtonCLick: boolean = false;
  indappUser: boolean;
  constructor(private fb: FormBuilder, @Inject(RouterDataToken) readonly routerDataToken: RouterData,
  readonly router: Router) {}

  // Input Variables
  @Input() engagementDetails: EngagementDetails[];
  @Input() lang: string;
  @Input() isNin: boolean;
  @Input() coverageDetails: CoveragePeriod[];
  @Input() isTotalShare = false;
  selectedNationalityList: DropdownValues[] = [];
  // @Input() actionList: DropDownItems[];
  @Input() contributorData: Contributor;
  @Input() isABSHERregistered: boolean;
  @Input() occupationList: LovList;
  @Input() employerList?: EmployerList;
  @Input() userRoleArray;
  @Input() nin: number;
  @Input() vicContributionDto : VicContributionDetails
  // Output Variables
  @Output() edit: EventEmitter<number> = new EventEmitter();
  @Output() SearchValue: EventEmitter<number> = new EventEmitter();
  @Output() individualActions: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() navigateToContract: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() engagementFilterValues: EventEmitter<EngagementFilter> = new EventEmitter();
  @Output() navigateToBillDash: EventEmitter<null> = new EventEmitter();
  resetClicked: Subject<void> = new Subject<void>();

  // Local Variables
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('selectBtn') selectBtn: ElementRef;
  engagementDateForm = new FormControl();
  viewMode = 'engagement';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  labelStyle = {
    value: { color: '#666666', 'font-weight': '450' }
  };
  occupationListValues: BilingualText[] = [];
  employerListValues: BilingualText[] = [];
  employerLovList: LovList;
  paginationId = 'engagement-history'; // Pagination id
  itemsPerPage = 4;
  engPeriodList: EngagementPeriod[] = [];
  covList: {
    coverageEnglish: string;
    coverageArabic: string;
    regNo: number;
  };
  persistFilters: boolean;
  engHistoryForm: FormGroup;
  engagementViewFlag = true;
  maxDate: Date;
  endingDate: string;
  coverageList: Coverage[];
  displayIcon = true;
  annuity = ContributionCategory.ANNUITY;
  oh = ContributionCategory.OH;
  ui = ContributionCategory.UI;
  contractDetailsFlag: boolean;
  selectedValues: Array<BilingualText>;
  occupationValues: BilingualText[] = [];
  filterValues: EngagementFilter = new EngagementFilter();
  searchPlaceholder: string;
  insideEvent: boolean = false;
  ngOnInit(): void {
    this.maxDate = new Date();
    this.engHistoryForm = this.createForm();
    if(this.userRoleArray) {
      this.indappUser = this.userRoleArray.includes('11') && this.userRoleArray.includes('12')
    }
  }

  convertToLov(employerList: EmployerList) {
    const items: Lov[] = [];
    employerList.items.forEach((element, i) => {
      const lookUpValue = new Lov();
      lookUpValue.code = element.code;
      lookUpValue.value = element.value;
      lookUpValue.sequence = i;
      items.push(lookUpValue);
    });
    this.employerLovList = new LovList(items);
  }
  clearButtonClick(event) {
    if (event) {
      this.closeButtonCLick = event;
      setTimeout(() => {
        this.closeButtonCLick = false;
      }, 40);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.engagementDetails?.forEach(periods => {
        periods?.engagementPeriod.forEach(val => {
          val.registrationNo = periods?.registrationNo;
          this.engPeriodList.push(val);
        });
      });
      this.pageDetails = {
        currentPage: 1,
        goToPage: 1
      };
    }
    if (changes && changes.employerList && changes.employerList.currentValue) {
      this.employerList = changes.employerList.currentValue;
      this.convertToLov(this.employerList);
    }
    if (changes && changes.lang && changes.lang.currentValue) {
      this.lang = changes.lang.currentValue;
      this.setSearchPlaceHolder();
    }
  }
  updateInsideClick() {
    // setTimeout(() =>{
    //   this.insideEvent = false;
    // },40);
  }
  closeCLicked(event) {
    this.closeEvent = event;
    setTimeout(() => {
      this.closeEvent = false;
    }, 40);
  }
  clickInsideSelect(event) {
    this.insideEvent = event;
  }
  setSearchPlaceHolder() {
    if (this.lang === 'en') {
      this.searchPlaceholder = 'Search';
    } else {
      this.searchPlaceholder = 'يبحث';
    }
  }

  onSearch(key: number) {
    this.SearchValue.emit(key);
  }

  applyFilter() {
    this.persistFilters = true;
    if (this.occupationListValues.length > 0) {
      this.filterValues.occupation = this.engHistoryForm.get('occupation').value.english;
    } else {
      this.filterValues.occupation = null;
    }
    if (this.engagementDateForm.value) {
      this.filterValues.startDate = convertToYYYYMMDD(this.engagementDateForm?.value[0]);
      this.filterValues.endDate = convertToYYYYMMDD(this.engagementDateForm?.value[1]);
      this.tempDate = new Date(this.engagementDateForm?.value[1]);
      this.tempDate = new Date(this.tempDate.getFullYear(), this.tempDate.getMonth() + 1, 0);
      this.filterValues.endDate = convertToYYYYMMDD(this.tempDate.toDateString());
    } else {
      this.filterValues.startDate = null;
      this.filterValues.endDate = null;
    }
    if (this.employerListValues.length > 0) {
      this.filterValues.employer = this.engHistoryForm.get('name').value.english;
    } else {
      this.filterValues.employer = null;
    }
    this.engagementFilterValues.emit(this.filterValues);
  }
  clearAllFiters() {
    this.engagementDateForm.reset();
    this.engHistoryForm.reset();
    this.filterValues.startDate = null;
    this.filterValues.endDate = null;
    this.filterValues.employer = null;
    this.filterValues.occupation = null;
    this.engagementFilterValues.emit(null);
    this.occupationListValues = [];
    this.employerListValues = [];
    this.resetClicked.next();
  }
  clearOccupationFiter() {
    this.engHistoryForm.controls['occupation'].reset();
    this.filterValues.occupation = null;
    this.occupationListValues = [];
  }
  clearEmployerFiter() {
    this.engHistoryForm.controls['name'].reset();
    this.filterValues.employer = null;
    this.employerListValues = [];
  }
  clearDateRangeFiter() {
    this.engagementDateForm.reset();
    this.filterValues.startDate = null;
    this.filterValues.endDate = null;
  }
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
  fetchContracts(value: EngagementDetails) {
    this.navigateToContract.emit(value);
  }
  contributionViewChange(val: string) {
    if (val === 'engagement') {
      this.engagementViewFlag = true;
      this.viewMode = val;
    } else if (val === 'contribution') {
      this.engagementViewFlag = false;
      this.viewMode = val;
    }
  }
  /** Method to paginate through engagements. */
  paginateEngagements(pageNumber: number) {
    if (this.pageDetails.currentPage !== pageNumber) this.pageDetails.currentPage = pageNumber;
  }

  handleIndividualEngagementAction(event) {
    this.individualActions.emit(event);
  }

  handleIndividualEngagement(event) {
    this.edit.emit(event);
  }

  /** Method to handle multi selection. */
  handleMultiSelection(selectedList: DropdownValues[]) {
    this.selectedNationalityList = selectedList;
  }

  navigateToBillDashboard() {
    this.navigateToBillDash.emit();
  }

  createForm() {
    return this.fb.group({
      name: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      occupation: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  changeType(){
    this.routerDataToken.tabIndicator = 1;
    this.routerDataToken.state = 'Registered';
    this.routerDataToken.priority= this.nin;
    this.router.navigate(['/home/contributor/add-Engagement/registered']);
  }
}
