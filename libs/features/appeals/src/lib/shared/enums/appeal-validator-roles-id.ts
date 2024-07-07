/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum AppealValidatorRolesNumber {
  IS_reviewer_private = 202, // Reviewer 1.1
  IS_reviewer_public = 203, // Reviewer 1.2
  
  Legal_reviewer_private = 204, // Approver 1.1
  Legal_reviewer_public = 205, // Approver 1.2

  Legal_auditor_private = 206, // Approver 2.1
  Legal_auditor_public = 207, // Approver 2.2
  
  Legal_manager_private = 208, // Approver 3.1
  Legal_manager_public = 209, // Approver 3.2
  Entities_specialist_public = 210, // Specialist
  Establishments_specialist_private = 211, // Specialist  
  Establishments_specialist_violation = 212, // Specialist
  OH_and_pensions_specialist_private = 213, // Specialist
  OH_and_pensions_specialist_violation = 214, // Specialist
  Individual_collection_specialist_public = 215, // Specialist
  Individuals_preparation_specialist_private = 216, // Specialist
  Individuals_preparation_specialist_public = 217, // Specialist
  Individuals_preparation_specialist_violation = 218, // Specialist
  Private_collection_specialist_private = 219, // Specialist
  Private_collection_specialist_violation = 220, // Specialist
  Public_collection_specialist_public = 221, // Specialist
  Preparation_team_private = 222, // Preparation 1.1
  Preparation_team_public = 223, // Preparation 1.2
  Preparation_team_violation = 224, // Preparation 1
  Appeal_clerk_private = 225, // Appeal clerk 1.1
  Appeal_clerk_public = 226, // Appeal clerk 1.2
  Appeal_clerk_violation = 227, // Appeal clerk 1
  Committee_secretary_private = 228, // Committee secretary 1.1
  Committee_secretary_public = 229, // Committee secretary 1.2
  Committee_secretary_violation = 230, // Committee secretary 1
  Executor_private = 231, // Executor 1.1
  Executor_public = 232, // Executor 1.2
  AOV_Reviewer = 171,
  AOV_Approver_1 = 172,
  AOV_Approver_2 = 173,
  AOV_Approver_3 = 174,
  AOV_Executer = 175
}
