/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AnnuityBenefitRequest } from './annuity-benefit-request';
import { DependentDetails } from './dependent-details';

export class FuneralGrantSubmit extends AnnuityBenefitRequest {
  beneficiaryDetails: DependentDetails;
}
