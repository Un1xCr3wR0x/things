/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AlertService, ApplicationTypeToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { ChangePersonService } from '../../../shared';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cim-certificate-document-dc',
  templateUrl: './certificate-document-dc.component.html',
  styleUrls: ['./certificate-document-dc.component.scss']
})
export class CertificateDocumentDcComponent implements OnInit {
  currentTab: number;
  personId: number;
  constructor(
    readonly alertService: AlertService,
    public changePersonService: ChangePersonService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly activatedRoute: ActivatedRoute,
    readonly router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId')) {
        if (params) this.personId = Number(params.get('personId'));
      }
    });
    if (this.router.url.includes('certificates')) {
      this.currentTab = 0;
    } else if (this.router.url.includes('documents')) {
      this.currentTab = 2;
    }
  }

  onSelect(index) {
    this.currentTab = index;
    switch (index) {
      case 0:
        // this.router.navigate([`/home/profile/individual/internal/${this.personId}/records/certificates`]);
        break;
      case 1:
      // this.router.navigate([`/home/profile/individual/internal/${this.personId}/engagements`]);
      // break;
      case 2:
        this.router.navigate([`/home/profile/individual/internal/${this.personId}/records/documents`]);
        break;
    }
  }
}
