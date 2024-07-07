/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, AuthTokenService } from '@gosi-ui/core';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { EstablishmentConstants } from '../../../shared';
import { ChangeEstablishmentService, EstablishmentService } from '../../../shared/services';

@Component({
  selector: 'est-search-establishment-sc',
  templateUrl: './search-establishment-sc.component.html',
  styleUrls: ['./search-establishment-sc.component.scss']
})
export class SearchEstablishmentScComponent implements OnInit {
  registrationNumber = new FormControl(null, Validators.required);
  ownerId = new FormControl(null, Validators.required);
  readonly public = ApplicationTypeEnum.PUBLIC;
  disabledIdentifier = false;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appType: string,
    readonly authTokenService: AuthTokenService
  ) {}

  ngOnInit() {
    this.alertService.clearAlerts();
    if (this.appType === ApplicationTypeEnum.PUBLIC) {
      this.disabledIdentifier = true;
      const token = this.authTokenService.getAuthToken();
      const jwtToken = jwtDecode<JwtPayload>(token);
      const adminIdentifier = jwtToken.sub;
      this.ownerId.setValue(adminIdentifier);
    }
  }

  searchEstablishment() {
    this.alertService.clearAlerts();
    this.registrationNumber.markAsTouched();
    if (this.registrationNumber.valid) {
      this.establishmentService.getEstablishmentProfileDetails(this.registrationNumber.value).subscribe(
        res => {
          if (res.registrationNo) {
            this.changeEstablishmentService.establishmentProfile = res;
            this.changeEstablishmentService.navigateToProfile(res.registrationNo);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  goToGroupProfile() {
    if (this.ownerId.value) {
      //Super admin access
      this.router.navigate([EstablishmentConstants.GROUP_ADMIN_PROFILE_ROUTE(this.ownerId.value.toString().trim())]);
    } else if (this.registrationNumber.value) {
      //Establishment Group Access
      this.router.navigate([
        EstablishmentConstants.GROUP_PROFILE_ROUTE(this.registrationNumber.value.toString().trim())
      ]);
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
}
