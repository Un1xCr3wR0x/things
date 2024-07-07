/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  Alert,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  LovList,
  MainEstablishmentInfo,
  Person,
  RoleIdEnum,
  RouterConstants,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTransEnum,
  EstablishmentWorkFlowStatus,
  FilterKeyValue,
  LegalEntityEnum,
  OrganisationTypeEnum,
  Owner,
  QueryParam,
  WorkFlowStatusType,
  checkOwnerBusinessRules,
  convertBilingualListToLovList,
  filterGccCsr,
  getAlerts,
  getDraftWorkflow,
  goToResumeTransaction,
  isLegalEntitySame,
  warningTemplate
} from '../../../shared';
import { ownersAfterFilter, searchWithOwnerNameOrIdentifier } from '../change-owner-sc/owner-helper';

@Component({
  selector: 'est-owners-sc',
  templateUrl: './owners-sc.component.html',
  styleUrls: ['./owners-sc.component.scss']
})
export class OwnersScComponent extends ChangeEstablishmentScBaseComponent implements OnInit, OnDestroy {
  person: Person;
  owners: Owner[];
  establishment: Establishment;
  goBackRoute;
  selectedRegistrationNo: number;
  itemsPerPage = 10;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  viewMode = true;
  filteredOwners: Owner[];
  nationalityList$: Observable<LovList>;
  searchText: string;
  ownerFilters: Array<FilterKeyValue>;
  workflows: EstablishmentWorkFlowStatus[];
  mainEst: MainEstablishmentInfo;
  selectedEstablishment: Establishment;
  editWarningMsg: Alert[];
  ownerAccessRoles: RoleIdEnum[];
  draftTransaction: EstablishmentWorkFlowStatus = undefined;
  @ViewChild('draftRequiredTemplate', { static: true }) draftRequiredTemplate: TemplateRef<HTMLElement>;
  modifyOwnerRestrict: boolean;
  ownerTransactionInDraftStatus: boolean;
  transactionTraceId: number;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly documentService: DocumentService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly location: Location
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
  }

  ngOnInit(): void {
    if (this.changeEstablishmentService.selectedRegistrationNo) {
      this.selectedRegistrationNo = this.changeEstablishmentService.selectedRegistrationNo;
      this.selectedEstablishment = this.changeEstablishmentService.selectedEstablishment;
      this.goBackRoute = EstablishmentConstants.EST_PROFILE_ROUTE(this.selectedRegistrationNo);
      this.initialiseView();
    } else {
      this.location.back();
    }
  }

  /**
   * Method to perform validations to initialise the component view
   */
  initialiseView() {
    this.ownerAccessRoles = filterGccCsr(
      [RoleIdEnum.GCC_CSR, RoleIdEnum.CSR, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.GCC_ADMIN],
      this.selectedEstablishment
    );
    if (this.selectedEstablishment?.organizationCategory?.english !== OrganisationTypeEnum.GCC) {
      this.ownerAccessRoles.push(RoleIdEnum.COLLECTION_OFFICER, RoleIdEnum.GOVERNMENT_COLLECTION_OFFICER);
    }
    this.getEstablishmentDetails(this.selectedRegistrationNo);
    const queryParams: QueryParam[] = [];
    queryParams.push({ queryKey: EstablishmentQueryKeysEnum.ESTABLISHMENT_OWNERS, queryValue: true });
    this.changeEstablishmentService
      .getOwners(this.selectedRegistrationNo, queryParams)
      .pipe(
        tap(res => {
          this.owners = this.filteredOwners = res;
          this.changeEstablishmentService.ownerCountIncludingEstablishmentAsOwner=this.filteredOwners.length;
          this.nationalityList$ = convertBilingualListToLovList(this.owners.map(owner => owner?.person?.nationality));
        })
      )
      .subscribe(noop, err => this.alertService.showError(err.error.message, err.error.details));
  }

  initiateNavigation(template: TemplateRef<HTMLElement>) {
    this.canEditOwner(
      template,
      this.workflows,
      this.selectedEstablishment.status.english === EstablishmentStatusEnum.REGISTERED,
      !isLegalEntitySame(this.establishment?.legalEntity?.english, this.mainEst?.legalEntity?.english),
      this.establishment.legalEntity?.english
    );
  }

  getEstablishmentDetails(registrationNo: number) {
    this.establishmentService
      .getEstablishment(registrationNo, { includeMainInfo: true })
      .pipe(
        tap(res => {
          this.establishment = res;
          this.modifyOwnerRestrict =
          ( this.appToken === ApplicationTypeEnum.PUBLIC &&
            this.establishment?.crn == null &&
            this.establishment?.unifiedNationalNumber &&
            this.establishment?.molEstablishmentIds?.molEstablishmentId)
              ? true
              : false;
          if (
            !(
              (this.estRouterData.taskId &&
                RouterConstants.TRANSACTIONS_UNDER_ESTABLISHMENT.indexOf(this.estRouterData.resourceType) !== -1) ||
              res.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS
            )
          ) {
            this.viewMode = false;
          }
          if (this.modifyOwnerRestrict) {
            this.ownerAccessRoles = [
              RoleIdEnum.NEW_ROLE_FOR_MCI_EDIT,
              RoleIdEnum.BRANCH_ADMIN,
              RoleIdEnum.SUPER_ADMIN,
              RoleIdEnum.GCC_ADMIN
            ];
          }
        }),
        map(res => {
          return res?.mainEstablishment;
        }),
        tap(mainEst => {
          this.mainEst = mainEst;
        }),
        switchMap(() =>
          this.establishmentService.getWorkflowsInProgress(this.selectedRegistrationNo, true).pipe(
            catchError(() => of([])),
            tap(res => {
              this.workflows = res;
            })
          )
        )
      )
      .subscribe(noop, err => {
        this.alertService.showError(err.error.message);
      });
  }

  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
  }

  navigateBack() {
    this.location.back();
  }

  searchForOwners(searchParam: string) {
    this.searchText = searchParam;
    this.filteredOwners = searchWithOwnerNameOrIdentifier(
      ownersAfterFilter(this.owners, this.ownerFilters),
      searchParam
    );
    this.currentPage = this.pageDetails.currentPage = 1;
  }

  filterOwners(filters: Array<FilterKeyValue>) {
    this.ownerFilters = [...filters];
    this.filteredOwners = searchWithOwnerNameOrIdentifier(ownersAfterFilter(this.owners, filters), this.searchText);
    this.currentPage = this.pageDetails.currentPage = 1;
  }

  clearAll() {
    this.ownerFilters = [];
    this.filteredOwners = searchWithOwnerNameOrIdentifier(this.owners, this.searchText);
    this.currentPage = this.pageDetails.currentPage = 1;
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.alertService.clearAlerts();
  }

  canEditOwner(
    template: TemplateRef<HTMLElement>,
    workflows: EstablishmentWorkFlowStatus[],
    isRegistered: boolean,
    isLegalEntityDifferent: boolean,
    legalEntity: string
  ) {
    const workflowWithoutDraft = workflows.filter(item => !item.isDraft);
    const workflowDraft = getDraftWorkflow(workflows, WorkFlowStatusType.OWNER);
    let alert = new Alert();
    const keys = checkOwnerBusinessRules(isRegistered, isLegalEntityDifferent);
    if (keys.length === 0) {
      const [alertKeys, alertMessages, paramMap] = workflowWithoutDraft?.reduce(
        (keyAndMessage, workflow) => {
          keyAndMessage = this.checkIntraDomainForOwner(workflow, keyAndMessage);
          keyAndMessage = this.checkInterDomainForOwner(workflow, keyAndMessage, legalEntity);
          return keyAndMessage;
        },
        [[] as string[], [] as BilingualText[], new Map<number, Object>()]
      );
      alert = getAlerts(alertKeys, alertMessages, paramMap);
    } else {
      alert = getAlerts(keys, []);
    }
    if (alert?.details?.length > 0 && !workflowDraft) {
      this.editWarningMsg = alert.details;
      this.showModal(template, 'lg', true);
    } else {
      if (workflowDraft) {
        this.draftTransaction = workflowDraft;
        this.transactionTraceId = workflowDraft?.referenceNo;
        this.showModal(this.draftRequiredTemplate);
      } else this.goToOwnerTransaction();
    }
  }

  checkInterDomainForOwner(
    workflow: EstablishmentWorkFlowStatus,
    keyAndMessage: [string[], BilingualText[], Map<number, Object>],
    legalEntity: string
  ) {
    if (workflow.type === WorkFlowStatusType.INSTALLMENT && legalEntity === LegalEntityEnum.INDIVIDUAL) {
      keyAndMessage[1].push(workflow.message);
    }
    return keyAndMessage;
  }

  checkIntraDomainForOwner(
    workflow: EstablishmentWorkFlowStatus,
    keyAndMessage: [string[], BilingualText[], Map<number, Object>]
  ) {
    if (workflow.type === WorkFlowStatusType.LEGALENTITY) {
      keyAndMessage[0].push(warningTemplate + '.LEGAL-ENTITY-WORKFLOW');
      keyAndMessage[2].set(keyAndMessage[0].length - 1, { referenceNo: workflow.referenceNo });
    } else if (workflow.type === WorkFlowStatusType.OWNER) {
      keyAndMessage[0].push(warningTemplate + '.OWNER-WORKFLOW');
      keyAndMessage[2].set(keyAndMessage[0].length - 1, { referenceNo: workflow.referenceNo });
    }
    return keyAndMessage;
  }

  navigateToTransaction() {
    goToResumeTransaction(this.router, this.draftTransaction.referenceNo, this.draftTransaction?.transactionId);
  }

  cancelAndStart() {
    this.changeEstablishmentService
      .revertTransaction(this.establishment.registrationNo, this.draftTransaction.referenceNo)
      .pipe(
        tap(() => {
          this.goToOwnerTransaction();
        }),
        catchError(err => {
          this.alertService.showError(err?.error?.code, err?.error?.details);
          return of(null);
        })
      )
      .subscribe();
  }

  goToOwnerTransaction() {
    this.router.navigate([EstablishmentRoutesEnum.CHANGE_OWNER]);
  }

  /** Method to clear the draft transaction. */
  clearDraft(transactionNumber) {
    this.alertService.clearAlerts();
    this.changeEstablishmentService.revertTransaction(this.establishment.registrationNo, transactionNumber).subscribe(
      () => {
        this.alertService.clearAlerts();
        this.hideModal();
        this.goToOwnerTransaction();
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }


/** To navigate the transaction to draft screen */
  navigateToDraftTransaction(transactionTraceId) {
    this.alertService.clearAlerts();
    this.hideModal();
    this.router.navigate([
      'home',
      'establishment',
      'transactions',
      'resume',
      EstablishmentTransEnum.OWNER_UPDATE_TRANSACTION,
      transactionTraceId
    ]);
  }
}
