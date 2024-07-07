/**
 * Model class to hold environement details.
 *
 * @export
 * @class Environment
 */
export class Environment {
  environment?: string;
  production: boolean;
  firebase: FirbaseConfig;
  baseRoutePath: string = undefined;
  baseUrl: string = undefined;
  baseDenodoUrl: string = undefined;
  simisDenodoUrl: string = undefined;
  loginUrl: string = undefined;
  logoutUrl: string = undefined;
  webEstablishmentDenodoApiKey: string = undefined;
  webEstablishmentApiKey: string = undefined;
  gosiStartDate: GosiStartDate = new GosiStartDate();
  gccStartDate: GccStartDate = new GccStartDate();
  disableAuth = false;
  saedniUrl: string = undefined;
  saedniUrlNew: string = undefined;
  wccScanBaseUrl: string = undefined;
  disableTokenTimeout: boolean = undefined;
  entitlementChange: boolean = undefined;
  virtualVisitAzureURL: string = undefined;
  isProd: boolean = undefined;
  disableTokenValidityCheck: boolean = undefined;
  unifyEngTimeLine: UnifyEngTimeLine = undefined;
}

export class FirbaseConfig {
  apiKey: string = undefined;
  authDomain: string = undefined;
  databaseURL: string = undefined;
  projectId: string = undefined;
  storageBucket: string = undefined;
  messagingSenderId: string = undefined;
}

export class GosiStartDate {
  orgRegInternational: string = undefined;
  government: string = undefined;
  semiGovernment: string = undefined;
  proActive: string = undefined;
}

export class GccStartDate {
  gccCountries1: string;
  gccCountries2: string;
}
export class UnifyEngTimeLine {
  enabled: boolean;
  showEligibilityChecking: boolean;
}
