import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AdjustmentPopupDcComponent,
  BenefitConstants,
  BenefitDetails,
  DirectPaymentHistory,
  DirectPaymentHistoryFilter,
  DirectPaymentService,
  ManageBenefitService,
  SanedBenefitService
} from '../../shared';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  CoreActiveBenefits,
  CoreAdjustmentService,
  CoreBenefitService,
  FilterKeyEnum,
  FilterKeyValue,
  Lov,
  LovList
} from '@gosi-ui/core';
import { CoreContributorService } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { PayeType } from '../../shared/enum/payee-type';
@Component({
  selector: 'bnt-direct-payment-history-sc',
  templateUrl: './direct-payment-history-sc.component.html',
  styleUrls: ['./direct-payment-history-sc.component.scss']
})
export class DirectPaymentHistoryScComponent implements OnInit {
  lang = 'en';
  payeeTypes = PayeType;
  directPaymentHistory: DirectPaymentHistory[];
  sin: number;
  appliedFilter: FilterKeyValue[] = new Array<FilterKeyValue>();
  clearHistoryFilter: DirectPaymentHistoryFilter = new DirectPaymentHistoryFilter();
  hasFiltered: boolean;
  commonModalRef: BsModalRef;
  benefitCalculation: BenefitDetails;
  paymentTypesList$: Observable<LovList>;
  paymentStatusList$: Observable<LovList>;
  benefitTypeList: LovList;
  constructor(
    private directPaymentService: DirectPaymentService,
    private manageBenefitService: ManageBenefitService,
    private contributorService: CoreContributorService,
    private coreBenefitService: CoreBenefitService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly modalService: BsModalService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly router: Router,
    readonly route: ActivatedRoute
  ) {}
  

  ngOnInit(): void {
    //  this.route.paramMap.subscribe(params => {
    //    this.sin = +params.get('personId');
    // })
    // Access state from router state
    this.route.parent.paramMap.subscribe(params => {
      this.sin = +params.get('personId');
    });
    // this.sin =
    // this.contributorService.selectedSIN ||
    // (this.contributorService?.NINDetails?.length > 0 ? this.contributorService?.NINDetails[0]?.newNin : null);
  this.getDirectPaymentHistory(this.sin);
  //this.getBenefits(this.sin);
  //this.paymentTypesList$ = this.manageBenefitService.getPaymentFilterEventType();
  this.paymentTypesList$ = this.getPaymentFilterEventType();
  this.paymentStatusList$ = this.manageBenefitService.getPaymentFilterStatusTypes();
  }
  getPaymentFilterEventType() {
    return of(
      new LovList([
        {
          sequence: 1,
          value: { english: 'Benefit', arabic: 'المنفعة' }
        },
        {
          sequence: 2,
          value: { english: 'Adjustment', arabic: 'الفروقات' }
        }
      ])
    );
  }

  getPaymentBenefitTypes(history: DirectPaymentHistory[]) {
    return this.manageBenefitService.getPaymentFilterBenefitType().pipe(
      switchMap(res => {
        const lovArray: Lov[] = [];
        const filteredItems = res.items.filter(lov =>
          history.some(hist => hist.history.some(value => lov?.value?.english === value?.benefitType?.english))
        );
        filteredItems.some((item, index) => {
          lovArray.push({
            sequence: index,
            value: item.value
          });
        });
        return of(new LovList(lovArray));
      })
    );
  }
  getDirectPaymentHistory(sin: number, filter?: DirectPaymentHistoryFilter) {
    this.directPaymentService.getDirectPaymentHistory(sin, filter).subscribe(res => {
      this.directPaymentHistory = res;
      this.getPaymentBenefitTypes(res).subscribe(val => {
        this.benefitTypeList = val;
      });
    });
  }

  isOpened(event, obj) {
    obj.isOpened = event;
  }

