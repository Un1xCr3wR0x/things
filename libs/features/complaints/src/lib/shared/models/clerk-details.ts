/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ClerkDetails {
  employeeUserName: string;
  Employee_Name_Ar: string;
  Employee_Name_En: string;
  Person_Number: number;
  constructor(employeeUserName, Employee_Name_En, Employee_Name_Ar, Person_Number) {
    this.Employee_Name_En = Employee_Name_En;
    this.Employee_Name_Ar = Employee_Name_Ar;
    this.employeeUserName = employeeUserName;
    this.Person_Number = Person_Number;
  }
}

export class ClerkDetailsWrapper {
  employeeDeptResp: ClerkDetails[] = [];
}