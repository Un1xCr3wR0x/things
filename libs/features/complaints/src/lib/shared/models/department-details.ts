/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class DepartmentDetails {
  DepartmentHeadID: number;
  DepartmentHeadJobTitle: string;
  DepartmentHeadName: string;
  DepartmentID: number;
  DepartmentNameAR: string;
  DepartmentNameEN: string;
}

export class DepartmentDetailsWrapper {
  DeptResp: DepartmentDetails[] = [];
}
