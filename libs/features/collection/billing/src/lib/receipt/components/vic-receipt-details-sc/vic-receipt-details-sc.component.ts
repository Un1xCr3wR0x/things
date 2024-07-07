import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DetailedBillService } from '../../../shared/services';
import { ReceiptApprovalStatus } from '../../../shared/enums';
import { BillingConstants, BreadCrumbConstants } from '../../../shared/constants';
import { PaymentDetails } from '../../../shared/models';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'blg-vic-receipt-details-sc',
  templateUrl: './vic-receipt-details-sc.component.html',
  styleUrls: ['./vic-receipt-details-sc.component.scss']
})
export class VicReceiptDetailsScComponent implements OnInit {
  /**LocaL Variable */
  lang = 'en';
  statusStyle: string;
  pageNo = 0;
  pageSize = 10;
  receiptNo: number;
  sinNo: number;
  receiptDetList: PaymentDetails;
  contributorName;
  receiptStatusEn: string;
  receiptStatusAr: string;
  @ViewChild('brdcmb', { static: false })
  cntBillingBrdcmb: BreadcrumbDcComponent;
  individualApp = false;

  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly detailedBillService: DetailedBillService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.individualApp = true;
    }
    this.language.subscribe(lang => {
      this.lang = lang;
    });

    this.route.queryParams.subscribe(params => {
      this.receiptNo = params.receiptNo;
      this.pageNo = params.pageNo;
      this.sinNo = params.sinNo;
      this.getDetailedReceipt();
    });
  }
  ngAfterViewInit() {
    if (this.individualApp) {
      this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.RECEIPT_BREADCRUMB_VALUES;
    }
  }
  /** Method to get detailed receipt . */

  getDetailedReceipt() {
    this.detailedBillService.getVicReceiptDetList(this.sinNo, this.receiptNo).subscribe(res => {
      this.receiptDetList = res;
      this.setContributorName(this.receiptDetList);
      this.receiptStatusEn = this.receiptDetList.status.english;
      this.receiptStatusAr = this.receiptDetList.status.arabic;
      this.checkReceiptStatus(this.receiptDetList.status.english);
    });
  }

  setContributorName(receiptList?) {
    let contributorNameEng: string;
    let contributorNameArb: string;
    if (receiptList.name?.english?.name) contributorNameEng = receiptList.name?.english.name;
    if (receiptList?.name?.arabic)
      contributorNameArb =
        receiptList.name?.arabic.firstName +
        ' ' +
        receiptList.name?.arabic.secondName +
        ' ' +
        receiptList.name?.arabic.thirdName +
        ' ' +
        receiptList.name.arabic?.familyName;
    this.contributorName = {
      contributorNameEng: contributorNameEng,
      contributorNameArb: contributorNameArb
    };
  }
  /** Method to check receipt status of each receipt. */
  checkReceiptStatus(status: string) {
    switch (status) {
      case ReceiptApprovalStatus.APPROVAL_IN_PROGRESS:
      case ReceiptApprovalStatus.TO_BE_CANCELLED:
      case ReceiptApprovalStatus.RECEIPT_ALLOCATION_CANCEL_IN_PROGRESS:
      case ReceiptApprovalStatus.WAITING_ALLOCATION:
        {
          this.statusStyle = 'Orange';
        }
        break;
      case ReceiptApprovalStatus.CANCELLED:
      case ReceiptApprovalStatus.CANCELLED_PV_WAITING:
        {
          this.statusStyle = 'Red';
        }
        break;
      case ReceiptApprovalStatus.DISCARD:
        this.statusStyle = 'gray';
        break;
      case ReceiptApprovalStatus.REJECTED:
        this.statusStyle = 'dark_red';
        break;
      case ReceiptApprovalStatus.RECEIVED:
      case ReceiptApprovalStatus.PARTIALLY_ALLOCATED:
        {
          this.statusStyle = 'blue';
        }
        break;
      case ReceiptApprovalStatus.FULLY_ALLOCATED:
        this.statusStyle = 'green';
        break;
    }
  }

  navigateBack() {
    this.router.navigate([BillingConstants.RECEIPT_VIC_LIST_ROUTE], {
      queryParams: {
        pageNo: this.pageNo,
        searchFlag: true,
        idNo: this.sinNo
      }
    });
  }
}
