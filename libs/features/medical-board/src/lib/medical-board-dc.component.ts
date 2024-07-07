/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  MedicalboardAssessmentService,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions
} from '@gosi-ui/core';
import { MbRouteConstants } from './shared/constants';

@Component({
  selector: 'mb-medical-board-dc',
  templateUrl: './medical-board-dc.component.html',
  styleUrls: ['./medical-board-dc.component.scss']
})
export class MedicalBoardDcComponent implements OnInit {
  fromOh = false;
  constructor(
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly medicaAssessmentService: MedicalboardAssessmentService
  ) {}

  ngOnInit() {
    this.fromOh = this.medicaAssessmentService.getIsFromOh();
    if (!this.fromOh) {
      if (
        this.routerData.assignedRole === Role.MEDICAL_MANAGER ||
        this.routerData.assignedRole === Role.MEDICAL_MANAGER_SPACE
      ) {
        //Validator View
        this.routeToValidatorView(this.routerData.resourceType);
      } else if (
        this.routerData.assignedRole === Role.CONTRIBUTOR &&
        (this.routerData.resourceType === RouterConstants.CLARIFICATION_FROM_CONTRIBUTOR ||
          this.clarificationContributorFlow(this.routerData))
      ) {
        this.routeToContributor();
      } else if (this.reAssignRequestClarificationMB(this.routerData)) {
        this.router.navigate([MbRouteConstants.ROUTE_CONTRIBUTOR_CLARIFICATION]);
      }
      //Non validator flow
      else {
        if (
          this.routerData.assignedRole === Role.MEDICAL_OFFICER ||
          this.routerData.assignedRole === Role.MS_OFFICER ||
          this.routerData.assignedRole === Role.MEDICAL_BOARD_OFFICER ||
          this.routerData.assignedRole === Role.MB_OFFICER ||
          this.routerData.assignedRole === Role.MBO ||
          this.routerData.assignedRole === Role.APPEAL_OFFICER ||
          this.routerData.assignedRole === Role.APPEAL_MEDICAL_BOARD_OFFICER
        ) {
          this.routeToVisitingDoctorEdit(this.routerData.resourceType);
        } else if (
          (this.routerData.assignedRole === Role.OH_DOCTOR || this.routerData.assignedRole === Role.GOSI_DOCTOR_CAPS) &&
          this.routerData.resourceType !== RouterConstants.TRANSACTION_EARLY_REASSESSMENT
        ) {
          this.routeToVisitingDoctor(this.routerData.resourceType);
        } else if (
          this.routerData.assignedRole === Role.HO_DOCTOR ||
          this.routerData.assignedRole === Role.HO_OFFICER ||
          this.routerData.assignedRole === Role.HEAD_GOSI_DOCTOR ||
          this.routerData.assignedRole === Role.HEAD_OFFICE_GOSI_DOCTOR
        ) {
          this.routeToValidateAssessment();
        } else if (
          this.routerData.assignedRole === Role.CONTRACT_DOCTOR ||
          this.routerData.assignedRole === Role.CONTRACTED_DOCTOR ||
          this.routerData.assignedRole === Role.CONTRACT_DOC
        ) {
          this.routeToEsignWorkitem();
        }
      }
    }
  }

  /** Method to handle validator routing. */
  routeToValidatorView(type: string) {
    switch (type) {
      case RouterConstants.TRANSACTION_ADD_MEMBER:
        this.router.navigate([MbRouteConstants.ROUTE_VALIDATOR_ADD_MEMBER]);
        break;
      case RouterConstants.TRANSACTION_MODIFY_CONTRACT:
        this.router.navigate([MbRouteConstants.ROUTE_VALIDATOR_MODIFY_CONTRACT]);
        break;
      case RouterConstants.TRANSACTION_TERMINATE_CONTRACT:
        this.router.navigate([MbRouteConstants.ROUTE_VALIDATOR_TERMINATE_CONTRACT]);
        break;
      default:
    }
  }

  clarificationContributorFlow(routerData) {
    const payload = JSON.parse(routerData.payload);
    if (routerData.assignedRole !== Role.CONTRIBUTOR) return false;
    if (
      payload?.previousOutcome === WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR ||
      payload?.previousOutcome === WorkFlowActions.REQUEST_MEDICAL_REPORTS
    ) {
      switch (routerData?.resourceType) {
        case RouterConstants.TRANSACTION_CLOSE_INJURY:
        case RouterConstants.TRANSACTION_CLOSE_COMPLICATION:
        case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
        case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
        case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
        case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
        case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
        case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
        case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
          return true;
        default:
          return false;
      }
    }
  }

