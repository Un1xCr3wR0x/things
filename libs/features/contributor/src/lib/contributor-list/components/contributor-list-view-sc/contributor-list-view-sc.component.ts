/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Contributor,
  CalendarService,
  DocumentService,
  downloadFile,
  LanguageEnum,
  LanguageToken,
  Lov,
  LookupService,
  LovList,
  OccupationList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService,
  LoginGuard,
  BilingualText
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../shared/components';
import { ContributorConstants, ContributorRouteConstants } from '../../../shared/constants';
import { SearchTypeEnum, ExportType } from '../../../shared/enums';
import { ContributorWageDetails, ContributorWageDetailsResponse, ContributorWageParams } from '../../../shared/models';
import {
  ContributorService,
  ContributorsWageService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';
import { lovListData } from 'testing';
import { ContributorDetailsFilter } from '../../../shared/models/contributor-details-filter';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'cnt-contributor-list-view-sc',
  templateUrl: './contributor-list-view-sc.component.html',
  styleUrls: ['./contributor-list-view-sc.component.scss']
})
export class ContributorListViewScComponent extends ContributorBaseScComponent implements OnInit {
  /** Local Variables */
  currentTab: number;
  contributorList: ContributorWageDetails[];
  numberOfContributors = 0;
  active = 0;
  inactive = 0;
  allContributor = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  itemsPerPage = 10;
  paginationId = 'contributor-list'; // Pagination id
  resetSearch: boolean = false;
  searchFlag: boolean = false;
  searchValue:string = null;
  status: string;
  selectedLang: string;
  fileName: string;
  allContributorList = false;
  isAppPrivate: boolean;
  contributorSortList: LovList;
  sortOrder = 'ASC';
  sortBy: string;
  occupationList$: Observable<OccupationList>;
  occupationListnew: LovList;
  filterRequest:ContributorDetailsFilter = new ContributorDetailsFilter();
  nationalityList$: Observable<LovList> = new Observable<LovList>(null);
  filterFlag = false;
  filterParams:ContributorWageParams;
  resetFilterForm= false;
  contributorFilterForm: FormGroup;
  initialSortValue: BilingualText = new BilingualText();
  joiningDateFormControl = new FormControl();
  leavingDateFormControl = new FormControl();
  floorWage=0;
  ceilWage=100000;
  wageSlider = new FormControl([this.floorWage,this.ceilWage]);
  selectedNationalityOptions: BilingualText[] =[];
  selectedOccupationOptions: BilingualText[] = [];
  


