import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AdjustmentService } from '../../../shared/services/adjustment.service';
import { Adjustment } from '../../../shared/models/adjustment';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import {
  RouterDataToken,
  RouterData,
  CoreAdjustmentService,
  CoreActiveBenefits,
  CoreBenefitService,
  LanguageToken,
  LovList,
  BilingualText,
  LookupService,
  DropdownItem,
  DocumentItem,
  AlertService
} from '@gosi-ui/core';
import { Location } from '@angular/common';
import {
  PaymentRoutesEnum,
  ThirdpartyAdjustmentService,
  PaymentList,
  Payment,
  AdjustmentConstants,
  AdjustmentLookupService
} from '../../../shared';
import { switchMap } from 'rxjs/operators';
import { HeirActiveService, isHeirBenefit } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'pmt-benefit-adjustment-details-sc',
  templateUrl: './benefit-adjustment-details-sc.component.html',
  styleUrls: ['./benefit-adjustment-details-sc.component.scss']
})
export class BenefitAdjustmentDetailsScComponent implements OnInit, OnDestroy {
  adjustment: Adjustment;
  identifier: number;
  lang = 'en';
  adjustmentId: number;
  adjustmentTabs: DropdownItem[] = AdjustmentConstants.THIRD_PARTY_ADJUSTMENT_TABS;
  currentab = 0;
  paymentToBankMap: Map<string, BilingualText> = new Map();
  paymentList: Map<number, PaymentList> = new Map();
  tempPayment: Payment[] = [];
  bankCodeList: string[];
  iBanCode: string;
  transactionDocs: DocumentItem[] = [];
  document: DocumentItem[];
  sin: number;
  constructor(
    readonly adjustmentLookUpService: AdjustmentLookupService,
    readonly adjustmentService: AdjustmentService,
    private alertService: AlertService,
    readonly router: Router,
    private location: Location,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly heirActiveService: HeirActiveService,
    readonly tpaService: ThirdpartyAdjustmentService,
    readonly lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.adjustmentId = params.adjustmentId;
    });
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.identifier = this.coreAdjustmentService.identifier;
    this.sin = this.coreAdjustmentService?.sin;
    if (this.identifier && this.adjustmentId) {
      this.getAdjustmentDetailsById();
      this.getPayments(this.identifier, this.adjustmentId);
      this.getTransactionDocuments();
    }
  }

  /**The method to call the AdjsutmentDetails By ID */
  getAdjustmentDetailsById() {
    this.adjustmentService.getadjustmentBYId(this.identifier, this.adjustmentId, this.sin).subscribe(data => {
      this.adjustment = data;
      //this.adjustmentService.referenceNumber(data?.referenceNo);
    });
  }
  /** Route back to previous page */
  routeBack() {
    this.location.back();
  }
  /** Method to navigate to benefit details */
  navigateToBenefitDetails(adjustment) {
    if (isHeirBenefit(adjustment?.benefitType?.english) || adjustment?.benefitType?.english === "Survivor's Pension") {
      // const activeHeirDetail = {
      //   personId: this.identifier,
      //   sin: adjustment?.sin,
      //   benefitRequestId: adjustment?.benefitRequestId,
      //   benefitType: adjustment?.benefitType?.english
      // };
      // this.heirActiveService.setActiveHeirDetails(activeHeirDetail);
      // this.router.navigate([PaymentRoutesEnum.ROUTE_ACTIVE_HEIR_DETAILS]);
      this.router.navigate([PaymentRoutesEnum.ROUTE_ACTIVE_HEIR_BENEFIT]);
    } else {
      this.coreBenefitService.setActiveBenefit(
        new CoreActiveBenefits(adjustment?.sin, adjustment?.benefitRequestId, adjustment?.benefitType, null)
      );
      this.router.navigate([PaymentRoutesEnum.ROUTE_MODIFY_RETIREMENT]);
    }
  }
  selectTab(val) {
    if (val === 0) {
      this.currentab = 0;
    } else if (val === 1) {
      this.currentab = 1;
    } else {
      this.currentab = 2;
    }
  }
  getPayments(identifier: number, adjustmentId: number) {
    this.tpaService
      .getPaymentDetails(identifier, adjustmentId, this.sin)
      .pipe(
        switchMap(data => {
          this.tempPayment = data;
          this.bankCodeList = [];
          const bankApiCalls: Observable<LovList>[] = [];
          data.forEach(payment => {
            if (payment?.iban !== undefined) {
              this.iBanCode = payment?.iban ? String(payment?.iban).slice(4, 6) : null;
              if (this.iBanCode) {
                this.bankCodeList.push(this.iBanCode);
                bankApiCalls.push(this.lookupService.getBank(this.iBanCode));
              }
            }
          });

          return forkJoin(bankApiCalls);
        })
      )
      .subscribe(banks => {
        this.bankCodeList.forEach((code, index) => {
          this.paymentToBankMap.set(code, banks[index]?.items[0]?.value);
        });
        this.tempPayment.forEach((element, index) => {
          this.paymentList.set(index, {
            payment: element,
            bankName: banks[index]?.items[0]?.value
          });
        });
      });
  }
  addDocsPage() {
    this.router.navigate([PaymentRoutesEnum.ADD_DOCUMENTS_SCREEN], {
      queryParams: {
        adjustmentId: this.adjustmentId,
        from: AdjustmentConstants.GOSI_ADJUSTMENT
      }
    });
  }
  getTransactionDocuments() {
    this.tpaService
      .getAllDocuments(
        this.adjustmentId,
        AdjustmentConstants.MAINTAIN_ADJUSTMENT,
        AdjustmentConstants.MAINTAIN_ADJUSTMENT_REQUEST
      )
      .subscribe(docs => {
        this.transactionDocs = docs
          .filter(doc => doc?.transactionTraceId)
          .sort((v1, v2) => +new Date(v2.createdDate) - +new Date(v1.createdDate));
        this.document = docs
          .filter(otherDoc => !otherDoc?.transactionTraceId)
          .sort((v1, v2) => +new Date(v2.createdDate) - +new Date(v1.createdDate));
      });
  }
  navigateToAdjustmentTransaction(adjustment) {
    this.adjustmentLookUpService.getTransaction(adjustment.referenceNo).subscribe(res => {
      this.router.navigate([`/home/transactions/view/${res.transactionId}/${adjustment.referenceNo}`]);
    });
  }
  /** To close all error alerts on leaving the component */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
