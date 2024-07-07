/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class CommonPatch {
  navigationIndicator: number = undefined;
  comments: string = undefined;
  contentIds? = []; //for multiple pages
  referenceNo?: number = undefined;
  uuid?: string; //only for single page transaction
}
