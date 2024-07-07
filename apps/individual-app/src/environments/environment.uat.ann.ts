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
  baseUrl: 'https://ameen-api-public-uat2.gosi.gov.sa',
  // baseUrl: 'https://10.5.100.44',
  disableAuth: false,
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=AmeenIndividual&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameenuat2.gosi.gov.sa/individual-secondary/oauth2/callback',
  logoutUrl:
    'https://uatlogin.gosi.gov.sa/oam/server/logout?end_url=https://uatlogin.gosi.gov.sa/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'fn6mFeqyX1mft5A1enCGlhOSE7g8zWcW'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
