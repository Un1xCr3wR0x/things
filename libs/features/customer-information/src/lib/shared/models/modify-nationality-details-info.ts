import { BilingualText, GosiCalendar } from "@gosi-ui/core";

export class ModifyNationalityDetails {
    changeRequestList: ChangeRequestList;
  }

  export class ChangeRequestList{
    newNationality:BilingualText;
    newPassportExpiryDate:GosiCalendar;
    newPassportIssueDate:GosiCalendar;
    newValue:string;
    oldNationality:BilingualText;
    oldPassportExpiryDate:GosiCalendar;
    oldPassportIssueDate:GosiCalendar;
    oldValue:string;
    parameter:string
  }
  export class modifyDetailsResponse{
    newNationality:BilingualText;
    newExpiryDate:GosiCalendar;
    newIssueDate:GosiCalendar;
    newPassportNo:string;
   nationality:BilingualText;
   oldExpiryDate:GosiCalendar;
    oldIssueDate:GosiCalendar;
    oldPassportNo:string;
    parameter:string;
    oldGccId:string;
    newGccId:string;
    identifier:string;
    boderNo:string;
  }


  export class ModifyRequestList{
    changeRequestList: ChangeRequestNew[];
    
  }

  export class ChangeRequestNew{
  id: number = undefined;
  type: string;
  status: string;
  oldValue: string;
  newValue: string;
  referenceNo: number = undefined;
  parameter:string;
  oldValueArb:string;
  issueDate:GosiCalendar;
  expiryDate:GosiCalendar;
  newValueArb:string;
  newDate:GosiCalendar;
  oldDate:GosiCalendar;
  submissionDate: GosiCalendar = new GosiCalendar();
  bankName: BilingualText = new BilingualText();
  nationality:string;
  approvalStatus:string; 
  }


