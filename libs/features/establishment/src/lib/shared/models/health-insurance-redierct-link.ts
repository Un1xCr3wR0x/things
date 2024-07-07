export class HealthInsuranceRedirectionLinkRequest{
  insuranceCompanyId : String;
  estNumber : String;
}

export class HealthInsuranceRedirectionLinkResponse{
  StatusCode: String;
  StatusDesc: String;
  redirectionURLAr: String;
  redirectionURLEn: String;
}
