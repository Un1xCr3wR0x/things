/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CanDeactivate } from '@angular/router';
import { IndividualWageUpdateScComponent } from '../../manage-wage/components/individual-wage';

export class ConfirmDeactivateGuard implements CanDeactivate<IndividualWageUpdateScComponent> {
  canDeactivate(target: IndividualWageUpdateScComponent) {
    if (target.canDeactivate && target.hasChanges()) {
      target.showTemplate(target.cancelTemplate2);
      return false;
    } else {
      return true;
    }
  }
}
