/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export function getState(state) {
  if (state === 'ASSIGNED') {
    return 'TEAM-MANAGEMENT.ASSIGNED';
  } else if (state === 'RETURN') {
    return 'TEAM-MANAGEMENT.RETURNED';
  } else if (state === 'REASSIGNED') {
    return 'TEAM-MANAGEMENT.REASSIGNED';
  } else if (state === 'SUSPENDED') {
    return 'TEAM-MANAGEMENT.ON_HOLD';
  } else {
    return state;
  }
}
