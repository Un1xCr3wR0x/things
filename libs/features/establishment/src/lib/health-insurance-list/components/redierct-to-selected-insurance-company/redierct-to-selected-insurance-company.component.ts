import {Component, Inject, OnInit} from '@angular/core';
import {
  EstablishmentScBaseComponent
} from "@gosi-ui/features/establishment/lib/shared/base/establishment-sc.base-component";
import {ActivatedRoute, Router} from "@angular/router";
import {EstablishmentService} from "@gosi-ui/features/establishment";
import {
  AuthTokenService,
  Establishment,
  RegistrationNoToken,
  RegistrationNumber,
  RouterConstants
} from "@gosi-ui/core";
import {
  HealthInsuranceRedirectionLinkRequest,HealthInsuranceRedirectionLinkResponse
} from "@gosi-ui/features/establishment/lib/shared/models/health-insurance-redierct-link";


@Component({
  selector: 'est-redierct-to-selected-insurance-company',
  templateUrl: './redierct-to-selected-insurance-company.component.html',
  styleUrls: ['./redierct-to-selected-insurance-company.component.scss']
})
export class RedierctToSelectedInsuranceCompanyComponent extends EstablishmentScBaseComponent implements OnInit {
  healthInsuranceRedirectionLinkResponse: HealthInsuranceRedirectionLinkResponse;
  healthInsuranceRedirectionLinkRequest: HealthInsuranceRedirectionLinkRequest;
  currentEstablishment: Establishment = new Establishment();
  registrationNo: number;
  insuranceCompanyResponse : string;
   insuranceCompanyID: string;
  loading = false;
  redirectionUrl: string;
  continueRedirection = true; // Flag to control the redirection process




  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService,
    readonly authService: AuthTokenService,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,

  ) { super(null, null) }

  ngOnInit(): void {
    this.registrationNo=this.establishmentRegistrationNo.value
    this.insuranceCompanyResponse = this.establishmentService?.insuranceCompanyID;
    // console.log( this.healthInsuranceRedirectionLinkRequest.estNumber = ""+this.estabishment.unifiedNationalNumber);
    // this.healthInsuranceRedirectionLinkRequest.insuranceCompanyId = this.insuranceCompanyResponse.insuranceCompanyId;
    // console.log("Value of unifiedNationalNumber:", this.currentEstablishment.unifiedNationalNumber);

    this.establishmentService.getEstablishment(this.registrationNo).subscribe(
      res => {
       this.currentEstablishment = res;

        this.postHealthInsuranceRequest();

      },
      err => console.log(err,"error")
    );
  }
  navigateTo(url: string) {
    this.establishmentRegistrationNo.value = this.registrationNo;

    this.router.navigate([url], {
      state: {
        registrationNo: this.registrationNo,

      }
    });
  }

   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) ) ;
  }

  navigateToHealthInsuranceOffers() {

    this.continueRedirection = false; // Stop the redirection process
    this.navigateTo(RouterConstants.ROUTE_ESTABLISHMENT_HEALTH_INSURANCE(this.registrationNo));


  }

  postHealthInsuranceRequest() {

    // Check if redirection should continue

    if (!this.continueRedirection) {

      return; // Exit the method without making the API call

    }

    // Proceed with the API call and redirection process

    this.loading = true;

    const request = new HealthInsuranceRedirectionLinkRequest();

    request.estNumber = this.currentEstablishment.unifiedNationalNumber.toString();

    request.insuranceCompanyId = this.insuranceCompanyResponse;

    // Call the API to get the redirection link

    this.establishmentService.postRedirectionLink(request).subscribe(

      (res: HealthInsuranceRedirectionLinkResponse) => {

        console.log("Redirection link response:", res);

        if (res && typeof res.redirectionURLEn === 'string') {

          setTimeout(() => {

            const redirectionUrl: string = res.redirectionURLEn as string;

            if (this.continueRedirection) {

              window.location.href = redirectionUrl;

            }

          }, 10000); // 10 seconds delay

        } else {

          console.error("Redirection URL not available or invalid.");

        }

      },

      (error) => {

        console.error("Error fetching redirection link:", error);

      }

    );

  }

// Function to redirect to the given URL
  redirectToUrl(url: string) {
    window.location.href = url;
  }




}
