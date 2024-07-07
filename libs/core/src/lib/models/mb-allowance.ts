import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

export class MbAllowance {
  assessmentId: number;
  assessmentDate: GosiCalendar = new GosiCalendar();
  assessmentType: BilingualText;
  medicalBoardType: BilingualText;
  allowanceDetails: AllowanceObject;
  totalAmount: number;
  isCompConveyanceReq: boolean;
  isSameCity:boolean;
  originLatitude:string;
  originLongitude:string;
  officeLocation?: BilingualText;
}
export class AllowanceObject {
  conveyanceDetails: AllowanceData;
  companionDetails: AllowanceData;
}
export class AllowanceData {
  paymentMethod: BilingualText;
  bankAccountNumber: number;
  paymentDate: GosiCalendar = new GosiCalendar();
  conveyancePayment: number;
  distance: number;
  paymentStatus: BilingualText;
  isLARequired = false;
}
