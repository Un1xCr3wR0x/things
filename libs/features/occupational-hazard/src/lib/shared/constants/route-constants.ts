/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RouterConstants } from '@gosi-ui/core';

export class RouteConstants {
  public static get ROUTE_REPORT_TYPE(): string {
    return 'home/oh/report';
  }

  public static get ROUTE_COMPLICATION(): string {
    return '/home/oh/complication/add';
  }
  public static get ROUTE_INJURY_ADD(): string {
    return 'home/oh/injury/add';
  }

  public static get ROUTE_ADD_DISEASE(): string {
    return 'home/oh/disease/add';
  }
  public static get ROUTE_ADD_GROUP_INJURY(): string {
    return 'home/oh/group-injury/add';
  }


  public static ROUTE_VIEW_DISEASE(regNo, sin, diseaseId): string {
    return `home/oh/view/${regNo}/${sin}/${diseaseId}/disease/info`;
  }

  public static get ROUTE_VALIDATOR_INJURY(): string {
    return 'home/oh/validator/injury';
  }

  public static get ROUTE_VALIDATOR_DISEASE(): string {
    return 'home/oh/validator/disease';
  }
  public static get ROUTE_MODIFY_CLOSE_DISEASE(): string {
    return 'home/oh/validator/modify-close-disease';
  }

  public static get ROUTE_REOPEN_DISEASE(): string {
    return 'home/oh/disease/re-open';
  }

  public static get ROUTE_INJURY_EDIT(): string {
    return 'home/oh/injury/edit';
  }
  public static get ROUTE_DISEASE_EDIT(): string {
    return 'home/oh/disease/edit';
  }

  public static get ROUTE_VALIDATOR_REJECT_INJURY(): string {
    return 'home/oh/validator/reject-injury';
  }
  public static get ROUTE_VALIDATOR_REJECT_DISEASE(): string {
    return 'home/oh/validator/reject-disease';
  }
  public static get ROUTE_REJECT_INJURY(): string {
    return 'home/oh/reject-injury';
  }

  public static get ROUTE_COMPLICATION_REJECT(): string {
    return 'home/oh/complication/reject';
  }
  public static get ROUTE_INJURY_REJECT(): string {
    return 'home/oh/injury/reject';
  }
  public static get ROUTE_DISEASE_REJECT(): string {
    return 'home/oh/disease/reject';
  }
  public static get ROUTE_REJECT_COMPLICATION(): string {
    return 'home/oh/reject-complication';
  }
  public static get ROUTE_VALIDATOR_REJECT_COMPLICATION(): string {
    return 'home/oh/validator/reject-complication';
  }
  public static get ROUTE_VALIDATOR_REOPEN_INJURY(): string {
    return 'home/oh/validator/reopen-injury';
  }
  public static get ROUTE_VALIDATOR_REOPEN_COMPLICATION(): string {
    return 'home/oh/validator/reopen-complication';
  }
  public static get ROUTE_VALIDATOR_MODIFY_INJURY(): string {
    return 'home/oh/validator/modify-injury';
  }
  public static get ROUTE_VALIDATOR_MODIFY_DISEASE(): string {
    return 'home/oh/validator/modify-disease';
  }
  public static get ROUTE_VALIDATOR_CLOSE_INJURY(): string {
    return 'home/oh/validator/close-injury';
  }
  public static get ROUTE_VALIDATOR_CLOSE_COMPLICATION(): string {
    return 'home/oh/validator/close-complication';
  }
  public static get ROUTE_VALIDATOR_MODIFY_COMPLICATION(): string {
    return 'home/oh/validator/modify-complication';
  }
  public static get ROUTE_VALIDATOR_COMPLICATION(): string {
    return 'home/oh/validator/complication';
  }
  public static get ROUTE_VALIDATOR_DISEASE_COMPLICATION(): string {
    return 'home/oh/validator/disease-complication';
  }
  public static get ROUTE_ALLOWANCE(): string {
    return 'home/oh/validator/allowance';
  }
  public static get ROUTE_REPATRIATION(): string {
    return 'home/oh/validator/repatriation';
  }
  public static get HOLD_ALLOWANCE(): string {
    return 'home/oh/validator/hold-allowance';
  }
  public static get REIMBURSEMENT_CLAIM(): string {
    return 'home/oh/validator/reimbursement';
  }
  public static get VALIDATE_REIMBURSEMENT_CLAIM(): string {
    return 'home/oh/validator/validate-reimbursement';
  }

