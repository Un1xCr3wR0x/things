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
  production: true,
  baseRoutePath: '',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  webEstablishmentDenodoApiKey: 'mqjtjVP3YUpBhLfGXvGFC0OZI7H7xXDb',
  disableAuth: true,
  disableTokenTimeout: true,
  baseUrl: 'http://amnapigeedev.gosi.ins:9370',
  webEstablishmentApiKey: '9JjlQ9t9BNh2vR32AWUwfdnXN7tUNSKx',
  loginUrl:
  'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PublicEstablishment01&domain=PublicDomain&scope=PublicRServer.read&redirect=http://expapplvd01:8060/establishment-public/oauth2/callback',
  logoutUrl:
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  bpmPartitionId: '10003',
  EnableChatBot: true,
  ChatBotURL: 'https://staging-www.gosi.gov.sa/Chat/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

