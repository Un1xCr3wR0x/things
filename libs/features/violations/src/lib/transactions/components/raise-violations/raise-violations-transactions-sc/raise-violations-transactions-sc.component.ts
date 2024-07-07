import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  ExcludedContributorDcComponent,
  InspectionChannel,
  PenaltyDetailsDcComponent,
  PreviousEstablishmentViolationsScComponent,
  TransactionsBaseScComponent,
  ViolationRouteConstants,
  ViolationTransactionId,
  ViolationsEnum,
  ViolationsValidatorService
} from '@gosi-ui/features/violations/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'vol-raise-violations-transactions-sc',
  templateUrl: './raise-violations-transactions-sc.component.html',
  styleUrls: ['./raise-violations-transactions-sc.component.scss']
})
export class RaiseViolationsTransactionsScComponent extends TransactionsBaseScComponent implements OnInit {
  lang: string;
  channelRased = InspectionChannel.RASED;
  channelE_Inspection = InspectionChannel.E_INSPECTION;
  channelHrsd = InspectionChannel.HRSD;
  modalRef: BsModalRef;
  referenceNo: number;
  booleanYes = ViolationsEnum.BOOLEAN_YES;
  foValidatorTxn = ViolationTransactionId.FO_VALIDATOR;
  foVcmTxn = ViolationTransactionId.FO_VCM;
  constructor(
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    readonly location: Location,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly modalService: BsModalService
  ) {
    super(
      transactionService,
      alertService,
      documentService,
      routerDataToken,
      router,
      validatorService,
      location,
      appToken
    );
    this.documentTransactionKey = DocumentTransactionId.MANUALLY_TRIGGERED_VIOLATION;
    this.documentTransactionType = DocumentTransactionType.REGISTER_VIOLATION_THROUGH_FO;
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    super.getTransactionData();
    if (this.estRegNo && this.violationId) {
      this.isReportViolationTransaction = true;
      this.getViolationData();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  /**
   * Navigate to Exclude Contributor Page
   */
  navigateToExcludeContributorPage(totalRecords: number) {
    this.violationDetails.penaltyInfo.forEach(item => {
      item.excludedContributors.forEach(excludedContributor => {
        this.violationDetails.contributors.forEach(data => {
          if (excludedContributor.contributorId === data.contributorId) {
            data.excluded = true;
          }
        });
      });
    });
    const initialState = {
      transactionDetails: this.violationDetails,
      totalRecords: totalRecords,
      isViolationTransactionPage: true
    };
    this.modalRef = this.modalService.show(ExcludedContributorDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: `modal-xl modal-dialog-centered`,
      initialState
    });
  }
  /** This method is to show the modal reference for penalty details. */
  getPenaltyDetails(index) {
    this.violationDetails.index = index;
    const initialState = {
      index: index,
      penaltyInfoDetails: this.violationDetails.penaltyInfo
    };
    this.modalRef = this.modalService.show(PenaltyDetailsDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
      initialState
    });
  }

  viewPreviousViolation() {
    const initialState = {
      transactionDetails: this.violationDetails
    };
    this.modalRef = this.modalService.show(PreviousEstablishmentViolationsScComponent, {
      ignoreBackdropClick: true,
      backdrop: true,
      class: `modal-xl modal-dialog-centered`,
      initialState
    });
  }
  violationProfileNavigation(data: { violationId: number; regNo: number }) {
    this.router.navigate([ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(data?.violationId, data?.regNo)]);
  }
  // getDocs(){
  //   this.referenceNo = this.violationDetails?.violationReferenceNumber;
  //   super.getUploadedDocuments(this.documentTransactionKey,this.documentTransactionType,this.violationId,this.referenceNo);
  // }
}
