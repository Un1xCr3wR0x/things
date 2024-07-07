/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BorderNumber,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  GosiCalendar,
  IdentityTypeEnum,
  Iqama,
  LookupService,
  LovList,
  NIN,
  NationalId,
  Passport,
  Person,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  TransactionService,
  WizardItem,
  WorkflowService,
  bindToObject,
  markFormGroupTouched
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  ActionTypeEnum,
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  ErrorCodeEnum,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  FilterKeyValue,
  LegalEntityEnum,
  NavigationIndicatorEnum,
  Owner,
  activateWizard,
  compareIdNum,
  convertBilingualListToLovList,
  getChangeOwnerWizards,
  getChangeOwnerWizardsPartnership,
  isDocumentsValid,
  isEstablishmentTokenValid,
  isTransactionDraft,
  resetOwner
} from '../../../shared';
import {
  assembleFormToOwner,
  createOwnerForm,
  ownersAfterFilter,
  saveOwnerModifications,
  saveOwnerModificationsPartnership,
  searchWithOwnerNameOrIdentifier,
  setState,
  updateDatesOfOwner
} from './owner-helper';

@Component({
  selector: 'est-change-owner-sc',
  templateUrl: './change-owner-sc.component.html',
  styleUrls: ['./change-owner-sc.component.scss']
})
export class ChangeOwnerScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit, OnDestroy
{
  gccCountryList$: Observable<LovList>;
  genderList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  nationalityList$: Observable<LovList>;
  filterNationalityList$: Observable<LovList>;
  ownerDocuments: DocumentItem[];
  documentType = DocumentTransactionTypeEnum.CHANGE_OWNER;
  transactionId = DocumentTransactionIdEnum.CHANGE_OWNER;
  individualLegalEntity = LegalEntityEnum.INDIVIDUAL;
  establishment: Establishment;
  currentOwners: Owner[] = [];
  ownersBeforeChange: Owner[] = [];
  filteredOwners: Owner[] = [];
  transactionFeedback: TransactionFeedback;
  currentDate: Date = new Date();
  newOwners: Owner[] = [];
  ownerForm: FormGroup;
  _ownerFormArray: FormArray = new FormArray([]);
  accordionPanel = 0;
  estStartDate: Date;
  personOwnerBirthDate: Date = new Date();
  isEstGcc = false;
  showStartDate = false;
  showEndDate = false;
  isEndDateMandatory = false;
  isReEnter = false; // Validator or admin edit
  currentTab = 0;
  ownerWizards: WizardItem[];
  registrationNo: number;
  editedOwners: Owner[] = [];
  removedOwners: Owner[] = [];
  canDeleteOwner = true;
  itemsPerPage = 5;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  ownerFilters: FilterKeyValue[];
  searchText: string;
  hasLicense = false;
  hasCrn = false;
  hasUnn = false;
  isDraftTransaction = false;
  ownerListLabel: string;
  parentForm: FormArray = new FormArray([]);
  mciOwnerIds: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  isIndividualOrPartnership = false;
  private _mciError = false;
  showSaveButton:boolean=true;
  payload;
  taskId:string;
  isGOL: boolean = false;
  get mciError() {
    return this._mciError;
  }
  set mciError(value) {
    this._mciError = value;
    this.checkIfDirectChange();
  }
  isEligibleForDirectChange = false;
  isDirectChange = false;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  @ViewChild('draftTemplate', { static: true }) draftTemplate: TemplateRef<HTMLElement>;
  get ownerFormArray(): FormGroup[] {
    if (this._ownerFormArray) {
      return this._ownerFormArray.controls as FormGroup[];
    }
  }
  apiTriggered = false;
  message = {
    arabic: 'تم تعديل بيانات المالك بنجاح',
    english: 'Establishment owner details are successfully updated'
  };
  isOnePartner = false;
  isPartnershipLegalEntity = false;
  constructor(
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly lookupService: LookupService,
    readonly bsModalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    @Inject(EstablishmentToken) readonly estToken: EstablishmentRouterData,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appType: string,
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
    if (isTransactionDraft(this.estToken, DocumentTransactionIdEnum.CHANGE_OWNER)) {
      this.isDraftTransaction = true;
      this.initialiseForEdit(this.estToken);
    } else if (isEstablishmentTokenValid(this.estToken, RouterConstants.TRANSACTION_CHANGE_EST_OWNER)) {
      this.isValidator=true;
      this.initialiseForEdit(this.estToken);
    } else if (this.changeEstablishmentService.selectedRegistrationNo) {
      this.registrationNo = this.changeEstablishmentService.selectedRegistrationNo;
      this.initialiseTabWizards(this.currentTab);
      this.initialiseView(this.registrationNo);
    } else {
      this.setTransactionComplete();
      this.location.back();
    }
    if (this.appType === ApplicationTypeEnum.PUBLIC) {
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
  initialiseForEdit(estToken: EstablishmentRouterData) {
    if (estToken) {
      this.isReEnter = !this.isDraftTransaction;
      this.fetchComments(estToken);
      this.ownerWizards = getChangeOwnerWizards().map(wizard => {
        wizard.isDisabled = false;
        wizard.isActive = false;
        wizard.isDone = true;
        return wizard;
      });
      if (estToken.tabIndicator && estToken.tabIndicator < this.ownerWizards.length) {
        this.currentTab = estToken.tabIndicator;
        this.ownerWizards[estToken.tabIndicator].isActive = true;
      } else {
        this.ownerWizards[this.currentTab].isActive = true;
      }
      this.initialiseView(estToken.registrationNo, estToken.referenceNo);
    }
  }
  initialiseLookups() {
    this.gccCountryList$ = this.lookupService.getGccCountryList();
    this.genderList$ = this.lookupService.getGenderList();
    this.cityList$ = this.lookupService.getCityList();
    this.nationalityList$ = this.lookupService.getNationalityList();
  }

  createForm(): FormGroup {
    return this.fb.group({
      comments: null,
      referenceNo: undefined
    });
  }

  /**
   * Method to initialise current tab
   * @param currentTab
   */
  initialiseTabWizards(currentTab: number) {
    if (
      (this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Partnership' ||
        this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Limited Liability' ||
        this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Stock Share Company' ||
        this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Limited Partnership' ||
        this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Vocational_Establishment' ||
        this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Individual') &&
      this.appType === ApplicationTypeEnum.PUBLIC &&
      !this.changeEstablishmentService.selectedEstablishment.gccCountry &&
      this.changeEstablishmentService.selectedEstablishment.unifiedNationalNumber &&
      !(this.isEligibleForDirectChange && this.mciError)
    ) {
      this.ownerWizards = getChangeOwnerWizardsPartnership(currentTab);
    } else {
      this.ownerWizards = getChangeOwnerWizards(currentTab);
    }
  }

  initialiseView(registrationNo, referenceNo?: number): void {
    if (this.appType === ApplicationTypeEnum.PUBLIC) {
      this.canDeleteOwner = false;
    }
    this.ownerForm = this.createForm();
    if (referenceNo) {
      this.ownerForm.get('referenceNo').setValue(referenceNo);
      this.ownerForm.updateValueAndValidity();
    }

    setState(this, registrationNo, referenceNo).subscribe(noop, noop);
  }
  checkIfDirectChange() {
    if (this.isEligibleForDirectChange && this.mciError && !this.isReEnter) {
      this.isDirectChange = false;
    }
    this.initialiseTabWizards(this.currentTab);
  }

  /**
   * Method to get the current owners and newly added ownerss
   */
  getAllOwners(): Owner[] {
    if (this.currentOwners || this.newOwners) {
      return [...this.currentOwners?.filter(owner => (owner.recordAction ? true : false)), ...this.newOwners];
    } else {
      return [];
    }
  }

  /**
   * Method to fetch owners
   * @param registrationNo
   * @param referenceNo
   */
  fetchOwners(registrationNo: number, referenceNo: number): Observable<Owner[]> {
    const existingOwners$: Observable<Owner[]> = this.changeEstablishmentService.getOwners(registrationNo);
    // For Reenter get owners also from transient table
    if (referenceNo) {
      return this.changeEstablishmentService
        .searchOwnerWithQueryParams(registrationNo, [
          {
            queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
            queryValue: referenceNo
          }
        ])
        .pipe(
          switchMap(ownersInWorkflow => {
            return existingOwners$.pipe(
              tap(existingOwners => {
                [this.currentOwners, this.newOwners] = this.filterCurrentOwnersAndNewOwners(
                  ownersInWorkflow,
                  existingOwners
                );
                this.filteredOwners = this.currentOwners;
                this.assembleToOwnersBeforeChange(this.filteredOwners);
                this.filterNationalityList$ = convertBilingualListToLovList(
                  this.currentOwners.map(owner => owner?.person?.nationality)
                );
                this.updateAction();
              })
            );
          })
        );
    } else {
      return existingOwners$.pipe(
        tap(existingOwners => {
          this.filteredOwners = this.currentOwners = existingOwners;
          this.filterNationalityList$ = convertBilingualListToLovList(
            this.currentOwners.map(owner => owner?.person?.nationality)
          );
          this.assembleToOwnersBeforeChange(this.filteredOwners);
        })
      );
    }
  }
  /**
   *
   * @param existingOwners method to assemble owners before change
   */
  assembleToOwnersBeforeChange(existingOwners: Owner[]) {
    this.ownersBeforeChange = existingOwners.map(owner => {
      const temp: Owner = bindToObject(new Owner(), owner);
      temp.startDate = bindToObject(new GosiCalendar(), temp.startDate);
      temp.endDate = bindToObject(new GosiCalendar(), temp.endDate);
      return temp;
    });
  }
  /**
   * Method to retrieve current owners and new owners
   * @param ownersInWorkflow
   * @param existingOwners
   */
  filterCurrentOwnersAndNewOwners(ownersInWorkflow: Owner[], existingOwners: Owner[]): [Owner[], Owner[]] {
    const [modifiedOrRemovedOwners, newOwners]: [Owner[], Owner[]] = [[], []];
    ownersInWorkflow.reduce(
      (result, owner) => {
        result[owner.recordAction === ActionTypeEnum.ADD ? 1 : 0].push(owner);
        return result;
      },
      [modifiedOrRemovedOwners, newOwners]
    );
    newOwners.some((owner, index) => {
      owner.person = new Person().fromJsonToObject(owner.person);
      this.addOwnerForm();
      this.ownerFormArray[index].get('isSaved').setValue(true);
      this.ownerFormArray[index].get('isVerified').setValue(true);
    });
    const modOwnerIds = modifiedOrRemovedOwners.map(modOwner => modOwner.ownerId);
    const ownerNotUnderTransaction = existingOwners.filter(owner => modOwnerIds.indexOf(owner.ownerId) === -1);
    return [[...ownerNotUnderTransaction, ...modifiedOrRemovedOwners], newOwners];
  }

  /**
   * Method to submit the change owner transaction
   * @param registrationNo
   */
  submitTransaction(registrationNo) {
    if (this.apiTriggered) return;
    this.alertService.clearAlerts();
    const navigationIndicator = this.getFinalTransactionNavInd();
    //Newly added owners, removed owners and modified owners
    const ownersToSave = [...this.currentOwners.filter(owner => owner.recordAction !== null), ...this.newOwners];
    if (isDocumentsValid(this.ownerDocuments)) {
      this.apiTriggered = true;
      this.establishmentService
        .saveAllOwners(
          ownersToSave,
          registrationNo,
          navigationIndicator,
          this.ownerForm.get('comments').value,
          +this.ownerForm.get('referenceNo').value
        )
        .pipe(
          switchMap(res => {
            this.transactionFeedback = res;
            if (this.isReEnter) {
              return this.updateBpm(this.estToken, this.ownerForm.get('comments').value, res.successMessage).pipe(
                catchError(err => {
                  this.apiTriggered = false;
                  this.alertService.showError(err?.error?.message);
                  return throwError(err);
                }),
                tap(() => {
                  this.setTransactionComplete();
                  this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appType)]);
                })
              );
            } else {
              this.setTransactionComplete();
              this.location.back();
              this.alertService.showSuccess(this.transactionFeedback.successMessage);
              return of(res);
            }
          })
        )
        .subscribe(noop, err => {
          this.apiTriggered = false;
          this.alertService.showError(err?.error?.message);
        });
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }

  getFinalTransactionNavInd(): NavigationIndicatorEnum {
    if (this.isReEnter) {
      if (this.estToken.assignedRole === Role.VALIDATOR_1) {
        return NavigationIndicatorEnum.VALIDATOR_CHANGE_OWNER_FINAL_SUBMIT;
      } else {
        return NavigationIndicatorEnum.ADMIN_REENTER_CHANGE_OWNER_FINAL_SUBMIT;
      }
    } else if (this.appType === ApplicationTypeEnum.PUBLIC) {
      if (this.isDirectChange) {
        return NavigationIndicatorEnum.ESTADMIN_CHANGE_OWNER_DIRECT_CHANGE;
      }
      return NavigationIndicatorEnum.EST_ADMIN_CHANGE_OWNER_FINAL_SUBMIT;
    } else {
      return NavigationIndicatorEnum.CSR_CHANGE_OWNER_FINAL_SUBMIT;
    }
  }

  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number, restrictNextWizards: boolean = false) {
    this.currentTab = tabIndex;
    this.ownerWizards = activateWizard(this.ownerWizards, tabIndex, restrictNextWizards);
  }

