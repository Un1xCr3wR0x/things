/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { IdentityTypeEnum, NationalityTypeEnum } from '../enums';

import { AddressDetails } from '../models/address-details';
import { BilingualText } from '../models/bilingual-text';
import { BorderNumber } from '../models/border-number';
import { CommonIdentity } from '../models/common-identity';
import { Iqama } from '../models/iqama';
import { Name } from '../models/name';
import { NationalId } from '../models/national-id';
import { NIN } from '../models/nin';
import { Passport } from '../models/passport';
import { checkNull, isObject } from './objects';
// Constants
export const gccCountryList = ['United Arab Emirates', 'Bahrain', 'Qatar', 'Oman', 'Kuwait'];

/**
 *
 * @param person
 * @param obj
 */
export const setPersonToObject = function (person, obj) {
  if (obj) {
    const personObj = obj;
    Object.keys(personObj).forEach(key => {
      if (key in person) {
        if (key === 'birthDate') {
          personObj.birthDate.hijiri = person[key].hijiri;
          const momentObj = moment(person[key].gregorian, 'YYYY-MM-DD');
          const momentString = momentObj.format('DD/MM/YYYY');
          personObj.birthDate.gregorian = moment(momentString, 'DD/MM/YYYY').toDate();
        }
        if (key === 'nationality') {
          personObj.nationality = person[key].nationality;
        }
        if (key === 'identity') {
          personObj.identity[0] = person[key][0];
        }
        if (key === 'contactDetail') {
          personObj.contactDetail = person[key];
        } else {
          personObj[key] = person[key];
        }
      }
    });
    return personObj;
  }
};
/**
 *
 * @param person
 * @param obj
 */
export const setEngagementToObject = function (engagements, obj) {
  if (obj) {
    const engagementObj = obj;
    Object.keys(engagementObj).forEach(key => {
      if (key in engagements) {
        if (key === 'joiningDate') {
          engagementObj.joiningDate.hijiri = engagements[key].hijiri;
          const momentObj = moment(engagements[key].gregorian, 'YYYY-MM-DD');
          const momentString = momentObj.format('DD/MM/YYYY');
          engagementObj.joiningDate.gregorian = moment(momentString, 'DD/MM/YYYY').toDate();
        }
        if (key === 'occupation') {
          engagementObj.occupation = engagements[key].occupation;
        }
      }
    });
    return engagementObj;
  }
};

/**
 *
 * @param nameObj
 */
export const getPersonNameAsBilingual = nameObj => {
  if (nameObj) {
    return {
      arabic: getPersonArabicName(nameObj.arabic),
      english: getPersonEnglishName(nameObj.english)
    };
  }
};

/**
 * Method to copy to arabic if english is not there
 * @param name
 */
export const setArabicIfEnglishEmpty = (name: BilingualText): BilingualText => {
  if (name === undefined) {
    return name;
  }
  if (!name.english) {
    name.english = name.arabic;
  }
  return name;
};

/**
 *
 * @param nameObj name object from person entity
 * @param preference can be either 'en' or 'ar',
 * based on that it will set the default name
 */
export const getPersonName = (nameObj, preference): string => {
  if (nameObj) {
    const arabic = getPersonArabicName(nameObj.arabic);
    const english = getPersonEnglishName(nameObj.english);
    return preference === 'en' && !checkNull(english) ? english : arabic;
  }
};

/**
 *
 * @param arabicObj name object of the person in arabic
 */
export const getPersonArabicName = (arabicObj) => {
  if (arabicObj) {
    return (
      (arabicObj.firstName ? arabicObj.firstName : '') +
      ' ' +
      (arabicObj.secondName ? arabicObj.secondName : '') +
      ' ' +
      (arabicObj.thirdName ? arabicObj.thirdName : '') +
      ' ' +
      (arabicObj.familyName ? arabicObj.familyName : '')
    ).trim();
  } else {
    return null;
  }
};

/**
 *
 * @param englishObj name of the person in english
 */
