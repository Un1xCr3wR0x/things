

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';

export class ParticipantSpeciality {
  specialitynumber: number[] = [] ; 
  subSpecialitynumber:  number[] = [];
  primarySpeciality:  BilingualText[] = [];
  fieloffice:BilingualText[] = [];
  noOfDaysInQueueparticipant: number[] = [] ; 
  assessmentType:BilingualText[] = [];
  identityNumber: string[] = [] ; 
  location: BilingualText[] = [];
  mobileNumber: string[] = [];
  participantId: number[] = [];
  name: BilingualText[] = [];
  pageNo: number = undefined;
  pageSize: number = undefined;
}
export class DropDownItems {
  id?: number | string = undefined;
  key?: string = undefined;
  value?: BilingualText = new BilingualText();
  subValue?: BilingualText = new BilingualText();
  icon?: string = undefined;
  iconType?: string = undefined;
  disabled?: boolean = undefined;
  toolTipValue?: string | number = undefined;
  toolTipParam?: string | number = undefined;
  url?: string = undefined;
  constructor(key?: string, icon?: string) {
    if (key && icon) {
      this.key = key;
      this.id = key;
      this.icon = icon;
      this.disabled = false;
    }
  }
}
