/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  CoreAdjustmentService,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  BankService,
  BenefitConstants,
  BenefitDocumentService,
  BenefitRecalculation,
  DependentService,
  HeirBenefitService,
  ManageBenefitService,
  RecalculationEquationDcComponent,
  SanedBenefitService,
  SanedRecalculation,
  SwitchTitle,
  UiBenefitsService,
  BenefitPropertyService
} from '../../../shared';
import { TransactionBaseScComponent } from '../../base';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-saned-benefit-recalculation-sc',
  templateUrl: './saned-benefit-recalculation-sc.component.html',
  styleUrls: ['./saned-benefit-recalculation-sc.component.scss']
})
export class SanedBenefitRecalculationScComponent extends TransactionBaseScComponent implements OnInit {
  // Local Variables
  isSaned: boolean;
  transaction: Transaction;
  modalRef: BsModalRef;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  payForm: FormGroup;
  calculationModalTitle: SwitchTitle;
  sanedRecalculationDetails: SanedRecalculation;
  benefitRecalculationDetails: BenefitRecalculation;
  benefitConstants: BenefitConstants;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly transactionService: TransactionService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly uiBenefitService: UiBenefitsService,
    readonly fb: FormBuilder,
    readonly authTokenService: AuthTokenService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly manageBenefitService: ManageBenefitService,
    readonly router: Router,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly ohService: OhService
  ) {
    super(
      documentService,
      manageBenefitService,
      dependentService,
      alertService,
      bankService,
      lookUpService,
      heirBenefitService,
      adjustmentService,
      sanedBenefitService,
      uiBenefitService,
      modalService,
      router,
      fb,
      routerData,
      benefitPropertyService,
      ohService
    );
  }
  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.language.subscribe(language => {
      this.lang = language;
    });
    // this.payForm = this.fb.group({
    //   checkBoxFlag: [false]
    // });
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.transaction.params.SIN;
      this.benefitrequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.fetchSanedBenefits();
      this.getSanedRecalculations();
      this.isSaned = true;
    }
  }
  /** Method to get contributor details from benefit details */
  fetchSanedBenefits() {
    this.sanedBenefitService.getBenefitRequestDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitrequestId,null).subscribe(
      res => {
        this.benefitSanedDetails = res;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  /** Method to navigate to Contributor */
  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
    //this.router.navigate([`home/profile/contributor/${this.benefitrequestId}/${this.sin}/info`]);
  }

  /** Method to get recalculation benefit details */
  getSanedRecalculations() {
    if(this.sin && this.benefitrequestId){
      this.sanedBenefitService.getBenefitRecalculateDetails(this.sin, this.benefitrequestId, this.referenceNumber).subscribe(
        res => {
          this.sanedRecalculationDetails = res;
          this.payForm.get('checkBoxFlag').setValue(this.sanedRecalculationDetails?.directPaymentStatus);
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }
  /** Method to open Recalculation wage modal */
  howToCalculate(calculationPeriod) {
    this.modalRef = this.modalService.show(RecalculationEquationDcComponent, Object.assign({}, { class: 'modal-xl' }));
    this.modalRef.content.sanedRecalculationDetails = calculationPeriod;
    this.modalRef.content.benefitCalculationDetails = this.benefitCalculationDetails;
    this.modalRef.content.lang = this.lang;
    this.modalRef.content.isSaned = this.isSaned;
    this.modalRef.content.calculationModalTitle = this.calculationModalTitle;
    if (this.modalRef)
      this.modalRef.content.closeButtonClicked.subscribe(() => {
        this.modalRef.hide();
      });
  }
  /** Method  to  navigate  to  change  engagement */
  viewChangeEngagement(traceId) {
    const newRouterData = {
      ...this.routerData,
      payload: JSON.stringify({
        ...JSON.parse(this.routerData.payload),
        engagementId: this.sanedRecalculationDetails?.engagementId || this.benefitRecalculationDetails?.engagementId,
        registrationNo:
          this.sanedRecalculationDetails?.registrationNo || this.benefitRecalculationDetails?.registrationNo,
        referenceNo:
          this.sanedRecalculationDetails?.modificationRefNo || this.benefitRecalculationDetails?.modificationRefNo
      })
    };
    this.sanedBenefitService.getTransaction(traceId).subscribe(res => {
      this.router.navigate([`/home/transactions/view/${res.transactionId}/${traceId}`]);
    });
  }
  viewMaintainAdjustment(benefitParam) {
    this.adjustmentService.identifier = this.benefitSanedDetails?.personId || this.benefitDetails?.personId;
    this.adjustmentService.sin = this.sin;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  }
}
