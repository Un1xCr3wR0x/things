/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, RoleIdEnum } from '@gosi-ui/core';
import { InjuryStatus } from '../../shared/enums';
import { WorkFlowStatus } from '../../shared/enums/work-flow-status';
import { Injury } from '../../shared/models';
import { OhService } from '../../shared/services';
@Component({
  selector: 'oh-injury-summary-dc',
  templateUrl: './injury-summary-dc.component.html',
  styleUrls: ['./injury-summary-dc.component.scss']
})
export class InjurySummaryDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() injuryDetails: Injury;
  @Input() isContributorActive;
  @Input() establishment;
  @Input() repatriationButton: boolean = false;
  @Output() reject: EventEmitter<null> = new EventEmitter();
  @Output() reopen: EventEmitter<null> = new EventEmitter();
  @Output() modify: EventEmitter<null> = new EventEmitter();
  @Output() repatriation: EventEmitter<null> = new EventEmitter();
  showReject = false;
  isRejected = false;
  isModified = false;
  showModify = false;
  showReopen = false;
  showReopenForMO = false;
  showRejectForMO = false;
  showReopenForOHOnly = false;
  socialInsuranceNo: number;
  registationNo: number;
  injuryId: number;
  isReopened = false;
  validatorRejectRoles: RoleIdEnum[] = [];
  validatorModifyRoles: RoleIdEnum[] = [];
  validatorReopenRoles: RoleIdEnum[] = [];
  validateCloseReopen: RoleIdEnum[] = [];
  validateMORole: RoleIdEnum[] = [];
  /**
   * Constructor
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly activatedRoute: ActivatedRoute,
    readonly router: Router,
    readonly ohService: OhService
  ) {}

  /**
   * on init method
   */
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(res => {
      this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
      this.registationNo = parseInt(res.get('registrationNo'), 10);
      this.injuryId = parseInt(res.get('injuryId'), 10);
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.status === 'rejected') {
        this.isRejected = true;
      }
      if (params.status === 'modified') {
        this.isModified = true;
      }
      if (params.status === 're-open') {
        this.isReopened = true;
      }
    });
    this.validatorRejectRoles.push(RoleIdEnum.OH_OFFICER);
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.validatorModifyRoles.push(RoleIdEnum.OH_OFFICER, RoleIdEnum.CSR);
      if (this.injuryDetails.injuryStatus.english === InjuryStatus.CURED_WITH_DISABILITY) {
        this.validateMORole.push(RoleIdEnum.BOARD_OFFICER, RoleIdEnum.OH_OFFICER);
        this.validateCloseReopen.push(RoleIdEnum.BOARD_OFFICER);
      }
      this.validatorReopenRoles.push(RoleIdEnum.OH_OFFICER, RoleIdEnum.CSR);
    } else {
      this.validatorReopenRoles.push(RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.OH_ADMIN);
    }
  }

  /**
   * Method for rjecting injury
   */
  rejectInjury() {
    this.reject.emit();
  }
  /**
   * Navigation to Injury Details for Modification
   */
  modifyInjuryNavigation() {
    this.modify.emit();
  }
  /**
   * Reopen injury Navigation
   */
  reopenInjuryNavigation() {
    this.reopen.emit();
  }
  /**
   *
   * Capture input on changes
   */
  //Revisit As of now Reject and modify button show hide have done on the basis of ApplicationType only .Need to change when login is implemented.Reject button can only be visible to Validator1 .But modify can be visible to Validator1 and CSR
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryDetails) {
      this.injuryDetails = changes.injuryDetails.currentValue;
      this.checkStatus();
    }
  }
  /**
   * Checking whether reopen ,modify and reject button needs to show
   */
  checkStatus() {
    if (this.injuryDetails && this.injuryDetails.injuryStatus) {
      const injuryStatus = this.injuryDetails.injuryStatus.english;
      switch (injuryStatus) {
        case InjuryStatus.REJECTED: {
          if (
            this.injuryDetails.workFlowStatus !== WorkFlowStatus.OH_REJ_FINALLY_APPROVED_TPA &&
            this.injuryDetails.workFlowStatus !== WorkFlowStatus.OH_REJ_FINALLY_APPROVED_SYSTEM &&
            this.injuryDetails.workFlowStatus !== WorkFlowStatus.OH_REJ_FINALLY_APPROVED_DOCTOR &&
            this.injuryDetails.workFlowStatus !== WorkFlowStatus.OH_REJ_PENDING_DOCTOR_APPROVAL
          ) {
            this.rejectedButtonVisibility();
          }

          break;
        }
        case InjuryStatus.CLOSED_WITHOUT_CONTINUING_TREATMENT: {
          this.getClosedStatusVisibility(this.injuryDetails);
          break;
        }
        case InjuryStatus.CURED_WITHOUT_DISABILITY: {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            this.showReopenForOHOnly = true;
          }
        }
        case InjuryStatus.CLOSED_BECAUSE_OF_DISCONTINUING_TREATMENT:
        case InjuryStatus.RESULTED_IN_DEATH: {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            this.showReject = true;
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
        case InjuryStatus.CURED_WITH_DISABILITY: {
          if (this.appToken === ApplicationTypeEnum.PRIVATE) {
            this.showRejectForMO = true;
            this.showReopenForMO = true;
          }
          break;
        }
        default:
          break;
      }
      this.setButtonConditions(this.injuryDetails);
    }
  }

  setButtonConditions(injuryDetails) {
    if (injuryDetails.hasRejectionInProgress) {
      this.isRejected = true;
    }
    if (injuryDetails.hasPendingChangeRequest) {
      this.isReopened = true;
      this.isModified = true;
    }
  }

  getClosedStatusVisibility(injuryDetails) {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      if (injuryDetails.hasActiveEngagement && !injuryDetails.hasOpenComplication) {
        this.showReopen = true;
      }
    } else {
      if (!injuryDetails.hasOpenComplication) {
        this.showReopen = true;
      }
    }
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.showReject = true;
    }
  }
  /**
   *Check whether Reopen button need to be shown for Rejected Injury Status
   */
  rejectedButtonVisibility() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      if (this.injuryDetails.hasActiveEngagement && !this.injuryDetails.hasOpenComplication) {
        this.showReopen = true;
      }
    } else {
      if (!this.injuryDetails.hasOpenComplication) {
        this.showReopen = true;
      }
    }
  }

  repatriationNavigation() {
    this.repatriation.emit();
  }
}