  /**
   * Method to add owner
   */
  addOwner() {
    this.addOwnerForm();
    const newOwner = new Owner();
    newOwner.recordAction = ActionTypeEnum.ADD;
    this.newOwners.push(newOwner);
    this.selectPanel(true, this.newOwners.length);
    this.selectedWizard(0, true);
    if (this.establishment?.legalEntity?.english === LegalEntityEnum.INDIVIDUAL) {
      const noOfActiveOwner = this.getAllActiveOwners().length;
      if (noOfActiveOwner >= 1) {
        this.showStartDate = true;
        this.showEndDate = true;
      } else {
        this.showStartDate = true;
        this.showEndDate = false;
      }
    }
  }

  /**
   * Method to delete the owner
   * @param index
   */
  deleteOwner(index: number) {
    this.newOwners.splice(index, 1);
    this.ownerFormArray.splice(index, 1);
    this.selectedWizard(0, true);
    if (this.bsModalRef) {
      this.hideModal();
    }
  }

  /**
   * Method to save owner
   * @param index
   */
  saveOwner(index: number) {
    this.alertService.clearAlerts();
    const navigationInd = NavigationIndicatorEnum.ADD_OWNER_LEGAL_ENTITY_CHANGE;
    let owner = this.newOwners[index];
    owner = assembleFormToOwner(owner, this.ownerFormArray[index], this.showStartDate);
    if (this.isEligibleForDirectChange && !this.mciError) {
      for (const identity of owner.person.identity) {
        if (!this.existInMci(identity)) {
          this.isDirectChange = false;
        } else {
          this.isDirectChange = true;
          break;
        }
      }
      if (!this.isDirectChange) {
        this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.OWNER-MISMATCH');
        return;
      }
    }
    this.establishmentService.saveAllOwners([owner], this.establishment.registrationNo, navigationInd).subscribe(
      res => {
        this.alertService.showSuccess(res.message);
        this.accordionPanel = -1;
        owner.person.personId = res.personId;
        this.newOwners[index] = bindToObject(new Owner(), this.newOwners[index]);
        this.newOwners = [...this.newOwners];
        this.ownerFormArray[index].get('isSaved').setValue(true);
      },
      err => {
        this.alertService.showError(err.error.message, err.error.details);
      }
    );
  }

