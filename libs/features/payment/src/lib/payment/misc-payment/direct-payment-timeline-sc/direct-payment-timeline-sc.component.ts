import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BenefitsGosiShowRolesConstants, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import {
  AlertService,
  CoreAdjustmentService,
  CoreBenefitService,
  CoreContributorService,
  LookupService
} from '@gosi-ui/core/lib/services';
import { BankService, ManageBenefitService } from '@gosi-ui/features/benefits/lib/shared/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PaymentDetails, PaymentService } from '../../../shared';
import { Location } from '@angular/common';
import { BenefitConstants } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'pmt-direct-payment-timeline-sc',
  templateUrl: './direct-payment-timeline-sc.component.html',
  styleUrls: ['./direct-payment-timeline-sc.component.scss']
})
export class DirectPaymentTimelineScComponent implements OnInit {
  lang = 'en';
  identifier: number;
  sin: number;
  history: PaymentDetails;
  accessForActionPrivate = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_ACCESS;


  constructor(
    private location: Location,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    readonly paymentService: PaymentService,
    readonly bankService: BankService,
    public route: ActivatedRoute,
    public contributorService: CoreContributorService,
    readonly manageBenefitService: ManageBenefitService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly coreBenefitService: CoreBenefitService,
    readonly coreAdjustmentService: CoreAdjustmentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.identifier = params.identifier;
      this.sin = this.coreAdjustmentService?.sin;
      this.getDirectPaymentHistory();
    });
  }
  getDirectPaymentHistory() {
    this.paymentService.fetchDirectPaymentHistory(this.identifier, this.sin).subscribe(
      res => {
        this.history = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  directPaymentNavigation() {
    this.router.navigate([BenefitConstants.ROUTE_PAY_ONLINE], {
      queryParams: { identifier: this.identifier }
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
  /** Route back to previous page */
  routeBack() {
    this.location.back();
  }
}
