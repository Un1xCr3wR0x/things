/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import roleMapping from '../../../../../role-mapping.json';
import Domain from '../../assets/jsons/domain.json';
import { RouterConstants } from '../constants';
import { ApplicationTypeEnum, Channel, RoleIdEnum } from '../enums';

import {
  ContributorTokenDto,
  DefaultRoute,
  DomainRoute,
  DomainUrl,
  Environment,
  GosiScope,
  JWTPayload,
  MenuItem,
  RegistrationNumber,
  RoleFeature,
  RoleFeatures
} from '../models';
import { ApplicationTypeToken, ContributorToken, EnvironmentToken, MenuToken, RegistrationNoToken } from '../tokens';
import { AuthTokenService } from './auth-token.service';
import { StorageService } from './storage.service';
import { SystemService } from './system.service';
declare const require;
/**
 * MenuService for handling side menu population
 */
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  data: any;
  public showSMSMessage = new BehaviorSubject(true);
  isPpaEstablishment: boolean = false;

  constructor(
    @Inject(MenuToken) readonly menuToken: MenuItem[],
    readonly tokenService: AuthTokenService,
    readonly storageService: StorageService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EnvironmentToken) private environment: Environment,
    @Inject(RegistrationNoToken) readonly registrationNo: RegistrationNumber,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto,
    readonly systemService: SystemService,
    readonly http: HttpClient
  ) {}

  getCustomerType(registrationNo: string) {
    const url =
      '/api/v1/em_virtual_visit_proxy/server/customer360/bv_est_relationship_officer_chatbot/views/bv_est_relationship_officer_chatbot?P_REGISTRATIONNUMBER=' +
      registrationNo;
    return this.http.get(url);
  }

  /**
   * Method to populate side menu items
   * @param menuItems
   */
  getMenuItems(menuItems: MenuItem[], url?: string, isVicAvailable?: boolean): MenuItem[] {
    if (this.systemService.isUnderMaintanance) return [];

    if (this.getApplicationAuthorizationStatus()) return menuItems;
    let isEstablishmentAvailable = false;
    const urlData = this.checkMenuItemPermission(url);
    if (urlData) {
      isEstablishmentAvailable = this.registrationNo.value && urlData.isEstablishmentRequired ? true : false;
      isVicAvailable =
        urlData.isVicRequired && isVicAvailable && this.contributorToken.socialInsuranceNo ? true : false;
    }
    const features: string[] = this.getFeatures(this.registrationNo.isGcc);
    const location: string = this.getLocation();
    if (features.length === 0) return [];

    return this.getAuthorizedMenuItems(menuItems, features, location, isEstablishmentAvailable, isVicAvailable).reduce(
      (items, currentItem) => {
        // alert(currentItem.link);
        if (!items.find(item => !currentItem.hasSubMenu && !item.hasSubMenu && item.link === currentItem.link))
          items.push(currentItem);
        return items;
      },
      []
    );
  }

  private getAuthorizedMenuItems(
    menuItems: MenuItem[],
    features: string[],
    location: string,
    isEstablishmentAvailable: boolean,
    isVicAvailable: boolean
  ) {
    const currentMenu = menuItems.slice().map(item => Object.assign({}, item));
    const modifiedMenuItems: MenuItem[] = [].concat(currentMenu);
    for (const menuItem of currentMenu) {
      const index: number = modifiedMenuItems.indexOf(menuItem);
      if (menuItem.isEstablishmentRequired && !isEstablishmentAvailable) {
        modifiedMenuItems.splice(index, 1);
        continue;
      }
      if (menuItem.hasSubMenu) {
        const subMenus: MenuItem[] = [];
        for (const subMenu of menuItem.menuItems.slice()) {
          if (subMenu.allowedFeatures?.some(v => features.indexOf(v) !== -1)) {
            if (subMenu?.allowedLocations?.length > 0) {
              if (subMenu.allowedLocations === location) {
                subMenu.link = this.generateURL(subMenu.link);
                subMenus.push(subMenu);
              }
            } else {
              if (
                (subMenu.isEstablishmentRequired && !isEstablishmentAvailable) ||
                (subMenu.isVicRequired && !isVicAvailable)
              )
                continue;
              subMenu.link = this.generateURL(subMenu.link);
              if (!this.isPpaEstablishment || (this.isPpaEstablishment && !subMenu.hideMenuForPpa))
                {
                  if((subMenu.label == "MENUITEM.TRANSFER-ALL-CONTRIBUTORS" 
                  || subMenu.label == "MENUITEM.TRANSFER-MULTIPLE-CONTRIBUTORS")
                  && this.registrationNo.isGcc
                  ) continue;
                  else  subMenus.push(subMenu);
                }
            }
          }
        }
        if (subMenus.length > 0) {
          menuItem.menuItems = subMenus;
        } else {
          modifiedMenuItems.splice(index, 1);
        }
      } else if (menuItem.allowedFeatures?.length > 0) {
        if (menuItem.allowedFeatures.some(v => features.indexOf(v) !== -1)) {
          menuItem.link = this.generateURL(menuItem.link);
        } else if (index !== -1) {
          modifiedMenuItems.splice(index, 1);
        }
      } else {
        if (index !== -1) {
          modifiedMenuItems.splice(index, 1);
        }
      }
    }
    return modifiedMenuItems;
  }

  private generateURL(url: string): string {
    if (url.includes('{identifier}')) {
      const token = this.tokenService.getAuthToken();
      const jwtToken = this.tokenService.decodeToken(token);
      url = url.replace('{identifier}', jwtToken.uid);
    }
    if (url.includes('{registrationNo}')) {
      url = url.replace('{registrationNo}', this.registrationNo.value?.toString());
    }
    return url;
  }

  /**
   * Method to get features of role
   */
  getFeatures(isGcc = false): string[] {
    let features: string[] = [];
    const roles: string[] = this.getRoles();
    if (roles.length === 0) return features;
    for (const role of roles) {
      const featureRoles: RoleFeatures = roleMapping;
      const featureOfRole: RoleFeature[] = featureRoles.roleFeatures.filter(roleFeature => roleFeature.role === role);
      if (featureOfRole.length > 0) {
        features = features.concat(featureOfRole[0].features);
        if (isGcc && featureOfRole[0].gccFeatures?.length > 0) {
          features = features.concat(featureOfRole[0].gccFeatures);
        }
        if (!isGcc && featureOfRole[0].nonGccFeatures?.length > 0) {
          features = features.concat(featureOfRole[0].gccFeatures);
        }
      }
    }
    features = Array.from(new Set(features));
    return features;
  }
  /**
   * Method to check permission for a url access
   * @param url
   * @param childUrl
   */
  checkURLPermission(url: string) {
    if (this.getApplicationAuthorizationStatus()) return true;
    if (url === RouterConstants.ROUTE_NOT_FOUND) return true;
    if (url === RouterConstants.ROUTE_UNDER_MAINTANENCE) return true;
    const features: string[] = this.getFeatures(this.registrationNo.isGcc);
    if (features.length === 0) return false;
    if (url === RouterConstants.ROUTE_HOME) return true;
    else {
      let domainUrl = url;
      if (url.includes(`${RouterConstants.ROUTE_HOME}/`)) domainUrl = url.replace(`${RouterConstants.ROUTE_HOME}/`, '');
      else if (url.includes(`${RouterConstants.ROUTE_DASHBOARD}`)) {
        domainUrl = url.replace(`${RouterConstants.ROUTE_DASHBOARD}`, '');
        if (domainUrl.slice(0, 1) === '/') domainUrl = domainUrl.replace('/', '');
        if (domainUrl === '') {
          const dashboardJson = require(`../../assets/jsons/dashboard.json`);
          return dashboardJson.urlItems.find(dashboardUrl => {
            const matchUrl = domainUrl.match(new RegExp(dashboardUrl.url));
            const featureAllowed = dashboardUrl.allowedFeatures?.some(v => features.indexOf(v) !== -1);
            return matchUrl && featureAllowed;
          });
        }
      }
      if (domainUrl.slice(0, 1) === '/') domainUrl = domainUrl.replace('/', '');

      const urlSegment = Domain.urlItems.find(item => {
        const domainLength = domainUrl.indexOf('/') !== -1 ? domainUrl.indexOf('/') : domainUrl.length;
        const hasFeatureInDomainJSON = domainUrl?.slice(0, domainLength) === item.type;
        const isFeatureAllowed = item.allowedFeatures?.some(v => features.indexOf(v) !== -1);
        return hasFeatureInDomainJSON && isFeatureAllowed;
      });
      if (urlSegment) {
        const route = domainUrl.replace(`${urlSegment.type}`, '');
        if (route.length > 0) {
          const jsonFile = require(`../../assets/jsons/${urlSegment.type}.json`);
          const isFeatureAllowedForRoute = jsonFile.urlItems.find(featureUrl => {
            const matchUrl = route.match(new RegExp(featureUrl.url));
            const featureAllowed = featureUrl.allowedFeatures?.some(v => features.indexOf(v) !== -1);
            return matchUrl && route === matchUrl[0] && featureAllowed;
          });
          return isFeatureAllowedForRoute;
        } else {
          return true;
        }
      } else return false;
    }
  }
  /**
   * Method to get roles from jwt token
   */
  getRoles(): string[] {
    const token = this.tokenService.getAuthToken();
    let roles: string[] = [];
    if (!token) return roles;
    let regNo = null;
    if (this.appToken === ApplicationTypeEnum.PUBLIC) regNo = this.registrationNo.value;
    const jwtToken = jwtDecode<JWTPayload>(token);
    try {
      if (jwtToken && jwtToken.gosiscp !== undefined && jwtToken.gosiscp.trim() !== 'NOT_FOUND')
        roles = this.getAllRoles(
          this.tokenService.getEntitlements()?.filter(item => (regNo ? Number(item.establishment) === regNo : true))
        );
      return roles;
    } catch (error) {
      return roles;
    }
  }
  /**
   * Method to get location from jwt token
   */
  getLocation() {
    const token = this.tokenService.getAuthToken();
    let location = '';
    if (!token) return location;
    const jwtToken = jwtDecode<JWTPayload>(token);
    try {
      if (jwtToken && jwtToken.location !== undefined) location = jwtToken.location.length > 0 ? jwtToken.location : '';
      return location;
    } catch (error) {
      return location;
    }
  }

  isUserEntitled(userRoles: RoleIdEnum[], establishmentRegNo?: number): boolean {
    if (this.getApplicationAuthorizationStatus()) return true;
    const token = this.tokenService.getAuthToken();
    const jwtToken = jwtDecode<JWTPayload>(token);
    try {
      if (jwtToken && jwtToken.gosiscp !== undefined && jwtToken.gosiscp.trim() !== 'NOT_FOUND') {
        const roles = this.getUserEntitledRoles(jwtToken, establishmentRegNo);
        return roles?.filter(role => userRoles?.indexOf(+role) !== -1)?.length > 0;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  getUserEntitledRoles(jwtToken: JWTPayload, establishmentRegNo?: number): string[] {
    const jwtRoles = this.tokenService.getEntitlements();
    if (jwtToken.domain === Channel.PRIVATE_DOMAIN) {
      const internalRoles: string[] = this.getAllRoles(jwtRoles);
      return internalRoles;
    } else {
      const roles = establishmentRegNo
        ? jwtRoles?.filter(item => {
            const hasAccess = item.establishment.toString() === establishmentRegNo.toString();
            return hasAccess;
          })
        : jwtRoles;
      const externalEligibleRoles: string[] = this.getAllRoles(roles);
      return externalEligibleRoles;
    }
  }

  getAllRoles(roles: GosiScope[]): string[] {
    return roles
      ?.map(item => item.role)
      ?.reduce((agg, roleArr) => {
        return agg.concat(...roleArr);
      }, [])
      ?.map(r => r.toString());
  }

  getAuthorizationStatus(): boolean {
    return this.getApplicationAuthorizationStatus();
  }
  private getApplicationAuthorizationStatus(): boolean {
    return this.environment.disableAuth;
  }

  getDefaultNavigation(routeList: DefaultRoute[]) {
    const roles: number[] = this.getRoles().map(item => Number(item));
    const currentRoute = routeList.find(item => {
      if (item.isNegate) return !roles.some(e => item.roles.includes(e));
      else return roles.some(e => item.roles.includes(e));
    });
    return currentRoute.url;
  }

  checkMenuItemPermission(url: string) {
    const domainJson = require(`../../assets/jsons/domain.json`); // getting the urlItems varaible from the json file
    const domainRoute: DomainRoute[] = domainJson.urlItems.map(item => new DomainRoute().fromJsonToObject(item)); //array that contains all domain json indexes and its values
    if (url) {
      if (url.includes('/home/')) url = url.replace('/home/', '');
      else if (url.includes('/dashboard/')) url = url.replace('/dashboard/', '');
      const domain = url.slice(0, url.indexOf('/'));
      const domainData = domainRoute.find(item => item.type === domain);
      if (domainData && !domainData.isEstablishmentRequired && !domainData.isVicRequired) return domainData;
      else if (domainData && domain) {
        url = url.replace(`${domain}`, '');
        const domainUrlJson = require(`../../assets/jsons/${domain}.json`);
        const domainUrl: DomainUrl[] = domainUrlJson.urlItems.map(item => new DomainUrl().fromJsonToObject(item));
        const domainUrlMatch = domainUrl.find(item => {
          const matchUrl = url.match(new RegExp(item.url));
          return matchUrl && url === matchUrl[0];
        });
        return domainUrlMatch;
      } else return;
    }
  }
}
