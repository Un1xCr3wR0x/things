/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  firebase: {
    apiKey: 'y7kzX3voHVbLpBAPCrzSFprJTudGpyDv',
    projectId: 'api-5033773892288441210-233893',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  },
  baseRoutePath: '',
  baseUrl: 'https://api.gosi.gov.sa',
  baseDenodoUrl: 'https://denodo.gosi.gov.sa/server',
  webEstablishmentDenodoApiKey: 'JAAtWXv5FveiwvFogtdrGKhZr2YHD27l',
  webEstablishmentApiKey: 'GgwvS2oD6EU0T1qWQ3zeCFPa6cwWOmQU',
  loginUrl:
  'https://login.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=MedicalBoard&domain=PublicDomain&scope=PublicRServer.read&redirect=https://drgate.gosi.gov.sa/oauth2/callback',
  logoutUrl: 'https://login.gosi.gov.sa/oam/server/logout?end_url=https://www.gosi.gov.sa/ar',
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
  wccScanBaseUrl: 'https://captureprod.gosi.gov.sa/dc-client/faces/dc-client-launch.jspx?',
  saedniUrl:
    'https://saedni.gosi.ins/arsys/forms/itsmprodapp/HPD%3AHelp+Desk/Best+Practice+View/?qual=%271000000161%27%3D%22{incidentNumber}%22'
};

