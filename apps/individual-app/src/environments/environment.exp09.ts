/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export const environment = {
  production: true,
  baseRoutePath: '',
  baseUrl: 'http://amnapigeedev.gosi.ins:9840',
  disableAuth: false,
  loginUrl:
    'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PublicIndividual09&domain=PublicDomain&scope=PublicRServer.read&redirect=http://expapplvd09:8060/individual/oauth2/callback',
  logoutUrl:    
    'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'kFdT7ppMKZOrjzGqo8o5xr8ZeZukHmrV',
  
   gosiStartDate: {
     orgRegInternational: '1973-02-04',
     government: '1973-10-28',
     semiGovernment: '1973-06-02',
     proActive: '1973-02-04'
   }
    // firebase: {
  //   apiKey: 'EJGGXiRQsAnClGzIFDLz3bioIp6075ui',
  //   projectId: 'api-5033773892288441210-233893',
  //   messagingSenderId: '57321616691',
  //   appId: '1:57321616691:web:170e5912660f63e4'
  // },
  // disableAuth: true,
  // baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  // webEstablishmentDenodoApiKey: 'JAAtWXv5FveiwvFogtdrGKhZr2YHD27l',
  // gccStartDate: {
  //   gccCountries1: '01/01/2006',
  //   gccCountries2: '01/01/2007'
  // },
  // wccScanBaseUrl: 'http://10.4.11.3:8060/dc-client/faces/dc-client-launch.jspx?',
  // saedniUrl:
  //   'http://itsmdevweb.gosi.ins/arsys/forms/itsmdevapp/HPD%3AHelp+Desk/Best+Practice+View/?qual=%271000000161%27%3D%22{incidentNumber}%22'
};