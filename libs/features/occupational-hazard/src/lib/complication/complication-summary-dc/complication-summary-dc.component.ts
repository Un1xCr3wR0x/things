/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, RoleIdEnum } from '@gosi-ui/core';
import { InjuryStatus, ProcessType } from '../../shared/enums';
import { WorkFlowStatus } from '../../shared/enums/work-flow-status';
import { Complication } from '../../shared/models';
import { OhService } from '../../shared/services';

@Component({
  selector: 'oh-complication-summary-dc',
  templateUrl: './complication-summary-dc.component.html',
  styleUrls: ['./complication-summary-dc.component.scss']
})
export class ComplicationSummaryDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  showReject = false;
  showReopenForMO = false;
  showRejectForMO = false;
  isRejected = false;
  showModify = false;
  isModified = false;
  showReopen = false;
  registationNo: number;
  injuryId: number;
  complicationId: number;
  value: Params;
  isReopened = false;
  validatorRejectRoles = [];
  validatorModifyRoles = [];
  validatorReopenRoles = [];
  validateMORole = [];
  validateCloseReopen = [];
  /**
   * Input Variables
   */
  @Input() complicationDetails: Complication;
  @Input() socialInsuranceNo: number;
  @Input() establishment;
  @Input() repatriationButton: boolean = false;

  /**
   * Output Variables
   */
  @Output() reject: EventEmitter<null> = new EventEmitter();
  @Output() modify: EventEmitter<null> = new EventEmitter();
  @Output() reopen: EventEmitter<null> = new EventEmitter();
  @Output() repatriation: EventEmitter<null> = new EventEmitter();
  /**
   * Creates an instance of ComplicationSummaryDcComponent
   * @memberof  ComplicationSummaryDcComponent
   *
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly activatedRoute: ActivatedRoute,
    readonly ohService: OhService,
    readonly router: Router
  ) {}

  /**
   * This method is for initialization tasks
   */
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.status === 'rejected') {
        this.isRejected = true;
      }
      if (params.status === ProcessType.MODIFY) {
        this.isModified = true;
      }
      if (params.status === ProcessType.RE_OPEN) {
        this.isReopened = true;
      }
    });
    this.validatorRejectRoles.push(RoleIdEnum.OH_OFFICER);
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.validatorModifyRoles.push(RoleIdEnum.OH_OFFICER, RoleIdEnum.CSR);
      if (this.complicationDetails.status.english === InjuryStatus.CURED_WITH_DISABILITY) {
        this.validateMORole.push(RoleIdEnum.BOARD_OFFICER, RoleIdEnum.OH_OFFICER);
        this.validateCloseReopen.push(RoleIdEnum.BOARD_OFFICER);
      }
      this.validatorReopenRoles.push(RoleIdEnum.OH_OFFICER, RoleIdEnum.CSR);
    } else if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.validatorReopenRoles.push(RoleIdEnum.SUBSCRIBER);
    
    } else {
      this.validatorReopenRoles.push(RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.OH_ADMIN);
    }
  }
  /**
   * Method for rjecting injury
   */
  rejectComplication() {
    this.reject.emit();
  }
  /**
   *
   * @param changes Capturing input changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.complicationDetails) {
      this.complicationDetails = changes.complicationDetails.currentValue;
      if (this.complicationDetails.hasRejectionInprogress) {
        this.isRejected = true;
      }
      if (this.complicationDetails.hasPendingChangeRequest) {
        this.isReopened = true;
        this.isModified = true;
      }
    }
    /**
     * Checking whether reject button is needed
     */
    if (this.complicationDetails && this.complicationDetails.status) {
      const complicationStatus = this.complicationDetails.status.english;
      switch (complicationStatus) {
        case InjuryStatus.CURED_WITHOUT_DISABILITY:
        case InjuryStatus.RESULTED_IN_DEATH: {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            this.showReject = true;
          }

          break;
        }
        case InjuryStatus.CURED_WITH_DISABILITY: {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            this.showRejectForMO = true;
            this.showReopenForMO = true;
          }
          break;
        }
        case InjuryStatus.APPROVED: {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            this.showModify = true;
            this.showReject = true;
          }
          break;
        }
        case InjuryStatus.CLOSED:
        case InjuryStatus.CLOSED_BECAUSE_OF_DISCONTINUING_TREATMENT: {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            this.showReject = true;
          }
          break;
        }
        case InjuryStatus.REJECTED: {
          this.rejectedScenarios();
          break;
        }
        case InjuryStatus.CLOSED_WITHOUT_CONTINUING_TREATMENT: {
          if (this.appToken === ApplicationTypeEnum.PUBLIC) {
            if (this.complicationDetails.hasActiveEngagement) {
              this.showReopen = true;
            }
          } else {           
            this.showReject = true;
            this.showReopen = true;
          }
          break;
        }
        default:
          break;
      }
    }
  }
  /**
   * Navigation to Injury Details for Modification
   */
  modifyComplicationNavigation() {
    this.modify.emit();
  }
  /**
   * Reopen Complication Navigation
   */
  reopenComplicationNavigation() {
    this.reopen.emit();
  }
  /**
   * Reopen Button Show Hide Logic For Rejected Status
   */
  rejectedScenarios() {
    if (
      this.complicationDetails.workFlowStatus !== WorkFlowStatus.OH_REJ_PENDING_DOCTOR_APPROVAL &&
      this.complicationDetails.workFlowStatus !== WorkFlowStatus.OH_REJ_FINALLY_APPROVED_TPA &&
      this.complicationDetails.workFlowStatus !== WorkFlowStatus.OH_REJ_FINALLY_APPROVED_SYSTEM &&
      this.complicationDetails.workFlowStatus !== WorkFlowStatus.OH_REJ_FINALLY_APPROVED_DOCTOR
    ) {
      if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        if (this.complicationDetails.hasActiveEngagement) {
          this.showReopen = true;
        }
      } else {        
        this.showReopen = true;
      }
    }
  }
  repatriationNavigation() {
    this.repatriation.emit();
  }
}
