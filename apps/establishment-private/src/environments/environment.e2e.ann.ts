import { Environments } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  environment: Environments.E2E,
  production: true,
  /*firebase: {
    apiKey: 'aHnqOqTpC53PkkFPLUF5IM1IGOpCyKqs',
    authDomain: 'api-5033773892288441210-233893.firebaseapp.com',
    databaseURL: 'https://api-5033773892288441210-233893.firebaseio.com',
    projectId: 'api-5033773892288441210-233893',
    storageBucket: 'api-5033773892288441210-233893.appspot.com',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  },*/
  baseRoutePath: '',
  baseUrl: 'https://e2e2apiprissl.gosi.ins',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  webEstablishmentDenodoApiKey: 'OizlhfPB0ipB2y8TRMGAmCqChCSjV3yw',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=GOSIE2EPrivateEstablishment02&domain=PrivateDomain&scope=PrivateRServer.read&redirect=https://amne2eapp2.gosi.ins/establishment-private/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'aHnqOqTpC53PkkFPLUF5IM1IGOpCyKqs',
  saedniUrlNew:
    'https://saedni.gosi.ins/dwp/rest/share?resourceId={incidentNumber}&resourceType=SERVICE_REQUEST&providerSourceName=srm',
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
  unifyEngTimeLine: {
    enabled: true,
    showEligibilityChecking: false
  }
};
