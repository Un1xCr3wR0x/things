/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EstablishmentStatusEnum } from '@gosi-ui/core';
import { Establishment, EstablishmentQueryKeysEnum } from '../../../shared';
import { EstablishmentProfileScComponent } from './establishment-profile-sc.component';

export const getTerminateStatus = (self: EstablishmentProfileScComponent, establishment: Establishment) => {
  if (
    (establishment?.status?.english === EstablishmentStatusEnum.REGISTERED ||
      establishment?.status?.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS ||
      establishment?.status?.english === EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS) &&
    self.isEligibleUserMof &&
    establishment.outOfMarket === true
  ) {
    self.terminateService
      .terminateEstablishment(establishment.registrationNo, null, [
        {
          queryKey: EstablishmentQueryKeysEnum.MODE,
          queryValue: EstablishmentQueryKeysEnum.DRAFT_MODE
        }
      ])
      .subscribe(
        status => {
          self.terminateStatus = status;
        },
        error => {
          self.alertService.showError(error?.error?.message, error?.error?.details);
        }
      );
  }
};
