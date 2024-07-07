/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  baseRoutePath: '',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  baseUrl: 'http://gosiapidev.gosi.ins:9053',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  virtualVisitAzureURL:'https://gosivvwebapp-as.azurewebsites.net',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=GOSIE2EPublicEstablishment&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameene2e.gosi.gov.sa/establishment-public/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'YqcoZy003meUTspt3CGjpwSFULe96uGO',
  bpmPartitionId: '3',
  disableTokenTimeout: true
};
