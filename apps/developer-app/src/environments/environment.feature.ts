/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  firebase: {
    apiKey: 'IfHeWHM3stYsPKF0zQAiDU2rA6yTuAGt',
    authDomain: 'api-5033773892288441210-233893.firebaseapp.com',
    databaseURL: 'https://api-5033773892288441210-233893.firebaseio.com',
    projectId: 'api-5033773892288441210-233893',
    storageBucket: 'api-5033773892288441210-233893.appspot.com',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  },
  baseRoutePath: '',
  baseUrl: 'http://amnapigeedev.gosi.ins:9985',
  loginUrl:
    'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PrivateEstablishment20&domain=PrivateDomain&scope=PrivateRServer.read&redirect=http://feaapplvd19:8060/establishment-private/oauth2/callback',
  logoutUrl:
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'YBA8QA5mGxmYSXIJsANP6ZzkJvPxDYND',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  gccStartDate: {
    gccCountries1: '01/01/2006',
    gccCountries2: '01/01/2007'
  }
};
