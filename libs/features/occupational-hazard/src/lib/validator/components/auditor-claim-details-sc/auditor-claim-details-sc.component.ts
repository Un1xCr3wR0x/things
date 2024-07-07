/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, HostListener, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ClaimSummaryDetails,
  ClarificationRequest,
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  Pagination,
  PreviousClaims,
  ReceiveClarification,
  Route,
  DiseaseService
} from '../../../shared';
import { ClaimFilterParams } from '../../../shared/models/claim-filter-params';
import { ClaimsSummary } from '../../../shared/models/claims-summary';
import { FilterKeyValue } from '../../../shared/models/filier-key-value';
import { TreatmentService } from '../../../shared/models/treatment-service';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { AllowanceBaseScComponent } from '../../base/allowance-sc.base-component';

@Component({
  selector: 'oh-auditor-claim-details-sc',
  templateUrl: './auditor-claim-details-sc.component.html',
  styleUrls: ['./auditor-claim-details-sc.component.scss']
})
export class AuditorClaimDetailsScComponent extends AllowanceBaseScComponent implements OnInit {
  /*Local Variables*/

  invoiceItemId: number;
  maxLengthComments = 300;
  comment: FormControl = new FormControl(null, { updateOn: 'blur' });
  treatmentDetails: TreatmentService = new TreatmentService();
  claimSummaryDetails: ClaimSummaryDetails;
  diseaseIdMessage = '';
  previousClaims: PreviousClaims;
  batchMonth: string;
  pageNo = 0;
  pageSize = 10;
  pagination = new Pagination();
  claimNo: number;
  hideAction = false;
  closeModal = false;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  showMarkAsCompleted = true;
  rejectedServices = new Array();
  ohId: number;
  auditResponse: BilingualText;
  message = 'OCCUPATIONAL-HAZARD.PROHIBIT-CLAIM';
  selectedIds = [];
  selectedService = [];
  auditNo: number;
  claimsAuditComments: string;
  clarifications: ReceiveClarification[] = [];

