/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum AppealValidatorRoles {
  // Old Rols
  AOV_REVIEWER = 'AOVReviewer', //First level validator in field office
  AOV_APPROVER_1 = 'AOVApprover1', //Second level validator in field office
  AOV_APPROVER_2 = 'AOVApprover2',
  AOV_APPROVER_3 = 'AOVApprover3',
  AOV_EXECUTER = 'AOVExecuter',

  // New Role
  IS_REVIEWER_VIOLATION = 'ISreviewerviolation',
  Legal_Reviewer_Violation = 'legalreviewerviolation',
  Legal_Auditor_Violation = 'legalauditorviolation',
  Legal_Manger_Violation = 'legalmangerviolation',
  Executor_Violation = 'executorviolation',
  Preparation_Team_Violation = 'preparationteamviolation',
  Appeal_Clerk_Violation = 'appealclerkviolation',
  Committee_secretary_violation = 'Committeesecretaryviolation',

  /**Specialists */
  Establishments_specialist_violation = 'Establishmentsspecialistviolation', // 212 specialist
  OH_and_pensions_specialist_violation = 'O.Handpensionsspecialistviolation', // 214 specialist
  Individuals_Preparation_Specialist_Violation = 'Individualspreparationspecialistviolation',
  Private_Collection_Specialist_Violation = 'Privatecollectionspecialistviolation'
}

export enum AppealValidatorSpecialistsRoles {
  Establishments_specialist_violation = 'Establishmentsspecialistviolation', // 212 specialist
  OH_and_pensions_specialist_violation = 'O.Handpensionsspecialistviolation', // 214 specialist
  Individuals_Preparation_Specialist_Violation = 'Individualspreparationspecialistviolation',
  Private_Collection_Specialist_Violation = 'Privatecollectionspecialistviolation'
}
