/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, Inject, Injectable } from '@angular/core';
import {
  AuthTokenService,
  BaseComponent,
  IdentityManagementService,
  MenuItem,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import menu from '../../../../../assets/jsons/menu.json';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnvironmentToken } from '../../../../../../../../libs/core/src/lib/tokens'; //'../tokens';
import { Environment } from '../../../../../../../../libs/core/src/lib/models';
import { ControlPerson } from '@gosi-ui/features/establishment';
@Component({
  selector: 'est-virtual-visit-dc',
  templateUrl: './virtual-visit-dc.component.html'
})
@Injectable({
  providedIn: 'root'
})
export class VirtualVisitDcComponent extends BaseComponent implements OnInit {
  /**
   * Input variables
   */
  @Input() menuItems: MenuItem[];
  @Input() employees: ControlPerson[];

  /**
   * Initialize fields inside constructor
   */

  fullname: string = '';
  phone: string = '';
  iframe_url: SafeResourceUrl;

  constructor(
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    @Inject(EnvironmentToken) private environment: Environment,
    @Inject(RegistrationNoToken) readonly registrationNo: RegistrationNumber,
    readonly authService: AuthTokenService
  ) {
    super();
    this.menuItems = menu.menuItems.filter(item => item.isEstablishmentRequired !== true);
  }

  async ngOnInit() {
    const token = this.authService.decodeToken(this.authService.getAuthToken());
    let loggedInName = token?.longnamearabic?.trim() === 'NOT_FOUND' ? token?.longnameenglish : token?.longnamearabic;
    let url =
      this.environment.virtualVisitAzureURL +
      '?type=Establishment&fullname=' +
      loggedInName +
      '&registrationNo=' +
      this.registrationNo.value;
    window.open(url, '_blank');
  }

  getLoggedInPerson() {}
}
