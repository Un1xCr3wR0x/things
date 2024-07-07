import { Component, OnInit, Inject, TemplateRef, ViewChild } from '@angular/core';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  WorkflowService,
  LovList,
  LookupService,
  LanguageToken
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  Route,
  PreviousClaims,
  Pagination,
  ClaimSummaryDetails,
  DiseaseService
} from '../../../shared';
import { AllowanceBaseScComponent } from '../../../validator/base/allowance-sc.base-component';
import { Location, PlatformLocation } from '@angular/common';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TreatmentService } from '../../../shared/models/treatment-service';
import { FilterKeyValue } from '../../../shared/models/filier-key-value';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClaimFilterParams } from '../../../shared/models/claim-filter-params';
import { ClaimsSummary } from '../../../shared/models/claims-summary';
import moment from 'moment';
import { InvoiceDetails } from '../../../shared/models/invoice-details';
@Component({
  selector: 'oh-claims-audit-sc',
  templateUrl: './claims-audit-sc.component.html',
  styleUrls: ['./claims-audit-sc.component.scss']
})
export class ClaimsAuditScComponent extends AllowanceBaseScComponent implements OnInit {
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly pLocation: PlatformLocation,
    readonly ohService: OhService,
    readonly claimService: OhClaimsService,
    readonly modalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly workflowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,   
    readonly router: Router,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly transactionService: TransactionService,
    readonly lookupService: LookupService
  ) {
    super(
      language,
      ohService,
      claimService,
      injuryService,
      establishmentService,
      alertService,
      router,
      documentService,
      contributorService,
      fb,
      complicationService,
      diseaseService,
      routerData,
      location,
      pLocation,
      appToken,      
      workflowService
    );
  }
  serviceTypeList$: Observable<LovList>;
  filterParams: FilterKeyValue[];
  goBackUrl = '../../../../../transactions/list';
  transaction: Transaction;
  transactionRefId: number;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  transactionId: number;
  bussinessId: number;
  refNo: number;
  treatmentDetails: TreatmentService = new TreatmentService();
  claimSummaryDetails: ClaimSummaryDetails;
  previousClaims: PreviousClaims;
  batchData: InvoiceDetails;
  batchMonth: string;
  pageNo = 0;
  pageSize = 10;
  pagination = new Pagination();
  claimNumber: number;
  invoiceItemId: number;
  hideAction = true;
  closeModal = false;
  diseaseIdMessage = '';
  tpaCode: string;
  header: BilingualText;
  resourceType: string;
  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.refNo = this.transaction.transactionRefNo;
      this.header = this.transaction.title;
      this.invoiceId = this.transaction.params.BUSINESS_ID;
      this.injuryNumber = this.transaction.params.INJURY_ID;
      this.tpaCode = this.transaction.params.TPA_CODE;
    }
    this.pagination.page.pageNo = 0;
    this.pagination.page.size = 10;
    this.serviceTypeList$ = this.lookupService.getTreatmentServiceTypeList();
    this.getBatchDetails(this.invoiceId, this.tpaCode);
    if (!this.claimNumber) {
      this.claimNumber = this.claimsService.getClaimNo();
    }
    this.invoiceDetails = this.claimsService.getInvoiceData();
    if (!this.invoiceDetails) {
      this.getClaimsInvoice();
    }
  }
  getSortDetails(event) {
    this.pagination.sort = event;
    if (this.pagination?.sort?.isDefault === true) {
      this.filterParams = null;
    }
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }

  //Method to get same batch modal
  batchModal(templateRef: TemplateRef<HTMLElement>) {
    if (this.previousInvoiceId) {
      this.getPreviousBatchDetails(this.previousInvoiceId, this.previoustpaCode);
    }
    this.showPreviousModal(templateRef);
  }
  //Method to get Previous batch modal

  showPreviousModal(templateRef: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered' };
    this.modalRef = this.modalService.show(templateRef, config);
  }

  fetchTreatmentDetails(filterParams: Array<FilterKeyValue>) {
    this.filterParams = filterParams;
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }
  //show modal
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }
  //clear modal
  clear() {
    this.modalRef.hide();
    this.getBatchDetails(this.invoiceId, this.tpaCode);
  }
  // Method to Fetch Previous Batch details for Auditor Flow
  getPreviousBatchDetails(invoiceId, tpaCode) {
    this.claimsService.getBatchDetails(tpaCode, invoiceId).subscribe(
      response => {
        this.previousBatchDetails = response;
        this.previousBatchDetails.batchYear = moment(this.previousBatchDetails.batchMonth.gregorian)
          .toDate()
          .getFullYear()
          .toString();
      },
      err => {
        this.showError(err);
      }
    );
  }
  // Method to Fetch Batch details for Auditor Flow
  getBatchDetails(invoiceId, tpaCode) {
    this.claimsService.getBatchDetails(tpaCode, invoiceId).subscribe(
      response => {
        this.batchData = response;
        this.batchData.batchYear = moment(this.batchData.batchMonth.gregorian).toDate().getFullYear().toString();
      },
      err => {
        this.showError(err);
      }
    );
  }

  //* @param loadmoreObj Load more
  loadMore(loadmoreObj) {
    this.pagination.page.pageNo = loadmoreObj.currentPage;
    this.pagination.page.size = this.pageSize;
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }
  // Method to Fetch Treatment Service details for Auditor Flow
  getTreatmentDetails(tpaCode, invoiceId, invoiceItemId, pageParams, filterValues) {
    this.invoiceItemId = invoiceItemId;
    this.claimsService
      .getTreatmentServiceDetails(tpaCode, invoiceId, invoiceItemId, pageParams, filterValues)
      .subscribe(
        response => {
          if (pageParams.page.pageNo === 0) {
            this.treatmentDetails = response;
          } else {
            response?.services?.forEach(item => {
              this.treatmentDetails?.services?.push(item);
            });
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  // This method is to select the page number on pagination

  getselectPageNo(selectedPage: number) {
    this.pageNo = selectedPage;
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }
  // Fetch previous Claims

  fetchPreviousClaims(claimItem: ClaimsSummary) {
    this.claimsService.fetchPrevioucClaims(claimItem.regNo, claimItem.sin, claimItem.ohId).subscribe(
      res => {
        this.previousClaims = res;
      },
      err => {
        this.showError(err);
      }
    );
  }
  // @param claims Fetch claims Details

  fetchClaim(claimItem: ClaimsSummary) {
    this.invoiceId = claimItem.invoiceId;
    this.claimsService.fetchClaimSummary(this.tpaCode, claimItem.invoiceId, claimItem.invoiceItemId).subscribe(
      result => {
        this.claimSummaryDetails = result;
        this.registrationNo = claimItem.regNo;
        this.socialInsuranceNo = claimItem.sin;
        this.getContributor();
        this.fetchPreviousClaims(claimItem);
        this.fetchComments(
          claimItem.ohId,
          claimItem.sin,
          claimItem.regNo,
          this.refNo,
          true,
          this.transaction.assignedTo
        );
        this.getTreatmentDetails(
          this.tpaCode,
          this.invoiceId,
          claimItem.invoiceItemId,
          this.pagination,
          this.filterParams
        );
      },
      err => {
        this.showError(err);
      }
    );
  }

  /**
   *
   * @param filterValues Api call for filter
   */
  applyFilter(filterValues: ClaimFilterParams) {
    this.getClaimsInvoice(filterValues);
  }
  /**
   * navigate by clicking Id
   */
  navigateTo(claimItem: ClaimSummaryDetails) {
    if (this.hideAction) {
      this.ohService.setRoute(Route.AUDITOR_VIEW);
    } else {
      this.ohService.setRoute(Route.AUDITOR);
    }
    this.claimsService.setInvoiceDetails(this.invoiceDetails);
    this.claimsService.setClaimNo(claimItem.claimNo);
    this.claimsService.setInvoiceId(this.invoiceId);
    this.claimsService.setTPACode(this.tpaCode);
    if (claimItem.ohType === 0) {
      this.router.navigate([`home/oh/view/${claimItem.regNo}/${claimItem.sin}/${claimItem.ohId}/injury/info`]);
    } else if (claimItem.ohType === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.diseaseIdMessage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (claimItem.ohType === 2) {
      this.router.navigate([
        `home/oh/view/${claimItem.regNo}/${claimItem.sin}/${claimItem.injuryNo}/${claimItem.ohId}/complication/info`
      ]);
    }
  }
}

