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
  loginUrl:
    'https://uatlogin.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=NFRPrivateEstablishment&domain=PrivateDomain&scope=PrivateRServer.read&redirect=https://amnnfrpri.gosi.ins/establishment-private/oauth2/callback',
  logoutUrl:
    'https://uatlogin.gosi.gov.sa/oam/server/logout?end_url=https://uatlogin.gosi.gov.sa/CustomOAM/CustomLogout.jsp',
  baseUrl: 'https://ameen-api-private-uat-nfr.gosi.ins',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  webEstablishmentDenodoApiKey: 'mqjtjVP3YUpBhLfGXvGFC0OZI7H7xXDb',
  // webEstablishmentApiKey: 'kByqdVmKSphbugz6AVPybT9f51APzPZo',
  webEstablishmentApiKey: 'KQuNb3UHzAAc9yWHopU2LYc0R8JauvKy',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  disableAuth: true,
  gccStartDate: {
    gccCountries1: '01/01/2006',
    gccCountries2: '01/01/2007'
  },
  wccScanBaseUrl: 'https://mycapture.gosi.ins/dc-client/faces/dc-client-launch.jspx?',
  saedniUrlNew:
    'https://saedni.gosi.ins/dwp/rest/share?resourceId={incidentNumber}&resourceType=SERVICE_REQUEST&providerSourceName=srm',
  saedniUrl:
    'http://itsmdevweb.gosi.ins/arsys/forms/itsmdevapp/HPD%3AHelp+Desk/Best+Practice+View/?qual=%271000000161%27%3D%22{incidentNumber}%22',
  unifyEngTimeLine: {
    enabled: true,
    showEligibilityChecking: false
  }
};
