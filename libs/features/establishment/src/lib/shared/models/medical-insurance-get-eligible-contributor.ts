/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { MedicalInsuranceContributorDto } from '@gosi-ui/features/establishment/lib/shared/models/medical-insurance-contributor-dto';

export class MedicalInsuranceSubscribersList {
  contributors: MedicalInsuranceContributorDto[] = [];
  numberOfContributors: number = undefined;
  pageNo: number = undefined;
  pageSize: number = undefined;
}
