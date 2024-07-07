/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  PersonBankDetails,
  BenefitDetails,
  UiApply,
  PatchPersonBankDetails,
  Benefits,
  AdjustmentDetailsDto,
  UnemploymentResponseDto,
} from '../../shared/models';
// tslint:disable-next-line:nx-enforce-module-boundaries
import {
  Person,
  Lov,
  scrollToModalError,
  DocumentItem,
  WizardItem,
  BPMUpdateRequest,
  GosiCalendar,
  WorkFlowActions,
  startOfDay,
  BilingualText,
  RouterConstants,
  SamaVerificationStatus,
  TransactionStatus,
  Channel
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { PersonConstants, BenefitConstants } from '../../shared/constants';
import {
  UITransactionType,
  ProcessType,
  UIPayloadKeyEnum,
  BenefitType,
  WorkFlowType,
  createRequestBenefitForm,
  getIBanHidden,
  clearAlerts,
  showErrorMessage,
  getServiceType,
  deepCopy,
  BenefitValues,
  AnnuityResponseDto,
  PersonalInformation,
  getRequestDateFromForm,
  showModal, PensionReformEligibility
} from '../../shared';
import * as moment from 'moment';
import { SubmitSanedHelperComponent } from './submit-saned-benefit-helper';

@Component({
  selector: 'bnt-submit-benefits-ui-sc',
  templateUrl: './submit-saned-benefit-sc.component.html',
  styleUrls: ['./submit-saned-benefit-sc.component.scss']
})
export class SubmitSanedBenefitScComponent
  extends SubmitSanedHelperComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  bankDetails: PersonBankDetails = new PersonBankDetails();
  bankNameList: Lov;
  otpErrorMessageKey: string;
  person: Person;

  //Documents
  documentList$: Observable<DocumentItem[]>;
  documentList: DocumentItem[];

  //ModalRef
  bankParentForm: FormGroup = new FormGroup({});
  benefitRequestId: number;
  commonModalRef: BsModalRef;
  isIdentity = false;
  // isTransactionSuccess = false;
  lang = 'en';
  months: number;
  availedMonths: Number;
  declarationDone = false;
  applyRequestWizardItems: WizardItem[] = [];
  payeeForm: FormGroup;

  modalRef: BsModalRef;
  receiptNumber: number;
  requestId: number;
  sanedDocTransactionId: string;
  uiItemList: DocumentItem[] = [];
  isValidator: boolean;
  isSmallScreen: boolean;
  //ViewChild components
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('confirmTransactionTemplate', { static: true })
  confirmTransactionTemplate: TemplateRef<HTMLElement>;
  @ViewChild('inEligibleReason', { static: true })
  inEligibleReason: TemplateRef<HTMLElement>;
  benefitsForm: FormGroup;
  maxDate: Date;
  benefitCalculation: BenefitDetails;
  uibenefits: Benefits;
  adjustmentDetails: AdjustmentDetailsDto;
  bankName: BilingualText;
  personDetails: PersonalInformation;
  annuityResponse = new AnnuityResponseDto();
  savedPayeType: BilingualText;
  savedPayMethod: BilingualText;
  ibanBankAccountNo;

  /**
   * This method handles initialization tasks.
   * @memberof SubmitSanedBenefitScComponent
   */
  ngOnInit() {
    super.ngOnInit();
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.eligibleForPensionReform = params.epr === 'true';
      }
    });
    this.currentTab = 0;
    this.maxDate = moment(new Date()).toDate();
    this.sanedDocTransactionId = BenefitConstants.TRANSACTIONID_SANED;
    this.benefitsForm = createRequestBenefitForm(this.isAppPrivate, this.fb);
    this.initializeForm();
    this.initVariables();
    this.initialiseAppeal();
    this.setWizardValues();
    this.getScreenSize();
    const url = this.router.url;
    this.processType = url.substr(url.lastIndexOf('/') + 1);
    if (this.processType === ProcessType.APPLY) {
      this.isReopenCase = false;
      this.benefitType = BenefitType.ui;
    } else if (this.processType === ProcessType.REOPEN) {
      this.isReopenCase = true;
    }
    if (this.coreBenefitService.isReopenCase) this.isReopenCase = this.coreBenefitService.isReopenCase;
    if (this.isIndividualApp) {
      this.getUIBenefits(this.socialInsuranceNo);
      this.getCalculationDetails();
    }
    this.workflowType = WorkFlowType.REQUEST_UNEMPLOYMENT;
    this.benefitPropertyService.setBenType(BenefitType.ui);
    this.setValuesForValidator();
    this.requestedDocumentList(UITransactionType.REQUEST_SANED, this.transactionType);
    if (this.isValidator || this.draftRequest) {
      this.getBenefitRequestDetails();
      this.getCurrentSystemRunDate();
      this.getDocuments(UITransactionType.REQUEST_SANED, this.transactionType, this.benefitRequestId);
    } else {
      if (Number(this.getPersonId())) {
        this.getBankDetails();
      } else {
        this.manageBenefitService.getPersonIdentifier(this.socialInsuranceNo).subscribe(res => {
          if (res?.listOfPersons[0]?.personId) {
            this.getBankDetails(res?.listOfPersons[0]?.personId);
            this.personId = res?.listOfPersons[0]?.personId;
          }
        });
      }
    }
    if (this.isReopenCase) {
      if (this.systemRunDate && this.systemRunDate.gregorian) {
        this.onConfirm(this.systemRunDate);
      } else {
        this.manageBenefitService.getSystemRunDate().subscribe(res => {
          this.maxDate = res.gregorian;
          this.systemRunDate = res;
          this.onConfirm(this.systemRunDate);
        });
      }
    }
  }

  ngAfterViewInit() {
    if (this.routerData && this.routerData.selectWizard) {
      this.nextForm(this.submitRequestTabs, this.submitRequestWizard, this.routerData.selectWizard);
    }
  }

  getCurrentSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.maxDate = res.gregorian;
      this.systemRunDate = res;
    });
  }

  setValuesForValidator() {
    if (this.routerData) {
      this.role = this.routerData.assignedRole;
      this.draftRequest = this.routerData.draftRequest;
      if (!this.role) {
        this.uiBenefitService.setBenefitStatus(BenefitConstants.NEW_BENEFIT);
      } else if (
        this.role === this.rolesEnum.VALIDATOR_1 ||
        this.rolesEnum.VALIDATOR_2 ||
        this.rolesEnum.FC_APPROVER_ANNUITY
      ) {
        this.uiBenefitService.setBenefitStatus(BenefitConstants.VAL_EDIT_BENEFIT);
        this.isValidator = true;
        this.benefitRequestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
        this.socialInsuranceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
        // this.sin = this.socialInsuranceNo;
        this.referenceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
      }
    } else {
      this.uiBenefitService.setBenefitStatus(BenefitConstants.NEW_BENEFIT);
    }
  }
  // This method is to go to previous form
  previousForm() {
    this.goToPreviousForm(this.submitRequestTabs, this.submitRequestWizard);
  }
  //  This method is to select wizard
  selectedWizard(index: number) {
    this.selectWizard(index, this.submitRequestTabs, this.applyRequestWizardItems);
  }
  // This method is to set wizard values
  setWizardValues() {
    this.applyRequestWizardItems = this.sanedBenefitService.getSanedWizardItems();
    this.applyRequestWizardItems[0].isActive = true;
    this.applyRequestWizardItems[0].isDisabled = false;
    this.applyRequestWizardItems[0].isImage = true;
    if (this.isAppPrivate) {
      this.applyRequestWizardItems = this.benefitDocumentService.addDocumentIcon(this.applyRequestWizardItems);
    }
  }

  // requestDateChanged(date) {
  //   if (date && this.uibenefits?.eligible) this.getCalculationDetails({ gregorian: date?.gregorian });
  // }
  onConfirm(date: GosiCalendar) {
    if (date) {
      this.requestDate = date;
      // this.getUIBenefits(this.socialInsuranceNo, moment(date.gregorian, 'YYYY-MM-DD').format('YYYY-MM-DD'));
      this.getUIAppealBenefits();
    }
  }
  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param bankName
   * @memberof AddEstablishmentSCBaseComponent
   */
  getBank(iBanCode) {
    this.lookUpService.getBank(iBanCode).subscribe(
      // res => (this.bankNameList = res.items[0]),
      res => {
        if (res.items[0]) {
          this.bankNameList = res.items[0];
        }
      },
      err => showErrorMessage(err, this.alertService)
    );
  }
  initializeForm() {
    if (!this.payeeForm) {
      this.payeeForm = this.createPayeeForm();
      if (this.benefitsForm) {
        if (this.benefitsForm.get('payeeForm')) this.benefitsForm.removeControl('payeeForm');
        this.benefitsForm.addControl('payeeForm', this.payeeForm);
      }
    }
  }
  getUIBenefits(socialInsuranceNumber: number, requestDate?: string) {
    this.uiBenefitService.getUIBenefits(socialInsuranceNumber, requestDate).subscribe(
      data => {
        this.uibenefits = data;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  /*
   * This method is to create payee form
   */
  createPayeeForm() {
    return this.fb.group({
      payeeType: this.fb.group({
        english: [BenefitValues.contributor, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      paymentMode: this.fb.group({
        english: [BenefitValues.BANK, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      authorizedPersonId: [null],
      personId: [null],
      authorizationDetailsId: [''],
      guardianSource: [null]
    });
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }

  /**
   * This method is used to show the bank details modal
   * @param modalRef
   */
  showBankDetailsModal(modalRef: TemplateRef<HTMLElement>) {
    this.alertService.clearAlerts();
    this.showModal(modalRef);
  }

  /*
   * This methid is for detecting changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.initializeForm();
    }
    if (changes && changes.benefitCalculation) {
      if (this.benefitCalculation) {
        // this.setHeirAfterModify();
        this.benefitCalculation = changes.benefitCalculation.currentValue;
      }
    }
  }
  /**
   * Generic method to hide the modals
   */
  hideModal() {
    this.alertService.clearAlerts();
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef.hide();
  }
  //Method to hide the bank modal
  hideBankModal() {
    this.hideModal();
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }

  showCancelTemplate() { }
  // This method is to set error messages.
  setError(messageKey: string) {
    this.otpErrorMessageKey = messageKey;
    this.showOtpError = true;
  }
  // Wrapper method to scroll to top of modal
  modalScroll() {
    scrollToModalError();
  }
  // This method is to apply for Saned
  apply() {
    let isBankFormValid = true;
    const uiPayload: UiApply = new UiApply();
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    if (this.contributorService.selectedSIN) {
      this.socialInsuranceNo = this.contributorService.selectedSIN;
    } else if (this.uiBenefitService.getSocialInsuranceNo()) {
      this.socialInsuranceNo = this.uiBenefitService.getSocialInsuranceNo();
    }
    if (
      this.payeeForm.get('paymentMode')?.get('english')?.value === BenefitValues.BANK &&
      (!this.payeeForm.get('payeeForm').get('bankAccount') ||
        !this.payeeForm.get('payeeForm').get('bankAccount.ibanBankAccountNo') ||
        !this.payeeForm.get('payeeForm').get('bankAccount.ibanBankAccountNo').value ||
        !this.payeeForm.get('payeeForm').get('bankAccount.ibanBilingual.english').valid)
    ) {
      isBankFormValid = false;
    }
    if (this.benefitsForm.get('requestDate')) {
      this.requestDate = getRequestDateFromForm(this.benefitsForm);
    }
    uiPayload.requestDate.gregorian =
      this.requestDate && this.requestDate.gregorian ? startOfDay(moment(this.requestDate.gregorian).toDate()) : null;
    if (
      this.payeeForm.get('payeeForm').get('bankAccount') &&
      this.payeeForm.get('payeeForm').get('bankAccount')?.value
    ) {
      // For GOL(public) and Private
      const savedBankDetails = new PatchPersonBankDetails();
      savedBankDetails.bankCode = this.payeeForm.get('payeeForm').get('bankAccount.bankCode').value;
      savedBankDetails.bankName = this.payeeForm.get('payeeForm').get('bankAccount.bankName').value;
      savedBankDetails.ibanBankAccountNo = this.payeeForm.get('payeeForm').get('bankAccount.ibanBankAccountNo').value;
      savedBankDetails.isNewlyAdded = this.payeeForm.get('payeeForm').get('bankAccount.bankType')
        ? this.payeeForm.get('payeeForm').get('bankAccount.bankType').value === 'addNewIBAN'
        : false;
      uiPayload.bankAccount = savedBankDetails;
    }
    uiPayload.referenceNo = this.referenceNo ? this.referenceNo : null;
    uiPayload.directPayment =  (this.unemploymentDto?.directPayment )? this.unemploymentDto.directPayment : null;
    if (this.payeeForm.get('payeeForm').get('payeeType') && this.payeeForm.get('payeeForm').get('payeeType')?.value) {
      uiPayload.payeeType = this.payeeForm.get('payeeForm').get('payeeType')?.value;
    }
    if (
      this.payeeForm.get('payeeForm').get('paymentMode') &&
      this.payeeForm.get('payeeForm').get('paymentMode')?.value
    ) {
      uiPayload.paymentMode = this.payeeForm.get('payeeForm').get('paymentMode')?.value;
    }
    //TODO: Recheck this condition, consider navigating to this page from inbox also (roterData)
    if (isBankFormValid) {
      if (this.referenceNo || this.benefitRequestId) {
        this.sanedBenefitService.updateBenefit(this.socialInsuranceNo, this.benefitRequestId, uiPayload).subscribe(
          data => {
            if (data) {
              this.benefitResponse = data;
              this.referenceNo = data.referenceNo;
              if (this.isIndividualApp) {
                const comment = { comments: null };
                this.setSuccessNavigation(data, comment);
              } else {
                this.benefitPropertyService.setReferenceNo(data.referenceNo);
                this.nextForm(this.submitRequestTabs, this.submitRequestWizard);
                this.alertService.clearAlerts();
              }
            }
          },
          err => {
            if (err.status === 400 || err.status === 422) {
              showErrorMessage(err, this.alertService);
            }
            if (err.status === 500 || err.status === 404) {
              this.alertService.showWarningByKey('BENEFITS.SUBMIT-FAILED-MSG');
            }
            this.goToTop();
          }
        );
      } else {
        this.sanedBenefitService.applySanedBenefit(this.socialInsuranceNo, uiPayload).subscribe(
          data => {
            if (data) {
              this.benefitResponse = data;
              this.referenceNo = data.referenceNo;
              this.benefitRequestId = data.benefitRequestId;
              //this.uiBenefitService.setIdForValidatorAction(this.benefitRequestId);
              this.uiBenefitService.setBenefitStatus(BenefitConstants.APPLIED_BENEFIT);
              if (this.isIndividualApp) {
                const comment = { comments: null };
                this.setSuccessNavigation(data, comment);
              } else {
                this.benefitPropertyService.setReferenceNo(data.referenceNo);
                if (this.benefitResponse.message !== null) {
                  this.showSuccessMessage(this.benefitResponse.message);
                  this.coreBenefitService.setBenefitAppliedMessage(this.benefitResponse.message);
                }
                this.nextForm(this.submitRequestTabs, this.submitRequestWizard);
              }
            }
          },
          err => {
            if (err.status === 400) {
              showErrorMessage(err, this.alertService);
            }
            this.goToTop();
          }
        );
      }
    } else {
      this.benefitsForm.markAllAsTouched();
      this.payeeForm.markAllAsTouched();
    }
  }

  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(comment: { comments: string }) {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.rolesEnum.VALIDATOR_1;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.referenceNo = this.referenceNo.toString();
    workflowData.comments = comment.comments || '';
    this.manageBenefitService.updateAnnuityWorkflow(workflowData).subscribe(
      res => {
        //this.uiBenefitService.setIdForValidatorAction(null);
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.manageBenefitService.navigateToInbox();
      },
      err => {
        this.showError(err);
      }
    );
  }
  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    //this.showModal(this.confirmTemplate);
    this.showModal(
      (!this.benefitRequestId && !this.routerData?.draftRequest) || this.routerData?.assigneeId
        ? this.confirmTemplate
        : this.confirmTransactionTemplate
    );
  }
  onKeepDraft() {
    this.location.back();
    this.hideModal();
  }
  onDiscard() {
    this.uiBenefitService.deleteTransaction(this.socialInsuranceNo, this.benefitRequestId).subscribe(() => {
      this.hideModal();
      this.location.back();
    });
  }
  /** Method to confirm cancellation. */
  confirm() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef.hide();
    const id = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
    const sin = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
    const referenceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
    if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 && id && sin) {
      this.sanedBenefitService.revertBenefit(sin, id, referenceNo).subscribe(
        res => {
          this.routeBack();
        },
        err => {
          this.showError(err);
        }
      );
    } else {
      this.goBackToBenefits();
    }
  }
  /** Method to decline cancellation. */
  decline() {
    this.commonModalRef.hide();
  }

  /* To validate the declaration check*/
  validateDeclarationCheck() {
    if (this.benefitsForm.get('checkBoxFlag').value) {
      this.declarationDone = true;
      this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
      this.apply();
    } else {
      this.declarationDone = false;
      this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
      this.alertService.showWarningByKey('BENEFITS.DECLARE-CHECK-MSG');
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
  /* To get required Documents*/
  fetchDocuments() {
    this.documentService
      .getDocuments(UITransactionType.REQUEST_SANED, this.transactionType, this.benefitRequestId)
      .subscribe(documentResponse => {
        this.documentList = documentResponse.filter(item => item.documentContent !== null);
        if (this.documentList) {
          for (const doc of this.documentList) {
            this.requiredDocs = documentResponse.filter(item => item.name.english === doc.name.english);
          }
        }
      });
  }
  /**
   * Method to fetch the contributor and saned details
   */
  getBenefitRequestDetails() {
    this.sanedBenefitService
      .getBenefitRequestDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
      .subscribe(res => {
        this.unemploymentDto = res;
        this.eligibleForPensionReform = res.pensionReformEligibility?.english === PensionReformEligibility.Eligible;
        this.benefitPropertyService.setPersonId(res.personId);
        if (res?.requestDate) {
          this.benefitsForm.get('requestDate').patchValue({
            gregorian: moment(res.requestDate.gregorian).toDate(),
            hijiri: res.requestDate.hijiri,
            entryFormat: res.requestDate.entryFormat
          });
          this.onConfirm(res?.requestDate);
        }
        this.getCalculationDetails({ gregorian: res?.requestDate ? res?.requestDate.gregorian : moment(new Date()).toDate() });
        this.contributorDomainService.getContributorIndividual(this.socialInsuranceNo).subscribe(data => {
          if (data.person?.personId) {
            this.getBankDetails(data.person?.personId, res.bankAccount);
            this.personId = data.person?.personId;
          }
        });
      });
  }
  /** Method to show error message for mandatory documents. */
  showMandatoryDocErrorMessage($event) {
    showErrorMessage($event, this.alertService);
  }
  /** Method to show success message and patch benefit with comments. */
  showFormSuccessMessage(comment: { comments: string }) {
    this.alertService.clearAlerts();
    //this.benefitRequestId = this.uiBenefitService.getId();
    this.sanedBenefitService
      .patchBenefit(this.socialInsuranceNo, this.benefitRequestId, comment, this.referenceNo)
      .subscribe(
        data => {
          if (data) {
            this.benefitResponse = data;
            if (this.role && this.role === this.rolesEnum.VALIDATOR_1 && !this.draftRequest) {
              this.saveWorkflowInEdit(comment);
            } else {
              //this.uiBenefitService.setIdForValidatorAction(null);
              this.benefitPropertyService.setReferenceNo(this.benefitResponse.referenceNo);
              if (this.benefitResponse.message != null) {
                this.showSuccessMessage(this.benefitResponse.message);
                this.coreBenefitService.setBenefitAppliedMessage(this.benefitResponse.message);
              }
              const navigateToPage = [`home/profile/individual/internal/${this.socialInsuranceNo}/benefits`];
              this.nextForm(this.submitRequestTabs, this.submitRequestWizard, null, navigateToPage);
            }
          }
        },
        err => {
          if (err.status === 400) {
            showErrorMessage(err, this.alertService);
          }
          this.goToTop();
        }
      );
  }
  /** Method to check if date is future date*/
  isFutureDate(date) {
    const today = new Date().getTime();
    const splitedDate = date.split('/');
    const idate = new Date(splitedDate[2], splitedDate[1] - 1, splitedDate[0]).getTime();
    return today - idate < 0 ? true : false;
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
  /** Method to handle c;aring alerts before component destroyal . */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  /** Method to Clear success message*/
  clearSuccessMessage() {
    this.saveApiResp = null;
  }
  getBankName(bankCode: number) {
    this.lookUpService.getBank(bankCode).subscribe(
      res => {
        if (res.items[0]) {
          this.bankName = res.items[0].value;
        }
      },
      err => showErrorMessage(err, this.alertService)
    );
  }
  getPersonDetailsWithPersonId(personId: number) {
    this.manageBenefitService.getPersonDetailsWithPersonId(personId.toString()).subscribe(res => {
      this.personDetails = res;
    });
  }
  viewIneligibleDetails() {
    this.commonModalRef = showModal(this.modalService, this.inEligibleReason);
  }
}
