/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  LookupService,
  LovList,
  Role,
  Person,
  scrollToTop,
  StorageService,
  WorkflowService,
  CoreBenefitService,
  Lov
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  AddEstablishmentService,
  DocumentTransactionIdEnum,
  EmployeeDetailsDcComponent,
  EstablishmentAdminService,
  EstablishmentConstants,
  EstablishmentDetailsFormDCComponent,
  EstablishmentOwnersDcComponent,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  getAddEstablishmentWizard,
  isGccEstablishment,
  isLawTypeCivil,
  isOrgOrSociety,
  isTransactionDraft,
  LegalEntityEnum,
  OrganisationTypeEnum,
  PaymentDetailsDcComponent,
  ScanDocumentsDcComponent,
  SearchEmployeeDcComponent,
  selectWizard
} from '../../../shared';
import { AddEstablishmentSCBaseComponent } from '../../../shared/base';
import { initialiseStateForEdit } from './register-establishment-helper';

/**
 * This is the smart component to handle the add establishment functionality.
 *
 * @export
 * @class RegisterEstablishmentScComponent
 * @extends {AddEstablishmentSCBaseComponent}
 */
@Component({
  selector: 'est-register-establishment-sc',
  templateUrl: './register-establishment-sc.component.html',
  styleUrls: ['./register-establishment-sc.component.scss']
})
export class RegisterEstablishmentScComponent extends AddEstablishmentSCBaseComponent implements OnInit, OnDestroy {
  //Local Variables
  comments: string;
  isOrgGcc = false;
  isCivilLaw = false;
  filteredCountryList$: Observable<LovList> = of(null);
  lawTypeList$: Observable<LovList>;
  roleEnum = Role;
  /**
   * Total tabs including search and feedback;
   * Total wizards should exclude search and feedback
   */
  currentTab = 0;

  @ViewChild('addEstablishmentTabs', { static: false })
  addEstablishmentTabs: TabsetComponent;
  @ViewChild('establishmentDetailsComp', { static: false })
  establishmentDetailsComp: EstablishmentDetailsFormDCComponent;
  @ViewChild('paymentDetailsComp', { static: false })
  paymentDetailsComp: PaymentDetailsDcComponent;
  @ViewChild('searchAdminComponent', { static: false })
  searchAdminComponent: SearchEmployeeDcComponent;
  @ViewChild('ownerComponent', { static: false })
  ownerComponent: EstablishmentOwnersDcComponent;
  @ViewChild('establishmentAdminComp', { static: false })
  establishmentAdminComp: EmployeeDetailsDcComponent;
  @ViewChild('scanDocsComp', { static: false })
  scanDocsComp: ScanDocumentsDcComponent;
  @ViewChild('addEstWizard', { static: false })
  addEstWizard: ProgressWizardDcComponent;
  @ViewChild('cancelTemplate', { static: false })
  cancelTemp: TemplateRef<HTMLElement>;
  hasInitialised = false;
  triggerRestrictions = false;
  setOwnerDetails(persons: Person[]) {
    throw new Error('Method not implemented.' + persons);
  }

  /**
   * Creates an instance of AddEstablishmentComponent.
   *
   * @param addEstablishmentService
   * @param documentService
   * @param establishmentAdminService
   * @param lookupService
   * @param storageService
   * @param language
   * @param environment
   */
  constructor(
    readonly establishmentService: EstablishmentService,
    addEstablishmentService: AddEstablishmentService,
    documentService: DocumentService,
    establishmentAdminService: EstablishmentAdminService,
    lookupService: LookupService,
    storageService: StorageService,
    alertService: AlertService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly location: Location,
    readonly coreBenefitService: CoreBenefitService
  ) {
    super(
      establishmentService,
      addEstablishmentService,
      establishmentAdminService,
      lookupService,
      storageService,
      documentService,
      alertService,
      language,
      estRouterData,
      workflowService,
      modalService,
      location,
      router,
      coreBenefitService
    );
  }

  verifyBirthDate() {
    throw new Error('Method not implemented.');
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof RegisterEstablishmentScComponent
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    this.editEstablishment = false;
    super.ngOnInit();
    if (isTransactionDraft(this.estRouterData, DocumentTransactionIdEnum.REG_ESTABLISHMENT)) {
      this.intialiseForToken(true);
    } else if (this.estRouterData.registrationNo && this.estRouterData.tabIndicator !== undefined) {
      this.intialiseForToken();
      this.setComments(this.estRouterData);
    } else if (this.addEstablishmentService.verifiedEstablishment) {
      this.initialiseForVerifiedEstablishment(this.addEstablishmentService.verifiedEstablishment);
    } else if (this.editEstablishment === false && this.isResumeFromDraft === false && this.hasInitialised === false) {
      this.setTransactionComplete();
      this.router.navigate([EstablishmentRoutesEnum.VERIFY_REG_ESTABLISHMENT]);
    }
    this.lawTypeList$ = this.lookUpService.getLawTypeList();
  }