export const getPersonEnglishName = (englishObj) => {
  if (englishObj && englishObj.name) {
    return englishObj.name.trim();
  } else {
    return null;
  }
};

/**
 *
 * @param nationality can be any of th country
 * function to return the type of nationality(Saudi, Non-Saudi, GCC)
 */

export const getNationalityType = (nationality, identities, contributorAccount?) => {
  if (nationality === NationalityTypeEnum.SAUDI_NATIONAL) {
    return NationalityTypeEnum.SAUDI_NATIONAL;
  } else {
    if (contributorAccount) {
      let isGCC = false;
      identities.forEach(identity => {
        if (identity.idType === IdentityTypeEnum.NATIONALID && identity.id !== undefined) {
          gccCountryList.forEach(country => {
            if (nationality === country) {
              isGCC = true;
            }
          });
        }
      });
      return isGCC ? NationalityTypeEnum.GCC_NATIONAL : NationalityTypeEnum.NON_SAUDI_NATIONAL;
    } else {
      let isGCC = false;
      gccCountryList.forEach(country => {
        if (nationality === country) {
          isGCC = true;
        }
      });
      return isGCC ? NationalityTypeEnum.GCC_NATIONAL : NationalityTypeEnum.NON_SAUDI_NATIONAL;
    }
  }
};

/**
 * This method is used to return common identity based on nationality and identities provided
 * @param identities identity list will be having (NIN,IQAMA,PASSPORT,BORDERNO,GCCID)
 * @param nationality getting the person nationality type
 */
export const getIdentityByType = (
  identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>,
  nationality: string,
  contributorAccount?: boolean
): CommonIdentity => {
  const nationalityType = getNationalityType(nationality, identities, contributorAccount);
  let returnObj: CommonIdentity = new CommonIdentity();
  if (nationalityType === NationalityTypeEnum.NON_SAUDI_NATIONAL) {
    if (identities && identities.length > 0) {
      returnObj = checkIqamaOrBorderOrPassport(identities);
      if (returnObj === null) {
        returnObj = new CommonIdentity();
        returnObj.idType = IdentityTypeEnum.IQAMA;
        returnObj.id = null;
      }
    } else {
      returnObj.idType = IdentityTypeEnum.IQAMA;
      returnObj.id = null;
    }
    return returnObj;
  }

  if (nationalityType === NationalityTypeEnum.SAUDI_NATIONAL) {
    returnObj.idType = IdentityTypeEnum.NIN;
    returnObj.id = null;
    if (identities?.length > 0) {
      identities.forEach(identity => {
        if (identity.idType === IdentityTypeEnum.NIN) {
          identity = <NIN>identity;
          returnObj.id = identity.newNin ? identity.newNin : null;
        }
      });
    }
    return returnObj;
  }

  if (nationalityType === NationalityTypeEnum.GCC_NATIONAL) {
    let nationalObj = null;
    if (identities && identities.length > 0) {
      identities.forEach(identity => {
        if (identity.idType === IdentityTypeEnum.NATIONALID) {
          identity = <NationalId>identity;
          nationalObj = new CommonIdentity();
          nationalObj.idType = IdentityTypeEnum.NATIONALID;
          nationalObj.id = identity.id;
        }
      });
      if (nationalObj === null) {
        returnObj = checkIqamaOrBorderOrPassport(identities);
        if (returnObj === null) {
          returnObj = new CommonIdentity();
          returnObj.idType = IdentityTypeEnum.NATIONALID;
          returnObj.id = null;
        }
      }
    } else {
      returnObj.idType = IdentityTypeEnum.NATIONALID;
      returnObj.id = null;
    }
    if (nationalObj) {
      return nationalObj;
    } else {
      return returnObj;
    }
  }
};

/**
 * This method is to return iqama or border or passport based on priority else null
 * @param identities
 */
