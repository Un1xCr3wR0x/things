/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AlertService,
  AppConstants,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService,
  BPMUpdateRequest,
  WorkFlowActions,
  DocumentService,
  ApplicationTypeToken,
  markFormGroupTouched,
  LanguageToken
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { AllowanceFilterParams, AuditorFilterParams, Contributor, ClarificationRequest, Route, DiseaseService, InjuryConstants, ComplicationConstants } from '../../../shared';
import { ContributorService, OhService, EstablishmentService, Pagination } from '../../../shared';
import { InjuryService, ComplicationService, ReceiveClarification } from '../../../shared';
import { AllowanceAuditSummary, AllowanceList, AllowanceSummary, AuditAllowance } from '../../../shared/models/';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { PlatformLocation, Location } from '@angular/common';
import { AllowanceBaseScComponent } from '../../base/allowance-sc.base-component';
import { DiseaseConstants } from '../../../shared/constants/disease-constants';
@Component({
  selector: 'oh-allowance-audit-sc',
  templateUrl: './allowance-audit-sc.component.html',
  styleUrls: ['./allowance-audit-sc.component.scss']
})
export class AllowanceAuditScComponent extends AllowanceBaseScComponent implements OnInit {
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  allAllowanceDetail = [];
  selectedAllowance = [];
  totalPrevAllowanceCount: number;
  previousAllowanceDetails: AuditAllowance;
  clarifications: ReceiveClarification[] = [];
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
    private cd: ChangeDetectorRef,
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
  auditNo: number;
  sortList: LovList;
  message = 'OCCUPATIONAL-HAZARD.PROHIBIT-ALLOWANCE';
  auditDetails: AllowanceList = new AllowanceList();
  auditHeaderDetails: AllowanceList = new AllowanceList();
  auditallowanceDetails: AuditAllowance;
  showButton = true;
  rejectReasonList$: Observable<LovList>;
  auditSummary: AllowanceAuditSummary = new AllowanceAuditSummary();
  socialInsuranceNo: number;
  registrationNo: number;
  contributor: Contributor;
  diseaseIdMessage = '';
  modalRef: BsModalRef;
  previousAllowance: AuditAllowance;
  previousAuditSummary: AllowanceAuditSummary;
  comment: FormControl = new FormControl(null, { updateOn: 'blur' });
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  ohList$: Observable<LovList>;
  ohCategoryList$: Observable<LovList>;
  allowanceType$: Observable<LovList>;
  injuryId: number;
  isConveyance = false;
  currentPage = 0;
  caseId: number;
  pageSize = 10;
  pagination = new Pagination();
  selectedIds = [];
  ngOnInit() {
    if (this.routerData && this.routerData.taskId) {
      this.fetchValues();
    } else {
      this.alertService.clearAlerts();
      this.navigateToInbox();
    }
    this.pagination.page.pageNo = 0;
    this.pagination.page.size = 10;
    this.pagination.sort.column = 'Days';
    this.pagination.sort.direction = 'ASC';
    this.rejectReasonList$ = this.lookupService.getTreatmentServiceRejectionList();
    this.getOhCategoryLookupValues();
    this.getAllowanceTypeLookUpValues();
    this.reportAllowanceModal = this.createAllowanceModalForm();
    this.requestedDocumentList();
    this.sortList = this.lookupService.getSortByList();
    if (!this.caseId) {
      this.caseId = this.claimsService.getCaseId();
    }
  }
  navigateToInbox() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  fetchValues() {
    const payload = JSON.parse(this.routerData.payload);
    this.auditNo = payload.id;
    this.getAuditDetails();
  }
  fetchAllowance(allowance: AllowanceSummary) {
    this.pagination.page.pageNo = 0;
    this.regNo = allowance.registrationNo;
    this.sin = allowance.socialInsuranceNo;
    this.ohService.setRegistrationNo(this.regNo);
    this.ohService.setSocialInsuranceNo(this.sin);
    this.injuryId = allowance.caseId;
    this.getContributor();
    this.fetchAllowanceSummary(allowance.caseId);
    this.updateReadStatus(allowance.caseId, this.routerData.transactionId);
    this.updateAllowanceStatus();
    this.documents = this.documentFetchForAllowance(allowance.caseId, this.routerData.transactionId);
    const filterParams = new AllowanceFilterParams();
    this.getPreviousAllowanceDetails(filterParams);
    this.fetchComments(
      allowance.caseId,
      allowance.socialInsuranceNo,
      allowance.registrationNo,
      this.routerData.transactionId
    );
    setTimeout(() => {
      this.fetchAllowanceDetails(allowance.caseId);
    }, 1000);
  }
  fetchAllowanceSummary(caseId) {
    this.claimsService.fetchAllowanceSummary(caseId, this.auditNo, this.regNo, this.sin).subscribe(
      response => {
        this.auditSummary = response;
      },
      err => {
        this.showError(err);
      }
    );
    this.claimsService.fetchPreviousAllowanceSummary(caseId, this.auditNo, this.regNo, this.sin).subscribe(
      response => {
        this.previousAuditSummary = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  fetchAllAllowance(allowacelist) {
    this.allAllowanceDetails = [];
    this.allAllowanceDetail = [];

    if (allowacelist) {
      allowacelist?.forEach(element => {
        if (
          element.allowanceType.english !== 'Conveyance Allowance' &&
          element.allowanceType.english !== 'Companion Conveyance Allowance' &&
          element.allowanceType.english !== 'Dead Body Repatriation Expenses'
        ) {
          this.allAllowanceDetail.push(
            this.claimsService.fetchAllAllowanceDetails(
              element.caseId,
              this.auditNo,
              this.regNo,
              this.sin,
              element.transactionId
            )
          );
        }
      });
    }
    if (this.allAllowanceDetail) {
      forkJoin(this.allAllowanceDetail).subscribe(response => {
        response.forEach(element => {
          this.allAllowanceDetails = this.allAllowanceDetails.concat(element['auditDetail']);
        });
      });
    } else {
      this.allAllowanceDetails = null;
    }
  }
  rejectEvent(rejectedDetails) {
    this.claimsService
      .rejectAllowance(this.auditNo, rejectedDetails.caseId, rejectedDetails, this.regNo, this.sin)
      .subscribe(
        () => {
          this.fetchAllowanceDetails(rejectedDetails.caseId);
          this.router.navigate(['home/oh/validator/allowance-audit']);
          this.alertService.clearAllErrorAlerts();
          this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.RECOVER-OH.REJECTION-MESSAGE');
          if (this.modalRef) {
            this.modalRef.hide();
          }
        },
        error => {
          this.alertService.clearAllSuccessAlerts();
          this.showError(error);
        }
      );
  }
  fetchAllowanceDetails(caseId) {
    const filters = new AllowanceFilterParams();
    const pagination = new Pagination();
    pagination.sort.column = 'Days';
    pagination.sort.direction = 'ASC';
    pagination.page.pageNo = 0;
    pagination.page.size = this.totalPrevAllowanceCount ? this.totalPrevAllowanceCount : 0;
    forkJoin([
      this.claimsService.filterAllowanceDetails(this.auditNo, caseId, filters, pagination, this.regNo, this.sin),
      this.claimsService.filterPrevAllowanc(this.auditNo, caseId, filters, pagination, this.regNo, this.sin)
    ]).subscribe(
      ([res, prevRes]) => {
        this.auditallowanceDetails = res;
        this.auditallowanceDetails?.auditDetail?.forEach(item => {
          item.caseId = caseId;
        });
        this.previousAllowanceDetails = prevRes;
        this.previousAllowanceDetails?.auditDetail?.forEach(prevItem => {
          prevItem.caseId = caseId;
        });
      },
      err => {
        this.showError(err);
      }
    );
  }
  navigateTo(details: AllowanceSummary) {
    this.claimsService.setCaseId(details.caseId);
    this.ohService.setRegistrationNo(this.regNo);
    this.ohService.setSocialInsuranceNo(this.sin);
    this.ohService.setRoute(Route.AUDITOR_ALLOWANCE);
    if (details.ohType === InjuryConstants.INJURY) {
      this.router.navigate([
        `home/oh/view/${details.registrationNo}/${details.socialInsuranceNo}/${details.caseId}/injury/info`
      ]);
    } else if (details.ohType === DiseaseConstants.DISEASE) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.diseaseIdMessage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (details.ohType === ComplicationConstants.COMPLICATION) {
      this.router.navigate([
        `home/oh/view/${details.registrationNo}/${details.socialInsuranceNo}/${details.injuryNo}/${details.caseId}/complication/info`
      ]);
    }
  }
  showModal(templateRef: TemplateRef<HTMLElement>, size, selectedAllowance?) {
    this.selectedIds = [];
    this.resetModalAllowance();
    this.selectedAllowance = selectedAllowance;
    if (selectedAllowance) {
      selectedAllowance.forEach(service => {
        this.selectedIds.push(service.transactionId);
      });
    }
    this.commentAlert = false;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }
  markAsCompleted() {
    this.approveWorkflow();
  }
  clear() {
    this.modalRef.hide();
  }
  clarificationRequest(auditDetails) {
    auditDetails.auditCases.forEach((element, index) => {
      this.fetchClarification(
        element.caseId,
        element.socialInsuranceNo,
        element.registrationNo,
        this.routerData.transactionId,
        index
      );
    });
  }
  getAuditDetails() {
    this.claimsService.getAuditDetails(this.auditNo).subscribe(
      response => {
        this.auditDetails = response;
        this.clarificationRequest(this.auditDetails);
        this.auditHeaderDetails = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  applyFilter(filterValues: AuditorFilterParams) {
    this.claimsService.filterAuditDetails(this.auditNo, filterValues).subscribe(
      response => {
        this.auditDetails = response;
        this.clarificationRequest(this.auditDetails);
      },
      err => {
        this.showError(err);
      }
    );
  }
  getOhCategoryLookupValues() {
    this.ohList$ = this.lookupService.getOhCategoryTypeList();
    this.ohList$.subscribe(res => {
      if (res) {
        this.ohCategoryList$ = this.ohList$;
      }
    });
  }
  getAllowanceTypeLookUpValues() {
    const allowanceTypeList$ = this.lookupService.getTransactionStatusList('AuditAllowanceType');
    allowanceTypeList$.subscribe(res => {
      if (res) {
        this.allowanceType$ = allowanceTypeList$;
      }
    });
  }

  applyAllowanceFilter(filters: AllowanceFilterParams) {
    if (filters && !filters?.claimType?.includes('Conveyance Allowance')) {
      filters.visitsMax = null;
      filters.visitsMax = null;
    }
    this.claimsService.setFilterValues(filters);
    this.claimsService
      .filterAllowanceDetails(this.auditNo, this.injuryId, filters, null, this.regNo, this.sin)
      .subscribe(
        response => {
          this.auditallowanceDetails = response;
          this.auditallowanceDetails.auditDetail = this.auditallowanceDetails?.auditDetail?.reduce((acc, val) => {
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
    this.getPreviousAllowanceDetails(filters);
  }
  requestTpa() {
    const workflowData = new ClarificationRequest();
    let id;
    if (this.injuryId) {
      id = this.injuryId;
    } else {
      id = this.complicationId;
    }
    workflowData.auditNo = this.auditNo;
    workflowData.claimNos = this.selectedIds;
    workflowData.comments = this.reportAllowanceModal.get('comments').value;
    workflowData.referenceNo = this.routerData.transactionId;
    workflowData.documents = this.tpaRequestedDocs;
    if (this.reportAllowanceModal && this.reportAllowanceModal?.valid) {
      this.ohService.validatorSubmit(workflowData, id).subscribe(
        () => {
          this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-CLARIFICATION');
          this.updateReadStatus(this.injuryId, this.routerData.transactionId);
          this.updateAllowanceStatus();
          this.fetchComments(this.injuryId, this.sin, this.regNo, this.routerData.transactionId);
          this.getAuditDetails();
          this.hideModal();
        },
        err => {
          this.showError(err);
          this.hideModal();
        }
      );
    } else {
      this.commentsEstAdmin = this.reportAllowanceModal.get('comments').value;
      if (this.commentsEstAdmin === null) {
        this.alertService.clearAlerts();
        this.commentAlert = true;
        markFormGroupTouched(this.reportAllowanceModal);
      }
    }
  }
  resetModalAllowance() {
    this.reportAllowanceModal.reset();
    this.resetModal();
  }
  approveWorkflow() {
    const approveworkflowData = new BPMUpdateRequest();
    approveworkflowData.taskId = this.routerData.taskId;
    approveworkflowData.outcome = WorkFlowActions.APPROVE;
    approveworkflowData.comments = this.comment.value;
    approveworkflowData.user = this.routerData.assigneeId;
    this.workflowService.updateTaskWorkflow(approveworkflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-APPROVED');
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
        this.modalRef.hide();
      },
      error => {
        this.modalRef.hide();
        this.showError(error);
      }
    );
  }
  sortAllowances(sortEvent) {
    let filters = new AllowanceFilterParams();
    filters = null;
    this.pagination.page.pageNo = 0;
    this.currentPage = 0;
    this.pagination.sort = sortEvent;
    this.claimsService
      .filterAllowanceDetails(this.auditNo, this.injuryId, filters, this.pagination, this.regNo, this.sin)
      .subscribe(
        response => {
          this.auditallowanceDetails = response;
          this.auditallowanceDetails.auditDetail = this.auditallowanceDetails?.auditDetail?.reduce((acc, val) => {
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
    this.getPreviousAllowanceDetails(filters);
  }
  loadMore(loadmoreObj) {
    const filterParams = new AllowanceFilterParams();
    this.pagination.page.pageNo = loadmoreObj.currentPage;
    this.pagination.page.size = this.pageSize;
    this.getPreviousAllowanceDetails(filterParams);
  }
  getPreviousAllowanceDetails(filters) {
    this.claimsService
      .filterPrevAllowanc(this.auditNo, this.injuryId, filters, this.pagination, this.regNo, this.sin)
      .subscribe(
        response => {
          this.totalPrevAllowanceCount = response.totalCount;
          if (this.pagination.page.pageNo === 0) {
            this.previousAllowance = response;
          } else {
            response?.auditDetail?.forEach(item => {
              this.previousAllowance?.auditDetail.push(item);
            });
          }
          this.previousAllowance?.auditDetail?.forEach(prevItem => {
            prevItem.caseId = this.injuryId;
          });
        },
        err => {
          this.showError(err);
        }
      );
  }
  fetchClarification(ohId, sin, regNo, transactionId, index) {
    this.claimsService.getComments(ohId, sin, regNo, transactionId).subscribe(
      res => {
        this.auditDetails.auditCases[index].receiveClarification = [];
        this.clarifications = res;
        if (this.clarifications?.filter(items => items.clarificationReceived === false).length > 0) {
          this.showButton = false;
        }
        this.auditDetails.auditCases[index].receiveClarification = this.clarifications;
      },
      err => {
        this.showError(err);
      }
    );
  }
  updateAllowanceStatus() {
    this.claimsService.updateAllowanceStatus(this.auditNo, this.injuryId).subscribe();
  }
}

