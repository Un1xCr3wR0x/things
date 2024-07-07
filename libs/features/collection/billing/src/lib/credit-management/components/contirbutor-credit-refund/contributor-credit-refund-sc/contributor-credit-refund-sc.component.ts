/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  Contributor,
  markFormGroupTouched,
  RouterData,
  RouterDataToken,
  LanguageToken,
  scrollToTop
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BillingConstants } from '../../../../shared/constants';
import { LanguageTypeEnum, SearchMaxLength } from '../../../../shared/enums';
import {
  BackdatedTerminationTransactionsDetails,
  CreditBalanceDetails,
  EstablishmentDetails,
  TerminationTransactionsDetails,
  SelectedTerminationPeriodDetails
} from '../../../../shared/models';
import {
  BillingRoutingService,
  ContributionPaymentService,
  EstablishmentService,
  CreditManagementService,
  ReportStatementService
} from '../../../../shared/services';

@Component({
  selector: 'blg-contributor-credit-refund-sc',
  templateUrl: './contributor-credit-refund-sc.component.html',
  styleUrls: ['./contributor-credit-refund-sc.component.scss']
})
export class ContributorCreditRefundScComponent implements OnInit {
  /**-------------------Local Variables------------------------ */
  isUserLoggedIn = false;
  refundAmountExceedError = false;
  verifyPersonForm: FormGroup;
  lang = 'en';
  modalRef: BsModalRef;
  socialInsuranceNumber: number;
  languageType: string;
  registrationNumber: number;
  selectedPeriod: SelectedTerminationPeriodDetails[] = [];
  contributorDetails: Contributor = new Contributor();
  establishmentDetails: EstablishmentDetails = new EstablishmentDetails();
  establishmentCreditDetails: CreditBalanceDetails = new CreditBalanceDetails();
  transactionsDetails: TerminationTransactionsDetails;
  isWorkflow: boolean;
  requestNo: number;
  referenceNumber: number;
  backdatedTerminationTransactionsDetails: BackdatedTerminationTransactionsDetails = new BackdatedTerminationTransactionsDetails();
  maxLength = SearchMaxLength;

