/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AlertTypeEnum,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  BilingualText,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentProfile,
  EstablishmentRouterData,
  EstablishmentToken,
  IbanLength,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  TransactionService,
  UuidGeneratorService,
  WorkflowService,
  bindToForm,
  iBanValidator,
  lengthValidator,
  markFormGroupTouched
} from '@gosi-ui/core';
import {
  AccountStatusEnum,
  MatchStatusEnum,
  ResponseStatusEnum
} from '@gosi-ui/features/establishment/lib/shared/enums/sama-response-enum';
import {
  EstablishmentIbanValidationRequest,
  EstablishmentIbanValidationResponse
} from '@gosi-ui/features/establishment/lib/shared/models/establishment-iban-validation';
import { AlertDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  NavigationIndicatorEnum,
  getDocumentContentIds,
  isDocumentsValid,
  isEstablishmentTokenValid,
  isGccEstablishment
} from '../../../shared';
import { changeBankDocuments, performInitialDocumentValidations } from './change-bank-helper';

@Component({
  selector: 'est-change-bank-details-sc',
  templateUrl: './change-bank-details-sc.component.html',
  styleUrls: ['./change-bank-details-sc.component.scss']
})
export class ChangeBankDetailsScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit
{
  //Constants
  engNameMaxLength = 60;
  arabicNameMaxLength = 80;
  commentsMaxLength = 100;
  routeToView: string;
  documentTransactionType = DocumentTransactionTypeEnum.CHANGE_BANK_DETAILS;
  documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_BANK_DETAILS;
  documentTransactionId = DocumentTransactionIdEnum.CHANGE_BANK_DETAILS;
  //local variables
  editBankDetailsForm: FormGroup;
  bankDetailsDocuments: DocumentItem[];
  registrationNo: number;
  referenceNo: number;
  establishmentToChange: Establishment = new Establishment();
  establishmentName: BilingualText = new BilingualText();
  minDate: Date;
  maxDate = new Date();
  transactionFeedback: TransactionFeedback;
  isValidator = false;
  establishmentProfile: EstablishmentProfile = new EstablishmentProfile();
  gccRegNoMaxLength = EstablishmentConstants.GCC_REG_NO_MAX_LENGTH;
  bankNameList: LovList = new LovList([]);
  bankNameList$: Observable<LovList> = of(new LovList([]));
  private _minMaxLengthAccountNo: number = IbanLength.SAUDI_IBAN;
  private _gccIbanLength: number = IbanLength.GCC_IBAN_MAX;
  private _gccIbanMinLength: number = IbanLength.GCC_IBAN_MIN;
  uuid: string;
  hideDocuments: boolean;
  isGOL:boolean=false;
  showSaveButton:boolean=true;
  payload;
  taskId:string;

  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  isIbanMapped = true;
  verifyMessage: BilingualText;
  verifyType: AlertTypeEnum;
  isVerified = false;
  isActive = false;
  accountStatus: string;
  isEligibleForIbanValidation = false;
  samaResponse: EstablishmentIbanValidationResponse = undefined;
  showAccountStatus = false;
  @ViewChild('verifyAlert') verifyAlert: AlertDcComponent;

  get minMaxLengthAccountNo(): number {
    return this.isGcc ? this._gccIbanLength : this._minMaxLengthAccountNo;
  }

