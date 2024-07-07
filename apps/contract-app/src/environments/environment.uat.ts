/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /**firebase: {
    apiKey: 'AIzaSyD10cnmij0t3-6Q61BFwACIMLtvFzp54sA',
    projectId: 'gosi-firebase',
    messagingSenderId: '326227681257',
    appId: '1:326227681257:web:b7e27656ab0d1a8eef7578',
    measurementId: 'G-HC49J1B84W'
  }, */
  baseRoutePath: '',
  baseUrl: 'https://ameen-api-public-uat.gosi.gov.sa',
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=PublicEstablishment&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameenuat.gosi.gov.sa/establishment-public/oauth2/callback',

  webEstablishmentApiKey: 'UBpAQw6IFSBgZzL4lLdHjZKTrJRnSItG',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  }
};
