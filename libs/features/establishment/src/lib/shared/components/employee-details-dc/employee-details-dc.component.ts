/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AppConstants,
  BaseComponent,
  ContactDetails,
  IdentifierLengthEnum,
  IdentityTypeEnum,
  Iqama,
  iqamaValidator,
  lengthValidator,
  LovList,
  markFormGroupTouched,
  NationalId,
  Person
} from '@gosi-ui/core';
import { AddressDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { pairwise, takeUntil } from 'rxjs/operators';
import { EstablishmentConstants } from '../../constants';

@Component({
  selector: 'est-employee-details-dc',
  templateUrl: './employee-details-dc.component.html',
  styleUrls: ['./employee-details-dc.component.scss']
})
export class EmployeeDetailsDcComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {
  //Constants
  arabicNameMax = EstablishmentConstants.PERSON_NAME_ARABIC_MAX_LENGTH;
  nameMinLength = EstablishmentConstants.PERSON_NAME_MIN_LENGTH;
  englishNameMax = EstablishmentConstants.PERSON_NAME_ENGLISH_MAX_LENGTH;
  gccIdMaxLength = EstablishmentConstants.DEFAULT_GCCID_LENGTH;
  gccIdMinLength = EstablishmentConstants.DEFAULT_MIN_GCCID_LENGTH;
  iqamaLength = IdentifierLengthEnum.IQAMA;

  //Local Variables
  submitted = false;
  gccNationality = false;
  makeAsReadOnly = false;
  gccIdExists = false;
  iqamaExists = false;
  changed = false;
  defaultOnly = true;
  modalRef: BsModalRef;
  personForm: FormGroup;

  //Child Variables
  @ViewChild('addressDetails', { static: false })
  addressDcComponent: AddressDcComponent;
  @ViewChild('contactDetails', { static: false })
  contactDcComponent: ContactDcComponent;

  //Input Variables
  @Input() person: Person;
  @Input() cityList: LovList = null;
  @Input() gccCountryList: LovList = null;
  @Input() verifyPersonStatus: boolean;
  @Input() editPersonDetails: boolean;
  @Input() genderList: LovList;
  @Input() gccEstablishment = false;
  @Input() canSave = true;
  @Input() idValue = '';
  @Input() enable: boolean;
  @Input() isProActive: boolean;
  @Input() noPadding = false;
  @Input() emailMandatory = false;
  @Input() enableEmail = false;

  //Output Variables
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();
  @Output() keepDraft: EventEmitter<null> = new EventEmitter();
  objectDiffers: boolean;

  /**
   * This method is used to initialise the component
   * @param fb
   *
   */
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof EmployeeDetailsDcComponent
   */
  ngOnInit() {
    this.personForm = this.createPersonDetailsForm();
    this.setPersontoForm();
  }

  ngAfterViewInit() {
    this.bindAddressAndContact();
  }

  checkForValueChange() {
    this.personForm.valueChanges.pipe(pairwise(), takeUntil(this.destroy$)).subscribe(([prev, next]) => {
      this.objectDiffers = false;
      if (this.submitted) {
        this.areObjectsSame(prev, next);
        if (this.objectDiffers) {
          this.progress.emit();
        }
      }
    });
    if (this.contactDcComponent && this.contactDcComponent.contactDetailsForm) {
      this.contactDcComponent.contactDetailsForm.valueChanges
        .pipe(pairwise(), takeUntil(this.destroy$))
        .subscribe(([prev, next]) => {
          this.objectDiffers = false;
          if (this.submitted) {
            this.areObjectsSame(prev, next);
            if (this.objectDiffers) {
              this.progress.emit();
            }
          }
        });
    }
  }

  /**
   * This method is to check if the two objects are the same
   */
  areObjectsSame = function (object, pairObject) {
    if (typeof object === 'object') {
      if (object) {
        Object.keys(object).forEach(key => {
          if (key in pairObject) {
            this.areObjectsSame(object[key], pairObject[key]);
          }
        });
      }
    } else {
      if (object !== pairObject) {
        this.objectDiffers = true;
      }
    }
  };

  /**
   * This method is used to initialise the form template
   */
  createPersonDetailsForm() {
    return this.fb.group({
      name: this.fb.group({
        arabic: this.fb.group({
          firstName: [
            null,
            {
              validators: Validators.compose([
                Validators.required,
                Validators.minLength(this.nameMinLength),
                Validators.maxLength(this.arabicNameMax)
              ]),
              updateOn: 'blur'
            }
          ],
          secondName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.arabicNameMax)]),
              updateOn: 'blur'
            }
          ],
          thirdName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.arabicNameMax)]),
              updateOn: 'blur'
            }
          ],
          familyName: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.maxLength(this.arabicNameMax)]),
              updateOn: 'blur'
            }
          ]
        }),
        english: this.fb.group({
          name: [
            null,
            {
              validators: Validators.compose([
                Validators.minLength(this.nameMinLength),
                Validators.maxLength(this.englishNameMax)
              ]),
              updateOn: 'blur'
            }
          ]
        })
      }),
      sex: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      id: [null, { updateOn: 'blur' }],
      iqamaNo: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            lengthValidator(this.iqamaLength),
            iqamaValidator
          ]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * This method is used to reset the form to initial template
   */
  resetPersonDetailsForm() {
    this.submitted = false;
    this.gccNationality = false;
    this.makeAsReadOnly = false;
    this.gccIdExists = false;
    this.iqamaExists = false;
    this.changed = false;
    this.defaultOnly = true;
    if (this.personForm) {
      this.personForm.reset(this.createPersonDetailsForm().getRawValue());
      this.personForm.updateValueAndValidity();
      this.personForm.markAsPristine();
      this.personForm.markAsUntouched();
    }
    if (this.contactDcComponent && this.contactDcComponent.contactDetailsForm) {
      this.contactDcComponent.resetContactForm();
    }
    if (this.addressDcComponent) {
      this.addressDcComponent.resetAddressForm();
    }
  }

  /**
   * This method is used to capture the changes in the input and bind them into the form and perform some validations
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.editPersonDetails && this.editPersonDetails) {
      this.resetPersonDetailsForm();
    }
    if (changes.person && changes.person.currentValue) {
      if (this.gccEstablishment) {
        this.defaultOnly = false;
      }
    }

    if (changes.person && changes.person.currentValue) {
      if (
        changes.person.currentValue.nationality !== null &&
        changes.person.currentValue.nationality.english !== null
      ) {
        if (this.isProActive && this.isProActive !== null && this.isProActive === true) {
          if (EstablishmentConstants.GCC_NATIONAL.includes(this.person.nationality.english)) {
            this.defaultOnly = false;
          }
        }
      }
      this.setPersontoForm();
    }
    if (changes.enable) {
      if (!this.enable) {
        this.makeAsReadOnly = true;
      } else {
        this.makeAsReadOnly = false;
      }
    }
  }

  setPersontoForm() {
    if (this.personForm) {
      Object.keys(this.person).forEach(name => {
        if (name in this.personForm.controls) {
          this.personForm.get(name).patchValue(this.person[name]);
          this.personForm.updateValueAndValidity();
        }
      });
      if (this.person.contactDetail && this.person.contactDetail.mobileNo.primary) {
        this.bindAddressAndContact();
      }
    }
    this.updateGccIdField();
  }

  /**
   * This method is used to update the id form control conditionally
   */
  updateGccIdField() {
    if (
      this.person.nationality &&
      EstablishmentConstants.GCC_NATIONAL.indexOf(this.person.nationality.english) !== -1
    ) {
      this.gccNationality = true;
      if (this.personForm) {
        this.personForm
          .get('id')
          .setValidators([Validators.required, lengthValidator(this.getIdMinLength(), this.getIdMaxLength())]);
      }
    } else {
      this.gccNationality = false;
      if (this.personForm) {
        this.personForm.get('id').clearValidators();
      }
    }
    if (this.person.identity && this.personForm) {
      this.gccIdExists = false;
      this.iqamaExists = false;
      for (let item of this.person.identity) {
        if (!this.gccIdExists) {
          if (item.idType === IdentityTypeEnum.NATIONALID) {
            this.gccIdExists = true;
            item = <NationalId>item;
            this.personForm.controls.id.setValue(item.id);
          } else {
            this.gccIdExists = false;
          }
        }
        if (!this.iqamaExists) {
          if (item.idType === IdentityTypeEnum.IQAMA) {
            this.iqamaExists = true;
            item = <Iqama>item;
            this.personForm.controls.iqamaNo.setValue(item.iqamaNo);
          } else {
            this.iqamaExists = false;
          }
        }
      }
      if (!this.gccIdExists) {
        this.personForm.controls.id.setValue(null);
      }
      this.personForm.controls.id.updateValueAndValidity();
    }
  }

  /**
   * This method is used to detect the person changes and bind the details into contact and address forms
   */
  bindAddressAndContact() {
    if (this.person && this.person.contactDetail.mobileNo.primary && this.person.contactDetail) {
      this.person.contactDetail = new ContactDetails().fromJsonToObject(this.person.contactDetail);
      if (this.addressDcComponent && this.person.contactDetail.addresses) {
        this.person.contactDetail.addresses = [...this.person.contactDetail.addresses];
        this.changed = false;
        if (!this.enable) {
          this.makeAsReadOnly = true;
        } else {
          this.makeAsReadOnly = false;
        }
      }
    }
  }

  /**
   * This method fetches the corresponding gcc national id length for different nationalities
   */
  getIdMaxLength() {
    if (this.person && this.person && this.person.nationality.english) {
      const nationality = this.person.nationality.english;
      if (nationality) {
        Object.keys(AppConstants.NATIONALITY_ID_LENGTH_MAPPING).forEach(key => {
          if (nationality === key) {
            this.gccIdMaxLength = AppConstants.NATIONALITY_ID_LENGTH_MAPPING[key];
          }
        });
      }
      return this.gccIdMaxLength;
    }
  }
  /**
   * This method fetches the corresponding gcc national id length for different nationalities
   */
  getIdMinLength() {
    if (this.person && this.person && this.person.nationality.english) {
      const nationality = this.person.nationality.english;
      if (nationality) {
        Object.keys(AppConstants.NATIONALITY_ID_MIN_LENGTH_MAPPING).forEach(key => {
          if (nationality === key) {
            this.gccIdMinLength = AppConstants.NATIONALITY_ID_MIN_LENGTH_MAPPING[key];
          }
        });
      }
      return this.gccIdMinLength;
    }
  }

  /**
   * Submit admin form values
   * @memberof EmployeeDetailsDcComponent
   */
  savePerson() {
    markFormGroupTouched(this.personForm);
    markFormGroupTouched(this.contactDcComponent.contactDetailsForm);
    if (this.gccEstablishment) {
      this.submit.emit({
        personDetails: this.personForm.getRawValue(),
        contactDetails: this.contactDcComponent.contactDetailsForm.getRawValue(),
        addresses: this.addressDcComponent.getAddressDetails()
      });
    } else {
      this.submit.emit({
        personDetails: this.personForm.getRawValue(),
        contactDetails: this.contactDcComponent.contactDetailsForm.getRawValue(),
        addresses: []
      });
    }
    this.checkForValueChange();
    this.submitted = true;
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
   * This method is to decline popUp the form   *
   */
  decline() {
    this.modalRef.hide();
  }

  /**
   * Method is to check if the form is valid
   * @memberof EmployeeDetailsDcComponent
   */
  isFormValid() {
    if (this.personForm && this.personForm.valid) {
      if (this.contactDcComponent) {
        if (this.gccEstablishment) {
          return (
            this.contactDcComponent.contactDetailsForm.valid &&
            this.addressDcComponent.getAddressValidity() &&
            this.verifyPersonStatus
          );
        } else {
          return this.contactDcComponent.contactDetailsForm.valid && this.verifyPersonStatus;
        }
      } else {
        return false;
      }
    }
  }

  /**
   * This method is to keep transactions in draft
   */
  onKeepDraft() {
    this.modalRef.hide();
    this.keepDraft.emit();
  }
}
