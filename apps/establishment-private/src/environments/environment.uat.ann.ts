/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Environments } from '@gosi-ui/core';

export const environment = {
  environment: Environments.UAT,
  production: true,
  disableAuth: false,
  baseRoutePath: '',
  loginUrl:
    'https://idmssouat.gosi.ins/oauth2/rest/authorize?response_type=token&client_id=ANNPrivateEstablishment&domain=PrivateDomain&scope=PrivateRServer.read&redirect=https://ameenuat2.gosi.ins/establishment-private/oauth2/callback',
  logoutUrl:
    'https://idmssouat.gosi.ins/oam/server/logout?end_url=https://idmssouat.gosi.ins/CustomOAM/CustomLogout.jsp',
  baseUrl: 'https://ameen-api-private-uat2.gosi.ins',
  baseDenodoUrl: 'https://denodouat.gosi.ins/server',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  webEstablishmentDenodoApiKey: 'mqjtjVP3YUpBhLfGXvGFC0OZI7H7xXDb',
  webEstablishmentApiKey: 'cbz6kbOo6BnHydYPMdUscYCXEVZJHAxi',
  bpmPartitionId: '4',
  wccScanBaseUrl: 'https://mycapture.gosi.ins/dc-client/faces/dc-client-launch.jspx?',
  saedniUrl:
    'http://itsmdevweb.gosi.ins/arsys/forms/itsmdevapp/HPD%3AHelp+Desk/Best+Practice+View/?qual=%271000000161%27%3D%22{incidentNumber}%22',
  saedniUrlNew:
    'https://saedni.gosi.ins/dwp/rest/share?resourceId={incidentNumber}&resourceType=SERVICE_REQUEST&providerSourceName=srm',
  disableTokenTimeout: true,
  entitlementChange: true,
  unifyEngTimeLine: {
    enabled: true,
    showEligibilityChecking: false
  }
};
