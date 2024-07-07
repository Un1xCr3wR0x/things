/**
 * The purpose file is to mock the dc components and view child components;
 *  ------------------------PURELY FOR UNIT TESTING PURPOSE------------------------------
 */
import { Component, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ActivityTypeList,
  AddressDetails,
  BankAccount,
  ContactDetails,
  Establishment,
  Lov,
  LovList,
  Person
} from '@gosi-ui/core';
import {
  EmployeeDetailsDcComponent,
  EstablishmentDetailsFormDCComponent,
  EstablishmentInfoDcComponent,
  EstablishmentOwnersDcComponent,
  EstablishmentTypeDcComponent,
  PaymentDetailsDcComponent,
  PersonDetailsDcComponent,
  ScanDocumentsDcComponent,
  SearchEmployeeDcComponent,
  SearchPersonDcComponent,
  VerifyEstablishmentDCComponent,
  VerifyGccEstablishmentDcComponent
} from '@gosi-ui/features/establishment';
import {
  AddressDcComponent,
  BankDetailsDcComponent,
  ContactDcComponent,
  NationalAddressDcComponent,
  PoAddressDcComponent
} from '@gosi-ui/foundation/form-fragments';
import { Observable } from 'rxjs';

/* ------------------ Address Mocks -----------------------*/
@Component({
  selector: 'est-address-dc',
  template: '',
  providers: [
    {
      provide: AddressDcComponent,
      useClass: AddressDcStubComponent
    }
  ]
})
export class AddressDcStubComponent {
  @Input() hasPOAddress = false;
  @Input() hasNationalAddress = false;
  @Input() hasOverseasAddress = false;
  @Input() mandatoryOverseasAddress = false;
  @Input() addressDetails: AddressDetails = null;
  @Input() cityList: LovList = null;
  @Input() idValue: '';
  @Input() countryList: LovList = null;
  @Input() readOnlyAll = false;
  @Input() countryReadOnly = false;
  addressTypeForm: FormGroup = new FormGroup({});
  nationalAddressComponent: NationalAddressDcStubComponent = new NationalAddressDcStubComponent();
  poAddressComponent: PoAddressDcStubComponent = new PoAddressDcStubComponent();

  getAddressValidity() {
    return true;
  }

  getAddressDetails() {
    return [];
  }

  markAddressFormTouched() {}
  resetAddressForm() {}
}

@Component({
  selector: 'est-po-address-dc',
  template: '',
  providers: [
    {
      provide: PoAddressDcComponent,
      useClass: PoAddressDcStubComponent
    }
  ]
})
export class PoAddressDcStubComponent {
  poBoxAddressForm: FormGroup = new FormGroup({});
}

@Component({
  selector: 'est-national-address-dc',
  template: '',
  providers: [
    {
      provide: NationalAddressDcComponent,
      useClass: NationalAddressDcStubComponent
    }
  ]
})
export class NationalAddressDcStubComponent {
  nationalAddressForm: FormGroup = new FormGroup({});
}
/* --------------------------------------------------------- */

/* --------------------------------------------------------- */

/* ----------------------Contact Component ------------------ */

@Component({
  selector: 'est-contact-dc',
  template: '',
  providers: [
    {
      provide: ContactDcComponent,
      useClass: ContactDetailsStubComponent
    }
  ]
})
export class ContactDetailsStubComponent {
  contactDetailsForm: FormGroup = new FormGroup({});
  @Input() contactDetails: ContactDetails = null;
  @Input() idValue = '';
  @Input() readOnlyAll: boolean;
  @Input() defaultValue = 'sa';
  @Input() defaultOnly = false;

  resetContactForm() {}
}

/* --------------------------------------------------------- */

/* -----------------Search Person Mock Component ---------*/
@Component({
  selector: 'est-search-employee-dc',
  template: '',
  providers: [
    {
      provide: SearchPersonDcComponent,
      useClass: SearchPersonStubComponent
    }
  ]
})
export class SearchPersonStubComponent {
  verifyPersonForm: FormGroup = new FormGroup({});
  submitted = false;

  @Input() nationalityList: LovList;
  @Input() label: string;
  @Input() gccEstablishment: boolean;
  @Input() hasPerson = false;
  @Input() person: Person = new Person();
  @Input() idValue = '';
  @Input() isResetRequired = true;

  /** Output Variables */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() formChanged: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() previous: EventEmitter<null> = new EventEmitter();

