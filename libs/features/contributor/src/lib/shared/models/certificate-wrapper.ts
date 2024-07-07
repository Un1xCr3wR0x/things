/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class CertificateWrapper {
  link?: number = undefined;
  printSerialNumber?: string = undefined;

  /** For SIMIS Benefits certificates. To be removed once Ameen replacments are ready*/
  code?: number = undefined;
  content?: string = undefined;

  fromJsonToObject(json: CertificateWrapper) {
    Object.keys(new CertificateWrapper()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
