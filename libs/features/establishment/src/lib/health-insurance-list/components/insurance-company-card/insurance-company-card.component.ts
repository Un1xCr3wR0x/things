import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {EstablishmentService} from "@gosi-ui/features/establishment";
import {ActivatedRoute, Router} from "@angular/router";
import {
  Establishment,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber,
  RouterConstants,
  StorageService
} from "@gosi-ui/core";
import {BehaviorSubject} from "rxjs";
import {InsuranceCompanyDetails} from "@gosi-ui/features/establishment/lib/shared/models/insurance-company-details";
import {
  HealthInsuranceRedirectionLinkRequest
} from "@gosi-ui/features/establishment/lib/shared/models/health-insurance-redierct-link";



@Component({
  selector: 'est-insurance-company-card',
  templateUrl: './insurance-company-card.component.html',
  styleUrls: ['./insurance-company-card.component.scss']
})
export class InsuranceCompanyCardComponent implements OnInit {
  @Input() estabishment : Establishment;
  @Input() insuranceCompanyResponse : InsuranceCompanyDetails;
  @Output() navigationEventEmitter : EventEmitter<any>;
  registrationNo: number;
  lang = 'en';
  align = 'left';
  healthInsuranceRedirectionLinkRequest : HealthInsuranceRedirectionLinkRequest ;



  constructor(
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly storageService: StorageService,


    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,



  )
  {
    // this.healthInsuranceRedirectionLinkRequest =  new HealthInsuranceRedirectionLinkRequest();
    // this.healthInsuranceRedirectionLinkRequest.insuranceCompanyId="123";
  }

  ngOnInit(): void {
    this.registrationNo=this.establishmentRegistrationNo.value
    this.language.subscribe(language => {
      this.lang = language;

    });
    // this.healthInsuranceRedirectionLinkRequest.estNumber = ""+this.estabishment.unifiedNationalNumber;
    // this.healthInsuranceRedirectionLinkRequest.insuranceCompanyId = this.insuranceCompanyResponse.insuranceCompanyId;
    //
    // this.postHealthInsuranceRequest();

  }
  navigateTo(url: string) {
    this.establishmentRegistrationNo.value = this.registrationNo;

    this.router.navigate([url], {
      state: {
        registrationNo: this.registrationNo,

      }
    });
  }


  navigateToTermsAndConditions() {
    this.establishmentService.insuranceCompanyID=this.insuranceCompanyResponse?.insuranceCompanyId;
    this.navigateTo(RouterConstants.ROUTE_TERMS_AND_CONDITIONS(this.registrationNo));
  }


  // postHealthInsuranceRequest(){
  //   this.establishmentService.postRedirectionLink(
  //     this.healthInsuranceRedirectionLinkRequest
  //     ).subscribe(
  //       res=>{
  //         console.log("this is the response",res);
  //       },
  //     error => {
  //         console.error("we have is error", error);
  //     }
  //
  //   )
  //   console.log("post redic is working ");
  //
  // }


}