  /** Creates an instance of ContributorListViewScComponent. */
  constructor(
    private fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly manageWageService: ManageWageService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly contributorWageService: ContributorsWageService,
    readonly lookUpService: LookupService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly calendarService: CalendarService
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken,
      calendarService
    );
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => (this.selectedLang = language));
    this.alertService.clearAlerts();
    this.contributorSortList  = ContributorConstants.CONTRIBUTOR_SORT_LIST;
    this.initialSortValue=this.contributorSortList.items[0].value;
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    } else {
      this.isAppPrivate = false;
    }
    this.getRegistrationNumberFromRoute();
    if (this.registrationNo) this.initializeListView();
    this.getLOVList();
    this.contributorFilterForm = this.createFilterForm();
  }
  createFilterForm() {
    return this.fb.group({
      nationality: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      gender: this.fb.group({
        english: '',
        arabic: ''
      }),
      occupation: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getLOVList(){
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.occupationList$ = this.lookUpService.getAllOccupationList();
  }
  filterContributorList(filterRequest){
    this.filterParams=null;
    this.filterParams=filterRequest;
    if(this.checkContributorType() == SearchTypeEnum.ACTIVE){
      this.contributorWageService.getContributorFilterList(this.registrationNo,this.filterParams, true, SearchTypeEnum.ACTIVE ).subscribe(res=>{
        this.active = res.numberOfContributors;
          this.assembleContributorList(res);
      })
    }
    else if(this.checkContributorType() == SearchTypeEnum.INACTIVE){
      this.contributorWageService.getContributorFilterList(this.registrationNo,this.filterParams, true, SearchTypeEnum.INACTIVE ).subscribe(res=>{
        this.inactive = res.numberOfContributors;
          this.assembleContributorList(res);
      })
    }
    else if(this.checkContributorType() == SearchTypeEnum.ALL){
      this.contributorWageService.getContributorFilterList(this.registrationNo,this.filterParams, true, SearchTypeEnum.ALL ).subscribe(res=>{
        this.allContributor = res.numberOfContributors;
          this.assembleContributorList(res);
      })
    }
  }

  filterApplied(val) {
    if(val.length >0){
      this.filterFlag=true;
    }
    val.forEach(item =>{
      if(item.key=='joiningDate'){
        this.filterRequest.joiningDate.fromDate=item.values[0];
        this.filterRequest.joiningDate.toDate=item.values[1];
      }
      if(item.key=='leavingDate'){
        this.filterRequest.leavingDate.fromDate=item.values[0];
        this.filterRequest.leavingDate.toDate=item.values[1];
      }
      if(item.key=='gender')this.filterRequest.gender=item.bilingualValues;
      if(item.key=='nationalityList')this.filterRequest.nationalityList=item.bilingualValues;
      if(item.key=='occupationList')this.filterRequest.occupationList=item.bilingualValues;
      if(item.key=='totalWageRange'){
        this.filterRequest.wageRangeStart=item.rangeValues[0];
        this.filterRequest.wageRangeEnd=item.rangeValues[1];
      }
    })
  }

  /** Method to get registration nnumber from parent route. */
  getRegistrationNumberFromRoute() {
    this.route.parent.parent.paramMap.subscribe(
      param => (this.registrationNo = param.get('registrationNo') ? Number(param.get('registrationNo')) : null)
    );
  }

  /** Method to search establishment. */
  establishmentSearch(regNo: number): void {
    super.getEstablishmentDetails(regNo).subscribe({
      next: () => this.initializeListView(),
      error: err => this.showError(err)
    });
  }

  /** Method to initialize the list view. */
  initializeListView() {
    this.fetchContributorList(new ContributorWageParams(false, false, SearchTypeEnum.ACTIVE))
      .pipe(
        tap(res => {
          this.active = res.numberOfContributors;
          this.currentTab = 0;
          this.assembleContributorList(res);
        }),
        switchMap(() =>
          this.fetchContributorList(new ContributorWageParams(false, true, SearchTypeEnum.INACTIVE)).pipe(
            tap(res => (this.inactive = res.numberOfContributors))
          )
        ),
        switchMap(() =>
          this.fetchContributorList(new ContributorWageParams(false, true, SearchTypeEnum.ALL)).pipe(
            tap(res => (this.allContributor = res.numberOfContributors))
          )
        )
      )
      .subscribe({
        error: err => this.showError(err)
      });
  }

  /** Method to fetch contributor list. */
  fetchContributorList(params: ContributorWageParams) {
    return this.contributorWageService.getContributorList(this.registrationNo, params, true);
  }

  /** Method to assemble contributor list. */
  assembleContributorList(data: ContributorWageDetailsResponse) {
    this.numberOfContributors = data.numberOfContributors;
    this.contributorList = data.contributors;
  }
  /** Method to assemble contributor list on search */
  assembleContributorListOnSearch(data: ContributorWageDetailsResponse) {
    // setting count of contributor tabs on search
    switch(this.checkContributorType()){
      case SearchTypeEnum.ACTIVE:
        this.active = data.numberOfContributors;
        break;
      case SearchTypeEnum.INACTIVE:
        this.inactive = data.numberOfContributors;
        break;
      case SearchTypeEnum.ALL:
        this.allContributor = data.numberOfContributors;
        break;
    }
    this.numberOfContributors = data.numberOfContributors;
    this.contributorList = data.contributors;
    this.resetSearch = false;
  }


  /** Method to set current tab when tabs are switched. */
  toggleTabs(index: number) {
    this.contributorSortList  = ContributorConstants.CONTRIBUTOR_SORT_LIST;
    this.initialSortValue=this.contributorSortList.items[0].value;
    this.sortBy=null;
    this.filterFlag=false;
    this.resetSearch = true;
    this.searchValue = "";
    this.resetFilterForm = true;
    if (this.currentTab !== index) {
      this.currentTab = index;
      this.resetPage();
      if (index === 2) this.allContributorList = true;
      else this.allContributorList = false;
      this.changeContributorList(this.checkContributorType(),0);
    }
    this.clearFilterForm();
  }
  changeReset(){
    this.resetFilterForm=false;
  }

  /** Method to check contributor type. */
  checkContributorType(): string {
    return this.currentTab === 0
      ? SearchTypeEnum.ACTIVE
      : this.currentTab === 1
      ? SearchTypeEnum.INACTIVE
      : SearchTypeEnum.ALL;
  }

  /** Method to reset page. */
  resetPage() {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = '';
  }

  /** Method to fetch contributors. */
  paginateContributors(pageNumber: number): void {
    if (this.pageDetails.currentPage !== pageNumber) {
      this.pageDetails.currentPage = pageNumber;
      if(this.filterFlag){
        const status=this.checkContributorType();
        this.filterParams.pageNo=pageNumber;
        this.contributorWageService.getContributorFilterList(this.registrationNo,this.filterParams,true,status).subscribe(
          res => this.assembleContributorList(res),
          err => this.showError(err)
        );
      } else if (this.searchFlag && this.searchValue !== null) {
        this.changeContributorListOnSearch(this.checkContributorType(), pageNumber, this.searchValue);
      } else {
          this.changeContributorList(this.checkContributorType(), pageNumber);


      }
      
    }
  }

  /** Method to change contributor list.  */
  changeContributorList(searchParam: string, pageNo?: number, identifier?: string): void {
    this.alertService.clearAlerts();
    const params = new ContributorWageParams(null, null, searchParam, pageNo, 10, identifier,null,this.sortBy,this.sortOrder);
    //For setting default sortBy
    if (!params.sortBy)
    params.sortBy =
        searchParam === SearchTypeEnum.ALL ? 'LATEST_ENGAGEMENT_WITH_CONTRIBUTOR_NAME' : 'LATEST_ENGAGEMENT_WITH_CONTRIBUTOR_NAME';
    this.fetchContributorList(params).subscribe(
      res => this.assembleContributorList(res),
      err => this.showError(err)
    );
  }
  changeContributorListOnSearch(searchParam: string, pageNo?: number, identifier?: string){
    this.alertService.clearAlerts();
    const params = new ContributorWageParams(null, null, searchParam, pageNo, 10, identifier,null,this.sortBy,this.sortOrder);
    //For setting default sortBy
    if (!params.sortBy)
    params.sortBy =
        searchParam === SearchTypeEnum.ALL ? 'LATEST_ENGAGEMENT_WITH_CONTRIBUTOR_NAME' : 'LATEST_ENGAGEMENT_WITH_CONTRIBUTOR_NAME';
    this.fetchContributorList(params).subscribe(
      res =>this.assembleContributorListOnSearch(res),
      err => this.showError(err)
    );
  }

  /** Method to navigate to contributor profile */
  navigateToContProfile(sin: number): void {
    this.contributorService.isIndividualProfile = false;
    //Check whether contributor is valid (has valid identifiers).
    this.contributorService
      .getContributor(this.registrationNo, sin)
      .subscribe(() =>
        this.isAppPrivate
          ? this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_PROFILE_ENGAGEMENT(this.registrationNo, sin)])
          : this.router.navigate([ContributorRouteConstants.ROUTE_NORMAL_PROFILE(this.registrationNo, sin)])
      );
    err => this.showError(err);
  }

  /** Method to search contributor by identifier. */
  searchContributorByIdentifier(identifier: string) {
    if(this.resetSearch) {
      this.searchValue="";
    }else{
      this.searchFlag=true;
      this.searchValue=identifier;
    }

    this.resetPage();
    
    this.changeContributorListOnSearch(this.checkContributorType(), 0, this.searchValue);
  }
  onDownloadContributorList() {
    this.status = this.checkContributorType();
    if (this.selectedLang === LanguageEnum.ENGLISH)
      this.fileName =
      this.status === SearchTypeEnum.INACTIVE
        ? ContributorConstants.DOWNLOAD_INACTIVE_CONTRIBUTOR_FILE_NAME.english
        : (this.status === SearchTypeEnum.ACTIVE)
        ? ContributorConstants.DOWNLOAD_ACTIVE_CONTRIBUTOR_FILE_NAME.english
        : (this.status === SearchTypeEnum.ALL)
        ? ContributorConstants.DOWNLOAD_ALL_CONTRIBUTOR_LIST_FILE_NAME.english
        : ''
    else
      this.fileName =
      this.status === SearchTypeEnum.INACTIVE
        ? ContributorConstants.DOWNLOAD_INACTIVE_CONTRIBUTOR_FILE_NAME.arabic
        : (this.status === SearchTypeEnum.ACTIVE)
        ? ContributorConstants.DOWNLOAD_ACTIVE_CONTRIBUTOR_FILE_NAME.arabic
        : (this.status === SearchTypeEnum.ALL)
        ? ContributorConstants.DOWNLOAD_ALL_CONTRIBUTOR_LIST_FILE_NAME.arabic
        : ''
    this.contributorService
      .generateContributorReport(this.registrationNo, this.status, ExportType.PDF, this.selectedLang)
      .subscribe(data => {
        downloadFile(this.fileName, 'application/pdf', data);
      },
      err => {
        if (err?.status === 504 || err?.status === 400) {
          this.alertService.showErrorByKey('CONTRIBUTOR.FILE-TOO-LARGE-ERROR');

        }
      });
  }
  onPrintContributorList() {
    this.status = this.checkContributorType();
    this.contributorService
      .generateContributorReport(this.registrationNo, this.status, ExportType.PDF, this.selectedLang)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
      err => {
        if (err?.status === 504 || err?.status === 400) {
          this.alertService.showErrorByKey('CONTRIBUTOR.FILE-TOO-LARGE-ERROR');

        } else{
          this.alertService.showError(err.message);
        }
      })

  }
  onExcelContributorList() {
    this.status = this.checkContributorType();
    if (this.selectedLang === LanguageEnum.ENGLISH)
    this.fileName =
      this.status === SearchTypeEnum.INACTIVE
        ? ContributorConstants.DOWNLOAD_INACTIVE_CONTRIBUTOR_FILE_NAME.english
        : (this.status === SearchTypeEnum.ACTIVE)
        ? ContributorConstants.DOWNLOAD_ACTIVE_CONTRIBUTOR_FILE_NAME.english
        : (this.status === SearchTypeEnum.ALL)
        ? ContributorConstants.DOWNLOAD_ALL_CONTRIBUTOR_LIST_FILE_NAME.english
        : ''
    else
    this.fileName =
      this.status === SearchTypeEnum.INACTIVE
        ? ContributorConstants.DOWNLOAD_INACTIVE_CONTRIBUTOR_FILE_NAME.arabic
        : (this.status === SearchTypeEnum.ACTIVE)
        ? ContributorConstants.DOWNLOAD_ACTIVE_CONTRIBUTOR_FILE_NAME.arabic
        : (this.status === SearchTypeEnum.ALL)
        ? ContributorConstants.DOWNLOAD_ALL_CONTRIBUTOR_LIST_FILE_NAME.arabic
        : ''
        this.contributorService
      .generateContributorExcelReport(this.registrationNo, this.status, this.selectedLang)
      .subscribe(data => {
        downloadFile(this.fileName + '.xlsx', 'application/vnd.ms-excel', data);
      },
      err => {
        if (err?.status === 504 || err?.status === 400) {
          this.alertService.showErrorByKey('CONTRIBUTOR.FILE-TOO-LARGE-ERROR');

        } else {
          this.alertService.showError(err.message);
        }
      })

  }

  sortDirection(sortOrder) {
    if(!this.sortBy){
      this.sortBy = 'JoiningDate';
    }
    this.sortOrder = sortOrder;
    this.changeContributorList(this.checkContributorType());
  }
  sortedItem(contributorSortList:Lov ) {
        if(contributorSortList.value.english=== 'Joining Date' ||contributorSortList.value.arabic === '-'){
      this.sortBy = 'JoiningDate';
      this.changeContributorList(this.checkContributorType());
    }else if(contributorSortList.value.english=== 'Leaving Date' ||contributorSortList.value.arabic === '-'){
      this.sortBy = 'LeavingDate';
      this.changeContributorList(this.checkContributorType());
    }else if(contributorSortList.value.english=== 'Contributor Name' ||contributorSortList.value.arabic === '-'){
      this.sortBy = 'ContributorName';
      this.changeContributorList(this.checkContributorType());
    }else if(contributorSortList.value.english=== 'Wage' ||contributorSortList.value.arabic === '-'){
      this.sortBy = 'TotalWage';
      this.changeContributorList(this.checkContributorType());
    }else if(contributorSortList.value.english=== 'Nationality' ||contributorSortList.value.arabic === '-'){
      this.sortBy = 'Nationality';
      this.changeContributorList(this.checkContributorType());
    }
  }
  onResetFilter(){
    this.filterFlag=false;
    this.filterParams=null;
  }
  clearFilterForm() {
    this.filterFlag=false;
    this.contributorFilterForm.reset();
    this.joiningDateFormControl.reset();
    this.leavingDateFormControl.reset();
    this.wageSlider = new FormControl([this.floorWage, this.ceilWage]);
    this.selectedNationalityOptions = [];
    this.selectedOccupationOptions = [];
    
  }



}
