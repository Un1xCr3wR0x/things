// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: false,
  /*firebase: {
    apiKey: 'AIzaSyD10cnmij0t3-6Q61BFwACIMLtvFzp54sA',
    authDomain: 'gosi-firebase.firebaseapp.com',
    databaseURL: 'https://gosi-firebase.firebaseio.com',
    projectId: 'gosi-firebase',
    storageBucket: 'gosi-firebase.appspot.com',
    messagingSenderId: '326227681257',
    appId: '1:326227681257:web:b7e27656ab0d1a8eef7578',
    measurementId: 'G-HC49J1B84W'
  },*/
  disableAuth: true,
  baseRoutePath: '',
  baseUrl: 'http://amnapigeedev.gosi.ins:9720',
  webEstablishmentApiKey: 'Ry5KX1O7m8SqPgALNO7rGfAsneA8zVj9',
  loginUrl:
    'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PublicEstablishment14&domain=PublicDomain&scope=PublicRServer.read&redirect=http://feaapplvd14:8060/establishment-public/oauth2/callback',
  logoutUrl:
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
