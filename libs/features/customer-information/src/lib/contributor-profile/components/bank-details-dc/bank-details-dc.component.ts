import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BilingualText, statusBadgeType, AuthTokenService, CoreBenefitService } from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { FinancialDetails } from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyBankDetails } from '../../../shared/models/benefits/verify-bank-details';
import { Contributor } from '@gosi-ui/features/contributor/lib/shared';
import { BenefitConstants } from '../../../shared/constants/benefits/benefit-constants';
import { isHeirBenefit, notIsHeir } from '@gosi-ui/features/benefits/lib/shared/utils';
import { ActiveBenefits } from '../../../shared/models/benefits/active-benefits';

@Component({
  selector: 'cim-bank-details-dc',
  templateUrl: './bank-details-dc.component.html',
  styleUrls: ['./bank-details-dc.component.scss']
})
export class BankDetailsDcComponent implements OnInit, OnChanges {
  @Input() financialDetails: FinancialDetails;
  @Input() lang: string;
  @Input() userDetails: Contributor;
  @Input() activeBenefit: ActiveBenefits;
  @Output() limit: EventEmitter<number> = new EventEmitter();
  @Output() reverifyDetails: EventEmitter<VerifyBankDetails> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  totalCount: number;
  identifier: number;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  currentPage = 1;
  itemsPerPage = 4;
  isServiceType: boolean;
  bankVerifyDetails: VerifyBankDetails = new VerifyBankDetails();
  hideAddBtn: boolean;
  addBtnValidated: boolean;
  isActiveBeneficiary = false;
  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly authTokenService: AuthTokenService,
    private coreBenefitService: CoreBenefitService
  ) {}

  ngOnInit(): void {
    this.identifier = this.authTokenService.getIndividual();
    if (this.userDetails) {
      this.isActiveBeneficiary = this.userDetails?.isBeneficiary ? true : false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.financialDetails && changes.financialDetails.currentValue) {
      this.financialDetails = changes.financialDetails.currentValue;
      this.totalCount = this.financialDetails?.totalCount;
      this.financialDetails?.bankAccountList?.forEach(item => {
        if (item?.serviceType?.length === 0) this.isServiceType = false;
        else this.isServiceType = true;
      });
      let filterData = this.financialDetails.bankAccountList.filter(item => item.serviceType[0]?.english == 'DEFAULT');
      let pendingData = filterData.filter(item => item.status?.english == 'PENDING');
      let activeData = filterData.filter(item => item.status?.english == 'ACTIVE');
      let verifiedData = filterData.filter(item => item.status?.english == 'VERIFIED');
      if (filterData.length != 0 && activeData.length != 0) {
        this.hideAddBtn = true;
      } else if (filterData.length != 0 && pendingData.length != 0) {
        this.hideAddBtn = true;
      } else if (filterData.length != 0 && verifiedData.length != 0) {
        this.hideAddBtn = true;
      } else {
        this.hideAddBtn = false;
      }
      this.addBtnValidated = true;
    }
  }
  navigateTo() {
    this.router.navigate(['/home/individual/profile/add-bank'], {
      queryParams: {
        identifier: this.identifier
      }
    });
  }
  /**
   *
   * @param status method to set status
   */
  statusBadge(status: BilingualText) {
    return statusBadgeType(status.english);
  }
  selectPage(pageNo: number) {
    this.pageDetails.currentPage = this.currentPage = pageNo;
    this.limit.emit(pageNo);
  }
  viewBenefitDetails() {
    const benefitType = this.activeBenefit.benefitType.english;
    this.coreBenefitService.setActiveBenefit(this.activeBenefit);

    // navigate to heir pension modify page
    if (isHeirBenefit(benefitType)) {
      this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
    }
    if (notIsHeir(benefitType)) {
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    }
  }

  verification(bankAccount) {
    this.bankVerifyDetails.bankAddress = bankAccount.bankAddress;
    this.bankVerifyDetails.serviceType = bankAccount.serviceType[0]?.english;
    this.bankVerifyDetails.bankCode = bankAccount.bankCode;
    this.bankVerifyDetails.bankName = bankAccount.bankName;
    this.bankVerifyDetails.ibanBankAccountNo = bankAccount.ibanBankAccountNo;
    this.bankVerifyDetails.nonSaudiIBAN = false;
    this.reverifyDetails.emit(this.bankVerifyDetails);
  }
}
