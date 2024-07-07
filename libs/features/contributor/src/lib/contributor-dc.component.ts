/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Channel,
  RouterConstants,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { ContributorRouteConstants } from './shared/constants';

@Component({
  selector: 'cnt-contributor-dc',
  templateUrl: './contributor-dc.component.html'
})
export class ContributorDcComponent implements OnInit {
  /** Creates an instance of ContributorDcComponent. */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router
  ) {}

  /** Method to initialize the class. */
  ngOnInit() {
    if (this.routerData.resourceType)
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? this.routeToValidatorView(this.routerData.resourceType)
        : this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP
        ? this.routeToIndividualAppView(this.routerData.resourceType)
        : this.routeEstablishmentAdminEdit(this.routerData.resourceType);
  }

  /** Method to handle validator routing. */
  routeToValidatorView(type: string) {
    switch (type) {
      case RouterConstants.TRANSACTION_UPDATE_WAGE:
        this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATOR_MANAGE_WAGE]);
        break;
      case RouterConstants.TRANSACTION_CHANGE_ENGAGEMENT:
      case RouterConstants.TRANSACTION_BENEFIT_SANED:
      case RouterConstants.UI_BENEFIT_ADJUSTMENT:
        if (this.routerData?.channel === Channel.TAMINATY) {
          this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT_IND_VALIDATOR]);
        } else {
          this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT_VALIDATOR]);
        }
        break;
      case RouterConstants.TRANSACTION_ADD_CONTRACT:
        this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRACT_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_E_REGISTER_COMPLIANCE:
        this.router.navigate([ContributorRouteConstants.ROUTE_MANAGE_E_REGISTER_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_E_REGISTER_PPA:
        this.router.navigate([ContributorRouteConstants.ROUTE_MANAGE_E_REGISTER_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_MANAGE_COMPLIANCE:
        this.router.navigate([ContributorRouteConstants.ROUTE_MANAGE_COMPLIANCE_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_CANCEL_CONTRACT:
        this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_CONTRACT_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_TERMINATE_ENGAGEMENT:
        if (this.routerData?.channel === Channel.TAMINATY) {
          this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR_IND_VALIDATOR]);
        } else {
          this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR_VALIDATOR]);
        }
        break;
      case RouterConstants.TRANSACTION_REGISTER_SECONDMENT:
        this.router.navigate([ContributorRouteConstants.ROUTE_REGISTER_SECONDMENT_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_TERMINATE_STUDYLEAVE_ENGAGEMENT:
        this.router.navigate([ContributorRouteConstants.ROUTE_REGISTER_STUDYLEAVE_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_CANCEL_ENGAGEMENT:
        if (this.routerData?.channel === Channel.TAMINATY) {
          this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT_IND_VALIDATOR]);
        } else {
          this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT_VALIDATOR]);
        }
        break;
      case RouterConstants.TRANSACTION_ADD_SECONDED:
        this.router.navigate([ContributorRouteConstants.ROUTE_ADD_SECONDED_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_TRANSFER_INDIVIDUAL_CONTRIBUTOR:
        this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_CONTRIBUTOR_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_TRANSFER_ALL_CONTRIBUTOR:
        this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_ALL_CONTRIBUTOR_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_BULK_WAGE_UPDATE:
        this.router.navigate([ContributorRouteConstants.ROUTE_BULK_WAGE_UPDATE_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_ADD_VIC:
        this.router.navigate([ContributorRouteConstants.ROUTE_ADD_VIC_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_MANAGE_VIC:
        this.router.navigate([ContributorRouteConstants.ROUTE_VIC_INDIVIDUAL_WAGE_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_TERMINATE_VIC:
        this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_VIC_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_CANCEL_VIC:
        this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_VIC_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_ADD_AUTHORIZATION_MOJ:
        this.router.navigate([ContributorRouteConstants.ROUTE_ADD_AUTHORIZATION_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_ADD_AUTHORIZATION_EXTERNAL:
        this.router.navigate([ContributorRouteConstants.ROUTE_ADD_AUTHORIZATION_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_CONTRACT_AUTHENTICATION:
        this.router.navigate([ContributorRouteConstants.ROUTE_INDIVIDUAL_CONTRACT_AUTH]);
        break;
      case RouterConstants.TRANSACTION_MODIFY_COVERAGE:
        this.router.navigate([ContributorRouteConstants.ROUTE_MODIFY_COVERAGE_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_REACTIAVTE_ENGAGEMENT:
        this.router.navigate([ContributorRouteConstants.ROUTE_REACTIVATE_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_REACTIVATE_VIC_ENGAGEMENT:
        this.router.navigate([ContributorRouteConstants.ROUTE_REACTIVATE_VIC_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_ENTER_RPA_firstScheme:
        this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATOR_ENTERRPA]);
        break;
      case RouterConstants.TRANSACTION_ENTER_RPA_lastScheme:
        this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATOR_ENTERRPA]);
        break;
      case RouterConstants.TRANSACTION_CANCEL_RPA:
        this.router.navigate([ContributorRouteConstants.ROUTE_CANCELRPA_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_CANCEL_RPA_FIRST_SCHEME:
        this.router.navigate([ContributorRouteConstants.ROUTE_CANCELRPA_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_CANCEL_RPA_LAST_SCHEME:
        this.router.navigate([ContributorRouteConstants.ROUTE_CANCELRPA_VALIDATOR]);
        break;
      default:
        this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATOR_CONTRIBUTOR]);
    }
  }

  /** Method to handle validator routing. */
  routeToIndividualAppView(type: string) {
    switch (type) {
      case RouterConstants.TRANSACTION_CONTRACT_AUTHENTICATION:
        this.router.navigate([ContributorRouteConstants.ROUTE_INDIVIDUAL_CONTRACT_AUTH]);
        break;
      default:
        this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATOR_CONTRIBUTOR]);
    }
  }

  /** Method to hande establishment admin edit routing. */
  routeEstablishmentAdminEdit(type: string) {
    switch (type) {
      case RouterConstants.TRANSACTION_CHANGE_ENGAGEMENT:
        {
          if (this.routerData?.channel === Channel.TAMINATY) {
            this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT_REQUEST]);
          } else {
            this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT_EDIT]);
          }
        }
        // this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT_EDIT]);
        break;
      case RouterConstants.TRANSACTION_REACTIAVTE_ENGAGEMENT:
        this.router.navigate([ContributorRouteConstants.ROUTE_REACTIVATE_ENGAGEMENT_EDIT]);
        break;
      case RouterConstants.TRANSACTION_TERMINATE_ENGAGEMENT:
        if (this.routerData?.channel === Channel.TAMINATY) {
          this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR_REQUEST]);
        } else {
          this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR_EDIT]);
        }
        break;
      case RouterConstants.TRANSACTION_CANCEL_ENGAGEMENT:
        {
          if (this.routerData?.channel === Channel.TAMINATY) {
            this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT_REQUEST]);
          } else {
            this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT_EDIT]);
          }
        }
        break;
      case RouterConstants.TRANSACTION_MOL_ENGAGEMENT:
        this.router.navigate([ContributorRouteConstants.ROUTE_CONTRIBUTOR_REGISTER_PROACTIVE]);
        break;
      case RouterConstants.TRANSACTION_ADD_SECONDED:
        this.router.navigate([ContributorRouteConstants.ROUTE_ADD_SECONDED_EDIT]);
        break;
      case RouterConstants.TRANSACTION_TRANSFER_INDIVIDUAL_CONTRIBUTOR:
        this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_CONTRIBUTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_TRANSFER_ALL_CONTRIBUTOR:
        this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_ALL_CONTRIBUTOR_EDIT]);
        break;
      case RouterConstants.INSPECTION_CANCEL_ENGAGEMENT:
        this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGMENT_INSPECTION]);
        break;
      case RouterConstants.TRANSACTION_VIOLATE_ENGAGEMENT:
        this.router.navigate([ContributorRouteConstants.ROUTE_COMPLIANCE]);
        break;
      case RouterConstants.TRANSACTION_E_REGISTER_COMPLIANCE:
        this.router.navigate([ContributorRouteConstants.ROUTE_MANAGE_E_REGISTER_VALIDATOR]);
        break;
      case RouterConstants.TRANSACTION_E_REGISTER_PPA:
        this.router.navigate([ContributorRouteConstants.ROUTE_MANAGE_E_REGISTER_VALIDATOR]);
        break;
      case RouterConstants.PRIVATE_SECTOR_APPEAl:
        return;
      default:
        this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRIBUTOR_EDIT]);
        break;
    }
  }
}