  constructor(
    private fb: FormBuilder,
    readonly creditManagementService: CreditManagementService,
    readonly alertService: AlertService,
    readonly billingRoutingService: BillingRoutingService,
    readonly modalService: BsModalService,
    readonly establishmentService: EstablishmentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly reportStatementService: ReportStatementService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.route.queryParams.subscribe(params => {
      if (params && params?.socialInsuranceNo && params?.registrationNumber && params.isUserLoggedIn === 'true') {
        this.socialInsuranceNumber = params.socialInsuranceNo;
        this.registrationNumber = params.registrationNumber;
        this.isUserLoggedIn = params.isUserLoggedIn;
        this.isWorkflow = true;
        this.checkContributorDetails();
        this.selectedPeriod = this.creditManagementService.getSelectedTerminationPeriod();
      }
    });
    if (this.isUserLoggedIn === false) {
      this.verifyPersonForm = this.fb.group({
        registrationNo: [null, { validators: [Validators.required], updateOn: 'blur' }],
        socialInsuranceNo: [null, { validators: [Validators.required], updateOn: 'blur' }]
      });
    }
    this.identifyTheTransaction();
    if (this.isWorkflow) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
        this.registrationNumber = payload.registrationNo;
        this.requestNo = payload.requestId ? Number(payload.requestId) : null;
        this.socialInsuranceNumber = payload.socialInsuranceNo ? Number(payload.socialInsuranceNo) : null;
        this.isUserLoggedIn = true;
        this.searchContributor();
        this.getBackdatedTerminationValues();
      }
    }
  }
  //method to check whether the transaction in workflow or not
  identifyTheTransaction() {
    this.route.url.subscribe(res => {
      if (res[1] && res[1].path === 'edit') this.isWorkflow = true;
      else this.isWorkflow = false;
    });
  }
  /** ----------- for verification of contributor ---------  */
  searchContributor() {
    markFormGroupTouched(this.verifyPersonForm);
    if (this.verifyPersonForm.valid || this.isWorkflow) {
      this.registrationNumber = this.verifyPersonForm?.get('registrationNo')?.value
        ? this.verifyPersonForm?.get('registrationNo')?.value
        : this.registrationNumber;
      this.socialInsuranceNumber = this.verifyPersonForm?.get('socialInsuranceNo')?.value
        ? this.verifyPersonForm?.get('socialInsuranceNo')?.value
        : this.socialInsuranceNumber;
      this.checkContributorDetails();
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  checkContributorDetails() {
    this.creditManagementService.searchContributor(this.registrationNumber, this.socialInsuranceNumber).subscribe(
      data => {
        this.alertService.clearAllErrorAlerts();
        this.contributorDetails = data;
        this.getBackdatedTeminationTransactionsDet();
      },
      err => {
        this.isUserLoggedIn = false;
        this.showErrorMessage(err);
      }
    );
  }
  /*** Method to get backdated termination details **/
  getBackdatedTeminationTransactionsDet() {
    this.establishmentService.getEstablishment(this.registrationNumber).subscribe(data => {
      this.establishmentDetails = data;
      if (
        this.establishmentDetails?.status !== null &&
        this.establishmentDetails.status !== undefined &&
        this.establishmentDetails?.status?.english !== 'Closed'
      ) {
        this.contributionPaymentService.getWorkFlowStatus(this.registrationNumber).subscribe(res => {
          if (res && res.length > 0) {
            res.forEach(value => {
              if (value) {
                if (value.type === BillingConstants.LEGAL_ENTITY_CHANGE) {
                  this.alertService.showErrorByKey('BILLING.CHANGE-IN-LEGAL-ENTITY');
                  this.isUserLoggedIn = false;
                } else if (value.type === BillingConstants.DELINK_BRANCH_CHANGE) {
                  this.alertService.showErrorByKey('BILLING.CHANGE-IN-DELINK');
                  this.isUserLoggedIn = false;
                } else if (value.type === BillingConstants.CHANGE_OWNER) {
                  this.alertService.showErrorByKey('BILLING.CHANGE-IN-OWNER');
                  this.isUserLoggedIn = false;
                } else {
                  this.getContributorRefundDetails();
                }
              }
            });
          } else {
            this.getContributorRefundDetails();
          }
        });
      } else if (this.establishmentDetails?.status?.english === 'Closed') {
        this.isUserLoggedIn = false;
        this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
      }
    });
  }
  /*** Method to get contributor refund details details **/
  getContributorRefundDetails() {
    this.creditManagementService
      .getBackdatedTeminationTransactionsDetails(this.registrationNumber, this.socialInsuranceNumber)
      .subscribe(
        res => {
          this.isUserLoggedIn = true;
          this.alertService.clearAlerts();
          if (res) this.backdatedTerminationTransactionsDetails = res;
        },
        err => {
          this.isUserLoggedIn = false;
          this.alertService.showError(err.error.message);
        }
      );
    this.creditManagementService.getAvailableCreditBalance(this.registrationNumber).subscribe(data => {
      this.establishmentCreditDetails = data;
    });
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /**
   * Method to show error messages coming from api **/

  navigateToRefundAmountPage() {
    this.router.navigate([BillingConstants.CONTRIBUTOR_REFUND_AMOUNT_ROUTE], {
      queryParams: {
        socialInsuranceNo: this.socialInsuranceNumber,
        registrationNumber: this.registrationNumber,
        workflow: this.isWorkflow,
        requestNo: this.requestNo,
        referenceNumber: this.referenceNumber
      }
    });
  }
  selectedTerminationPeriod(selectedPeriod: SelectedTerminationPeriodDetails[]) {
    this.creditManagementService.setSelectedTerminationPeriod(selectedPeriod);
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to hide modal. */
  hideModal(): void {
    if (this.modalRef) this.modalRef.hide();
  }
  /**Method to navigate to inbox on modal confirmation  */
  generateStatement() {
    this.reportStatementService
      .generateCreditRefundStatement(this.registrationNumber, this.socialInsuranceNumber, this.languageType)
      .subscribe(res => {
        this.hideModal();
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
  /**Method to navigate to home screen on trasaction cancel  */
  onCancel() {
    this.router.navigate(['home/billing/credit-transfer/contributor-refund-credit-balance/refresh']);
  }
  /**Method to navigate to home screen after transaciton is confirmed  */
  navigateToHome() {
    this.hideModal();
    this.router.navigate(['home/billing/credit-transfer/contributor-refund-credit-balance/refresh']);
  }
  /**Method to set error message if the total refund amount is greater than max refund amount */
  setRefundExceededError(status: boolean) {
    this.refundAmountExceedError = status;
    if (status) {
      scrollToTop();
    }
  }
  /** Method to get termination details of contributor . */
  getBackdatedTerminationValues() {
    this.creditManagementService
      .getBackdatedTerminationDetails(this.registrationNumber, this.socialInsuranceNumber, this.requestNo)
      .subscribe(
        val => {
          this.transactionsDetails = val;
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
  }
}