  filterGccCountries(establishment: Establishment) {
    if (isGccEstablishment(establishment)) {
      this.filteredCountryList$ = this.gccCountryList$.pipe(
        map(
          list =>
            new LovList(
              list.items.filter(item => item.value.english === establishment.gccEstablishment.country.english)
            )
        )
      );
    }
  }

  /**
   * Intiailse the state with the token
   */
  intialiseForToken(isDraft = false) {
    this.editEstablishment = !isDraft;
    this.isResumeFromDraft = isDraft;
    this.referenceNo = this.estRouterData.referenceNo;
    this.currentTab = Number(this.estRouterData?.tabIndicator);
    if(isDraft)
    { this.currentTab = 0; }
    this.totalTabs = EstablishmentConstants.TABS_NO_WITH_ADMIN;
    this.establishmentService.getEstablishment(this.estRouterData?.registrationNo).subscribe(
      res => {
        this.gccBankNameList$ = this.lookUpService.getGCCBankList(EstablishmentConstants.GCC_BANK(res), true);
        if (res) {
          this.filterGccCountries(res);
          initialiseStateForEdit(res, this.currentTab, this).subscribe(() => {
            this.triggerRestrictions = true;
          });
          this.setValues();
         }
      },
      err => {
        if (err) {
          this.showErrorMessage(err);
        }
      }
    );
  }

  /**
   * Initialise the state with verified establishment
   */
  initialiseForVerifiedEstablishment(establishment: Establishment) {
    this.establishment = establishment;
    this.gccBankNameList$ = this.lookUpService.getGCCBankList(
      EstablishmentConstants.GCC_BANK(this.establishment),
      true
    );
    this.filterGccCountries(establishment);
    if (this.establishment.gccCountry === true) {
      this.gccEstablishment = true;
      this.addEstWizardItems = getAddEstablishmentWizard(
        OrganisationTypeEnum.GCC,
        this.establishment?.legalEntity?.english
      );
      this.totalTabs = EstablishmentConstants.TABS_WITH_OWNER_GCC;
      if (isOrgOrSociety(this.establishment)) {
        this.isOrgGcc = true;
        this.totalTabs = EstablishmentConstants.TABS_WITH_PAYMENT_GCC;
      }
      // Code has to be rephrased
      if (isLawTypeCivil(this.establishment) && isGccEstablishment(this.establishment)) {
        this.isCivilLaw = true;
        this.totalTabs = EstablishmentConstants.TABS_WITH_PAYMENT_GCC;
      }
      if (isLawTypeCivil(this.establishment) && !isGccEstablishment(this.establishment)) {
        this.isCivilLaw = true;
        this.totalTabs = EstablishmentConstants.TABS_WITHOUT_OWNER_PAYMENT;
      }
    } else {
      if (
        this.establishment.establishmentType.english === EstablishmentTypeEnum.BRANCH &&
        this.addEstablishmentService.hasAdminForMain === true
      ) {
        this.hasAdmin = true;
        this.addEstWizardItems = getAddEstablishmentWizard('hasAdmin');
        this.totalTabs = EstablishmentConstants.TABS_NO_WITHOUT_ADMIN;
      } else {
        this.addEstWizardItems = getAddEstablishmentWizard();
      }
      if (this.establishment.legalEntity.english === LegalEntityEnum.ORG_REGIONAL) {
        this.isInternational = true;
      }
    }
    if (establishment.legalEntity.english === LegalEntityEnum.INDIVIDUAL) {
      this.isIndividual = true;
    }
    this.verifyEstStatus = true;
    this.addEstWizardItems[0].isActive = true;
    this.addEstWizardItems[0].isDisabled = false;
    this.hasInitialised = true;
    this.triggerRestrictions = true;
  }
  setValues() {
    this.isAccountSaved = true;
    this.isSaved = true;
  }
  /**
   * This method is used to check the validity and save the establishment details
   * @param establishmentDetails
   */
  saveEstablishment(establishmentDetails) {
    if (this.establishmentDetailsComp && this.establishmentDetailsComp.isValidForm()) {
      super.saveEstablishment(establishmentDetails);
    } else {
      this.triggerFormValidation();
    }
    if (this.estRouterData.assignedRole === this.roleEnum.VALIDATOR_1) {
      if (this.establishment?.gccCountry === true) {
        this.gccEstablishment = true;
        this.addEstWizardItems = getAddEstablishmentWizard(
          OrganisationTypeEnum.GCC,
          establishmentDetails?.establishmentDetails?.legalEntity?.english
        );
        this.totalTabs = EstablishmentConstants.TABS_WITH_OWNER_GCC;
        if (isOrgOrSociety(establishmentDetails?.establishmentDetails)) {
          this.isOrgGcc = true;
          this.totalTabs = EstablishmentConstants.TABS_WITH_PAYMENT_GCC;
        } else {
          this.isOrgGcc = false;
        }
        if (isLawTypeCivil(establishmentDetails?.establishmentDetails)) {
          this.isCivilLaw = true;
          this.totalTabs = EstablishmentConstants.TABS_WITH_PAYMENT_GCC;
          this.ownerIsAdmin = false;
        } else {
          this.isCivilLaw = false;
        }
      }
    }
  }
  submitDocument(comments: { comments: string }) {
    super.submitDocument(comments);
  }
  /**
   * This method is used to check the validity and save the payment details
   * @param paymentDetails
   */
  savePaymentDetails(paymentDetails) {
    if (this.paymentDetailsComp && this.paymentDetailsComp.isFormsValid()) {
      super.savePaymentDetails(paymentDetails);
    } else {
      this.triggerFormValidation();
    }
  }
  /**
   * Clear any alert and save the owners
   * @param owner
   */
  verifyOwner(owner) {
    this.alertService.clearAlerts();
    if (owner && owner.ownerFormDetails) {
      super.verifyOwner(owner.ownerFormDetails, owner.index);
    }
  }
  /**
   * This method is to set the submitted as false
   * @param index
   */
  setSubmittedFalse(index) {
    this.ownerComponent.employeeComponent.some((person, indexPerson) => {
      if (index === indexPerson) {
        person.submitted = false;
        return true;
      }
      return false;
    });
  }
  /**
   *This method is used to check the validity and verify the admin details
   * @param adminFormDetails
   */
  verifyAdmin(adminFormDetails) {
    if (
      this.searchAdminComponent &&
      this.searchAdminComponent.verifyPersonForm &&
      this.searchAdminComponent.verifyPersonForm.valid
    ) {
      super.verifyAdmin(adminFormDetails);
    } else {
      this.triggerFormValidation();
    }
  }
  /**
   * this method is used to filter the Legal Entities corresponding to the establishment Type
   * @param establishmentType
   * @memberof AddEstablishmentSCBaseComponent
   */
  selectOrganizationType(establishmentType: string) {
    this.alertService.clearAlerts();
    this.legalEntityList$ = this.organistaionTypeList$.pipe(
      map(data => data?.items?.filter((lov: Lov) => lov?.value?.english === establishmentType)[0]),
      filter(res => (res ? true : false)),
      map(res => res?.items)
    );
  }

