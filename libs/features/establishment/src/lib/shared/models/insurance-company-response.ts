import {InsuranceCompanyDetails} from "@gosi-ui/features/establishment/lib/shared/models/insurance-company-details";

export class InsuranceCompanyResponse {
  StatusCode: String;
  StatusDesc: String ;

  Detail : InsuranceCompanyDetails[];
}
