/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthTokenService } from '../../services';

/**
 * This is the component to show home component which wraps all the features
 *
 * @export
 * @class CallbackScComponent
 */
@Component({
  selector: 'gosi-ui-app-callback',
  template: ``,
  styles: []
})
export class CallbackScComponent {
  accessToken: string;
  tokenLabel = 'access_token';

  /**
   * Creates an instance of CallbackScComponent.
   *
   * @memberof CallbackScComponent
   */
  constructor(private loginService: LoginService, router: ActivatedRoute,private authTokenService:AuthTokenService) {
    const matchUrl = window.location.href.match(new RegExp(/#access_token=.*/));
    this.accessToken = matchUrl ? matchUrl[0]?.substring(14) : null;
    const navigation = performance.getEntriesByType('navigation');
    const direction = navigation.map(nav => nav['type']);
    if (direction.indexOf('back_forward') !== -1) {
      this.authTokenService.doLogin();
    } else if (this.accessToken) {
      this.loginService.handleLoginCallBack(this.accessToken);
    } else {
      router.queryParams.subscribe(response => {
        if (response.access_token) {
          this.loginService.handleLoginCallBack(response.access_token);
        } else {
          this.loginService.handleTokenUnavailable();
        }
      });
    }
  }
}
