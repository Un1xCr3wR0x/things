import { switchMap } from 'rxjs/operators';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { EstablishmentProfileService } from '../../../services/establishments/establishment-profile.service';
import { FeatureTypeDcComponent } from '../feature-type-dc/feature-type-dc.component';
import { AlertService, BilingualText, LanguageToken } from '@gosi-ui/core';
import { EstablishmentsSearchResultDcComponent } from '../../../establishments/components/establishments-search-result-dc/establishments-search-result-dc.component';
import { EstablishmentsSearchDcComponent } from '../../../establishments/components/establishments-search-dc/establishments-search-dc.component';
import { EstablishmentProfile } from '../../../models/establishments/establishment-profile';
import { EstablishmentBranches } from '../../../models/establishments/establishment-branches';
import { IndividualSearchDcComponent } from '../../../individual/components/individual-search-dc/individual-search-dc.component';
import { EstablishmentBranchesService } from '../../../services/establishments/establishment-branches.service';
import { CustomerProfileService } from '../../../services/individual/customer-profile.service';
import { Location } from '@angular/common';

@Component({
  selector: 'fea-feature-search-sc',
  templateUrl: './feature-search-sc.component.html',
  styleUrls: ['./feature-search-sc.component.scss']
})
export class FeatureSearchScComponent implements OnInit {
  /**
   * Local variables
   */

  isArabicScreen: boolean;

  featureType: String = 'Establishments';

  establishmentProfile: EstablishmentProfile;

  establishmentBranches: EstablishmentBranches[] = [];

  @ViewChild('organisationTypeComp', { static: false })
  organisationTypeComp: FeatureTypeDcComponent;

  @ViewChild('establishmentsSearchComp', { static: false })
  establishmentsSearchComp: EstablishmentsSearchDcComponent;

  @ViewChild('establishmentsSearchCompRes', { static: false })
  establishmentsSearchCompRes: EstablishmentsSearchResultDcComponent;

  @ViewChild('individualSearchComp', { static: false })
  individualSearchComp: IndividualSearchDcComponent;

  constructor(
    readonly alertService: AlertService,
    readonly establishmentProfileService: EstablishmentProfileService,
    readonly establishmentBranchesService: EstablishmentBranchesService,
    readonly customerProfileService: CustomerProfileService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly location: Location,
    readonly router: Router
  ) {}

  ngOnInit() {
    // console.log('Calling establishmentProfileService >>> ');
    this.language.subscribe(lang => {
      if (lang === 'ar') {
        this.isArabicScreen = true;
      } else {
        this.isArabicScreen = false;
      }
    });
  }
  goBack() {
    this.location.back();
  }
  /**
   * this method is used to filter the Legal Entities corresponding to the establishment Type
   * @param establishmentType
   * @memberof AddEstablishmentSCBaseComponent
   */
  selectFeatureType(featureType: string) {
    this.featureType = featureType;
  }

  /**
   * This method is used to get Establishment details and branches details by establishment number
   * @param establishmentFormDetails
   */
  getEstablishmentDetailsAndBranches(establishmentFormDetails) {
    if (establishmentFormDetails) {
      this.alertService.clearAlerts();
    }
    const message: BilingualText = new BilingualText();
    message.arabic = 'لا يوجد مؤسسة لهذا الرقم';
    message.english = 'There is no Establishment for this number';

    this.establishmentProfileService
      .getEstablishmentProfile(establishmentFormDetails.data)
      .pipe(
        switchMap(value => {
          if (!value) {
            this.showErrorMessage(message);
            return [];
          } else {
            this.establishmentProfile = value;
            return this.establishmentBranchesService.getEstablishmentBranches(value.establishmentid);
          }
        }),
        tap(data => (this.establishmentBranches = data))
      )
      .subscribe();
  }

  getIndividualDetails(individualDetails) {
    const message: BilingualText = new BilingualText();
    message.arabic = 'رقم هوية غير صحيح';
    message.english = 'Invalid identity number';
    this.customerProfileService.getCustomerProfileDetails(individualDetails.data).subscribe(
      customerProfile => {
        if (customerProfile) {
          this.router.navigate(['home/360/individuales/details/' + individualDetails.data]);
        } else {
          this.showErrorMessage(message);
        }
      },
      error => {
        this.showErrorMessage(message);
      }
    );
  }

  showErrorMessage(message) {
    this.alertService.showError(message);
  }

  /**
   * Method to show form invalid
   */
  showFormInvalid() {
    this.alertService.showMandatoryErrorMessage();
  }
}
