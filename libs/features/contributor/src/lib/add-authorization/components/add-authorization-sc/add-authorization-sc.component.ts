/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy, ViewChild, Inject, AfterViewInit, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {
  AddressTypeEnum,
  AuthorizationSource,
  DocumentTransactionId,
  DocumentTransactionType,
  FormWizardTypes,
  IbanType,
  MaxLengthEnum,
  TransactionId
} from '../../../shared/enums';
import {
  LovList,
  convertToYYYYMMDD,
  hijiriToJSON,
  ContactDetails,
  AlertService,
  scrollToTop,
  markFormGroupTouched,
  LookupService,
  WizardItem,
  getPersonName,
  IdentifierLengthEnum,
  DocumentService,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  DocumentItem,
  startOfDay,
  CommonIdentity,
  BPMUpdateRequest,
  Role,
  WorkFlowActions,
  WorkflowService,
  RouterConstants,
  setAddressFormToAddresses} from '@gosi-ui/core';
import { AddAuthorizationService, ContributorService } from '../../../shared/services';
import { catchError, map, switchMap, tap, toArray } from 'rxjs/operators';
import {
  AttorneyDetails,
  AttorneySaveResponse,
  BankAccounts,
  CustodyDetails,
  CustodySaveResponse,
  NonMOJSaveResponse,
  PersonalInformation,
  PersonBankDetails
} from '../../../shared/models';
import { AddressDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import { Router } from '@angular/router';
import { concat, forkJoin, noop, Observable, of } from 'rxjs';
import moment from 'moment';
import { MinorType } from '../../../shared/enums/minor-type';
import { createAuthPurposeForm, createCustomAuthDetailForm, MOJSmartForm, PersonDetailsSmartForm } from '../../forms';
import { Location } from '@angular/common';
import { ContributorRouteConstants } from '@gosi-ui/features/contributor';
import { AddAuthorizationBaseScComponent } from '../add-authorization-base.component';
import { AddAuthorizationCustodianDetailsDcComponent } from '../add-authorization-custodian-details-dc/add-authorization-custodian-details-dc.component';
import { AddCustomAuthorizationDetailsDcComponent } from '../add-custom-authorization-details-dc/add-custom-authorization-details-dc.component';
// import { AddAuthorizationBaseScComponent, AddAuthorizationCustodianDetailsDcComponent, AddCustomAuthorizationDetailsDcComponent } from '..';

enum RequiredDocuments {
  GUARDIANSHIP = 1,
  ATTORNEY = 2,
  AUTHORIZED_PERSON_ID = 3,
  FAMILY_REGISTER = 4,
  PARENT_ID = 5,
  CUSTODIAN_ID = 6,
  INTERNATIONAL_BANK_ACCOUNT_CERTIFICATE = 7
}
enum AuthType {
  ATTORNEY = 'Attorney',
  CUSTODY = 'Custody'
}
enum AuthSource {
  MOJ = 'Ministry of Justice',
  OTHER = 'Other Source'
}
interface EditAuthorizationState {
  authorizationId: number;
  isAttorney: boolean;
  isMOJ: boolean;
  authorizationDetails: AttorneyDetails | CustodyDetails;
  authorizedPerson: PersonalInformation;
  authorizedPersonIdentity: CommonIdentity;
  referenceNo: number;
  documents: Array<DocumentItem>;
  bankAccount: PersonBankDetails;
}
@Component({
  selector: 'cnt-add-authorization-sc',
  templateUrl: './add-authorization-sc.component.html',
  styleUrls: ['./add-authorization-sc.component.scss']
})
export class AddAuthorizationScComponent
  extends AddAuthorizationBaseScComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  /** Creates an instance of CancelVicScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly addAuthorizationService: AddAuthorizationService,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly lookupService: LookupService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) private appToken: string,
    private location: Location,
    readonly workflowService: WorkflowService
  ) {
    super(
      alertService,
      contributorService,
      documentService,
      addAuthorizationService,
      router,
      lookupService,
      fb,
      routerDataToken
    );
  }
  /** Local variables */
  isAttorney = true;
  isSourceMOJ = true;
  showCustomAuthorizationDetailsForm = false;
  contactDetail: ContactDetails;
  custodyDetails: CustodyDetails;
  attorneyDetails: AttorneyDetails;
  addressForms = new FormGroup({});
  authorizersBirthDate: FormArray = new FormArray([]);
  identifierLengthEnum = IdentifierLengthEnum;
  MAX_LENGTH_ENUM = MaxLengthEnum;
  transactionId = TransactionId.ADD_AUTHORIZATION;
  ibanType = IbanType.SELECT;
  personBankDetails$: Observable<BankAccounts>;
  personBankDetalis: PersonBankDetails;
  bankNameList$: Observable<LovList>;

  minorsNames = [];
  minorsType = new FormArray([]);
  authorizerPersonForm = new PersonDetailsSmartForm(this.fb);


  @ViewChild('addressDetails', { static: false })
  addressDcComponent: AddressDcComponent;
  @ViewChild('contactDetails', { static: false })
  contactDcComponent: ContactDcComponent;
  @ViewChild('custodianDetalisComponent', { static: false })
  custodianDetalisComponent: AddAuthorizationCustodianDetailsDcComponent;

  @ViewChild('customAuthorizationDetails', { static: false })
  customAuthorizationDetails: AddCustomAuthorizationDetailsDcComponent;

  authTypeList: LovList = new LovList([
    { value: { english: AuthType.ATTORNEY, arabic: 'وكالة' }, sequence: 1 },
    { value: { english: AuthType.CUSTODY, arabic: 'ولاية' }, sequence: 2 }
  ]);
  authSourceList: LovList = new LovList([
    { value: { english: AuthSource.MOJ, arabic: 'وزارة العدل' }, sequence: 1 },
    { value: { english: AuthSource.OTHER, arabic: 'مصدر آخر' }, sequence: 2 }
  ]);

  @Input() isIbanINKSA: string;

  isIbanINKSAFromBankDetails: string;

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.isEditMode = false;
    this.isAttorney = true;
    this.isSourceMOJ = true;
    this.showCustomAuthorizationDetailsForm = false;
    this.contactDetail = undefined;
    this.custodyDetails = undefined;
    this.attorneyDetails = undefined;
    this.addressForms = new FormGroup({});
    this.authorizersBirthDate = new FormArray([]);
    this.identifierLengthEnum = IdentifierLengthEnum;
    this.MAX_LENGTH_ENUM = MaxLengthEnum;
    this.transactionId = TransactionId.ADD_AUTHORIZATION;
    this.minorsNames = [];
    this.authorizerPersonForm = new PersonDetailsSmartForm(this.fb);
    this.mojAuthForm = new MOJSmartForm(this.fb);
    this.authPurposeForm = createAuthPurposeForm(this.fb);
    this.customAuthDetailsForm = createCustomAuthDetailForm(this.fb);
    this.personDetailsSmartForm = new PersonDetailsSmartForm(this.fb);
    this.bankDetailsForm = this.createBankDetailsForm();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.countryList = this.lookupService.getCountryList();
    this.cityList = this.lookupService.getCityList();
    this.genderList = this.lookupService.getGenderList();
    this.nationalityList = this.lookupService.getNationalityList();
    this.uuid = null;
    this.documents = [];
    this.activeTab = 0;
    this.totalTab = 3;
    this.wizardItems = undefined;
    this.person = undefined;
    this.authorizerList = [];
    this.authorizationId = undefined;
    this.referenceNo = undefined;
    this.ibanType = IbanType.NEW;
    this.personBankDetalis = undefined;
    this.initializeWizard();
    this.alertService.clearAllErrorAlerts();
  }

  onIsIbanINKSAChange(value: string) {
    this.isIbanINKSA = value;

    if (this.isIbanINKSA === 'No' && !this.isSourceMOJ){
        // update documents array              
        this.getRequiredDocuments(
          DocumentTransactionId.ADD_AUTHORIZATION,
          [DocumentTransactionType.ADD_AUTHORIZATION],
          docs =>
            docs
              .filter(doc => this.getRequiredDocumentList().includes(doc.sequenceNumber))
              .map(e => ({ ...e, required: true }))
        );
    }
    
    if (this.isIbanINKSA === 'No' && !this.isSourceMOJ && this.personDetailsSmartForm.isSaudi) {   
        this.addressDcComponent.selectedAddressType(this.addressDcComponent.foreignType);
        this.addressDcComponent.currentMailingAddress = this.addressDcComponent.foreignType;
        this.addressDcComponent.hasNationalAddress = false;
        this.addressDcComponent.isNationalMandatory = false;
        this.addressDcComponent.hasPOAddress = false;
        this.addressDcComponent.isPoMandatory = false;
                          
    } else {
       this.documents = this.documents.filter(doc => doc.sequenceNumber !== RequiredDocuments.INTERNATIONAL_BANK_ACCOUNT_CERTIFICATE);
       this.addressDcComponent.currentMailingAddress = this.addressDcComponent.nationalType;
        if (this.isSourceMOJ || this.personDetailsSmartForm.isSaudi){
          this.addressDcComponent.hasNationalAddress = true;
          this.addressDcComponent.hasPOAddress = false;
          this.addressDcComponent.hasOverseasAddress = true;
          this.addressDcComponent.mandatoryOverseasAddress = false;
          this.addressDcComponent.isPoMandatory = false;
          this.addressDcComponent.isNationalMandatory = true;
        }      
    }
    if (this.person && this.person.contactDetail && this.person.contactDetail.addresses) {
      this.person.contactDetail.addresses = setAddressFormToAddresses(this.addressForms);
    }      
    this.addressDcComponent.setAddresses();
  }
  

  ngAfterViewInit(): void {
    this.setDataIfEdit();
  }

  setDataIfEdit() {
    const state = this.location.getState() as EditAuthorizationState;
    if (!state.authorizationId) return;

    this.isEditMode = true;
    this.isAttorney = state.isAttorney;
    this.isSourceMOJ = state.isMOJ;
    this.person = state.authorizedPerson;
    this.referenceNo = state.referenceNo;
    this.documents = state.documents;
    this.authorizationId = state.authorizationId;

    if (this.isAttorney) {
      this.attorneyDetails = state.authorizationDetails as AttorneyDetails;
    } else {
      this.custodyDetails = state.authorizationDetails as CustodyDetails;
    }

    this.personBankDetails$ = concat(
      of([state.bankAccount]),
      this.getBankDetails(this.person.personId).pipe(map(v => v.bankAccountList))
    ).pipe(
      toArray(),
      map(v => {
        const account = new BankAccounts();
        account.bankAccountList = [].concat(...v).filter(
          // this will remove duplicate and flatten the array
          (value, index, self) => index === self.findIndex(t => t.ibanBankAccountNo === value.ibanBankAccountNo)
        );
        return account;
      })
    );

    if (state.isMOJ) {
      this.setMOJTransactionForEdit(state);
      this.setNextSection();
      if (!state.isAttorney) {
        this.addAuthorizationService
          .getCustodyTextContent(state.authorizedPersonIdentity.id, this.custodyDetails.custodyNumber)
          .subscribe(custodyText => {
            this.setCustodyText(custodyText.textContent);
          });
      }
    } else {
      this.setNonMOJTransactionForEdit(state);
      this.documents.forEach(doc => {
        this.refreshDocument(doc);
      });
      this.setNextSection();
    }
  }

  setNonMOJTransactionForEdit(state: EditAuthorizationState) {
    this.mojAuthForm.authSource.get('english').setValue(AuthSource.OTHER);
    this.addDocumentDetailsWizardItem();
    this.showCustomAuthorizationDetailsForm = true;
    this.personDetailsSmartForm.selectIdType(state.authorizedPersonIdentity.idType);
    this.personDetailsSmartForm.fillPersonDetails(this.person);
    this.personDetailsSmartForm.form.patchValue({
      id: state.authorizedPersonIdentity.id + '',
      idType: state.authorizedPersonIdentity.idType,
      idTypeList: { english: 'Not Needed' },
      nationality: {
        ...this.person.nationality
      },
      birthDate: {
        gregorian: moment(this.person.birthDate.gregorian).toDate(),
        hijiri: this.person.birthDate.hijiri.split('-').reverse().join('/')
      }
    });

    if (this.isAttorney) {
      this.customAuthDetailsForm.patchValue({
        authIssueDate: moment(this.attorneyDetails.issueDate.gregorian).toDate(),
        authExpiryDate: moment(this.attorneyDetails.endDate.gregorian).toDate(),
        countryOfIssue: {
          ...this.attorneyDetails.countryOfIssue
        }
      });
      this.authPurposeForm.setValue({
        isRequestBenefitPurpose: this.attorneyDetails.requestBenefitPurpose,
        isReceiveBenefitPurpose: this.attorneyDetails.receiveBenefitPurpose
      });
      // Typescript again, we need to do this to suppress the build error.
      this.authorizerList = this.attorneyDetails.authorizerList.map(e => {
        const form = new PersonDetailsSmartForm(this.fb);
        form.fillAuthorizerDetails(e);

        return {
          allowEdit: false,
          form
        };
      });
    } else {
      this.customAuthDetailsForm.patchValue({
        authIssueDate: moment(this.custodyDetails.custodyDate.gregorian).toDate(),
        countryOfIssue: {
          ...this.custodyDetails.countryOfIssue
        },
      });
      // Typescript again, we need to do this to suppress the build error.
      this.authorizerList = this.custodyDetails.minorList.map(e => {
        const form = new PersonDetailsSmartForm(this.fb);
        form.fillAuthorizerDetails(e);

        return {
          allowEdit: false,
          form
        };
      });
    }
  }

  setMOJTransactionForEdit(state: EditAuthorizationState) {
    this.mojAuthForm.authSource.get('english').setValue(AuthSource.MOJ);
    this.mojAuthForm.id.setValue(state.authorizedPersonIdentity.id);
    this.contactDetail = state.authorizedPerson.contactDetail;

    if (this.isAttorney) {
      this.mojAuthForm.authType.get('english').setValue(AuthType.ATTORNEY);
      this.selectedAuth();
      this.mojAuthForm.authNumber.setValue(this.attorneyDetails.attorneyNumber);
      this.mojAuthForm.birthDate.get('calendarType.english').setValue('GREGORIAN');
      this.mojAuthForm.birthDate.get('gregorian').setValue(moment(this.person.birthDate.gregorian).toDate());
      this.authPurposeForm.setValue({
        isRequestBenefitPurpose: this.attorneyDetails.requestBenefitPurpose,
        isReceiveBenefitPurpose: this.attorneyDetails.receiveBenefitPurpose
      });
      this.attorneyDetails.agent.id = state.authorizedPersonIdentity.id;
      this.attorneyDetails.agent.dateOfBirth = state.authorizedPerson.birthDate;
    } else {
      this.mojAuthForm.authType.get('english').setValue(AuthType.CUSTODY);
      this.selectedAuth();
      this.mojAuthForm.authNumber.setValue(this.custodyDetails.custodyNumber);
      this.custodyDetails.custodian.id = state.authorizedPersonIdentity.id;
      this.minorsType = new FormArray(
        this.custodyDetails.minorList.map(minor => {
          return this.fb.group({
            english: [
              minor.minorType === MinorType.AGE ? 'Age Minor' : 'Mentally Minor',
              { validators: Validators.required }
            ],
            arabic: [null],
            updateOn: 'blur'
          });
        })
      );
    }
  }

  /** Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }

  selectedAuth() {
    const isAttorney = this.mojAuthForm.authType.value.english === AuthType.ATTORNEY;

    if (isAttorney || !this.isSourceMOJ) {
      this.mojAuthForm.addBirthDate();
    } else {
      this.mojAuthForm.removeBirthDate();
    }

    this.isAttorney = isAttorney;
  }

  selectedAuthSource() {
    this.isSourceMOJ = this.mojAuthForm.authSource.value.english === AuthSource.MOJ;
    if (this.isSourceMOJ) {
      this.wizardItems.pop();
      this.totalTab--;
    } else {
      this.addDocumentDetailsWizardItem();
    }
  }

  addDocumentDetailsWizardItem() {
    this.wizardItems.push(new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
    this.totalTab++;
  }

  verifyPerson() {
    if (this.isSourceMOJ) {
      markFormGroupTouched(this.mojAuthForm.form);
      if (this.mojAuthForm.form.valid) {
        this.alertService.clearAllErrorAlerts();
        this.searchPerson();
      } else {
        scrollToTop();
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      markFormGroupTouched(this.personDetailsSmartForm.form);
      if (this.personDetailsSmartForm.form.valid) {
        this.alertService.clearAllErrorAlerts();
        this.searchPerson();
      } else {
        scrollToTop();
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }

  /** Method to navigate to next tab. */
  navigateToAddressSection(): void {
    this.setBankDetailsRequirement();
    if (this.isEditMode) {
      this.handleNext();
      this.progressWizard.setNextItem(this.activeTab);
      return;
    }

    forkJoin(
      this.authorizersBirthDate.controls.map((el, i) => {
        return this.contributorService.getPersonDetails(
          this.getIdQueryString(this.attorneyDetails.authorizerList[i].id) +
            `&birthDate=${convertToYYYYMMDD(el.get('gregorian').value)}`,
          new Map()
        );
      })
    )
      .pipe(catchError(error => of(error)))
      .subscribe(val => {
        // we will get an array if all requests succeeded
        if (Array.isArray(val)) {
          this.handleNext();
          this.progressWizard.setNextItem(this.activeTab);
        } else {
          this.showError(val);
        }
      });
  }

  searchPerson() {
    this.alertService.clearAlerts();
    const id = this.mojAuthForm.id.value?.toString();

    if (this.isSourceMOJ && this.isAttorney) {
      this.searchAttorney(id).subscribe(
        () => {
          this.setNextSection();
        },
        e => {
          this.showError(e);
        }
      );
    } else if (this.isSourceMOJ && !this.isAttorney) {
      this.searchCustodian(id).subscribe(noop, this.showError.bind(this));
    } else {
      this.searchNonMOJ().subscribe(
        () => {
          this.showCustomAuthorizationDetailsForm = true;
          this.setNextSection();
        },
        () => {
          this.personBankDetails$ = of(new BankAccounts());
          this.showCustomAuthorizationDetailsForm = true;
          this.setNextSection();
        }
      );
    }
    scrollToTop();
  }

  searchAttorney(id: string) {
    let query = this.getIdQueryString(id);

    if (this.mojAuthForm.birthDate.get('calendarType.english').value === 'GREGORIAN')
      query += `&birthDate=${convertToYYYYMMDD(this.mojAuthForm.birthDate.value.gregorian)}`;
    else query += `&birthDateH=${hijiriToJSON(this.mojAuthForm.birthDate.value.hijiri)}`;

    return this.addAuthorizationService.getAttorneyDetails(id, this.mojAuthForm.authNumber.value).pipe(
      tap(response => {
        if (response) {
          this.attorneyDetails = response;
          this.attorneyDetails.authorizerList.forEach(() =>
            this.authorizersBirthDate.push(
              this.fb.group({
                calendarType: this.fb.group({
                  english: ['GREGORIAN', { validators: Validators.required }],
                  arabic: [null],
                  updateOn: 'blur'
                }),
                gregorian: this.fb.control(null, [Validators.required])
              })
            )
          );
        }
      }),
      switchMap(() => {
        return this.contributorService.getPersonDetails(query, new Map()).pipe(
          tap((response: any) => {
            if (response) {
              this.person = response;
              this.contactDetail = response.contactDetail;
              this.attorneyDetails.agent.dateOfBirth = response.birthDate;
            }
          }),
          tap(_ => {
            this.personBankDetails$ = this.getBankDetails(this.person.personId);
          })
        );
      })
    );
  }

  searchCustodian(id: string) {
    return this.addAuthorizationService.getCustodyDetails(id, this.mojAuthForm.authNumber.value).pipe(
      tap(response => {
        if (response) {
          this.custodyDetails = response;
        }
      }),
      switchMap(result => {
        return this.contributorService
          .getPersonDetails(
            this.getIdQueryString(result.custodian.id.toString()) +
              `&birthDateH=${result.custodian.dateOfBirth.hijiri}`,
            new Map()
          )
          .pipe(
            tap((response: any) => {
              if (response) {
                this.person = response; // issue with API?;
                this.contactDetail = response.contactDetail;
              }
            }),
            tap(_ => {
              this.personBankDetails$ = this.getBankDetails(this.person.personId);
            })
          );
      }),
      switchMap(() => {
        this.setNextSection();
        return this.addAuthorizationService.getCustodyTextContent(id, this.mojAuthForm.authNumber.value).pipe(
          tap(custodyText => {
            this.setCustodyText(custodyText.textContent);
          }),
          catchError(err => {
            this.setPreviousSection();
            throw err;
          })
        );
      }),
      switchMap(() => {
        return forkJoin(
          this.custodyDetails.minorList.map(minor => {
            return this.contributorService.getPersonDetails(
              this.getIdQueryString(minor.id.toString()) + `&birthDateH=${minor.dateOfBirth.hijiri}`,
              new Map()
            );
          })
        ).pipe(
          tap(minors => {
            this.minorsNames = minors.map((minor: any) => {
              return {
                english: getPersonName(minor.name, 'en'),
                arabic: getPersonName(minor.name, 'ar')
              };
            });
            this.minorsType = new FormArray(
              minors.map(_ => {
                return this.fb.group({
                  english: ['Mentally Minor', { validators: Validators.required }],
                  arabic: [null],
                  updateOn: 'blur'
                });
              })
            );
          })
        );
      })
    );
  }

  setCustodyText(textContent: string) {
    const doc = this.custodianDetalisComponent.custodyTextIframe.nativeElement.contentDocument;
    doc.open();
    doc.write(textContent);
    doc.close();
  }

  searchNonMOJ() {
    return this.getPersonDetails(this.personDetailsSmartForm).pipe(
      tap((res: any) => {
        this.person = res;
      }),
      tap(_ => {
        this.personBankDetails$ = this.getBankDetails(this.person.personId);
      })
    );
  }

  verifyAuthorizer(form: PersonDetailsSmartForm) {
    this.alertService.clearAlerts();
    markFormGroupTouched(form.form);
    if (form.form.valid) {
      // Error if authorizer is the same as authorized person
      if (form.isSamePerson(this.personDetailsSmartForm)) {
        this.alertService.showErrorByKey('CONTRIBUTOR.ADD-AUTHORIZATION.SAME-AUTHORIZER-AND-AUTHORIZED-PERSON-ERROR');
        scrollToTop();
        return;
      }
      // Clear authorizer form if duplicate
      if (this.isAuthorizerAlreadyAdded(form)) {
        this.clearAuthorizer(form);
        return;
      }
      if (!this.isAttorney) form.addMinorType();
      this.getAge$(form)
        .pipe(
          switchMap(age => {
            form.age = age;
            return this.getPersonDetails(form);
          })
        )
        .subscribe(
          person => {
            form.fillPersonDetails(person);
            this.authorizerList.push({ allowEdit: false, form });
            this.clearAuthorizer(form);
          },
          () => {
            this.authorizerPersonForm.addPersonNameFields();
            this.customAuthorizationDetails.authorizerPersonComponent.authorizerNotFound();
            form.updateMinorTypeList();
          }
        );
    }
  }

  resetAuthorizer() {
    this.authorizerPersonForm = new PersonDetailsSmartForm(this.fb);
  }

  clearAuthorizer(form: PersonDetailsSmartForm) {
    this.resetAuthorizer();
    this.customAuthorizationDetails.authorizerPersonComponent.authorizerFound();
    form.updateMinorTypeList();
  }

  deleteAuthorizer(index: number) {
    this.authorizerList.splice(index, 1);
    if (this.authorizerList.length === 0) {
      this.customAuthorizationDetails.authorizerPersonComponent.addAuthorizer();
    }
  }

  editAuthorizer(index: number) {
    this.authorizerPersonForm = this.authorizerList[index].form;
    this.customAuthorizationDetails.authorizerPersonComponent.authorizerNotFound();
  }

  addAuthorizerToList() {
    markFormGroupTouched(this.authorizerPersonForm.form);
    if (this.authorizerPersonForm.form.valid) {
      this.alertService.clearAllErrorAlerts();
      if (!this.isAuthorizerAlreadyAdded(this.authorizerPersonForm)) {
        this.authorizerList.push({ allowEdit: true, form: this.authorizerPersonForm });
      }
      this.authorizerPersonForm.updateMinorTypeList();
      this.resetAuthorizer();
      this.customAuthorizationDetails.authorizerPersonComponent.authorizerFound();
    } else {
      scrollToTop();
      this.alertService.showMandatoryErrorMessage();
    }
  }

  getAge$(form: PersonDetailsSmartForm) {
    if (form.isGregorianBirthDate) {
      return of(moment().diff(moment(form.birthDate.get('gregorian').value), 'years'));
    } else {
      return this.lookupService.getGregorianDate(hijiriToJSON(form.birthDate.get('hijiri').value)).pipe(
        switchMap(date => {
          return of(moment().diff(moment(date.gregorian), 'years'));
        })
      );
    }
  }

  isAuthorizerAlreadyAdded(person: PersonDetailsSmartForm) {
    return this.authorizerList.some(el => person.isSamePerson(el.form));
  }

  getPersonDetails(form: PersonDetailsSmartForm) {
    let query = `nationality=${form.nationality.get('english').value}&`;
    if (form.isSaudi) {
      query += `NIN=`;
    } else if (form.isGcc) {
      query += `gccId=`;
    } else if (form.isPassport) {
      query += `passportNo=`;
    } else if (form.isIqama) {
      query += `iqamaNo=`;
    } else {
      query += `borderNo=`;
    }
    query += form.id.value;

    if (form.isGregorianBirthDate) query += `&birthDate=${convertToYYYYMMDD(form.birthDate.get('gregorian').value)}`;
    else query += `&birthDateH=${hijiriToJSON(form.birthDate.get('hijiri').value)}`;

    return this.contributorService.getPersonDetails(query, new Map());
  }

  getRequiredDocumentList(): number[] {
    const form = this.personDetailsSmartForm;
    
   // Check if the person is from Saudi Arabia, has 'No' IBAN in KSA, and is not from MOJ source
   if (this.isIbanINKSA != undefined){
     if (this.isIbanINKSA === 'No' && !this.isSourceMOJ) {
        // Return the required documents for the specified condition
          return [RequiredDocuments.ATTORNEY, RequiredDocuments.AUTHORIZED_PERSON_ID, RequiredDocuments.INTERNATIONAL_BANK_ACCOUNT_CERTIFICATE];
    }
  }
    if (this.isAttorney) return [RequiredDocuments.ATTORNEY, RequiredDocuments.AUTHORIZED_PERSON_ID];

    if (form.isSaudi && form.isParent) return [RequiredDocuments.FAMILY_REGISTER, RequiredDocuments.PARENT_ID];
    
    // this is for Saudi and not parent
    // and for all non Saudis
    return [RequiredDocuments.GUARDIANSHIP, RequiredDocuments.CUSTODIAN_ID];
  }

  saveMOJ() {
    const details = {
      ...(this.isAttorney ? this.attorneyDetails : this.custodyDetails)
    };
    details.authorizationSource = AuthorizationSource.MOJ;

    if (!this.isAttorney) {
      (details as CustodyDetails).minorList.forEach((minor, i) => {
        minor['minorType'] =
          this.minorsType.at(i).get('english').value === 'Age Minor' ? MinorType.AGE : MinorType.MENTAL;
      });
    }

    // We need to use this in order to narrow the union type for TypeScript
    if ('requestBenefitPurpose' in details) {
      details.requestBenefitPurpose = this.authPurposeForm.get('isRequestBenefitPurpose').value;
      details.receiveBenefitPurpose = this.authPurposeForm.get('isReceiveBenefitPurpose').value;
    }

    if (this.isAddressTabActive()) {
      if (!this.isValidAddress()) {
        this.alertService.showMandatoryErrorMessage();
        this.contactDcComponent.contactDetailsForm.markAllAsTouched();
        this.bankDetailsForm.markAllAsTouched();
      } else {
        this.setPersonAddressAndContactDetails();
        this.setBankDetails(details);
        if ('attorneyText' in details) {
          details.attorneyText = null;
        }
        this.addAuthorizationService
          .updateAddress(this.person, this.person.personId)
          .pipe(
            switchMap(res => {
              this.alertService.showSuccess(res.bilingualMessage);
              if (this.isEditMode) {
                return this.callAuthorizationServiceFn(
                  this.isAttorney
                    ? this.addAuthorizationService.updateMOJAttorneyDetails
                    : this.addAuthorizationService.updateMOJCustodyDetails,
                  details,
                  this.authorizationId
                );
              } else {
                return this.callAuthorizationServiceFn(
                  this.isAttorney
                    ? this.addAuthorizationService.saveAttorneyDetails
                    : this.addAuthorizationService.saveCustodyDetails,
                  details
                ).pipe(
                  switchMap((res: AttorneySaveResponse | CustodySaveResponse) => {
                    return this.callAuthorizationServiceFn(
                      this.isAttorney
                        ? this.addAuthorizationService.patchMOJAttorneyDetails
                        : this.addAuthorizationService.patchMOJCustodyDetails,
                      details,
                      res.id
                    );
                  })
                );
              }
            })
          )
          .subscribe((result: AttorneySaveResponse | CustodySaveResponse) => {
            if (this.isEditMode) {
              this.saveWorkflowInEdit();
              //this.navigateBackToTransaction();
            } else {
              this.alertService.showSuccess(result.bilingualMessage);
              this.refresh();
            }
          }, this.showError.bind(this));
      }
    }
  }

  getNonMOJRequestBody() {
    const id = this.personDetailsSmartForm.id.value;
    const details = {
      authorizationSource: AuthorizationSource.OTHER,
      [this.isAttorney ? 'agent' : 'custodian']: {
        id,
        fullName: [
          this.person.name?.arabic?.firstName,
          this.person.name?.arabic?.secondName,
          this.person.name?.arabic?.thirdName,
          this.person.name?.arabic?.familyName
        ]
          .filter(Boolean)
          .join(' '),
        sex: { ...this.person.sex },
        nationality: { ...this.personDetailsSmartForm.nationality.value },
        dateOfBirth: {
          gregorian: this.personDetailsSmartForm.isGregorianBirthDate
            ? startOfDay(this.personDetailsSmartForm.birthDate.get('gregorian').value)
            : null,
          hijiri: this.personDetailsSmartForm.isHijriBirthDate
            ? hijiriToJSON(this.personDetailsSmartForm.birthDate.get('hijiri').value)
            : null
        }
      },
      [this.isAttorney ? 'authorizerList' : 'minorList']: this.authorizerList.map(e => {
        const { calendarType, ...birthDate } = e.form.birthDate.value;
        if (birthDate.hijiri) birthDate.hijiri = hijiriToJSON(birthDate.hijiri);
        const person = {
          id: e.form.id.value,
          fullName: e.form.arabicFullName,
          sex: e.form.gender.value,
          nationality: e.form.nationality.value,
          dateOfBirth: birthDate
        };
        if (e.form.minorType) {
          person['minorType'] = e.form.minorType.value.english === 'Age Minor' ? MinorType.AGE : MinorType.MENTAL;
        }
        return person;
      }),
      countryOfIssue: { ...this.customAuthDetailsForm.get('countryOfIssue').value },
      [this.isAttorney ? 'issueDate' : 'custodyDate']: {
        gregorian: startOfDay(this.customAuthDetailsForm.get('authIssueDate').value)
      }
    };
    if (this.isAttorney) {
      details.receiveBenefitPurpose = this.authPurposeForm.get('isReceiveBenefitPurpose').value;
      details.requestBenefitPurpose = this.authPurposeForm.get('isRequestBenefitPurpose').value;
      details.endDate = {
        gregorian: startOfDay(this.customAuthDetailsForm.get('authExpiryDate').value)
      };
    }
    this.setBankDetails(details);
    return details;
  }

  callAuthorizationServiceFn(saveFn, ...details) {
    return saveFn.call(this.addAuthorizationService, ...details);
  }

  saveDraftNonMOJAuthorization() {
    markFormGroupTouched(this.personDetailsSmartForm.form);
    if (this.personDetailsSmartForm.form.valid) {
      this.alertService.clearAllErrorAlerts();
      let authorizedPerson = this.personDetailsSmartForm.getAuthorizationPerson();
      if (this.person)
        authorizedPerson = {
          ...authorizedPerson,
          name: this.person.name,
          sex: this.person.sex
        };
      this.addAuthorizationService
        .registerAuthorizationPerson(authorizedPerson)
        .pipe(
          switchMap(res => {
            return this.contributorService.getPersonById(res.id);
          }),
          switchMap(res => {
            this.person = res;
            return forkJoin(
              this.authorizerList.map(authorizer => {
                return this.addAuthorizationService
                  .registerAuthorizationPerson(authorizer.form.getAuthorizationPerson())
                  .pipe(
                    tap(() => {
                      authorizer.form.showName = false;
                    })
                  );
              })
            );
          }),
          switchMap(() => {
            if (this.authorizationId) {
              return this.callAuthorizationServiceFn(
                this.isAttorney
                  ? this.addAuthorizationService.updateNonMOJAttorneyDetails
                  : this.addAuthorizationService.updateNonMOJCustodyDetails,
                this.getNonMOJRequestBody(),
                this.authorizationId
              );
            } else {
              let details = this.getNonMOJRequestBody();
              // don't send IBAN when creating draft
              details.ibanBankAccountNo = null;

              return this.callAuthorizationServiceFn(
                this.isAttorney
                  ? this.addAuthorizationService.saveNonMOJAttorneyDetails
                  : this.addAuthorizationService.saveNonMOJCustodyDetails,
                details
              );
            }
          }),
          tap((result: NonMOJSaveResponse) => {
            this.authorizationId = result.id;
            if (result.referenceNumber) {
              this.referenceNo = result.referenceNumber;
            }
            if (!this.isEditMode) {
              this.getRequiredDocuments(
                DocumentTransactionId.ADD_AUTHORIZATION,
                [DocumentTransactionType.ADD_AUTHORIZATION],
                docs =>
                  docs
                    .filter(doc => {
                      return this.getRequiredDocumentList().some(seq => seq === doc.sequenceNumber);
                    })
                    .map(e => {
                      e.required = true;
                      return e;
                    })
              );
            } else {
              this.documents.forEach(doc => {
                doc.required = true;
              });
            }
          })
        )
        .subscribe(() => {
          this.handleNext();
          this.progressWizard.setNextItem(this.activeTab);
          this.resetAuthorizer();
          this.setBankDetailsRequirement();
        }, this.showError.bind(this));
    } else {
      scrollToTop();
      this.alertService.showMandatoryErrorMessage();
    }
  }

  completeNonMOJAuthorization() {
    this.alertService.clearAllErrorAlerts();
    if (!this.checkDocuments()) {
      scrollToTop();
      this.alertService.showMandatoryDocumentsError();
      return;
    }

    let complete;
    if (this.isEditMode) {
      complete = this.callAuthorizationServiceFn(
        this.isAttorney
          ? this.addAuthorizationService.updateNonMOJAttorneyDetails
          : this.addAuthorizationService.updateNonMOJCustodyDetails,
        this.getNonMOJRequestBody(),
        this.authorizationId
      );
    } else {
      complete = this.callAuthorizationServiceFn(
        this.isAttorney
          ? this.addAuthorizationService.patchNonMOJAttorneyDetails
          : this.addAuthorizationService.patchNonMOJCustodyDetails,
        this.getNonMOJRequestBody(),
        this.authorizationId
      );
    }

    complete.subscribe((result: AttorneySaveResponse | CustodySaveResponse) => {
      if (this.isEditMode) {
        this.saveWorkflowInEdit();
        //this.navigateBackToTransaction();
      } else {
        this.alertService.showSuccess(result.bilingualMessage);
        this.refresh();
      }
    }, this.showError.bind(this));
  }

  refreshDocument(document: DocumentItem) {
    super.refreshDocument(
      document,
      this.authorizationId,
      DocumentTransactionId.ADD_AUTHORIZATION,
      DocumentTransactionType.ADD_AUTHORIZATION,
      this.referenceNo,
      this.uuid
    );
  }

  navigateBackToTransaction() {
    // TODO
    this.router.navigateByUrl(ContributorRouteConstants.ROUTE_ADD_AUTHORIZATION_VALIDATOR);
  }

  changeIbanType(type: IbanType) {
    this.ibanType = type;
  }

  selectBankAccount(details: PersonBankDetails) {
    this.ibanType = IbanType.SELECT;
    this.personBankDetalis = details;
  }

  getBankDetails(personId: number) {
    return this.contributorService.getBankDetailsByPersonId(personId);
  }

  setBankDetails(details) {

    const ibanAccountNo = this.bankDetailsForm.get('ibanAccountNo');
    const nonSaudiIbanAccNo = this.bankDetailsForm.get('nonSaudiIbanAccNo');

   details.ibanBankAccountNo = ibanAccountNo?.get('english')?.value ?? nonSaudiIbanAccNo?.value;
   details.swiftCode = this.bankDetailsForm.get('swiftCode')?.value;

  const nonSaudiBankNameValue = this.bankDetailsForm.get('nonSaudiBankName')?.value;
  details.bankName = { english: nonSaudiBankNameValue, arabic: nonSaudiBankNameValue };
 
  }

  getBank(iBanCode: string) {
    this.bankNameList$ = this.lookupService.getBankForIban(iBanCode).pipe(
      catchError(err => {
        this.showError(err);
        return of(new LovList([]));
      })
    );
  }

  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit() {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = Role.VALIDATOR_1;
    workflowData.taskId = this.routerDataToken.taskId;
    workflowData.user = this.routerDataToken.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.referenceNo = this.referenceNo.toString();
    workflowData.comments = '';
    this.workflowService.updateTaskWorkflow(workflowData).subscribe(
      _ => {
        this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.VALIDATOR-EDIT-MESSAGE');
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      },
      err => {
        this.showError(err);
      }
    );
  }
}
