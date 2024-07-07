// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  baseRoutePath: '',
  baseUrl: 'https://ameen-api-public-uat-nfr.gosi.gov.sa',
  disableAuth: false,
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=NFRAmeenIndividual&domain=PublicDomain&scope=PublicRServer.read&redirect=https://amnnfrpri.gosi.ins/individual/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: '6pSBG27TMmBElbgqFO2uXkHNBxd0QtsP'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
