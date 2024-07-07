/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HeirStatus } from '../enum/heir-status';

export const DependentTransactionIdValidator = {
  [HeirStatus.HOLD]: 'HOLD_DEPENDENTS',
  [HeirStatus.STOP]: 'STOP_DEPENDENTS',
  [HeirStatus.RESTART]: 'RESTART_DEPENDENTS',
  [HeirStatus.START_WAIVE]: 'START_BENEFIT_WAIVE_PENSION',
  [HeirStatus.STOP_WAIVE]: 'STOP_BENEFIT_WAIVE_PENSION'
};

export const DependentTransactionId = {
  [HeirStatus.HOLD]: '302032',
  [HeirStatus.STOP]: '302033',
  [HeirStatus.RESTART]: '302034',
  [HeirStatus.START_WAIVE]: '302035',
  [HeirStatus.STOP_WAIVE]: '302036'
};

export const HeirTransactionIdValidator = {
  [HeirStatus.HOLD]: 'HOLD_HEIRS',
  [HeirStatus.STOP]: 'STOP_HEIRS',
  [HeirStatus.RESTART]: 'RESTART_HEIRS',
  [HeirStatus.START_WAIVE]: 'START_BENEFIT_WAIVE_HEIR',
  [HeirStatus.STOP_WAIVE]: 'STOP_BENEFIT_WAIVE_HEIR'
};

export const HeirTransactionId = {
  [HeirStatus.HOLD]: '302037',
  [HeirStatus.STOP]: '302039',
  [HeirStatus.RESTART]: '302038',
  [HeirStatus.START_WAIVE]: '302040',
  [HeirStatus.STOP_WAIVE]: '302041'
};
