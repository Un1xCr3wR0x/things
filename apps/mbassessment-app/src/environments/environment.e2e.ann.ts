/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  disableAuth: true,
  baseRoutePath: '',
  baseUrl: 'https://e2e2apipubssl.gosi.ins',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=GOSIE2EPublicEstablishment02&domain=PublicDomain&scope=PublicRServer.read&redirect=https://amne2eapppub2.gosi.ins/establishment-public/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'csm54yftQa8wxRC6S3eU1KeMTm6hNtco'
};
