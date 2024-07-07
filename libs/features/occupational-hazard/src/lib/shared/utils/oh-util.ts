/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const deepCopy = function <T extends object>(source: T): T {
    return JSON.parse(JSON.stringify(source));
  };
