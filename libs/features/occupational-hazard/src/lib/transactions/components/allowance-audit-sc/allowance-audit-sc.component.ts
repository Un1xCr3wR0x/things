import { Component, OnInit, Inject, TemplateRef, ViewChild } from '@angular/core';
import {
  WorkflowService,
  AlertService,
  LookupService,
  RouterDataToken,
  RouterData,
  LovList,
  TransactionService,
  Transaction,
  BilingualText,
  DocumentService,
  ApplicationTypeToken,
  LanguageToken
} from '@gosi-ui/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AllowanceFilterParams,
  AuditorFilterParams,
  Contributor,
  ContributorService,
  OhService,
  Pagination,
  InjuryService,
  EstablishmentService,
  ComplicationService,
  ReceiveClarification,
  DiseaseService,
  InjuryConstants,
  ComplicationConstants
} from '../../../shared';
import { AllowanceAuditSummary } from '../../../shared/models/allowance-audit-summary';
import { AllowanceList } from '../../../shared/models/allowance-list';
import { AllowanceSummary } from '../../../shared/models/allowance-summary';
import { AuditAllowance } from '../../../shared/models/audit-allowance';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { AllowanceBaseScComponent } from '../../../validator/base/allowance-sc.base-component';
import { FormBuilder } from '@angular/forms';
import { Location, PlatformLocation } from '@angular/common';
import { DiseaseConstants } from '../../../shared/constants/disease-constants';
@Component({
  selector: 'oh-allowance-audit-sc',
  templateUrl: './allowance-audit-sc.component.html',
  styleUrls: ['./allowance-audit-sc.component.scss']
})
export class AllowanceAuditScComponent extends AllowanceBaseScComponent implements OnInit {
  header: BilingualText;
  tpaCode: string;
  refNo: number;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly ohService: OhService,
    readonly claimsService: OhClaimsService,
    readonly workflowService: WorkflowService,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly transactionService: TransactionService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    @Inject(ApplicationTypeToken) readonly appToken: string   
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

  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  pagination = new Pagination();
  allAllowanceDetail = [];
  totalPrevAllowanceCount: number;
  previousAllowanceDetails: AuditAllowance;
  auditNo: number;
  sortList: LovList;
  allAllowanceDetails = [];
  allAllowanceList = [];
  auditDetails: AllowanceList = new AllowanceList();
  clarifications: ReceiveClarification[] = [];
  auditHeaderDetails: AllowanceList = new AllowanceList();
  allowanceDetail: AuditAllowance;
  auditSummary: AllowanceAuditSummary = new AllowanceAuditSummary();
  socialInsuranceNo: number;
  registrationNo: number;
  contributor: Contributor;
  diseaseIdMessage = '';
  modalRef: BsModalRef;
  previousAllowance: AuditAllowance;
  previousAuditSummary: AllowanceAuditSummary;
  ohList$: Observable<LovList>;
  ohCategoryList$: Observable<LovList>;
  allowanceType$: Observable<LovList>;
  injuryId: number;
  transaction: Transaction;
  isConveyance = false;
  currentPage = 0;
  pageSize = 10;
  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.refNo = this.transaction.transactionRefNo;
      this.header = this.transaction.title;
      this.auditNo = this.transaction.params.BUSINESS_ID;
      this.tpaCode = this.transaction.params.TPA_CODE;
    }
    this.getAuditDetails();
    this.pagination.page.pageNo = 0;
    this.pagination.page.size = 10;
    this.pagination.sort.direction = 'ASC';
    this.pagination.sort.column = 'Days';
    this.sortList = this.lookupService.getSortByList();
    this.getOhCategoryLookup();
    this.getAllowanceTypeLookUpValues();
  }
  getPreviousAllowance(filterApplied) {
    this.claimsService
      .filterPrevAllowanc(
        this.auditNo,
        this.injuryId,
        filterApplied,
        this.pagination,
        this.registrationNo,
        this.socialInsuranceNo
      )
      .subscribe(
        response => {
          this.totalPrevAllowanceCount = response.totalCount;
          if (this.pagination.page.pageNo === 0) {
            this.previousAllowance = response;
            this.previousAllowance?.auditDetail?.forEach(prevId => {
              prevId.caseId = this.injuryId;
            });
          } else {
            response?.auditDetail?.forEach(id => {
              this.previousAllowance?.auditDetail.push(id);
            });
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  loadMore(loadmoreObj) {
    const filterParams = new AllowanceFilterParams();
    this.pagination.page.pageNo = loadmoreObj.currentPage;
    this.pagination.page.size = this.pageSize;
    this.getPreviousAllowance(filterParams);
  }
  sortAllowance(sortEvent) {
    let filterParameter = new AllowanceFilterParams();
    filterParameter = null;
    this.pagination.page.pageNo = 0;
    this.currentPage = 0;
    this.pagination.sort = sortEvent;
    this.claimsService
      .filterAllowanceDetails(
        this.auditNo,
        this.injuryId,
        filterParameter,
        this.pagination,
        this.registrationNo,
        this.socialInsuranceNo
      )
      .subscribe(
        res => {
          this.allowanceDetail = res;
          this.allowanceDetail.auditDetail = this.allowanceDetail?.auditDetail?.reduce((acc, val) => {
            if (!acc.find(id => id.transactionId === val.transactionId)) {
              acc.push(val);
            }
            return acc;
          }, []);
        },
        err => {
          this.showError(err);
        }
      );
    this.getPreviousAllowance(filterParameter);
  }
  // @param filterValues Api call for filtering allowances
  allowanceFilter(filterParams: AllowanceFilterParams) {
    if (filterParams && !filterParams?.claimType?.includes('Conveyance Allowance')) {
      filterParams.visitsMax = null;
      filterParams.visitsMax = null;
    }
    this.claimsService.setFilterValues(filterParams);
    this.claimsService
      .filterAllowanceDetails(
        this.auditNo,
        this.injuryId,
        filterParams,
        null,
        this.registrationNo,
        this.socialInsuranceNo
      )
      .subscribe(
        response => {
          this.allowanceDetail = response;
          this.allowanceDetail.auditDetail = this.allowanceDetail?.auditDetail?.reduce((acc, val) => {
            if (!acc.find(el => el.transactionId === val.transactionId)) {
              acc.push(val);
            }
            return acc;
          }, []);
        },
        err => {
          this.showError(err);
        }
      );
    this.pagination.page.pageNo = 0;
    this.getPreviousAllowance(filterParams);
  }
  /** Method to get lookup values. */
  getAllowanceTypeLookUpValues() {
    const allowanceTypeList$ = this.lookupService.getTransactionStatusList('AuditAllowanceType');
    allowanceTypeList$.subscribe(res => {
      if (res) {
        this.allowanceType$ = allowanceTypeList$;
      }
    });
  }
  /**
   *
   * @param filterValues Api call for filtering oh
   */
  applyFilter(filterValues: AuditorFilterParams) {
    this.claimsService.filterAuditDetails(this.auditNo, filterValues).subscribe(
      response => {
        this.auditDetails = response;
      },
      err => {
        this.showError(err);
      }
    );
  }

  /** Method to get lookup values. */
  getOhCategoryLookup() {
    this.ohList$ = this.lookupService.getOhCategoryTypeList();
    this.ohList$.subscribe(res => {
      if (res) {
        this.ohCategoryList$ = this.ohList$;
      }
    });
  }
  /** Get Audit Details*/
  getAuditDetails() {
    this.claimsService.getAuditDetails(this.auditNo).subscribe(
      response => {
        this.auditHeaderDetails = response;
        this.auditDetails = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  // @param err This method to show the page level error
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /**
   * navigate by clicking Id
   */
  navigateTo(details: AllowanceSummary) {
    if (details.ohType === InjuryConstants.INJURY) {
      this.ohService.setTransactionId(this.transaction.transactionId);
      this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
      this.router.navigate([
        `home/oh/view/${details.registrationNo}/${details.socialInsuranceNo}/${details.caseId}/injury/info`
      ]);
    } else if (details.ohType === DiseaseConstants.DISEASE) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.diseaseIdMessage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (details.ohType === ComplicationConstants.COMPLICATION) {
      this.ohService.setTransactionId(this.transaction.transactionId);
      this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
      this.router.navigate([
        `home/oh/view/${details.registrationNo}/${details.socialInsuranceNo}/${details.injuryNo}/${details.caseId}/complication/info`
      ]);
    }
  }
  //Fetching contributor details
  getContributor() {
    this.contributorService.getContributor(this.registrationNo, this.socialInsuranceNo).subscribe(
      response => {
        this.contributor = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }
  /** Fetch allowance Details */
  fetchAllowanceDetail(allowanceId) {
    const pagination = new Pagination();
    pagination.sort.column = 'Days';
    pagination.sort.direction = 'ASC';
    pagination.page.pageNo = 0;
    pagination.page.size = this.totalPrevAllowanceCount;
    const filtersApplied = new AllowanceFilterParams();
    forkJoin([
      this.claimsService.filterAllowanceDetails(
        this.auditNo,
        allowanceId,
        filtersApplied,
        pagination,
        this.registrationNo,
        this.socialInsuranceNo
      ),
      this.claimsService.filterPrevAllowanc(
        this.auditNo,
        allowanceId,
        filtersApplied,
        pagination,
        this.registrationNo,
        this.socialInsuranceNo
      )
    ]).subscribe(
      ([res, prevRes]) => {
        this.allowanceDetail = res;
        this.allowanceDetail?.auditDetail?.forEach(items => {
          items.caseId = allowanceId;
        });
        this.previousAllowanceDetails = prevRes;
        this.previousAllowanceDetails?.auditDetail?.forEach(prevItems => {
          prevItems.caseId = allowanceId;
        });
      },
      err => {
        this.showError(err);
      }
    );
  }
  fetchAllowance(allowance: AllowanceSummary) {
    this.pagination.page.pageNo = 0;
    this.registrationNo = allowance.registrationNo;
    this.socialInsuranceNo = allowance.socialInsuranceNo;
    this.injuryId = allowance.caseId;
    this.getContributor();
    this.fetchAllowanceSummary(allowance.caseId);
    const filterParams = new AllowanceFilterParams();
    this.getPreviousAllowance(filterParams);
    this.fetchComments(
      allowance.caseId,
      allowance.socialInsuranceNo,
      allowance.registrationNo,
      this.transaction.transactionId
    );
    setTimeout(() => {
      this.fetchAllowanceDetail(allowance.caseId);
    }, 1000);
  }

  /*fetch all allowance details*/

  fetchAllAllowance(allowacelist) {
    this.allAllowanceDetail = [];
    this.allAllowanceDetails = [];
    if (allowacelist) {
      allowacelist?.forEach(element => {
        if (
          element.allowanceType.english !== 'Conveyance Allowance' &&
          element.allowanceType.english !== 'Dead Body Repatriation Expenses' &&
          element.allowanceType.english !== 'Companion Conveyance Allowance'
        ) {
          this.allAllowanceDetail.push(
            this.claimsService.fetchAllAllowanceDetails(
              element.caseId,
              this.auditNo,
              this.registrationNo,
              this.socialInsuranceNo,
              element.transactionId
            )
          );
        }
      });
    }
    if (this.allAllowanceDetail) {
      forkJoin(this.allAllowanceDetail).subscribe(response => {
        response.forEach(item => {
          this.allAllowanceDetails = this.allAllowanceDetails.concat(item['auditDetail']);
        });
      });
    } else {
      this.allAllowanceDetails = null;
    }
  }

  // Fetch allowance Summary

  fetchAllowanceSummary(caseId) {
    this.claimsService
      .fetchAllowanceSummary(caseId, this.auditNo, this.registrationNo, this.socialInsuranceNo)
      .subscribe(
        response => {
          this.auditSummary = response;
        },
        err => {
          this.showError(err);
        }
      );
    this.claimsService
      .fetchPreviousAllowanceSummary(caseId, this.auditNo, this.registrationNo, this.socialInsuranceNo)
      .subscribe(
        response => {
          this.previousAuditSummary = response;
        },
        err => {
          this.showError(err);
        }
      );
  }
}

