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
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  BaseComponent,
  BilingualText,
  CommonIdentity,
  ContactDetails,
  Contributor,
  convertToStringDDMMYYYY,
  getIdentityByType,
  getPersonNameAsBilingual,
  GosiCalendar,
  LanguageToken,
  LovList,
  Lov,
  markFormGroupTouched,  
  AlertService,
  AddressTypeEnum,
  convertToStringYYYYMMDD
} from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { ContactDetailsDcComponent } from '../contact-details-dc/contact-details-dc.component';
import { Person, Engagement, getAge } from '../../models';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ProcessType } from '../../enums';
import { InjuryConstants } from '../../constants/injury-constants';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { deepCopy } from '../../utils';

@Component({
  selector: 'oh-personal-details-dc',
  templateUrl: './personal-details-dc.component.html',
  styleUrls: ['./personal-details-dc.component.scss']
})
export class PersonalDetailsDcComponent extends BaseComponent implements OnInit, OnChanges, AfterViewChecked {
  /**
   * Local Variables
   */
  lang = 'en';
  control: FormControl;
  contributor: Contributor = new Contributor();
  contactDetails: ContactDetails = new ContactDetails();
  showAddress: Boolean = false;
  isViewOnly = false;
  items: Lov[] = [];
  age: number = null;
  dateOfBirth: BilingualText = new BilingualText();
  payeeList: LovList = null;
  personType: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  personNameEnglish: string = null;
  personNameArabic: String = null;
  payeeListForm: FormGroup;
  occupation: BilingualText = new BilingualText();
  payee = 2;
  addressForms = new FormGroup({});
  currentTab = 0;
  totalTabs = 4;
  poBoxType = AddressTypeEnum.POBOX;

  /**
   * Input variables
   */
  @Input() addressDetails = null;
  @Input() cityList: LovList = null;
  @Input() person: Person;
  @Input() payeeT: number;
  @Input() prohibitUpdate = false;
  @Input() socialInsuranceNo: number;
  @Input() registrationNo: number;
  @Input() readOnlyAll: boolean;
  @Input() defaultValue = 'sa';
  @Input() defaultOnly = false;
  @Input() isHeadingRequired = true;
  @Input() isVerifyRequired = false;
  @Input() isAddressPresent = false;
  @Input() countryList: LovList = null;
  @Input() emergencyContact: number;
  @Input() showPersonalDetails = true;
  @Input() isAddressOptional = false;
  @Input() isValidator1 = false;
  @Input() isPoMandatory : Boolean;
  @Input() isValidatorView: boolean;
  @Input() engagement: Engagement = new Engagement();
  @Input() injuryDate: GosiCalendar = new GosiCalendar();
  @Input() isdControl: string;
  @Input() processType: string;
  @Input() workFlowType: string;
  @Input() disabled;
  @Input() appToken: string;

  @Input() isGroupInjuryScreen = false;
  @Input() allowanceFlag: boolean;

  /**
   * Output variables
   */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() template: EventEmitter<null> = new EventEmitter();
  @Output() contactNumberDetails: EventEmitter<null> = new EventEmitter();

  /**
   * viewchild declarations to access child components
   */

  @ViewChild('reportDiseaseTabs', { static: false })
  reportDiseaseTabs: TabsetComponent;

  @ViewChild('reportDiseaseWizard', { static: false })
  reportDiseaseWizard: ProgressWizardDcComponent;

  @ViewChild('documentDetailsForm', { static: false })
  documentDetailsForm: ProgressWizardDcComponent;

  @ViewChild('addressForm', { static: false })
  addressForm: AddressDcComponent;

  @ViewChild('contactForm', { static: false })
  contactForm: ContactDetailsDcComponent;

