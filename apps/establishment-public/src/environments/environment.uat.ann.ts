/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  baseRoutePath: '',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  virtualVisitAzureURL: 'https://gosivvwebapp-as.azurewebsites.net',
  baseUrl: 'https://ameen-api-public-uat2.gosi.gov.sa',
  // baseUrl: 'https://10.5.200.66',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=ANNPublicEstablishment&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameenuat2.gosi.gov.sa/establishment-public/oauth2/callback',
  logoutUrl: 'https://uatlogin.gosi.gov.sa/oam/server/logout?end_url=https://gositest.gosi.ins/',
  webEstablishmentApiKey: '6HteBZLvScnSG6A7Zyxmh5yTBkwG7jT8',
  bpmPartitionId: '4',
  disableTokenTimeout: true
};
