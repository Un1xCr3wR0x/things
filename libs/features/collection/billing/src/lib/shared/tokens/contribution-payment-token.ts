/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { InjectionToken } from '@angular/core';
import { ContributionPaymentRouterData } from '../models/contribution-payment-router-data';

export const ContributionPaymentToken = new InjectionToken<ContributionPaymentRouterData>('contributionPaymentToken');
