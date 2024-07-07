/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export interface JWTPayload {
  iss: string;
  aud: string[] | string;
  exp: number;
  jti: string;
  iat: number;
  sub: string;
  uid: string;
  gosiscp: string;
  longnamearabic: string;
  longnameenglish: string;
  customeAttr1: string;
  client: string;
  scope: string[] | string;
  domain: string;
  preferredlanguage: string;
  location: string;
  userreferenceid: string;
}
