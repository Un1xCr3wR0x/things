/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/** Index file is used to export all the components inside this folder. */

import { CallbackScComponent } from './callback-sc/callback-sc.component';
import { CallbackUpdatedScComponent } from './callback-updated-sc/callback-updated-sc.component';

export const CORE_COMPONENTS = [CallbackScComponent, CallbackUpdatedScComponent];

export * from './callback-sc/callback-sc.component';
export * from './callback-updated-sc/callback-updated-sc.component';