  filterLegalEntityByLawType(establishmentType: string) {
    this.legalEntityList$ = this.lookUpService?.getOrganistaionTypeList().pipe(
      map(lovList => lovList?.items),
      map(data => data?.filter((lov: Lov) => lov?.value?.english === establishmentType)[0]),
      filter(res => (res ? true : false)),
      map(data =>
        establishmentType === OrganisationTypeEnum.GCC
          ? data.items.filter(
            eachItem =>
              eachItem?.value?.english !== LegalEntityEnum.GOVERNMENT &&
              eachItem?.value?.english !== LegalEntityEnum.SEMI_GOV
          )
          : data.items
      ),
      filter(res => (res ? true : false)),
      map(res => res)
    );
  }

  /**
   * This method is used to check the validity and save the admin details
   * @param adminDetails
   */
  saveEstablishmentAdminDetails(adminDetails) {
    if (this.establishmentAdminComp && this.establishmentAdminComp.isFormValid()) {
      super.saveEstablishmentAdminDetails(adminDetails);
    } else {
      this.triggerFormValidation();
    }
  }
  //This method is to trigger the error if the form in invalid
  triggerFormValidation() {
    this.alertService.showMandatoryErrorMessage();
  }
  /**
   * This method is to trigger the error if the owner is not saved
   */
  triggerOwnerValidation() {
    this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.SAVE-OWNER');
  }
  /**
   * This method is to navigate to the next tab
   */
  nextForm() {
    this.alertService.clearAlerts();
    if (this.addEstWizardItems && this.addEstWizardItems.length > 0) {
      if (this.addEstWizard) {
        // this.addEstWizard.setNextItem(this.currentTab+1);
        this.addEstWizardItems = selectWizard(this.addEstWizardItems, this.currentTab + 1);
      }
    }
    if (this.currentTab + 1 === this.totalTabs - 2) {
      this.documentList$ = this.getDocumentList();
    }
    if (this.currentTab < this.totalTabs) {
      this.currentTab += 1;
    }
    scrollToTop();
  }
  /**
   * This method is to navigate to previous tab
   */
  previousForm() {
    this.alertService.clearAlerts();
    this.currentTab--;
    if (this.addEstWizardItems && this.addEstWizardItems.length > 0) {
      if (this.addEstWizard) {
        this.addEstWizard.setPreviousItem(this.currentTab);
      }
    }
    scrollToTop();
  }
  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  //This method is to reset to the first form
  resetToFirstForm() {
    this.currentTab = 0;
  }
  //This method is to navigate to the final form
  finalForm() {
    this.currentTab = this.totalTabs - 1;
  }
  //This method is to cancel form
  cancelForm() {
    this.alertService.clearAlerts();
    if (this.establishment.registrationNo) {
      this.addEstablishmentService.cancelTransaction(this.establishment.registrationNo).subscribe(
        () => {
          if ((this.editEstablishment) && this.establishment) {
            this.completeTransaction(
              this.reRoute ? this.reRoute : EstablishmentRoutesEnum.VALIDATOR_REGISTER_ESTABLISHMENT
            );
          } else {
            this.completeTransaction(this.reRoute ? this.reRoute : EstablishmentRoutesEnum.VERIFY_REG_ESTABLISHMENT);
          }
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    } else {
      this.completeTransaction(this.reRoute ? this.reRoute : EstablishmentRoutesEnum.VERIFY_REG_ESTABLISHMENT);
    }
  }
  /**
   * Method to complete the transaction and navigate
   * @param route
   */
  completeTransaction(route: string) {
    this.hideModal();
    this.setTransactionComplete();
    if (route) {
      this.router.navigate([route]);
    }
  }
  //This method is used to reset all the forms
  resetAllForms() {
    this.resetAdminForm();
    this.resetVerifyAdminForm();
    this.resetEstablishmentsForm();
    this.resetPaymentForm();
    this.resetScanDocumentForm();
    this.reset();
    this.resetAllOwnerDetails();
  }
  //This method is used to reset owner details
  resetAllOwnerDetails() {
    for (let i = 0; i < this.establishmentOwner.persons.length; i++) {
      this.resetOwnerForm(i);
    }
    if (this.ownerComponent) {
      this.ownerComponent.createPersonForm();
    }
  }
  //This is used when the cancel button is clicked and to reset form details.
  reset() {
    this.isAccountSaved = false;
    this.isSaved = false;
    this.isSubmit = false;
  }
  //This method is to reset the Admin Details Form
  resetAdminForm() {
    if (this.establishmentAdminComp && this.establishmentAdminComp.personForm) {
      this.establishmentAdminComp.resetPersonDetailsForm();
      this.verifyAdminStatus = false;
    }
  }
  //This method is to reset the Admin Details Form
  resetVerifyAdminForm() {
    if (this.searchAdminComponent && this.searchAdminComponent.verifyPersonForm) {
      this.searchAdminComponent.submitted = false;
      this.searchAdminComponent.resetSearchPersonForm();
    }
  }
  //This method is to reset the Establihsment Details Form
  resetEstablishmentsForm() {
    if (this.establishmentDetailsComp && this.establishmentDetailsComp.establishmentDetailsForm) {
      this.establishmentDetailsComp.resetEstablishmentDetailsForm();
    }
  }
  // This method is to reset the Establihsment Details Form
  resetPaymentForm() {
    if (this.paymentDetailsComp && this.paymentDetailsComp.paymentDetailsForm) {
      this.paymentDetailsComp.resetPaymentDetailsForm();
      this.paymentDetailsComp.createPaymentDetailsForm();
    }
  }
  //This method is to reset the owner Details Form
  resetOwnerForm(index: number) {
    if (this.ownerComponent) {
      this.ownerComponent.resetOwnerForm(index);
    }
  }
  //This method is to reset the verify establishment Form
  resetScanDocumentForm() {
    this.alertService.clearAlerts();
    if (this.scanDocsComp) {
      this.scanDocsComp.resetDocuments();
    }
  }
  //This method is to restrict progress bar while editing on previous section
  restrictProgressBar() {
    if (this.triggerRestrictions === true) {
      this.addEstablishmentService.restrictProgress(this.currentTab, this.addEstWizardItems);
    }
  }

  ngOnDestroy() {
    this.establishment = undefined;
    this.alertService.clearAllErrorAlerts();
    super.ngOnDestroy();
  }
  askForCancel() {
    this.showModal(this.cancelTemp);
  }

  // function to keep transaction on draft status to resume later
  onKeepDraft(){
    this.alertService.clearAlerts();
    this.hideModal();
    this.setTransactionComplete();
    this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
  }
}