  /** Observables */
  rejectReasonList$: Observable<LovList>;
  serviceTypeList$: Observable<LovList>;
  filterParams: FilterKeyValue[];

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly claimsService: OhClaimsService,
    readonly injuryService: InjuryService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    @Inject(RouterDataToken) readonly routerData: RouterData,    
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly activatedRoute: ActivatedRoute,
    readonly lookupService: LookupService
  ) {
    super(
      language,
      ohService,
      claimsService,
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
  ngOnInit(): void {
    if (this.routerData.taskId === null) {
      this.getRouterData(this.ohService.getRouterData());
    }
    if (this.routerData.taskId !== null) {
      this.reportAllowanceModal = this.createAllowanceModalForm();
      this.getRouterData(this.routerData);
      this.setValidatorActions();
      this.requestedDocumentList();
    }
    if (this.router.url.indexOf('/claim') !== -1) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.tpaCode = res.get('tpaCode');
        this.claimNo = parseInt(res.get('claimNo'), 10);
        this.invoiceId = parseInt(res.get('invoiceId'), 10);
        this.batchItemId = parseInt(res.get('invoiceId'), 10);
        this.routerData.transactionId = parseInt(res.get('referenceNo'), 10);
        this.hideAction = true;
      });
    }
    this.pagination.page.pageNo = 0;
    this.pagination.page.size = 10;
    this.rejectReasonList$ = this.lookupService.getTreatmentServiceRejectionList();
    this.serviceTypeList$ = this.lookupService.getTreatmentServiceTypeList();
    this.getBatchDetails(this.invoiceId, this.tpaCode);
    this.invoiceDetails = this.claimsService.getInvoiceData();
    if (!this.claimNo) {
      this.claimNo = this.claimsService.getClaimNo();
    }
    if (!this.invoiceDetails) {
      this.getClaims();
    }
  }
  /**
   * Method to show approve modal
   * @param templateRef
   */
  batchModal(templateRef: TemplateRef<HTMLElement>) {
    if (this.previousInvoiceId) {
      this.getPreviousBatchDetails(this.previousInvoiceId, this.previoustpaCode);
    }
    this.showPreviousModal(templateRef);
  }
  getSortDetails(event) {
    this.pagination.sort = event;
    if (this.pagination?.sort?.isDefault === true) {
      this.filterParams = null;
    }
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }
  showPreviousModal(templateRef: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered' };
    this.modalRef = this.modalService.show(templateRef, config);
  }
  requestTpa() {
    const workflowData = new ClarificationRequest();
    let id;
    if (this.injuryId) {
      id = this.injuryId;
    } else {
      id = this.complicationId;
    }
    workflowData.invoiceId = this.invoiceId;
    workflowData.serviceIds = this.selectedIds;
    workflowData.comments = this.reportAllowanceModal.get('comments').value;
    workflowData.referenceNo = this.routerData.transactionId;
    workflowData.documents = this.tpaRequestedDocs;
    if (this.reportAllowanceModal && this.reportAllowanceModal?.valid) {
      this.ohService.validatorSubmit(workflowData, id).subscribe(
        () => {
          this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-CLARIFICATION');
          this.updateReadStatus(this.ohId, this.routerData.transactionId);
          this.updateStatus(this.invoiceItemId);
          this.fetchComments(this.ohId, this.socialInsuranceNo, this.registrationNo, this.routerData.transactionId);
          this.getClaims();
          this.hideModal();
        },
        err => {
          this.showError(err);
          this.hideModal();
        }
      );
      this.resetModalClaims();
    } else {
      this.claimsAuditComments = this.reportAllowanceModal.get('comments').value;
      if (this.claimsAuditComments === null) {
        this.alertService.clearAlerts();
        this.commentAlert = true;
        markFormGroupTouched(this.reportAllowanceModal);
      }
    }
  }
  resetModalClaims() {
    this.reportAllowanceModal.reset();
    this.resetModal();
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size, selectedService?) {
    this.selectedIds = [];
    this.resetModalClaims();
    this.commentAlert = false;
    this.selectedService = selectedService;
    if (selectedService) {
      selectedService?.forEach(service => {
        this.selectedIds.push(service.serviceId);
      });
    }
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }
  fetchTreatmentDetails(filterParams: Array<FilterKeyValue>) {
    this.filterParams = filterParams;
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }
  /**
   * clear the modal
   */
  clear() {
    this.modalRef.hide();
    this.getBatchDetails(this.invoiceId, this.tpaCode);
  }
  closeBatch() {
    this.clear();
  }

  rejectTreatment(rejectedService) {
    this.rejectedServices = [];
    rejectedService?.controls?.forEach(control => {
      if (control.get('serviceDetails.serviceRejectionDetails')) {
        this.rejectedServices.push(control.get('serviceDetails.serviceRejectionDetails').value);
      }
    });
    this.claimsService
      .rejectAuditing(
        this.tpaCode,
        this.invoiceId,
        this.invoiceItemId,
        rejectedService.getRawValue(),
        this.rejectedServices
      )
      .subscribe(
        response => {
          this.auditResponse = response;
          this.getTreatmentDetails(
            this.tpaCode,
            this.invoiceId,
            this.invoiceItemId,
            this.pagination,
            this.filterParams
          );
          this.router.navigate(['home/oh/validator/auditor']);
          this.alertService.clearAllErrorAlerts();
          this.alertService.showSuccess(this.auditResponse);
        },
        error => {
          this.alertService.clearAllSuccessAlerts();
          this.showError(error);
        }
      );
    this.closeModal = true;
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }
  // Method to Fetch Batch details for Auditor Flow
  getBatchDetails(invoiceId, tpaCode) {
    this.claimsService.getBatchDetails(tpaCode, invoiceId).subscribe(
      response => {
        this.batchDetails = response;
        this.batchDetails.batchYear = moment(this.batchDetails.batchMonth.gregorian).toDate().getFullYear().toString();
      },
      err => {
        this.showError(err);
      }
    );
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
  // Method to Fetch Treatment Service details for Auditor Flow
  getTreatmentDetails(tpaCode, invoiceId, invoiceItemId, pagination, filterParams) {
    this.invoiceItemId = invoiceItemId;
    this.claimsService
      .getTreatmentServiceDetails(tpaCode, invoiceId, invoiceItemId, pagination, filterParams)
      .subscribe(
        response => {
          if (pagination.page.pageNo === 0) {
            this.treatmentDetails = response;
          } else {
            response?.services?.forEach(element => {
              this.treatmentDetails?.services?.push(element);
            });
          }
        },
        err => {
          this.showError(err);
        }
      );
  }

  /**
   *
   * @param loadmoreObj Load more
   */
  loadMore(loadmoreObj) {
    this.pagination.page.pageNo = loadmoreObj.currentPage;
    this.pagination.page.size = this.pageSize;
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }
  /**
   * This method is to select the page number on pagination
   */
  getselectPageNo(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getTreatmentDetails(this.tpaCode, this.invoiceId, this.invoiceItemId, this.pagination, this.filterParams);
  }
  /**
   *
   * @param claims Fetch claims Details
   */
  fetchClaim(claims: ClaimsSummary) {
    this.invoiceId = claims.invoiceId;
    this.registrationNo = claims.regNo;
    this.claimNo = claims.claimNo;
    this.socialInsuranceNo = claims.sin;
    this.ohId = claims.ohId;
    this.invoiceItemId = claims.invoiceItemId;
    this.claimsService.fetchClaimSummary(this.tpaCode, claims.invoiceId, claims.invoiceItemId).subscribe(
      response => {
        this.claimSummaryDetails = response;
        if (this.claimSummaryDetails.ohType === 0) {
          this.injuryId = this.claimSummaryDetails.ohId;
        } else {
          this.complicationId = this.claimSummaryDetails.ohId;
        }
        this.registrationNo = claims.regNo;
        this.socialInsuranceNo = claims.sin;
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.getContributor();
        this.fetchPreviousClaims(claims);
        this.documents = this.documentFetchForAllowance(claims.ohId, this.routerData.transactionId);
        this.updateReadStatus(claims.ohId, this.routerData.transactionId);
        this.updateStatus(claims.invoiceItemId);
        this.auditNo = claims.ohId;
        this.fetchComments(claims.ohId, claims.sin, claims.regNo, this.routerData.transactionId);
        this.getTreatmentDetails(
          this.tpaCode,
          this.invoiceId,
          claims.invoiceItemId,
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
   * Fetch previous Claims
   */
  fetchPreviousClaims(claims: ClaimsSummary) {
    this.claimsService.fetchPrevioucClaims(claims.regNo, claims.sin, claims.ohId).subscribe(
      response => {
        this.previousClaims = response;
        if (this.invoiceId) {
          if (this.invoiceId <= this.previousClaims.previousClaims[0].invoiceId) {
            this.previousClaims.message = {
              english: 'No previous claims present for this injury',
              arabic: 'لا توجد مطالبات سابقة للإصابة'
            };
          }
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  // navigate by clicking Id
  navigateTo(details: ClaimSummaryDetails) {
    this.claimsService.setInvoiceDetails(this.invoiceDetails);
    this.claimsService.setClaimNo(details.claimNo);
    this.claimsService.setInvoiceId(this.invoiceId);
    this.claimsService.setTPACode(this.tpaCode);
    if (this.hideAction) {
      this.ohService.setRoute(Route.AUDITOR_VIEW);
    } else {
      this.ohService.setRoute(Route.AUDITOR);
    }
    if (details.ohType === 0) {
      this.router.navigate([`home/oh/view/${details.regNo}/${details.sin}/${details.ohId}/injury/info`]);
    } else if (details.ohType === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.diseaseIdMessage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (details.ohType === 2) {
      this.router.navigate([
        `home/oh/view/${details.regNo}/${details.sin}/${details.injuryNo}/${details.ohId}/complication/info`
      ]);
    }
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
    this.claimsService.setClaimNo(null);
  }
  /**
   * Mark the batch as completed
   */
  markAsCompleted() {
    this.approveWorkflow();
  }
  /**
   *
   * @param filterValues Api call for filter
   */
  applyFilter(filterValues: ClaimFilterParams) {
    this.getClaims(filterValues);
  }
  fetchClarification(ohId, sin, regNo, transactionId, index) {
    this.claimsService.getComments(ohId, sin, regNo, transactionId).subscribe(
      res => {
        this.invoiceDetails.cases[index].receiveClarification = [];
        this.clarifications = res;
        if (this.clarifications?.filter(item => item.clarificationReceived === false).length > 0) {
          this.showMarkAsCompleted = false;
        }
        this.invoiceDetails.cases[index].receiveClarification = this.clarifications;
      },
      err => {
        this.showError(err);
      }
    );
  }
  updateStatus(invoiceItemId) {
    this.claimsService.updateStatus(this.tpaCode, this.invoiceId, invoiceItemId).subscribe();
  }
  hideModal() {
    this.modalRef.hide();
  }
  getClaims(filterValues?) {
    this.claimsService.getInvoiceDetails(this.tpaCode, this.invoiceId, filterValues).subscribe(
      response => {
        this.invoiceDetails = response;
        this.invoiceDetails?.cases?.forEach((element, index) => {
          this.fetchClarification(element.ohId, element.sin, element.regNo, this.routerData.transactionId, index);
        });
        this.previousInvoiceId = this.invoiceDetails.previousInvoiceId;
        this.previoustpaCode = this.invoiceDetails.previousBatchTpaCode;
        this.invoiceDetails.batchYear = moment(this.invoiceDetails.batchMonth.gregorian)
          .toDate()
          .getFullYear()
          .toString();
      },
      err => {
        this.showError(err);
      }
    );
  }
}

