/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /**firebase: {
    apiKey: 'y7kzX3voHVbLpBAPCrzSFprJTudGpyDv',
    projectId: 'api-5033773892288441210-233893',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  }, */
  baseRoutePath: '',
  baseUrl: 'https://ameen-api.gosi.ins',
  baseDenodoUrl: 'https://denodo.gosi.gov.sa/server',
  webEstablishmentDenodoApiKey: 'CWUAWTM7aP604XpZQb1CcPqhyTnDzweN',
  loginUrl:
    'https://login.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=GOSICRMPrivateEstablishment&domain=PrivateDomain&scope=PrivateRServer.read&redirect=https://ameen.gosi.ins/crm-private/oauth2/callback',
  logoutUrl: 'https://login.gosi.gov.sa/oam/server/logout?end_url=https://login.gosi.gov.sa/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'bKai2Ibc9GxR2nP06VjVf3htold8HH3w',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  gccStartDate: {
    gccCountries1: '01/01/2006',
    gccCountries2: '01/01/2007'
  },
  wccScanBaseUrl: 'https://captureprod.gosi.gov.sa/dc-client/faces/dc-client-launch.jspx?'
};
