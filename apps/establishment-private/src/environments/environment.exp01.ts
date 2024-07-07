

/**

* Copyright GOSI. All Rights Reserved.

* This software is the proprietary information of GOSI.

* Use is subject to license terms.

*/

import { Environments } from '@gosi-ui/core';

export const environment = {

    production: true,
    disableAuth: true,
    baseRoutePath: '',
    loginUrl: 'http://idmohslvt01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PrivateEstablishment01&domain=PrivateDomain&scope=PrivateRServer.read&redirect=http://expapplvd01.gosi.ins:8060/establishment-private/oauth2/callback',
    logoutUrl: 'http://idmohslvt01.gosi.ins:7778/oam/server/logout?end_url=http://idmohslvt01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
    baseUrl: 'http://amnapigeedev.gosi.ins:9360',
    webEstablishmentApiKey: 'mVOGyYsXTHEyRPPEmEDugkz5pGNOwbGg',
    webEstablishmentDenodoApiKey: 'mqjtjVP3YUpBhLfGXvGFC0OZI7H7xXDb',
    baseDenodoUrl: 'https://denodouat.gosi.ins/server',
    simisDenodoUrl: 'https://denodouat.gosi.ins',
    bpmPartitionId: '4',
    wccScanBaseUrl: 'https://mycapture.gosi.ins/dc-client/faces/dc-client-launch.jspx?',
    saedniUrl:'http://itsmdevweb.gosi.ins/arsys/forms/itsmdevapp/HPD%3AHelp+Desk/Best+Practice+View/?qual=%271000000161%27%3D%22{incidentNumber}%22',
    disableTokenTimeout: true,
    entitlementChange: true

};
