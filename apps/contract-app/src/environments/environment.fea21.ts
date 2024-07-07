// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environments } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  environment: Environments.FEA21,
  production: true,
  /*firebase: {
    apiKey: 'eASHtBRRzsxYWq1gbHcGJ4czLb3lLdj8 ',
    authDomain: 'api-5033773892288441210-233893.firebaseapp.com',
    databaseURL: 'https://api-5033773892288441210-233893.firebaseio.com',
    projectId: 'api-5033773892288441210-233893',
    storageBucket: 'api-5033773892288441210-233893.appspot.com',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  },*/
  baseRoutePath: '',
  baseUrl: 'http://amnapigeedev.gosi.ins:9395',
  // disableAuth: true,
  // disableTokenTimeout: true,
  // disableTokenValidityCheck: true,
  loginUrl:
    'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PrivateEstablishment17&domain=PrivateDomain&scope=PrivateRServer.read&redirect=http://10.4.197.101:8060/contract-app/oauth2/callback',
  logoutUrl:
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: '0qxhzhi9DGl8unSm0yAJQN6Hi3fx9NQE'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
