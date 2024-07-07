/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BankAccount,
  BaseComponent,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  scrollToTop,
  downloadFile
} from '@gosi-ui/core';
import { BreadCrumbConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ContributorRouteConstants, ContributorConstants, ManageWageConstants } from '../../../shared/constants';
import { ContractStatus, DocumentTransactionId, DocumentTransactionType, TransactionId } from '../../../shared/enums';
import {
  Clauses,
  ContractDetails,
  ContractParams,
  Contributor,
  EngagementDetails,
  Establishment,
  EngagementPeriod,
  ClausesWrapper
} from '../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';

@Component({
  selector: 'cnt-contract-preview-sc',
  templateUrl: './contract-preview-sc.component.html',
  styleUrls: ['./contract-preview-sc.component.scss']
})
export class ContractPreviewScComponent extends BaseComponent implements OnInit, OnDestroy {
  /** Local variables. */
  registrationNo: number;
  socialInsuranceNo: number;
  personId: number;

  engagementId: number;
  contractId: number;
  establishment: Establishment;
  contributor: Contributor;
  bankDetails: BankAccount;
  activeEngagement: EngagementDetails;
  contract: ContractDetails;
  clauses: Clauses[];
  secondresponse: ClausesWrapper;
  individualApp = false;
  //firstResp:ContractDetails;
  selectedLang: string;
  modalRef: BsModalRef;
  isAppPrivate: boolean;
  documents: DocumentItem[] = [];
  cancelContractTransactionId: number;
  transportationAllowance: number;
  isCancelContract: boolean;
  unifiedProfileFlag: boolean;
  isContract: boolean;
  @ViewChild('brdcmb', { static: false })
  cntBillingBrdcmb: BreadcrumbDcComponent;
  /** Creates an instance of ContractPreviewScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly contractService: ContractAuthenticationService,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly manageWageService: ManageWageService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location
  ) {
    super();
  }

  /** Method to intialize the component. */
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;

