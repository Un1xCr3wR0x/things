/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { CimRoutesEnum } from '../enums';

/**
 * This guard is to enable the routes based on application
 */
@Injectable()
export class ManagePersonGuard implements CanActivate {
  constructor(private router: Router, @Inject(ApplicationTypeToken) readonly appToken: string) {}

  //Method to activate a route
  canActivate(): boolean {
    //If route is accessed through ameen application
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      return true;
    } else if (this.router.getCurrentNavigation().finalUrl.root.children.primary.segments[2].path === 'user') {
      return true;
    } else {
      this.router.navigate([CimRoutesEnum.CONTRIBUTOR_PROFILE_ENGAGEMENT]);
    }
  }
}
