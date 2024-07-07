/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { SearchPerson } from '../models/person';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import {
  hijiriToJSON,
  ContactDetails,
  setAddressFormToAddresses,
  CommonIdentity,
  IdentityTypeEnum
} from '@gosi-ui/core';
import { AddressTypeEnum } from '@gosi-ui/features/contributor';
import { FormGroup } from '@angular/forms';

export const buildQueryParamForSearchPerson = function (obj: SearchPerson) {
  let params = new HttpParams();
  params = params.set('includeMaritalIncidentDetails', 'true');
  if (obj.nationality.english) {
    params = params.set('nationality', obj.nationality.english.toString());
  }
  if (obj.dob) {
    if (obj.dob.calendarType === 'gregorian') {
      const dob = moment(new Date(obj.dob.gregorian)).format('YYYY-MM-DD');
      params = params.set('birthDate', dob.toString());
    } else {
      // const dob = moment(new Date(obj.dob.hijiri)).format('YYYY-MM-DD');
      const dob = hijiriToJSON(obj.dob.hijiri);
      params = params.set('birthDateH', dob.toString());
    }
  }

  if (obj.identity.length) {
    obj.identity.forEach(identyType => {
      Object.keys(identyType).forEach(key => {
        if (key != 'idType') {
          if (String(key) == 'newNin' && identyType[key]) {
            params = params.set('NIN', identyType[key]?.toString());
          } else if (String(key) == 'id' && identyType[key]) {
            params = params.set('gccId', identyType[key]?.toString());
          } else if (String(key) == 'passportNo' && identyType[key]) {
            params = params.set('passportNo', identyType[key]?.toString());
            params = params.set('passportSearch', 'true');
          } else if (identyType[key]) {
            params = params.set(String(key), identyType[key]?.toString());
          }
        }
      });
    });
  }

  return params;
};

export const isOverSeas = function (contactDetail: ContactDetails): boolean {
  return contactDetail && contactDetail.currentMailingAddress === AddressTypeEnum.OVERSEAS;
};

export const getContactDetails = function (form: FormGroup): ContactDetails {
  let contactDetails = new ContactDetails().fromJsonToObject(form.get('contactDetail').value);
  contactDetails.currentMailingAddress = form.get('currentMailingAddress').value;
  contactDetails.addresses = setAddressFormToAddresses(form);
  return contactDetails;
};
export const hasvalidValue = val => {
  if (val !== null && val.length > 0) {
    return true;
  }
  return false;
};

export const getIdentityLabel = function (idObj: CommonIdentity): string {
  let label = '';
  if (idObj?.idType === IdentityTypeEnum.NIN) {
    label = 'BENEFITS.NIN-ID';
  } else if (idObj?.idType === IdentityTypeEnum.IQAMA) {
    label = 'BENEFITS.IQAMA-NUMBER';
  } else if (idObj?.idType === IdentityTypeEnum.PASSPORT) {
    label = 'BENEFITS.PASSPORT-NO';
  } else if (idObj?.idType === IdentityTypeEnum.NATIONALID) {
    label = 'BENEFITS.GCC-NIN';
  } else if (idObj?.idType === IdentityTypeEnum.BORDER) {
    label = 'BENEFITS.BORDER-NO';
  }
  return label;
};
