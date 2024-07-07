/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /*firebase: {
    apiKey: 'AIzaSyD10cnmij0t3-6Q61BFwACIMLtvFzp54sA',
    projectId: 'gosi-firebase',
    messagingSenderId: '326227681257',
    appId: '1:326227681257:web:b7e27656ab0d1a8eef7578'
  },*/
  baseRoutePath: '',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  virtualVisitAzureURL:'https://gosivvwebapp-as.azurewebsites.net',
  baseUrl: 'https://ameen-api-public-uat.gosi.gov.sa',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=PublicEstablishment&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameenuat.gosi.gov.sa/establishment-public/oauth2/callback',
  logoutUrl:
    'https://uatlogin.gosi.gov.sa/oam/server/logout?end_url=https://gositest.gosi.ins/',
  webEstablishmentApiKey: 'G79jLselHgxrZQuZKHqQtETnGGfNMAVs',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  bpmPartitionId: '4',
  disableTokenTimeout: true,
  EnableChatBot: true,
  ChatBotURL: 'https://dev-www.pension.gov.sa/Chat'
};
