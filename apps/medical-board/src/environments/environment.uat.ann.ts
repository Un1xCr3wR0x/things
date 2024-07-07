// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
    production: true,
    baseRoutePath: '',
    firebase: {
      apiKey: 'jSnUJx31y1InrNpgm4IWxjLI8oNGN92G',
      projectId: 'api-5033773892288441210-233893',
      messagingSenderId: '57321616691',
      appId: '1:57321616691:web:170e5912660f63e4'
    },
    baseUrl: 'https://ameen-api-public-uat2.gosi.gov.sa',
    // baseUrl: 'https://10.5.100.44',
    disableAuth: false,
    loginUrl:
      'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=MedicalBoard03&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameenuat2.gosi.gov.sa/medical-board/oauth2/callback',
    logoutUrl:
      'https://uatlogin.gosi.gov.sa/oam/server/logout?end_url=https://uatlogin.gosi.gov.sa/CustomOAM/CustomLogout.jsp',
    webEstablishmentApiKey: 'AFtDREqaAcx7KEjfAwbfRtq1kMpQlnr1'
  };
  
  