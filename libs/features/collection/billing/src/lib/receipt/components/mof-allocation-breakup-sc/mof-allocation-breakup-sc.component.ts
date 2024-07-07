/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BillDashboardService, ContributionPaymentService } from '../../../shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EstablishmentAllocationDetails,
  BranchBreakup,
  PaymentDetails,
  MofAllocationBreakupFilter
} from '../../../shared/models';
import { ReceiptType } from '../../../shared/enums';

@Component({
  selector: 'blg-mof-allocation-breakup-sc',
  templateUrl: './mof-allocation-breakup-sc.component.html',
  styleUrls: ['./mof-allocation-breakup-sc.component.scss']
})
export class MofAllocationBreakupScComponent implements OnInit {
  /**Local variables. */
  idNumber = 1;
  lang = 'en';
  receipt: PaymentDetails;
  receiptNo: number;
  regNumber: number;
  statusStyle: string;
  registrationNo: number;
  pageNo = 0;
  pageSize = 10;
  mofRegNumber = 1;
  statusArabic: string;
  statusEnglish: string;
  branchDetails: BranchBreakup[];
  filterParam: MofAllocationBreakupFilter;
  estAllocationDetails: EstablishmentAllocationDetails;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly billDashboardService: BillDashboardService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly contributionPaymentService: ContributionPaymentService
  ) {}

  /** This method handles initializaton task. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.route.queryParams.subscribe(params => {
      this.receiptNo = params.receiptNo;
    });
    this.getMofEstablishmentDetails();
    this.getMofReceiptDetails();
  }
  /* This method is used to navigate backk to receipt list page */
  navigateBackToPage() {
    this.router.navigate(['home/billing/receipt/mof']);
  }

  /* This method is used to fetch mof establishment allocation details */
  getMofEstablishmentDetails() {
    this.billDashboardService
      .getMofEstablishmentAllocationDetails(this.mofRegNumber, this.receiptNo, this.pageNo, this.pageSize)
      .subscribe(res => {
        this.estAllocationDetails = res;
        this.branchDetails = res.branchAmount;
      });
  }
  /* This method is used to fetch mof establishment allocation details based on selected reg number*/
  getEstablishmentAllocation(regNo) {
    this.regNumber = regNo;
    this.pageNo = 0;
    this.getMofEstablishmentAllocationDetails();
  }

  /*method to featch breakup details based on filter params*/

  getEstablishmentAllocationFilterValue(filterParam: MofAllocationBreakupFilter) {
    this.pageNo = 0;
    this.filterParam = filterParam;
    this.getMofEstablishmentAllocationDetails();
  }

  /* This method is used to fetch receipt details based on receipt number*/
  getMofReceiptDetails() {
    this.contributionPaymentService
      .getReceiptDetails(this.idNumber, this.receiptNo, true, ReceiptType.PARENT_RECEIPT)
      .subscribe(res => {
        if (res.status !== undefined) {
          this.statusArabic = res.status.arabic;
          this.statusEnglish = res.status.english;
          this.receipt = res;
        }
      });
  }

  getSelectedPageDetails(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getMofEstablishmentAllocationDetails();
  }

  /*method to get get Mof Establishment Allocation Details*/
  getMofEstablishmentAllocationDetails() {
    this.billDashboardService
      .getMofEstablishmentAllocationDetails(
        this.mofRegNumber,
        this.receiptNo,
        this.pageNo,
        this.pageSize,
        this.regNumber,
        this.filterParam
      )
      .subscribe(res => {
        this.estAllocationDetails = res;
        this.branchDetails = res.branchAmount;
      });
  }
}
