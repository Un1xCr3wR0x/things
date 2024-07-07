/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /** firebase: {
    apiKey: 'XkGGoRiQZlGHfpJpyxYUkVmpkGHnCHlz',
    authDomain: 'new-app-5cb0f.firebaseapp.com',
    projectId: 'new-app-5cb0f',
    messagingSenderId: '851285171971'
  }, */
  baseRoutePath: '',
  baseUrl: 'https://ameen-api-public-uat-nfr.gosi.gov.sa',
  loginUrl:
    'http://IAMAPPLVT01.gosi.ins:7777/oauth2/rest/authorize?response_type=token&client_id=EstablishmentWID&domain=WebGateDomain&scope=EstablishmentWRS.read&redirect=http://expapplvd01.gosi.ins:8060/establishment-public/oauth2/callback',

  webEstablishmentApiKey: '7H5hvTBx4Fro1OWJAlbtlu8TNIuEdjrL',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  }
};
