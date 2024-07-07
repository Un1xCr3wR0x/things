import { Component, Inject, OnInit } from '@angular/core';
import { RouterDataToken, RouterData, checkIqamaOrBorderOrPassport, ApplicationTypeEnum, AuthTokenService, ApplicationTypeToken, getPersonNameAsBilingual, Channel, Role, CoreAdjustmentService, Transaction, TransactionService, DocumentItem, CommonIdentity } from '@gosi-ui/core';
import { UIPayloadKeyEnum, DirectPaymentService, BenefitConstants, BenefitDocumentService, } from '../../../shared';
import { Router } from '@angular/router';
@Component({
  selector: 'bnt-heir-direct-payment-sc',
  templateUrl: './heir-direct-payment-sc.component.html',
  styleUrls: ['./heir-direct-payment-sc.component.scss']
})
export class HeirDirectPaymentScComponent implements OnInit {
   identity: CommonIdentity;
  validatorCanEdit: boolean = false;
  socialInsuranceNo: number;
  referenceNo: number;
  heirDetails: any;
  channel: string;
  Channel = Channel;
  rolesEnum = Role;
  transaction: Transaction;
  isIndividualApp: boolean;
  documentList: DocumentItem[];
  constructor(private directPaymentService: DirectPaymentService,
    readonly router: Router,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly adjustmentPaymentService: CoreAdjustmentService,
    readonly transactionService: TransactionService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string) { }

  ngOnInit(): void {
    this.initialiseTheView();
  }

  getHeirDetails(socialInsuranceNo, referenceNo) {
    this.directPaymentService.getHeirListForDirectPayment(socialInsuranceNo, referenceNo).subscribe(res => {
      this.heirDetails = res;
      this.heirDetails.heirs = this.heirDetails.heirs?.map(heir => {
        heir.identity = checkIqamaOrBorderOrPassport(heir.person.identity);
        heir.person.nameBilingual = getPersonNameAsBilingual(heir.person.name);
        if (heir.directPaymentOpted) return heir;
      });
      this.heirDetails.contributorDetails.nameBilingual = getPersonNameAsBilingual(
        this.heirDetails?.contributorDetails?.name
      );
       if (res?.contributorDetails?.identity)
        this.identity = checkIqamaOrBorderOrPassport(res?.contributorDetails?.identity); 
    });
  }

  initialiseTheView() {
    this.transaction = this.transactionService.getTransactionDetails();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.transaction) {
      this.referenceNo = this.transaction.transactionRefNo;
      this.socialInsuranceNo = this.isIndividualApp ? this.authTokenService.getIndividual() : this.transaction.params.SIN;
      this.getHeirDetails(this.socialInsuranceNo, this.referenceNo);
      this.getscannedDocuments(this.socialInsuranceNo, this.referenceNo);
    }
  }
  getscannedDocuments(sin, referenceNo) {
    this.directPaymentService.getUploadedDocuments(sin, referenceNo).subscribe(res => {
      this.documentList = res;
      this.documentList = this.documentList.filter(s => s.documentContent !=null);
    });
  }
  navigateToEdit() {
    this.directPaymentService.setReferenceNo(this.referenceNo);
    this.directPaymentService.setPaymentSourceId(this.socialInsuranceNo);
    this.router.navigate([BenefitConstants.ROUTE_HEIR_DIRECT_PAYMENT], {
      queryParams: {
        isEdit: true
      }
    });
  }
  viewAdjustmentDetails(heir) {
    this.adjustmentPaymentService.identifier = heir?.person?.personId
    this.adjustmentPaymentService.socialNumber = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  }
  viewContributorDetails() { }
}
