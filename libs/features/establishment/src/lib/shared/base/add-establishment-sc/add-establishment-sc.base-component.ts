/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Directive, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  CoreBenefitService,
  ApplicationTypeEnum,
  BorderNumber,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
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
  StorageService,
  TransactionInterface,
  TransactionMixin,
  WizardItem,
  WorkflowService,
  WorkflowValidatorRequest,
  bindToObject,
  scrollToTop,
  startOfDay
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, forkJoin, iif, noop, of, throwError } from 'rxjs';
import { catchError, delay, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { EstablishmentConstants } from '../../constants';
import {
  ActionTypeEnum,
  DocumentTransactionTypeEnum,
  ErrorCodeEnum,
  EstablishmentErrorKeyEnum,
  EstablishmentQueryKeysEnum,
  LegalEntityEnum,
  NavigationIndicatorEnum
} from '../../enums';
import { Admin, EstablishmentOwnerDetails, Owner, OwnerResponse, QueryParam } from '../../models';
import { AddEstablishmentService, EstablishmentAdminService, EstablishmentService } from '../../services';
import { getParams, getProEstablishmentWizard, isGovOrSemiGov } from '../../utils';
import { EstablishmentScBaseComponent } from '../establishment-sc.base-component';
import {
  finalSubmitForRegisterEstablishment,
  getRegisterEstDocType,
  setAdminAfterVerify,
  setAdminForSave,
  setAdminForVerify,
  setEstablishmentFormDetails,
  setOwnerAfterVerify,
  setOwnerForSave,
  setPaymentDetailsForSave
} from './add-establishment-helper';
import { EstablishmentOwner } from '@gosi-ui/core/lib/models/establishment-owner';

type Identity = NIN | Iqama | NationalId | Passport | BorderNumber;

/**
 * Base component for add establishment component.
 *
 * @export
 * @abstract"?
 * @class AddEstablishmentSCBaseComponent
 * @extends {EstablishmentScBaseComponent}
 * @implements {OnInit}
 */
@Directive()
export abstract class AddEstablishmentSCBaseComponent
  extends TransactionMixin(EstablishmentScBaseComponent)
  implements OnInit, OnDestroy, TransactionInterface
{
  /**
   * Creates an instance of AddEstablishmentSCBaseComponent.
   * @param {EstablishmentService} addEstablishmentService
   * @param {LookupService} lookUpService
   * @param {StorageService} storageService
   * @memberof AddContributorBaseComponent
   */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly addEstablishmentService: AddEstablishmentService,
    readonly establishmentAdminService: EstablishmentAdminService,
    readonly lookUpService: LookupService,
    readonly storageService: StorageService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly workflowService: WorkflowService,
    readonly bsModalService: BsModalService,
    readonly location: Location,
    readonly router: Router,
    readonly coreBenefitService: CoreBenefitService
  ) {
    super(bsModalService, workflowService);
  }

  /**
   * Local Variables
   */
  totalTabs = EstablishmentConstants.TABS_NO_WITH_ADMIN;
  editEstablishment = false;
  isResumeFromDraft = false;
  lang: boolean;
  taskID: string;
  establishmentAdmin: Admin = new Admin();
  establishmentOwner: EstablishmentOwnerDetails = new EstablishmentOwnerDetails();
  proactiveEstowners: Owner[] = [];
  validateRequest: WorkflowValidatorRequest;
  organistaionTypeList: LovList;
  bankNameList$: Observable<LovList>;
  gccBankNameList$: Observable<LovList>;
  ownerDeleted$: Observable<number>; //Observable when subscribed will delete owner
  verifyEstStatus: boolean;
  verifyAdminStatus: boolean;
  editAdminDetails: boolean;
  isIndividual = false;
  isMofPayment = false;
  addEstWizardItems: WizardItem[] = [];
  addProEstWizardItems: WizardItem[] = [];
  hasAdmin: boolean;
  ownerIsAdmin = false;
  gccEstablishment = false;
  isInternational = false;
  editPersonDetails: boolean[] = [];
  verifyPersonStatus: boolean[] = [];
  isOwnerSaved: boolean[] = [];
  person: Person[] = [];
  isSubmit = false;
  isSaved: boolean;
  isEstablishmentFromMci = true;
  isAccountSaved = false;
  isOwnerRequired = true;
  withOwner: boolean;
  adminSaved = false;
  issueDate: Date = new Date();
  noOfOwners = 4;
  ownerIndex = []; //Track Owner Indexes
  countryReadOnly = false;
  molOwnerPersonId = [];
  documentList: DocumentItem[];
  referenceNo: number = undefined;
  gosiStartDates: Map<string, Date>;
  showLateFeeIndicator: boolean;
  ownerSavedAsAdmin = true;
  ownerCurrentTab = undefined;
  proDocs: DocumentItem[] = [];
  showDocumentSection = true;
  isIbanMapped = true;
  isIbanChanged = false;
  estOwner: EstablishmentOwner[] = [];
  currentOwners: any[] = [];
  establishment: Establishment = new Establishment();
  isOwnerChanged = false;
  ownerCountIncludingEstablishmentAsOwner:number;

  /**
   * Lookup Observables
   */
  activityTypeList$: Observable<LovList>;
  addressTypeList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  documentList$: Observable<DocumentItem[]>;
  establishmentBranchTypeList$: Observable<LovList>;
  gccCountryList$: Observable<LovList>;
  genderList$: Observable<LovList>;
  heading$: Observable<string>;
  legalEntityList$: Observable<Lov[]>;
  legalEntityLovList$: Observable<LovList>;
  licenseIssuingAuthorityList$: Observable<LovList>;
  nationalityList$: Observable<LovList>;
  organistaionTypeList$: Observable<LovList>;
  yesOrNoList$: Observable<LovList>;
  apiInProgress = false;
  existingOwnerPersonIds = [];
  mciError: boolean;
  samaFailure = false;

  /**
   * This method handles the initialization tasks.
   *
   * @memberof AddEstablishmentSCBaseComponent
   */
  ngOnInit() {
    this.hasAdmin = false;
    /** Fetch the lookup values. */
    this.activityTypeList$ = this.lookUpService.getActivityTypeList();
    this.addressTypeList$ = this.lookUpService.getAddressTypeList();
    this.cityList$ = this.lookUpService.getCityList();
    this.countryList$ = this.lookUpService.getCountryList();
    this.editPersonDetails = [];
    this.establishmentBranchTypeList$ = this.lookUpService.getEstablishmentTypeList();
    this.gccCountryList$ = this.lookUpService.getGccCountryList();
    this.genderList$ = this.lookUpService.getGenderList();
    this.isOwnerSaved = [false];
    this.licenseIssuingAuthorityList$ = this.lookUpService.getLicenseIssueAuthorityList();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.organistaionTypeList$ = this.lookUpService.getOrganistaionTypeList();
    this.verifyPersonStatus = [];
    this.yesOrNoList$ = this.lookUpService.getYesOrNoList();
    this.establishmentService.getGosiStartDates().subscribe(res => {
      this.gosiStartDates = res;
    });
  }

  abstract nextForm();

  abstract setSubmittedFalse(index: number);

  abstract setOwnerDetails(persons: Person[]);

  abstract previousForm();

  abstract resetToFirstForm();

  abstract verifyBirthDate(index: number);

  abstract finalForm();

  abstract resetAdminForm();

  abstract resetVerifyAdminForm();

  abstract resetOwnerForm(index: number);

  abstract restrictProgressBar();

  abstract askForCancel();

  /**
   * This method is to save the Crn Details of an Mol Feed establishment
   * @param formDetails
   */
  saveCRNDetails(formDetails) {
    this.establishment = this.addEstablishmentService.setEstablishmentDetails(this.establishment, formDetails);
    if (this.establishment.crn) {
      if (this.establishment.crn.issueDate?.gregorian) {
        this.establishment.crn.issueDate.gregorian = startOfDay(this.establishment.crn.issueDate.gregorian);
      }
      if (this.establishment.crn.expiryDate?.gregorian) {
        this.establishment.crn.expiryDate.gregorian = startOfDay(this.establishment.crn.expiryDate.gregorian);
      }
    }
    if (this.establishment.license?.issueDate?.gregorian) {
      this.establishment.license.issueDate.gregorian = startOfDay(this.establishment.license.issueDate.gregorian);
    }
    if (this.establishment.legalEntity.english === LegalEntityEnum.INDIVIDUAL) {
      this.isIndividual = true;
    } else {
      this.isIndividual = false;
    }
    let isDuplicateEst$ = of(false);
    if (this.establishment.license?.number) {
      isDuplicateEst$ = this.establishmentService.isLicensePresent(
        this.establishment.registrationNo,
        this.establishment.license?.number,
        this.establishment.license?.issuingAuthorityCode?.english
      );
    }
    isDuplicateEst$
      .pipe(
        tap(res => {
          if (res) {
            this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.DUPLICATE_LICENSE);
          } else {
            if (
              EstablishmentConstants.LEGAL_ENTITY_WITHOUT_OWNER.indexOf(this.establishment.legalEntity.english) !== -1
            ) {
              this.totalTabs = 4;
              if (this.addEstWizardItems.length !== 3) {
                this.addProEstWizardItems = getProEstablishmentWizard(false);
                this.addProEstWizardItems[0].isActive = true;
                this.addProEstWizardItems[0].isDisabled = false;
              }
              this.isOwnerRequired = false;
            } else {
              this.isOwnerRequired = true;
              if (this.addEstWizardItems.length !== 4) {
                this.addProEstWizardItems = getProEstablishmentWizard(true, this.establishment.legalEntity.english);
                this.addProEstWizardItems[0].isActive = true;
                this.addProEstWizardItems[0].isDisabled = false;
              }
              this.totalTabs = 5;
            }
            this.handleDocumentSection();
            this.nextForm();
          }
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message, err.error.details);
      });
  }

  /**
   * Method to set comments
   */
  setComments(routerData: EstablishmentRouterData) {
    this.comments$ = this.getAllComments(routerData).pipe(catchError(() => of([])));
  }

  /**
   * This method is to save establishment
   *
   * @param establishementdetails
   * @memberof AddEstablishmentSCBaseComponent
   */
  saveEstablishment(establishmentDetails) {
    if (establishmentDetails === undefined && establishmentDetails === null) {
      return;
    }
    let currentMailingAddress = establishmentDetails.currentMailingAdddress;
    if (establishmentDetails?.addressDetails?.length > 0) {
      currentMailingAddress = establishmentDetails.currentMailingAdddress;
    } else {
      currentMailingAddress = undefined;
      if (this.establishment.contactDetails?.addresses) {
        this.establishment.contactDetails.addresses = [];
      }
    }
    this.alertService.clearAlerts();
    let establishment: Establishment = this.addEstablishmentService.setEstablishmentDetails(
      this.establishment,
      establishmentDetails.establishmentDetails
    );
    establishment = this.addEstablishmentService.setContactDetails(
      establishment,
      establishmentDetails.addressDetails,
      establishmentDetails.establishmentContact
    );
    if (this.isResumeFromDraft) {
      establishment.transactionTracingId = this.estRouterData?.referenceNo;
    }
    setEstablishmentFormDetails(establishment, this);
    establishment.contactDetails.currentMailingAddress = currentMailingAddress;
    this.addEstablishmentService
      .saveEstablishment(establishment)
      .pipe(
        tap(res => {
          if (res.registrationNo) {
            if (res.transactionTracingId) {
              this.referenceNo = res.transactionTracingId;
            }
            establishment.transactionTracingId = res.transactionTracingId;
            establishment.registrationNo = res.registrationNo;
            this.establishment = establishment;
            this.showLateFeeIndicator = isGovOrSemiGov(this.establishment?.legalEntity?.english);
            this.nextForm();
          }
        }),
        delay(100),
        tap(() => {
          this.isSaved = true;
        }),
        switchMap(() => {
          return iif(
            () => (this.addEstablishmentService.draftRegNo ? true : false),
            this.addEstablishmentService.cancelTransaction(this.addEstablishmentService.draftRegNo).pipe(
              tap(() => {
                this.addEstablishmentService.draftRegNo = undefined;
              })
            ),
            of(null)
          );
        })
      )
      .subscribe(noop, err => {
        this.showErrorMessage(err);
      });
  }

  /**
   * This method is to save payment details in establishment
   *
   * @param PaymentDetails
   * @memberof AddEstablishmentSCBaseComponent
   */
  savePaymentDetails(bankPaymentDetails) {
    this.alertService.clearAlerts();
    if (
      bankPaymentDetails?.bankAccount?.ibanAccountNo !==
        this.establishment?.establishmentAccount?.bankAccount?.ibanAccountNo &&
      bankPaymentDetails?.bankAccount?.ibanAccountNo !== '' &&
      bankPaymentDetails?.bankAccount?.ibanAccountNo != null
    ) {
      this.isIbanChanged = true;
      // this.handleDocumentSection();
    } else {
      this.isIbanChanged = false;
    }

    setPaymentDetailsForSave(this, bankPaymentDetails);
    if (this.establishment.proactive === true) {
      this.establishment.establishmentAccount.accountStatus = bankPaymentDetails.paymentDetails.accountStatus;
      this.establishment.establishmentAccount.matchStatus = bankPaymentDetails.paymentDetails.matchStatus;
      this.establishment.establishmentAccount.creditStatus = bankPaymentDetails.paymentDetails.creditStatus;
    }
    this.addEstablishmentService
      .savePaymentDetails(this.establishment.establishmentAccount, this.isAccountSaved)
      .subscribe(
        () => {
          this.isMofPayment = this.establishment?.establishmentAccount?.paymentType?.english === 'Yes';
          this.isAccountSaved = true;
          if (this.establishment.proactive === true) {
            if (
              this.establishment.legalEntity &&
              EstablishmentConstants.LEGAL_ENTITY_WITHOUT_OWNER.indexOf(this.establishment.legalEntity.english) === -1
            ) {
              //User needs to get the owners only first time need not call again when user comes back
              if (this.proactiveEstowners.length === 0) {
                this.getOwnerDetails();
              }
            }
            // this.getProActiveDocumentList();
          }
          // this.handleDocumentSection();
          this.nextForm();
        },
        err => {
          this.showErrorMessage(err);
        }
      );
  }

  /**
   * This method is to verify and search for the owner details
   * @param ownerIdentifiers
   */
  verifyOwner(ownerIdentifiers, index) {
    let isDateRequired = false;
    if (this.establishmentOwner && this.establishmentOwner.persons.length > 0) {
      if (
        !this.establishmentOwner?.persons?.[index]?.birthDate?.gregorian &&
        this.molOwnerPersonId.length > 0 &&
        index === 0 &&
        this.establishmentOwner?.persons?.[index]?.personId
      ) {
        isDateRequired = true;
      }
    }
    this.establishmentOwner.persons[index] = new Person();
    this.alertService.clearAlerts();
    if (this.establishmentOwner.persons[index]) {
      this.establishmentOwner.persons[index].role = EstablishmentConstants.EST_OWNER_ROLE;
    }
    this.verifyPersonStatus[index] = false;
    this.editPersonDetails[index] = true;
    this.isOwnerSaved[index] = false;
    this.resetOwnerForm(index);
    this.establishmentOwner.persons[index] = this.establishmentAdminService.updateOwnerDetails(
      this.establishmentOwner.persons[index],
      ownerIdentifiers
    );
    this.establishmentAdminService
      .verifyPersonDetails(this.establishmentOwner.persons[index], ownerIdentifiers)
      .subscribe(
        personDetails => {
          setOwnerAfterVerify(this, personDetails, index, ownerIdentifiers, isDateRequired);
        },
        err => {
          if (err.error) {
            this.showErrorMessage(err);
            if (isDateRequired) {
              this.verifyBirthDate(index);
              this.establishmentOwner.persons[index].birthDate.gregorian = null;
            }
          }
        }
      );
  }

  /**
   * This method is to get get owner
   */
  getOwnerDetails() {
    if (this.establishment && this.establishment.registrationNo) {
      const queryParams: QueryParam[] = [];
      queryParams.push({ queryKey: EstablishmentQueryKeysEnum.ESTABLISHMENT_OWNERS, queryValue: true });
      this.establishmentService
        .getOwnerDetails(this.establishment.registrationNo, queryParams)
        .pipe(
          tap(res => {
            if (res?.owners?.length > 0) {
              this.existingOwnerPersonIds = res?.owners
                ?.filter(owner => !owner.endDate?.gregorian)
                .map(o => o.person?.personId);
            }
          }),
          map(res =>
            res?.owners?.length > 0
              ? {
                  molOwnerPersonId: res?.molOwnerPersonId,
                  owners: res?.owners?.filter(owner => !owner.endDate?.gregorian)
                }
              : { molOwnerPersonId: res?.molOwnerPersonId, owners: [] }
          ),
          tap(res => {
            if (res?.owners?.length > 0) {
              this.proactiveEstowners = [...res.owners];
              this.ownerCountIncludingEstablishmentAsOwner=this.proactiveEstowners.length;
            }
          }),
          switchMap(res => {
            if (this.editEstablishment || this.isResumeFromDraft) {
              return this.establishmentService
                .searchOwnerWithQueryParams(
                  this.establishment.registrationNo,
                  getParams(undefined, { referenceNo: this.referenceNo }, new HttpParams())
                )
                .pipe(
                  map(tranOwners => {
                    if (tranOwners) {
                      this.proactiveEstowners.push(...tranOwners);
                      const owners = [...res.owners];
                      const deletedOwners = [
                        ...tranOwners.filter(owner => owner.recordAction === ActionTypeEnum.REMOVE)
                      ];
                      res.owners = [
                        ...owners.filter(
                          owner =>
                            deletedOwners
                              .map(deleteOwner => deleteOwner.person.personId)
                              .indexOf(owner.person.personId) === -1
                        ),
                        ...tranOwners.filter(owner => owner.recordAction !== ActionTypeEnum.REMOVE)
                      ];
                    }
                    return res;
                  })
                );
            } else {
              return of(res);
            }
          })
        )
        .subscribe(
          res => {
            if (res.owners) {
              if (this.establishment.proactive && res.molOwnerPersonId) {
                this.molOwnerPersonId = res.molOwnerPersonId;
              }
              this.ownerIndex = [];
              for (let i = 0; i < res.owners.length; i++) {
                this.ownerIndex.push(i);
              }
              this.setEstOwners(res.owners);
              this.setOwnerDetails(res.owners.map(owners => owners.person));
              this.withOwner = true;
            }
          },
          err => {
            if (err.error.code !== ErrorCodeEnum.OWNER_NO_RECORD) {
              this.showErrorMessage(err);
            }
          }
        );
    }
  }

  /**
   * This method is used to add owner
   */
  addOwner() {
    if (this.isIndividual) {
      this.noOfOwners = 1;
    }
    if (this.establishmentOwner.persons.length <= this.noOfOwners + 1) {
      this.establishmentOwner.persons.push(new Person());
      this.establishmentOwner.persons[this.establishmentOwner.persons.length - 1].identity = [];
    }
  }

  /**
   * This method is to delete the owner
   * @param index
   */
  deleteOwner(index) {
    this.alertService.clearAlerts();
    this.restrictProgressBar();
    if (this.establishmentOwner.persons[index]?.personId) {
      if (this.establishment && this.establishment.registrationNo) {
        this.ownerDeleted$ = iif(
          () => this.establishment.proactive === true,
          this.setRecordActionAsDelete(this.establishmentOwner.persons[index]?.personId),
          this.addEstablishmentService.deleteOwner(
            this.establishment.registrationNo,
            this.establishmentOwner.persons[index].personId
          )
        ).pipe(
          switchMap(() => of(index)),
          tap(() => {
            this.deleteOwnerIndex(index);
          }),
          catchError(err => {
            this.showErrorMessage(err);
            return throwError('');
          })
        );
      }
    } else {
      this.ownerDeleted$ = of(index).pipe(tap(() => this.deleteOwnerIndex(index)));
    }
  }

  setRecordActionAsDelete(personId: number) {
    if (this.isOwnerFromMOL(personId) || this.existingOwnerPersonIds.indexOf(personId) !== -1) {
      this.proactiveEstowners?.forEach(owner => {
        if (owner.person?.personId === personId) {
          owner.recordAction = ActionTypeEnum.REMOVE;
        }
      });
    } else {
      this.proactiveEstowners = this.proactiveEstowners?.filter(owner => owner.person?.personId !== personId);
    }
    if (!this.editEstablishment) {
      this.saveAllOwnersList();
    } //else this.getProActiveDocumentList();
    return of(null);
  }
  saveAllOwnersList() {
    const owners = this.proactiveEstowners
      .filter(owner => (owner.recordAction ? true : false))
      .map(owner => {
        owner.startDate = this.establishment.startDate;
        return owner;
      });
    this.establishmentService
      .saveAllOwners(
        owners.length > 0 ? owners : [],
        this.establishment.registrationNo,
        this.editEstablishment
          ? NavigationIndicatorEnum.COMPLETE_PROACTIVE_RESUBMIT
          : NavigationIndicatorEnum.COMPLETE_PROACTIVE_SUBMIT,
        '',
        this.referenceNo
      )
      .subscribe(
        () => {
          this.getProActiveDocumentList();
        },
        err => {
          this.alertService.showError(err?.error?.message, err?.error?.details);
        }
      );
  }

  isOwnerFromMOL(personId: number) {
    return this.molOwnerPersonId.filter(molPersonId => molPersonId === personId).length > 0;
  }

  /**
   * This method is to delete the owner
   * @param index
   */
  deleteOwnerIndex(index) {
    if (this.ownerIndex) {
      this.ownerIndex.forEach(ownersIndex => {
        if (ownersIndex === index) {
          this.ownerIndex.splice(this.ownerIndex.indexOf(ownersIndex), 1);
        }
      });

      for (let i = 0; i < this.ownerIndex.length; i++) {
        if (this.ownerIndex[i] > index) {
          this.ownerIndex[i] -= 1;
        }
      }
      this.handleDocumentSection();
    }
    if (this.establishmentOwner.persons.length > 0) {
      if (
        this.ownerIsAdmin &&
        this.establishmentOwner.persons[index].personId === this.establishmentAdmin.person.personId
      ) {
        this.removeOwnerAsAdmin();
        this.ownerSavedAsAdmin = true;
      }
      this.establishmentOwner.persons.splice(index, 1);
    }
  }

  /**
   * This method is used to save the owners of a GCC Establishment if any.
   * @param ownerDetails
   */
  saveOwner(ownerDetails) {
    this.alertService.clearAlerts();
    const hasOwnerSaved = setOwnerForSave(this, ownerDetails);
    let navInd;
    let saveOwner$: Observable<OwnerResponse>;
    if (this.establishment.proactive === true) {
      navInd = NavigationIndicatorEnum.ADD_OWNER_LEGAL_ENTITY_CHANGE;
      saveOwner$ = this.addEstablishmentService
        .saveOwners(
          this.establishmentOwner.persons,
          ownerDetails.index,
          this.establishment.registrationNo,
          hasOwnerSaved,
          navInd,
          this.referenceNo
        )
        .pipe(
          tap(savedOwnerRes => {
            const savedOwner = this.proactiveEstowners.find(
              owner => owner?.person?.personId === savedOwnerRes?.personId
            );
            if (savedOwner) {
              if (
                !this.isOwnerFromMOL(savedOwnerRes.personId) &&
                this.existingOwnerPersonIds.indexOf(savedOwnerRes.personId) === -1
              ) {
                savedOwner.recordAction = ActionTypeEnum.ADD;
              }
              if (
                this.isOwnerFromMOL(savedOwnerRes.personId) ||
                this.existingOwnerPersonIds.indexOf(savedOwnerRes.personId) > 0
              ) {
                savedOwner.recordAction = null;
              }
            } else {
              const newOwner = new Owner();
              newOwner.person = bindToObject(new Person(), this.establishmentOwner.persons[ownerDetails.index]);
              newOwner.person.personId = savedOwnerRes.personId;
              newOwner.recordAction = ActionTypeEnum.ADD;
              this.proactiveEstowners.push(newOwner);
            }
            // this.handleDocumentSection();
            // this.getProActiveDocumentList();
            if (!this.editEstablishment) {
              this.saveAllOwnersList();
            } else this.handleDocumentSection();
          })
        );
    } else {
      saveOwner$ = this.addEstablishmentService.saveOwners(
        this.establishmentOwner.persons,
        ownerDetails.index,
        this.establishment.registrationNo,
        hasOwnerSaved
      );
    }
    saveOwner$
      .pipe(
        tap(res => {
          if (this.ownerIndex && this.ownerIndex.indexOf(ownerDetails.index) === -1) {
            this.ownerIndex.push(ownerDetails.index);
          }
          if (res.personId && res.personId !== null) {
            this.establishmentOwner.persons[ownerDetails.index].personId = res.personId;
          }
        }),
        switchMap(res => {
          if (ownerDetails.ownerIsAdmin === true) {
            const admin = new Person().fromJsonToObject(this.establishmentOwner.persons[ownerDetails.index]);
            admin.role = EstablishmentConstants.EST_ADMIN;
            return this.establishmentService.verifyPersonDetails(admin).pipe(switchMap(() => of(res)));
          } else {
            this.updateOwnerAfterSuccess(ownerDetails, res); //Update owner is it is success and admin is not present
            return of(res);
          }
        }),
        tap(res => {
          if (ownerDetails.ownerIsAdmin === true) {
            this.updateOwnerAfterSuccess(ownerDetails, res); //Update owner only after admin is saved correctly
            this.saveOwnerAsAdmin(this.establishmentOwner.persons[ownerDetails.index]);
          }
          this.ownerCurrentTab = new Object();
        })
      )
      .subscribe(noop, err => {
        this.isOwnerSaved[ownerDetails.index] = false;
        this.setSubmittedFalse(ownerDetails.index);
        this.showErrorMessage(err);
      });
  }

  /**
   * Method to update the owner state after owner is saved
   * @param ownerResponse
   */
  updateOwnerAfterSuccess(ownerDetails, ownerResponse: OwnerResponse) {
    this.isOwnerSaved[ownerDetails.index] = true;
    this.editPersonDetails[ownerDetails.index] = false;
    this.alertService.showSuccess(ownerResponse?.message);
  }

  /**
   * This method is to trigger the set owner as admin method from owner component
   */
  makeOwnerAsAdmin() {
    this.alertService.clearAlerts();
    this.restrictProgressBar();
    this.ownerIsAdmin = true;
    this.ownerSavedAsAdmin = false;
  }

  saveOwnerAsAdmin(person?: Person) {
    if (this.ownerIsAdmin) {
      this.establishmentAdmin.person = bindToObject(new Person(), person);
      this.editAdminDetails = false;
      this.verifyAdminStatus = true;
    }
    this.ownerSavedAsAdmin = true;
  }

  /**
   * This method is used to clear the Admin
   */
  removeOwnerAsAdmin() {
    this.restrictProgressBar();
    this.alertService.clearAlerts();
    this.establishmentAdmin.person = new Person();
    this.resetVerifyAdminForm();
    this.editAdminDetails = true;
    this.verifyAdminStatus = false;
    this.ownerIsAdmin = false;
    this.ownerSavedAsAdmin = false;
  }

  /**
   *  This method is verify user is eligible for Establishment Admin Role
   * @param adminFormDetails
   * @memberof AddEstablishmentSCBaseComponent
   * CM-ERR-0017 - Person is less than 15 years old. Cannot be added as an admin
    CM-ERR-0004 - Person is dead. Cannot be added as an establishment admin
    CM-ERR-0001 - Person cannot be added as an establishment admin. Person details are not available in NIC.
   */
  verifyAdmin(adminFormDetails) {
    if (adminFormDetails) {
      setAdminForVerify(this, adminFormDetails);
      this.establishmentAdminService.verifyPersonDetails(this.establishmentAdmin.person, adminFormDetails).subscribe(
        personDetails => {
          setAdminAfterVerify(this, personDetails, adminFormDetails);
          scrollToTop();
        },
        err => {
          if (err.error) {
            this.showErrorMessage(err);
          }
        }
      );
    }
  }

  /**
   * This method is to save the admin details for the establishment
   * @param adminDetails
   * @memberof AddEstablishmentSCBaseComponent
   */
  saveEstablishmentAdminDetails(adminDetails) {
    if (adminDetails) {
      setAdminForSave(this, adminDetails);
      this.establishmentAdmin.roles = undefined;
      this.establishmentAdminService
        .saveAdminDetails(this.establishmentAdmin, this.establishment.registrationNo)
        .pipe(tap(res => (this.establishmentAdmin.person.personId = res.personId)))
        .subscribe(
          () => {
            this.adminSaved = true;
            this.nextForm();
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    }
  }

  /**
   * This method is to fetch the documents required to be scanned for Proactive verification
   * @memberof AddEstablishmentSCBaseComponent
   */
  getProActiveDocumentList() {
    if (this.establishment) {
      this.documentList$ = this.addEstablishmentService
        .getProActiveDocumentList(this.establishment.registrationNo)
        .pipe(
          mergeMap(docs => {
            return forkJoin(
              docs
                .map(doc => {
                  if (this.samaFailure || doc.documentTypeId !== 1422) {
                    doc = bindToObject(new DocumentItem(), doc);
                    return this.documentService.refreshDocument(
                      doc,
                      this.establishment.registrationNo,
                      undefined,
                      undefined,
                      this.referenceNo
                    );
                  }
                })
                .filter(doc => doc != undefined)
            ).pipe(
              map(docs => {
                return this.documentService.removeDuplicateDocs(docs);
              }),
              tap(docs => {
                if (this.samaFailure) {
                  this.proDocs = docs;
                } else {
                  this.proDocs = docs.filter(doc => doc.documentTypeId !== 1422);
                }
                this.handleDocumentSection();
              }),
              catchError(error => of(error))
            );
          }),
          tap(res => {
            if (!res.message) {
              if (this.samaFailure) {
                this.documentList = res;
              } else {
                this.documentList = res.filter(doc => doc.documentTypeId !== 1422);
              }
            }
            return this.documentList;
          })
        );
    }
  }

  /**
   * Method to get document list
   */
  getDocumentList(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        DocumentTransactionTypeEnum.REGISTER_ESTABLISHMENT,
        this.getDocumentType(),
        this.establishment.registrationNo,
        this.referenceNo
      )
      .pipe(tap(docs => (this.documentList = docs)));
  }

  /**
   * Method to get the document type based on some conditions
   */
  getDocumentType(): string {
    return getRegisterEstDocType(this);
  }

  /**
   * Method to get the document content
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    this.documentService
      .refreshDocument(document, this.establishment.registrationNo, undefined, undefined, this.referenceNo)
      .subscribe(res => (document = res));
  }
  /**
   * This method is to delete the document
   * @param item
   */
  deleteDocument(item: DocumentItem) {
    this.alertService.clearAlerts();
    if (item) {
      if (this.establishment && this.establishment.registrationNo) {
        this.documentService
          .deleteDocument(
            this.establishment.registrationNo,
            item.name.english,
            undefined,
            undefined,
            undefined,
            undefined,
            item.documentTypeId
          )
          .subscribe(
            res => {
              if (res) {
                return;
              }
            },
            err => {
              this.showErrorMessage(err);
            }
          );
      }
    }
  }

  /**
   * submit document
   * @memberof AddEstablishmentSCBaseComponent
   */
  submitDocument(comments: { comments: string }) {
    finalSubmitForRegisterEstablishment(this, comments);
  }

  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param bankName
   * @memberof AddEstablishmentSCBaseComponent
   */
  getBank(iBanCode) {
    this.isIbanMapped = true;
    this.bankNameList$ = this.lookUpService.getBankForIban(iBanCode).pipe(
      switchMap(res => {
        if (res?.items?.length > 0) {
          return of(res);
        } else {
          this.isIbanMapped = false;
          return this.lookUpService.getSaudiBankList(true);
        }
      }),
      catchError(err => {
        this.showErrorMessage(err);
        return of(new LovList([]));
      })
    );
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    this.alertService.showError(err?.error?.message, err?.error?.details);
  }

  showVerifyError() {
    this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.VERIFY_ADMIN);
  }

  showOwnerVerifyError() {
    this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.VERIFY_OWNER);
  }

  /**
   * This method is to reset and unsubscibe all items while destroying
   */
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ownerChanged(): boolean {
    return (
      this.proactiveEstowners?.filter(
        owner => owner.recordAction === ActionTypeEnum.ADD || owner.recordAction === ActionTypeEnum.REMOVE
      )?.length > 0
    );
  }

  /**
   * If documents is required
   */
  handleDocumentSection() {
    const docSection = this.addProEstWizardItems.find(
      wizard => wizard.key === EstablishmentConstants.SEC_DOCUMENT_DETAILS
    );

    if (docSection) {
      docSection.hide = true;
      this.showDocumentSection = false;
      var nonRemovedOwners = this.proactiveEstowners?.filter(owner => owner.recordAction !== ActionTypeEnum.REMOVE);
      if (this.appToken === ApplicationTypeEnum.PUBLIC && this.establishment.proactive) {
        if (this.editEstablishment) {
          docSection.hide = false;
          this.showDocumentSection = true;
        } else if (this.mciError) {
          if (this.isIbanChanged && this.samaFailure) {
            if (this.ownerChanged()) {
              docSection.hide = false;
              this.showDocumentSection = true;
            }
          } else if (this.ownerChanged()) {
            docSection.hide = false;
            this.showDocumentSection = true;
          } else {
            docSection.hide = true;
            this.showDocumentSection = false;
          }
        } else if (
          nonRemovedOwners.length > 0 &&
          nonRemovedOwners.every(owner =>
            this.establishmentService.existInMci(owner.person.identity, this.currentOwners)
          )
        ) {
          if (this.isIbanChanged && this.samaFailure) {
            docSection.hide = false;
            this.showDocumentSection = true;
          } else {
            docSection.hide = true;
            this.showDocumentSection = false;
          }
        } else {
          if (this.proDocs?.length > 1 && this.ownerChanged()) {
            docSection.hide = false;
            this.showDocumentSection = true;
          } else {
            if (
              (EstablishmentConstants.LEGAL_ENTITY_WITHOUT_OWNER.indexOf(this.establishment.legalEntity.english) ===
                -1 &&
                this.proactiveEstowners?.filter(owner => owner.recordAction === ActionTypeEnum.ADD)?.length > 0) ||
              (EstablishmentConstants.LEGAL_ENTITY_PARTNERSHIP.indexOf(this.establishment.legalEntity.english) !== -1 &&
                this.proactiveEstowners?.filter(
                  owner => owner.recordAction === ActionTypeEnum.ADD || owner.recordAction === ActionTypeEnum.REMOVE
                )?.length > 0)
            ) {
              docSection.hide = false;
              this.showDocumentSection = true;
            }
          }
        }
      }
    }
  }
  setEstOwners(ownerList: Owner[]) {
    ownerList.forEach(owner => {
      if (owner.estOwner) this.estOwner.push(owner.estOwner);
    });
  }
}

