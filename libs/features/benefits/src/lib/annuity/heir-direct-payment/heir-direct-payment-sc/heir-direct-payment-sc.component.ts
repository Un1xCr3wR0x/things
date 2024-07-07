import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {
  AlertService,
  ApplicationTypeToken,
  ContactDetails,
  CoreActiveBenefits,
  CoreBenefitService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  RouterService,
  WizardItem,
  scrollToTop,
  WorkFlowActions,
  Role,
  setAddressFormToAddresses
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BreadcrumbDcComponent, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import {
  BenefitConstants,
  DirectPaymentService,
  WizardService,
  clearAlerts,
  showErrorMessage,
  ManageBenefitService
} from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import {
  BankAccountDto,
  HeirDirectPaymentDto,
  HeirMiscPaymentRequestDto
} from '../../../shared/models/heir-direct-payment-dto';
import { setWorkFlowDataForMerge } from '../../../shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectHeirPaymentScComponent } from '../select-heir-payment-sc/select-heir-payment-sc.component';

@Component({
  selector: 'bnt-heir-direct-payment-sc',
  templateUrl: './heir-direct-payment-sc.component.html',
  styleUrls: ['./heir-direct-payment-sc.component.scss']
})
export class HeirDirectPaymentScComponent implements OnInit {
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;

  @ViewChild('benefitWizard', { static: false })
  benefitWizard: ProgressWizardDcComponent;

  @ViewChild('brdcmb', { static: false })
  holdBnftBrdcmb: BreadcrumbDcComponent;

  @ViewChild('selectPaymentComponent', { static: false })
  selectPaymentComponent: SelectHeirPaymentScComponent;

  /** Local Variables */
  lang = 'en';
  rolesEnum = Role;

  commonModalRef: BsModalRef;
  currentTab = 0;
  wizards: WizardItem[] = [];
  directPaymentForm = new FormArray([]);
  documentForm: FormGroup = new FormGroup({});
  activeBenefit: CoreActiveBenefits;
  referenceNo: number;
  requiredDocs: DocumentItem[];
  transactionId = BenefitConstants.TRANSACTIONID_HEIR_DIRECT_PAYMENT;
  isEditMode = false;
  isPrevious = false;

  constructor(
    readonly location: Location,
    readonly alertService: AlertService,
    readonly coreBenefitService: CoreBenefitService,
    private directPaymentService: DirectPaymentService,
    private manageBenefitService: ManageBenefitService,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly wizardService: WizardService,
    readonly routerService: RouterService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.route.queryParams.subscribe(params => {
      if (params) this.isEditMode = params.isEdit === 'true';
    });
    this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
    if (this.isEditMode) {
      this.referenceNo = this.directPaymentService.getReferenceNo();
      const paymentSourceId = this.directPaymentService.getPaymentSourceId();
      this.activeBenefit = new CoreActiveBenefits(paymentSourceId, null, null, this.referenceNo);
    }

    this.initializeWizardDetails();
  }

  /** Method to initialize the navigation wizards. */
  initializeWizardDetails() {
    this.wizards = this.wizardService.getHeirDirectPaymentWizardItems();
    this.wizards[0].isActive = true;
    this.wizards[0].isDisabled = false;
  }

  /*
   * This method is to select wizard
   */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }

  saveAndNext() {
    this.selectPaymentComponent?.directPaymentComponents?.forEach(component => {
      component?.paymentDetailsComponent?.setAdressRelatedValues();
    });
    if (this.directPaymentForm.valid) {
      const payload = this.setPaymentDetailsPayload();
      if (payload?.heirMiscPaymentRequestDto.length <= 0) return;
      if (this.isEditMode || this.isPrevious) {
        this.updateDirectPaymentDetails(payload);
      } else {
        this.postDirectPaymentDetails(payload);
      }
    }
  }

  postDirectPaymentDetails(payload) {
    this.directPaymentService.saveDirectPaymentDetails(this.activeBenefit?.sin, payload).subscribe(
      (res: any) => {
        this.referenceNo = res?.referenceNo;
        this.currentTab = 1;
        if (this.benefitWizard) this.benefitWizard.setNextItem(this.currentTab);
        this.getRequiredDocuments(this.activeBenefit?.sin, this.referenceNo);
      },
      err => showErrorMessage(err, this.alertService)
    );
  }

  updateDirectPaymentDetails(payload) {
    payload.referenceNo = this.referenceNo;
    this.directPaymentService.updateDirectPaymentDetails(this.activeBenefit?.sin, payload).subscribe(
      (res: any) => {
        this.referenceNo = res?.referenceNo;
        this.currentTab = 1;
        if (this.benefitWizard) this.benefitWizard.setNextItem(this.currentTab);
        this.getscannedDocuments(this.activeBenefit?.sin, this.referenceNo);
      },
      err => showErrorMessage(err, this.alertService)
    );
  }

  getscannedDocuments(sin, referenceNo) {
    this.directPaymentService.getUploadedDocuments(sin, referenceNo).subscribe(res => {
      this.requiredDocs = res;
      this.requiredDocs.map(doc => (doc.canDelete = true));
    });
  }

  submitPayment(event) {
    const payload = { comments: event.comments, referenceNo: this.referenceNo };
    this.directPaymentService.submitDirectPaymentDetails(this.activeBenefit?.sin, payload).subscribe((res: any) => {
      if (res?.message !== null) {
        this.alertService.showSuccess(res.message);
        if (this.isEditMode) {
          this.saveWorkflowInEdit(event.comments);
        } else {
          this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
        }
      }
      // this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
    });
  }

  saveWorkflowInEdit(comment) {
    const workflowData = setWorkFlowDataForMerge(this.routerData, this.documentForm, null);
    workflowData.assignedRole = this.rolesEnum.VALIDATOR_1;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.comments = comment || '';
    this.manageBenefitService.updateAnnuityWorkflow(workflowData, null).subscribe(
      () => {
        this.manageBenefitService.navigateToInbox();
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
      },
      err => {
        //this.disableSubmitButton = false;
        showErrorMessage(err, this.alertService);
      }
    );
  }

  setPaymentDetailsPayload() {
    const directPaymentDetails = new HeirDirectPaymentDto();
    directPaymentDetails.heirMiscPaymentRequestDto = [];
    this.directPaymentForm.controls.forEach(form => {
      if (form.get('checkBoxFlag')?.value) {
        const heirPaymentDetails = new HeirMiscPaymentRequestDto();
        heirPaymentDetails.benefitAmount = form?.get('benefitAmount')?.value;
        // heirPaymentDetails.benefitStatus = form?.get('benefitStatus')?.value;
        heirPaymentDetails.benefitStatus = {
          arabic: 'Active',
          english: 'Active'
        };
        heirPaymentDetails.heirStatus = form?.get('heirStatus')?.value;
        heirPaymentDetails.isNewContactDetails = false;
        heirPaymentDetails.identifier = form?.get('person')?.value?.identifier;
        heirPaymentDetails.personId = form?.get('person')?.value?.personId;
        heirPaymentDetails.relationship = form?.get('relationship')?.value;
        heirPaymentDetails.dateOfBirth = form?.get('dateOfBirth')?.value;
        heirPaymentDetails.startDate = form?.get('startDate')?.value;
        const payeeForm = form?.get('payeeForm');
        if (payeeForm) {
          heirPaymentDetails.agentType = payeeForm?.get('payeeType')?.value;
          if (heirPaymentDetails.agentType?.english === 'Authorized Person') {
            heirPaymentDetails.agentPersonId = payeeForm?.get('authorizedPersonId')?.value;
          }
          if (heirPaymentDetails.agentType?.english === 'Guardian') {
            heirPaymentDetails.agentPersonId = payeeForm?.get('guardianPersonId')?.value;
          }
        }

        const bankAccount = new BankAccountDto();
        const bankForm = payeeForm?.get('bankAccount');
        if (bankForm) {
          bankAccount.ibanBankAccountNo = bankForm?.get('ibanBankAccountNo').value;
          bankAccount.bankName = bankForm.get('bankName')?.value;
          bankAccount.bankAccountId = bankForm.get('bankAccountId')?.value;
          bankAccount.bankCode = bankForm.get('bankCode')?.value;
          bankAccount.isNonSaudiIBAN = bankForm.get('isNonSaudiIBAN')?.value;
          bankAccount.swiftCode = bankForm.get('swiftCode')?.value;
          if (bankAccount.bankCode?.toString() === 'no') bankAccount.bankCode = null;
          bankAccount.verificationStatus = bankForm.get('verificationStatus')?.value;
          bankAccount.status = bankForm.get('status')?.value;
        }
        heirPaymentDetails.bankAccount = bankAccount;
        heirPaymentDetails.contactDetail = payeeForm?.get('contactDetails')?.value;
        heirPaymentDetails.newIban = bankForm?.get('isNewlyAdded')?.value;
        heirPaymentDetails.newOverseasAddress = bankForm?.get('isNonSaudiIBAN')?.value;
        if (this.checkAddressFormStatus(form)) heirPaymentDetails.isNewContactDetails = true;
        directPaymentDetails.heirMiscPaymentRequestDto.push(heirPaymentDetails);
      }
    });
    return directPaymentDetails;
  }

  checkAddressFormStatus(form) {
    return form?.get('saudiAddress')?.dirty || form?.get('poBoxAddress')?.dirty || form?.get('foreignAddress')?.dirty;
  }

  setAdressRelatedValues(form): ContactDetails {
    const contactDetails = new ContactDetails();
    contactDetails.addresses = setAddressFormToAddresses(form);
    contactDetails.currentMailingAddress = form?.get('currentMailingAddress')?.value;
    form?.get('foreignAddress')?.markAsUntouched();
    form?.get('poBoxAddress')?.markAsUntouched();
    form?.get('saudiAddress')?.markAsUntouched();
    form?.updateValueAndValidity();
    return contactDetails;
  }

  getRequiredDocuments(paymentSourceId, referenceNo) {
    this.directPaymentService.getMiscDocuments(paymentSourceId, referenceNo).subscribe(res => {
      this.requiredDocs = res;
      this.requiredDocs.map(doc => (doc.canDelete = true));
    });
  }

  get disableSaveAndNext() {
    return this.directPaymentForm?.valid;
  }

  routeBack() {
    this.location.back();
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  showModal(template: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(template);
  }

  confirm() {
    if (this.isEditMode) {
      this.directPaymentService.revertMiscPayment(this.activeBenefit?.sin, this.referenceNo).subscribe(() => {
        this.alertService.clearAlerts();
        this.location.back();
      });
    } else if (this.referenceNo) {
      this.directPaymentService.cancelMiscPayment(this.activeBenefit?.sin, this.referenceNo).subscribe(() => {
        this.alertService.clearAlerts();
        this.location.back();
      });
    } else {
      this.alertService.clearAlerts();
      this.location.back();
    }
  }
  decline() {
    this.commonModalRef.hide();
  }

  /** Document Related Functions */
  /**
   * Method to perform feedback call after scanning.
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(document, this.activeBenefit?.sin, null, null, this.referenceNo)
        .subscribe(res => {
          if (res) {
            document = res;
          }
        });
    }
  }
  showFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
  /** Method to handle cancellation of transaction. */
  cancelTransactions(canceltemplate: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(canceltemplate);
  }

  // Method to navigate back to previous section.
  previousFormDetails() {
    this.isPrevious = true;
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.benefitWizard.setPreviousItem(this.currentTab);
  }
}