  filterApplied(val) {
    this.appliedFilter = [];
    val.forEach(element => {
      if (element.key === FilterKeyEnum.PERIOD) {
        this.appliedFilter.push(element);
      } else {
        if (element.bilingualValues.length > 0) {
          this.appliedFilter.push(element);
        }
      }
    });
    this.hasFiltered = this.appliedFilter.length > 0 ? true : false;
  }

  cancelledFilter(val: FilterKeyValue[]) {
    if (val.length === 0) {
      this.clearHistoryFilter = new DirectPaymentHistoryFilter();
      this.appliedFilter = [];
      this.hasFiltered = false;
    } else {
      this.clearHistoryFilter = new DirectPaymentHistoryFilter();
      val.forEach(element => {
        if (element.key === FilterKeyEnum.PAYEE_TYPE) {
          this.clearHistoryFilter.paymentType = element.bilingualValues;
        }
        if (element.key === FilterKeyEnum.BENEFITE_TYPE) {
          this.clearHistoryFilter.BenefitType = element.bilingualValues;
        }
        if (element.key === FilterKeyEnum.PAYMENT_STATUS) {
          this.clearHistoryFilter.paymentStatus = element.bilingualValues;
        }
        if (element.key === FilterKeyEnum.PERIOD) {
          this.clearHistoryFilter.paymentPeriodFrom = element.values[0];
          this.clearHistoryFilter.paymentPeriodTo = element.values[1];
        }
      });
      this.hasFiltered = true;
    }
    this.getDirectPaymentHistory(this.sin, this.clearHistoryFilter);
  }
  showAdjustmetDetailsLink(payments, index) {
    return payments.findIndex(val => val?.paymentType?.english === 'Adjustment') === index;
  }

  getCalculationDetails(templateRef: TemplateRef<HTMLElement>, history) {
    if (history?.sin && history?.benefitRequestId) {
      this.manageBenefitService
        .getBenefitCalculationDetailsByRequestId(history?.sin, history?.benefitRequestId)
        .subscribe(calculation => {
          this.benefitCalculation = calculation;
          this.showModal(templateRef);
        });
    }
  }
  viewAdjustmentModal(eachHistory) {
    this.commonModalRef = this.modalService.show(AdjustmentPopupDcComponent, Object.assign({}, { class: 'modal-lg' }));
    this.commonModalRef.content.paymentHistory = eachHistory;
    this.commonModalRef.content.close.subscribe(() => this.commonModalRef.hide());
    this.commonModalRef.content.onAdjustmentClicked.subscribe(adjustmentId => {
      this.commonModalRef.hide();
      this.navigateToAdjustment(adjustmentId, eachHistory?.personId);
    });
    this.commonModalRef.content.onBenefitTypeClicked.subscribe(benefitAdjustment => {
      this.commonModalRef.hide();
      this.navigateToBenefitDetails(benefitAdjustment, eachHistory?.personId);
    });
  }
  navigateToAdjustment(adjustmentId: number, personId?) {
    this.adjustmentService.identifier = personId;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: {
        adjustmentId: adjustmentId
      }
    });
  }
  navigateToBenefitDetails(benefit, personId) {
    this.adjustmentService.benefitType = benefit?.benefitType?.english;
    this.adjustmentService.benefitDetails = benefit;
    this.contributorService.personId = personId;
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(benefit?.sin, benefit?.benefitRequestId, benefit?.benefitType, null)
    );
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  /*
   * This method is to close Modal
   */
  hideModal() {
    this.benefitCalculation = null;
    this.commonModalRef.hide();
  }
  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }

  navigateToAdjustments(eachHistory, adjustmentId) {
    this.adjustmentService.identifier = eachHistory?.personId;
    this.adjustmentService.sin = this.sin;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: {
        adjustmentId: adjustmentId
      }
    });
  }

  /*   getBenefits(identifier: number) {
    const status = ['Active', 'Draft', 'In Progress'];
    this.sanedBenefitService.getBenefitsWithStatus(identifier, status).subscribe(response => {
      this.benefitTypeList$ = response[0].benefitType;
    });
  } */
}
