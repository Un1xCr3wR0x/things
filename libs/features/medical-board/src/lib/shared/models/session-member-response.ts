import { BilingualText } from '@gosi-ui/core';

export class SessionMemberResponse {
  message: BilingualText;
  referenceNo: number;
}
export class MBODetail {
  sessionId: number;
  officerId: number;
  name: BilingualText = new BilingualText();
  location: string;
  mobileNumber: number;
}
export class MBODetailList {
  count: number;
  mbOfficerList: MbOfficerDetails[];
}
export class MbOfficerDetails {
  name: string;
  nationalId: number;
  location: BilingualText = new BilingualText();
  mobileNumber: number;
  available = false;
  officerId: number;
  sessionId: number;
  userId: string;
}
