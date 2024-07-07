import {Component, Inject, OnInit} from '@angular/core';
import {
  EstablishmentScBaseComponent
} from "@gosi-ui/features/establishment/lib/shared/base/establishment-sc.base-component";
import {ActivatedRoute, Router} from "@angular/router";
import {EstablishmentService} from "@gosi-ui/features/establishment";
import {
  AlertService,
  AuthTokenService, Establishment,
  RegistrationNoToken,
  RegistrationNumber,
} from "@gosi-ui/core";
import {InsuranceCompanyResponse} from "@gosi-ui/features/establishment/lib/shared/models/insurance-company-response";
import {LanguageToken} from "@gosi-ui/core";
import {BehaviorSubject} from "rxjs";
import {ContributorsWageService, ContributorWageParams, SearchTypeEnum} from "@gosi-ui/features/contributor";
import { switchMap, tap} from "rxjs/operators";
import {Location} from "@angular/common";
@Component({
  selector: 'est-health-insurance-list',
  templateUrl: './health-insurance-list.component.html',
  styleUrls: ['./health-insurance-list.component.scss']
})
export class HealthInsuranceListComponent extends EstablishmentScBaseComponent implements OnInit {

  insuranceCompanyResponse: InsuranceCompanyResponse;
  registrationNo: number;
  filterParam : ContributorWageParams;
  cotributorCount : number;
  establishment: Establishment;


  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService,
    readonly authService: AuthTokenService,
    readonly alertService: AlertService,
    readonly contributorWageService: ContributorsWageService,
    readonly location: Location,

    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,


  ) {

    super(null, null)
  }

  lang = 'en';


  ngOnInit(): void {
    this.filterParam = new ContributorWageParams(false,true,SearchTypeEnum.ACTIVE);
    this.filterParam.countRequired = true;
    this.filterParam.gender = null;
    this.registrationNo=this.establishmentRegistrationNo.value
    this.contributorWageService.getContributorFilterList
    (this.registrationNo,this.filterParam, false, SearchTypeEnum.ACTIVE)
      .pipe(tap(contRes=>
      {this.cotributorCount= contRes.numberOfContributors}),
        switchMap(()=>{
          return this.establishmentService.getHealthInsuranceOffers(this.cotributorCount)
        }))
      .subscribe((res) => {
        this.insuranceCompanyResponse= res;
      })
    this.language.subscribe(language => {
      this.lang = language;

    });
    this.establishmentService.getEstablishment(this.registrationNo).subscribe(
      res=>
    this.establishment = res)
  }

  navigateBack() {
    this.location.back();
  }





}

