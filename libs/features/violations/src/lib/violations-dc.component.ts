/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, RouterData, RouterDataToken, ViolationsType } from '@gosi-ui/core';
import { ViolationRouteConstants } from './shared/constants';
import { AppealValidatorRoles } from './shared/enums/appeal-validator-roles';

@Component({
  selector: 'vol-violations-dc',
  templateUrl: './violations-dc.component.html'
})
export class ViolationsDcComponent implements OnInit {
  constructor(
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    //Validator View
    const url = this.router.url.toString();
    if (!url.includes('/home/violations/violation-history'))
      if (
        this.routerData.assignedRole === Role.COMMITEE_MEMBER ||
        this.routerData.assignedRole === Role.COMMITEE_HEAD
      ) {
        this.routeToValidatorView(this.routerData.resourceType);
      } else if (
        this.routerData.assignedRole === Role.VALIDATOR_1 ||
        this.routerData.assignedRole === Role.VALIDATOR_2
      ) {
        this.routeToChangeValidatorView(this.routerData.resourceType);
      } else if (
        this.routerData.assignedRole === Role.ESTABLISHMENT_ADMIN ||
        this.routerData.assignedRole === Role.ESTABLISHMENT ||
        (<any>Object).values(AppealValidatorRoles).includes(this.routerData.assignedRole)
      ) {
        this.routeAppealOnViolationChannel(this.routerData.assignedRole);
      }
  }

  /** Method to handle validator routing. */
  routeToValidatorView(type: string) {
    switch (type) {
      case ViolationsType.TRANSACTION_INCORRECT_TERMINATION:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_INCORRECT_TERMINATION]);
        break;
      case ViolationsType.TRANSACTION_INCORRECT_WAGE:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_INCORRECT_WAGE]);
        break;
      case ViolationsType.TRANSACTION_MODIFY_JOINING_DATE:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_MODIFY_JOINING_DATE]);
        break;
      case ViolationsType.TRANSACTION_ADD_NEW_ENGAGEMENT:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_ADD_NEW_ENGAGEMENT]);
        break;
      case ViolationsType.TRANSACTION_CANCEL_ENGAGEMENT:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_CANCEL_ENGAGEMENT]);
        break;
      case ViolationsType.TRANSACTION_MODIFY_LEAVING_DATE:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_MODIFY_LEAVING_DATE]);
        break;
      case ViolationsType.TRANSACTION_WRONG_BENEFITS:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_WRONG_BENEFITS]);
        break;
      case ViolationsType.TRANSACTION_OTHER_VIOLATION:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_VIOLATING_PROVISIONS]);
        break;
        case ViolationsType.TRANSACTION_INJURY_VIOLATION:
          this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_INJURY_VIOLATION]);
        break;
      default:
    }
  }

  /** Method to handle validator routing for Violation Profile. */
  routeToChangeValidatorView(type: string) {
    switch (type) {
      case ViolationsType.TRANSACTION_MODIFY_VIOLATION:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_MODIFY_VIOLATION]);
        break;
      case ViolationsType.TRANSACTION_CANCEL_VIOLATION:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_CANCEL_VIOLATION]);
        break;
      case ViolationsType.TRANSACTION_RAISE_VIOLATION:
        this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_RAISE_VIOLATION]);
        break;
      default:
    }
  }

  /** Method handle validator from internal and external enduser for Appeal On Violation */
  routeAppealOnViolationChannel(assignedRole) {
    if (assignedRole === Role.ESTABLISHMENT) {
      // External User AOV Or Admin User
      this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_APPEAL_ON_VIOLATION_EXTERNAL]);
    } else {
      // Internal User AOV for validators
      this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_APPEAL_ON_VIOLATION_INTERNAL]);
    }
  }
}
