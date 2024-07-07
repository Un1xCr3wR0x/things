/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppConstants } from '../constants';
import { Environment, GosiErrorWrapper } from '../models';
import { EnvironmentToken } from '../tokens';
import { LoginService } from '../services/login.service';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable()
export class GosiHttpInterceptor implements HttpInterceptor {
  envBaseUrl: string;
  map: Map<string, boolean> = new Map();
  /**
   * Creates an instance of GosiHttpInterceptor
   *
   * @param AuthTokenService
   * @param environment
   * @memberof GosiHttpInterceptor
   */
  constructor(
    private authTokenService: AuthTokenService,
    private loginService: LoginService,
    @Inject(EnvironmentToken) private environment: Environment
  ) {
    this.envBaseUrl = environment.baseUrl;
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authTokenService.isValidAuthToken() || window.location.href.includes('do-login')) {
      if (request.url.indexOf('denodo-api') !== -1) {
        request = this.interceptForDenodo(request);
      } else if (request.url.indexOf('/denodo-otp-api') !== -1) {
        request = this.interceptForDenodoOtp(request);
      } else if (request.url.indexOf('/api') !== -1 && request.url.indexOf(this.envBaseUrl) === -1) {
        if (request.headers.get('noAuth') === 'true') {
          request = this.interceptWithNoAuth(request, this.envBaseUrl, this.environment.webEstablishmentApiKey);
        } else {
          if (
            !this.environment.disableTokenValidityCheck &&
            !this.authTokenService.checkTokenValidity(this.authTokenService.getAuthToken())
          ) {
            return throwError(this.interceptApiForInvalidToken());
          }
          request = this.interceptForAuthorization(
            request,
            this.envBaseUrl,
            this.authTokenService.getAuthToken(),
            this.environment.webEstablishmentApiKey
          );
        }
      }
      if (!this.map.get(request.urlWithParams)) {
        this.map.set(request.urlWithParams, true);
        return next.handle(request).pipe(
          tap(() => this.map.delete(request.urlWithParams)),
          catchError(err => {
            this.map.delete(request.urlWithParams);
            return throwError(err);
          })
        );
      }
      return next.handle(request);
    } else {
      if(!window.location.href.includes('do-login')){
        this.authTokenService.doLogin();
      }
    }
  }
  /**
   * Method to get denodo api
   * @param request
   */
  interceptForDenodo(request: HttpRequest<any>) {
    request = request.clone({
      url: request.url.replace('/denodo-api', this.environment.baseDenodoUrl)
    });
    const passApiKey = request.headers.get('x-api');
    if (passApiKey === 'false') {
      let withXapiheader = request.headers.delete('x-api');
      const withoutXapiheader = withXapiheader.delete('x-apikey');
      request = request.clone({
        headers: withoutXapiheader
      });
    }
    return request;
  }
  /**
   * Method to get denodo otp
   * @param request
   */
  interceptForDenodoOtp(request: HttpRequest<any>) {
    request = request.clone({
      url: request.url.replace('/denodo-otp-api', this.envBaseUrl),
      setHeaders: {
        'x-apikey': `${this.environment.webEstablishmentDenodoApiKey}`,
        Authorization: `Bearer ${this.authTokenService.getAuthToken()}`
      }
    });
    return request;
  }

  /**
   * Method to handle requests without api token required.
   * @param request Incoming request
   * @param url  Api Url
   * @param apiKey   Api key to identify the application identity
   */
  interceptWithNoAuth(request, url, apiKey) {
    return request.clone({
      url: request.url.replace('/api', url),
      setHeaders: {
        'x-apikey': `${apiKey}`
      },
      headers: request.headers.delete('noAuth')
    });
  }

  /**
   * Method to add or remove authorization header in the request
   * @param request  Incoming request
   * @param url Api Url
   * @param token Authorization Token
   * @param apiKey Api key to identify the application identity
   */
  interceptForAuthorization(request: HttpRequest<any>, url: string, token: string, apiKey: string) {
    return request.clone({
      url: request.url.replace('/api', url),
      setHeaders: {
        'x-apikey': `${apiKey}`,
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Method to handle api calls with invalid token
   * @param requestUrl
   */
  interceptApiForInvalidToken(): GosiErrorWrapper {
    return AppConstants.UNAUTH_ERROR;
  }
}
