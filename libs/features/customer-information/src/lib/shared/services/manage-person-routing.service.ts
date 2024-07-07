/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BaseRoutingService,
  IdentityTypeEnum,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { ManagePersonConstants } from '../constants';
import { CimRoutesEnum } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class ManagePersonRoutingService extends BaseRoutingService {
  constructor(@Inject(RouterDataToken) readonly routerData: RouterData, readonly router: Router) {
    super(routerData, router);
  }

  /**
   * This method is to set global token to  manage  person  token to use across the library
   */
  setToLocalToken() {
    if (this.routerData.taskId) {
      // this.managePersonData.setRouterDataToManagePersonData(this.routerData);
      this.navigateTo(this.routerData.resourceType);
    }
  }

  /**
   * Manage Internal Routing
   */
  navigateTo(resourceType) {
    let isValidator = false;
    if (
      this.routerData.assignedRole === Role.VALIDATOR ||
      this.routerData.assignedRole === Role.VALIDATOR_1 ||
      this.routerData.assignedRole === Role.VALIDATOR_2 ||
      this.routerData.assignedRole === Role.GDS ||
      this.routerData.assignedRole === Role.FC_APPROVER
    ) {
      isValidator = true;
    } else {
      isValidator = false;
    }
    switch (resourceType) {
      case RouterConstants.TRANSACTION_ADD_IQAMA:
      case RouterConstants.TRANSACTION_ADD_IQAMA_GCC: {
        if (isValidator) {
          this.navigateToValidatorAddIqama();
        } else {
          this.navigateToAddIqama();
        }
        break;
      }
      case RouterConstants.TRANSACTION_ADD_BORDER:
      case RouterConstants.TRANSACTION_ADD_BORDER_GCC: {
        if (isValidator) {
          this.navigateToValidatorAddBorder();
        } else {
          this.navigateToAddBorder();
        }
        break;
      }
      case RouterConstants.MODIFY_NATIONALITY: {
        if (isValidator) {
          this.navigateToValidatorModifyNationality();
        } else {
          this.navigateToValidatorModifyNationality();
        }
        break;
      }
      case RouterConstants.MODIFY_NATIONALITY_OTHERS: {
        if (isValidator) {
          this.navigateToValidatorModifyNationalityOthers();
        } else {
          this.navigateToValidatorModifyNationalityOthers();
        }
        break;
      }
      case RouterConstants.TRANSACTION_ADD_PASSPORT:
      {
        if (isValidator) {
          this.navigateToValidatorAddPassport();
        } else {
          this.navigateToAddPassport();
        }
        break;
      }
      case RouterConstants.TRANSACTION_MODIFY_PERSONAL_DETAILS: {
        if (isValidator) {
          this.navigateToValidatorModifyPesonDetails();
        } 
        else {
          this.navigateToValidatorModifyPesonDetails();
        }
        break;
      }
      case RouterConstants.TRANSACTION_ADD_NIN:
        {
          if (isValidator) {
            this.navigateToValidatorAddNin();
          } else {
            this.navigateToValidatorAddNin();
          }
          break;
        }
        case RouterConstants.TRANSACTION_EDIT_NIN:
        {
          if (isValidator) {
            this.navigateToValidatorEditNin();
          } else {
            this.navigateToValidatorEditNin();
          }
          break;
        }
      default:
        break;
    }
  }

  /**
   * This method is to navigate to the validator
   */
  navigateToValidator(type?: string) {
    this.routerData.taskId = this.routerData.taskId;
    if (type === IdentityTypeEnum.BORDER) {
      this.router.navigate([CimRoutesEnum.VALIDATOR_ADD_BORDER]);
    } else if (type === IdentityTypeEnum.IQAMA) {
      this.router.navigate([CimRoutesEnum.VALIDATOR_ADD_IQAMA]);
    }
    else if (type === IdentityTypeEnum.PASSPORT) {
      this.router.navigate([CimRoutesEnum.VALIDATOR_ADD_PASSPORT]);
    }
  }

  navigateToInbox(appType: string) {
    this.router.navigate([ManagePersonConstants.ROUTE_TO_INBOX(appType)]);
  }

  /**
   * This method is to navigate to the contributor search
   */
  navigateToContributorSearch() {
    this.router.navigate([CimRoutesEnum.CONTRIBUTOR_SEARCH]);
  }

  /**
   * This method is to navigate to the contributor search
   */
  navigateToUserSearch() {
    this.router.navigate([CimRoutesEnum.USER_SEARCH]);
  }

  /**
   * Method to navigate ot addiqama screen
   */
  navigateToAddIqama() {    
      this.router.navigate([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_IQAMA]);
  }

  /**
   * Method to navigate ot addiqama screen
   */
  navigateToAddNin(personId) {
    // this.router.navigate([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_NIN]);
    this.router.navigate([`home/profile/contributor/add-nin/${personId}`])
  }
  
  navigateToEditNin(){
    this.router.navigate([CimRoutesEnum.CONTRIBUTOR_PROFILE_EDIT_NIN]);
    // this.router.navigate([`home/profile/contributor/edit-nin/${personId}`])
  }
 /**
   * Method to navigate ot add passport screen
   */
 navigateToAddPassport() {
  this.router.navigate([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_PASSPORT]);
}

  /**
   * Method to navigate ot addiqama screen
   */
  navigateToValidatorAddIqama() {
    this.router.navigate([CimRoutesEnum.VALIDATOR_ADD_IQAMA]);
  }

  /**
   * Method to navigate ot add border screen
   */
  navigateToAddBorder() {
      this.router.navigate([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_BORDER]);
  }

  /**
   * Method to navigate ot addiqama screen
   */
  navigateToValidatorAddBorder() {
    this.router.navigate([CimRoutesEnum.VALIDATOR_ADD_BORDER]);
  }
  navigateToValidatorModifyNationality() {
    this.router.navigate([CimRoutesEnum.VALIDATOR_MODIFY_NATIONALITY]);
  }
  navigateToValidatorModifyNationalityOthers() {
    this.router.navigate([CimRoutesEnum.VALIDATOR_MODIFY_NATIONALITY_OTHERS]);
  }
  navigateToValidatorModifyPesonDetails() {
    this.router.navigate([CimRoutesEnum.VALIDATOR_MODIFY_PERSONAL_DETAILS]);
  }

  /**
   * Method to navigate to update address
   */
  navigateToUpdateAddress() {
    this.router.navigate([CimRoutesEnum.USER_UPDATE_ADDRESS]);
  }
  navigateToValidatorAddPassport() {
    this.router.navigate([CimRoutesEnum.VALIDATOR_ADD_PASSPORT]);
  }
  navigateToValidatorAddNin() {
    this.router.navigate([CimRoutesEnum.VALIDATOR_ADD_NIN]);
  }
  navigateToValidatorEditNin() {
    this.router.navigate([CimRoutesEnum.VALIDATOR_EDIT_NIN]);
  }

  /**
   * This method is used to reset the local token
   */
  resetLocalToken() {
    this.routerData.fromJsonToObject(new RouterData());
  }
}
