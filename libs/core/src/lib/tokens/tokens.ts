/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  EstablishmentRouterData,
  RouterData,
  Environment,
  MenuItem,
  RegistrationNumber,
  ContributorTokenDto
} from '../models';
import { ApplicationTypeEnum } from '../enums';

/**
 * Various InjectionTokens shared across all platforms
 * Always suffix with 'Token' for clarity and consistency
 */
export const LanguageToken = new InjectionToken<BehaviorSubject<string>>('lang');
export const EnvironmentToken = new InjectionToken<Environment>('environment');
export const ApplicationTypeToken = new InjectionToken<ApplicationTypeEnum>('applicationType');
export const SideMenuStateToken = new InjectionToken<BehaviorSubject<boolean>>('sideMenuState');

export const RouterDataToken = new InjectionToken<RouterData>('routerDataToken');
export const EstablishmentToken = new InjectionToken<EstablishmentRouterData>('establishmentToken');
export const CurrencyToken = new InjectionToken<BehaviorSubject<string>>('currency');
export const MenuToken = new InjectionToken<MenuItem[]>('menuToken');
export const RegistrationNoToken = new InjectionToken<RegistrationNumber>('registrationNo');
export const ContributorToken = new InjectionToken<ContributorTokenDto>('contributorToken');
