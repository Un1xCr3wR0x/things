/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthTokenService } from '../../services';

@Component({
  selector: 'gosi-ui-callback-updated-sc',
  template: ``,
  styles: []
})
export class CallbackUpdatedScComponent {
  accessToken: string;
  tokenLabel = 'access_token';

  /**
   * Creates an instance of CallbackScComponent.
   *
   * @memberof CallbackScComponent
   */
  constructor(private loginService: LoginService, router: ActivatedRoute,private authTokenService:AuthTokenService) {
    const navigation = performance.getEntriesByType('navigation');
    const direction = navigation.map(nav => nav['type']);

    if (direction.indexOf('back_forward') !== -1) {
      this.authTokenService.doLogin();
    } else {
      /*
       * http://localhost:4201/#/access_token#access_token=eyJraWQiOiJQcml2YXRlRG9tYWluIiwieDV0IjoiNmRwWVZqblFIRGRCMTgxWkNVMkdtb3ZIc2hvIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vUUFFT0hTTFZEMDEuZ29zaS5pbnM6Nzc3OC9vYXV0aDIiLCJhdWQiOlsiUHJpdmF0ZVJTZXJ2ZXIiLCJodHRwOi8vUUFFT0hTTFZEMDEuZ29zaS5pbnM6Nzc3OC9vYXV0aDIiLCJhYjAiXSwiZXhwIjoxNzE3MDY4OTE4LCJqdGkiOiJib1k1MEVVNGVUOGJmQUFXd1BYOElBIiwiaWF0IjoxNjg1NTMyOTE4LCJzdWIiOiJhYjAyODMwNCIsImNsaWVudCI6IkdPU0lFMkVQcml2YXRlRXN0YWJsaXNobWVudDAyIiwic2NvcGUiOlsiUHJpdmF0ZVJTZXJ2ZXIucmVhZCJdLCJkb21haW4iOiJQcml2YXRlRG9tYWluIiwidWlkIjoiZTAwMjgzMDQiLCJnb3Npc2NwIjoiW3tcInJvbGVcIjpbXCIxNDFcIixcIjE0MlwiLFwiMTI3XCJdfV0gIiwibG9uZ25hbWVhcmFiaWMiOiLYs9i52K8g2KjZhiDYttmK2YEg2KfZhNmE2Ycg2KfZhNi02YfYsdin2YbZiiIsImxvbmduYW1lZW5nbGlzaCI6Ik5PVF9GT1VORCIsInVzZXJyZWZlcmVuY2VpZCI6IjI4MzA0IiwicHJlZmVycmVkbGFuZ3VhZ2UiOiJOT1RfRk9VTkQiLCJjdXN0b21lQXR0cjEiOiJDdXN0b21WYWx1ZSIsImxvY2F0aW9uIjoiMzAifQ.Nv_4cXHDez27ndMUCAdF1HxpskLcOYEdU9WpKSvQ-X6sJ3gZ_SSnVtZL0jFLsyYC3zGGbAXBcZT_lGfr1VC3vwR234GxZoieuvPSYMtj7-XUZqWJG8jizJ98gFsfUu_n5rDVVikfEBHsHOsmXzpgyZr2c_cYPczPPA5EeflR6icxpMOAbQ3MOzFV1Iaw1UALw5kzvZj6t7lFOg-Sa_W0OGXG_CTqP-D-xNSwO3USq3uGhTXkCV61lUOa9SX7ARQ6pu8EPz0-yGtvf6jDgiqlJY3WuraehTzaU7N0nPMownlr4uV4Sq07Qg9oaWQJfvGQvh3x4DjRieSku8gw3pdZMw
       * */
      const matchUrl = window.location.href.match(new RegExp(/=.*/));
      this.accessToken = matchUrl ? matchUrl[0]?.substring(1) : null;
      if (this.accessToken) {
        this.loginService.handleLoginCallBack(this.accessToken);
      } else {
        this.loginService.handleTokenUnavailable();
      }
    }
  }
}
