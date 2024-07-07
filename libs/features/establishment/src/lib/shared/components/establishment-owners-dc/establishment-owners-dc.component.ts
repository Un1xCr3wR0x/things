/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AddressTypeEnum,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BorderNumber,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  IdentityTypeEnum,
  Iqama,
  LanguageToken,
  LovList,
  markFormGroupTouched,
  markFormGroupUntouched,
  NationalId,
  NIN,
  Passport,
  Person,
  RouterConstants
} from '@gosi-ui/core';
import { AccordionComponent } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, Observable, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { EstablishmentConstants } from '../../constants';
import { EmployeeDetailsDcComponent } from '../employee-details-dc/employee-details-dc.component';
import { SearchEmployeeDcComponent } from '../search-employee-dc/search-employee-dc.component';
import { EstablishmentOwner } from '@gosi-ui/core/lib/models/establishment-owner';
import { EstablishmentService } from '../../services';
import { LegalEntityEnum } from '../../enums';
import { Owner, isLegalEntityPartnership } from '@gosi-ui/features/establishment';

@Component({
  selector: 'est-establishment-owners-dc',
  templateUrl: './establishment-owners-dc.component.html',
  styleUrls: ['./establishment-owners-dc.component.scss']
})
export class EstablishmentOwnersDcComponent extends BaseComponent implements OnInit {
  @ViewChild('addOwnerAccordian', { static: true })
  addOwnerAccordian: AccordionComponent;
  @ViewChildren(SearchEmployeeDcComponent) searchEmployeeComponent!: QueryList<SearchEmployeeDcComponent>;
  @ViewChildren(EmployeeDetailsDcComponent) employeeComponent!: QueryList<EmployeeDetailsDcComponent>;

  //Local Variables
  ownerForms: FormGroup;
  isFormEmpty = false;
  submitted = false;
  gccNationality = false;
  isProactiveOwnerDirectChange: boolean = false;
  isDirectChange = false;
  isMatchingMciOwner: boolean[] = [];
  totalTabs = 0;
  lang: string;
  modalRef: BsModalRef;
  adminIndex: number;
  private _ownerSavedAsAdmin = true;
  @Input() establishment = new Establishment();
  currentTab = 0;
  _isSubmit = false;
  // Constants
  arabicNameMax = EstablishmentConstants.PERSON_NAME_ARABIC_MAX_LENGTH;
  nameMinimumLength = EstablishmentConstants.PERSON_NAME_MIN_LENGTH;
  englishNameMax = EstablishmentConstants.PERSON_NAME_ENGLISH_MAX_LENGTH;
  currentOwners: any[] = [];
  mciError: boolean = false;

  //Input Variables

  @Input() persons: Person[] = [];
  @Input() estOwners: EstablishmentOwner[] = [];
  @Input() cityList$: Observable<LovList>;
  @Input() gccCountryList$: Observable<LovList>;
  @Input() cityList: LovList = null;
  @Input() gccCountryList: LovList = null;
  @Input() editPersonDetails: boolean[];
  @Input() verifyPersonStatus: boolean[];
  @Input() isOwnerSaved: boolean[];
  @Input() gccEstablishment = true;
  @Input() ownerCountIncludingEstablishmentAsOwner: number;
  @Input() genderList$: Observable<LovList>;
  @Input() ownerDeleted$: Observable<number>;
  @Input() set ownerCurrentTab(currentTab) {
    if (currentTab !== undefined) {
      this.currentTab = -1;
      /*Owner Tab*/
      if (currentTab === 3) {
        this.initialiseOwners();
      }
    }
  }

  @Input() nationalityList$: Observable<LovList>;
  @Input() isProActive = false;
  @Input() isIndividual: boolean;
  @Input() noOfOwners: number;
  @Input() molOwnerPersonId = [];
  @Input() showOwnerAsAdmin = true;
  @Input() set isSubmit(value: boolean) {
    this._isSubmit = value;
  }
  get isSubmit() {
    return this._isSubmit;
  }

  @Input()
  set ownerSavedAsAdmin(bool) {
    if (bool !== undefined) {
      this._ownerSavedAsAdmin = bool;
    }
  }

  get ownerSavedAsAdmin() {
    return this._ownerSavedAsAdmin;
  }

  @Input() legalEntity: string = '';

