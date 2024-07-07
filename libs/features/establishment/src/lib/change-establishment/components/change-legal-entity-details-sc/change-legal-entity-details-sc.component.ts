/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Channel,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  LookupService,
  LovList,
  MainEstablishmentInfo,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  TransactionService,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  ActionTypeEnum,
  CURRENT_OWNER_LOV_VALUE,
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstLookupService,
  EstablishmentConstants,
  EstablishmentService,
  LegalEntityEnum,
  NEW_OWNER_LOV_VALUE,
  Owner,
  activateWizard,
  getLegalEntityWizards,
  hasCrn,
  hasUnn,
  isEstablishmentTokenValid,
  isGccEstablishment,
  isLegalEntityPartnership,
  isPpaEstablishment,
  // isPpaEstablishment,
  isTransactionDraft,
  mciEstablishment,
  resetOwner
} from '../../../shared';
import {
  assembleFormToOwner,
  createOwnerForm,
  searchWithOwnerNameOrIdentifier,
  updateDatesOfOwner
} from '../change-owner-sc/owner-helper';
import {
  cancelLegalEntity,
  fetchEstablishment,
  getMciResponse,
  getOwnersForLegalEntity,
  initialiseLookUpsForLegalEntity,
  saveAndNextLegalEntity,
  saveOwnerForLegalEntity,
  submitLegalEntity,
  submitLegalEntityDirectChange,
  verifyOwnerForLegalEntity
} from './change-legal-entity-api-helper';
import {
  createLegalEntityDetailsForm,
  createOwnerSelectionForm,
  defaultNationality,
  patchLegalEntityForm,
  setPayment
} from './change-legal-entity-form';
import {
  NO,
  handleInitialValidations,
  handleLegalDocuments,
  initialiseBooleanStates,
  initialiseForEdit,
  setStateToIndividual,
  setStateToPartnership,
  setStatetoGovLE,
  showDeleteOwnerInfo,
  showMofSelfInfo
} from './change-legal-entity-helper';
@Component({
  selector: 'est-change-legal-entity-details-sc',
  templateUrl: './change-legal-entity-details-sc.component.html',
  styleUrls: ['./change-legal-entity-details-sc.component.scss']
})
export class ChangeLegalEntityDetailsScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit
{
  readonly currentOwnerSelection: string = CURRENT_OWNER_LOV_VALUE.english;
  readonly createOwnerSelection: string = NEW_OWNER_LOV_VALUE.english;
  readonly individual: string = LegalEntityEnum.INDIVIDUAL;
  currentTab = 0;
  accordionPanel = 0;
  disabledNationality = false;
  documentType = DocumentTransactionTypeEnum.CHANGE_LEGAL_ENTITY;
  currentLegalEntity: string; //Carries the legal entity before change legal entity transaction
  establishment: Establishment;
  goBackRouter;
  infoKey: string;
  searchValue: string;
  deleteInactiveOwnerKey = 'ESTABLISHMENT.INFO.DELETE-INACTIVE-OWNERS';
  isLegalEntityChanged = false;
  isPaymentDisabled = false;
  isValidator = false;
  isEstGcc = false;
  isPpa = false;
  legalEntityForm: FormGroup;
  ownerSelectionForm: FormGroup;
  legalEntityDocuments: DocumentItem[];
  legalEntityDropDown$: Observable<LovList>;
  legalEntityTabWizards: WizardItem[];
  mainEstablishment: MainEstablishmentInfo;
  nationalityList$: Observable<LovList>;
  ownerSectionList: LovList;
  owners: Owner[] = [];
  currentOwners: Owner[] = [];
  filteredOwners: Owner[];
  personOwner: Owner[] = [];
  estOwner: Array<Owner> = [];
  showContribution = false;
  showInfo = false;
  showNationality = false;

