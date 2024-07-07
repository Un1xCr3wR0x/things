/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  isProd: true,
  /** firebase: {
    apiKey: 'y7kzX3voHVbLpBAPCrzSFprJTudGpyDv',
    projectId: 'api-5033773892288441210-233893',
    storageBucket: 'api-5033773892288441210-233893.appspot.com',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  }, **/
  baseRoutePath: '',
  baseUrl: 'https://ameen-api.gosi.ins',
  baseDenodoUrl: 'https://denodo.gosi.gov.sa/server',
  simisDenodoUrl: 'https://denodo.gosi.gov.sa',
  webEstablishmentDenodoApiKey: 'CWUAWTM7aP604XpZQb1CcPqhyTnDzweN',
  webEstablishmentApiKey: 'bchBj8HC1MhpewR6mChlGlbVHXQZ1GAH',
  loginUrl:
    'https://idmsso.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=PrivateEstablishment&domain=PrivateDomain&scope=PrivateRServer.read&redirect=https://ameen.gosi.ins/establishment-private/oauth2/callback',
  logoutUrl: 'https://idmsso.gosi.gov.sa/oam/server/logout?end_url=https://idmsso.gosi.gov.sa/CustomOAM/CustomLogout.jsp',
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
  saedniUrlNew:
    'https://saedni.gosi.ins/dwp/rest/share?resourceId={incidentNumber}&resourceType=SERVICE_REQUEST&providerSourceName=srm',
  saedniUrl:
    'https://saedni.gosi.ins/arsys/forms/itsmprodapp/HPD%3AHelp+Desk/Best+Practice+View/?qual=%271000000161%27%3D%22{incidentNumber}%22',
  unifyEngTimeLine: {
    enabled: true,
    showEligibilityChecking: false
  }
};
