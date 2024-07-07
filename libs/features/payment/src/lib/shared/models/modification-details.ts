/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BeforeModificationModify } from './before-modification-modify';
import { AfterModificationModify } from './after-modification-modify';
export class ModificationDetails {
  beforeModification: BeforeModificationModify;
  afterModification: AfterModificationModify;
  notes: string;
}
