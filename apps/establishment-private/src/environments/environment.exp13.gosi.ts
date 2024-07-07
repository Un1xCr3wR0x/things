/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /** firebase: {
    apiKey: 'IfHeWHM3stYsPKF0zQAiDU2rA6yTuAGt',
    projectId: 'api-5033773892288441210-233893',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  }, */
  baseRoutePath: '',
  // baseUrl: 'https://ameen-api-private-uat.gosi.ins',
  baseUrl: 'http://gosiapidev.gosi.ins:9031',
  webEstablishmentApiKey: 'g1Gmx8IGuAf2zwnhlSIa30DDzQMbYa8G',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  webEstablishmentDenodoApiKey: 'JAAtWXv5FveiwvFogtdrGKhZr2YHD27l',
  loginUrl:
    'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PrivateEstablishment27&domain=PrivateDomain&scope=PrivateRServer.read&redirect=http://expapplvd13:8060/establishment-private2/oauth2/callback',
  logoutUrl:
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  // webEstablishmentApiKey: 'LqqQPXMXBZYo9JIPreHHJ7uBWEwp1UfA',
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
  bpmPartitionId: '4',
  wccScanBaseUrl: 'https://mycapture.gosi.ins/dc-client/faces/dc-client-launch.jspx?',
  saedniUrl:
    'http://itsmdevweb.gosi.ins/arsys/forms/itsmdevapp/HPD%3AHelp+Desk/Best+Practice+View/?qual=%271000000161%27%3D%22{incidentNumber}%22',
  disableTokenTimeout: true,
  disableAuth: true,
  disableTokenValidityCheck: true,
  entitlementChange: true
};
