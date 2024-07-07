/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  CoreAdjustmentService,
  DocumentService,
  AlertService,
  BPMUpdateRequest,
  WorkFlowActions,
  RouterData,
  RouterDataToken,
  LovList,
  BankAccount,
  LookupService,
  WizardItem,
  markFormGroupTouched,
  scrollToTop,
  DocumentItem,
  CoreBenefitService,
  RouterConstants
} from '@gosi-ui/core';
import {
  Adjustment,
  AdjustmentConstants,
  AdjustmentMapModel,
  AdjustmentModificationList,
  AdjustmentPaymentMethodEnum,
  BeneficiaryList,
  CountinuesDeductionTypeEnum,
  CreateTpaRequest,
  DeductionTypeEnum,
  IbanStatusEnum,
  MonthlyDeductionEligibility,
  PayeeDetails,
  PayeeQueryParams,
  PaymentRoutesEnum,
  PaymentService,
  RequestType,
  RequestTypeDomain,
  SaveAdjustmentResponse,
  selectWizard,
  ThirdpartyAdjustmentService
} from '../../shared';
import { Router } from '@angular/router';
import { Directive, Inject, ViewChild } from '@angular/core';
import { noop, Observable, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { getAdjsutemntPercentage, getIbanDetails } from './third-party-adjustment-add-modify-helper';

@Directive()
export abstract class ThirdPartyAdjustmentBaseScComponent {
  taskId: string;
  user: string;
  role: string;
  thirdPartyWizardItem: WizardItem[] = [];
  currentTab = 0;
  itemsPerPage = AdjustmentConstants.ADJUSTMENT_PAGE_SIZE;
  isValidator = false;
  adjustmentMap: Map<number, AdjustmentMapModel>;
  @ViewChild('thirdPartyWizard', { static: false }) thirdPartyWizard: ProgressWizardDcComponent;
  paymentModeList$: Observable<LovList>;
  continousDeduction$: Observable<LovList>;
  percentageList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  requestByList$: Observable<LovList>;
  reasonForStopping$: Observable<LovList>;
  reasonForHolding$: Observable<LovList>;
  reasonForReactivating$: Observable<LovList>;
  //uuid: string;
  modalRef: BsModalRef;
  adjustmentModificationId: number;
  adjustmentReasonKey: string;
  adjustmentReasonList: LovList;
  referenceNumber: number;
  documents: DocumentItem[];
  identifier: number;
  benefitDetails: BeneficiaryList;
  monthlyDeductionEligibility: MonthlyDeductionEligibility;
  isCreate: boolean;
  sin: number;
  constructor(
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly paymentService: PaymentService,
    readonly lookupService: LookupService,
    readonly tpaService: ThirdpartyAdjustmentService,
    readonly modalService: BsModalService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService
  ) {}

  saveWorkFlowInEdit(comment: string) {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.comments = comment || '';
    this.paymentService.handleAnnuityWorkflowActions(workflowData).subscribe(response => {
      if (response) {
        this.alertService.showSuccessByKey('PAYMENT.TRANSACTION-SUBMIT-MESSAGE');
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      }
    });
  }

  /**
   * method to initilize the view
   */
  initView(isModify = false) {
    const payloads = this.routerData?.payload ? JSON.parse(this.routerData.payload) : null;
    this.adjustmentModificationId = payloads?.adjustmentModificationId
      ? Number(payloads.adjustmentModificationId)
      : null;
    this.referenceNumber = payloads?.referenceNo ? Number(payloads.referenceNo) : null;
    this.identifier = payloads?.PersonId ? Number(payloads.PersonId) : null;
    if (this.referenceNumber && this.adjustmentModificationId && this.identifier) {
      this.initialiseRouterValues(this.routerData);
      this.isValidator = true;
    } else if (this.coreAdjustmentService.identifier) {
      this.identifier = this.coreAdjustmentService.identifier;
      this.sin = this.coreAdjustmentService?.sin;
    } else {
      this.navigateBack();
    }
    this.getLookUpValues(isModify);
    this.getBenefitDetails();
    this.getThirdPartyAdjustmentValidatorDetails();
  }

  /**
   * method to set theroter data
   */
  initialiseRouterValues(routerData: RouterData) {
    if (routerData.payload) {
      const payload = JSON.parse(routerData.payload);
      this.taskId = this.routerData.taskId;
      this.user = this.routerData.assigneeId;
      this.role = payload.assignedRole;
      this.sin = payload?.socialInsuranceNo;
    }
  }

  /** Method to get lookup values. */
  getLookUpValues(isModify = false): void {
    this.paymentModeList$ = this.lookupService.getTransferModeDetails();
    this.continousDeduction$ = this.lookupService.getYesOrNoList();
    this.requestByList$ = this.lookupService.getRequestedBy();
    this.percentageList$ = this.lookupService.getAdjustmentPercentageList();
    this.cityList$ = this.lookupService.getCityList();
    if (isModify) {
      this.reasonForStopping$ = this.lookupService.getReasonForStopping();
      this.reasonForReactivating$ = this.lookupService.getReasonForReactivating();
      this.reasonForHolding$ = this.lookupService.getReasonForHolding();
    }
  }

  /**
   * method to change the selected tab
   * @param tabIndex
   */
  changeWizard(tabIndex: number) {
    this.currentTab = tabIndex;
    this.thirdPartyWizardItem = selectWizard(this.thirdPartyWizardItem, tabIndex);
  }

  //This method is to navigate to previous tab
  previousForm() {
    this.currentTab--;
    this.thirdPartyWizard.setPreviousItem(this.currentTab);
  }

  // This method is used to fetch payee details based on search parameter
  findPayee(searchQuery: string, pageNo: number, mapIndex = 0) {
    if (this.validateForm(this.adjustmentMap.get(mapIndex)?.form?.get('addTpaForm') as FormGroup, true, mapIndex)) {
      const page = pageNo ? pageNo : this.adjustmentMap.get(mapIndex)?.addData?.payeeListPageDetails.currentPage;
      const payeeQueryParams = new PayeeQueryParams();
      payeeQueryParams.searchQuery = searchQuery || this.adjustmentMap.get(mapIndex)?.addData?.payeeSearchQuery;
      payeeQueryParams.pageNo = page - 1;
      payeeQueryParams.pageSize = this.itemsPerPage;
      this.tpaService.getPayeeDetails(payeeQueryParams).subscribe(
        res => {
          const addData = this.adjustmentMap.get(mapIndex)?.addData;
          addData.payeeSearchResult = res.thirdParties || [];
          addData.totalPayeesCount = res.count;
          addData.showPayeesList = true;
          addData.payeeSearchQuery = searchQuery || addData.payeeSearchQuery;
          addData.payeeListPageDetails.currentPage = page;
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    }
  }

  /**
   *Method to validate the form
   * @param form
   * @param isPayeeSearch
   */
  validateForm(form: FormGroup, isPayeeSearch = false, mapIndex = 0): boolean {
    if (form) {
      this.alertService.clearAlerts();
      markFormGroupTouched(form);
      if (
        form.valid &&
        (((this.adjustmentMap.get(mapIndex)?.addData?.selectedpayee || isPayeeSearch) &&
          this.adjustmentMap.get(mapIndex)?.isAdd) ||
          !this.adjustmentMap.get(mapIndex)?.isAdd)
      ) {
        return true;
      } else {
        scrollToTop();
        this.alertService.showMandatoryErrorMessage();
        return false;
      }
    }
  }
  /**
   * method to navigate to previus page
   */
  navigateBack() {
    if (this.isValidator) {
      if (this.isCreate) {
        this.router.navigate([PaymentRoutesEnum.VALIDATOR_VIEW_ADD_TPA]);
      } else {
        this.router.navigate([PaymentRoutesEnum.VALIDATOR_VIEW_MANAGE_TPA]);
      }
    } else {
      this.router.navigate([PaymentRoutesEnum.ADJUSTMENT_DETAIL]);
    }
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err?.error?.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err?.error?.message);
    }
  }
  /**
   * method to handle the select event of payee
   * @param payee
   */
  onSelectPayee(payee: PayeeDetails, isCsrSelect: boolean, mapIndex = 0, isfromSAvedData = false) {
    const addData = this.adjustmentMap.get(mapIndex)?.addData;
    addData.selectedpayee = payee;
    addData.csrSelectedpayee = isCsrSelect ? { ...payee } : null;
    const iBanCode = payee?.iban ? String(payee?.iban).slice(4, 6) : null;
    if (iBanCode && !isfromSAvedData) {
      this.lookupService.getBank(iBanCode).subscribe(bankDetails => {
        if (
          bankDetails?.items?.length > 0 ||
          (this.isValidator && addData.selectedpayee.payeeId === addData.csrAdjustmentValues?.payeeId)
        ) {
          const bank = new BankAccount();
          bank.ibanAccountNo = payee?.iban;
          bank.verificationStatus = payee?.ibanStatus.toString();
          bank.bankName = bankDetails?.items[0]?.value;
          addData.payeeCurrentBank = bank;
          addData.payeebankName = bankDetails?.items[0]?.value;
        } else {
          addData.payeeCurrentBank = null;
          addData.payeebankName = null;
        }
      });
    } else if (isfromSAvedData) {
      addData.payeeCurrentBank = { ...addData?.savedBankData };
      addData.payeebankName = addData?.savedBankData?.bankName;
    } else {
      addData.payeeCurrentBank = null;
      addData.payeebankName = null;
    }
    addData.showPayeeSummary = true;
    addData.showPayeesList = false;
  }
  /**
   * methos to handle the edit of selected payee
   */
  onChangePayee(mapIndex = 0) {
    const addData = this.adjustmentMap.get(mapIndex)?.addData;
    addData.selectedpayee = null;
    addData.payeeCurrentBank = null;
    addData.payeeSearchResult = [];
    addData.showPayeeSummary = false;
    addData.showPayeesList = false;
  }

  /**method to get bank name
   *
   * @param ibanNo
   */
  getBankName(ibanNo: string, mapIndex = 0) {
    const addData = this.adjustmentMap.get(mapIndex)?.addData;
    const iBanCode = ibanNo ? String(ibanNo).slice(4, 6) : null;
    if (iBanCode) {
      this.lookupService.getBank(iBanCode).subscribe(
        bankDetails => {
          if (bankDetails?.items?.length > 0) {
            addData.newBankName = bankDetails?.items[0]?.value;
          } else {
            addData.newBankName = null;
          }
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    }
  }

  /** Method to refresh documents after upload. */
  refreshTpaDocuments(doc: DocumentItem, transactionName: string, transactionType: string, isAdd: boolean): void {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          isAdd ? this.adjustmentModificationId : doc?.businessKey,
          transactionName,
          transactionType,
          this.referenceNumber ? this.referenceNumber : null,
          null
        )
        .pipe(
          tap(res => (doc = res)),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  // Method to show modal
  showModal(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }

  /**
   * Method to cancel the transaction
   */
  cancelTpaPage() {
    this.modalRef?.hide();
    this.navigateBack();
  }
  cancelTpaAdjustment() {
    if (this.adjustmentModificationId && this.referenceNumber) {
      this.tpaService
        .revertTransaction(this.identifier, this.adjustmentModificationId, this.referenceNumber, this.sin)
        .subscribe(
          () => {
            this.navigateBack();
          },
          err => {
            this.showError(err);
            this.navigateBack();
          }
        );
    }
  }
  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }

  adjustmentReasonKeyValue(key) {
    this.adjustmentReasonList = null;
    if (key === RequestType.TPA_MINISTRY_OF_JUSTICE_REASON) {
      this.adjustmentReasonKey = RequestTypeDomain.TPA_MINISTRY_OF_JUSTICE_REASON_DOMAIN;
    } else if (key === RequestType.TPA_AGRICULTURE_DEVELOPMENT_REASON) {
      this.adjustmentReasonKey = RequestTypeDomain.TPA_AGRICULTURE_DEVELOPMENT_REASON_DOMAIN;
    } else if (key === RequestType.TPA_SOCIAL_DEVELOPMENT_REASON) {
      this.adjustmentReasonKey = RequestTypeDomain.TPA_SOCIAL_DEVELOPMENT_REASON_DOMAIN;
    } else if (key === RequestType.TPA_REAL_ESTATE_DEVELOPMENT_REASON) {
      this.adjustmentReasonKey = RequestTypeDomain.TPA_REAL_ESTATE_DEVELOPMENT_REASON_DOMAIN;
    } else if (key === RequestType.TPA_OTHER_REASON) {
      this.adjustmentReasonKey = RequestTypeDomain.TPA_OTHER_REASON_DOMAIN;
    }
    this.lookupService.getAdjustmentReasonTpa(this.adjustmentReasonKey).subscribe(res => {
      setTimeout(() => {
        this.adjustmentReasonList = res;
      }, 500);
    });
  }

  createAddTpaRequest(
    tpaForm: FormGroup,
    adjustmentModificationId: number,
    selectedpayee: PayeeDetails,
    payeeCurrentBank: BankAccount,
    isValidator: boolean,
    csrAdjustmentValues: Adjustment,
    csrSelectedpayee: PayeeDetails,
    mapIndex = 0
  ): AdjustmentModificationList {
    const formValues = tpaForm.getRawValue();
    const tpaRequest = new AdjustmentModificationList();
    tpaRequest.actionType = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.ADD;
    tpaRequest.adjustmentType = AdjustmentConstants.ADJUSTMENT_TYPE.DEBIT;
    tpaRequest.tpa = true;
    tpaRequest.adjustmentId = adjustmentModificationId || null;
    tpaRequest.benefitType = formValues.addTpaForm?.benefitType || csrAdjustmentValues?.benefitType;
    tpaRequest.payeeId = selectedpayee?.payeeId;
    tpaRequest.transferMode = formValues.paymentMethod?.transferMode || csrAdjustmentValues?.transferMode;
    [tpaRequest.ibanAccountNo, tpaRequest.ibanId] = getIbanDetails(
      payeeCurrentBank,
      isValidator,
      formValues,
      csrAdjustmentValues,
      selectedpayee,
      csrSelectedpayee,
      mapIndex,
      this.adjustmentMap
    );
    tpaRequest.adjustmentPercentage = getAdjsutemntPercentage(formValues, csrAdjustmentValues);
    tpaRequest.adjustmentReason =
      formValues?.continousDeductionForm?.adjustmentReason || csrAdjustmentValues?.adjustmentReason;
    tpaRequest.requestedBy = formValues?.continousDeductionForm?.requestedBy || csrAdjustmentValues?.requestedBy;
    tpaRequest.adjustmentAmount = formValues
      ? formValues?.continousDeductionForm?.continuousDeduction?.english === CountinuesDeductionTypeEnum.NO
        ? formValues?.continousDeductionForm?.adjustmentAmount
        : ''
      : csrAdjustmentValues?.adjustmentAmount;

    tpaRequest.continuousDeduction = formValues
      ? formValues?.continousDeductionForm?.continuousDeduction?.english === CountinuesDeductionTypeEnum.YES
      : csrAdjustmentValues?.continuousDeduction;
    tpaRequest.monthlyDeductionAmount =
      formValues && formValues.hasOwnProperty('continousDeductionForm')
        ? formValues?.continousDeductionForm?.deductionType !== DeductionTypeEnum.PERCENTAGE
          ? formValues?.continousDeductionForm?.monthlyDeductionAmount
          : null
        : csrAdjustmentValues?.monthlyDeductionAmount;
    tpaRequest.notes = formValues?.continousDeductionForm?.notes || csrAdjustmentValues?.notes;
    tpaRequest.city = formValues
      ? formValues?.continousDeductionForm?.requestedBy?.english !== RequestType.TPA_OTHER_REASON
        ? formValues?.continousDeductionForm?.city
        : null
      : csrAdjustmentValues?.city;
    tpaRequest.caseDate = formValues
      ? formValues?.continousDeductionForm?.requestedBy?.english === RequestType.TPA_MINISTRY_OF_JUSTICE_REASON
        ? formValues?.continousDeductionForm?.caseDate
        : null
      : csrAdjustmentValues?.caseDate;
    tpaRequest.caseNumber = formValues
      ? formValues?.continousDeductionForm?.requestedBy?.english === RequestType.TPA_MINISTRY_OF_JUSTICE_REASON
        ? formValues?.continousDeductionForm?.caseNumber
        : null
      : csrAdjustmentValues?.caseNumber;
    tpaRequest.holdAdjustment =
      formValues &&
      formValues.continousDeductionForm &&
      formValues.continousDeductionForm.hasOwnProperty('holdAdjustment')
        ? formValues?.continousDeductionForm?.holdAdjustment
        : csrAdjustmentValues?.holdAdjustment;
    return tpaRequest;
  }
  /**
   *method to get the benefit details
   */
  getBenefitDetails() {
    this.tpaService.getBeneficiaryDetails(this.identifier, this.sin).subscribe(
      res => {
        this.benefitDetails = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /**
   *method to get the benefit details
   */
  getThirdPartyAdjustmentValidatorDetails() {
    this.tpaService.getAdjustmentMonthlyDeductionEligibilty(this.identifier, this.sin).subscribe(
      res => {
        this.monthlyDeductionEligibility = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  getSaveMethod(
    identifier: number,
    adjustmentRequest: CreateTpaRequest,
    adjModificationId: number,
    isValidator: boolean,
    isModify: boolean
  ): Observable<SaveAdjustmentResponse> {
    if (isValidator || this.referenceNumber) {
      return this.tpaService.saveValidatorAdjustmentEdit(identifier, adjustmentRequest, adjModificationId, this.sin);
    } else {
      return this.tpaService.saveThirdPartyAdjustment(identifier, adjustmentRequest, isModify, this.sin);
    }
  }
}
