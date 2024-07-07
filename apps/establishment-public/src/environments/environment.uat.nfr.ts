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
  disableAuth: true,
  virtualVisitAzureURL: 'https://gosivvwebapp-as.azurewebsites.net',
  baseRoutePath: '',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  baseUrl: 'https://ameen-api-public-uat-nfr.gosi.gov.sa',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=NFRPublicEstablishment&domain=PublicDomain&scope=PublicRServer.read&redirect=https://amnnfrpub.gosi.ins/establishment-public/oauth2/callback',
  logoutUrl:
    'https://uatlogin.gosi.gov.sa/oam/server/logout?end_url=https://uatlogin.gosi.gov.sa/CustomOAM/CustomLogout.jsp',
  // webEstablishmentApiKey: 'AruEOesr6VDxHd5ifhQoyCXyElwzujKb',
  webEstablishmentApiKey: 'cv7kWKZbQwndprAWt5n31euPNiDPA8UU',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  EnableChatBot: true,
  ChatBotURL: 'https://dev-www.pension.gov.sa/Chat'
};