  /** Method to route add member for return. */
  routeToAddMemberEdit() {
    this.router.navigate([MbRouteConstants.ROUTE_ADD_MEDICAL_MEMBERS_EDIT]);
  }
  routeToVisitingDoctorEdit(type: string) {
    switch (type) {
      case RouterConstants.TRANSACTION_MB_DISABILITY_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_ASSIGN_APPEAL:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_MBO:
        this.routeToDisabilityAssessment();
        break;
      case RouterConstants.TRANSACTION_MB_APPOINTMENT_REMINDER:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR:
        this.routeToReturnDisabilityAssessment();
        break;
      case RouterConstants.TRANSACTION_ASSIGN_TO_HO:
        this.routeToReturnDisabilityAssessment();
        break;
      case RouterConstants.ASSIGN_PARTICIPANT_TO_SESSION:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.MB_CONVEYANCE_ALLOWANCE:
        this.routeToReturnDisabilityAssessment();
        break;
      case RouterConstants.MB_BENEFIT_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      default:
        this.routeToAddMemberEdit();
    }
  }
  routeToMBOfficer(type) {
    switch (type) {
      case RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_MBO:
        this.routeToDisabilityAssessment();
        break;
      case RouterConstants.TRANSACTION_MB_APPOINTMENT_REMINDER:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR:
        this.routeToReturnDisabilityAssessment();
        break;
      case RouterConstants.TRANSACTION_ASSIGN_TO_HO:
        this.routeToReturnDisabilityAssessment();
        break;
    }
  }
  routeToDisabilityAssessment() {
    this.router.navigate([MbRouteConstants.ROUTE_MEDICAL_SESSION]);
  }
  routeToValidateAssessment() {
    this.router.navigate([MbRouteConstants.ROUTE_GOSI_DOCTOR_VIEW]);
  }
  routeToContributorClarification() {
    this.router.navigate([MbRouteConstants.ROUTE_CONTRIBUTOR_CLARIFICATION]);
  }
  routeToEsignWorkitem() {
    this.router.navigate([MbRouteConstants.ROUTE_E_SIGN]);
  }
  routeToContributor() {
    this.router.navigate([MbRouteConstants.ROUTE_CONTRIBUTOR_CLARIFICATION]);
  }
  routeToReturnDisabilityAssessment() {
    if (this.routerData) {
      const payload = JSON.parse(this.routerData?.payload);
      let benefitOrInjuryId = payload?.injuryId !== 'NULL' ? payload?.injuryId : payload?.benefitRequestId;
      const disabilityUrl =
        RouterConstants.ROUTE_OH_DISABILITY_ASSESSMENT +
        `/${payload?.socialInsuranceNo}/${payload?.personid}/${benefitOrInjuryId}`;
      if (this.routerData?.resourceType === RouterConstants.MB_CONVEYANCE_ALLOWANCE) {
        this.router.navigate([disabilityUrl], { queryParams: { disabilityType: payload?.assessmentType } });
      } else if (
        (this.routerData?.resourceType === RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR ||
          this.routerData?.resourceType === RouterConstants.TRANSACTION_ASSIGN_TO_HO) &&
        payload?.previousOutcome === WorkFlowActions.MODIFY_VISITING_DOCTOR
      ) {
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
      } else {
        this.router.navigate([disabilityUrl], { queryParams: { disabilityType: payload?.titleEnglish } });
      }
    }
  }
  routeToVisitingDoctor(type: string) {
    switch (type) {
      case RouterConstants.TRANSACTION_MB_DISABILITY_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_ASSIGN_APPEAL:
        this.router.navigate([MbRouteConstants.ROUTE_ADD_VISITING_DOCTOR_EDIT]);
        break;
      case RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR:
        this.routeToValidateAssessment();
      case RouterConstants.TRANSACTION_ASSIGN_TO_HO:
        this.routeToValidateAssessment();
        break;
      case RouterConstants.ESIGN_TRANSACTION:
        this.routeToEsignWorkitem();
        break;
      default:
        this.routeToAddMemberEdit();
    }
  }
  private reAssignRequestClarificationMB(routerToken) {
    const parsedPayload = JSON.parse(routerToken?.payload);
    if (parsedPayload?.previousOutcome === 'CAPTURED' && this.getMBResourceType(routerToken?.resourceType)) {
      return true;
    } else return false;
  }
  getMBResourceType(resourceType) {
    switch (resourceType) {
      case RouterConstants.TRANSACTION_CLOSE_INJURY:
      case RouterConstants.TRANSACTION_CLOSE_COMPLICATION:
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_NON_OCC_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT:
      case RouterConstants.TRANSACTION_MB_NON_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT:
      case RouterConstants.TRANSACTION_EARLY_REASSESSMENT:
      case RouterConstants.MB_BENEFIT_ASSESSMENT:
      case 'Request Clarification from Contributor':
        return true;
      default:
        return false;
    }
  }
}
