import { OccupationDetails } from './occupation-details';
import { WageDetails } from './wage-details';

export class EmploymentHistoryList {
  numbermonth: number = undefined;

  wagedetails: WageDetails[] = [];
  occupationdetails: OccupationDetails[] = [];

  registrationnumber: number = undefined;
  engagementid: number = undefined;
  fieldoffice: string = undefined;
  companyworkernumber: number = undefined;
  establishmentname: string = undefined;
  establishmentaddress: string = undefined;
  cancelled: string = undefined;
  engagementstatus: string = undefined;
  dateofemployment: number = undefined;
  dateofleaving: number = undefined;
  reasonoftermination: number = undefined;
}
