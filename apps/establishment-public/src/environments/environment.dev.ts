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
  baseUrl: 'http://amnapigeedev.gosi.ins:9490',
  loginUrl: 'https://gosionlinedev.gosi.ins/GOSIOnline/Login',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  virtualVisitAzureURL:'https://gosivvwebapp-as.azurewebsites.net',
  logoutUrl:
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: '0RaoTTtk0dUu4yoNbo1zSI52Mt6PISb4',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  EnableChatBot: true,
  ChatBotURL: 'https://dev-www.pension.gov.sa/Chat'
};
