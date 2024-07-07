/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BaseComponent } from '@gosi-ui/core';
import { EstablishmentRoutingService } from './shared';

@Component({
  selector: 'est-establishment-dc',
  templateUrl: './establishment-dc.component.html'
})
export class EstablishmentDcComponent extends BaseComponent implements OnInit {
  private routeParams: ParamMap;
  constructor(
    readonly establishmentRoutingService: EstablishmentRoutingService,
    readonly router: Router,
    readonly route: ActivatedRoute
  ) {
    super();
    this.routeParams = route.snapshot.paramMap;
  }

  ngOnInit() {
    this.establishmentRoutingService.setToLocalToken(this.routeParams);
  }
}
