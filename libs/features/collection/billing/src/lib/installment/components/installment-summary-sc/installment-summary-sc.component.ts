import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { InstallmentBaseScComponent } from '../../../shared/components';
import { BillingConstants, RouteConstants } from '../../../shared/constants';
import { EstablishmentDetails, InstallmentHistory, Installments } from '../../../shared/models';
import { ContributionPaymentService, EstablishmentService } from '../../../shared/services';
import { InstallmentService } from '../../../shared/services/installment.service';

@Component({
  selector: 'blg-installment-summary-sc',
  templateUrl: './installment-summary-sc.component.html',
  styleUrls: ['./installment-summary-sc.component.scss']
})
export class InstallmentSummaryScComponent extends InstallmentBaseScComponent implements OnInit {
  /**-----------------Local Variables-------------------- */
  regNumber: number;
  documents: DocumentItem[] = [];
  establishmentDetails: EstablishmentDetails;
  active = true;
  lang = 'en';
  searchFlag = true;
  fromPage: string;
  activeInstallmentDetails: Installments;
  refNo: number;
  selectedTab = 'BILLING.INSTALLMENT-SCHEDULE';
  tabList = [
    { name: 'BILLING.INSTALLMENT-SCHEDULE', imgUrl: 'assets/images/installmenticons/graycal.svg' },
    { name: 'BILLING.GUARANTEE-DETAILS', imgUrl: 'assets/images/installmenticons/twohands.svg' },
    { name: 'BILLING.DOCUMENTS', imgUrl: 'assets/images/installmenticons/file-alt-solid.svg' }
  ];
  /**
   *
   * @param alertService
   * @param activatedRoute
   * @param documentService
   * @param installmentService
   * @param establishmentService
   * @param router
   * @param language
   * @param contributionPaymentService
   */
  constructor(
    readonly alertService: AlertService,
    readonly activatedRoute: ActivatedRoute,
    readonly documentService: DocumentService,
    readonly installmentService: InstallmentService,
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly contributionPaymentService: ContributionPaymentService
  ) {
    super(alertService, installmentService, documentService, contributionPaymentService);
  }
  /**
   * Methos to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.activatedRoute.params.subscribe(param => {
      if (param.from === 'history' && !this.installmentService.getInstallmentId) {
        this.fromPage = param.from;
        this.getEstablishment(this.installmentService.getRegistrationNo);
      } else if (param.from === 'history' && this.installmentService.getInstallmentId) {
        this.fromPage = param.from;
        this.fromHistory = true;
        this.searchFlag = false;
        this.getEstablishment(this.installmentService.getRegistrationNo);
        this.getInstallmentDetailsById(
          this.installmentService.getRegistrationNo,
          this.installmentService.getInstallmentId
        );
      } else if (param && param.regNo) {
        this.getEstablishment(param.regNo);
        this.getInstallmentDetailsById(param.regNo, this.installmentService.getInstallmentId);
      }
    });
    if (!this.regNumber) {
      this.regNumber = this.establishmentRegistrationNo.value;
      this.getEstablishment(this.regNumber);
    }
  }
  /** Method to get Establshment */
  getEstablishment(regNumber: number) {
    this.establishmentService.getEstablishment(regNumber).subscribe(estDetails => {
      this.establishmentDetails = estDetails;
      this.regNumber = regNumber;
      this.installmentService.setRegistrationNo = regNumber;
      if (this.fromPage !== 'history') this.getInstallmentId(regNumber);
      this.outOfMarketFlag = this.establishmentDetails.outOfMarket;
    });
  }
  getInstallmentId(regNumber: number) {
    this.installmentService.getInstallmentactive(regNumber, false).subscribe(
      installment => {
        const activeInstallmentDetails = installment.installmentDetails.filter(item => {
          if (item.status.english === 'Active') return item;
        });
        if (activeInstallmentDetails?.length > 0) {
          this.activeInstallmentDetails = activeInstallmentDetails[0];
          this.searchFlag = false;
          if (this.activeInstallmentDetails?.installmentId && regNumber)
            this.getInstallmentDetailsById(regNumber, this.activeInstallmentDetails?.installmentId);
        } else {
          this.navigateToInstallmentHistory();
        }
      },
      err => {
        this.alertService.showError(err.error.message);
        if (err.error.message.english === 'No records found.') {
          this.searchFlag = true;
          this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.regNumber)]);
          this.alertService.showError(err.error.message);
        }
      }
    );
  }

  /**
   * Handle closed and cancelled installments coming other than history page
   * @param installment
   */
  cancelledAndClosedInstallments(installment: InstallmentHistory) {
    const cancelledInstallmentDetails = installment.installmentDetails.filter(item => {
      if (item.status.english === 'Cancelled') return item;
    });
    const closedInstallmentDetails = installment.installmentDetails.filter(item => {
      if (item.status.english === 'Closed') return item;
    });
    if (cancelledInstallmentDetails.length > 0) {
      this.activeInstallmentDetails = cancelledInstallmentDetails[0];
      this.searchFlag = false;
    } else if (closedInstallmentDetails.length > 0) {
      this.activeInstallmentDetails = closedInstallmentDetails[0];
      this.searchFlag = false;
    } else {
      this.searchFlag = true;
      this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.regNumber)]);
      this.alertService.showErrorByKey('BILLING.NO-INSTALLMENT-ERROR-MESSAGE');
    }
  }

  /** Method to get Installment Details by Id
   * @param Installment_Id
   */
  getInstallmentDetailsById(regNo, id) {
    this.installmentService.getInstallmentDetailsById(regNo, id).subscribe(instDetails => {
      this.installmentSummary = instDetails;
      this.refNo = this.installmentSummary.transactionTraceId;
      this.guarantee = this.installmentSummary.guaranteeDetail[0].category.english;
      this.guaranteeType = this.installmentSummary.guaranteeDetail[0].type;
      this.status = this.installmentSummary.guaranteeStatus;
      this.SpecialGuaranteeType = this.installmentSummary.specialGuaranteeType;
      this.setDocumentParameters();
      this.getDocuments();
    });
  }
  navigateToInstallmentHistory() {
    this.router.navigate([BillingConstants.INSTALLMENT_HISTORY_ROUTE]);
  }

  onNewTabSelected(selectedTab) {
    this.selectedTab = selectedTab;
  }
  /**
   * Method to get documents based on receipt mode.
   * @param receiptNo receipt number
   * @param docType document type
   */
  getDocuments() {
    this.documentService
      .getDocuments(this.transactionId, this.transactionType, this.regNumber, this.refNo)
      .subscribe(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      });
  }
}