  // Method to update the owner dates
  updateOwner(index: number) {
    this.alertService.clearAlerts();
    if (this.newOwners[index] && this.ownerFormArray[index]) {
      updateDatesOfOwner(this.newOwners[index], this.ownerFormArray[index]);
    }
  }

  // Method to save owners details
  updateOwners(registrationNo: number) {
    if (this.parentForm.valid) {
      this.alertService.clearAlerts();
      saveOwnerModifications(this, registrationNo).subscribe(noop, noop);
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  // Method to save owners details partnership
  updateOwnersPartnership(registrationNo: number) {
    this.alertService.clearAlerts();
    saveOwnerModificationsPartnership(this, registrationNo).subscribe(noop, noop);
  }

  // Method to sort same owners based on start dates
  sortStartDates(owners: Owner[]): Owner[] {
    return owners.slice().sort((a, b) => +a.startDate?.gregorian - +b.startDate?.gregorian);
  }

  getAllActiveOwners(): Owner[] {
    return [
      ...this.splitOwners[0].filter(owner => owner.recordAction !== ActionTypeEnum.REMOVE),
      ...this.newOwners.filter(owner => !owner.endDate?.gregorian)
    ];
  }
  // Method to split owners into active and inactive owners respectively
  get splitOwners(): [Owner[], Owner[]] {
    const activeOwners: Owner[] = [];
    const inactiveOwners: Owner[] = [];
    if (this.currentOwners) {
      this.currentOwners.reduce(
        (result, owner) => {
          result[
            owner.endDate?.gregorian // for inactive owners end date is not null
              ? 1
              : 0
          ].push(owner);
          return result;
        },
        [activeOwners, inactiveOwners]
      );
    }
    return [activeOwners, inactiveOwners];
  }
  getNavIndForSave() {
    if (this.isReEnter) {
      if (this.estToken.assignedRole === Role.VALIDATOR_1) {
        return NavigationIndicatorEnum.VALIDATOR_CHANGE_OWNER_SAVE;
      } else {
        return NavigationIndicatorEnum.ESTADMIN_CHANGE_OWNER_REENTER_SAVE;
      }
    } else if (this.appType === ApplicationTypeEnum.PUBLIC) {
      return NavigationIndicatorEnum.ESTADMIN_CHANGE_OWNER_SAVE;
    } else {
      return NavigationIndicatorEnum.CSR_CHANGE_OWNER_SAVE;
    }
  }
  // Method to reset the owner form
  resetOwner(ownerIndex: number) {
    if (this.ownerFormArray[ownerIndex]) {
      resetOwner(this.newOwners[ownerIndex], this.ownerFormArray[ownerIndex]);
    }
  }

  // Method to open the owner accordion
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }

  // Verify owner
  verifyOwner(index: number) {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.ownerFormArray[index]);
    const owner = new Owner();
    if (this.ownerFormArray[index].valid) {
      if (owner.person) {
        owner.person.fromJsonToObject(this.ownerFormArray[index].get('search').value);
        owner.person.role = Role.OWNER;
      }
      this.personOwnerBirthDate = owner?.person?.birthDate?.gregorian;
      this.establishmentService.verifyPersonDetails(owner.person).subscribe(
        res => {
          this.ownerFormArray[index].get('isVerified').setValue(true);
          if (res !== undefined && res !== null) {
            this.ownerFormArray[index].get('personExists').setValue(true);
            const newOwner = new Owner();
            newOwner.person.fromJsonToObject(res);
            this.newOwners[index] = newOwner;
          } else {
            this.newOwners[index] = owner;
          }
        },
        err => {
          if (err.error.code === ErrorCodeEnum.OWNER_NO_RECORD) {
            this.ownerFormArray[index].get('isVerified').setValue(true);
            this.newOwners[index] = owner;
          } else {
            this.alertService.showError(err.error.message, err.error.details);
          }
        }
      );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  // Method to add owner form
  addOwnerForm(): void {
    this._ownerFormArray.push(createOwnerForm());
  }

  // Method to navigate back
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelTransaction();
  }

  // Method to cancel the owner transaction
  cancelTransaction() {
    if (this.ownerForm.get('referenceNo').value || this.isReEnter) {
      this.changeEstablishmentService
        .revertTransaction(this.establishment.registrationNo, this.ownerForm.get('referenceNo').value)
        .pipe(
          tap(() => {
            this.setTransactionComplete();
            if (this.reRoute) {
              this.router.navigate([this.reRoute]);
            } else {
              if (this.appType === ApplicationTypeEnum.PUBLIC) {
                this.location.back();
              } else if (this.isReEnter) {
                this.changeEstablishmentService.navigateToValidateOwner();
              } else {
                this.location.back();
              }
            }
          })
        )
        .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    } else {
      this.setTransactionComplete();
      this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
    }
  }

  updateAction() {
    this.editedOwners = [];
    this.removedOwners = [];
    this.currentOwners.forEach(owner => {
      if (owner.recordAction === ActionTypeEnum.MODIFY) {
        this.editedOwners.push(owner);
      }
      if (owner.recordAction === ActionTypeEnum.REMOVE) {
        this.removedOwners.push(owner);
      }
    });
    this.selectedWizard(0, true);
  }

  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
  }

