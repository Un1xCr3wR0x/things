/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


import {DependentsRule} from "@gosi-ui/features/contributor/lib/shared/models/health-insurance-dependents-rule";

/**
 * The wrapper class for Insurance Classes in compliance response
 *
 * @export
 * @class DependentsRuleNin
 */
export class DependentsRuleNin {
  NIN:number
  rule:DependentsRule[];
}


