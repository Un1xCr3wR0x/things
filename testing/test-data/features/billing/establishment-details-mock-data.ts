/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const establishmentDetailsMockData = {
  mainEstablishmentRegNo: 502351249,
  name: {
    english: 'Al Sheba',
    arabic: ''
  },
  gccEstablishment: null,
  legalEntity: {
    arabic: 'منشأة محدودة',
    english: 'Limited Liability'
  }
};

export const gccEstablishmentDetailsMockData = {
  mainEstablishmentRegNo: 502351249,
  name: {
    english: 'Al Sheba',
    arabic: ''
  },
  gccCountry: true,
  gccEstablishment: {
    country: {
      english: 'Kuwait',
      arabic: ''
    },
    gccCountry: true,
    registrationNo: '502351249',
    fromJsonToObject: () => {
      return undefined;
    }
  },
  startDate: {
    gregorian: '2022-05-12T08:49:43.000Z',
    hijiri: null,
    entryFormat: 'GREGORIAN'
  },
  legalEntity: {
    arabic: 'منشأة محدودة',
    english: 'Limited Liability'
  },
  status: {
    english: 'Registered',
    arabic: ''
  },
  registrationNo: 502351249,
  fieldOfficeName: undefined,
  establishmentType: {
    english: 'Registered',
    arabic: ''
  },
  establishmentAccount: undefined,
  outOfMarket: false,
  fromJsonToObject: () => {
    return undefined;
  }
};
