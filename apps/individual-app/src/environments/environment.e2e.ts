/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const environment = {
  production: true,
  /** firebase: {
    apiKey: 'IfHeWHM3stYsPKF0zQAiDU2rA6yTuAGt',
    projectId: 'api-5033773892288441210-233893',
    messagingSenderId: '57321616691',
    appId: '1:57321616691:web:170e5912660f63e4'
  }, */
  baseRoutePath: '',
  baseUrl: 'https://10.4.195.232:9300',
  loginUrl:
    'http://qaeohslvd01.gosi.ins:7778/oauth2/rest/authorize?response_type=token&client_id=PublicIndividual01&domain=PublicDomain&scope=PublicRServer.read&redirect=https://amne2eapppub.gosi.ins/individual/oauth2/callback',
  logoutUrl:
    'http://qaeohslvd01.gosi.ins:7778/oam/server/logout?end_url=http://qaeohslvd01.gosi.ins:7778/CustomOAM/CustomLogout.jsp',
  webEstablishmentApiKey: 'lKebd5153lw2SMUJWDuy9pRkRzGJEDPJ ',
  gosiStartDate: {
    orgRegInternational: '1973-02-04',
    government: '1973-10-28',
    semiGovernment: '1973-06-02',
    proActive: '1973-02-04'
  },
  bpmPartitionId: '20022'
};
