/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  firebase: {
    apiKey: 'aHnqOqTpC53PkkFPLUF5IM1IGOpCyKqs',
    authDomain: 'api-5033773892288441210-233893.firebaseapp.com',
    databaseURL: 'https://api-5033773892288441210-233893.firebaseio.com',
    projectId: 'api-5033773892288441210-233893',
    storageBucket: 'api-5033773892288441210-233893.appspot.com',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  },
  disableAuth: false,
  baseRoutePath: '',
  baseUrl: 'https://e2e2apipubssl.gosi.ins',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=MedicalBoard03&domain=PublicDomain&scope=PublicRServer.read&redirect=https://amne2eapppub2.gosi.ins/medical-board/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'NEEGMrD5nDLm9GMpUAsWRuWtn6Xc65d1',
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