  @Input() isEstablishmentFromMci: boolean = true;
  @Input() isEstMci: boolean = true;
  @Input() isOnePartner: boolean = false;

  //Output Variables
  @Output() addOwner: EventEmitter<void> = new EventEmitter();
  @Output() ownerIsAdmin: EventEmitter<number> = new EventEmitter();
  @Output() ownerNotAdmin: EventEmitter<void> = new EventEmitter();
  @Output() deleteOwner: EventEmitter<number> = new EventEmitter();
  @Output() verify: EventEmitter<object> = new EventEmitter();
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() next: EventEmitter<void> = new EventEmitter();
  @Output() formInvalid: EventEmitter<void> = new EventEmitter();
  @Output() ownerMismatch: EventEmitter<void> = new EventEmitter();
  @Output() ownerNotSaved: EventEmitter<void> = new EventEmitter();
  @Output() ownerNotVerified: EventEmitter<void> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();
  @Output() keepDraft: EventEmitter<null> = new EventEmitter();
  @Output() updateMciDetails: EventEmitter<{ mciError: boolean; mciOwners: any[] }> = new EventEmitter();

  /**
   * This method is used to initialise the component
   * @param fb
   *
   */
  constructor(
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly establishmentService: EstablishmentService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData
  ) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof PersonDetailsDcComponent
   */
  ngOnInit() {
    this.createOwnerForms();
    this.language.subscribe(language => (this.lang = language));
  }

  private initialiseOwners(): void {
    this.isOnePartner =
      this.establishment?.crn?.number &&
      this.establishment?.unifiedNationalNumber &&
      this.establishment?.onePartner &&
      isLegalEntityPartnership(this.establishment?.legalEntity?.english);

    if (
      this.appToken === ApplicationTypeEnum.PUBLIC &&
      this.establishment?.registrationNo &&
      this.establishment?.crn?.number &&
      this.establishment?.unifiedNationalNumber
    ) {
      this.establishmentService
        .getMciOwners(this.establishment?.registrationNo)
        .toPromise()
        .then(res => {
          this.currentOwners = res;
          this.currentOwners = this.splitOwners[0];
        })
        .catch(() => {
          this.mciError = true;
        })
        .finally(() => {
          this.updateMciDetails.emit({ mciError: this.mciError, mciOwners: this.currentOwners });
        });
    }
  }

  /**
   * This method is used to first and only owner.
   */
  createOwnerForms() {
    this.ownerForms = this.fb.group({
      owners: this.fb.array([])
    });
    if (this.persons.length === 0 && this.estOwners.length === 0) {
      this.addOwner.emit();
    }
    this.totalTabs = (this.ownerForms.controls.owners as FormArray).length;
    this.selectPanel(true, this.totalTabs);
  }

