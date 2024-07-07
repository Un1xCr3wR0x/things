import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  PaymentService,
  AdjustmentService,
  BenefitDetails,
  AdjustmentLookupService,
  AdjustmentConstants,
  PaymentRoutesEnum,
  SORT_ADJUSTMENT_LOV_VALUE_DATE_CREATED,
  SORT_ADJUSTMENT_LOV_VALUE_ADJUSTMENT_AMOUNT,
  SORT_ADJUSTMENT_LOV_VALUE_ADJUSTMENT_ID,
  SORT_ADJUSTMENT_LOV_VALUE_MONTHLY_DEDUCTION,
  SORT_ADJUSTMENT_LOV_VALUE_BALANCE_AMOUNT,
  AdjustmentQueryParams,
  AdjustmentSortValuesEnum,
  EligibilityCheckStatus,
  ThirdpartyAdjustmentService,
  AdjustmentDetailsFilter,
  EligibilityDetails,
  Adjustment,
  AdjustmentDetails
} from '../../../shared';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  LovList,
  AlertService,
  RouterDataToken,
  RouterData,
  Lov,
  DropdownItem,
  BilingualText,
  SortDirectionEnum,
  FilterKeyValue,
  FilterKeyEnum,
  Alert,
  IdentityTypeEnum,
  NIN,
  getIdentityByType,
  CoreAdjustmentService,
  CoreActiveBenefits,
  CoreContributorService,
  CoreBenefitService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'pmt-adjustment-details-sc',
  templateUrl: './adjustment-details-sc.component.html',
  styleUrls: ['./adjustment-details-sc.component.scss']
})
export class AdjustmentDetailsScComponent implements OnInit, OnDestroy {
  /** Local Variables */
  activeAdjustments: AdjustmentDetails;
  adjustmentModificationEligibilty: Boolean = false;
  adjustmentDetails: Adjustment[];
  adjustmentEligibilityWarningList: BilingualText[];
  gosiAdjustmentSort: Observable<LovList>;
  identifier: number;
  benefitList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  adjustFilter: AdjustmentDetailsFilter = new AdjustmentDetailsFilter();
  tpaAdjustmentQueryParams: AdjustmentQueryParams = new AdjustmentQueryParams();
  tpaAdjustmentFilters: FilterKeyValue[] = [];
  adjustmentId: number;
  beneficiaries: BenefitDetails[];
  benefitTypeList: LovList = new LovList([]);
  direction = 'ASCENDING';
  enablePayOnline = false;
  payAdjustmentEligible: boolean;
  debit: boolean;
  netAdjustments: AdjustmentDetails;
  netAdjustmentAmount: number;
  netTpaAdjustments: AdjustmentDetails;
  monthlyAdjustmentAmount: number;
  activeAdjustmentsExist = false;
  adjustmentTabs: DropdownItem[] = AdjustmentConstants.ADJUSTMENT_TABS;
  routeToSanedList: string;
  routeToView = PaymentRoutesEnum.ADJUSTMENT_HOME;
  selectedTab = AdjustmentConstants.ADJUSTMENT_TABS[0].id;
  gosiTpaAdjustmentSort: Observable<LovList>;
  tpaAdjustmentDetails: Adjustment[];
  tpaBenefitTypeLovList: LovList;
  tpaRequestedByLovList: LovList;
  tpaAdjustmentStatus: BilingualText[];
  hideAddBtn: boolean;
  tpaSearchValue: string;
  tpaSortBy: Lov;
  tpaSortByinit: BilingualText = SORT_ADJUSTMENT_LOV_VALUE_DATE_CREATED;
  tpaSortOrder: string = AdjustmentSortValuesEnum.ASCENDING;
  elibilityResponse: EligibilityDetails;
  eligibilityWarningMsg: Alert;
  gosiEligibilityWarningMsg: Alert;
  gosiWorkflowMsg: Alert;
  alertFlag = false;
  showWarning: boolean;
  popupFlag = false;
  ninId: number;
  modalRef: BsModalRef;
  sin: number;
  constructor(
    readonly paymentService: PaymentService,
    readonly adjustmentService: AdjustmentService,
    readonly tpaService: ThirdpartyAdjustmentService,
    readonly adjustmentLookupService: AdjustmentLookupService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly contributorService: CoreContributorService,
    readonly coreBenefitService: CoreBenefitService,
    readonly location: Location,
    readonly modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(res => {
      if (res['identifier']) this.identifier = res['identifier'];
      if (res['sin']) this.sin = res['sin'];
      if (res[AdjustmentConstants.From] === AdjustmentConstants.BENEFITS)
        this.routeToView = PaymentRoutesEnum.BENEFITS_VALIDATOR_SANED;
      else if (res[AdjustmentConstants.From] === AdjustmentConstants.ENGAGEMENT_CHANGE)
        this.routeToView = PaymentRoutesEnum.BENEFITS_ENGAGEMENT_CHANGE;
      else if (res[AdjustmentConstants.From] === AdjustmentConstants.REJOINING)
        this.routeToView = PaymentRoutesEnum.BENEFITS_REJOINING;
      else if (res[AdjustmentConstants.From] === AdjustmentConstants.SANED_LIST)
        this.routeToSanedList = AdjustmentConstants.BENEFITS_SANED_LIST(res['sinNo']);
      else if (res[AdjustmentConstants.From] === AdjustmentConstants.ADJUSTMENT_DETAIL)
        this.routeToView = PaymentRoutesEnum.VALIDATOR_VIEW_MANAGE_TPA;
      else if (res[AdjustmentConstants.From] === AdjustmentConstants.DISABILITY_ASSESSMENT)
        this.routeToView = PaymentRoutesEnum.VALIDATOR_DISABILITY_ASSESSMENT;
      else if (res[AdjustmentConstants.From] === AdjustmentConstants.HEIR_RECALCULATION)
        this.routeToView = PaymentRoutesEnum.HEIR_ROUTE;
      else if (res[AdjustmentConstants.From] === AdjustmentConstants.PENSION_ACTIVE) {
        this.routeToView = PaymentRoutesEnum.ROUTE_MODIFY_RETIREMENT;
      } else if (res[AdjustmentConstants.From] === AdjustmentConstants.IMPRISONMENT_MODIFY) {
        this.routeToView = PaymentRoutesEnum.VALIDATOR_IMPRISONMENT_MODIFY;
      } else if (res[AdjustmentConstants.From] === AdjustmentConstants.RESTART_CONTRIBUTOR) {
        this.routeToView = PaymentRoutesEnum.VALIDATOR_RESTART_CONTRIBUTOR;
      } else if (res[AdjustmentConstants.From] === AdjustmentConstants.STOP_CONTRIBUTOR) {
        this.routeToView = PaymentRoutesEnum.VALIDATOR_STOP_CONTRIBUTOR;
      } else if (res[AdjustmentConstants.From] === AdjustmentConstants.MODIFY_PAYEE) {
        this.routeToView = PaymentRoutesEnum.VALIDATOR_MODIFY_PAYEE;
      } else if (res[AdjustmentConstants.From] === AdjustmentConstants.HEIR_ACTIVE) {
        this.routeToView = PaymentRoutesEnum.ROUTE_ACTIVE_HEIR_DETAILS;
      }
    });
    if (!this.identifier && this.coreAdjustmentService.identifier) {
      this.identifier = this.coreAdjustmentService.identifier;
    }
    if (this.coreAdjustmentService?.sin) {
      this.sin = this.coreAdjustmentService?.sin;
    }
    if (!this.identifier && !this.coreAdjustmentService.identifier) {
      this.navigateBack();
    }
    this.selectTab(+this.adjustmentService.activeTab);
    this.adjustmentId = this.adjustmentService.adjustmentId;
    this.gosiAdjustmentSort = this.adjustmentLookupService.getGosiAdjustmentSortLov();
    this.gosiTpaAdjustmentSort = this.adjustmentLookupService.getTpaAdjustmentSortLov();
    this.getAdjustmentDetailService();
    this.getTpaAdjustmentsDetails();
    this.getTpaElibilityDetails(this.identifier);
    this.adjustmentByEligible();
    this.getBeneficiaryList();
    this.getPersonDetails();
  }

