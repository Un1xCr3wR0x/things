/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  disableAuth: true,
  baseRoutePath: '',
  baseUrl: 'https://ameen-api-public-uat2.gosi.gov.sa',
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=ANNPublicEstablishment&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameenuat2.gosi.gov.sa/establishment-public/oauth2/callback',
  logoutUrl: 'https://uatlogin.gosi.gov.sa/oam/server/logout?end_url=https://gositest.gosi.ins/',
  webEstablishmentApiKey: 'ogcGPjlXFDxoAW1QRAGMYdAVdiNArTQq'
};
