/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterData, RouterDataToken, AppealsType } from '@gosi-ui/core';
import { AppealRouteConstants, AppealValidatorRoles } from '@gosi-ui/features/appeals';

@Component({
  selector: 'appeals-dc',
  templateUrl: './appeals-dc.component.html'
})
export class AppealsDcComponent implements OnInit {
  constructor(
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const assignedRole = this.routerData.idParams.get('assignedRole');
    //Validator View
    if ((<any>Object).values(AppealValidatorRoles).includes(assignedRole)) {
      this.routeToValidatorView(this.routerData.resourceType);
    }
  }
  // legal manger private
  // legal manager private

  /** Method to handle validator routing. */
  routeToValidatorView(type: string) {
    switch (type) {
      case AppealsType.TRANSACTION_APPEAL_ON_PUBLIC_SECTOR:
      case AppealsType.TRANSACTION_APPEAL_ON_PRIVATE_SECTOR:
        this.router.navigate([AppealRouteConstants.ROUTE_VALIDATOR_APPEAL]);
        break;

      default:
        break;
    }
  }
}
