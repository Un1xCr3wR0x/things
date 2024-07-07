/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from "@gosi-ui/core";
import { FilterDate } from "@gosi-ui/features/establishment/lib/shared";


export class ContributorDetailsFilter {
    joiningDate: FilterDate = new FilterDate();
    leavingDate: FilterDate = new FilterDate();
    // gender: BilingualText = new BilingualText();
    gender:string;
    nationalityList: Array<BilingualText>= undefined;
    occupationList: Array<BilingualText>= undefined;
    wageRangeStart:number;
    wageRangeEnd:number;
  }
