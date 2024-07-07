/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /** firebase: {
    apiKey: 'lihiuoRlFs6b8l4FRwT71BguIoYG2998',
    projectId: 'api-5033773892288441210-233893',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  }, */
  baseRoutePath: '',
  baseUrl: 'https://ameen-api-private-uat-nfr.gosi.ins',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  webEstablishmentDenodoApiKey: 'mqjtjVP3YUpBhLfGXvGFC0OZI7H7xXDb',
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=NFRCRMPrivateEstablishment&domain=PrivateDomain&scope=PrivateRServer.read&redirect=https://ameenuat.gosi.ins/crm-private/oauth2/callback',
  logoutUrl:
    'https://uatlogin.gosi.gov.sa/oam/server/logout?end_url=https://uatlogin.gosi.gov.sa/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'GbO9x3qt3ydPAgDJrVl8rNgtVnt7A35W',
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
  wccScanBaseUrl: 'http://10.4.11.3:8060/dc-client/faces/dc-client-launch.jspx?'
};