  resetSearchPersonForm() {}
}

/* --------------------------------------------------------- */

/* -----------------Person Mock Component ---------*/
@Component({
  selector: 'est-employee-details-dc',
  template: '',
  providers: [
    {
      provide: PersonDetailsDcComponent,
      useClass: PersonDetailsStubComponent
    }
  ]
})
export class PersonDetailsStubComponent {
  personForm: FormGroup = new FormGroup({});
  submitted = false;
  gccEstablishment = false;

  resetPersonDetailsForm() {}
  isFormValid() {
    return true;
  }
}

/* --------------------------------------------------------- */

/* -----------------Establishment Details Mock Component ---------*/
@Component({
  selector: 'est-establishment-details-form-dc',
  template: '',
  providers: [
    {
      provide: EstablishmentDetailsFormDCComponent,
      useClass: EstablishmentDetailsStubComponent
    }
  ]
})
export class EstablishmentDetailsStubComponent {
  establishmentDetailsForm: FormGroup = new FormGroup({});
  submitted = false;
  @Input() nationalityList: LovList = null;
  @Input() cityList: LovList = null;
  @Input() gccCountryList: LovList = null;
  @Input() activityTypeList: ActivityTypeList = null;
  @Input() addressTypeList: LovList = null;
  @Input() establishment: Establishment = null;
  @Input() isSaved = false;
  @Input() issueDate: Date;
  @Input() countryReadOnly = false;
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();

  resetEstablishmentDetailsForm() {}

  isValidForm() {
    return true;
  }
}
/* --------------------------------------------------------- */

/* ----------------Owner Mock Component ---------*/
@Component({
  selector: 'est-establishment-owners-dc',
  template: '',
  providers: [
    {
      provide: EstablishmentOwnersDcComponent,
      useClass: OwnerStubComponent
    }
  ]
})
export class OwnerStubComponent {
  ownerForms: FormGroup = new FormGroup({});
  submitted = false;
  searchEmployeeComponent: QueryList<SearchEmployeeDcComponent> = new QueryList();
  employeeComponent: QueryList<EmployeeDetailsDcComponent> = new QueryList();

  @Input() persons: Person[] = [];
  @Input() cityList$: Observable<LovList>;
  @Input() gccCountryList$: Observable<LovList>;
  @Input() cityList: LovList = null;
  @Input() gccCountryList: LovList = null;
  @Input() editPersonDetails: boolean[];
  @Input() verifyPersonStatus: boolean[];
  @Input() isOwnerSaved: boolean[];
  @Input() gccEstablishment = true;
  @Input() genderList$: Observable<LovList>;
  @Input() nationalityList$: Observable<LovList>;
  @Input() isProActive = false;
  @Input() isIndividual: boolean;
  @Input() noOfOwners = 4;
  @Input() molOwnerPersonId = [];

  //Output Variables
  @Output() addOwner: EventEmitter<any> = new EventEmitter();
  @Output() ownerIsAdmin: EventEmitter<any> = new EventEmitter();
  @Output() ownerNotAdmin: EventEmitter<any> = new EventEmitter();
  @Output() deleteOwner: EventEmitter<any> = new EventEmitter();
  @Output() verify: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() formInvalid: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();
  createPersonForm() {}
  addOwnerForm() {}

  isValidForm() {
    return true;
  }

  resetOwnerForm(index: number) {
    if (index) {
    }
  }
}
/* --------------------------------------------------------- */

/* -----------------Payment Mock Component ---------------------- */
@Component({
  selector: 'est-payment-details-dc',
  template: '',
  providers: [
    {
      provide: PaymentDetailsDcComponent,
      useClass: PaymentDetailsStubComponent
    }
  ]
})
export class PaymentDetailsStubComponent {
  establishmentDetailsForm: FormGroup = new FormGroup({});
  submitted = false;
  bankDetailsDcComponent: BankStubComponent;
  paymentDetailsForm: FormGroup;

  @Input() establishment: Establishment;
  @Input() bankNameList: Lov;
  @Input() isAccountSaved: boolean;
  @Input() yesOrNoList: LovList;
  @Input() isInternational = false;
  /** Output Variables */
  @Output() next: EventEmitter<Object> = new EventEmitter();
  @Output() IBAN: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();

  resetPaymentDetailsForm() {
    this.submitted = false;
  }

