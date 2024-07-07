/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ActiveReportees {
  reportees: [] = [];
}

export class ActiveReporteeItem {
  adreferenceid: string;
  containerDN: string;
  displayName: string;
  gosiscp: string;
  mail: string;
  manager: string;
  mobile: string;
  roles: string[] = [];
  userId: string;
  userreferenceid: string;
  sequenceCode: number;
  constructor(name: string, userId: string, sequenceCode: number) {
    this.displayName = name;
    this.userId = userId;
    this.sequenceCode = sequenceCode;
  }
}
