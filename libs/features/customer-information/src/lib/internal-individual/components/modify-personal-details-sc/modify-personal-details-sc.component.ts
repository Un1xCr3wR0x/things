/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  BorderNumber,
  DocumentItem,
  DocumentService,
  FamilyDetails,
  IdentityTypeEnum,
  Iqama,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  NIN,
  NationalId,
  Passport,
  Person,
  UuidGeneratorService,
  WizardItem,
  bindToForm,
  convertToStringDDMMYYYY,
  scrollToTop
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared';
import { ContributorConstants } from '@gosi-ui/features/contributor/lib/shared/constants';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, noop } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  ChangePersonScBaseComponent,
  ChangePersonService,
  ManagePersonConstants,
  ManagePersonRoutingService,
  ManagePersonService,
  PersonBankDetails
} from '../../../shared';
import { RecalculationConstants } from '../../../shared/constants/benefits';
import { DocumentTransactionTypeEnum, TransactionId } from '../../../shared/enums';

//This component is to set the profile details of the person
@Component({
  selector: 'cim-modify-personal-details-sc',
  templateUrl: './modify-personal-details-sc.component.html',
  styleUrls: ['./modify-personal-details-sc.component.scss']
})
export class ModifyPersonalDetailsScComponent extends ChangePersonScBaseComponent implements OnInit {
  showProfile = false; //Shows the profile if the person is valid only
  person: Person;
  personDtls: Person;
  personId: number;
  acqId: number;
  label = 'MY-PROFILE';
  socialInsuranceNo: number;
  active: boolean;
  isContributor = false;
  isIdentity = false;
  isIbanVerified = true;

  // Form Variables
  educationForm: FormGroup;
  contactForm: FormGroup = new FormGroup({});
  bankParentForm: FormGroup = new FormGroup({});
  otpControl: FormControl = new FormControl();
  comments: FormControl = new FormControl();
  addressForms = new FormGroup({});

  //Check if the entered otp is valid
  showOtp = false; // Otp Screen View
  isOtpValid: boolean; // Check the validity
  isResend = false; // Timer finished
  noOfResend = ManagePersonConstants.NO_OF_OTP_RETRIES; // Maximum no of resend possible

  //Filed to check if the mobile number has been verified with abhser
  absherVerified = true;
  mobileVerifiedPage = false; // Mobile verified successfull
  bankDetails: PersonBankDetails = new PersonBankDetails();
  noOfIncorrectOtp = 0;

  otpErrorMessageKey: string;
  absherInfoMessageKey: string;
  bankNameList: Lov;
  genderList$: Observable<LovList>;
  maritalStatusList$: Observable<LovList>;
  educationList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  specializationList$: Observable<LovList>;