export const checkIqamaOrBorderOrPassport = function (
  identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>
): CommonIdentity | null {
  let iqamaObj = null;
  let borderObj = null;
  let passportObj = null;
  let ninObj = null;
  let nationalIdObj = null;

  identities.forEach(identity => {
    if (identity.idType === IdentityTypeEnum.IQAMA) {
      identity = <Iqama>identity;
      iqamaObj = new CommonIdentity();
      iqamaObj.idType = IdentityTypeEnum.IQAMA;
      iqamaObj.id = identity.iqamaNo;
    } else if (identity.idType === IdentityTypeEnum.BORDER) {
      identity = <BorderNumber>identity;
      borderObj = new CommonIdentity();
      borderObj.idType = IdentityTypeEnum.BORDER;
      borderObj.id = identity.id;
    } else if (identity.idType === IdentityTypeEnum.PASSPORT) {
      identity = <Passport>identity;
      passportObj = new CommonIdentity();
      passportObj.idType = IdentityTypeEnum.PASSPORT;
      passportObj.id = identity.passportNo;
    } else if (identity.idType === IdentityTypeEnum.NIN) {
      identity = <NIN>identity;
      ninObj = new CommonIdentity();
      ninObj.idType = IdentityTypeEnum.NIN;
      ninObj.id = identity.newNin;
    } else if (identity.idType === IdentityTypeEnum.NATIONALID) {
      identity = <NationalId>identity;
      nationalIdObj = new CommonIdentity();
      nationalIdObj.idType = IdentityTypeEnum.NATIONALID;
      nationalIdObj.id = identity.id;
    }
  });
  return iqamaObj
    ? iqamaObj
    : borderObj
    ? borderObj
    : passportObj
    ? passportObj
    : ninObj
    ? ninObj
    : nationalIdObj
    ? nationalIdObj
    : null;
};

/**
 * This method is used to get the  identifiers applicable as per the nationality
 * @param person
 */
export const getPersonIdentifier = person => {
  if (person && person.nationality) {
    if (person.nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
      return getSaudiPersonIdentifier(person.identity);
    } else if (gccCountryList.indexOf(person.nationality.english) !== -1) {
      return getGCCPersonIdentifiers(person.identity);
    } else {
      return getNonSaudiPersonIdentifier(person.identity);
    }
  } else {
    return [];
  }
};

/**
 * This util is to used get all identifiers a GCC Person can have
 * @param identities
 */
export const getGCCPersonIdentifiers = (identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) => {
  const identityList: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  let nationalId: NationalId = new NationalId();
  nationalId = {
    ...(<NationalId>getIdentityValue(identities, IdentityTypeEnum.NATIONALID) || nationalId)
  };
  identityList.push(nationalId, ...getNonSaudiPersonIdentifier(identities));
  return identityList;
};

/**
 * This util is to used get all identifiers a Non Saudi Person can have
 * @param identities
 */
export const getNonSaudiPersonIdentifier = identities => {
  const identityList: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  let iqama: Iqama = new Iqama();
  iqama = { ...(<Iqama>getIdentityValue(identities, IdentityTypeEnum.IQAMA) || iqama) };
  identityList.push(iqama);

  let borderNumber: BorderNumber = new BorderNumber();
  borderNumber = {
    ...(<BorderNumber>getIdentityValue(identities, IdentityTypeEnum.BORDER) || borderNumber)
  };
  identityList.push(borderNumber);

  let passport: Passport = new Passport();
  passport = {
    ...(<Passport>getIdentityValue(identities, IdentityTypeEnum.PASSPORT) || passport)
  };
  identityList.push(passport);

  return identityList;
};

/**
 * This util is to used get all identifiers a Saudi Person can have
 * @param identities
 */
export const getSaudiPersonIdentifier = identities => {
  const identityList: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];

  let nin: NIN = new NIN();
  nin = { ...(<NIN>getIdentityValue(identities, IdentityTypeEnum.NIN) || nin) };
  identityList.push(nin);

  return identityList;
};

/**
 * Get the identity from identityList
 * @param identities
 * @param idType
 */
export const getIdentityValue = (
  identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>,
  idType: string
): NIN | Iqama | NationalId | Passport | BorderNumber => {
  return identities.find(item => item.idType === idType);
};

/**
 * Method is used to set address form value to addresses
 * @param addressForm
 */
