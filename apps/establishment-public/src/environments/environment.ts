/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Environments } from '@gosi-ui/core';

export const environment = {
  environment: Environments.FEA21,
  production: true,
  /*firebase: {
    apiKey: 'AIzaSyD10cnmij0t3-6Q61BFwACIMLtvFzp54sA',
    projectId: 'gosi-firebase',
    messagingSenderId: '326227681257',
    appId: '1:326227681257:web:b7e27656ab0d1a8eef7578'
  },*/
  baseRoutePath: '',
  baseUrl: 'http://amnapigeedev.gosi.ins:9975',
  loginUrl:
    'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PublicEstablishment24&domain=PublicDomain&scope=PublicRServer.read&redirect=http://expapplvd11:8060/establishment-public/oauth2/callback',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  logoutUrl:
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'KASJtWczYxwqhZ4cDLOf6ftChhz64wIU',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  EnableChatBot: false,
  ChatBotURL: 'https://staging-www.gosi.gov.sa/Chat/'
};