  modifyWizardItems: WizardItem[] = [];
  /**Progress wizard */
  @ViewChild('progressWizardItems', { static: false })
  progressWizardItems: ProgressWizardDcComponent;
  PERSON_DETAILS: string;
  DOCUMENTS = 'CUSTOMER-INFORMATION.DOCUMENTS_CAPS';
  page: string;
  nationalityList$: Observable<LovList>;
  documentUploadEngagementId: number;
  referenceNo: number;
  isContractRequired: boolean;
  isApiTriggered = false;
  parentForm = new FormGroup({});
  documents: DocumentItem[] = [];
  activeTab = 0;
  basicDetailsDocuments: DocumentItem[];
  documentTransactionType: string;
  documentTransactionKey: string;
  documentTransactionId: number;
  registrationNo: number;
  uuid: string;
  familyDetails: FamilyDetails;
  familyDetailsChecked: boolean;
  showAlert: boolean;
  lang = 'en';
  modifyFamily: boolean;
  addFamily: boolean;
  isSaudiPerson: boolean;
  private _personId: number;
  contributorDetails;
  modalRef: BsModalRef;
  message: BilingualText = new BilingualText();
  docUploaded: boolean;
  isChangePassport: boolean = false;
  passportNo: any;
  isChanged: boolean = false
  personPassportDetails: Person;
  constructor(
    public alertService: AlertService,
    readonly lookService: LookupService,
    public changePersonService: ChangePersonService,
    readonly dashboardService: DashboardSearchService,
    readonly contributorService: ContributorService,
    public modalService: BsModalService,
    public documentService: DocumentService,
    private manageService: ManagePersonService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly manageRoutingService: ManagePersonRoutingService,
    readonly fb: FormBuilder,
    readonly route: ActivatedRoute,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly location: Location
  ) {
    super(
      changePersonService,
      dashboardService,
      contributorService,
      lookService,
      appToken,
      alertService,
      documentService,
      modalService,
      route
    );
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { page: string };
    this.page = state?.page;
  }

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    if (!this.page) this.location.back();
    this.language.subscribe(lang => (this.lang = lang));
    this.initializeWizard();
    this.initialiseLookups();
    this.setLovLists();
    this.person = new Person();
    this.alertService.clearAlerts();
    this.absherInfoMessageKey = 'CUSTOMER-INFORMATION.INFO.ABHSER_VERIFIED_INFO';
    this.route.params.subscribe(params => {
      this.personId = params['personId'];
      this.sin = this.changePersonService.getSIN();
      if (this.contributorService.NINDetails?.length > 0) {
        this.identifier = this.contributorService.NINDetails[0].newNin;
      } else if (this.contributorService.IqamaDetails?.length > 0) {
        this.identifier = this.contributorService.IqamaDetails[0].iqamaNo;
      } else {
        this.identifier = this.sin;
      }
      this.changePersonService.getPersonInfo().subscribe(res => {
        this.personDtls = res;
        this.personPassportDetails = res
      });
      this.changePersonService.getPersonID().subscribe(res => {
        this._personId = res;
      });
      // this.personId = this.personDtls.personId;
      this.isSaudiPerson = this.personDtls?.nationality?.english == 'Saudi Arabia' ? true : false;
      this.familyDetails = this.changePersonService.getFamilyInfo();
      this.acqId = this.familyDetails?.id;
      this.familyDetailsChecked = true;
      // this.changePersonService.getFamilyAddressDetails(this.personId).subscribe(response => {
      //   this.familyDetailsChecked = true;
      //   this.familyDetails = response.acquaintances[0];
      // });
      //   this.changePersonService.getContributorDetails(id).subscribe(response => {
      //     this.personDtls = response.listOfPersons[0];
      //     this.personId = response.listOfPersons[0].personId;
      //     this.changePersonService.getFamilyAddressDetails(this.personId).subscribe(response => {
      //       this.familyDetailsChecked = true;
      //       this.familyDetails = response.acquaintances[0];
      //     });
      // });
    });

