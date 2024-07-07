/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  BilingualText,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentProfile,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  RoleIdEnum,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  TransactionInterface,
  TransactionMixin,
  TransactionService,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  activateWizard,
  BankAccount,
  BranchList,
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentNameEnum,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  ErrorCodeEnum,
  EstablishmentBranchWrapper,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  EstLookupService,
  getBranchRequest,
  getTerminateMainEstWizards,
  TerminatePaymentMethodEnum,
  TerminateResponse
} from '../../../shared';
import { TerminateEstablishmentService } from '../../../shared/services/terminate-establishment.service';
import {
  cancelTransaction,
  changeMainEstablishment,
  handleError,
  invokeCloseEstablishmentService,
  invokeSaveNewMainEstService,
  loadTerminateEligibilityStatus,
  performDocumentValidation
} from './terminate-establishment-helper';

@Component({
  selector: 'est-terminate-establishment-sc',
  templateUrl: './terminate-establishment-sc.component.html',
  styleUrls: ['./terminate-establishment-sc.component.scss']
})
export class TerminateEstablishmentScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit
{
  //Local Variables
  establishment: Establishment;
  terminateEstForm: FormGroup;
  currentTab: number;
  showCBM = false;
  terminateEstTabWizards: WizardItem[];
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  pageSize = 5;
  totalBranchCount: number;
  branchEstablishments: BranchList[];
  registrationNo: number;
  mianregistrationNo: number;
  registeredStatus = new BilingualText();
  mainEstablishmentRegNo: number;
  documents: DocumentItem[];
  CBMDocuments: DocumentItem[];
  commentsMaxLength: number;
  documentTransactionType = DocumentTransactionTypeEnum.TERMINATE_ESTABLISHMENT;
  documentTransactionKey = DocumentTransactionTypeEnum.TERMINATE_ESTABLISHMENT;
  transactionId = DocumentTransactionIdEnum.TERMINATE_ESTABLISHMENT;
  terminateEligibilityStatus: TerminateResponse;
  isValidator = false;
  routeToView: string;
  terminateReferenceNo: number;
  CBMReferenceNo: number;
  isGcc = false;
  isPrivate: boolean;
  showBank = true;
  canReturn: boolean;
  bankNameList: LovList = new LovList([]);
  includeBankDocument: boolean;
  apiCallInprogress = false;
  bankAccount: BankAccount;
  selectedMainEstablishment: BranchList;
  main = EstablishmentTypeEnum.MAIN;
  branch = EstablishmentTypeEnum.BRANCH;
  newMainEstRegistrationNo: number;
  terminateContributorActionList: LovList;
  branchEstablsihmentLovList: Lov[];
  leaveReasonLovList: LovList;
  showTransferContributor: boolean;
  selectedBranchToTransfer: number;
  searchParam: string;
  isLoading = false;
  isResultEmpty: boolean;
  isMain: boolean;
  isBankPayment: boolean;
  eligibleToTransfer = true;
  gccBankNameList$: Observable<LovList>;
  showSaveButton:boolean=true;
  payload;
  isUnclaimed:boolean;
  taskId:string;
  isGOL: boolean = false;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  isIbanMapped = true;

