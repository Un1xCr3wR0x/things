/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum AppealValidatorRoles {
  IS_reviewer_private = 'IS reviewer private', //202 Reviewer 1.1
  IS_reviewer_public = 'IS reviewer public', // 203 Reviewer 1.2

  Legal_reviewer_private = 'legal reviewer private', // 204 Approver 1.1
  Legal_reviewer_public = 'legal reviewer public', // 205 Approver 1.2

  Legal_auditor_private = 'legal auditor private', //206 Approver 2.1
  Legal_auditor_public = 'legal auditor public', // 207` Approver 2.2

  Legal_manager_private = 'legal manger private', // 208 Approver 3.1
  Legal_manager_public = 'legal manger public', // 209 Approver 3.2

  Preparation_team_private = 'preparation team private', // 222 Preparation 1.1
  Preparation_team_public = 'preparation team public', // 223 Preparation 1.2

  Preparation_team_violation = 'preparation team violation', // 224 Preparation 1
  Appeal_clerk_private = 'appeal clerk private', // 225 Appeal clerk 1.1
  Appeal_clerk_public = 'appeal clerk public', // 226 Appeal clerk 1.2
  Appeal_clerk_violation = 'appeal clerk violation', // 227 Appeal clerk 1
  Committee_secretary_private = 'Committee secretary private', // 228 Committee secretary 1.1
  Committee_secretary_public = 'Committee secretary public', // 229 Committee secretary 1.2
  Committee_secretary_violation = 'Committee secretary violation', // 230 Committee secretary 1
  Executor_private = 'executor private', // 231 Executor 1.1
  Executor_public = 'executor public', // 232 Executor 1.2
  Entities_specialist_public = 'Entities specialist public', // 210 specialist
  Establishments_specialist_private = 'Establishments specialist private', // 211 specialist
  Establishments_specialist_violation = 'Establishments specialist violation', // 212 specialist
  OH_and_pensions_specialist_private = 'O.H and pensions specialist private', // 213 specialist
  OH_and_pensions_specialist_violation = 'O.H and pensions specialist violation', // 214 specialist
  Individual_collection_specialist_public = 'Individual collection specialist public', // 215 specialist
  Individuals_preparation_specialist_private = 'Individuals preparation specialist private', // 216 specialist
  Individuals_preparation_specialist_public = 'Individuals preparation specialist public', // 217 specialist
  Individuals_preparation_specialist_violation = 'Individuals preparation specialist violation', // 218 specialist
  Private_collection_specialist_private = 'Private collection specialist private', // 219 specialist
  Private_collection_specialist_violation = 'Private collection specialist violation', // 220 specialist
  Public_collection_specialist_public = 'public collection specialist public', // 221 specialist
  AOV_Reviewer = 'AOV Reviewer',
  AOV_Approver_1 = 'AOV Approver 1',
  AOV_Approver_2 = 'AOV Approver 2',
  AOV_Approver_3 = 'AOV Approver 3',
  AOV_Executer = 'AOV Executer'
}

export enum AppealSpecialistRoles {
  Entities_specialist_public = 'Entities specialist public', // 210 specialist
  Establishments_specialist_private = 'Establishments specialist private', // 211 specialist
  Establishments_specialist_violation = 'Establishments specialist violation', // 212 specialist
  OH_and_pensions_specialist_private = 'O.H and pensions specialist private', // 213 specialist
  OH_and_pensions_specialist_violation = 'O.H and pensions specialist violation', // 214 specialist
  Individual_collection_specialist_public = 'Individual collection specialist public', // 215 specialist
  Individuals_preparation_specialist_private = 'Individuals preparation specialist private', // 216 specialist
  Individuals_preparation_specialist_public = 'Individuals preparation specialist public', // 217 specialist
  Individuals_preparation_specialist_violation = 'Individuals preparation specialist violation', // 218 specialist
  Private_collection_specialist_private = 'Private collection specialist private', // 219 specialist
  Private_collection_specialist_violation = 'Private collection specialist violation', // 220 specialist
  Public_collection_specialist_public = 'public collection specialist public' // 221 specialist
}