    // this.route.parent.parent.paramMap.subscribe(params => {
    //   if (params.get('identifier')) {
    //     if (params) this.identifier = Number(params.get('identifier'));
    //     this.getProfileDetails(this.identifier);
    //   }
    // });
    if (this.manageService.contributor$) {
      this.manageService.contributor$
        .pipe(
          filter(res => res !== null),
          tap(res => {
            this.person = res.person;
            this.isIdentity = false;
            this.person.identity.forEach((item: NIN | Iqama | NationalId | Passport | BorderNumber) => {
              if (item.idType === IdentityTypeEnum.NIN || item.idType === IdentityTypeEnum.IQAMA) {
                this.isIdentity = true;
              }
            });
          })
        )
        .subscribe(noop);
    }
  }

  setLovLists() {
    // this.gccCountryList$ = this.lookupService.getGccCountryList();
    this.educationList$ = this.lookService.getEducationList();
    this.specializationList$ = this.lookService.getSpecializationList();
    this.cityList$ = this.lookService.getCityList();
    this.genderList$ = this.lookService.getGenderList();
    this.maritalStatusList$ = this.lookService.getMaritalStatus().pipe(
      filter(res => res !== null),
      map(
        list =>
          new LovList(
            list.items.filter(lov => ContributorConstants.MARITAL_STATUS_EXCLUDE_LIST.indexOf(lov.value.english) === -1)
          )
      )
    );
    // this.yesOrNoList$ = this.lookupService.getYesOrNoList();
    this.nationalityList$ = this.lookService.getNationalityList();
  }

  /**
   * Method to get reference the of the contact form from child
   * @param childForm
   */
  bindToContactForm(childForm: FormGroup) {
    this.contactForm = new FormGroup({});
    this.contactForm.addControl('contactDetail', childForm);
  }

  /**
   *Method to get reference the of the bank form from child
   * @param bankForm
   */
  bindToBankForm(bankForm) {
    this.bankParentForm = new FormGroup({});
    this.bankParentForm.addControl('bankForm', bankForm);
  }

  /** ------------------Functionalities----------------------- */

  /**

  /**
   * Method to check the identity of the person
   */
  checkIdentity() {
    this.person.identity.forEach((item: NIN | Iqama | NationalId | Passport | BorderNumber) => {
      if (item.idType === IdentityTypeEnum.NIN || item.idType === IdentityTypeEnum.IQAMA) {
        this.isIdentity = true;
      } else {
        this.isIdentity = false;
      }
    });
  }

  saveAddress() { }

  /*---------------------------- Modal Utilities--------------------- */

  /**
   * Method to change the value of button click
   */
  back() {
    this.clearAlert();
    this.showOtp = false;
    this.isResend = true;
  }

  /**
   * This method is used to show the education modal
   * @param modalRef
   */
  showEducationModal(modalRef: TemplateRef<HTMLElement>) {
    bindToForm(this.educationForm, this.person);
    this.showModal(modalRef);
  }

  /**
   * This method is used to show the contact modal
   * @param modalRef
   */
  showContactModal(modalRef: TemplateRef<HTMLElement>) {
    this.isResend = true;
    this.mobileVerifiedPage = false;
    this.showModal(modalRef, 'xl');
  }
  /**
   * This method is used to show the bank details modal
   * @param modalRef
   */
  showBankDetailsModal(modalRef: TemplateRef<HTMLElement>) {
    this.changePersonService.getBeneficiaryDetails(this.person.personId).subscribe(
      res => {
        if (res) {
          if (res.isEditable === true) {
            this.alertService.clearAlerts();
            this.showModal(modalRef);
          } else {
            this.showErrorMessage({ error: { message: res.errorMessage } });
          }
          this.getDocumentList();
        }
      },
      err => this.showErrorMessage(err)
    );
  }

  navigateToAddress() {
    this.manageRoutingService.navigateToUpdateAddress();
  }

  //Method to hide the contact modal
  hideContactModal() {
    this.isResend = true;
    this.noOfIncorrectOtp = 0;
    this.hideModal();
  }

  //Method to hide the bank modal
  hideBankModal() {
    this.hideModal();
  }

  /**
   * This method is to set error messages.
   */

  setError(messageKey: string) {
    this.otpErrorMessageKey = messageKey;
    this.showOtpError = true;
  }

  initializeWizard() {
    this.modifyWizardItems = this.getWizards();
    this.modifyWizardItems[0].isDisabled = false;
    this.modifyWizardItems[0].isActive = true;
  } /** Method to get wizard items */
  getWizards() {
    if (this.page == 'personal') {
      this.PERSON_DETAILS = 'CUSTOMER-INFORMATION.PERSONAL_DETAILS_CAPS';
    } else if (this.page == 'addFamily') {
      this.addFamily = true;
      this.PERSON_DETAILS = 'CUSTOMER-INFORMATION.ADD_FAMILY_DETAILS_CAPS';
    } else if (this.page == 'modifyFamily') {
      this.modifyFamily = true;
      this.PERSON_DETAILS = 'CUSTOMER-INFORMATION.MODIFY_FAMILY_ADDRESS_CAPS';
    }
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(this.PERSON_DETAILS, 'address-book'));
    wizardItems.push(new WizardItem(this.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  selectWizard(selectedWizardIndex) {
    this.alertService.clearAlerts();
    this.activeTab = selectedWizardIndex;
  }
  /** Method to navigate to next tab on successful save */
  navigateToNextTab() {
    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.activeTab++;
    this.progressWizardItems.setNextItem(this.activeTab);
    scrollToTop();
  }
  /** Method to navigate to the previous tab */
  navigateToPreviousTab() {

    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.activeTab--;
    this.progressWizardItems.setPreviousItem(this.activeTab);
    scrollToTop();
  }
  /** Method to navigate by index. */
  navigateToTabByIndex(activeTab: number) {
    this.isApiTriggered = false;
    this.activeTab = activeTab;
    this.progressWizardItems.setActive(this.activeTab);
    scrollToTop();
  }

  saveAndNext(contributorDetails) {
    if(contributorDetails && contributorDetails.identity){
      const oldppassportDetails: any = this.personPassportDetails.identity.find(id => id.idType == 'PASSPORT')
      const newPassportDetails: any = contributorDetails.identity.find(id => id.idType == 'PASSPORT')
    if(newPassportDetails && newPassportDetails.passportNo){
    const isDate: any = (convertToStringDDMMYYYY(oldppassportDetails?.issueDate?.gregorian) !== convertToStringDDMMYYYY(newPassportDetails?.issueDate?.gregorian)
      && newPassportDetails?.issueDate?.gregorian != null)
      || (convertToStringDDMMYYYY(oldppassportDetails?.expiryDate?.gregorian )!==convertToStringDDMMYYYY( newPassportDetails?.expiryDate?.gregorian)
        && newPassportDetails?.expiryDate?.gregorian != null)
    if ((oldppassportDetails?.passportNo !== newPassportDetails.passportNo && newPassportDetails.passportNo.length != 0) || isDate) {
      this.isChangePassport = true;
    }
    else {
      this.isChangePassport = false
    }
  }
}
    if (contributorDetails) {
      // this.uuid = this.uuidGeneratorService.getUuid();
      this.uuid = !this.uuid ? this.uuidGeneratorService.getUuid() : this.uuid;
      if (this.page == 'addFamily') {
        const selectedProperties1 = this.selectSomeProperties1(contributorDetails);
        const selectedProperties2 = this.selectSomeProperties2(contributorDetails.contactDetail);
        const payload = Object.assign(selectedProperties1, selectedProperties2);
        this.familyDetails = contributorDetails;
        this.documentTransactionKey = DocumentTransactionTypeEnum.ADD_FAMILY_DETAILS;
        this.documentTransactionType = DocumentTransactionTypeEnum.MODIFY_FAMILY_DETAILS;
        this.documentTransactionId = TransactionId.ADD_FAMILY_DETAILS;
        this.getRequiredDocument(this.documentTransactionType, this.documentTransactionType, true);
        this.navigateToNextTab();
      } else if (this.page == 'modifyFamily') {
        this.familyDetails = contributorDetails;
        this.documentTransactionKey = DocumentTransactionTypeEnum.MODIFY_FAMILY_DETAILS;
        this.documentTransactionType = DocumentTransactionTypeEnum.MODIFY_FAMILY_DETAILS;
        this.documentTransactionId = TransactionId.MODIFY_FAMILY_DETAILS;
        this.getRequiredDocument(this.documentTransactionType, this.documentTransactionType, true);
        this.navigateToNextTab();
      } else if (this.page == 'personal') {
        const passportArr = contributorDetails.identity.find(x => x.idType == 'PASSPORT');
        if (passportArr && (!passportArr.passportNo || passportArr.passportNo === '')) {
          const index = contributorDetails.identity.findIndex(x => x.idType == 'PASSPORT');
          contributorDetails?.identity?.splice(index, 1);
        }
        const ninArr = contributorDetails?.identity?.find(x => x.idType == 'NIN');
        if (ninArr && (!ninArr?.newNin || ninArr?.newNin === '')) {
          const index = contributorDetails?.identity?.findIndex(x => x.idType == 'NIN');
          contributorDetails?.identity?.splice(index, 1);
        }
        this.personDtls = contributorDetails;
        this.documentTransactionKey = DocumentTransactionTypeEnum.MODIFY_PERSONAL_DETAILS;
        this.documentTransactionType = this.isSaudiPerson ? this.isChangePassport ? DocumentTransactionTypeEnum.MODIFY_PASSPORT_DETAILS_SAUDI
          : DocumentTransactionTypeEnum.MODIFY_PERSONAL_DETAILS_SAUDI : this.isChangePassport ? DocumentTransactionTypeEnum.MODIFY_PASSPORT_DETAILS_NON_SAUDI
          : DocumentTransactionTypeEnum.MODIFY_PERSONAL_DETAILS_NON_SAUDI

        // this.documentTransactionType = this.isSaudiPerson
        //   ? DocumentTransactionTypeEnum.MODIFY_PERSONAL_DETAILS_SAUDI
        //   : DocumentTransactionTypeEnum.MODIFY_PERSONAL_DETAILS_NON_SAUDI;
        this.documentTransactionId = TransactionId.MODIFY_PERSONAL_DETAILS;
        this.getRequiredDocument(this.documentTransactionKey, this.documentTransactionType, true);
        this.navigateToNextTab();
      }
      this.contributorDetails = contributorDetails;
      if (this.docUploaded) this.contributorDetails = { ...this.contributorDetails, uuid: this.uuid };
    }
  }

  showMandatoryAlert(boolVar) {
    if (boolVar == true) {
      this.showAlert = true;
      this.alertService.showMandatoryErrorMessage();
    }
  }

  selectSomeProperties1(contributorDetails) {
    return Object.keys(contributorDetails).reduce(function (obj, k) {
      if (['name'].includes(k)) {
        obj[k] = contributorDetails[k];
      }
      return obj;
    }, {});
  }

  selectSomeProperties2(contributorDetails) {
    return Object.keys(contributorDetails).reduce(function (obj, k) {
      if (['addresses', 'currentMailingAddress'].includes(k)) {
        obj[k] = contributorDetails[k];
      }
      return obj;
    }, {});
  }

  /** Method to get required document list. */
  getRequiredDocument(transactionId: string, transactionType: string, isRefreshRequired = false) {
    this.documentService.getRequiredDocuments(transactionId, transactionType).subscribe(res => {
      this.documents = res;
      if (isRefreshRequired)
        this.documents.forEach(doc => {
          this.refreshDocumentItem(doc);
        });
    });
  }
  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          // doc,
          // this.referenceNo,
          // this.documentTransactionType,
          // this.documentTransactionType
          doc,
          this.registrationNo,
          this.documentTransactionKey,
          this.documentTransactionType,
          this.referenceNo,
          null,
          this.uuid
        )
        .subscribe(res => {
          doc = res;
          doc.uuid = this.uuid;
          this.contributorDetails = { ...this.contributorDetails, uuid: this.uuid };
        });
    }
  }

  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  confirmCancel() {
    this.cancelAddedIndividual();
    this.modalRef.hide();
  }
  /**
   * This method is to decline cancellation of transaction
   * @memberof ContributorPersonalDetailsDcComponent
   */
  decline() {
    this.modalRef.hide();
  }

  cancelAddedIndividual() {
    this.alertService.clearAlerts();
    // this.changePersonService.revertUpdatePersonDetails(this._personId, this.referenceNo).subscribe(
    //   () => this.router.navigate([`/home/profile/individual/internal/${this.personId}/personal-details`]),
    //   err => { this.showErrorMessage(err); })
    this.router.navigate([`/home/profile/individual/internal/${this.personId}/personal-details`]);
  }

  onSubmitDocuments() {
    if (this.checkMandatoryDocs()) {
      this.changePersonService.finalSubmitPersonDetails(this._personId, this.referenceNo).subscribe(res => {
        this.lang == 'en'
          ? this.alertService.showSuccessByKey(res.bilingualMessage.english + ' with ID ' + res.referenceNo, null, 5)
          : this.alertService.showSuccessByKey(res.bilingualMessage.arabic + ' with ID ' + res.referenceNo, null, 5);
        this.router.navigate([`/home/profile/individual/internal/${this.personId}/personal-details`]);
      });
    } else {
      this.showAlert = true;
      this.showMandatoryAlert(true);
    }
  }
  submit() {
    if (this.checkMandatoryDocs()) {
      if (this.page === RecalculationConstants.PERSONAL) {
        this.changePersonService.submitPersonalDetails(this._personId, this.contributorDetails).subscribe(res => {
          this.setSuccess(res);
        });
      } else if (this.page === RecalculationConstants.ADD_FAMILY) {
        this.changePersonService.submitFamilyAddressDetails(this.identifier, this.contributorDetails).subscribe(
          res => {
            this.setSuccess(res);
          },
          err => {
            this.showAlert = true;
            this.showErrorMessage(err);
          }
        );
      } else if (this.page === RecalculationConstants.MODIFY_FAMILY) {
        this.changePersonService
          .modifyFamilyAddressDetails(this.identifier, this.acqId, this.contributorDetails)
          .subscribe(
            res => {
              this.setSuccess(res);
            },
            err => {
              this.showAlert = true;
              this.showErrorMessage(err);
            }
          );
      }
    } else {
      this.showAlert = true;
      this.showMandatoryAlert(true);
    }
  }
  setSuccess(res) {
    this.showAlert = true;
    if (res.message != 'Person details updated successfully') {
      this.message.english = `Family Details updated successfully. Transaction number : ${res.referenceNo}`;
      this.message.arabic = `تم تحديث عنوان العائلة بنجاح. رقم العملية : ${res.referenceNo}`;
    } else {
      this.message.english = `Person Details updated successfully. Transaction number : ${res.referenceNo}`;
      this.message.arabic = `تم تحديث البيانات الشخصية بنجاح. رقم العملية : ${res.referenceNo}`;
    }

    setTimeout(() => this.alertService.showSuccess(this.message, null, 10), 1000);
    this.router.navigate([`/home/profile/individual/internal/${this.personId}/personal-details`]);
  }
  /**
   * Method to get all documents
   */
  // getDocuments() {
  //   this.documentService
  //     .getDocuments(
  //       this.documentTransactionKey,
  //       this.documentTransactionType,
  //       this.registrationNo,
  //       this.referenceNo,
  //       null,
  //       this.referenceNo ? null : this.uuid
  //     )
  //     .subscribe(res => this.performInitialDocumentValidations(res));
  // }

  /**
   * Initialise documents with necessary validations
   * @param documents
   */
  performInitialDocumentValidations(documents: DocumentItem[]) {
    // this.basicDetailsDocuments = documents;
    // this.hasCrn = hasCrn(this.establishmentToChange);
    // const hasLicense = this.establishmentToChange?.license?.number ? true : false;
    // const isFieldOfficeTransaction = this.isValidator
    //   ? this.estRouterData?.channel === Channel.FIELD_OFFICE
    //   : this.appToken === ApplicationTypeEnum.PRIVATE;
    // handleBasicDetailsDocuments(
    //   this.basicDetailsDocuments,
    //   this.isGcc,
    //   isFieldOfficeTransaction,
    //   this.hasCrn,
    //   hasLicense
    // );
  }

  /**
   * Method to get the document content
   * @param document
   */
  refreshDocumentItem(document: DocumentItem) {
    this.documentService
      .refreshDocument(
        document,
        this.registrationNo,
        this.documentTransactionKey,
        this.documentTransactionType,
        this.referenceNo,
        null,
        this.referenceNo ? undefined : this.uuid
      )
      .subscribe(res => {
        document = res;
        document.uuid = this.uuid;
      });
  }

  /** Method to check whether mandatory documents are scanned or not. */
  checkMandatoryDocs() {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }

  clearAlert() {
    this.alertService.clearAlerts();
  }
  setUuid(isUploadSuccess) {
    if (isUploadSuccess) {
      this.docUploaded = true;
      this.contributorDetails = { ...this.contributorDetails, uuid: this.uuid };
    }
  }

  deleteUuid(isDeletionSuccess) {
    if (isDeletionSuccess) {
      this.docUploaded = false;
      this.uuid = null;
      this.contributorDetails = { ...this.contributorDetails, uuid: this.uuid };
    }
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
}
