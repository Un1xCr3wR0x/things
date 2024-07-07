import { Directive, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  DocumentItem,
  DocumentService,
  iBanValidator,
  isBorderNumber,
  isIqamaNumber,
  isNIN,
  lengthValidator,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  scrollToTop,
  setAddressFormToAddresses,
  WizardItem
} from '@gosi-ui/core';
import {
  ContributorService,
  AddAuthorizationService,
  FormWizardTypes,
  PersonalInformation
} from '@gosi-ui/features/contributor';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments/lib/address';
import { ContactDcComponent } from '@gosi-ui/foundation/form-fragments/lib/contact';
import { noop, Observable } from 'rxjs';
import { createAuthPurposeForm, createCustomAuthDetailForm, MOJSmartForm, PersonDetailsSmartForm } from '../forms';

@Directive()
export abstract class AddAuthorizationBaseScComponent extends BaseComponent implements OnInit {
  /** Object/Class variables. */
  isAppPrivate: boolean;
  isEditMode = false;
  documents: Array<DocumentItem> = [];
  activeTab = 0;
  totalTab = 3;
  wizardItems: WizardItem[];
  person: PersonalInformation;
  authorizerList: Array<{ form: PersonDetailsSmartForm; allowEdit: boolean }> = [];
  authorizationId: number;
  referenceNo: number;
  uuid: string;
  minMaxLengthAccountNo = 24;

  // LovLists
  countryList: Observable<LovList>;
  cityList: Observable<LovList>;
  genderList: Observable<LovList>;
  nationalityList: Observable<LovList>;

  /** Child components. */
  @ViewChild('progressWizardItems') progressWizard: ProgressWizardDcComponent;
  @ViewChild('addressDetails', { static: false })
  addressDcComponent: AddressDcComponent;
  @ViewChild('contactDetails', { static: false })
  contactDcComponent: ContactDcComponent;
  addressForms = new FormGroup({});

  /** forms initializationk. */
  mojAuthForm = new MOJSmartForm(this.fb);
  authPurposeForm = createAuthPurposeForm(this.fb);
  customAuthDetailsForm = createCustomAuthDetailForm(this.fb);
  personDetailsSmartForm = new PersonDetailsSmartForm(this.fb);
  bankDetailsForm = this.createBankDetailsForm();

  constructor(
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly addAuthorizationService: AddAuthorizationService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super();
  }

  ngOnInit(): void {}

  /** Method to fetch required documents for the transaction. */
  getRequiredDocuments(docTransactionId: string, docTransactionType: string | string[], callbackFn?) {
    this.documentService.getRequiredDocuments(docTransactionId, docTransactionType).subscribe(res => {
      if (callbackFn) this.documents = callbackFn(res);
      else this.documents = res;
    });
  }

  createBankDetailsForm(required = true) {
    const validators = [lengthValidator(this.minMaxLengthAccountNo), iBanValidator];
    if (required) validators.push(Validators.required);
    return this.fb.group({
      ibanAccountNo: this.fb.group({
        english: [null, { validators: Validators.compose(validators) }],
        arabic: [null],
        updateOn: 'blur'
      }),
      bankName: this.fb.group({
        english: ['', required ? { validators: Validators.required } : {}],
        arabic: [null],
        updateOn: 'blur'
      }),
      isIbanSelectedOption: this.fb.group({
        english: ['Yes'],
        arabic: [null],
        updateOn: 'blur'
      })                

                     
    });
  }

  setBankDetailsRequirement() {
    const accountNo = this.bankDetailsForm.get('ibanAccountNo.english').value;
    const bankName = this.bankDetailsForm.get('bankName.english').value;
    this.bankDetailsForm = this.createBankDetailsForm(this.authPurposeForm.get('isReceiveBenefitPurpose').value);
    this.bankDetailsForm.patchValue({
      ibanAccountNo: {
        english: accountNo
      },
      bankName: {
        english: bankName
      }
    });
  }

