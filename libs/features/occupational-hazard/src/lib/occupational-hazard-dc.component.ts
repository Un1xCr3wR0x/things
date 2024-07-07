/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions
} from '@gosi-ui/core';
import { OhConstants, RouteConstants } from './shared/constants';
import { DisabiliyDtoList, MedicalBoardService } from './shared';

@Component({
  selector: 'oh-occupational-hazard-dc',
  templateUrl: './occupational-hazard-dc.component.html'
})
export class OccupationalHazardDcComponent implements OnInit {
  /** Local variables */
  isValidator = false;
  isValidator2 = 'FALSE';
  isDiseaseValidator = false;
  diseaseAssignedRole: string;
  isDiseaseid: boolean;
  isAppPublic: boolean;

  admin = false;
  mbAssessmentRequestId: number;
  disabilityDetails: DisabiliyDtoList;
  personIdentifier: number;
  repatriation = false;
  isAdmin: boolean = false;
  parsedPayload;
  /**
   * Constructor method
   * @param routerData
   */
  constructor(
    @Inject(RouterDataToken) private routerData: RouterData,
    readonly router: Router,
    readonly medicalBoardService: MedicalBoardService,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  /**
   * Method to initialize the component
   */
  ngOnInit(): void {   
    const assignedRole = this.routerData.assignedRole;
    const resourceType = this.routerData.resourceType;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    const channel = this.routerData.channel;
    if (this.routerData?.payload) {
      const payload = JSON.parse(this.routerData?.payload);
      this.isValidator2 = payload?.isValidator2;
      this.diseaseAssignedRole = payload?.assignedRole;
      this.isValidator2 = payload?.isValidator2;
      this.isDiseaseid = payload?.diseaseId !== 'NULL' ? true : false;
      this.parsedPayload = JSON.parse(this.routerData.payload);
     
      const role = payload.assignedRole;
      if (resourceType === 'Injury' && channel === 'taminaty' && (role === 'Admin' || role === Role.OH_FCAPPROVER)) {
        this.admin = true;
      }
      if (resourceType === 'Add dead body repatriation' && (channel === 'field-office' || channel === 'gosi-online')) {
        this.repatriation = true;
      }
    }
    if (this.routerData?.payload) {
      const payload = JSON.parse(this.routerData?.payload);
      this.isValidator2 = payload?.isValidator2;
      if(resourceType === 'Add dead body repatriation' && payload?.assignedRole === 'Admin') {
        this.isAdmin = true;
      }
    }
    this.isValidator = this.checkIfValidator(assignedRole);
    this.isDiseaseValidator = this.checkIfDiseaseValidator(this.diseaseAssignedRole);
    this.handleValidatorRedirections(resourceType, assignedRole);
    this.isValidator1Scenarios(resourceType);
    this.isEarlyReAssessment(resourceType, assignedRole); // for gosi doctor
    this.isAppealAssessment(resourceType, assignedRole);
    this.isReturnedEarlyReassessment(resourceType, assignedRole); // for contributor login
    if (this.routerData && this.routerData?.payload)
      this.isMbConveyanceAllowance(resourceType, assignedRole, this.routerData);
  }
  /**
   *
   * @param assignedRole Checking the assigned role is validator1 or not
   */
  checkIfValidator(assignedRole): boolean {
    if (
      assignedRole === Role.VALIDATOR ||
      assignedRole === Role.OH_OFFICER ||
      assignedRole === Role.OH_DOCTOR ||
      assignedRole === Role.OH_ADMIN ||
      assignedRole === Role.MS_OFFICER ||
      assignedRole === Role.MC_OFFICER ||
      assignedRole === Role.CLM_MGR ||
      assignedRole === Role.BOARD_OFFICER ||
      assignedRole === Role.FC_CONTROLLER ||
      assignedRole === Role.GDISO ||
      assignedRole === Role.BRANCH_ADMIN ||
      assignedRole === Role.VALIDATOR_1 ||
      assignedRole === Role.VALIDATOR_2 ||
      assignedRole === Role.OH_GDS ||
      assignedRole === Role.FC_APPROVER ||
      assignedRole === Role.OH_FCAPPROVER ||
      assignedRole === Role.OH_FCAPPROVER1 ||
      assignedRole === Role.DOCTOR ||
      assignedRole === Role.FO_DIRECTOR ||
      assignedRole === Role.GOSI_DOCTOR_CAPS ||
      assignedRole === Role.OH_FC_APPROVER
    ) {
      return true;
    }
  }
  checkIfDiseaseValidator(diseaseAssignedRole): boolean {
    if (
      diseaseAssignedRole === Role.VALIDATOR ||
      diseaseAssignedRole === Role.OH_OFFICER ||
      diseaseAssignedRole === Role.OH_DOCTOR ||
      diseaseAssignedRole === Role.OH_ADMIN ||
      diseaseAssignedRole === Role.MS_OFFICER ||
      diseaseAssignedRole === Role.MC_OFFICER ||
      diseaseAssignedRole === Role.CLM_MGR ||
      diseaseAssignedRole === Role.BOARD_OFFICER ||
      diseaseAssignedRole === Role.FC_CONTROLLER ||
      diseaseAssignedRole === Role.GDISO ||
      diseaseAssignedRole === Role.BRANCH_ADMIN ||
      diseaseAssignedRole === Role.VALIDATOR_1 ||
      diseaseAssignedRole === Role.VALIDATOR_2 ||
      diseaseAssignedRole === Role.OH_GDS ||
      diseaseAssignedRole === Role.FC_APPROVER ||
      diseaseAssignedRole === Role.OH_FCAPPROVER ||
      diseaseAssignedRole === Role.DOCTOR ||
      diseaseAssignedRole === Role.FO_DIRECTOR ||
      diseaseAssignedRole === Role.WORK_INJURIES_AND_OCCUPATIONAL_DISEASES_DOCTOR ||
      diseaseAssignedRole === Role.OCCUPATIONAL_HAZARD_OPERATIONS_OFFICER ||
      diseaseAssignedRole === Role.SAFETY_HEALTH_ENGINEER
    ) {
      return true;
    }
  }

  /**
   * Covered scenarios other than Validator 1
   * @param resourceType
   * @param assignedRole
   */
  handleValidatorRedirections(resourceType, assignedRole) {
    switch (resourceType) {
      case OhConstants.TRANSACTION_REJECT_INJURY:
        {
          const route =
            this.isValidator2 === 'TRUE'
              ? RouteConstants.ROUTE_VALIDATOR_REJECT_INJURY
              : RouteConstants.ROUTE_INJURY_REJECT;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_REJECT_COMPLICATION:
        {
          const route =
            this.isValidator2 === 'TRUE'
              ? RouteConstants.ROUTE_VALIDATOR_REJECT_COMPLICATION
              : RouteConstants.ROUTE_COMPLICATION_REJECT;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_REJECT_INJURY_TPA:
        {
          const route =
            assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS
              ? RouteConstants.ROUTE_VALIDATOR_REJECT_INJURY
              : RouteConstants.ROUTE_REJECT_INJURY;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_VALIDATE_REIMBURSMENT:
        {
          const route = RouteConstants.VALIDATE_REIMBURSEMENT_CLAIM;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_REJECT_COMPLICATION_TPA:
        {
          const route =
            assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS
              ? RouteConstants.ROUTE_VALIDATOR_REJECT_COMPLICATION
              : RouteConstants.ROUTE_REJECT_COMPLICATION;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_VALIDATE_REIMBURSMENT:
        {
          const route = RouteConstants.VALIDATE_REIMBURSEMENT_CLAIM;
          this.router.navigate([route]);
        }
        break;
    }
    if (
      resourceType == OhConstants.TRANSACTION_MB_NON_OCC_DISABILITY_ASSESSMENT ||
      resourceType === WorkFlowActions.NON_OCC_DISABILITY_ASSESSMENT ||
      resourceType === WorkFlowActions.REQUEST_CLARIFICATION ||
      resourceType === WorkFlowActions.NON_OCC_DEPENDENT_ASSESSMENT ||
      resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT
    ) {
      this.nonOccDisabilityTransaction(resourceType, assignedRole);
    } else if (
      resourceType === WorkFlowActions.HEIR_DISABILITY_ASSESSMENT ||
      resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT
    ) {
      this.heirDisabilityAssessment(resourceType, assignedRole);
    } else if (
      this.routerData.state === WorkFlowActions.RETURN &&
      resourceType !== WorkFlowActions.OCC_DISABILITY_REASSESSMENT
    ) {
      this.returnedTransactions(resourceType, assignedRole);
    } else if (
      resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT ||
      resourceType === WorkFlowActions.NON_OCC_DISABILITY_REASSESSMENT ||
      resourceType === WorkFlowActions.DEPENDENT_DISABILITY_REASSESSMENT ||
      resourceType === WorkFlowActions.HEIR_DISABILITY_REASSESSMENT
    ) {
      this.reassessmentTransactions(resourceType, assignedRole);
    } else if (assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS) {
      this.handleCloseTransactions(resourceType, assignedRole);
    } else {
      this.handleAuditorTransactions(resourceType, assignedRole);
    }
    this.handleCloseTransactions(resourceType, assignedRole);
    this.handleAuditorTransactions(resourceType, assignedRole);
  }
  nonOccDisabilityTransaction(resourceType, assignedRole) {
    if (
      (resourceType == OhConstants.TRANSACTION_MB_NON_OCC_DISABILITY_ASSESSMENT ||
        resourceType === WorkFlowActions.REQUEST_CLARIFICATION) &&
      assignedRole === Role.OH_DOCTOR
    ) {
      const route = RouteConstants.ROUTE_VALIDATOR_CLOSE_INJURY;
      this.router.navigate([route]);
    } else if (
      (resourceType === WorkFlowActions.NON_OCC_DISABILITY_ASSESSMENT ||
        resourceType === WorkFlowActions.NON_OCC_DEPENDENT_ASSESSMENT ||
        resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT) &&
      assignedRole === Role.OH_DOCTOR
    ) {
      const route = RouteConstants.ROUTE_VALIDATOR_MBASSESSMENT;
      this.router.navigate([route]);
    } else {
      RouteConstants.ROUTE_INJURY_CLOSE;
    }
  }
  returnedTransactions(resourceType, assignedRole) {
    if (
      resourceType &&
      (assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS) &&
      this.routerData.state === WorkFlowActions.RETURN &&
      resourceType !== WorkFlowActions.EARLY_REASSESSMENT
    ) {
      this.reassessmentTransactions(resourceType, assignedRole);
      // const route = RouteConstants.ROUTE_VALIDATOR_CLOSE_INJURY;
      // this.router.navigate([route]);
    } else {
      RouteConstants.ROUTE_INJURY_CLOSE;
    }
  }
  heirDisabilityAssessment(resourceType, assignedRole) {
    if (
      resourceType &&
      (assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS) &&
      (resourceType === WorkFlowActions.HEIR_DISABILITY_ASSESSMENT ||
        resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT)
    ) {
      const route = RouteConstants.ROUTE_VALIDATOR_MBASSESSMENT;
      this.router.navigate([route]);
    } else {
      RouteConstants.ROUTE_INJURY_CLOSE;
    }
  }
  reassessmentTransactions(resourceType, assignedRole) {
    const payload = JSON.parse(this.routerData.payload);
    this.mbAssessmentRequestId = payload.assessmentRequestId;
    this.personIdentifier = payload.identifier;
    if (
      (this.mbAssessmentRequestId &&
        (assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS) &&
        resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT) ||
      this.routerData.state === WorkFlowActions.RETURN
    ) {
      this.medicalBoardService
        .getDisabilityDetails(this.personIdentifier, this.mbAssessmentRequestId)
        .subscribe(res => {
          this.disabilityDetails = res;
          if (this.disabilityDetails && this.disabilityDetails.ohType === 2) {
            const route = RouteConstants.ROUTE_VALIDATOR_CLOSE_COMPLICATION;
            this.router.navigate([route]);
          } else {
            const route = RouteConstants.ROUTE_VALIDATOR_CLOSE_INJURY;
            this.router.navigate([route]);
          }
        });
    } else if (
      resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT &&
      (assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS)
    ) {
      const route = RouteConstants.ROUTE_VALIDATOR_CLOSE_INJURY;
      this.router.navigate([route]);
    } else if (
      (resourceType === WorkFlowActions.NON_OCC_DISABILITY_REASSESSMENT ||
        resourceType === WorkFlowActions.DEPENDENT_DISABILITY_REASSESSMENT ||
        resourceType === WorkFlowActions.HEIR_DISABILITY_REASSESSMENT) &&
      (assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS)
    ) {
      const route = RouteConstants.ROUTE_VALIDATOR_MBASSESSMENT;
      this.router.navigate([route]);
    } else {
      const route = RouteConstants.ROUTE_INJURY_CLOSE;
      this.router.navigate([route]);
    }
  }

  handleAuditorTransactions(resourceType, assignedRole) {
    switch (resourceType) {
      case OhConstants.MANAGE_OH_CLAIMS:
        {
          const route =
            assignedRole === Role.BOARD_OFFICER || assignedRole === Role.OH_DOCTOR
              ? RouteConstants.ROUTE_OH_CLAIMS
              : RouteConstants.ROUTE_INBOX;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.MANAGE_AUDITOR_FLOW:
        {
          const route =
            assignedRole === Role.BOARD_OFFICER || assignedRole === Role.OH_DOCTOR
              ? RouteConstants.ROUTE_OH_AUDITOR
              : RouteConstants.ROUTE_INBOX;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.ALLOWANCE_AUDITOR_FLOW:
        {
          const route =
            assignedRole === Role.BOARD_OFFICER || assignedRole === Role.OH_DOCTOR
              ? RouteConstants.ROUTE_OH_ALLOWANCE_AUDITOR
              : RouteConstants.ROUTE_INBOX;
          this.router.navigate([route]);
        }
        break;
    }
  }
  handleCloseTransactions(resourceType, assignedRole) {
    switch (resourceType) {
      case OhConstants.TRANSACTION_CLOSE_INJURY:
        {
          const route =
            assignedRole === Role.OH_DOCTOR
              ? RouteConstants.ROUTE_VALIDATOR_CLOSE_INJURY
              : RouteConstants.ROUTE_INJURY_CLOSE;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_CLOSE_COMPLICATION:
        {
          const route =
            assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS
              ? RouteConstants.ROUTE_VALIDATOR_CLOSE_COMPLICATION
              : RouteConstants.ROUTE_COMPLICATION_CLOSE;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_MB_NON_OCC_DISABILITY_ASSESSMENT:
        {
          const route =
            assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS
              ? RouteConstants.ROUTE_VALIDATOR_CLOSE_INJURY
              : RouteConstants.ROUTE_COMPLICATION_CLOSE;
          this.router.navigate([route]);
        }
        break;
      case WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR:
      case WorkFlowActions.ASSIGN_ASSESSMENT_TO_HO_DOCTOR:
        if (this.parsedPayload?.previousOutcome === WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR) {
          this.router.navigate([RouteConstants.ROUTE_VALIDATOR_CLOSE_INJURY]);
        }
    }
  }
  /**
   * @param resourceType Validator 1 scenarios
   */
  isValidator1Scenarios(resourceType) {
    switch (resourceType) {
      case OhConstants.TRANSACTION_ADD_INJURY:
        {
          this.routeInjury();
        }
        break;
      case OhConstants.TRANSACTION_ADD_COMPLICATION:
        {
          this.routeComplication();
        }
        break;   
      case OhConstants.TRANSACTION_ADD_DISEASE:
        {
          this.routeDisease();
        }
        break;
    
      case OhConstants.TRANSACTION_MODIFY_INJURY:
        {
          const route = this.isValidator
            ? RouteConstants.ROUTE_VALIDATOR_MODIFY_INJURY
            : RouteConstants.ROUTE_INJURY_MODIFY;
          this.router.navigate([route]);
        }
        break;
        case OhConstants.TRANSACTION_DISEASE_COMPLICATION:
          {
            this.routeDiseaseComplication();
          }
          break;
      case OhConstants.TRANSACTION_MODIFY_COMPLICATION:
        {
          const route = this.isValidator
            ? RouteConstants.ROUTE_VALIDATOR_MODIFY_COMPLICATION
            : RouteConstants.ROUTE_COMPLICATION_MODIFY;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_REOPEN_INJURY:
        {
          const route = this.isValidator
            ? RouteConstants.ROUTE_VALIDATOR_REOPEN_INJURY
            : RouteConstants.ROUTE_INJURY_REOPEN;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_REOPEN_COMPLICATION:
        {
          const route = this.isValidator
            ? RouteConstants.ROUTE_VALIDATOR_REOPEN_COMPLICATION
            : RouteConstants.ROUTE_COMPLICATION_REOPEN;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_ALLOWANCE_PAYEE:
        {
          const route = this.isValidator ? RouteConstants.ROUTE_ALLOWANCE_PAYEE : RouteConstants.ROUTE_INBOX;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_ADD_ALLOWANCE:
      case OhConstants.TRANSACTION_ADD_DEADBODY_CLAIMS:
      case OhConstants.TRANSACTION_ADD_DIABILITY_CLAIMS:
        {
          this.routeAllowance();
        }
        break;
      case OhConstants.HOLD_ALLOWANCE:
        {
          const route = this.isValidator ? RouteConstants.HOLD_ALLOWANCE : RouteConstants.ROUTE_INBOX;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.REIMBURSMENT_CLAIM:
        {
          const route = this.isValidator ? RouteConstants.REIMBURSEMENT_CLAIM : RouteConstants.ROUTE_INBOX;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.RESUME_ALLOWANCE:
        {
          const route = this.isValidator ? RouteConstants.RESUME_ALLOWANCE : RouteConstants.ROUTE_INBOX;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.AUDIT_MEDICAL_PROVIDER_CLAIM:
        {
          const route = this.isValidator ? RouteConstants.ROUTE_OH_MEDICAL_ALLOWANCE : RouteConstants.ROUTE_INBOX;
          this.router.navigate([route]);
        }
        break;
      case OhConstants.TRANSACTION_ADD_TRANSFER_INJURY:
        {
          const route =
            (this.isDiseaseid && this.isAppPublic) ? RouteConstants.ROUTE_DISEASE_EDIT : this.routeTransferInjury();
          if(route){
            this.router?.navigate([route]);
          }           
        }
        break;
      /* case OhConstants.TRANSACTION_REOPEN_DISEASE:
        {
          this.routeReopenDisease();
        }
        break;

      case OhConstants.TRANSACTION_CLOSE_DISEASE: 
        {
          const route = this.isDiseaseValidator ?  RouteConstants.ROUTE_VALIDATOR_DISEASE : RouteConstants.ROUTE_DISEASE_EDIT
          this.router.navigate([route]);          
        }
        break; */
    }
  }
  routeAllowance() {
    const route = this.isValidator ? (this.repatriation ? RouteConstants.ROUTE_REPATRIATION : RouteConstants.ROUTE_ALLOWANCE) : this.isAdmin ? RouteConstants.ROUTE_INJURY_REPATRIATION : RouteConstants.ROUTE_INBOX;
    this.router.navigate([route]);
  }
  routeInjury() {
    const route =
      this.admin || this.isValidator ? RouteConstants.ROUTE_VALIDATOR_INJURY : RouteConstants.ROUTE_INJURY_EDIT;
    this.router.navigate([route]);
  }
  routeDisease() {
    const route = this.isDiseaseValidator ? RouteConstants.ROUTE_VALIDATOR_DISEASE : RouteConstants.ROUTE_DISEASE_EDIT;
    this.router.navigate([route]);
  }
  routeComplication() {
    const route = this.isValidator
      ? RouteConstants.ROUTE_VALIDATOR_COMPLICATION
      : RouteConstants.ROUTE_COMPLICATION_EDIT;
    this.router.navigate([route]);
  }
  routeTransferInjury() {
    if(!this.medicalBoardService.getInjuryRoute()){
    const route = this.isDiseaseValidator ? RouteConstants.ROUTE_VALIDATOR_DISEASE : RouteConstants.ROUTE_ADD_DISEASE;
    this.router?.navigate([route]);
    }
  }
  routeReopenDisease() {
    const route = this.isDiseaseValidator
      ? RouteConstants.ROUTE_VALIDATOR_DISEASE
      : RouteConstants.ROUTE_REOPEN_DISEASE;
    this.router?.navigate([route]);
  }
  isEarlyReAssessment(resourceType, assignedRole) {
    if (
      resourceType &&
      resourceType === WorkFlowActions.EARLY_REASSESSMENT &&
      (assignedRole === Role.OH_DOCTOR || assignedRole === Role.GOSI_DOCTOR_CAPS)
    ) {
      const route = RouteConstants.ROUTE_EARLY_REASSESSMENT;
      this.router.navigate([route]);
    }
  }
  isReturnedEarlyReassessment(resourceType, assignedRole) {
    if (resourceType && resourceType === WorkFlowActions.EARLY_REASSESSMENT && assignedRole === Role.CONTRIBUTOR) {
      const route = RouteConstants.ROUTE_EARLY_REASSESSMENT_CONTRIBUTOR;
      this.router.navigate([route]);
    }
  }
  isAppealAssessment(resourceType, assignedRole) {
    if (
      resourceType &&
      resourceType === WorkFlowActions.APPEAL_ASSESSMENT &&
      (assignedRole === Role.HEAD_OFFICE_GOSI_DOCTOR ||
        assignedRole === Role.HO_DOCTOR ||
        assignedRole === Role.HO_OFFICER ||
        assignedRole === Role.HEAD_GOSI_DOCTOR)
    ) {
      const route = RouteConstants.ROUTE_EARLY_REASSESSMENT;
      this.router.navigate([route]);
    }
  }
  isMbConveyanceAllowance(resourceType, assignedRole, routerData) {
    const payload = JSON.parse(routerData?.payload);
    if (
      assignedRole === Role.FINANCIAL_CONTROLLER_ANN_ONE ||
      assignedRole === Role.FINANCIAL_CONTROLLER_ANN_TWO ||
      assignedRole === Role.OH_FCAPPROVER ||
      payload.assignedRole === Role.CNT_FC_APPROVER
    ) {
      switch (resourceType) {
        case RouterConstants.MB_CONVEYANCE_ALLOWANCE:
          return this.router.navigate([RouteConstants.RouteConveyanceAllowanceMB]);
      }
    }
    return false;
  }
  routeDiseaseComplication() {
    const route = this.isValidator
      ? RouteConstants.ROUTE_VALIDATOR_DISEASE_COMPLICATION
      : RouteConstants.ROUTE_DISEASE_COMPLICATION_EDIT;
    this.router.navigate([route]);
  }
}
