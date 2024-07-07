import { ContactDetails, EmailType, MobileDetails, PhoneDetails, AddressDetails } from '@gosi-ui/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export class SearchForms {
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}
  public createSearchForm(): FormGroup {
    return this.fb.group({
      searchKeyForm: this.fb.group({
        searchKey: [null, Validators.compose([Validators.required])]
      }),
      advancedSearchForm: this.fb.group({
        name: [null],
        nationalityCode: [null],
        phoneNumber: [null],
        oldNationalId: [null],
        birthDate: [null],
        nationality: this.fb.group({
          english: [null],
          arabic: [null]
        }),
        passportNo: [null],
        borderNo: [null],
        gccId: [null]
      })
    });
  }
  public createEstSearchForm(): FormGroup {
    return this.fb.group({
      searchKeyForm: this.fb.group({
        searchKey: [null, Validators.compose([Validators.required])]
      }),
      advancedSearchForm: this.fb.group({
        personIdentifier: [null],
        phoneNumber: [null],
        licenceNo: [null],
        commercialRegistrationNo: [null],
        recruitmentNo: [null],
        unifiedIdentificationNo: [null]
      })
    });
  }
}
export const establishmentCertificateStatus = {
  isEligible: false
};
export const billHistoryWrapper = {
  accountNumber: 0,
  retainedBalance: 0,
  totalCreditBalance: 0,
  totalDebitBalance: 0,
  transferableBalance: 1000
};
export const branchListMockData = {
  branchList: [
    {
      name: {
        arabic: 'في طور إنتهاء النشاط',
        english: 'ahmed'
      },
      registrationNo: 10000602,
      noOfBranches: 2,
      status: {
        arabic: 'في طور إنتهاء النشاط',
        english: 'Closing in progress'
      }
    },
    {
      name: {
        arabic: 'في طور إنتهاء النشاط',
        english: 'ahmed al'
      },
      registrationNo: 10000602,
      noOfBranches: 1,
      status: {
        arabic: 'في طور إنتهاء النشاط',
        english: 'Registered'
      }
    }
  ]
};
export const establishmentMockData = {
  billDetails: null,
  isCertificateEligible: false,
  isCertificateLoading: null,
  isBalanceLoading: null,
  isAuthorized: true,
  organizationCategory: null,
  isCertificateAuthorized: false,
  isBillDashboardAuthorized: false,
  startDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' },
  activityType: {
    arabic: 'تشييد المباني وأعمال الهندسة المدنية',
    english: 'Activity 5.1.3'
  },
  comments: null,
  contactDetails: {
    currentMailingAddress: 'NATIONAL',
    addresses: [
      {
        country: null,
        postBox: null,
        additionalNo: null,
        unitNo: null,
        detailedAddress: null,
        type: 'NATIONAL',
        city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
        buildingNo: null,
        cityDistrict: null,
        district: null,
        postalCode: null,
        streetName: 'true',

        fromJsonToObject(json) {
          Object.keys(json).forEach(key => {
            if (key in new AddressDetails() && json[key]) {
              this[key] = json[key];
            }
          });
          return this;
        }
      }
    ],
    emailId: null,
    faxNo: null,
    mobileNo: {
      primary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null,
      secondary: null,
      fromJsonToObject(json: MobileDetails) {
        if (json) {
          Object.keys(json).forEach(key => {
            if (key in this) {
              this[key] = json[key];
            }
          });
        }
        return this;
      }
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null,
      fromJsonToObject(json: PhoneDetails) {
        if (json) {
          Object.keys(json).forEach(key => {
            if (key in new PhoneDetails()) {
              this[key] = json[key];
            }
          });
        }
        return this;
      }
    },
    emergencyContactNo: null,
    fromJsonToObject(json: ContactDetails) {
      if (json) {
        Object.keys(json).forEach(key => {
          if (key in new ContactDetails()) {
            if (key === 'emailId') {
              this[key] = new EmailType().fromJsonToObject(json[key]);
            } else if (key === 'mobileNo') {
              this[key] = new MobileDetails().fromJsonToObject(json[key]);
            } else if (key === 'telephoneNo') {
              this[key] = new PhoneDetails().fromJsonToObject(json[key]);
            } else {
              this[key] = json[key];
            }
          }
        });
      }
      return this;
    }
  },
  crn: {
    number: 12312,
    mciVerified: true,
    issueDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' }
  },
  establishmentAccount: {
    registrationNo: null,
    paymentType: null,
    startDate: null,
    bankAccount: null,
    navigationIndicator: null,
    referenceNo: null,
    lateFeeIndicator: null
  },
  establishmentType: { arabic: 'رئيسي ', english: 'Main' },
  gccCountry: false,
  gccEstablishment: null,
  legalEntity: { arabic: 'منشأة تضامن', english: 'Partnership' },
  license: null,
  mainEstablishmentRegNo: null,
  molEstablishmentIds: {
    molEstablishmentId: 79636,
    molOfficeId: 5,
    molEstablishmentOfficeId: 25,
    molunId: 5742
  },
  name: { arabic: 'CRN issue date from MCI', english: null },
  nationalityCode: { arabic: 'السعودية ', english: 'Saudi Arabia' },
  navigationIndicator: null,
  proactive: true,
  recruitmentNo: 23423432,
  registrationNo: 10000602,
  scanDocuments: null,
  status: null,
  transactionMessage: null,
  transactionReferenceData: null,
  validatorEdited: false,
  adminRegistered: false,
  transactionTracingId: 135,
  fieldOfficeName: null,
  mainCrn: null,
  registrationCompleted: null,
  engagementInfo: null
};
export const establishmentMockDatas = {
  billDetails: null,
  isCertificateEligible: false,
  isCertificateLoading: null,
  isBalanceLoading: null,
  isAuthorized: false,
  organizationCategory: null,
  isCertificateAuthorized: false,
  isBillDashboardAuthorized: false,
  startDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' },
  activityType: {
    arabic: 'تشييد المباني وأعمال الهندسة المدنية',
    english: 'Activity 5.1.3'
  },
  comments: null,
  contactDetails: {
    currentMailingAddress: 'NATIONAL',
    addresses: [
      {
        country: null,
        postBox: null,
        additionalNo: null,
        unitNo: null,
        detailedAddress: null,
        type: 'NATIONAL',
        city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
        buildingNo: null,
        cityDistrict: null,
        district: null,
        postalCode: null,
        streetName: 'true',

        fromJsonToObject(json) {
          Object.keys(json).forEach(key => {
            if (key in new AddressDetails() && json[key]) {
              this[key] = json[key];
            }
          });
          return this;
        }
      }
    ],
    emailId: null,
    faxNo: null,
    mobileNo: {
      primary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null,
      secondary: null,
      fromJsonToObject(json: MobileDetails) {
        if (json) {
          Object.keys(json).forEach(key => {
            if (key in this) {
              this[key] = json[key];
            }
          });
        }
        return this;
      }
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null,
      fromJsonToObject(json: PhoneDetails) {
        if (json) {
          Object.keys(json).forEach(key => {
            if (key in new PhoneDetails()) {
              this[key] = json[key];
            }
          });
        }
        return this;
      }
    },
    emergencyContactNo: null,
    fromJsonToObject(json: ContactDetails) {
      if (json) {
        Object.keys(json).forEach(key => {
          if (key in new ContactDetails()) {
            if (key === 'emailId') {
              this[key] = new EmailType().fromJsonToObject(json[key]);
            } else if (key === 'mobileNo') {
              this[key] = new MobileDetails().fromJsonToObject(json[key]);
            } else if (key === 'telephoneNo') {
              this[key] = new PhoneDetails().fromJsonToObject(json[key]);
            } else {
              this[key] = json[key];
            }
          }
        });
      }
      return this;
    }
  },
  crn: {
    number: 12312,
    mciVerified: true,
    issueDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' }
  },
  establishmentAccount: {
    registrationNo: null,
    paymentType: null,
    startDate: null,
    bankAccount: null,
    navigationIndicator: null,
    referenceNo: null,
    lateFeeIndicator: null
  },
  establishmentType: { arabic: 'رئيسي ', english: 'Main' },
  gccCountry: false,
  gccEstablishment: null,
  legalEntity: { arabic: 'منشأة تضامن', english: 'Partnership' },
  license: null,
  mainEstablishmentRegNo: null,
  molEstablishmentIds: {
    molEstablishmentId: 79636,
    molOfficeId: 5,
    molEstablishmentOfficeId: 25,
    molunId: 5742
  },
  name: { arabic: 'CRN issue date from MCI', english: null },
  nationalityCode: { arabic: 'السعودية ', english: 'Saudi Arabia' },
  navigationIndicator: null,
  proactive: true,
  recruitmentNo: 23423432,
  registrationNo: null,
  scanDocuments: null,
  status: null,
  transactionMessage: null,
  transactionReferenceData: null,
  validatorEdited: false,
  adminRegistered: false,
  transactionTracingId: 135,
  fieldOfficeName: null,
  mainCrn: null,
  registrationCompleted: null,
  engagementInfo: null
};
