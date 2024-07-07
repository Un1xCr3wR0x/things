import { bindToObject, Person } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const contributorTestData = {
  socialInsuranceNo: 601336235,
  vicIndicator: false,
  person: {
    personId: 1031169904,
    nationality: {
      arabic: 'الهند',
      english: 'India'
    },
    identity: [
      {
        idType: 'NIN',
        newNin: 1034402360,
        oldNin: null,
        oldNinDateOfIssue: null,
        oldNinIssueVillage: null,
        expiryDate: null
      },
      {
        idType: 'PASSPORT',
        passportNo: 'A09541604',
        expiryDate: null,
        issueDate: {
          gregorian: '2013-04-14T00:00:00.000Z',
          hijiri: '1434-06-04'
        }
      },
      {
        idType: 'IQAMA',
        iqamaNo: 2408227102,
        expiryDate: null
      },
      {
        idType: 'BORDERNO',
        id: 4032587356
      }
    ],
    name: {
      arabic: {
        firstName: 'محمد',
        secondName: 'رشاد',
        thirdName: 'مصطفى',
        familyName: 'ابو هنديه'
      },
      english: {
        name: 'Khalid hossaini'
      }
    },
    sex: {
      arabic: 'ذكر',
      english: 'Male'
    },
    education: {
      arabic: 'بكالوريس',
      english: 'Bachelor'
    },
    birthDate: {
      gregorian: '1984-09-26T00:00:00.000Z',
      hijiri: '1405-01-01'
    },
    maritalStatus: {
      arabic: 'اعزب',
      english: 'Single'
    },
    contactDetail: {
      addresses: [
        {
          type: 'POBOX',
          country: {
            arabic: 'السعودية ',
            english: 'Saudi Arabia'
          },
          city: {
            arabic: 'الجابرية',
            english: 'Aljabryah'
          },
          postalCode: '00047',
          postBox: '088909',
          cityDistrict: {
            arabic: 'ينبع',
            english: 'District0302'
          }
        }
      ],
      emailId: {
        primary: 'APETER@gosi.gov.sa'
      },
      telephoneNo: {
        primary: null,
        extensionPrimary: null,
        secondary: null,
        extensionSecondary: null
      },
      mobileNo: {
        primary: '0510220145',
        secondary: null,
        isdCodePrimary: null,
        isdCodeSecondary: null
      },
      faxNo: null,
      currentMailingAddress: 'POBOX',
      mobileNoVerified: false
    },
    userPreferences: {
      commPreferences: 'En'
    },
    prisoner: false,
    student: false,
    govtEmp: false,
    personType: 'Saudi_Person'
  },
  hasActiveWorkFlow: false,
  contributorType: 'SAUDI',
  active: true
};
export const personTestData = {
  personId: 46200,
  nationality: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
  identity: [
    {
      idType: 'NIN',
      newNin: 1018589059,
      oldNin: null,
      oldNinDateOfIssue: null,
      oldNinIssueVillage: null,
      expiryDate: null
    }
  ],
  name: {
    arabic: {
      firstName: 'محمد',
      secondName: 'فهد',
      thirdName: 'محمد',
      familyName: 'الريس'
    },
    english: {}
  },
  sex: {
    arabic: 'ذكر',
    english: 'Male'
  },
  education: {
    arabic: 'أمي',
    english: 'Illiterate'
  },
  birthDate: {
    gregorian: '1932-10-31T00:00:00.000Z',
    hijiri: '1351-07-01'
  },
  deathDate: {
    gregorian: '2013-12-02T00:00:00.000Z',
    hijiri: '1435-01-29'
  },
  maritalStatus: {
    arabic: 'متزوج',
    english: 'Married'
  },
  lifeStatus: null,
  userPreferences: {
    commPreferences: 'Ar'
  },
  govtEmp: false
};
export const PersonalInformation = bindToObject(new Person(), {
  name: {
    arabic: {
      firstName: 'محمد',
      secondName: 'جاسم',
      thirdName: 'محمد',
      familyName: 'الخميس'
    },
    english: {
      name: ''
    }
  },
  personType: '',
  fullName: 'Dipin Joseph',
  id: 0,
  specialization: { english: 'India', arabic: 'india' },
  nationality: { english: 'India', arabic: 'india' },
  sex: { english: 'India', arabic: 'india' },
  maritalStatus: { english: 'India', arabic: 'india' },
  birthDate: {
    gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
    hijiri: null
  },
  deathDate: {
    gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
    hijiri: null
  },
  education: { english: 'India', arabic: 'india' },
  borderNo: 0,
  govtEmp: false,
  passport: {
    passportNo: '3731012',
    expiryDate: {
      gregorian: new Date(),
      hijiri: null
    },
    issueDate: {
      gregorian: new Date(),
      hijiri: null
    }
  },

  identity: [
    {
      idType: 'PASSPORT',
      passportNo: '35weera234234as'
    },
    {
      idType: 'IQAMA',
      iqamaNo: 2000000006
    },
    {
      id: 234234234234,
      idType: 'GCCID'
    }
  ],
  contactDetail: {
    emailId: {
      primary: '',
      secondary: ' '
    },
    mobileNo: {
      primary: '124536978',
      secondary: ' ',
      isdCodePrimary: ' ',
      isdCodeSecondary: ' '
    },
    telephoneNo: {
      extensionPrimary: 'string',
      extensionSecondary: 'string',
      primary: 'string',
      secondary: 'string'
    },
    faxNo: '12345',

    addresses: [
      {
        country: { english: 'India', arabic: 'india' },
        city: { english: 'India', arabic: 'india' },
        postalCode: 'test',
        postBox: 'test',
        buildingNo: 'test',
        district: 'test',
        cityDistrict: 'String',
        streetName: 'test',
        type: 'POBOX',
        additionalNo: '123',
        unitNo: '54653',
        detailedAddress: ' '
      }
    ]
  },
  lifeStatus: 'Alive'
});
export const personalDetailsTestData = {
  personId: 1036053648,
  nationality: { arabic: 'مصر', english: 'Egypt' },
  identity: [
    {
      idType: 'PASSPORT',
      passportNo: 'A18803474',
      issueDate: { gregorian: '2016-08-13T00:00:00.000Z', hijiri: '1437-11-10' }
    },
    /* {
      idType: 'IQAMA',
      iqamaNo: 2475362386,
      expiryDate: {
        gregorian: '2020-11-21T00:00:00.000Z',
        hijiri: '1442-04-06'
      }
    }, */
    { idType: 'BORDERNO', id: 3048746279 }
  ],
  name: {
    arabic: {
      firstName: 'هبه',
      secondName: 'عبد الرحيم',
      thirdName: 'حسين',
      familyName: 'محمد'
    },
    english: { name: 'Abdulah' }
  },
  sex: { arabic: 'انثى', english: 'Female' },
  education: { arabic: 'ثانويه عامه', english: 'High School' },
  specialization: { arabic: 'الزراعة', english: 'الزراعة' },
  birthDate: { gregorian: '1994-06-10T00:00:00.000Z', hijiri: '1415-01-01' },
  deathDate: null,
  maritalStatus: { arabic: 'اعزب', english: 'Single' },
  contactDetail: {
    addresses: {
      type: 'NATIONAL',
      city: { arabic: 'رخو', english: 'Rokho' },
      buildingNo: '1111',
      postalCode: '11391',
      district: 'streetarea',
      streetName: 'Ulala',
      additionalNo: null,
      unitNo: null,
      cityDistrict: null
    },
    emergencyContactNo: '0112153626',
    emailId: { primary: 'hr@al-bilad.com' },
    telephoneNo: {
      primary: '0112153626',
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: '0501206817',
      secondary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null,
      fromJsonToObject: () => {
        return undefined;
      }
    },
    isMobileNoVerified: true,
    faxNo: null
  },
  lifeStatus: null,
  govtEmp: false,
  personDetails: {
    personId: 1036053648,
    nationality: { arabic: 'مصر', english: 'Egypt' },
    identity: [
      {
        idType: 'PASSPORT',
        passportNo: 'A18803474',
        issueDate: {
          gregorian: new Date(),
          hijiri: '1440-07-06'
        },

        //common
        expiryDate: new Date(),
        //iqama details
        iqamaNo: null,
        borderNo: null,

        //nin
        newNin: null,
        oldNin: null,
        oldNinDateOfIssue: {
          gregorian: new Date(),
          hijiri: '1440-07-06'
        },
        oldNinIssueVillage: null,

        //national id
        id: null
      },
      /* {
        idType: 'IQAMA',
        iqamaNo: 2475362386,
        expiryDate: {
          gregorian: '2020-11-21T00:00:00.000Z',
          hijiri: '1442-04-06'
        }
      }, */
      { idType: 'BORDERNO', id: 3048746279 }
    ],
    name: {
      arabic: {
        firstName: 'هبه',
        secondName: 'عبد الرحيم',
        thirdName: 'حسين',
        familyName: 'محمد'
      },
      english: { name: 'Abdulah' }
    },
    sex: { arabic: 'انثى', english: 'Female' },
    education: { arabic: 'ثانويه عامه', english: 'High School' },
    specialization: { arabic: 'الزراعة', english: 'الزراعة' },
    birthDate: {
      gregorian: new Date(),
      hijiri: '1440-07-06'
    },
    deathDate: null,
    maritalStatus: { arabic: 'اعزب', english: 'Single' },
    contactDetail: {
      addresses: {
        type: 'NATIONAL',
        city: { arabic: 'رخو', english: 'Rokho' },
        buildingNo: '1111',
        postalCode: '11391',
        district: 'streetarea',
        streetName: 'Ulala',
        additionalNo: null,
        unitNo: null,
        cityDistrict: null,
        postBox: null,
        detailedAddress: null,
        country: { arabic: 'رخو', english: 'Rokho' }
      },
      emailId: { primary: 'hr@al-bilad.com' },
      emergencyContactNo: '0112153626',
      telephoneNo: {
        primary: '0112153626',
        extensionPrimary: null,
        secondary: null,
        extensionSecondary: null
      },
      mobileNo: {
        primary: '0501206817',
        secondary: null,
        isdCodePrimary: null,
        isdCodeSecondary: null,
        fromJsonToObject: () => {
          return undefined;
        }
      },
      isMobileNoVerified: true,
      faxNo: null
    },
    lifeStatus: null,
    govtEmp: false,
    userPreference: {
      commPreferences: 'sfdsd'
    }
  }
};
export const manageInjuryPersonResponse = {
  personDetails: {
    personId: 1036053648,
    nationality: { arabic: 'مصر', english: 'Egypt' },
    identity: [
      {
        idType: 'PASSPORT',
        passportNo: 'A18803474',
        issueDate: {
          gregorian: new Date(),
          hijiri: '1440-07-06'
        },

        //common
        expiryDate: new Date(),
        //iqama details
        iqamaNo: null,
        borderNo: null,

        //nin
        newNin: null,
        oldNin: null,
        oldNinDateOfIssue: {
          gregorian: new Date(),
          hijiri: '1440-07-06'
        },
        oldNinIssueVillage: null,

        //national id
        id: null
      },
      /* {
        idType: 'IQAMA',
        iqamaNo: 2475362386,
        expiryDate: {
          gregorian: '2020-11-21T00:00:00.000Z',
          hijiri: '1442-04-06'
        }
      }, */
      { idType: 'BORDERNO', id: 3048746279 }
    ],
    name: {
      arabic: {
        firstName: 'هبه',
        secondName: 'عبد الرحيم',
        thirdName: 'حسين',
        familyName: 'محمد'
      },
      english: { name: 'Abdulah' }
    },
    sex: { arabic: 'انثى', english: 'Female' },
    education: { arabic: 'ثانويه عامه', english: 'High School' },
    specialization: { arabic: 'الزراعة', english: 'الزراعة' },
    birthDate: {
      gregorian: new Date(),
      hijiri: '1440-07-06'
    },
    deathDate: null,
    maritalStatus: { arabic: 'اعزب', english: 'Single' },
    contactDetail: {
      addresses: {
        type: 'NATIONAL',
        city: { arabic: 'رخو', english: 'Rokho' },
        buildingNo: '1111',
        postalCode: '11391',
        district: 'streetarea',
        streetName: 'Ulala',
        additionalNo: null,
        unitNo: null,
        cityDistrict: null,
        postBox: null,
        detailedAddress: null,
        country: { arabic: 'رخو', english: 'Rokho' }
      },
      emailId: { primary: 'hr@al-bilad.com' },
      emergencyContactNo: '0112153626',
      telephoneNo: {
        primary: '0112153626',
        extensionPrimary: null,
        secondary: null,
        extensionSecondary: null
      },
      mobileNo: {
        primary: '0501206817',
        secondary: null,
        isdCodePrimary: null,
        isdCodeSecondary: null,
        fromJsonToObject: () => {
          return undefined;
        }
      },
      isMobileNoVerified: true,
      faxNo: null
    },
    lifeStatus: null,
    govtEmp: false,
    userPreference: {
      commPreferences: 'sfdsd'
    }
  },
  engagement: {
    occupation: { arabic: 'انثى', english: 'Female' }
  }
};
export const engagementsTestData = {
  approvalDate: { gregorian: '2016-03-23T00:00:00.000Z', hijiri: '1437-06-14' },
  backdatingIndicator: false,
  contributorAbroad: false,
  engagementId: 1552527046,
  engagementPeriod: [
    {
      startDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: null
      },
      endDate: {
        gregorian: new Date(1987, 11, 24, 10, 33, 30, 0),
        hijiri: null
      },
      occupation: { english: 'Teacher', arabic: 'Teacher' },
      wage: {
        basicWage: 123,
        commission: 123,
        housingBenefit: 123,
        otherAllowance: 123,
        totalWage: 123,
        contributoryWage: 123
      }
    }
  ],
  anyPendingRequest: false,
  isContributorActive: true,
  joiningDate: { gregorian: '2016-03-06T00:00:00.000Z', hijiri: '1437-05-26' },
  penaltyIndicator: null,
  prisoner: false,
  proactive: true,
  status: 'LIVE',
  student: false,
  transactionRefNo: 0
};
