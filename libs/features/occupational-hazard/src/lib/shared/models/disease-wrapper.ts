import { OccupationDetails } from './occupation';
import { Disease, ReopenDisease } from './disease-details';


/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class DiseaseWrapper {
  diseaseDetailsDto: Disease = new Disease();
  diseaseOccupationDurationDto: OccupationDetails[];
  transferredInjuryid: number;
  isTransferredInjury: boolean;
  injuryNo: number;
  diseaseId: number;
  reOpenDiseaseDto: ReopenDisease = new ReopenDisease();
  transactionMessage: string;
  status: string;

}