  showOwnerSection = false;
  canAddOwner = true;
  canChoseOwnerSection = false;
  transactionFeedback: TransactionFeedback;
  transactionId = DocumentTransactionIdEnum.CHANGE_LEGAL_ENTITY;
  yesOrNoList$: Observable<LovList>;
  _ownerFormArray = new FormArray([]);
  gccCountryList$: Observable<LovList>;
  genderList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  showStartDate = false;
  showEndDate = false;
  initialPaymentType: string;
  estBeforeEdit: Establishment;
  estStartDate: Date;
  itemsPerPage = 5;
  currentPage = 1;
  isReEnter = false;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  hasLicense = false;
  hasCrn = false;
  hasUnn = false;
  showLateFeeIndicator: boolean;
  referenceNo: number;
  isFO: boolean;
  initialLateFee: string;
  isCrnFetchedFromMci?: boolean;
  isMcifetched: boolean;
  isReopened: boolean = false;
  showSaveButton:boolean=true;
  payload;
  taskId:string;
  isGOL: boolean = false;
  get selectedLegalEntity(): string {
    return this.legalEntityForm?.get('legalEntity')?.get('english')?.value ?? '';
  }
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  constructor(
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly establishmentService: EstablishmentService,
    readonly lookUpService: LookupService,
    readonly estLookUpService: EstLookupService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly fb: FormBuilder,
    readonly bsModalService: BsModalService,
    readonly workflowService: WorkflowService,
    @Inject(EstablishmentToken) readonly estToken: EstablishmentRouterData,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly location: Location,
    readonly router: Router,
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
  ngOnInit(): void {
    initialiseLookUpsForLegalEntity(this);
    this.ownerSelectionForm = createOwnerSelectionForm(this);
    this.legalEntityForm = createLegalEntityDetailsForm(this);
    if (isTransactionDraft(this.estToken, DocumentTransactionIdEnum.CHANGE_LEGAL_ENTITY)) {
      initialiseForEdit(this, this.estToken, true);
      this.isFO = this.estToken.channel === Channel.FIELD_OFFICE;
    } else if (isEstablishmentTokenValid(this.estToken, RouterConstants.TRANSACTION_CHANGE_LEGAL_ENTITY)) {
      initialiseForEdit(this, this.estToken);
      this.isFO = this.estToken.channel === Channel.FIELD_OFFICE;
    } else if (this.changeEstablishmentService.selectedRegistrationNo) {
      this.isFO = this.appToken === ApplicationTypeEnum.PRIVATE;
      this.chooseOwnerSection(this.currentOwnerSelection);

      this.fetchInitialData(
        this.changeEstablishmentService.selectedRegistrationNo,
        this.changeEstablishmentService.establishmentProfile?.noOfBranches
      )
        .pipe(
          tap(() => {
            this.currentLegalEntity = this.establishment.legalEntity.english;
            this.initialPaymentType = this.establishment.establishmentAccount?.paymentType?.english;
            this.initialLateFee = this.establishment.establishmentAccount?.lateFeeIndicator?.english;
            this.initialiseTabWizards(this.currentTab, this.isDocsRequired(this.currentLegalEntity));
          }),
          switchMap(() => {
            if (
              isLegalEntityPartnership(this.currentLegalEntity) ||
              this.currentLegalEntity === LegalEntityEnum.INDIVIDUAL
            ) {
              return getOwnersForLegalEntity(this, this.establishment);
            } else {
              return of(null);
            }
          })
        )
        .subscribe(noop);
    } else {
      this.changeEstablishmentService.navigateToSearch();
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
  // Method to fetch the data for view
  fetchInitialData(registrationNo: number, noOfBranches: number, referenceNo?: number): Observable<Establishment> {
    this.goBackRouter = EstablishmentConstants.EST_PROFILE_ROUTE(registrationNo);
    return fetchEstablishment(this, registrationNo, referenceNo).pipe(
      takeUntil(this.destroy$),
      tap(response => {
        this.establishment = response;
        this.mainEstablishment = this.estBeforeEdit?.mainEstablishment;
        this.isEstGcc = isGccEstablishment(this.establishment);

        this.isPpa = isPpaEstablishment(this.establishment);
        this.hasCrn = hasCrn(this.establishment);
        this.hasLicense = this.establishment?.license?.number ? true : false;
        this.hasUnn = hasUnn(this.establishment);
        this.isMciEstablishment = mciEstablishment(this.establishment);
        if (this.isMciEstablishment) {
          this.fetchEstablishmentCRN(
            this.establishment?.crn?.number?.toString(),
            registrationNo,
            this.establishment?.unifiedNationalNumber?.toString()
          );
        }
        this.estOwners(registrationNo);
        patchLegalEntityForm(this.establishment, this.legalEntityForm);
        handleInitialValidations(this, this.establishment, this.mainEstablishment, noOfBranches);
      })
    );
  }
  // Method to keep track of legal entity changes
  changeLegalEntity(
    previousLegalEntity: string,
    legalEntity: string,
    nationality: string,
    paymentType: string,
    estStartDate: Date,
    lateFeeIndicator: string
  ): void {
    initialiseBooleanStates(this);
    if (legalEntity === previousLegalEntity) {
      this.isLegalEntityChanged = false;
      if (this.isDocsRequired(legalEntity)) {
        this.legalEntityTabWizards[1].isDisabled = true;
      }
      this.legalEntityTabWizards[1].isDisabled = true;
      this.legalEntityTabWizards[0].isDone = false;
    } else {
      this.isLegalEntityChanged = true;
      switch (legalEntity) {
        case LegalEntityEnum.GOVERNMENT:
        case LegalEntityEnum.SEMI_GOV: {
          setStatetoGovLE(this, previousLegalEntity, paymentType, lateFeeIndicator);
          break;
        }
        case LegalEntityEnum.ORG_REGIONAL:
        case LegalEntityEnum.SOCIETY: {
          showDeleteOwnerInfo(this, previousLegalEntity);
          if (previousLegalEntity === LegalEntityEnum.GOVERNMENT || previousLegalEntity === LegalEntityEnum.SEMI_GOV) {
            showMofSelfInfo(this);
            defaultNationality(this, false, nationality);
            setPayment(this, NO, false, true);
            this.legalEntityForm.updateValueAndValidity();
          } else {
            setPayment(this, null, false, false);
          }
          break;
        }
        case LegalEntityEnum.INDIVIDUAL: {
          setStateToIndividual(this, previousLegalEntity, nationality);
          break;
        }
        default: {
          if (legalEntity && isLegalEntityPartnership(legalEntity)) {
            setStateToPartnership(this, estStartDate, previousLegalEntity, nationality);
          }
          break;
        }
      }
    }
    if (this.isDocsRequired(legalEntity)) {
      if (this.legalEntityTabWizards.length < 2) {
        this.initialiseTabWizards(this.currentTab, true);
      }
    } else {
      if (this.legalEntityTabWizards.length > 1) {
        this.initialiseTabWizards(this.currentTab, false);
      }
    }
  }

  // Method to submit the transaction
  submitTransaction(registrationNo: number) {
    submitLegalEntity(this, registrationNo).subscribe(noop, err => {
      this.alertService.showError(err?.error?.message);
    });
  }
  // Method to submit the transaction without docs
  submitTransactionWithoutDocs(registrationNo: number) {
    submitLegalEntityDirectChange(this, registrationNo).subscribe(noop, err => {
      this.alertService.showError(err?.error?.message);
    });
  }
  // Method to save legal entity
  saveLegalEntity(registrationNo: number) {
    saveAndNextLegalEntity(this, registrationNo).subscribe(noop, err => {
      this.alertService.showError(err?.error?.message, err?.error?.details);
    });
  }
  // Method to chose the owner from current or new owner
  chooseOwnerSection(type: string) {
    if (type === this.currentOwnerSelection) {
      if (this.ownerFormArray.length > 0) {
        this.deleteOwner(0);
      }
    } else if (type === this.createOwnerSelection) {
      this.splitOwners[0].forEach(owner => (owner.recordAction = ActionTypeEnum.REMOVE));
      this.enableAddOwner();
    }
  }
  // Method to set other owners as removed
  removeOtherOwners(owner: Owner): void {
    this.currentOwners.forEach(item => {
      if (
        item.startDate?.gregorian !== owner.startDate?.gregorian ||
        item.person?.personId !== owner.person?.personId ||
        item.endDate?.gregorian !== owner.endDate?.gregorian ||
        (item.estOwner !== null && item.estOwner?.estOwnerId !== owner.estOwner?.estOwnerId)
      ) {
        item.recordAction = ActionTypeEnum.REMOVE;
      }
    });
  }
  // Method to enable add owner
  enableAddOwner(): void {
    const isEstGcc = this.establishment.gccCountry;
    this.isReopened = this.establishment?.status?.english === EstablishmentStatusEnum.REOPEN ? true : false;
    const legalEntity = this.legalEntityForm.get('legalEntity')?.get('english')?.value;
    const noOfActiveOwner: number =
      this.splitOwners[0].filter(owner => owner.recordAction !== ActionTypeEnum.REMOVE).length +
      this.ownerFormArray.length;
    if (this.isMciEstablishment && this.establishment?.onePartner && isLegalEntityPartnership(legalEntity)) {
      this.canAddOwner = false;
    } else {
      if (isEstGcc && noOfActiveOwner >= 5 && isLegalEntityPartnership(legalEntity)) {
        this.canAddOwner = false;
      } else if (legalEntity === LegalEntityEnum.INDIVIDUAL && noOfActiveOwner >= 1) {
        this.canAddOwner = false;
      } else {
        this.canAddOwner = true;
      }
    }
  }
  // Method to split owners into active and inactive owners respectively
  get splitOwners(): [Owner[], Owner[]] {
    const activeOwners: Owner[] = [];
    const inactiveOwners: Owner[] = [];
    if (this.currentOwners) {
      return this.currentOwners.reduce(
        (result, owner) => {
          result[
            owner.endDate?.gregorian !== null && owner.endDate?.gregorian !== undefined // for inactive owners end date is not null
              ? 1
              : 0
          ].push(owner);
          return result;
        },
        [activeOwners, inactiveOwners]
      );
    } else {
      return [activeOwners, inactiveOwners];
    }
  }
  /******************** Owner Specific Functionalities ******************/
  //Verify Owner with database
  verifyOwner(index: number) {
    verifyOwnerForLegalEntity(this, index).subscribe();
  }
  //Reset the form details
  resetOwner(ownerIndex: number) {
    if (this.ownerFormArray[ownerIndex]) {
      resetOwner(this.owners[ownerIndex], this.ownerFormArray[ownerIndex]);
    }
  }
  //Method to check if all owners are saved
  hasAllOwnerSaved(formArray: FormGroup[]): boolean {
    return formArray.find(owner => {
      return owner?.get('isSaved')?.value === false;
    })
      ? false
      : true;
  }
  //Assemble form details into owner model
  assembleFormToOwner(owner: Owner, index: number): Owner {
    return assembleFormToOwner(owner, this.ownerFormArray[index], this.showStartDate);
  }
  //Method to save owner
  saveOwner(index: number) {
    saveOwnerForLegalEntity(this, index).subscribe(noop, err => {
      this.alertService.showError(err.error.message, err.error.details);
    });
  }
  //Method to delete the owner
  deleteOwner(index: number) {
    this.owners.splice(index, 1);
    this.ownerFormArray.splice(index, 1);
    this.enableAddOwner();
    if (this.bsModalRef) {
      this.hideModal();
    }
  }
  // Method to update the owner dates
  updateOwner(index: number) {
    this.alertService.clearAlerts();
    if (this.owners[index] && this.ownerFormArray[index]) {
      updateDatesOfOwner(this.owners[index], this.ownerFormArray[index]);
    }
  }
  // Method to add owner form
  addOwnerForm(): void {
    this._ownerFormArray.push(createOwnerForm());
  }
  // Method to add owner
  addOwner() {
    this.alertService.clearAlerts();
    this.addOwnerForm();
    this.owners.push(new Owner());
    this.selectPanel(true, this.owners.length);
    this.enableAddOwner();
  }
  // Method to open the owner accordion
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }
  get ownerFormArray(): FormGroup[] {
    if (this._ownerFormArray) {
      return this._ownerFormArray.controls as FormGroup[];
    }
  }
  // Initialise the tab wizard and make required tab active
  initialiseTabWizards(currentTab: number, isDocsRequired: boolean) {
    this.legalEntityTabWizards = getLegalEntityWizards(currentTab, isDocsRequired);
  }
  // Method to select the tab
  selectedWizard(tabIndex: number) {
    this.currentTab = tabIndex;
    this.legalEntityTabWizards = activateWizard(this.legalEntityTabWizards, tabIndex);
  }
  // Cancel the transaction and hide the modal
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelTransaction();
  }
  // Method to cancel the transaction
  cancelTransaction() {
    cancelLegalEntity(this).subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }
  // Method to activate the required page for pagination
  selectPage(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
  }
  //Method to Search For owners
  searchOwners(searchParam: string) {
    this.searchValue = searchParam;
    this.filteredOwners = searchWithOwnerNameOrIdentifier(this.currentOwners, searchParam);
    this.currentPage = this.pageDetails.currentPage = 0;
  }
  //Handle navigation before completing transaction
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
  // Method to change document validation
  changeLEDocumentValidation(isLeToPartnerShip: boolean, isMofPaying: boolean, isGovOfSemiGov: boolean) {
    const isFieldOfficeTransaction = this.isValidator
      ? this.estToken?.channel === Channel.FIELD_OFFICE
      : this.appToken === ApplicationTypeEnum.PRIVATE;
    handleLegalDocuments(
      this.legalEntityDocuments,
      this.isEstGcc,
      isFieldOfficeTransaction,
      this.showOwnerSection,
      this.hasCrn,
      this.hasLicense,
      isLeToPartnerShip,
      isMofPaying,
      isGovOfSemiGov,
      this.isPpa
    );
  }
  changeToGovOrSemiGov(selectedValue: string): boolean {
    return (
      this.currentLegalEntity !== LegalEntityEnum.GOVERNMENT &&
      this.currentLegalEntity !== LegalEntityEnum.SEMI_GOV &&
      (selectedValue === LegalEntityEnum.GOVERNMENT || selectedValue === LegalEntityEnum.SEMI_GOV)
    );
  }

  isDocsRequired(selectedValue: string): boolean {
    return (
      this.appToken === ApplicationTypeEnum.PRIVATE ||
      (this.appToken === ApplicationTypeEnum.PUBLIC &&
        (this.changeToGovOrSemiGov(selectedValue) ||
          !this.hasUnn ||
          this.isCrnFetchedFromMci === false ||
          !this.isMciEstablishment))
    );
  }

  fetchEstablishmentCRN(crn: string, registrationNo: number, unn: string) {
    if (!this.isDocsRequired(this.selectedLegalEntity)) {
      getMciResponse(this, crn, registrationNo, unn).subscribe(
        response => {
          this.isCrnFetchedFromMci = true;
          let crn = response?.crn;
          this.establishment.crn = crn;
          let mciEstablishment = { ...this.establishment };
          mciEstablishment.legalEntity = response?.legalEntity ?? this.establishment.legalEntity;
          patchLegalEntityForm(mciEstablishment, this.legalEntityForm);
          this.changeLegalEntity(
            this.establishment.legalEntity.english,
            mciEstablishment.legalEntity.english,
            this.establishment.nationalityCode.english,
            this.initialPaymentType,
            this.establishment?.startDate?.gregorian,
            this.initialLateFee
          );
        },
        err => {
          this.isCrnFetchedFromMci = false;
        }
      );
    }
  }

  estOwners(registrationNo: number) {
    this.changeEstablishmentService.getOwners(registrationNo).subscribe(
      response => {
        this.personOwner = response;
      },
      err => {
        if (err.error) {
          this.showErrorMessage(err);
        }
      }
    );
  }
}
