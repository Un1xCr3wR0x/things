/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/** The index file is used to export all the components inside this folder. */
import { AuthorizeAdminGuard } from './authorize-admin-guard';
import { LoginGuard } from './login.guard';
import { LoginGuardTmp } from './login.guard-tmp';
import { NavigationGuard } from './navigation.guard';
import { PermissionGuard } from './permission.guard';
import { SystemGuard } from './system.guard';
import { TransactionStateGuard } from './transaction-state-guard';
export const CORE_GUARDS = [
  NavigationGuard,
  LoginGuard,
  LoginGuardTmp,
  PermissionGuard,
  AuthorizeAdminGuard,
  TransactionStateGuard,
  SystemGuard
];

export * from './authorize-admin-guard';
export * from './login.guard';
export * from './login.guard-tmp';
export * from './navigation.guard';
export * from './permission.guard';
export * from './system.guard';
export * from './transaction-state-guard';
