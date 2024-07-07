/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {CommitmentIndicatorDcComponent} from './commitment-indicator-dc/commitment-indicator-dc.component'
import {CommitmentIndicatorScComponent} from './commitment-indicator-sc/commitment-indicator-sc.component'
import {CommitmentIndicatorHistoryDcComponent} from './commitment-indicator-history-dc/commitment-indicator-history-dc.component'

export const COMMITMENT_INDICATOR_COMPONENTS = [
    CommitmentIndicatorDcComponent,
    CommitmentIndicatorScComponent,
    CommitmentIndicatorHistoryDcComponent
];

export * from './commitment-indicator-sc/commitment-indicator-sc.component';
export * from './commitment-indicator-dc/commitment-indicator-dc.component';
export * from './commitment-indicator-history-dc/commitment-indicator-history-dc.component';