  /** Method to refresh documents after scan. */
  refreshDocument(
    doc: DocumentItem,
    businessKey: number,
    docTransactionId?: string,
    docTransactionType?: string,
    referenceNo?: number,
    uuid?: string
  ) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          businessKey,
          docTransactionId,
          docTransactionType,
          referenceNo,
          null,
          uuid,
          doc.sequenceNumber
        )
        .subscribe(res => (doc = res));
    }
  }

  /** Method to check documents. */
  checkDocuments(): boolean {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }

  /** Method to delete any document scanned or uploaded when the transaction is cancelled. */
  deleteDocumentsOnCancel() {
    this.documents.forEach(doc => {
      if (doc.documentContent)
        this.documentService
          .deleteDocument(this.person.personId, doc.name.english, null, null, doc.sequenceNumber, null)
          .subscribe(noop);
    });
  }

  /** Method to initialize wizard. */
  initializeWizard(): void {
    this.wizardItems = this.getWizardItems();
    this.initializeFirstWizardItem();
  }

  /** Method to fetch wizard items. */
  getWizardItems(): WizardItem[] {
    return [
      new WizardItem(FormWizardTypes.VERIFY_AUTHORIZATION, 'user-check'),
      new WizardItem(FormWizardTypes.AUTHORIZATION_DETAILS, 'users'),
      new WizardItem(FormWizardTypes.PERSON_DETAILS, 'user')
    ];
  }

  /** Method to initialize first wizard item. */
  initializeFirstWizardItem(isFirstItemImage?: boolean) {
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
    if (isFirstItemImage) this.wizardItems[0].isImage = true;
  }

  isValidAddress(): boolean {
    return (
      this.addressDcComponent.getAddressValidity() &&
      this.contactDcComponent.contactDetailsForm.valid &&
      this.bankDetailsForm.valid
    );
  }

  isAddressTabActive(): boolean {
    return this.activeTab === 2;
  }

  setPersonAddressAndContactDetails() {
    this.person.contactDetail = this.contactDcComponent.contactDetailsForm.getRawValue();
    this.person.contactDetail.addresses = setAddressFormToAddresses(this.addressForms);
  }

  /** Method to navigate to next tab. */
  setNextSection(): void {
    if (this.isAddressTabActive()) {
      if (!this.isValidAddress()) {
        this.setPreviousSection();
        this.alertService.showMandatoryErrorMessage();
        this.contactDcComponent.contactDetailsForm.markAllAsTouched();
        this.bankDetailsForm.markAllAsTouched();
      } else {
        this.setPersonAddressAndContactDetails();
        if (!this.person.contactDetail?.mobileNo?.isdCodePrimary) {
          // fixing bug in contact details form.
          this.person.contactDetail.mobileNo.isdCodePrimary = 'sa';
        }
        this.addAuthorizationService.updateAddress(this.person, this.person.personId).subscribe(noop, this.showError);
      }
    }
    this.handleNext();
    this.progressWizard.setNextItem(this.activeTab);
  }

  /** Method to navigate to previous tab. */
  setPreviousSection(): void {
    this.handlePrevious();
    this.progressWizard.setPreviousItem(this.activeTab);
    this.selectFormWizard(this.activeTab);
  }

  /** Method to navigate between form wizard steps while clicking on individual wizard icon. */
  selectFormWizard(selectedWizardIndex: number) {
    if (selectedWizardIndex === 0) {
      this.authorizerList = [];
      this.person = undefined;
      this.authorizationId = undefined;
      this.isEditMode = false;
      this.personDetailsSmartForm.removePersonNameFields();
    }
    for (let i = selectedWizardIndex; i < this.totalTab; i++) {
      if (this.wizardItems[i + 1]) {
        this.wizardItems[i + 1].isDisabled = true;
        this.wizardItems[i + 1].isActive = false;
        this.wizardItems[i + 1].isDone = false;
      }
    }
    this.alertService.clearAlerts();
    this.activeTab = selectedWizardIndex;
  }

  /** Handle navigating to next section. */
  handleNext() {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.activeTab++;
  }

  /** Handle navigating to previous section. */
  handlePrevious() {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.activeTab--;
  }

  /** Reload current route */
  refresh() {
    this.alertService.clearAllErrorAlerts();
    // this is to reload the current route.
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      // this.router.navigate(['/home']);
      this.router.navigate([currentUrl]);
      this.ngOnInit();
    });
  }

  getIdQueryString(id: string): string {
    if (isNIN(id)) return `NIN=${id}`;
    if (isIqamaNumber(id)) return `iqamaNo=${id}`;
    if (isBorderNumber(id)) return `borderNo=${id}`;

    return '';
  }

  showError(error) {
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }

  showErrorByKey(key) {
    scrollToTop();
    this.alertService.showErrorByKey(key);
  }
}