export const setAddressFormToAddresses = (addressForm: FormGroup) => {
  const addressArray = [];
  if (isAddressValid(addressForm.get('saudiAddress') as FormGroup)) {
    addressArray.push((addressForm.get('saudiAddress') as FormGroup).getRawValue());
  }
  if (isAddressValid(addressForm.get('poBoxAddress') as FormGroup)) {
    addressArray.push((<FormGroup>addressForm.get('poBoxAddress')).getRawValue());
  }
  if (isAddressValid(addressForm.get('foreignAddress') as FormGroup)) {
    addressArray.push((addressForm.get('foreignAddress') as FormGroup).getRawValue());
  }
  return addressArray;
};

/**
 * Check if form is valid if user has entered some value
 * @param addressForm
 */
export const isAddressValid = (addressForm: FormGroup) => {
  if (addressForm) {
    addressForm.markAllAsTouched();
    let isEmpty = true;
    isEmpty = checkIfAddressFormNull(addressForm, isEmpty);
    return isEmpty ? false : addressForm.valid;
  } else {
    return false;
  }
};

/**
 * This method is to check if the address form is empty
 * @param form
 * @param isEmpty
 */
export function checkIfAddressFormNull(form: FormGroup, isEmpty): boolean {
  if (form && form.controls) {
    Object.keys(form.controls).forEach(control => {
      if (isObject(form.get(control).value)) {
        isEmpty = checkIfAddressFormNull(form.get(control) as FormGroup, isEmpty);
      } else if (control !== 'type') {
        if (!checkNull(form.get(control).value)) {
          isEmpty = false;
        }
      }
    });
    return isEmpty;
  }
}

/**
 * This method is to check if the address form is empty
 * @param form
 * @param isEmpty
 */
export const isAddressEmpty = (addressDetails: AddressDetails, nonEmptyKeys?: string[]) => {
  if (addressDetails) {
    if (!nonEmptyKeys) {
      nonEmptyKeys = [];
    }
    Object.keys(addressDetails).forEach(key => {
      if (isObject(addressDetails[key])) {
        isAddressEmpty(addressDetails[key], nonEmptyKeys);
      } else if (key !== 'type') {
        if (!checkNull(addressDetails[key])) {
          nonEmptyKeys.push(key);
        }
      }
    });
    if (nonEmptyKeys.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

/**
 * Method to get the name shortforms to set in the icon
 * @param nameObj
 * @param preference
 */
export const getIconText = (nameObj, preference) => {
  if (nameObj) {
    const arabicName = getPersonArabicName(nameObj.arabic);
    const englishName = getPersonEnglishName(nameObj.english);
    return preference === 'en' && !checkNull(englishName)
      ? englishName[0].charAt(0) + englishName[englishName.length - 1].charAt(0)
      : arabicName[0].charAt(0);
  }
};

/**
 * This method is set Icon Name
 * @param transaction
 */
export const setIconName = (personName: Name) => {
  let iconName = '';
  if (personName && personName.english && personName.english.name) {
    const name: string[] = personName.english.name.split(' ');
    iconName = name[0].substring(0, 1);
    if (name[name.length - 1] && name.length > 1) {
      if (name[name.length - 1].substring(0, 1) !== ' ') {
        iconName += name[name.length - 1].substring(0, 1);
      }
    }
    return iconName;
  }
};
/**
 * Method is used to set wasel address form value to addresses
 * @param addressForm
 */

export const setWaselAddressFormToAddresses = (addressForm: FormGroup) => {
  const addressArray = [];
  addressArray.push((addressForm.get('saudiAddress') as FormGroup).getRawValue());
  if (isAddressValid(addressForm.get('poBoxAddress') as FormGroup)) {
    addressArray.push((<FormGroup>addressForm.get('poBoxAddress')).getRawValue());
  }
  if (isAddressValid(addressForm.get('foreignAddress') as FormGroup)) {
    addressArray.push((addressForm.get('foreignAddress') as FormGroup).getRawValue());
  }
  return addressArray;
};
