/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  baseRoutePath: '',
  baseUrl: 'http://gosiapidev.gosi.ins:9053',
  simisDenodoUrl: 'https://denodouat.gosi.ins',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PublicIndividual02&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameene2e.gosi.gov.sa/individual/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'hykEIgbkMHArvNnUWsgqD6qn5xh8O0ca',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  bpmPartitionId: '3',
  disableTokenTimeout: true
};
