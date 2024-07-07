/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum InjuryStatus {
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  UNDER_INSPECTION = 'Under Inspection', //1001,
  REGISTERED = 'Registered', //1002,
  CURED_WITH_DISABILITY = 'Cured With Disability',
  CURED_WITHOUT_DISABILITY = 'Cured Without Disability',
  CLOSED_BECAUSE_OF_DISCONTINUING_TREATMENT = 'Closed because of discontinuing treatment',
  RESULTED_IN_DEATH = 'Resulted in Death',
  CLOSED = 'Closed',
  CLOSED_WITHOUT_CONTINUING_TREATMENT = 'Closed without continuing treatment',
  EXTENSION_REQUIRED = 'Extension Required'
}
