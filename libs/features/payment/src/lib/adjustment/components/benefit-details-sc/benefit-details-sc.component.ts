import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AdjustmentService,
  Adjustment,
  AdjustmentDetails,
  AdjustmentDetailsFilter,
  PaymentService
} from '../../../shared';
import { Location } from '@angular/common';
import { LanguageToken, AlertService, LovList, CoreAdjustmentService, CoreBenefitService } from '@gosi-ui/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  selector: 'pmt-benefit-details-sc',
  templateUrl: './benefit-details-sc.component.html',
  styleUrls: ['./benefit-details-sc.component.scss']
})
export class BenefitDetailsScComponent implements OnInit {
  identifier;
  type;
  adjustments: Adjustment[];
  activeAdjustments: AdjustmentDetails;
  adjustmentSort: Observable<LovList>;
  adjustFilter: AdjustmentDetailsFilter = new AdjustmentDetailsFilter();
  lang = 'en';
  benefitDetails;
  isEligible: Boolean = false;
  from;
  direction = 'ASCENDING';
  sin: number;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private location: Location,
    readonly router: Router,
    readonly adjustmentService: AdjustmentService,
    readonly activatedRoute: ActivatedRoute,
    readonly alertService: AlertService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly paymentService: PaymentService,
    readonly coreBenefitService: CoreBenefitService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.activatedRoute.queryParams.subscribe(param => {
      if (param['from']) {
        this.from = param['from'];
      }
    });
    this.adjustmentSort = of(
      new LovList([
        {
          value: {
            english: 'Date Created',
            arabic: 'تاريخ الإنشاء'
          },
          sequence: 1
        },
        {
          value: {
            english: 'Adjustment Amount',
            arabic: 'مبلغ التسوية'
          },
          sequence: 2
        }
      ])
    );
    this.identifier = this.coreAdjustmentService.identifier;
    this.type = this.coreAdjustmentService.benefitType;
    this.sin = this.coreAdjustmentService?.sin;
    this.benefitDetails = this.coreAdjustmentService.benefitDetails;
    this.getAdjustmentsByBenefitType();
    this.getActiveAdjustments();
    this.getEligibility();
  }
  getAdjustmentsByBenefitType() {
    this.adjustmentService.getAdjustmentByBenefitType(this.identifier, this.type, this.sin).subscribe(res => {
      this.adjustments = res.adjustments;
    });
  }
  getEligibility() {
    this.adjustmentService.getAdjustmentByeligible(this.identifier, this.sin).subscribe(res => {
      this.isEligible = res.eligible;
    });
  }
  navigateToAdd() {
    if (this.isEligible) {
      this.router.navigate(['/home/adjustment/create']);
    }
  }
  navigateToAddModify() {
    if (this.isEligible) {
      this.router.navigate(['/home/adjustment/add-modify']);
    }
  }
  getActiveAdjustments() {
    this.adjustmentService
      .getAdjustmentByStatusAndType(this.identifier, { status: 'Active', benefitType: this.type }, this.sin)
      .subscribe(res => {
        this.activeAdjustments = res;
      });
  }
  // fetch adjsutment Details
  getAdjsutmentFilterDetails() {
    this.paymentService.getAdjustByDetail(this.identifier, this.adjustFilter).subscribe(
      res => {
        this.adjustments = res.adjustments;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  filterTransactions(adjustFilter: AdjustmentDetailsFilter) {
    this.adjustFilter = { ...this.adjustFilter, ...adjustFilter };
    this.adjustFilter.identifier = this.identifier;
    if (this.type) {
      this.adjustFilter.benefitType = [{ english: this.type, arabic: '' }];
    }
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
    } else if (selectedItem.value.english === 'Adjustment Amount') {
      this.adjustFilter.adjustmentSortParam = 'ADJUSTMENT_AMOUNT';
    }
    this.adjustFilter.sortType = this.direction;
    this.filterTransactions(this.adjustFilter);
  }
  /** Route back to previous page */
  routeBack() {
    this.coreAdjustmentService.benefitType = null;
    if (this.from === 'addModify') {
      this.router.navigate(['/home/adjustment/add-modify']);
    } else {
      this.location.back();
    }
  }
  navigateToAdjustmentDetails(adjustmentId) {
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: {
        adjustmentId: adjustmentId
      }
    });
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
}
