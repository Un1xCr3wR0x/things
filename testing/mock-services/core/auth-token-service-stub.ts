import { ApplicationTypeEnum, GosiScope, JWTPayload } from '@gosi-ui/core';
import { JwtPayload } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { devToken } from '../../../token.json';
export class AuthTokenServiceStub {
  notifyLogout = new BehaviorSubject(false);
  appToken;
  /**
   * Method to set the token to local storage of browser.
   * And set the timeout of the token
   * @param token
   */
  setAuthToken(token): void {
    this.setTokenTimeOut(token);
  }

  /**
   * Method to get the token from local storage
   */
  getAuthToken(): string {
    return devToken.privateToken;
  }

  /**
   * Method to check the validity of token
   */
  isValidAuthToken(): boolean {
    return true;
  }

  /**
   * Method to set the timer based on timeout.
   * And will clear the local storage when token got expired
   * @param token
   */
  setTokenTimeOut(token): void {}

  /**
   * Method to get the timeout in milliseconds
   * @param token
   */
  getTokenTimeOut(token): number {
    return token ? 500 : 0; //Test value
  }

  /**
   * Method to decode token
   */
  decodeToken() {
    const token = {} as JWTPayload;
    token['gosiscp'] = null;
    return token;
  }

  parseToken(token: JwtPayload) {
    try {
      return JSON.parse(token['gosiscp']);
    } catch {
      return undefined;
    }
  }

  getEntitlements(): GosiScope[] {
    const scopes = [];
    const token = this.decodeToken();
    const publicEstKey = 'establishment';
    const publicRoleKey = 'role';
    const privateRoleKey = 'role';
    if (token['gosiscp'] && token['gosiscp'].trim() !== 'NOT_FOUND') {
      const isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
      this.parseToken(token).forEach(scp => {
        const regNo = isPrivate ? undefined : scp[publicEstKey] ? Number(scp[publicEstKey]) : undefined;
        const roles = scp[isPrivate ? privateRoleKey : publicRoleKey]?.map((r: string) => +r);
        scopes.push(new GosiScope(regNo, roles));
      });
    }
    return scopes;
  }
}
