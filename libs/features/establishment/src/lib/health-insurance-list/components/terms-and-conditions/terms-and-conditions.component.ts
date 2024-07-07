import {Component, Inject, OnInit} from '@angular/core';
import {
  EstablishmentScBaseComponent
} from "@gosi-ui/features/establishment/lib/shared/base/establishment-sc.base-component";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';
import {EstablishmentService} from "@gosi-ui/features/establishment";
import {
  AlertService,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber,
  RouterConstants,
  scrollToTop, StorageService
} from "@gosi-ui/core";
import {BehaviorSubject} from "rxjs";


@Component({
  selector: 'est-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent extends EstablishmentScBaseComponent implements OnInit {
  registrationNo: number;
  lang = 'en';


  constructor(
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly storageService: StorageService,
    readonly location: Location,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,

    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber) {
    super(null, null)
  }

  ngOnInit(): void {
    this.registrationNo=this.establishmentRegistrationNo.value
    this.language.subscribe(language => {
      this.lang = language;

    });
  }
  navigateTo(url: string) {
    this.establishmentRegistrationNo.value = this.registrationNo;

    this.router.navigate([url], {
      state: {
        registrationNo: this.registrationNo,

      }
    });
  }


  navigateToRedierctInsCompany() {
    this.navigateTo(RouterConstants.ROUTE_REDIERCT_TO_SELECTED_COMPANY(this.registrationNo));
  }
  navigateToHealthInsuranceOffers() {
    this.navigateTo(RouterConstants.ROUTE_ESTABLISHMENT_HEALTH_INSURANCE(this.registrationNo));
  }


  cancel() {
    this.location.back();
  }

  proceed() {
    const agreeTermsCheckbox = document.getElementById('agreeTermsCheckbox') as HTMLInputElement;
    if (agreeTermsCheckbox.checked) {
      this.navigateToRedierctInsCompany();
    } else {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.MEDICAL-INSURANCE-ACKNOWLEDGEMENT');
      scrollToTop();
      return;
    }
  }

}
