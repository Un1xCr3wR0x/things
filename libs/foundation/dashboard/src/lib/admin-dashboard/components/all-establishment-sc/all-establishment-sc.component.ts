/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {
  AppConstants,
  AuthTokenService,
  BaseComponent,
  Establishment,
  GosiScope,
  JWTPayload,
  LanguageEnum,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  MenuService,
  RegistrationNoToken,
  RegistrationNumber,
  RoleIdEnum,
  RouterConstants,
  SortDirectionEnum,
  StorageService
} from '@gosi-ui/core';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import {
  DashboardBaseService,
  EstablishmentSortConstants,
  RequestFilter,
  RequestSort,
  SearchRequest
} from '@gosi-ui/foundation-dashboard/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, fromEvent, noop, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { BranchDetailsWrapper, EstablishmentList, EstablishmentSearchResponse, EstablishmentStarredList } from '../../models';
import { DashboardService } from '../../services';

@Component({
  selector: 'dsb-all-establishment-sc',
  templateUrl: './all-establishment-sc.component.html',
  styleUrls: ['./all-establishment-sc.component.scss']
})
export class AllEstablishmentScComponent extends BaseComponent implements OnInit {
  @ViewChild('warningTemplate', { static: false }) warningTemplate: TemplateRef<HTMLElement>;
  /**
   * local variables
   */
  fetchBranches = false;
  establishmentList = [];
  estData: Establishment[] = [];
  estListRequest = new SearchRequest();
  lang = 'en';
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  pageSize = 6;
  totalCount = 0;
  token: JWTPayload;
  gosiScope: GosiScope[] = [];
  isEstablishmentListLoading = true;
  hasEstablishmentListError = false;
  villageLocationList$: Observable<LovList>;
  modalRef: BsModalRef;
  width = window.innerWidth;
  certificateRequired = false;
  isShowCES: boolean;
  isSuperAdmin = false;
  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly dashboardService: DashboardService,
    readonly dashboardBaseService: DashboardBaseService,
    readonly authService: AuthTokenService,
    readonly lookUpService: LookupService,
    readonly storageService: StorageService,
    readonly menuService: MenuService,
    readonly authTokenService: AuthTokenService,
    readonly modalService: BsModalService,
    readonly changePersonService: ChangePersonService,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
  ) {
    super();
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.width = window.innerWidth;
        })
      )
      .subscribe();
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.storageService.clearSession();
    this.establishmentRegistrationNo.value = null;
    this.token = this.authService.decodeToken(this.authService.getAuthToken());
    this.gosiScope = this.authService.getEntitlements();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.lang = lang;
      this.sortVillageList();
    });
    this.initiateRequest();
    this.getEstablishmentList();
    this.getVillageLocationList();
    this.changePersonService.getEstablishmentProfileDetails().subscribe(
      response => {
        this.isShowCES = true;
      },
      err => {
        if (err?.error?.code == 'PM-ERR-0001') {
          this.isShowCES = false;
        } else {
          this.isShowCES = true;
        }
      }
    );
  }
  /**
   * method to initiate requests
   */
  initiateRequest() {
    this.estListRequest.limit.pageNo = this.currentPage - 1;
    this.estListRequest.limit.pageSize = this.pageSize;
    this.estListRequest.sort = new RequestSort();
    this.estListRequest.sort.column = EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT[0].column;
    this.estListRequest.sort.direction = SortDirectionEnum.DESCENDING;

    if (this.token) {
      this.estListRequest.searchParam.personIdentifier = Number(this.token.uid);
      setTimeout(() => {
        this.getBranchList(this.estListRequest);
      }, 500);
    }
  }
  /**
   * method to get establishment lists
   */
  getEstablishmentList() {
    this.isEstablishmentListLoading = true;
    this.hasEstablishmentListError = false;
    this.estData = [];
    if (this.estListRequest.searchParam.registrationNo) {
      if (this.gosiScope?.length > 0) {
        const establishment = this.gosiScope.find(
          item => item.establishment === this.estListRequest.searchParam.registrationNo
        );
        if (establishment) {
          console.log("the est in first if ",establishment);
          if (establishment.role.find(item => item === RoleIdEnum.SUPER_ADMIN)){
            // console.log("the est in first if ",establishment);

            this.fetchBranches = false;
            // this.isSuperAdmin = true;
            // console.log(this.isSuperAdmin);
          }

          else this.fetchBranches = true;
          this.isSuperAdmin = true;

        }
      }
    } else {
      if (this.menuService.getRoles().find(item => item === RoleIdEnum.SUPER_ADMIN.toString()))
        this.fetchBranches = false;
      else this.fetchBranches = true;
    }
    setTimeout(() => {
      this.getDashboardData();
    }, 2000);
  }
  getDashboardData() {
    this.dashboardService
      .getDashboardEstablishmentList(this.estListRequest, this.fetchBranches)
      .pipe(
        tap((response: EstablishmentSearchResponse) => {
          response.listOfEstablishmentDetails.forEach(item => {
            item.isCertificateEligible = null;
            item.isAuthorized = false;
            item.isCertificateAuthorized = false;
            item.isBillDashboardAuthorized = false;
            const scope = this.gosiScope.find(value => Number(value.establishment) === item.registrationNo);
            if (scope) {
              item.isAuthorized = true;
            }
            if (
              scope &&
              scope?.role
                ?.map(roleId => Number(roleId))
                ?.find(roleId => roleId === RoleIdEnum.SUPER_ADMIN || roleId === RoleIdEnum.BRANCH_ADMIN)
            ) {
              item.isCertificateAuthorized = true;
            }
            if (
              scope &&
              scope?.role
                ?.map(roleId => Number(roleId))
                ?.find(
                  roleId =>
                    roleId === RoleIdEnum.SUPER_ADMIN ||
                    roleId === RoleIdEnum.BRANCH_ADMIN ||
                    roleId === RoleIdEnum.GCC_ADMIN
                )
            ) {
              item.isBillDashboardAuthorized = true;
            }
            if (item.isAuthorized) {
              // if (item.isBillDashboardAuthorized) {
              //   item.isBalanceLoading = true;
              //   this.dashboardBaseService.getBillingDetails(item.registrationNo).subscribe(
              //     bill => {
              //       item.billDetails = bill;
              //       item.isBalanceLoading = false;
              //     },
              //     () => {
              //       item.isBalanceLoading = false;
              //     }
              //   );
              // }

              if (item.isCertificateAuthorized && !item.gccCountry && this.certificateRequired) {
                item.isCertificateLoading = true;
                this.dashboardBaseService.getEstablishmentCertificateStatus(item.registrationNo).subscribe(
                  certificate => {
                    item.isCertificateEligible = certificate.isEligible;
                    item.isCertificateLoading = false;
                  },
                  () => {
                    item.isCertificateLoading = false;
                  }
                );
              }
            }
          });
        })
      )
      .subscribe(
        (res: EstablishmentSearchResponse) => {
          this.estData = this.sortEstablishmentsList(res.listOfEstablishmentDetails);
          this.totalCount = res.totalRecords;
          this.isEstablishmentListLoading = false;
        },
        error => {
          this.totalCount = 0;
          this.estData = [];
          if (error.status !== 400) this.hasEstablishmentListError = true;
          else this.hasEstablishmentListError = false;
          this.isEstablishmentListLoading = false;
        }
      );
  }
  /**
   *
   *  navigate to the branch screen
   */
  navigateToBranch(establishment: EstablishmentList) {
    if (establishment?.ppaEstablishment) {
      this.menuService.isPpaEstablishment = true;
    } else {
      this.menuService.isPpaEstablishment = false;
    }
    this.navigateToPage(
      establishment,
      RouterConstants.ROUTE_ESTABLISHMENT_PROFILE(
        establishment.registrationNo,
        this.estListRequest.searchParam.personIdentifier
      )
    );
  }
  /**
   *
   *  navigate to health insurance
   */
  navigateToHealthInsurance(establishment: EstablishmentList) {
    this.navigateToPage(
      establishment,
      RouterConstants.ROUTE_ESTABLISHMENT_HEALTH_INSURANCE(
        establishment.registrationNo
      )
    );
  }
  /**
   *
   *  navigate to the certificate screen
   */
  navigateToComplaints(establishment) {
    this.router.navigate(['home/complaints/register/register-complaint'], {
      queryParams: {
        registrationNo: establishment.registrationNo,
        personIdentifier: this.estListRequest.searchParam.personIdentifier
      }
    });
  }
  navigateToCertificateView(establishment: EstablishmentList) {
    if (!establishment.gccCountry) {
      if (establishment.isCertificateAuthorized)
        this.navigateToPage(
          establishment,
          RouterConstants.ROUTE_ESTABLISHMENT_CERTIFICATE(establishment.registrationNo)
        );
    }
  }
  /**
   * navigate to the billing screen
   */
  navigateToBillingView(establishment: EstablishmentList) {
    if (establishment.isBillDashboardAuthorized)
      this.navigateToPage(establishment, RouterConstants.ROUTE_BILL_DASHBOARD);
  }
  /**
   * method to get branch list
   */
  getBranchList(estListRequest: SearchRequest) {
    this.dashboardService
      .getBranchList(estListRequest)
      .pipe(
        tap((res: BranchDetailsWrapper) => {
          this.establishmentList.push({
            name: { arabic: 'جميع المنشآت', english: 'All Establishments' },
            registrationNo: null
          });
          res.branchList.forEach(item => {
            this.establishmentList.push({
              name: item.name,
              count: item.noOfBranches,
              registrationNo: item.registrationNo
            });
          });
        }),
        catchError(err => {
          if (err.status === 400) {
            this.establishmentList = [];
          } else if (err.status !== 400) {
          }
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /**
   * This method is to select page.
   *
   */
  selectPage(page: number): void {
    this.currentPage = this.pageDetails.currentPage = page;
    this.estListRequest.limit.pageNo = page - 1;
    this.getEstablishmentList();
  }
  /**
   * method to search establishment
   */
  searchEstablishments(searchValue: string) {
    if (searchValue?.length === 0) {
      this.estListRequest.searchKey = null;
    } else {
      this.estListRequest.searchKey = searchValue;
    }
    this.resetPagination();
    this.getEstablishmentList();
  }
  /**
   *
   * @param registrationNo method to get selected establishment
   */
  selectedEstablishment(registrationNo: number) {
    this.estListRequest.searchParam.registrationNo = registrationNo;
    this.resetPagination();
    this.getEstablishmentList();
  }
  /**
   * method for sorting
   * @param sortItem
   */
  onSort(sortItem: RequestSort) {
    this.resetPagination();
    if (this.estListRequest) this.estListRequest.sort = sortItem;
    this.getEstablishmentList();
  }
  getVillageLocationList() {
    this.villageLocationList$ = this.lookUpService.getCityList().pipe(
      map((locationList: LovList) => {
        if (locationList) {
          const villageList = new LovList([]);
          villageList.errorMessage = locationList.errorMessage;
          villageList.hasError = locationList.hasError;
          locationList.items.forEach(values => {
            const village: Lov = new Lov();
            village.code = values.code;
            village.sequence = values.sequence;
            village.value.arabic = values.value.arabic.trim();
            village.value.english = values.value.english.trim();
            villageList.items.push(village);
          });
          return villageList;
        }
      })
    );
    this.sortVillageList();
  }
  sortVillageList() {
    if (this.villageLocationList$)
      this.villageLocationList$ = this.villageLocationList$.pipe(takeUntil(this.destroy$)).pipe(
        map(res => {
          if (res) {
            if (this.lang === LanguageEnum.ENGLISH)
              res.items = res.items.sort((v1, v2) =>
                v1.value.english.localeCompare(v2.value.english, [LanguageEnum.ENGLISH])
              );
            else
              res.items = res.items.sort((v1, v2) =>
                v1.value.arabic.localeCompare(v2.value.arabic, [LanguageEnum.ARABIC])
              );
            return res;
          }
        })
      );
  }
  onFilter(locationFilter: RequestFilter) {
    if (this.estListRequest) {
      this.resetPagination();
      this.estListRequest.filter = locationFilter;
      this.getEstablishmentList();
    }
  }
  resetPagination() {
    this.pageDetails = {
      currentPage: 1,
      goToPage: '1'
    };
    this.currentPage = 1;
    this.estListRequest.limit = { pageNo: 0, pageSize: 6 };
  }
  navigateTourl(establishment: EstablishmentList, url: string) {
    this.router.navigate([url]);
  }
  navigateToPage(establishment: EstablishmentList, url: string) {
    if (establishment.isAuthorized) {
      this.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, establishment.registrationNo);
      this.establishmentRegistrationNo.value = establishment.registrationNo;
      this.establishmentRegistrationNo.isGcc = establishment.gccCountry;
      this.router.navigate([url]);
    } else {
      this.showModal();
    }
  }
  closeModal() {
    this.modalService.hide();
  }
  private showModal() {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-md modal-dialog-centered` };
    this.modalRef = this.modalService.show(this.warningTemplate, config);
  }
  addRemoveEstablishmentFromFavorite(establishment: EstablishmentList){
    let regNo = new EstablishmentStarredList
    regNo.registrationNumbers.push(establishment.registrationNo)
    if(establishment.starred===false){
      this.dashboardService.postStarredEstablishment(regNo, Number(this.token.uid))
      .subscribe(()=>{this.getDashboardData()}, noop);
    }else{
      this.dashboardService.deleteStarredEstablishment(regNo, Number(this.token.uid))
      .subscribe(()=>{this.getDashboardData()}, noop);
    }
  }
  sortEstablishmentsList(establishmentList:Establishment[]){
    return establishmentList.sort((a, b) => (a.starred === b.starred) ? 0 : a.starred ? -1 : 1);
  }
}
