/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /*firebase: {
    apiKey: 'XkGGoRiQZlGHfpJpyxYUkVmpkGHnCHlz',
    authDomain: 'new-app-5cb0f.firebaseapp.com',
    databaseURL: 'https://new-app-5cb0f.firebaseio.com',
    projectId: 'new-app-5cb0f',
    storageBucket: 'new-app-5cb0f.appspot.com',
    messagingSenderId: '851285171971'
  },*/
  //disableAuth: true
  baseRoutePath: '',
  baseUrl: 'https://e2e2apipubssl.gosi.ins',
  // baseUrl: 'https://10.4.20.154',
  webEstablishmentApiKey: '96Gn2eZolotqxAXtm33eQNRAxH8jNr6t',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=GOSIE2EPublicEstablishment02&domain=PublicDomain&scope=PublicRServer.read&redirect=https://p/establishment-public/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  }
};