  isFormsValid() {
    return true;
  }
}

/* --------------------------------------------------------- */

/* -----------------Bank Details Mock Component ---------------------- */

@Component({
  selector: 'est-bank-details-dc',
  template: '',
  providers: [
    {
      provide: BankDetailsDcComponent,
      useClass: BankStubComponent
    }
  ]
})
export class BankStubComponent {
  bankAccountDetailsForm: FormGroup = new FormGroup({});

  //Input Variables
  @Input() bankNameList: Lov;
  @Input() bankAccount: BankAccount;

  //output variables
  @Output() IBAN: EventEmitter<any> = new EventEmitter();

  resetBankDetailsForm() {}
}

/* --------------------------------------------------------- */

/* -----------------Verify Establishment Mock-------------- */
@Component({
  selector: 'est-verify-establishment-dc',
  template: '',
  providers: [
    {
      provide: VerifyEstablishmentDCComponent,
      useClass: VerifyEstablishmentStubComponent
    }
  ]
})
export class VerifyEstablishmentStubComponent {
  establishmentDetailsForm: FormGroup = new FormGroup({});
  /**
   * Input Variables from Add Establishment SC Component
   */
  @Input() legalEntityList: Lov;
  @Input() licenseIssuingAuthorityList: LovList;
  @Input() establishmentBranchTypeList: LovList;

  /**
   * Output Variables
   */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() proceed: EventEmitter<null> = new EventEmitter();
  resetVerifyEstablishmentForm() {}
}

/* --------------------------------------------------------- */

/* -----------------Verify GCC Establishment Mock-------------- */

@Component({
  selector: 'est-verify-gcc-establishment-dc',
  template: '',
  providers: [
    {
      provide: VerifyGccEstablishmentDcComponent,
      useClass: VerifyGccEstablishmentStubComponent
    }
  ]
})
export class VerifyGccEstablishmentStubComponent {
  gccEstablishmentDetailsForm: FormGroup = new FormGroup({});
  //Input variables
  @Input() gccCountryList: LovList = new LovList(null);
  @Input() legalEntityList: LovList;

  //Output Variables
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() proceed: EventEmitter<null> = new EventEmitter();
  resetVerifyGCCEstablishmentForm() {}
}
/* --------------------------------------------------------- */

/* -----------------Verify Scan Document Mock-------------- */
@Component({
  selector: 'est-scan-documents-dc',
  template: '',
  providers: [
    {
      provide: ScanDocumentsDcComponent,
      useClass: ScanDocumentsStubComponent
    }
  ]
})
export class ScanDocumentsStubComponent {
  resetDocuments() {}
}

/* --------------------------------------------------------- */

/* ----------------establishment type Mock------------------ */

@Component({
  selector: 'est-establishment-type-dc',
  template: '',
  providers: [
    {
      provide: EstablishmentTypeDcComponent,
      useClass: EstablishmentTypeMockComponent
    }
  ]
})
export class EstablishmentTypeMockComponent {
  @Input() establishmentTypeList: LovList = null;

  /** Output Variables */
  @Output() next: EventEmitter<null> = new EventEmitter();

  resetEstablishmentTypeForm() {}
}
/* --------------------------------------------------------- */

@Component({
  selector: 'est-establishment-info-dc',
  template: '',
  providers: [
    {
      provide: EstablishmentInfoDcComponent,
      useClass: EstablishmentInfoMockComponent
    }
  ]
})
export class EstablishmentInfoMockComponent {
  @Input() establishment: Establishment = new Establishment();
}

// Dummy component for mocking router.navigate
@Component({
  selector: 'est-dummy-dc',
  template: ''
})
export class DummyComponent {}

// Dummy component for mocking router.navigate
@Component({
  selector: 'est-dummy-proactive-dc',
  template: ''
})
export class DummyProactiveComponent {}

export const FIELDOFFICE_MOCK_COMPONENTS = [
  DummyProactiveComponent,
  DummyComponent,
  VerifyEstablishmentStubComponent,
  EstablishmentDetailsStubComponent,
  PaymentDetailsStubComponent,
  SearchPersonStubComponent,
  OwnerStubComponent,
  PersonDetailsStubComponent,
  VerifyGccEstablishmentStubComponent,
  ScanDocumentsStubComponent,
  EstablishmentTypeMockComponent,
  EstablishmentInfoMockComponent
];