  /**
   * This method is used to initialise the component
   * @param language
   * @param router
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly activatedRoute: ActivatedRoute,
    readonly alertService: AlertService
  ) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   * @memberof PersonalDetailsDcComponent
   */
  ngOnInit() {
    this.showAddress = false;
    this.language.subscribe(language => (this.lang = language));
    this.items.push({
      value: { english: 'Contributor', arabic: ' مشترك' },
      sequence: 1
    });
    this.items.push({ value: { english: 'Establishment', arabic: 'منشأة' }, sequence: 2 });
    this.payeeList = new LovList(this.items);
    this.payeeListForm = this.createPayeeForm();
    if (this.allowanceFlag) {
      this.payee = null;
    }
    if (
      this.processType === ProcessType.MODIFY ||
      this.processType === ProcessType.REOPEN ||
      this.processType === ProcessType.RE_OPEN
    ) {
      this.disabled = true;
    }
    if (this.payeeListForm && this.payeeListForm !== undefined) {
      if (this.payeeT === 2) {
        this.payeeListForm.get('payeeType.english').setValue('Contributor');
        this.payeeListForm.get('payeeType.arabic').setValue(' مشترك');
      } else if (this.payeeT === 1) {
        this.payeeListForm.get('payeeType.english').setValue('Establishment');
        this.payeeListForm.get('payeeType.arabic').setValue('منشأة');
      }

      this.payeeListForm?.updateValueAndValidity();
    }

    this.settingPayee();    
  }
  /**
   * This method is to create createPayeeForm and initialize
   * @memberof
   */
  createPayeeForm() {
    return this.fb.group({
      payeeType: this.fb.group({
        english: [this.allowanceFlag ? null : 'Contributor', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    });
  }
  /**
   * Method to capture navigation details and send to parent via event emitter
   */
  navigateToInjuryDetails() {
    this.router.navigate([`home/profile/individual/internal/${this.socialInsuranceNo}/occupational-hazards`]);
  }
  /**
   *
   * @param changes Values updationg on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.payeeT) {
      this.payeeT = changes.payeeT.currentValue;
      this.settingPayee();
    }
    if (changes && changes.person) {
      if (this.person) {
        this.person = changes.person.currentValue;
        this.settingPerson(this.person);
        this.settingContact(this.person);
      }
    }
    if (changes && changes.disabled) {
      this.disabled = changes.disabled.currentValue;
      this.settingPayee();
    }
    if (changes && changes.personDetails) {
      this.person = changes.personDetails.currentValue;
      this.settingIdentity();
    }
    if (changes && changes.prohibitUpdate) {
      if (this.prohibitUpdate === true) {
        this.disabled = true;
        this.payeeListForm.updateValueAndValidity();
      }
    }
    if (changes && changes.engagementDetails) {
      this.engagement = changes.engagementDetails.currentValue;
      this.settingOccupation(this.engagement);
    }
    if (changes && changes.isAddressPresent) this.isAddressPresent = changes.isAddressPresent.currentValue;
    if (changes && changes.isAddressOptional) {
      this.isAddressOptional = changes.isAddressOptional.currentValue;
    }
    if (changes.isPoMandatory) {      
      this.isPoMandatory = changes.isPoMandatory.currentValue;
      if(this.isPoMandatory){
        this.isPoMandatory  = deepCopy(this.isPoMandatory);
      }      
    }   
  }
  /**
   * Setting Occupation
   */
  settingOccupation(engagement) {
    if (engagement && engagement.engagementPeriod[0] && engagement.engagementPeriod[0].occupation) {
      this.occupation = engagement.engagementPeriod[0].occupation;
    }
  }
  settingPerson(person) {
    this.primaryIdentityType = 'OCCUPATIONAL-HAZARD.' + this.personType.idType;
    const nameObj = getPersonNameAsBilingual(person.name);
    this.personNameEnglish = nameObj.english;
    this.personNameArabic = nameObj.arabic;
    this.primaryIdentity =
      this.contributor.person.identity != null ? getIdentityByType(person.identity, person.nationality.english) : null;

    this.primaryIdentityType =
      this.primaryIdentity !== null ? 'OCCUPATIONAL-HAZARD.' + this.primaryIdentity.idType : null;
  }
  settingContact(person) {
    if (person?.contactDetail?.emergencyContactNo) {
      this.emergencyContact = parseInt(person.contactDetail.emergencyContactNo, null);
      this.isdControl = person.contactDetail.mobileNo.isdCodePrimary;
    }
  }
  /**
   * Setting Payee
   */
  settingPayee() {
    if (this.workFlowType === 'Complication') {
      this.payeeListForm.get('payeeType.english').setValue('Contributor');
      this.disabled = true;
      this.payeeListForm.updateValueAndValidity();
    }
    if (this.workFlowType === 'disease') {
      this.payeeListForm?.get('payeeType.english')?.setValue('Contributor');
      this.disabled = true;
      this.payeeListForm?.updateValueAndValidity();
    }
    if (this.workFlowType === InjuryConstants.INJURY && this.disabled) {
      this.payeeListForm.get('payeeType.english').setValue('Contributor');
      this.payeeListForm.updateValueAndValidity();
    }
    if (this.payeeListForm) {
      if (this.payeeT === 2) {
        this.payeeListForm.get('payeeType.english').setValue('Contributor');
        this.payeeListForm.get('payeeType.arabic').setValue(' مشترك');
        this.payee = 2;
      } else if (this.payeeT === 1) {
        this.payeeListForm.get('payeeType.english').setValue('Establishment');
        this.payeeListForm.get('payeeType.arabic').setValue('منشأة');
        this.payee = 1;
      }
      this.payeeListForm.updateValueAndValidity();
    }
    if (this.prohibitUpdate) {
      this.disabled = true;
      this.payeeListForm.updateValueAndValidity();
    }
  }
  /**
   * Setting identity
   */
  settingIdentity() {
    if (this.person) {
      /**
       * setting the identity
       */
      this.personType = getIdentityByType(this.person.identity, this.person.nationality.english);
      this.primaryIdentity =
        this.contributor.person.identity != null
          ? getIdentityByType(this.person.identity, this.person.nationality.english)
          : null;

      this.primaryIdentityType =
        this.primaryIdentity !== null ? 'OCCUPATIONAL-HAZARD.' + this.primaryIdentity.idType : null;
    }
  }
  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }
  /*This method to select Payee List*/
  selectedpayeeList(type) {
    if (type === 'Contributor') {
      this.payeeListForm.get('payeeType.english').setValue('Contributor');
      this.payee = 2;
    } else if (type === 'Establishment') {
      this.payeeListForm.get('payeeType.english').setValue('Establishment');
      this.payee = 1;
    }
  }
  /**
   * Save and next
   */
  submitPersonalDetails() {
    if (!this.contactForm.isValidForm()) {
      this.contactNumberDetails.emit();
    } else {
      if (!this.isAddressPresent) {
        if (this.addressForm) {
          markFormGroupTouched(this.addressForm?.parentForm);
        }
        if (this.addressForm?.getAddressValidity() === false) {
          this.contactNumberDetails.emit();
        } else {
          if (this.addressForm) {
            if (!this.person){
              this.person = new Person();
            }
            if (this.person) {           
              if (!this.person.contactDetail) {
                this.person.contactDetail = new ContactDetails();
              }
              this.addressDetails = this.addressForm.getAddressDetails();
              this.person.contactDetail.addresses = this.addressDetails;
              this.person.contactDetail.currentMailingAddress =
                this.addressForm?.parentForm?.get('currentMailingAddress')?.value;

              if (this.isAddressOptional) {
                this.addressForm.parentForm.get('currentMailingAddress').markAsUntouched();
                this.addressForm.parentForm.get('foreignAddress').markAsUntouched();
                this.addressForm.parentForm.get('poBoxAddress').markAsUntouched();
                this.addressForm.parentForm.get('saudiAddress').markAsUntouched();
              }
              if (this.allowanceFlag) {
                if (!this.payeeListForm.valid) {
                  markFormGroupTouched(this.payeeListForm);
                  this.alertService.showMandatoryErrorMessage();
                } else {
                  this.submit.emit({
                    personDetails: this.person,
                    contactDetail: this.contactForm.contactNumberDetailsForm.getRawValue(),
                    allowancePayee: this.payee
                  });
                }
              } else {
                this.submit.emit({
                  personDetails: this.person,
                  contactDetail: this.contactForm.contactNumberDetailsForm.getRawValue(),
                  allowancePayee: this.payee
                });
              }
          }
        }
      }
    }
    if (this.contactForm.isValidForm() && this.isAddressPresent) {
      if (this.allowanceFlag) {
        if (!this.payeeListForm.valid) {
          markFormGroupTouched(this.payeeListForm);
          this.alertService.showMandatoryErrorMessage();
        } else {
          this.submit.emit({
            personDetails: this.person,
            contactDetail: this.contactForm.contactNumberDetailsForm.getRawValue(),
            allowancePayee: this.payee
          });
        }
      } else {
        this.submit.emit({
          personDetails: this.person,
          contactDetail: this.contactForm.contactNumberDetailsForm.getRawValue(),
          allowancePayee: this.payee
        });
      }
    }
  }}
  saveAddress() {
    if (!this.contactForm.isValidForm()) {
      this.contactNumberDetails.emit();
      this.submit.emit();
    } else if (this.addressForm.getAddressValidity() === false) {
      if (this.addressForm) {
        markFormGroupTouched(this.addressForm?.parentForm);
      }
      this.alertService.showMandatoryErrorMessage();
    } else {
      if (this.contactForm.isValidForm())
        this.submit.emit({
          personDetails: this.person,
          contactDetail: this.contactForm.contactNumberDetailsForm.getRawValue(),
          allowancePayee: this.payee
        });
    }
  }
  /**
   * This method is used to show the cancellation template on click of cancel
   */
  showCancelTemplate() {
    this.template.emit();
  }

  /**
   * Calculate age
   */
  calculateAge() {
    if (this.person && this.person.birthDate && this.person.birthDate.gregorian) {
      this.age = moment(new Date()).diff(moment(this.person.birthDate.gregorian), 'years');
      if (this.person.birthDate.gregorian != null) {
        this.dateOfBirth.english =
          convertToStringDDMMYYYY(this.person.birthDate.gregorian.toString()) +
          ' ' +
          '(Age: ' +
          this.age +
          ' ' +
          'years)';
        this.dateOfBirth.arabic =
          convertToStringYYYYMMDD(this.person.birthDate.gregorian.toString()) +
          ' ' +
          '(سنوات ' +
          this.age +
          ' ' +
          ':السن)';
      }
      if (this.lang === 'ar') return getAge(this.person.birthDate.gregorian, this.age);
      else if (this.lang === 'en') return this.dateOfBirth.english;
    }
  }
  /**
   * Making address as optional
   */
  ngAfterViewChecked() {
    if (this.isAddressOptional && this.addressForm) {
      this.addressForm.parentForm.get('currentMailingAddress')?.markAsUntouched();
      this.addressForm.parentForm.get('foreignAddress')?.markAsUntouched();
      this.addressForm.parentForm.get('poBoxAddress')?.markAsUntouched();
      this.addressForm.parentForm.get('saudiAddress')?.markAsUntouched();
    }
  }
}
