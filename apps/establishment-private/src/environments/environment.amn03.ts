/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  baseRoutePath: '',
  baseUrl: 'http://gosiapidev.gosi.ins:9052',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  webEstablishmentDenodoApiKey: 'R6c6foAzzqSR0rebuUj11HCqzourXjn4',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=GOSIE2EPrivateEstablishment&domain=PrivateDomain&scope=PrivateRServer.read&redirect=http://ameene2e.gosi.ins/establishment-private/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'R6c6foAzzqSR0rebuUj11HCqzourXjn4',
  bpmPartitionId: '3',
  wccScanBaseUrl: 'http://qaeohslvd01.gosi.ins:7789/dc-client/faces/dc-client-launch.jspx?',
  saedniUrl:
    'http://itsmdevweb.gosi.ins/arsys/forms/itsmdevapp/HPD%3AHelp+Desk/Best+Practice+View/?qual=%271000000161%27%3D%22{incidentNumber}%22',
  disableTokenTimeout: true,
  unifyEngTimeLine: {
    enabled: true,
    showEligibilityChecking: false
  }
};