  constructor(
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly bsModalService: BsModalService,
    private fb: FormBuilder,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    readonly router: Router,
    readonly uuidService: UuidGeneratorService,
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
  }
  //Method to initialise the component
  ngOnInit() {
    this.hideDocuments = this.appToken === ApplicationTypeEnum.PUBLIC;
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isGOL = true;
    }
    if (isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_CHANGE_EST_BANK_DETAILS)) {
      this.isValidator = true;
      this.routeToView = this.isGOL ? EstablishmentRoutesEnum.ADMIN_TRANSACTION_BACK_ROUTING : EstablishmentRoutesEnum.VALIDATOR_IDENTIFIERS;
      this.referenceNo = this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null;
      this.getEstablishmentWithWorkflowData(
        this.estRouterData,
        this.intialiseView,
        this.navigateToValidator,
        true,
        false,
        true
      );
    } else if (this.changeEstablishmentService.selectedEstablishment) {
      this.establishmentBeforeChange = this.changeEstablishmentService.selectedEstablishment;
      this.establishmentToChange = this.changeEstablishmentService.selectedEstablishment;
      this.routeToView = EstablishmentConstants.EST_PROFILE_ROUTE(this.establishmentToChange.registrationNo);
      if (!this.isValidator) {
        this.uuid = this.uuidService.getUuid();
      }
      if (
        this.appToken === ApplicationTypeEnum.PUBLIC &&
        !this.establishmentToChange.gccCountry &&
        this.establishmentToChange.unifiedNationalNumber
      ) {
        this.isEligibleForIbanValidation = true;
      }
      this.intialiseView();
    } else {
      this.location.back();
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
   * Method to bootstrap the view
   */
  @Autobind
  intialiseView() {
    this.establishmentName.english = this.establishmentToChange.name.english
      ? this.establishmentToChange.name.english
      : this.establishmentToChange.name.arabic;
    this.editBankDetailsForm = this.createEditBankDetailsForm();
    this.registrationNo = this.establishmentToChange.registrationNo;
    this.isGcc = isGccEstablishment(this.establishmentToChange);
    if (this.isGcc) {
      this.bankNameList$ = this.lookupService.getGCCBankList(
        EstablishmentConstants.GCC_BANK(this.establishmentToChange),
        true
      );
    }
    if (this.establishmentToChange.establishmentAccount) {
      bindToForm(this.editBankDetailsForm, this.establishmentToChange.establishmentAccount.bankAccount);
    }

    this.editBankDetailsForm
      .get('ibanAccountNo')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        startWith(this.editBankDetailsForm.get('ibanAccountNo').value),
        pairwise()
      )
      .subscribe(([oldValue, newvalue]) => {
        if (oldValue !== newvalue) {
          if (this.editBankDetailsForm.get('ibanAccountNo').value) {
            let validators = [lengthValidator(this.minMaxLengthAccountNo), iBanValidator];
            if (this.isGcc) {
              validators = [lengthValidator(this._gccIbanMinLength, this.minMaxLengthAccountNo)];
            }
            this.editBankDetailsForm.get('ibanAccountNo').setValidators(validators);
            this.editBankDetailsForm.get('ibanAccountNo').updateValueAndValidity();
            this.editBankDetailsForm.get('bankName').get('english').setValidators([Validators.required]);
            this.editBankDetailsForm.get('bankName').get('english').updateValueAndValidity();
            this.editBankDetailsForm.get('bankName').get('arabic').setValidators([Validators.required]);
            this.editBankDetailsForm.get('bankName').get('arabic').updateValueAndValidity();
          } else {
            this.editBankDetailsForm.get('ibanAccountNo').setValidators(null);
            this.editBankDetailsForm.get('ibanAccountNo').updateValueAndValidity();
            this.editBankDetailsForm.get('bankName').get('english').setValue(null);
            this.editBankDetailsForm.get('bankName').get('english').setValidators(null);
            this.editBankDetailsForm.get('bankName').get('english').updateValueAndValidity();
            this.editBankDetailsForm.get('bankName').get('arabic').setValidators(null);
            this.editBankDetailsForm.get('bankName').get('arabic').updateValueAndValidity();
          }
          this.getBank(false);
          this.isActive = false;
          this.isVerified = false;
          this.showAccountStatus = false;
          this.alertService.clearAlerts();
          this.verifyAlert.triggerDismissEvent();
        }
      });
    this.getDocuments();
  }
  /**
   * Method to create the bank details form
   */
  createEditBankDetailsForm() {
    return this.fb.group({
      ibanAccountNo: [
        '',
        {
          updateOn: 'blur'
        }
      ],
      bankName: this.fb.group({
        english: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        arabic: [
          null,
          {
            updateOn: 'blur'
          }
        ]
      }),
      navigationIndicator: NavigationIndicatorEnum.CSR_CHANGE_BANK_DETAILS_SUBMIT,
      comments: ''
    });
  }
  /**
   * Method to update bank details
   */
  updateBankDetails() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.editBankDetailsForm);
    const isDocumentsSubmitted = this.hideDocuments ? true : isDocumentsValid(this.bankDetailsDocuments);
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      if (this.isEligibleForIbanValidation) {
        this.editBankDetailsForm
          .get('navigationIndicator')
          .setValue(NavigationIndicatorEnum.ESTADMIN_ADD_BANK_DETAILS_DIRECT_CHANGE);
      } else if (this.isValidator) {
        this.editBankDetailsForm.get('navigationIndicator').setValue(NavigationIndicatorEnum.ESTADMIN_REENTER_BANK);
      } else {
        this.editBankDetailsForm
          .get('navigationIndicator')
          .setValue(NavigationIndicatorEnum.ESTADMIN_CHANGE_ACCOUNT_DETAILS_SUBMIT);
      }
    } else if (this.isValidator) {
      this.editBankDetailsForm
        .get('navigationIndicator')
        .setValue(NavigationIndicatorEnum.VALIDATOR_CHANGE_BANK_DETAILS_SUBMIT);
    }
    if (this.editBankDetailsForm.valid && isDocumentsSubmitted) {
      const updatedBankDetails = {
        bankAccount: {
          ibanAccountNo: this.editBankDetailsForm.get('ibanAccountNo').value,
          bankName: this.editBankDetailsForm.get('bankName').value
        },
        comments: this.hideDocuments ? '' : this.editBankDetailsForm.get('comments').value,
        navigationIndicator: this.editBankDetailsForm.get('navigationIndicator').value,
        contentIds: this.hideDocuments ? [] : getDocumentContentIds(this.bankDetailsDocuments),
        referenceNo: this.referenceNo,
        startDate: this.establishmentToChange.establishmentAccount
          ? this.establishmentToChange.establishmentAccount.startDate
          : null,
        paymentType: this.establishmentToChange.establishmentAccount
          ? this.establishmentToChange.establishmentAccount.paymentType
          : null,
        uuid: this.uuid,
        accountStatus: null,
        matchStatus: null,
        creditStatus: null
      };
      if (this.isEligibleForIbanValidation) {
        updatedBankDetails.accountStatus = this.samaResponse.accountStatus;
        updatedBankDetails.matchStatus = this.samaResponse.matchStatus;
        updatedBankDetails.creditStatus = this.samaResponse.creditStatus;
      }
      this.changeEstablishmentService.changeBankDetails(this.registrationNo, updatedBankDetails).subscribe(
        res => {
          this.transactionFeedback = new TransactionFeedback();
          this.transactionFeedback = res;
          if (this.isValidator) {
            this.updateBpmTransaction(this.estRouterData, this.editBankDetailsForm.get('comments').value).subscribe(
              () => {
                this.setTransactionComplete();
                this.clearRouteData();
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                this.alertService.showSuccess(this.transactionFeedback.successMessage);
              }
            );
          } else {
            this.setTransactionComplete();
            this.alertService.showSuccess(this.transactionFeedback.successMessage);
            this.location.back();
          }
        },
        err => this.alertService.showError(err.error.message)
      );
    } else if (!this.editBankDetailsForm.valid) {
      this.alertService.showMandatoryErrorMessage();
    } else {
      if (this.appToken === ApplicationTypeEnum.PRIVATE) {
        this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
      } else {
        this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
      }
    }
  }
  /**
   * Method to get all documents
   */
  getDocuments() {
    this.documentService
      .getDocuments(
        this.documentTransactionKey,
        this.documentTransactionType,
        this.registrationNo,
        this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null,
        undefined,
        this.estRouterData.referenceNo ? null : this.uuid
      )
      .subscribe(res => {
        performInitialDocumentValidations(this, res);
        if (this.editBankDetailsForm.get('ibanAccountNo').value) {
          this.getBank(true);
        }
      });
  }
  /**
   * Method to get the document content
   * @param document
   */
  bindDocContent(document: DocumentItem) {
    this.documentService
      .refreshDocument(
        document,
        this.registrationNo,
        this.documentTransactionType,
        this.documentTransactionType,
        this.referenceNo,
        undefined,
        this.referenceNo ? undefined : this.uuid
      )
      .subscribe(res => (document = res));
  }

  /**
   * Method to see if the bank name is getting changed
   */
  bankChange() {
    if (
      this.editBankDetailsForm.get('bankName')?.get('english')?.value !==
      this.establishmentToChange.establishmentAccount?.bankAccount?.bankName?.english
    ) {
      changeBankDocuments(this, true);
    } else {
      changeBankDocuments(this, false);
    }
  }
  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param iBanCode
   *
   */
  getBank(initialLoad = false) {
    if (this.isGcc) {
      if (
        this.editBankDetailsForm.get('ibanAccountNo').value &&
        this.editBankDetailsForm.get('ibanAccountNo').valid &&
        (this.editBankDetailsForm.get('ibanAccountNo').value !==
          this.establishmentBeforeChange.establishmentAccount?.bankAccount?.ibanAccountNo ||
          this.editBankDetailsForm.get('bankName')?.get('english')?.value !==
            this.establishmentBeforeChange.establishmentAccount?.bankAccount?.bankName?.english)
      ) {
        changeBankDocuments(this, true);
      } else {
        changeBankDocuments(this, false);
      }
      return;
    }
    if (this.editBankDetailsForm.get('ibanAccountNo').value && this.editBankDetailsForm.get('ibanAccountNo').valid) {
      changeBankDocuments(this, true);
      const iBanCode = String(this.editBankDetailsForm.get('ibanAccountNo').value).slice(4, 6);
      this.isIbanMapped = true;
      this.lookupService
        .getBankForIban(iBanCode)
        .pipe(
          switchMap(res => {
            if (res?.items?.length > 0) {
              return of(res);
            } else {
              this.isIbanMapped = false;
              return this.lookupService.getSaudiBankList();
            }
          }),
          tap(res => {
            this.bankNameList = res;
          })
        )
        .subscribe(
          () => {
            setTimeout(() => {
              this.editBankDetailsForm.patchValue({
                bankName: { english: null, arabic: null }
              });
              if (this.bankNameList && this.isIbanMapped) {
                this.editBankDetailsForm.patchValue({
                  bankName: this.bankNameList.items[0].value
                });
              }
              if (this.isIbanMapped === false && initialLoad) {
                if (this.establishmentToChange.establishmentAccount?.bankAccount?.bankName?.english) {
                  this.editBankDetailsForm.patchValue({
                    bankName: this.establishmentToChange.establishmentAccount?.bankAccount?.bankName
                  });
                }
              }
            }, 300);
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    } else {
      changeBankDocuments(this, false);
      this.bankNameList = new LovList([]);
      this.editBankDetailsForm.get('bankName').get('english').setValue(null);
      this.editBankDetailsForm.get('bankName').get('arabic').setValue(null);
    }
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /**
   * method to cancel the modal
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelBankDetailsTransaction();
  }
  /**
   * method to cancel the bank details transaction
   */
  cancelBankDetailsTransaction() {
    if (this.isValidator) {
      this.changeEstablishmentService
        .revertTransaction(this.establishmentToChange.registrationNo, this.estRouterData.referenceNo)
        .subscribe(
          () => {
            this.setTransactionComplete();
            if (this.reRoute) {
              this.router.navigate([this.reRoute]);
            } else {
              if (this.appToken === ApplicationTypeEnum.PUBLIC) {
                this.router.navigate([EstablishmentRoutesEnum.ADMIN_TRANSACTION_BACK_ROUTING]);
              } else {
                this.changeEstablishmentService.navigateToBankDetailsValidator();
              }
            }
          },
          err => this.alertService.showError(err?.error?.message)
        );
    } else {
      this.setTransactionComplete();
      this.reRoute ? this.router.navigate([this.reRoute]) : this.navigateToView();
    }
  }
  /**
   * Method to navigate to profile
   */
  navigateToView() {
    this.location.back();
  }
  /**
   * Method to navigate to validator screen
   */
  @Autobind
  navigateToValidator() {
    this.changeEstablishmentService.navigateToBankDetailsValidator();
  }
  /**
   * Clear router data
   */
  clearRouteData() {
    if (this.isValidator) {
      this.estRouterData.resetRouterData();
    }
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }

  verifyIban() {
    const request = new EstablishmentIbanValidationRequest();
    request.iban = this.editBankDetailsForm.get('ibanAccountNo').value;
    request.unn = this.establishmentToChange.unifiedNationalNumber;
    request.name = this.establishmentToChange.name.arabic;
    this.establishmentService.verifyEstablishmentIban(this.registrationNo, request).subscribe(res => {
      this.samaResponse = res;
      if (res.responseStatus === ResponseStatusEnum.SUCCESS) {
        this.verifyType = AlertTypeEnum.SUCCESS;
        this.isVerified = true;
        if (res.accountStatus === AccountStatusEnum.ACCOUNT_ACTIVE && res.matchStatus === MatchStatusEnum.MATCHED) {
          this.isActive = true;
        } else if (res.matchStatus === MatchStatusEnum.UNMATCHED) {
          this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.IBAN-NOT-MATCHED');
        } else if (res.accountStatus === AccountStatusEnum.ACCOUNT_INCORRECT) {
          this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.INCORRECT-IBAN');
        } else {
          this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.IBAN-NOT-ACTIVE');
        }
      } else if (res.responseStatus === ResponseStatusEnum.REQUEST_UNDER_PROCESSING) {
        this.verifyType = AlertTypeEnum.DANGER;
        this.verifyMessage = res.ibanValidationResult;
      }
      this.accountStatus = 'ESTABLISHMENT.BANK-ACCOUNT-STATUS.' + res.accountStatus;
      this.showAccountStatus = !(res.accountStatus === AccountStatusEnum.NONE);
    });
  }
}