    this.language.subscribe(language => (this.selectedLang = language));
    if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.identifyTransaction();
      this.getParamsFromService();
      this.initializeView();
    }
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.contractId = params.id;
          this.engagementId = params.engId;
          this.registrationNo = params.regNumber;
          this.socialInsuranceNo = params.nin;
          this.isContract = params.isContract;
        }
      });
      this.individualApp = true;
      this.identifyTransaction();
      this.initializeIndividualView();
      this.individualContractDetails();
      this.getIndContractClauses();
    }
    this.alertService.clearAlerts();
  }
  ngAfterViewInit() {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.CONTRACT_PRV_BREADCRUMB_VALUES;
    }
  }
  /** Method to identify transaction. */
  identifyTransaction() {
    this.route.url.subscribe(res => {
      if (res.length > 0) if (res[0]?.path === 'cancel-contract') this.isCancelContract = true;
    });
  }

  /** Method to get params from service. */
  getParamsFromService() {
    this.socialInsuranceNo = this.manageWageService.socialInsuranceNo;
    this.registrationNo = this.manageWageService.registrationNo;
    this.engagementId = this.manageWageService.engagementId;
    this.contractId = this.contractService.contractId;
  }

  /** Method to initialize the view. */
  initializeView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId && this.contractId) {
      forkJoin([this.getEstablishmentDetails(), this.getContributorDetails()])
        .pipe(switchMap(() => this.getContractDetails()))
        .subscribe(
          () => this.initializeForCancelContract(),
          err => {
            if (err.error) this.showErrorMessage(err);
          }
        );
    }
  }
  /** Method to initialize the view. */
  initializeIndividualView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId && this.contractId) {
      forkJoin([this.getIndEngagementDetails(), this.getIndividualContributorDetails()]).subscribe(
        () => this.initializeForCancelContract(),
        err => {
          if (err.error) this.showErrorMessage(err);
        }
      );
    }
  }
  /** Method to get individual engagement details. */
  getIndEngagementDetails() {
    return this.contributorService.getEngagementDetails(this.socialInsuranceNo, this.engagementId).pipe(
      tap(res => {
        this.establishment = bindToObject(new Establishment(), res);
        this.establishment.name = res?.establishmentName;
      })
    );
    // return this.contributorService.getEngagementDetails(this.socialInsuranceNo, this.engagementId).pipe(
    //   tap(resp => {
    //     this.establishment.registrationNo = resp?.registrationNo;
    //     this.establishment.name = resp?.establishmentName;
    //     this.establishment.molEstablishmentIds.molOfficeId = resp?.molEstablishmentIds?.molOfficeId;
    //     this.establishment.molEstablishmentIds.molunId = resp?.molEstablishmentIds?.molunId;
    //     this.establishment = bindToObject(new Establishment(), resp);
    //   })
    // );
  }
  /** Method to get establishment details. */
  getEstablishmentDetails() {
    return this.establishmentService
      .getEstablishmentDetails(this.registrationNo)
      .pipe(tap(res => (this.establishment = bindToObject(new Establishment(), res))));
  }

  /** Method to get contributor details. */
  getContributorDetails() {
    return this.contributorService.getContributor(this.registrationNo, this.socialInsuranceNo).pipe(
      tap(data => {
        this.contributor = data;
        this.personId = data.person.personId;
      })
    );
  }
  /** Method to get contributor details. */
  getIndividualContributorDetails() {
    return this.contributorService.getIndividualContDetails(this.socialInsuranceNo).pipe(
      tap(data => {
        this.contributor = data;
        this.personId = data.person.personId;
      })
    );
  }
  /** Method to get contract details. */
  getContractDetails() {
    return this.contractService
      .getContracts(this.registrationNo, this.socialInsuranceNo, new ContractParams(null, null, this.contractId))
      .pipe(
        tap(res => this.assembleRequiredDetails(res.contracts[0])),
        switchMap(() => this.getContractClauses())
      );
  }

  /** Method to assemble required details. */
  assembleRequiredDetails(details: ContractDetails) {
    if (details) {
      this.contract = details;
      if (details.bankAccount) this.bankDetails = details.bankAccount;
      this.activeEngagement = bindToObject(new EngagementDetails(), {
        engagementPeriod: [
          bindToObject(new EngagementPeriod(), {
            contributorAbroad: details?.workDetails?.workDomain === 'inside Saudi' ? false : true,
            wage: details.wage
          })
        ],
        workType: details.workType
      });
    }
  }
  /** Method to get contract clauses. */
  getContractClauses() {
    return this.contractService
      .getListOfClauses(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId)
      .pipe(
        tap(res => {
          this.clauses = res.contractClause;
          if (res?.transportationAllowance) {
            this.transportationAllowance = Number(res?.transportationAllowance);
          } else this.transportationAllowance = 0;
        })
      );
  }

  /** Method to initiaize for cancel contract. */
  initializeForCancelContract() {
    if (this.contract?.status === ContractStatus.CONTRIBUTOR_PENDING) {
      this.cancelContractTransactionId = TransactionId.CANCEL_CONTRACT;
      this.getRequiredDocumentList();
    }
  }

  /** Method to get required document list. */
  getRequiredDocumentList() {
    this.documentService
      .getRequiredDocuments(DocumentTransactionId.CANCEL_CONTRACT, DocumentTransactionType.CANCEL_CONTRACT)
      .subscribe(res => (this.documents = this.documentService.removeDuplicateDocs(res)));
  }

  /** Method to refresh documents after scan. */
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.contractId,
          DocumentTransactionId.CANCEL_CONTRACT,
          DocumentTransactionType.CANCEL_CONTRACT
        )
        .subscribe(res => (doc = res));
    }
  }

  /** Method to navigate to previous screen */
  navigateBack() {
    this.alertService.clearAllErrorAlerts();
    this.location.back();
  }

  /** Method to navigate to profile details */
  navigateToPersonalProfile() {
    this.router.navigate([
      ContributorRouteConstants.ROUTE_CONTRIBUTOR_PROFILE(
        this.registrationNo,
        this.socialInsuranceNo,
        this.unifiedProfileFlag
      )
    ]);
  }

  /** Method to show error messages coming from api. */
  showErrorMessage(err) {
    this.alertService.showError(err.error.message, err.error.details);
  }

  /** This method is to show the modal reference. */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }

  /** Method to submit cancel contract */
  submitCancelContract() {
    if (this.documentService.checkMandatoryDocuments(this.documents) && this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.confirmCancelContract();
    } else {
      this.showMandatoryDocumentsError();
    }
  }

  /** Method to set mandatory documents validation. */
  showMandatoryDocumentsError() {
    scrollToTop();
    this.alertService.showMandatoryDocumentsError();
  }

  /** Method to cancel contract which is pending with contributor. */
  confirmCancelContract() {
    this.alertService.clearAllErrorAlerts();
    this.contractService
      .cancelPendingContract(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId)
      .subscribe(
        res => {
          this.hideModal();
          this.navigateBack();
          const cancelSuccessMessage = res.message;
          this.alertService.showSuccess(cancelSuccessMessage, null, 5);
        },
        err => {
          this.showErrorMessage(err);
          this.hideModal();
        }
      );
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  /** Method invokked when component is destroyed. */
  ngOnDestroy() {
    this.contractService.contractId = undefined;
  }
  /** this method print the preview page in view contract */
  printPreview() {
    this.contractService
      .printPreview(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId)
      .subscribe(data => {
        downloadFile(ContributorConstants.PRINT_CONTRACT_FILE_NAME, 'application/pdf', data);
      });
  }
  downloadCertificates() {
    this.contributorService
      .downloadContracts(this.socialInsuranceNo, this.engagementId, this.contractId, this.registrationNo)
      .subscribe(data => {
        downloadFile(ContributorConstants.PRINT_CONTRACT_FILE_NAME, 'application/pdf', data);
      });
  }
  individualContractDetails() {
    return this.contributorService
      .getPreviewContractDetails(this.socialInsuranceNo, this.registrationNo, this.contractId)
      .subscribe(res => {
        this.assembleRequiredDetails(res.contracts[0]);
      });
  }
  getIndContractClauses() {
    return this.contributorService
      .fetchContratClause(this.socialInsuranceNo, this.engagementId, this.contractId, this.registrationNo)
      .subscribe(res => {
        this.clauses = res.contractClause;
        if (res?.transportationAllowance) {
          this.transportationAllowance = Number(res?.transportationAllowance);
        } else this.transportationAllowance = 0;
      });
  }
  /** Method to save CSV file. */
  saveCSVFile(data: string): void {
    const universalBOM = '\ufeff'; //Byte Order Mask to force UTF-8 when csv opened in excel
    const blob = new Blob([data ? universalBOM + data : ManageWageConstants.BULK_WAGE_CSV_FILE_HEADER], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', ManageWageConstants.WAGE_UPDATE_FILE_NAME);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
}