  navigateBack() {
    this.location.back();
  }

  searchForOwners(searchParam) {
    this.searchText = searchParam;
    this.filteredOwners = searchWithOwnerNameOrIdentifier(
      ownersAfterFilter(this.currentOwners, this.ownerFilters),
      searchParam
    );
    this.currentPage = this.pageDetails.currentPage = 1;
  }

  filterOwners(filters: FilterKeyValue[]) {
    this.ownerFilters = [...filters];
    this.filteredOwners = searchWithOwnerNameOrIdentifier(
      ownersAfterFilter(this.currentOwners, filters),
      this.searchText
    );
    this.currentPage = this.pageDetails.currentPage = 1;
  }

  clearAll() {
    this.ownerFilters = [];
    this.filteredOwners = searchWithOwnerNameOrIdentifier(this.currentOwners, this.searchText);
    this.currentPage = this.pageDetails.currentPage = 1;
  }

  allOwnersSaved() {
    return this.ownerFormArray.filter(form => form.get('isSaved')?.value === false).length === 0;
  }

  canAddOwner() {
    if (this.isOnePartner) {
      if (this.changeEstablishmentService.ownerCountIncludingEstablishmentAsOwner - this.currentOwners.length > 0) {
        return false;
      } else if (
        this.changeEstablishmentService.ownerCountIncludingEstablishmentAsOwner === 0 &&
        this.newOwners.length === 0
      ) {
        return true;
      } else if (
        this.changeEstablishmentService.ownerCountIncludingEstablishmentAsOwner >= 1 &&
        this.currentOwners.every(owner => owner.endDate?.gregorian != null && this.newOwners.length === 0)
      ) {
        return true;
      } else if (
        this.changeEstablishmentService.ownerCountIncludingEstablishmentAsOwner >= 1 &&
        this.currentOwners.every(owner => owner.endDate?.gregorian == null)
      ) {
        return false;
      } else {
        return false;
      }
    } else {
      return !this.newOwners?.length ? true : this.allOwnersSaved();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
  /**
   * Method to submit the change owner transaction without doc
   * @param registrationNo
   */
  submitTransactionWithoutDoc(registrationNo) {
    if (this.parentForm.valid) {
      if (this.apiTriggered) return;
      this.alertService.clearAlerts();
      if (!this.isEligibleForDirectChange) {
        saveOwnerModificationsPartnership(this, registrationNo).subscribe(noop, noop);
      }

      const navigationIndicator = this.getFinalTransactionNavInd();
      const ownersToSave = [...this.currentOwners.filter(owner => owner.recordAction !== null), ...this.newOwners];
      for (const ownerToSave of ownersToSave) {
        for (const currentOwner of this.currentOwners) {
          if (compareIdNum(ownerToSave.person.identity[0], currentOwner.person.identity[0])) {
            if (!currentOwner.endDate) {
              this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.DUPLICATE_OWNER');
              return;
            }
          }
        }
      }
      {
        if (
          (!(
            this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Partnership' ||
            this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Limited Liability' ||
            this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Stock Share Company' ||
            this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Limited Partnership' ||
            this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Vocational_Establishment' ||
            this.changeEstablishmentService.selectedEstablishment.legalEntity.english === 'Individual'
          ) &&
            !(this.appType === ApplicationTypeEnum.PUBLIC) &&
            this.changeEstablishmentService.selectedEstablishment.gccCountry &&
            !this.changeEstablishmentService.selectedEstablishment.unifiedNationalNumber) ||
          this.isDirectChange
        ) {
          this.apiTriggered = true;
          this.establishmentService
            .saveAllOwners(
              ownersToSave,
              registrationNo,
              navigationIndicator,
              this.ownerForm.get('comments').value,
              +this.ownerForm.get('referenceNo').value
            )
            .pipe(
              switchMap(res => {
                this.transactionFeedback = res;
                if (this.isReEnter) {
                  return this.updateBpm(this.estToken, this.ownerForm.get('comments').value, res.successMessage).pipe(
                    catchError(err => {
                      this.apiTriggered = false;
                      this.alertService.showError(err?.error?.message);
                      return throwError(err);
                    }),
                    tap(() => {
                      this.setTransactionComplete();
                      this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appType)]);
                    })
                  );
                } else {
                  this.setTransactionComplete();
                  this.location.back();
                  this.alertService.showSuccess(this.transactionFeedback.successMessage);
                  return of(res);
                }
              })
            )
            .subscribe(noop, err => {
              this.apiTriggered = false;
              this.alertService.showError(err?.error?.message);
            });
        } else {
          this.setTransactionComplete();
          this.router.navigate([EstablishmentConstants.EST_PROFILE_ROUTE(this.registrationNo)]);
          this.alertService.showSuccess(this.message);
        }
      }
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  existInMci(identity: NIN | Iqama | NationalId | Passport | BorderNumber) {
    for (const mciOwnerId of this.mciOwnerIds) {
      switch (identity.idType) {
        case IdentityTypeEnum.IQAMA:
          if (Number((mciOwnerId as Iqama).iqamaNo) === Number((identity as Iqama).iqamaNo)) {
            return true;
          }
          break;
        case IdentityTypeEnum.NIN:
          if (Number((mciOwnerId as NIN).newNin) === Number((identity as NIN).newNin)) {
            return true;
          }
          break;
        case IdentityTypeEnum.NATIONALID:
          if (Number((mciOwnerId as NationalId).id) === Number((identity as NationalId).id)) {
            return true;
          }
      }
    }
    return false;
  }

  onKeepDraft() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.setTransactionComplete();
    this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
  }
}
