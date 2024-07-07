/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Complication } from './complication';
export class ComplicationWrapper {
  complicationDetailsDto: Complication = new Complication();
  modifiedComplicationDetails: Complication = new Complication();
  establishmentRegNo: number = undefined;
}