  constructor(
    readonly bsModalService: BsModalService,
    readonly fb: FormBuilder,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly workflowService: WorkflowService,
    readonly terminateEstablishmentService: TerminateEstablishmentService,
    readonly changeGrpEstablishmentService: ChangeGroupEstablishmentService,
    readonly location: Location,
    readonly terminateService: TerminateEstablishmentService,
    readonly storageService: StorageService,
    readonly router: Router,
    readonly lookupService: EstLookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly lookUpService: LookupService,
    readonly transactionService:TransactionService
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.terminateEstForm = this.createTerminateEstForm();
  }

  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    if (
      (this.estRouterData.resourceType === RouterConstants.TRANSACTION_TERMINATE_ESTABLISHMENT ||
        this.estRouterData.resourceType === RouterConstants.TRANSACTION_GOL_TERMINATE_ESTABLISHMENT) &&
      this.estRouterData.taskId !== null
    ) {
      this.isValidator = true;
      this.routeToView = EstablishmentRoutesEnum.VALIDATOR_TERMINATE;
      this.registrationNo = this.estRouterData.registrationNo;
      this.eligibleToTransfer = this.establishmentService.isUserEligible(
        [RoleIdEnum.CSR, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER],
        this.registrationNo
      );
      this.terminateReferenceNo = this.estRouterData.referenceNo;
      this.getEstablishmentWithWorkflowData(this.estRouterData, this.intialiseView, this.navigateToValidator, false);
    } else if (this.terminateEstablishmentService.selectedEstablishment) {
      this.establishment = this.terminateEstablishmentService.selectedEstablishment;
      this.eligibleToTransfer = this.establishmentService.isUserEligible(
        [RoleIdEnum.CSR, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER],
        this.establishment.registrationNo
      );
      this.bankAccount = null;
      loadTerminateEligibilityStatus(this);
      this.intialiseView();
      this.routeToView = EstablishmentConstants.EST_PROFILE_ROUTE(this.registrationNo);
    } else {
      this.setTransactionComplete();
      this.location.back();
    }
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isGOL = true;
    }
    this.setRouterData();
  }
      // Method to get router data for claim pool
      setRouterData(){
        if (this.routerDataToken.payload) {
          this.payload = JSON.parse(this.routerDataToken.payload);
          this.taskId = this.routerDataToken.taskId;
          this.isUnclaimed = this.payload?.isPool;
          this.showSaveButton=this.isValidator 
                    ? this.isUnclaimed ? false : true
                    : true ;
        }
      }
      assignClicked(){
        this.showSaveButton=true;
      }
      releaseClicked(){
        this.showSaveButton=false;
      }
  /**
   * Create form
   */
  createTerminateEstForm() {
    return this.fb.group({
      comments: null,
      referenceNo: undefined
    });
  }

  /**
   * method to intilaise the view
   */
  @Autobind
  intialiseView() {
    if (this.isValidator) {
      this.establishment = this.establishmentToChange;
      this.bankAccount = this.establishment?.establishmentAccount?.bankAccount;
      loadTerminateEligibilityStatus(this);
      this.terminateEstForm.get('referenceNo').setValue(+this.estRouterData.referenceNo);
      this.registrationNo = this.establishment.registrationNo;
      this.isMain = this.establishment.registrationNo === this.establishment.mainEstablishmentRegNo;
      this.getBranchEstablishments(this.registrationNo, this.pageSize, 0, [], false, this.setBranch, false);
    } else {
      this.registeredStatus.english = EstablishmentStatusEnum.REGISTERED;
      this.registrationNo = this.establishment.registrationNo;
      this.isMain = this.establishment.registrationNo === this.establishment.mainEstablishmentRegNo;
      this.getBranchEstablishments(
        this.registrationNo,
        this.pageSize,
        0,
        [this.registeredStatus],
        false,
        this.setBranch,
        false
      );
    }
    this.gccBankNameList$ = this.lookUpService.getGCCBankList(
      EstablishmentConstants.GCC_BANK(this.establishment),
      true
    );
  }

  /**
   * Method to navigate to validator screen
   */
  @Autobind
  navigateToValidator() {
    this.setTransactionComplete();
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_TERMINATE]);
  }

  @Autobind
  setBranch(branches: EstablishmentBranchWrapper, profileDetails: EstablishmentProfile) {
    this.branchEstablishments = branches.branchList;
    this.totalBranchCount = branches.branchStatus?.totalBranches;
    this.newMainEstRegistrationNo = this.mainEstablishmentRegNo = profileDetails.mainEstablishmentRegNo;
    if (branches.branchStatus?.activeEstablishments > 1 && this.mainEstablishmentRegNo === this.registrationNo) {
      this.showCBM = !this.isValidator;
    }
    this.isGcc = profileDetails.gccEstablishment === true;
    if (this.isGcc) {
      this.showBank = true;
    }
    this.initialiseTabWizards(0);
  }

  /**
   * Method to initialise current tab
   * @param currentTab
   */
  initialiseTabWizards(currentTab: number) {
    this.currentTab = currentTab;
    this.terminateEstTabWizards = getTerminateMainEstWizards(currentTab, this.showCBM);
  }

  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number, restrictNextWizards: boolean = false) {
    this.currentTab = tabIndex;
    this.terminateEstTabWizards = activateWizard(this.terminateEstTabWizards, tabIndex, restrictNextWizards);
  }

  /**
   *Method to submit the close establishment transaction
   * @param isFinalSubmit
   */
  submitCloseEstablishment() {
    if (!this.apiCallInprogress) {
      this.apiCallInprogress = true;
      this.alertService.clearAlerts();
      if (this.documentService.checkMandatoryDocuments(this.documents)) {
        if (this.showCBM) {
          this.CBMDocuments = this.documents.filter(
            doc =>
              doc.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT ||
              doc.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA ||
              doc.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER ||
              doc.name.english === DocumentNameEnum.OTHERS_DOCUMENT
          );
          invokeSaveNewMainEstService(this, true);
        } else {
          invokeCloseEstablishmentService(this);
        }
      } else {
        this.apiCallInprogress = false;
        this.alertService.showMandatoryDocumentsError();
      }
    }
  }

  /**
   *Method to save the bank details
   */
  saveBankAndContributorDetails() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.terminateEstForm);
    if (
      (this.terminateEstForm?.get('bankDetails')?.valid || !this.showBank) &&
      (!this.showTransferContributor || this.terminateEstForm?.get('contributorDetails')?.valid)
    ) {
      this.isBankPayment =
        this.terminateEstForm?.get('bankDetails')?.get('paymentMethod')?.get('english').value ===
        TerminatePaymentMethodEnum.BANK;

      this.includeBankDocument = this.showBank && this.isBankPayment;
      if (this.terminateReferenceNo) {
        if (!this.showCBM) performDocumentValidation(this, () => this.selectedWizard(1));
        else this.selectedWizard(1);
      } else {
        //To initiate transaction in the DB
        this.terminateService
          .terminateEstablishment(this.registrationNo, null, [
            {
              queryKey: EstablishmentQueryKeysEnum.MODE,
              queryValue: EstablishmentQueryKeysEnum.TERMINATE_INITIATE_MODE
            }
          ])
          .subscribe(
            res => {
              this.terminateReferenceNo = res.transactionId;
              if (!this.showCBM) performDocumentValidation(this, () => this.selectedWizard(1));
              else this.selectedWizard(1);
            },
            err => handleError(this, err)
          );
      }
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  saveNewMainEstablishmentDetails(isFinalSubmit: boolean) {
    this.alertService.clearAlerts();
    if (!this.newMainEstRegistrationNo) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.ERR-SELECT-MAIN');
    } else if (this.newMainEstRegistrationNo === this.mainEstablishmentRegNo) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.ERR_CHANGE_MAIN');
    } else {
      if (this.isPrivate) {
        invokeSaveNewMainEstService(this, isFinalSubmit);
      } else {
        performDocumentValidation(this, () => this.selectedWizard(2));
      }
    }
  }

  /**
   * method to fetch the data based on page selection
   */
  selectedPage(pageIndex: number, searchParam: string) {
    this.searchParam = searchParam;
    this.isLoading = true;
    this.isResultEmpty = false;
    this.branchEstablishments = [];
    this.establishmentService
      .getBranchEstablishmentsWithStatus(
        this.registrationNo,
        getBranchRequest(this.pageSize, pageIndex - 1, [this.registeredStatus], true, searchParam)
      )
      .subscribe(
        branchRes => {
          this.isLoading = false;
          this.branchEstablishments = branchRes.branchList;
          this.totalBranchCount = branchRes.branchStatus?.totalBranches;
          this.pageDetails.currentPage = this.currentPage = pageIndex;
          if (this.selectedMainEstablishment) changeMainEstablishment(this, this.selectedMainEstablishment); //To highlight the curennt new main after seacrh and pagiantion
        },
        err => {
          this.isLoading = false;
          this.apiCallInprogress = false;
          if (err.error.code === ErrorCodeEnum.BRANCH_NO_RECORD) this.isResultEmpty = true;
          else handleError(this, err);
        }
      );
  }

  /**
   * Method to save the selected establishment
   * @param establishment
   * @param newMainEstIndex
   */
  onSelectEstablishment(establishment: BranchList) {
    if (
      this.selectedMainEstablishment?.registrationNo !== establishment.registrationNo &&
      establishment.status.english === EstablishmentStatusEnum.REGISTERED
    ) {
      changeMainEstablishment(this, establishment);
    }
  }

  /**
   * maethod to navigate to bill dashborad
   */
  naviagteBillDashboard() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      const url = '#' + EstablishmentConstants.COLLECTION_DASHBOARD_ROUTE(this.registrationNo);
      window.open(url, '_blank');
    } else {
      this.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, this.registrationNo);
      const url = '#' + EstablishmentRoutesEnum.BILL_DASHBOARD_ROUTE;
      window.open(url, '_blank');
    }
  }
  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    cancelTransaction(this);
  }

  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param iBanCode
   */
  getBankName(iBanCode: string) {
    this.isIbanMapped = true;
    this.lookupService
      .getBankForIban(iBanCode)
      .pipe(
        switchMap(res => {
          if (res?.items?.length > 0) {
            return of(res);
          } else {
            this.isIbanMapped = false;
            return this.lookupService.getSaudiBankList(true);
          }
        }),
        tap(res => {
          this.bankNameList = res;
        })
      )
      .subscribe(noop, err => handleError(this, err));
  }

  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
