/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { CimRoutesEnum, ManagePersonConstants, ManagePersonRoutingService } from './shared';
import { RouterData, RouterDataToken } from '@gosi-ui/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cim-customer-information-dc',
  templateUrl: './customer-information-dc.component.html'
})
export class CustomerInformationDcComponent implements OnInit {
  constructor(private managePersonRoutingService: ManagePersonRoutingService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router) {}

  ngOnInit() {
    this.managePersonRoutingService.setToLocalToken();
    
  }
 
}
