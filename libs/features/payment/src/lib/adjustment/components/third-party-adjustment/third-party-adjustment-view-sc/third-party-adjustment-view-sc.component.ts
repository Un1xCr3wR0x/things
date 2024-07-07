/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  DocumentItem,
  DocumentService,
  DropdownItem,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  CoreAdjustmentService,
  CoreBenefitService
} from '@gosi-ui/core';
import {
  ThirdpartyAdjustmentService,
  PayeeDetails,
  AdjustmentService,
  PaymentRoutesEnum,
  AdjustmentConstants,
  AdjustmentQueryParams,
  PaymentDetails,
  PaymentList,
  Payment,
  Adjustment,
  AdjustmentLookupService
} from '@gosi-ui/features/payment/lib/shared';
import { AdjustmentHistoryDetail } from '@gosi-ui/features/payment/lib/shared/models/adjustment-history-detail';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin, noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'pmt-third-party-adjustment-view-sc',
  templateUrl: './third-party-adjustment-view-sc.component.html',
  styleUrls: ['./third-party-adjustment-view-sc.component.scss']
})
export class ThirdPartyAdjustmentViewScComponent implements OnInit {
  constructor(
    readonly tpaService: ThirdpartyAdjustmentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly adjustmentService: AdjustmentService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly location: Location,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly adjustmentLookUpService: AdjustmentLookupService,
    readonly coreBenefitService: CoreBenefitService
  ) {}
  // Input Variables
  lang = 'en';
  paymentDetailsMap: Map<number, PaymentList> = new Map();
  adjustmentValues: Adjustment[] = [];
  benefitList: AdjustmentHistoryDetail[] = [];
  payeeId: number;
  payeeDetails: PayeeDetails;
  modalRef: BsModalRef;
  adjustmentId: number;
  identifier: number;
  adjustmentTabs: DropdownItem[] = AdjustmentConstants.THIRD_PARTY_ADJUSTMENT_TABS;
  params: AdjustmentQueryParams = new AdjustmentQueryParams();
  transactionDocs: DocumentItem[] = [];
  modifyTpaDocuments: DocumentItem[];
  addTpaDocuments: DocumentItem[];
  otherDocsList: DocumentItem[];
  bankCodeList: string[];
  paymentToBankMap: Map<string, BilingualText> = new Map();
  paymentList: Map<number, PaymentList> = new Map();
  iBanCode: string;
  tempPayment: Payment[] = [];
  paymentDetailsList: PaymentDetails;
  beneficiaryId: number;
  benefitStatus: BilingualText;
  sin: number;
  // Method to initialise the component
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.identifier = this.coreAdjustmentService.identifier;
    this.sin = this.coreAdjustmentService?.sin;
    this.route.queryParams.subscribe(params => {
      if (this.identifier === undefined) {
        this.identifier = params.personId;
      }
      this.adjustmentId = params.adjustmentId;
      if (this.adjustmentId && this.identifier) {
        this.getAdjustmentDetails(this.identifier, this.params);
        this.getPayments(this.identifier, this.adjustmentId);
        this.getTransactionDocuments();
        this.getOtherDocumentList();
      } else {
        this.location.back();
      }
    });
  }

  /** Method to get adjustment details for validator view */
  getAdjustmentDetails(identifier: number, params: AdjustmentQueryParams) {
    this.tpaService
      .getTpaAdjustmentsDetails(identifier, params, this.sin)
      .pipe(
        tap(res => {
          res.adjustments.forEach(adj => {
            if (adj.adjustmentId.toString() === this.adjustmentId.toString()) {
              this.beneficiaryId = res.adjustments[0].beneficiaryId;
              this.adjustmentValues.push(adj);
              this.payeeId = adj.payeeId;
              adj?.adjustmentHistoryDetails?.forEach(benefit => {
                this.benefitList.push(benefit);
              });
            }
          });
        }),
        switchMap(() => {
          return this.tpaService.getValidatorPayeeDetails(this.payeeId).pipe(
            tap(
              data => {
                this.payeeDetails = data;
              },
              err => {
                this.alertService.showError(err.error.message);
                this.hideModal();
              }
            )
          );
        }),
        switchMap(() => {
          return this.tpaService.getBeneficiaryDetails(this.identifier, this.sin).pipe(
            tap(res => {
              res.beneficiaryBenefitList.forEach((data, index) => {
                if (data.beneficiaryId === this.beneficiaryId) {
                  this.benefitStatus = res.beneficiaryBenefitList[index].benefitStatus;
                }
              });
            })
          );
        }),
        catchError(error => {
          this.alertService.showError(error.error.message);
          return throwError(error);
        })
      )
      .subscribe(noop, noop);
  }
  // Method to hide
  hideModal() {
    this.modalRef?.hide();
  }
  /** Route back to previous page */
  navigateBacktoListPage() {
    // this.router.navigate([PaymentRoutesEnum.ADJUSTMENT_DETAIL]);
    this.location.back();
  }
  addDocsPage() {
    this.router.navigate([PaymentRoutesEnum.ADD_DOCUMENTS_SCREEN], {
      queryParams: {
        adjustmentId: this.adjustmentId
      }
    });
  }
  getTransactionDocuments() {
    this.tpaService
      .getAllDocuments(
        this.adjustmentId,
        AdjustmentConstants.MAINTAIN_THIRD_PARTY_TRANSACTION_NAME,
        AdjustmentConstants.MAINTAIN_PARTY_TRANSACTION_TYPE
      )
      .subscribe(docs1 => {
        this.transactionDocs = docs1.sort((v1, v2) => +new Date(v2.createdDate) - +new Date(v1.createdDate));
      });
    this.tpaService
      .getAllDocuments(
        this.adjustmentId,
        AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
        AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE
      )
      .subscribe(docs2 => {
        this.transactionDocs = [...this.transactionDocs, ...docs2].sort(
          (v1, v2) => +new Date(v2.createdDate) - +new Date(v1.createdDate)
        );
      });
  }
  getOtherDocumentList() {
    this.tpaService
      .getAllDocuments(
        this.adjustmentId,
        AdjustmentConstants.ADD_DOCUMENT_TRANSACTION_NAME,
        AdjustmentConstants.ADD_DOCUMENT_TRANSACTION_TYPE
      )
      .subscribe(val => {
        this.otherDocsList = val;
        this.otherDocsList.sort((v1, v2) => +new Date(v2.createdDate) - +new Date(v1.createdDate));
      });
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
  navigateToTransaction(referenceNo) {
    this.adjustmentLookUpService.getTransaction(referenceNo).subscribe(res => {
      this.router.navigate([`/home/transactions/view/${res.transactionId}/${referenceNo}`]);
    });
  }
}