  public static get RESUME_ALLOWANCE(): string {
    return 'home/oh/validator/resume-allowance';
  }
  public static get ROUTE_ALLOWANCE_PAYEE(): string {
    return 'home/oh/validator/allowance-payee';
  }
  public static get ROUTE_OH_CLAIMS(): string {
    return 'home/oh/validator/oh-claims';
  }
  public static get ROUTE_OH_AUDITOR(): string {
    return 'home/oh/validator/auditor';
  }
  public static get ROUTE_OH_ALLOWANCE_AUDITOR(): string {
    return 'home/oh/validator/allowance-audit';
  }
  public static get ROUTE_COMPLICATION_EDIT(): string {
    return 'home/oh/complication/edit';
  }
  public static get ROUTE_DISEASE_COMPLICATION_EDIT(): string {
    return 'home/oh/complication/disease-edit';
  }
  public static get ROUTE_INJURY_MODIFY(): string {
    return 'home/oh/injury/modify';
  }
  public static get ROUTE_DISEASE_MODIFY(): string {
    return 'home/oh/disease/modify';
  }
  public static get ROUTE_INJURY_CLOSE(): string {
    return 'home/oh/injury/close';
  }
  public static get ROUTE_COMPLICATION_CLOSE(): string {
    return 'home/oh/complication/close';
  }
  public static get ROUTE_COMPLICATION_MODIFY(): string {
    return 'home/oh/complication/modify';
  }
  public static get ROUTE_INJURY_REOPEN(): string {
    return 'home/oh/injury/reopen';
  }
  public static get ROUTE_COMPLICATION_REOPEN(): string {
    return '/home/oh/complication/re-open';
  }
  public static get ROUTE_ADD_COMPLICATION_REPORT(): string {
    return 'home/oh/complication/add';
  }
  public static get ROUTE_INBOX(): string {
    return RouterConstants.ROUTE_INBOX;
  }
  public static get ROUTE_INBOX_PUBLIC(): string {
    return RouterConstants.ROUTE_TODOLIST;
  }
  public static EST_PROFILE_ROUTE(regNo: number): string {
    return `/home/establishment/profile/${regNo}/view`;
  }

  public static EST_PROFILE_ADMIN_ROUTE(regNo: number, adminId: number): string {
    return `/home/establishment/profile/${regNo}/user/${adminId}`;
  }
  public static get ROUTE_OH_MEDICAL_ALLOWANCE(): string {
    return 'home/oh/validator/audit-allowance';
  }
  public static get ROUTE_CONTRIBUTOR_REASSESSMENT(): string {
    return '/home/oh/reassessment/contributor-assessment';
  }
  public static get ROUTE_EARLY_REASSESSMENT(): string {
    return 'home/oh/validator/earlyreassessment';
  }
  public static get ROUTE_INJURY_APPEAL(): string {
    return 'home/oh/injury/appeal';
  }
  public static get ROUTE_EARLY_REASSESSMENT_CONTRIBUTOR(): string {
    return '/home/oh/reassessment/early-reassessment';
  }
  public static get ROUTE_INJURY_APPEAL_INFO(): string {
    return 'home/oh/injury/view-appeal';
  }
  public static get RouteConveyanceAllowanceMB(): string {
    return '/home/oh/validator/mb-conveyance-allowance';
  }
  public static get ROUTE_NEW_MEDICAL_REPORTS(): string {
    return '/home/oh/validator/mb-request-new-reports';
  }
  public static get ROUTE_VALIDATOR_MBASSESSMENT(): string {
    return 'home/oh/validator/close-injury/mbassessment';
  }
  public static get ROUTE_INJURY_REPATRIATION(): string {
    return 'home/oh/injury/repatriation';
  }
}
