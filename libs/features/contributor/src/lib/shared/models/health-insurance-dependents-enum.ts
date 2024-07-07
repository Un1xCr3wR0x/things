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
 * @class DependentsRuleEnum
 */
export class DependentsRuleEnum {
  static readonly parentsRule: DependentsRule= new DependentsRule(1,"الوالدين","Parents");
  static readonly childrenRule: DependentsRule= new DependentsRule(2,"الأبناء","Children");
  static readonly wifeRule: DependentsRule= new DependentsRule(3,"الزوجة","Wife");
  static readonly husbandRule: DependentsRule= new DependentsRule(4,"الزوج","Husband");


}


