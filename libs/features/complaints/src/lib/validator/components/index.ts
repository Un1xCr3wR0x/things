/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComplaintScComponent } from './complaint-sc/complaint-sc.component';
import { SuggestionScComponent } from './suggestion-sc/suggestion-sc.component';
import { AppealScComponent } from './appeal-sc/appeal-sc.component';

export const VALIDATOR_COMPONENTS = [ComplaintScComponent, SuggestionScComponent, AppealScComponent];

export * from './complaint-sc/complaint-sc.component';
export * from './suggestion-sc/suggestion-sc.component';
export * from './base/validator-base-sc.component';
export * from './appeal-sc/appeal-sc.component';
