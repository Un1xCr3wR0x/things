/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /** firebase: {
    apiKey: 'AIzaSyD10cnmij0t3-6Q61BFwACIMLtvFzp54sA',
    projectId: 'gosi-firebase',
    messagingSenderId: '326227681257',
    appId: '1:326227681257:web:b7e27656ab0d1a8eef7578',
    measurementId: 'G-HC49J1B84W'
  }, */
  baseRoutePath: '',
  baseUrl: 'http://amnapigeedev.gosi.ins:9930',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  webEstablishmentDenodoApiKey: 'JAAtWXv5FveiwvFogtdrGKhZr2YHD27l',
  loginUrl:
    'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PublicEstablishment18&domain=PublicDomain&scope=PublicRServer.read&redirect=http://feaapplvd18:8060/establishment-public/oauth2/callback',
  logoutUrl:
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: '7Du0Vec9CaiFwLtp8BKryGRJ2Z1mgLPT',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  wccScanBaseUrl: 'http://10.4.11.3:8060/dc-client/faces/dc-client-launch.jspx?'
};
