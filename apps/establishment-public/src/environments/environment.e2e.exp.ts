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
  baseUrl: 'https://gosiapidevssl.gosi.ins',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  virtualVisitAzureURL:'https://gosivvwebapp-as.azurewebsites.net',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=GOSIE2EPublicEstablishment&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameene2e.gosi.gov.sa/establishment-public/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'SIaI8Vccz0jOJGAm18NQdtKAG3hGiAjr',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  bpmPartitionId: '3',
  disableTokenTimeout: true,
  EnableChatBot: true,
  ChatBotURL: 'https://dev-www.pension.gov.sa/Chat'
};
