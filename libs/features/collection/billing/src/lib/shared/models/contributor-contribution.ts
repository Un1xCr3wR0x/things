import { ContributorShare } from './contributor-share';
import { EstablishmentShare } from './establishment-share';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ContributorContribution {
  contributorShare: ContributorShare = new ContributorShare();
  establishmentShare: EstablishmentShare = new EstablishmentShare();
  total: number = undefined;
}