  /**The method to call the Adjustment details */
  getAdjustmentDetailService() {
    this.adjustmentService.setPageName('ADJUSTMENT_DETAILS_MAIN');
    this.adjustmentService.adjustmentDetails(this.identifier, this.sin).subscribe(data => {
      this.adjustmentDetails = data.adjustments;
      this.payAdjustmentEligible = data.payAdjustmentEligible;
      this.debit = data.debit;
      this.netAdjustments = data;
    });
    this.adjustmentService
      .getAdjustmentsByDualStatus(this.identifier, AdjustmentConstants.ACTIVE, AdjustmentConstants.NEW, this.sin)
      .subscribe(adjustmentDetail => {
        if (adjustmentDetail && adjustmentDetail.adjustments && adjustmentDetail.adjustments.length)
          this.activeAdjustmentsExist = true;
      });
  }

  // fetch adjsutment Details
  getAdjsutmentFilterDetails() {
    this.adjustmentService.getAdjustByDetail(this.identifier, this.adjustFilter, this.sin).subscribe(
      res => {
        this.adjustmentDetails = res.adjustments;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /**The method to check the adjustment eligible */
  adjustmentByEligible() {
    this.adjustmentService.getAdjustmentByeligible(this.identifier, this.sin).subscribe(data => {
      this.adjustmentModificationEligibilty = data.eligible;
      this.adjustmentEligibilityWarningList = data.gosiAdjustmentErrorMessages;
    });
  }
  /** Method to get person details */
  getPersonDetails() {
    this.adjustmentService.getPerson(this.identifier).subscribe(res => {
      this.ninId = getIdentityByType(res.identity, res.nationality.english).id;
      this.getPayment();
    });
  }
  /** Method to get payment details */
  getPayment() {
    this.paymentService.fetchPaymentdetails(this.ninId, this.sin).subscribe(
      () => {
        this.enablePayOnline = true;
      },
      () => {
        this.enablePayOnline = false;
      }
    );
  }
  getBeneficiaryList() {
    const benefitItem: Lov[] = [];
    this.adjustmentService.getBeneficiaryList(this.identifier, this.sin).subscribe(res => {
      this.beneficiaries = res.beneficiaryBenefitList;
      this.adjustmentService.setSourseId(this.beneficiaries);
      if (this.beneficiaries) {
        this.beneficiaries.map((data, index) => {
          benefitItem.push({ value: data.benefitType, sequence: index, code: index });
          this.benefitList.next(new LovList(benefitItem));
        });
      }
    });
  }

  filterTransactions(adjustFilter: AdjustmentDetailsFilter) {
    this.adjustFilter = { ...this.adjustFilter, ...adjustFilter };
    this.adjustFilter.identifier = this.identifier;
    this.getAdjsutmentFilterDetails();
  }

  sortOrder(order) {
    if (order === 'DESC') {
      this.direction = 'DESCENDING';
    } else {
      this.direction = 'ASCENDING';
    }
    this.adjustFilter.sortType = this.direction;
    if (this.adjustFilter.adjustmentSortParam) this.filterTransactions(this.adjustFilter);
  }

  sortList(selectedItem) {
    if (selectedItem.value.english === 'Date Created') {
      this.adjustFilter.adjustmentSortParam = 'DATE_CREATED';
    } else if (selectedItem.value.english === 'Benefit Request Date') {
      this.adjustFilter.adjustmentSortParam = 'BENEFIT_REQUEST_DATE';
    } else if (selectedItem.value.english === 'Adjustment Amount') {
      this.adjustFilter.adjustmentSortParam = 'ADJUSTMENT_AMOUNT';
    }
    this.adjustFilter.sortType = this.direction;
    this.filterTransactions(this.adjustFilter);
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err.error.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err.error.message);
    }
  }

  navigateToAddModify() {
    this.coreAdjustmentService.benefitType = null;
    this.coreAdjustmentService.identifier = this.identifier;
    this.coreAdjustmentService.sin = this.sin;
    this.router.navigate(['/home/adjustment/add-modify']);
  }

  navigateToCreate() {
    this.coreAdjustmentService.benefitType = null;
    this.router.navigate(['/home/adjustment/create']);
  }

  navigateBack() {
    this.router.navigate([PaymentRoutesEnum.ADJUSTMENT_HOME]);
  }

  navigateToAdjustment(adjustmentId: number) {
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: {
        adjustmentId: adjustmentId
      }
    });
  }
  navigateToTpaView(adjustmentId: number) {
    this.router.navigate([PaymentRoutesEnum.THIRD_PARTY_ADJUSTMENT_DETAIL], {
      queryParams: {
        adjustmentId: adjustmentId
      }
    });
  }
  navigateToBenefitDetails(benefit) {
    this.coreAdjustmentService.benefitType = benefit?.benefitType?.english;
    this.coreAdjustmentService.benefitDetails = benefit;
    this.contributorService.personId = this.identifier;
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(benefit?.sin, benefit?.benefitRequestId, benefit?.benefitType, null)
    );
    this.router.navigate([PaymentRoutesEnum.ROUTE_MODIFY_RETIREMENT]);
  }

  navigateToPayAdjustment() {
    this.coreAdjustmentService.identifier = this.identifier;
    this.coreAdjustmentService.sin = this.sin;
    this.router.navigate([PaymentRoutesEnum.PAY_ADJUSTMENT], { queryParams: { isNew: true } });
  }
  /** Method to navigate to pay online */
  navigateToPayOnline() {
    this.coreAdjustmentService.sin = this.sin;
    this.router.navigate([PaymentRoutesEnum.PAY_ONLINE], { queryParams: { identifier: this.ninId } });
  }
  /**
   * Method to handle the tab select event
   * @param tabItem
   */
  selectTab(tabId: number) {
    this.selectedTab = tabId;
    this.adjustmentService.activeTab = tabId;
    if (+tabId === 1) {
      this.alertFlag = true;
    } else {
      this.alertFlag = false;
    }
  }

  // Method to navigate to thirdparty adjutment screen
  navigateToThirdpartyAddModifyDet(key) {
    if (key === true) this.router.navigate([PaymentRoutesEnum.MAINTAIN_THIRDPARTY]);
    else this.router.navigate([PaymentRoutesEnum.ADD_THIRDPARTY]);
  }

  /**
   * Method to get the third party adjustment list
   */
  getTpaAdjustmentsDetails() {
    this.tpaAdjustmentQueryParams = new AdjustmentQueryParams();
    this.tpaAdjustmentQueryParams.sortType = this.tpaSortOrder;
    this.tpaAdjustmentQueryParams.adjustmentSortParam = this.getSortByValue(this.tpaSortByinit.english);
    this.tpaService.getTpaAdjustmentsDetails(this.identifier, this.tpaAdjustmentQueryParams, this.sin).subscribe(
      data => {
        this.tpaAdjustmentDetails = data.adjustments;
        this.debit = data.debit;
        this.netTpaAdjustments = data;
        this.monthlyAdjustmentAmount = data.netMonthlyDeductionAmount;
        const tpaBenefitTypeLovList = new LovList([]);
        const tpaRequestedByLovList = new LovList([]);
        const tpaAdjustmentStatus = [];
        this.tpaAdjustmentDetails.forEach(adjustment => {
          if (!tpaBenefitTypeLovList.items.some(item => item.value?.english === adjustment.benefitType?.english)) {
            const lov = new Lov();
            lov.sequence = tpaBenefitTypeLovList.items?.length;
            lov.value = adjustment.benefitType;
            tpaBenefitTypeLovList.items.push(lov);
          }
          if (!tpaRequestedByLovList.items.some(item => item.value?.english === adjustment.requestedBy?.english)) {
            const lov = new Lov();
            lov.sequence = tpaRequestedByLovList.items?.length;
            lov.value = adjustment.requestedBy;
            tpaRequestedByLovList.items.push(lov);
          }
          if (!tpaAdjustmentStatus.some(item => item?.english === adjustment?.adjustmentStatus?.english)) {
            tpaAdjustmentStatus.push(adjustment?.adjustmentStatus);
          }
        });
        this.tpaBenefitTypeLovList = tpaBenefitTypeLovList;
        this.tpaAdjustmentStatus = tpaAdjustmentStatus;
        this.tpaRequestedByLovList = tpaRequestedByLovList;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /**
   * method to filter the tpa lsit
   * @param filters
   * @param searchValue
   * @param sortBy
   * @param sortOrder
   */
  getFilteredTpaAdjsutmentDetails(filters: FilterKeyValue[], searchValue: string, sortBy: Lov, sortOrder: string) {
    this.tpaAdjustmentFilters = filters;
    this.tpaAdjustmentQueryParams = new AdjustmentQueryParams();
    if (filters.length > 0) {
      this.tpaAdjustmentQueryParams.benefitType = filters
        .filter(item => item.key === FilterKeyEnum.BENEFITE_TYPE)[0]
        ?.bilingualValues?.map(value => value.english);
      this.tpaAdjustmentQueryParams.requestedBy = filters
        .filter(item => item.key === FilterKeyEnum.REQUESTED_BY)[0]
        ?.bilingualValues?.map(value => value.english);
      this.tpaAdjustmentQueryParams.status = filters
        .filter(item => item.key === FilterKeyEnum.STATUS)[0]
        ?.bilingualValues?.map(value => value.english);
    }
    this.tpaSearchValue = searchValue;
    if (searchValue) {
      this.tpaAdjustmentQueryParams.adjustmentId = searchValue;
    }
    this.tpaSortBy = sortBy;
    this.tpaAdjustmentQueryParams.adjustmentSortParam = this.getSortByValue(sortBy?.value?.english);
    this.tpaSortOrder = sortOrder || this.tpaSortOrder;
    this.tpaAdjustmentQueryParams.sortType =
      this.tpaSortOrder === SortDirectionEnum.DESCENDING
        ? AdjustmentSortValuesEnum.DESCENDING
        : AdjustmentSortValuesEnum.ASCENDING;

    this.tpaService
      .getTpaAdjustmentsDetails(this.identifier, this.tpaAdjustmentQueryParams, this.sin)
      .subscribe(data => {
        this.tpaAdjustmentDetails = data.adjustments;
      });
  }

  /**
   * method to get the sort value
   * @param sortBy
   */
  getSortByValue(sortBy: string): string {
    return sortBy === SORT_ADJUSTMENT_LOV_VALUE_DATE_CREATED.english
      ? AdjustmentSortValuesEnum.DATE_CREATED
      : sortBy === SORT_ADJUSTMENT_LOV_VALUE_ADJUSTMENT_ID.english
      ? AdjustmentSortValuesEnum.ADJUSTMENT_ID
      : sortBy === SORT_ADJUSTMENT_LOV_VALUE_ADJUSTMENT_AMOUNT.english
      ? AdjustmentSortValuesEnum.ADJUSTMENT_AMOUNT
      : sortBy === SORT_ADJUSTMENT_LOV_VALUE_MONTHLY_DEDUCTION.english
      ? AdjustmentSortValuesEnum.MONTHLY_DEDUCTION
      : sortBy === SORT_ADJUSTMENT_LOV_VALUE_BALANCE_AMOUNT.english
      ? AdjustmentSortValuesEnum.BALANCE_AMOUNT
      : this.getSortByValue(this.tpaSortByinit?.english);
  }
  // This method is used to fetch eligilibility details for third party.
  getTpaElibilityDetails(identifier) {
    this.tpaService.getTpaEligibility(identifier, this.sin).subscribe(res => {
      this.elibilityResponse = res;
      const enableActionStatus = this.elibilityResponse.eligibility.find(
        status => status.key === EligibilityCheckStatus.ENABLEACTION
      );
      const warningStatus = this.elibilityResponse.eligibility.find(
        status => status.key === EligibilityCheckStatus.HASWARNING
      );
      if (enableActionStatus.eligible === false) {
        this.popupFlag = true;
        this.gosiWorkflowMsg = this.tpaService.mapMessagesToAlert(enableActionStatus?.messages);
      }

      if (warningStatus.eligible) {
        this.showWarning = true;
        this.eligibilityWarningMsg = this.tpaService.mapMessagesToAlert(warningStatus.messages);
      }
    });
  }
  navigateToTpaDetailsPage(id) {
    this.router.navigate([PaymentRoutesEnum.THIRD_PARTY_ADJUSTMENT_DETAIL], {
      queryParams: {
        adjustmentId: id
      }
    });
  }
  /** To close all error alerts on leaving the component */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
  showEligibilityWarning(eligibilityTemplate) {
    this.modalRef = this.modalService.show(eligibilityTemplate, Object.assign({}, { class: 'modal-md' }));
    this.gosiEligibilityWarningMsg = this.tpaService.mapMessagesToAlert({
      details: this.adjustmentEligibilityWarningList,
      message: null
    });
  }
  navigateToPrevious() {
    this.location.back();
  }
}