  /**
   * This method is used to initialise the form template
   */
  createPersonForm() {
    //TODO: why contact details form inside this one
    return this.fb.group({
      index: [],
      iqamaNo: [
        null,
        {
          validators: Validators.compose([Validators.pattern('[0-9]+'), Validators.required]),
          updateOn: 'blur'
        }
      ],
      newNin: [
        null,
        {
          validators: Validators.compose([Validators.pattern('[0-9]+'), Validators.required]),
          updateOn: 'blur'
        }
      ],
      passportNo: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: ''
      }),
      nationality: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      idType: '',
      name: this.fb.group({
        english: this.fb.group({
          name: [
            null,
            {
              validators: Validators.compose([
                Validators.minLength(this.nameMinimumLength),
                Validators.maxLength(this.englishNameMax)
              ]),
              updateOn: 'blur'
            }
          ]
        }),
        arabic: this.fb.group({
          secondName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.arabicNameMax)]),
              updateOn: 'blur'
            }
          ],
          firstName: [
            null,
            {
              validators: Validators.compose([
                Validators.required,
                Validators.minLength(this.nameMinimumLength),
                Validators.maxLength(this.arabicNameMax)
              ]),
              updateOn: 'blur'
            }
          ],
          familyName: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.maxLength(this.arabicNameMax)]),
              updateOn: 'blur'
            }
          ],
          thirdName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.arabicNameMax)]),
              updateOn: 'blur'
            }
          ]
        })
      }),
      id: [null, { updateOn: 'blur' }],
      sex: this.fb.group({
        arabic: [],
        english: [null, Validators.required]
      }),
      isAdmin: false,
      contactDetail: this.fb.group({
        telephoneNo: this.fb.group({
          primary: [
            '',
            {
              updateOn: 'blur'
            }
          ],
          extensionPrimary: [
            '',
            {
              updateOn: 'blur'
            }
          ]
        }),
        emailId: this.fb.group({
          primary: [
            '',
            {
              updateOn: 'blur'
            }
          ]
        }),
        mobileNo: this.fb.group({
          primary: [
            '',
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
              updateOn: 'blur'
            }
          ],
          isdCodePrimary: [null, { updateOn: 'blur' }]
        }),
        addresses: this.fb.array([]),
        currentMailingAddress: null
      })
    });
  }

  /**
   * Method to create address forms
   */
  createAddressForm() {
    return this.fb.group({
      country: null,
      city: null,
      postalCode: null,
      postBox: null,
      buildingNo: null,
      district: null,
      streetName: null,
      additionalNo: null,
      unitNo: null,
      type: null,
      cityDistrict: null,
      detailedAddress: null
    });
  }

  /**
   * This is used to check for any values changes in and restrict next and previous button
   */
  checkForValuesChanges(index: number) {
    if (this.isOwnerSaved[index]) {
      this.progress.emit();
    }
  }

  /**
   * This method is make the owner as admin
   * @param val
   * @param index
   */
  choseAdmin(val, index) {
    if (this.adminIndex !== index && !this.ownerSavedAsAdmin && this.adminIndex) {
      this.nextPanel(this.adminIndex + 1);
      const previousVal = (<FormArray>this.ownerForms.controls.owners).controls[this.adminIndex].get('isAdmin').value;
      this.ownerNotSaved.emit();
      this.setAsAdmin((<FormArray>this.ownerForms.controls.owners).controls, this.adminIndex, previousVal);
      return;
    }
    this.adminIndex = val === true ? index : undefined;
    this.progress.emit();
    if (val === true) {
      this.setAsAdmin((<FormArray>this.ownerForms.controls.owners).controls, index);
      this.ownerIsAdmin.emit(index);
    } else {
      this.ownerNotAdmin.emit();
    }
  }

  setAsAdmin(ownerControls: AbstractControl[], index: number, value = true) {
    ownerControls.some((formGroup, i) => {
      if (i !== index) {
        formGroup.get('isAdmin').setValue(false);
      } else {
        formGroup.get('isAdmin').setValue(value);
      }
      return false;
    });
  }

  /**
   * This method is to add owners
   */
  addOwnerForm() {
    //If proactive no limit in adding owners
    if (this.isProActive) {
      this.createOwnerForm();
    } else if (this.noOfOwners && (this.ownerForms.controls.owners as FormArray).length < this.noOfOwners) {
      this.createOwnerForm();
    }
    this.progress.emit();
    this.addOwner.emit();
  }

  /** Method to create owner form. */
  createOwnerForm() {
    (this.ownerForms.controls.owners as FormArray).push(this.createPersonForm());
    this.editPersonDetails.push(true);
    this.verifyPersonStatus.push(false);
    this.isOwnerSaved.push(false);
    this.isMatchingMciOwner.push(true);
    this.totalTabs = (<FormArray>this.ownerForms.controls.owners).length;
    this.nextPanel(this.totalTabs);
  }

  /**
   * This method is to delete owners
   */
  deleteOwnerForm(index) {
    if (this.adminIndex !== index && !this.ownerSavedAsAdmin && this.adminIndex) {
      this.nextPanel(this.adminIndex);
      this.ownerNotSaved.emit();
    }
    if ((this.ownerForms.controls.owners as FormArray).length !== 0) {
      this.deleteOwner.emit(index);
    }
    this.modalRef?.hide();

    of(1)
      .pipe(
        delay(100),
        switchMap(() => {
          if (this.ownerDeleted$) {
            return this.ownerDeleted$.pipe(
              tap(ownerIndex => {
                if (ownerIndex === index) {
                  (this.ownerForms.controls.owners as FormArray).controls.splice(index, 1);
                  this.editPersonDetails.splice(index, 1);
                  this.verifyPersonStatus.splice(index, 1);
                  this.isOwnerSaved.splice(index, 1);
                  this.isMatchingMciOwner.splice(index, 1);
                  this.totalTabs = (<FormArray>this.ownerForms.controls.owners).length;
                  this.nextPanel(-1);
                }
                if ((this.ownerForms.controls.owners as FormArray).length === 0) {
                  this.addOwnerForm();
                }
              })
            );
          } else {
            return of(null);
          }
        }),
        tap(() => {
          if (this.adminIndex === index) {
            this.adminIndex = undefined;
          } else if (this.adminIndex > index) {
            this.adminIndex -= 1;
          }
        })
      )
      .subscribe(noop);
  }

  /**
   * This method is to save individual owner
   * @param index
   */
  saveOwner(index) {
    this.aggregateAllOwners(index);
    if (
      this.appToken === ApplicationTypeEnum.PUBLIC &&
      this.isEstMci &&
      !this.checkForMciOwnerMatch(index) &&
      !this.mciError
    ) {
      this.isMatchingMciOwner[index] = false;
      this.ownerMismatch.emit();
    } else {
      this.isMatchingMciOwner[index] = true;
      if (this.isFormValid(index)) {
        this.markAllFormsAsUntouched();
        this.submit.emit({
          owners: (<FormArray>this.ownerForms.controls.owners).getRawValue(),
          index: index,
          ownerIsAdmin: (this.ownerFormArray.controls[index] as FormGroup)?.get('isAdmin')?.value === true
        });
        this.employeeComponent.some((person, personIndex) => {
          if (personIndex <= index) {
            person.submitted = true;
            return true;
          }
        });
      } else {
        this.formInvalid.emit();
      }
    }
  }

  private checkForMciOwnerMatch(saveIndex): boolean {
    let ownerMatch = false;
    this.employeeComponent.find((employee, index) => {
      if (index === saveIndex) {
        ownerMatch = this.establishmentService.existInMci(employee.person.identity, this.currentOwners);
        return true;
      }
    });

    return ownerMatch;
  }

  /**
   * Check if the owner form is valid before saving
   * @param saveIndex
   */
  isFormValid(saveIndex): boolean {
    let formValid = true;
    this.employeeComponent.some((person, index) => {
      markFormGroupTouched(person.personForm);
      if (index === saveIndex) {
        this.isFormEmpty = true;
        this.areChildFieldsFilled(person.personForm);
        if (!this.isFormEmpty) {
          if (
            person.personForm.invalid ||
            person.contactDcComponent.contactDetailsForm.invalid ||
            !person.addressDcComponent.getAddressValidity()
          ) {
            formValid = false;
          }
        }
        return false;
      }
    });
    this.searchEmployeeComponent.some((searchPerson, index) => {
      markFormGroupTouched(searchPerson.verifyPersonForm);

      if (searchPerson.verifyPersonForm) {
        if (index === saveIndex) {
          this.isFormEmpty = true;
          this.areChildFieldsFilled(searchPerson.verifyPersonForm);
          if (!this.isFormEmpty) {
            if (searchPerson.verifyPersonForm.invalid) {
              formValid = false;
            }
          }
          return false;
        }
      }
    });
    return formValid;
  }

  /**
   * This method is to check for the owner in the Data base
   * @param ownerIdentifiers
   */
  verifyOwner(ownerIdentifiers, index) {
    let isFormsValid = false;
    this.searchEmployeeComponent.some((verify, i) => {
      if (i === index) {
        markFormGroupTouched(verify.verifyPersonForm);
        if (verify.verifyPersonForm.invalid) {
          isFormsValid = false;
          return true;
        } else isFormsValid = true;
      }
    });
    if (isFormsValid) {
      this.verify.emit({ ownerFormDetails: ownerIdentifiers, index: index });
      this.searchEmployeeComponent.some((person, personIndex) => {
        if (index === personIndex) {
          person.submitted = true;
          return true;
        }
      });
    } else {
      this.formInvalid.emit();
    }
  }

  /**
   * This method is used to check if every owner is verified
   */
  ownerVerified() {
    let verified = true;
    this.searchEmployeeComponent.forEach(person => {
      if (!person.submitted) {
        verified = false;
      }
    });
    return verified;
  }

  /**
   * This method is used to check all the forms validity
   */
  isFormsValid() {
    let formValid = true;
    this.employeeComponent.forEach(person => {
      markFormGroupTouched(person.personForm);
      this.isFormEmpty = true;
      this.areChildFieldsFilled(person.personForm);
      if (!this.isFormEmpty) {
        if (
          person.personForm?.invalid ||
          person.contactDcComponent?.contactDetailsForm?.invalid ||
          !person.addressDcComponent?.getAddressValidity()
        ) {
          formValid = false;
        }
      }
    });
    this.searchEmployeeComponent.forEach(searchPerson => {
      markFormGroupTouched(searchPerson.verifyPersonForm);

      if (searchPerson.verifyPersonForm) {
        this.isFormEmpty = true;
        markFormGroupTouched(searchPerson.verifyPersonForm);
        this.areChildFieldsFilled(searchPerson.verifyPersonForm);
        if (!this.isFormEmpty) {
          if (searchPerson.verifyPersonForm.invalid) {
            formValid = false;
          }
        }
      }
    });
    return formValid;
  }

  nextScreen() {
    this.isFormEmpty = true;
    this.employeeComponent.forEach(person => this.areChildFieldsFilled(person.personForm));
    this.searchEmployeeComponent.forEach(searchPerson => this.areChildFieldsFilled(searchPerson.verifyPersonForm));

    if (this.isFormEmpty) {
      this.next.emit();
      if (this.isProActive && EstablishmentConstants.LEGAL_ENTITY_PARTNERSHIP.indexOf(this.legalEntity) === -1) {
        this.markAllFormsAsTouched();
      } else {
        this.markAllFormsAsUntouched();
      }
    } else if (this.isFormsValid()) {
      if (!this.ownerSavedAsAdmin && this.adminIndex !== undefined) {
        this.ownerNotSaved.emit();
      } else if (this.checkAllOwnersSubmitted() && !this.verifyPersonStatus.filter(item => item !== true)?.length) {
        this.next.emit();
        this.markAllFormsAsUntouched();
      } else {
        if (this.verifyPersonStatus.filter(item => item !== true)?.length > 0) {
          this.ownerNotVerified.emit();
        } else {
          this.ownerNotSaved.emit();
        }
      }
    } else {
      this.formInvalid.emit();
      this.markAllFormsAsTouched();
    }
  }

  /**
   * Mark all forms as untouched and valid if the form is empty
   */
  markAllFormsAsUntouched() {
    this.searchEmployeeComponent.forEach(searchPerson => {
      markFormGroupUntouched(searchPerson.verifyPersonForm);
    });
    if (this.ownerVerified()) {
      this.employeeComponent.forEach(person => {
        if (person.personForm) {
          markFormGroupUntouched(person.personForm);
        }
        if (person.contactDcComponent) {
          if (person.contactDcComponent.contactDetailsForm) {
            markFormGroupUntouched(person.contactDcComponent.contactDetailsForm);
          }
        }
      });
    }
  }

  //Mark all Forms Touched
  markAllFormsAsTouched() {
    this.searchEmployeeComponent.forEach(searchPerson => {
      markFormGroupTouched(searchPerson.verifyPersonForm);
    });
    this.employeeComponent.forEach(person => {
      if (person.personForm) {
        markFormGroupTouched(person.personForm);
      }
      if (person.contactDcComponent) {
        if (person.contactDcComponent.contactDetailsForm) {
          markFormGroupTouched(person.contactDcComponent.contactDetailsForm);
        }
      }
    });
  }

  isPersonFromMOL(index: number) {
    if (this.molOwnerPersonId && this.molOwnerPersonId.length > 0) {
      if (!this.persons[index]?.personId || this.molOwnerPersonId.indexOf(this.persons[index]?.personId) !== -1) {
        return true;
      } else return false;
    }
    return false;
  }

  /**
   * This method is used to check if the form is filled
   * @param control
   */
  areFormFieldsFilled(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if ((control as FormGroup).controls) {
        this.areFormFieldsFilled(control as FormGroup);
      } else if (control.value !== '' && control.value !== null) {
        if (
          !(
            control.value === false ||
            control.value === IdentityTypeEnum.IQAMA ||
            control.value === IdentityTypeEnum.NIN ||
            control.value === AddressTypeEnum.OVERSEAS
          )
        ) {
          this.isFormEmpty = false;
        }
      }
    });
  }
  /**
   * This method is used to check if the form is filled
   * @param control
   */
  areChildFieldsFilled(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if ((control as FormGroup).controls) {
        this.areChildFieldsFilled(control as FormGroup);
      } else if (control.value !== '' && control.value) {
        if (
          !(
            control.value === false ||
            control.value === IdentityTypeEnum.IQAMA ||
            control.value === IdentityTypeEnum.NIN ||
            control.value === AddressTypeEnum.OVERSEAS
          )
        ) {
          this.isFormEmpty = false;
        }
      }
    });
  }

  /**
   * This method is used to each owner into owners array
   */
  aggregateAllOwners(ownerIndex) {
    this.isFormEmpty = true;
    //TODO: why cant you pass details as @input
    //COMMENTS: the form group values was not getting binded need to check
    this.searchEmployeeComponent.some((searchPerson, index) => {
      Object.keys(searchPerson.verifyPersonForm.controls).forEach(name => {
        if (name in ((this.ownerForms.controls.owners as FormArray).controls[index] as FormGroup).controls) {
          ((this.ownerForms.controls.owners as FormArray).controls[index] as FormGroup)
            .get(name)
            .patchValue(searchPerson.verifyPersonForm.get(name).value);
          if (name === 'birthDate') {
            ((this.ownerForms.controls.owners as FormArray).controls[index] as FormGroup)
              .get(name)
              .get('gregorian')
              .patchValue(searchPerson.verifyPersonForm.get(name).get('gregorian').value);
          }
          ((this.ownerForms.controls.owners as FormArray).controls[index] as FormGroup)
            .get(name)
            .updateValueAndValidity();
        }
      });
      markFormGroupTouched(searchPerson.verifyPersonForm);
      return false;
    });

    this.employeeComponent.some((person, index) => {
      if (index === ownerIndex) {
        if (person.personForm) {
          Object.keys(person.personForm.controls).forEach(name => {
            if (
              name in ((this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup).controls &&
              person.personForm.get(name).value
            ) {
              ((this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup)
                .get(name)
                .patchValue(person.personForm.get(name).value);
              ((this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup)
                .get(name)
                .updateValueAndValidity();
            }
          });
          markFormGroupTouched(person.personForm);
        }
        if (person.contactDcComponent) {
          if (person.contactDcComponent.contactDetailsForm) {
            Object.keys(person.contactDcComponent.contactDetailsForm.controls).forEach(name => {
              if (
                name in
                (
                  ((this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup).controls
                    .contactDetail as FormGroup
                ).controls
              ) {
                (
                  (this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup
                ).controls.contactDetail
                  .get(name)
                  .patchValue(person.contactDcComponent.contactDetailsForm.get(name).value);
                (
                  (this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup
                ).controls.contactDetail
                  .get(name)
                  .updateValueAndValidity();
              }
            });
            ((this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup).controls.contactDetail
              .get('currentMailingAddress')
              .setValue(this.persons[ownerIndex].contactDetail.currentMailingAddress);
            markFormGroupTouched(person.contactDcComponent.contactDetailsForm);
          }
        }
        if (person.addressDcComponent) {
          if (person.addressDcComponent.getAddressDetails().length > 0) {
            (
              (
                (this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup
              ).controls.contactDetail.get('addresses') as FormArray
            ).controls = [];
            person.addressDcComponent.getAddressDetails().some((address, addressIndex) => {
              (
                (
                  (<FormGroup>(this.ownerForms.controls.owners as FormArray).controls[ownerIndex]) as FormGroup
                ).controls.contactDetail.get('addresses') as FormArray
              ).controls.push(this.createAddressForm());
              Object.keys(address).forEach(name => {
                if (
                  name in
                  (
                    (<FormGroup>(
                      (
                        (this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup
                      ).controls.contactDetail.get('addresses')
                    )).controls[addressIndex] as FormGroup
                  ).controls
                ) {
                  (
                    (
                      (this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup
                    ).controls.contactDetail.get('addresses') as FormArray
                  ).controls[addressIndex]
                    .get(name)
                    .patchValue(address[name]);
                  (
                    (
                      (this.ownerForms.controls.owners as FormArray).controls[ownerIndex] as FormGroup
                    ).controls.contactDetail.get('addresses') as FormArray
                  ).controls[addressIndex]
                    .get(name)
                    .updateValueAndValidity();
                }
              });
            });
          }
        }
        if (
          person.personForm.valid &&
          person.contactDcComponent.contactDetailsForm.valid &&
          person.addressDcComponent.getAddressValidity()
        ) {
          person.submitted = true;
          person.checkForValueChange();
          return false;
        }
      }
    });
  }

  checkAllOwnersSubmitted() {
    let ownerSubmitted = true;
    this.employeeComponent.some((person, index) => {
      this.isFormEmpty = true;
      this.areChildFieldsFilled(person.personForm);
      if (!this.isFormEmpty) {
        if (this.isOwnerSaved[index] === false) {
          ownerSubmitted = false;
          return false;
        }
      }
    });
    return ownerSubmitted;
  }

  allOwnersNotSaved() {
    return this.isOwnerSaved.filter(isSaved => isSaved === false)?.length !== 0;
  }

  getOwnerName(i) {
    let ownerName = null;
    if (this.employeeComponent) {
      this.employeeComponent.some((person, index) => {
        if (i === index) {
          if (person.personForm) {
            if (person.personForm.get('name').get('arabic').get('firstName').value) {
              ownerName =
                person.personForm.get('name').get('arabic').get('firstName').value +
                ' ' +
                this.orEmpty(person.personForm.get('name').get('arabic').get('secondName').value) +
                ' ' +
                this.orEmpty(person.personForm.get('name').get('arabic').get('thirdName').value) +
                ' ' +
                this.orEmpty(person.personForm.get('name').get('arabic').get('familyName').value);
              return true;
            }
          }
        }
      });
    }
    return ownerName;
  }

  get ownerFormArray(): FormArray {
    return this.ownerForms.get('owners') as FormArray;
  }

  /**
   * This method is used to return entity value if not null else empty value
   */
  orEmpty = function (entity) {
    return entity || '';
  };

  /**
   * This method is to reset the Admin Details Form
   */
  resetOwnerForm(index) {
    this.isFormEmpty = false;
    this.submitted = false;
    this.gccNationality = false;
    this.employeeComponent.some((person, i) => {
      if (i === index) {
        person.resetPersonDetailsForm();
        this.verifyPersonStatus[i] = false;
        this.editPersonDetails[i] = true;
        this.isOwnerSaved[i] = false;
        return false;
      }
      return false;
    });
  }

  // This method is used to navidate to next accordian panel
  nextPanel(panelNo: number) {
    this.currentTab = panelNo;
  }

  /**
   * This method is select accordian panel on click
   */
  selectPanel(event, index) {
    if (event) {
      this.currentTab = index;
    }
  }

  // This method is used to navigate to previous accordian panel
  previousPanel() {
    if (this.currentTab > 1) {
      this.currentTab--;
    }
  }
  /**
   * This method is to show a confirmation popup for cancelling the form
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }

  /**
   * This method is to decline popoUp*
   */
  decline() {
    this.modalRef.hide();
  }

  isAllOwnersSaved(): boolean {
    return !this.allOwnersNotSaved();
  }

  enableAddOwner() {
    if (this.isProActive && this.isOnePartner && this.estOwners?.some(x => x.partyId)) {
      return false;
    } else if (
      this.isProActive &&
      this.isOnePartner &&
      this.isEstMci &&
      this.ownerCountIncludingEstablishmentAsOwner >= 1 &&
      this.ownerFormArray.length >= 1
    ) {
      return false;
    }
    if (this.isProActive && this.isIndividual && this.estOwners?.some(x => x.partyId)) {
      return false;
    } else if (this.ownerFormArray) {
      if (this.ownerFormArray?.length === 0) {
        return true;
      }
      if (this.isProActive && !this.isIndividual && !this.isOnePartner) {
        return true;
      }
      if (this.isIndividual) {
        return this.ownerFormArray.length < 1;
      }
      if (!this.isProActive) {
        return this.ownerFormArray.length < 5 && this.isAllOwnersSaved();
      } else {
        return this.isAllOwnersSaved();
      }
    } else {
      return true;
    }
  }
  /**
   * This method is to keep transactions in draft
   */
  onKeepDraft() {
    this.modalRef.hide();
    this.keepDraft.emit();
  }

  mciOwnerMismatch(index: number): boolean {
    return this.isProActive && !this.isMatchingMciOwner.find((owner, i) => i === index);
  }

  // // Method to split owners into active and inactive owners respectively
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
}
