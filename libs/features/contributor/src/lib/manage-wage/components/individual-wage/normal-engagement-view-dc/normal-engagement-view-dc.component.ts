/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  EstablishmentStatusEnum,
  IdentityTypeEnum,
  LanguageToken,
  RoleIdEnum
} from '@gosi-ui/core';
import { ManageWageService } from '@gosi-ui/features/contributor/lib/shared/services/manage-wage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ContributorConstants, ManageWageConstants } from '../../../../shared/constants';
import { ContributorActionEnum, EngagementType, TransactionName } from '../../../../shared/enums';
import {
  Contributor,
  DropDownItems,
  EngagementBasicDetails,
  EngagementDetails,
  Establishment,
  TransactionRefDetails
} from '../../../../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'cnt-normal-engagement-view-dc',
  templateUrl: './normal-engagement-view-dc.component.html',
  styleUrls: ['./normal-engagement-view-dc.component.scss']
})
export class NormalEngagementViewDcComponent implements OnChanges {
  /** Local variables. */
  isAppPublic: boolean;
  actionList: DropDownItems[] = ManageWageConstants.contributorActionsDropdown;
  modalRef: BsModalRef;
  establishment: Establishment;
  hasBranches: boolean;
  isExcludedOccupation = false;
  nin: number;
  modifyEngagement: EngagementBasicDetails = new EngagementBasicDetails();
  lang: string;
  errMessage: string;
  errDetails: any = [];
  selectedValue: any;

  /** Constants */
  ENGAGEMENT_INACTIVE = ContributorConstants.ENGAGEMENT_INACTIVE_STATUS;
  ENGAGEMENT_ACTIVE = ContributorConstants.ENGAGEMENT_ACTIVE_STATUS;
  ENGAGEMENT_CANCELLED = ContributorConstants.ENGAGEMENT_CANCELLED_STATUS;
  CANCEL_IN_PROGRESS = ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS;

  /** Input  variables. */
  @Input() actionListValue: DropDownItems[];
  @Input() individualApp: boolean;
  @Input() index: number;
  @Input() isFirst: boolean;
  @Input() engagement: EngagementDetails;
  @Input() isNin: boolean;
  @Input() contributorData: Contributor;
  @Input() isABSHERregistered: boolean;
  @Input() currentUserRoles: string[];
  @Input() isUnifiedProfile: boolean;
  @Input() showAbsherTemplate: boolean;
  @Input() engagementLength: any;
  @Input() isIndividualProfile: boolean;
  @Input() isPREligible: boolean;
  /** Output variables. */
  @Output() edit: EventEmitter<object> = new EventEmitter();
  @Output() individualActions: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() cancelContract: EventEmitter<object> = new EventEmitter();
  @Output() fetchContracts: EventEmitter<EngagementDetails> = new EventEmitter();

  /**Child components */
  @ViewChild('notTrustedTemplate', { static: true })
  notTrustedTemplate: TemplateRef<HTMLElement>;
  @ViewChild('reactivateTemplate', { static: true })
  reactivateTemplate: TemplateRef<HTMLElement>;
  @ViewChild('templateCancelContract', { static: true })
  cancelContractTemplate: TemplateRef<HTMLElement>;
  //einspectionPopUpTemplate: TemplateRef<HTMLElement>;
  @ViewChild('einspectionPopUpTemplate', { static: true }) einspectionPopUpTemplate: any;
  @ViewChild('draftRequiredTemplate', { static: true })
  draftRequiredTemplate: TemplateRef<HTMLElement>;
  transactionTraceId: number;

  /** Creates an instancce of EngagementAccordianViewDcComponent. */
  constructor(
    readonly router: Router,
    private modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly manageWageService: ManageWageService,
    readonly authTokenService: AuthTokenService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC;
  }

  ngOnInit(): void {
    this.nin = this.authTokenService.getIndividual();
  }

  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagement && changes.engagement.currentValue) {
      this.establishment = this.getEstablishmentDetailsFromEngagement();
      this.hasBranches = this.engagement.hasActiveBranchesInGroup;
      //For PPA
      if (this.engagement?.ppaIndicator) {
        this.actionList = [];
        if (!this.isAppPublic)
          // cancel not required in GOL for ppa
          this.actionList.push(
            ManageWageConstants.getDropDownItems(ContributorActionEnum.CANCEL, 'trash-alt', 'Cancel.svg')
          );
        this.actionList.push(
          ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY, 'pencil-alt', 'Modify.svg')
        );
        if (this.engagement?.status === 'LIVE' || this.engagement?.status === 'TERMINATION_IN_PROGRESS') {
          // Added transfer for ppa
          this.actionList.push(
            ManageWageConstants.getDropDownItems(ContributorActionEnum.TRANSFER, 'sync', 'Transfer.svg')
          );
        }
        if (
          ContributorConstants.ENGAGEMENT_ACTIVE_STATUS.includes(this.engagement?.status) ||
          (this.engagement?.status === this.CANCEL_IN_PROGRESS && !this.engagement?.leavingDate?.gregorian)
        ) {
          // for inactive cancel in progress, there shouldn't be terminate option
          this.actionList.push(
            ManageWageConstants.getDropDownItems(
              ContributorActionEnum.TERMINATE,
              ['far', 'times-circle'],
              'Terminate.svg'
            )
          );
        }
        if (
          (this.engagement?.status === 'LIVE' || this.engagement?.status === 'TERMINATION_IN_PROGRESS') &&
          (this.engagement?.secondment || this.engagement?.studyLeave)
        ) {
          this.actionList = []; // only terminate option for active secondment & active studyleave
          this.actionList.push(
            ManageWageConstants.getDropDownItems(
              ContributorActionEnum.TERMINATE,
              ['far', 'times-circle'],
              'Terminate.svg'
            )
          );
        }
        // change for on studyleave enable
        if (this.engagement?.secondment || this.engagement?.studyLeave) {
          //this.engagement?.status === 'HISTORY' &&
          this.actionList = [];
        } //disablePPA
        // Temperarly commenting raise objection for ind Profile...feature on hold
        // if (this.engagement?.status === 'LIVE' || this.engagement?.status === 'HISTORY') {
        //   if (this.isIndividualProfile)
        //     // raise objection not required in Establishment Profile
        //     this.actionList.push(
        //       ManageWageConstants.getDropDownItems(ContributorActionEnum.RAISE_OBJECTION, 'pencil-alt', 'Modify.svg')
        //     );
        // }
        if (this.engagement?.secondment || this.engagement?.studyLeave) {
          this.actionList = [];
        }
        this.actionList.forEach(value => this.enableOrDisableAcions(value));
      }
      //For part timers no action can be perfomed.
      else if (this.engagement.engagementType !== EngagementType.PART_TIMER) this.createActionList();
      else this.actionList = [];
    }
    if (changes.showAbsherTemplate) {
      if (this.showAbsherTemplate === true) {
        this.showModal(this.notTrustedTemplate);
      }
    }
    if (changes.isPREligible) {
      this.isPREligible = changes.isPREligible.currentValue;
      const list = this.actionList.find(item => item.key === ContributorActionEnum.MODIFY_COVERAGE);
      this.enableOrDisableAcions(list);
    }
  }

  /** Method to get establishment details from engagement. */
  getEstablishmentDetailsFromEngagement() {
    const details = new Establishment();
    details.name = this.engagement.establishmentName;
    details.status = this.engagement.establishmentStatus;
    details.gccCountry = this.engagement.gccEstablishment;
    details.registrationNo = this.engagement.registrationNo;
    return details;
  }

  /** Method to create action list associated with engagement. */
  createActionList() {
    this.actionList = this.filterDropDownForStatus(
      this.actionList,
      this.engagement.status,
      this.engagement.leavingDate ? this.engagement.leavingDate.gregorian : null,
      this.engagement
    );
    this.actionList.forEach(value => this.enableOrDisableAcions(value));
  }

  /** Method to filter based on engagement status */
  filterDropDownForStatus(values: DropDownItems[], status: string, leavingDate: Date, engagement): DropDownItems[] {
    let dropDown: string[];
    if (this.ENGAGEMENT_ACTIVE?.includes(status) || (status === this.CANCEL_IN_PROGRESS && !leavingDate)) {
      dropDown = ManageWageConstants.ACTIVE_ENGAGEMENT_DROPDOWN;
    } else if (this.ENGAGEMENT_INACTIVE?.includes(status) || (status === this.CANCEL_IN_PROGRESS && leavingDate)) {
      dropDown = ManageWageConstants.INACTIVE_ENGAGEMENT_DROPDOWN;
    } else if (this.ENGAGEMENT_CANCELLED === status) {
      dropDown = ManageWageConstants.CANCEL_ENGAGEMENT_DROPDOWN;
    }
    let filteredValues = values.filter(val => dropDown.indexOf(val.key) !== -1);
    //If establishment is gcc, transfer action is not available.
    if (this.establishment.gccCountry)
      filteredValues = filteredValues.filter(val => val.key !== ContributorActionEnum.TRANSFER);
    if (this.establishment.gccCountry && this.isAppPublic)
      filteredValues = filteredValues.filter(val => val.key !== ContributorActionEnum.TERMINATE);
    if (this.isAppPublic)
      filteredValues = filteredValues.filter(val => val.key !== ContributorActionEnum.MODIFY_COVERAGE);
    if ((engagement?.contracts && engagement.contracts.length === 0) || engagement.contracts == undefined) {
      filteredValues = filteredValues.filter(val => val.key !== ContributorActionEnum.CONTRACT_DETAILS);
    }

    // if (
    //   engagement.status === 'HISTORY' ||
    //   engagement?.leavingDate?.gregorian ||
    //   !engagement.isContractsAuthRequired ||
    //   !this.hasNinOrIqama(this.contributorData?.person?.identity)
    // ) {
    //   filteredValues = filteredValues.filter(val => val.key !== ContributorActionEnum.ADD_CONTRACT);
    // }
    if (this.currentUserRoles?.includes(RoleIdEnum.INQUIRY_FOR_CONTRACTSAUHENTICATION.toString())) {
      filteredValues = filteredValues.filter(val => val.key === ContributorActionEnum.CONTRACT_DETAILS);
    }
    filteredValues = this.checkUserPrivileges(filteredValues);
    //In GOL, cancel action is not available.
    return this.isAppPublic ? filteredValues.filter(val => val.key !== ContributorActionEnum.CANCEL) : filteredValues;
  }

  /** Method  to check whether person has NIN or IQAMA. */
  hasNinOrIqama(identities) {
    return identities
      ? identities.some(
          identity => identity.idType === IdentityTypeEnum.IQAMA || identity.idType === IdentityTypeEnum.NIN
        )
      : false;
  }

  /** Method to check user privilages. */
  checkUserPrivileges(items: DropDownItems[]) {
    if (this.currentUserRoles?.length === 0) {
      items = [];
    } else {
      if (this.isAppPublic) {
        //In GOL transfer is only available for Super Admin
        if (
          !(
            this.currentUserRoles?.includes(RoleIdEnum.SUPER_ADMIN.toString()) ||
            this.currentUserRoles?.includes(RoleIdEnum.BRANCH_ADMIN.toString())
          )
        )
          items = items.filter(val => val.key !== ContributorActionEnum.TRANSFER);
        //GCC Admin and users other than super admin, branch admin, registration admin has only view privilege
        if (
          this.currentUserRoles?.includes(RoleIdEnum.GCC_ADMIN.toString()) ||
          !(
            this.currentUserRoles?.includes(RoleIdEnum.SUPER_ADMIN.toString()) ||
            this.currentUserRoles?.includes(RoleIdEnum.BRANCH_ADMIN.toString()) ||
            this.currentUserRoles?.includes(RoleIdEnum.REG_ADMIN.toString())
          )
        )
          items = [];
      }
      //CSR have view privilege in GCC establishments,GCC CSR has only view privilege in non GCC establishment
      //Users other than CSR or GCC CSR have view access
      else {
        if (
          (this.currentUserRoles?.includes(RoleIdEnum.CSR.toString()) &&
            !this.currentUserRoles?.includes(RoleIdEnum.GCC_CSR.toString()) &&
            this.establishment.gccCountry) ||
          (this.currentUserRoles?.includes(RoleIdEnum.GCC_CSR.toString()) &&
            !this.currentUserRoles?.includes(RoleIdEnum.CSR.toString()) &&
            !this.establishment.gccCountry) ||
          !(
            this.currentUserRoles?.includes(RoleIdEnum.CSR.toString()) ||
            this.currentUserRoles?.includes(RoleIdEnum.GCC_CSR.toString()) ||
            !this.currentUserRoles?.includes(RoleIdEnum.COMPLAINT_MANAGER.toString()) ||
            !this.currentUserRoles?.includes(RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR.toString()) ||
            this.currentUserRoles?.includes(RoleIdEnum.INQUIRY_FOR_CONTRACTSAUHENTICATION.toString())
          )
        )
          items = [];
      }
    }
    return items;
  }

  /** Method to enable or disable actions. */
  enableOrDisableAcions(value: DropDownItems) {
    if (
      this.engagement?.pendingTransaction.some(
        item =>
          item?.type?.english === TransactionName.SECONDMENT_ENGAGEMENT ||
          item?.type?.english === TransactionName.STUDY_LEAVE_ENGAGEMENT
      )
    ) {
      // if secondment or study leave pending txn is there, disable all options with a msg
      value.disabled = true;
    } else if (value?.key === ContributorActionEnum.MODIFY) {
      value.disabled =
        (EstablishmentStatusEnum.REGISTERED !== this.establishment.status.english &&
          EstablishmentStatusEnum.REOPEN !== this.establishment.status.english) ||
        (this.engagement?.ppaIndicator &&
          this.engagement?.engagementType === EngagementType.MILITARY &&
          this.engagement?.status === 'LIVE') ||
        this.engagement.pendingTransaction.some(
          item =>
            (item?.type?.english === TransactionName.CHANGE_ENGAGEMENT && item.referenceNo && !item.draft) ||
            item?.type.english === TransactionName.MANAGE_WAGE
        );
    } else if (value?.key === ContributorActionEnum.MODIFY_COVERAGE) {
      value.disabled =
        (EstablishmentStatusEnum.REGISTERED !== this.establishment.status.english &&
          EstablishmentStatusEnum.REOPEN !== this.establishment.status.english) ||
        this.engagement.proactive ||
        this.isPREligible ||
        this.engagement.pendingTransaction.some(item => item.type.english === TransactionName.MAINTAIN_COVERAGE);
    } else if (value?.key === ContributorActionEnum.TERMINATE) {
      value.disabled =
        (EstablishmentStatusEnum.REGISTERED !== this.establishment.status.english &&
          EstablishmentStatusEnum.REOPEN !== this.establishment.status.english &&
          EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS !== this.establishment.status.english) ||
        this.engagement.proactive ||
        (this.engagement?.ppaIndicator && this.engagement?.engagementType === EngagementType.MILITARY) ||
        this.engagement.pendingTransaction.some(
          item =>
            item.type.english === TransactionName.SECONDMENT_ENGAGEMENT ||
            item.type.english === TransactionName.STUDY_LEAVE_ENGAGEMENT ||
            item.type.english === TransactionName.TERMINATE_CONTRIBUTOR
        );
    } else if (value?.key === ContributorActionEnum.TRANSFER) {
      value.disabled =
        (EstablishmentStatusEnum.REGISTERED !== this.establishment.status.english &&
          EstablishmentStatusEnum.REOPEN !== this.establishment.status.english) ||
        (!this.isAppPublic && this.engagement.proactive) ||
        this.engagement.pendingTransaction.some(item => item.type.english === TransactionName.TRANSFER_CONTRIBUTOR) ||
        !this.hasBranches ||
        this.engagement?.ppaIndicator;
    } else if (value?.key === ContributorActionEnum.CANCEL) {
      value.disabled =
        (EstablishmentStatusEnum.REGISTERED !== this.establishment.status.english &&
          EstablishmentStatusEnum.REOPEN !== this.establishment.status.english) ||
        (this.engagement?.ppaIndicator &&
          this.engagement?.engagementType === EngagementType.MILITARY &&
          this.engagement?.status === 'LIVE') ||
        (this.engagement.proactive &&
          !ContributorConstants.EXCLUDED_OCCUPATIONS.includes(
            this.engagement.engagementPeriod[0].occupation.english
          )) ||
        this.engagement.pendingTransaction.some(item => item.type.english === TransactionName.CANCEL_CONTRIBUTOR);
    }
    //  else if (value.key === ContributorActionEnum.ADD_CONTRACT) {
    //   value.disabled =
    //     (EstablishmentStatusEnum.REGISTERED !== this.establishment.status.english &&
    //       EstablishmentStatusEnum.REOPEN !== this.establishment.status.english) ||
    //     this.engagement.proactive ||
    //     (this.engagement.contractWorkflow.length > 0 &&
    //       !this.engagement.contractWorkflow[0]?.draft &&
    //       !this.engagement.contractWorkflow[0]?.contractTransactionId);
    // }
    if (value?.disabled) value = this.setToolTipValue(this.engagement, value);
  }

  /**  Method to set tooltip value */
  setToolTipValue(engagement: EngagementDetails, dropDown: DropDownItems): DropDownItems {
    const pendingTransactions = engagement.pendingTransaction;
    if (
      pendingTransactions.some(
        item =>
          (item.type.english === TransactionName.SECONDMENT_ENGAGEMENT ||
            item.type.english === TransactionName.STUDY_LEAVE_ENGAGEMENT) &&
          dropDown.key != ContributorActionEnum.TRANSFER
      )
    ) {
      // if secondment or study leave pending txn is there, disable all options with a msg
      pendingTransactions.forEach(obj => (dropDown = this.getTooltipForDisableAll(dropDown, obj)));
    } else if (engagement.proactive && dropDown.key === ContributorActionEnum.TERMINATE) {
      //If engagement is proactive cannot terminate contributor
      dropDown.toolTipValue = 'CONTRIBUTOR.NO-MANUAL-TERMINATE';
      dropDown.toolTipParam = null;
    } else if (
      engagement?.ppaIndicator &&
      engagement?.engagementType === EngagementType.MILITARY &&
      dropDown.key === ContributorActionEnum.TERMINATE
    ) {
      // Active Military Engagement cannot be terminated manually
      dropDown.toolTipValue = 'CONTRIBUTOR.TERMINATE-DISABLE-FOR-MILITARY';
      dropDown.toolTipParam = null;
    }
    else if (
      engagement?.ppaIndicator &&
      engagement?.engagementType === EngagementType.MILITARY &&
      dropDown.key === ContributorActionEnum.MODIFY
    ) {
      // Active Military Engagement cannot be Modified manually
      dropDown.toolTipValue = 'CONTRIBUTOR.MODIFY-DISABLE-FOR-MILITARY';
      dropDown.toolTipParam = null;
    }
     else if (engagement?.ppaIndicator && dropDown.key === ContributorActionEnum.TRANSFER) {
      dropDown.toolTipValue = 'CONTRIBUTOR.ENGAGEMENT-TRANSFER-DISABLE';
      dropDown.toolTipParam = null;
    } else if (
      dropDown.key === ContributorActionEnum.CANCEL &&
      engagement?.ppaIndicator &&
      engagement?.engagementType === EngagementType.MILITARY &&
      engagement?.status === 'LIVE'
    ) {
      dropDown.toolTipValue = 'CONTRIBUTOR.CANCEL-DISABLE-FOR-MILITARY';
      dropDown.toolTipParam = null;
    } else if (engagement.proactive && dropDown.key === ContributorActionEnum.CANCEL) {
      //if establishment is proactive, cannot cancel engagement
      dropDown.toolTipValue = 'CONTRIBUTOR.CANCEL-CON.NO-MANUAL-CANCEL';
      dropDown.toolTipParam = null;
    } else if (
      !this.isAppPublic &&
      !engagement?.ppaIndicator &&
      engagement.proactive &&
      dropDown.key === ContributorActionEnum.TRANSFER
    ) {
      //if establishment is proactive, cannot transfer engagement
      dropDown.toolTipValue = 'CONTRIBUTOR.TRANSFER-CON.NO-MANUAL-TRANSFER';
      dropDown.toolTipParam = null;
    } else if (!this.isAppPublic && engagement.proactive && dropDown.key === ContributorActionEnum.MODIFY_COVERAGE) {
      //if establishment is proactive, cannot transfer engagement
      dropDown.toolTipValue = 'CONTRIBUTOR.NO-MANUAL-MODIFY-COVERAGE';
      dropDown.toolTipParam = null;
    } else if (
      EstablishmentStatusEnum.REGISTERED !== this.establishment.status.english &&
      EstablishmentStatusEnum.REOPEN !== this.establishment.status.english
    )
      dropDown = this.getTooltipForEstablishmentEligibility(dropDown, this.establishment.status.english);
    else if (!this.hasBranches && !engagement?.ppaIndicator && dropDown.key === ContributorActionEnum.TRANSFER) {
      //if establishment is has no branches, cannot transfer engagement
      dropDown.toolTipValue = 'CONTRIBUTOR.TRANSFER-CON.NO-BRANCHES-MESSAGE';
      dropDown.toolTipParam = null;
    }
    // else if (engagement.contractWorkflow.length > 0 && dropDown.key === ContributorActionEnum.ADD_CONTRACT) {
    //   dropDown.toolTipValue =
    //     engagement.contractWorkflow[0]?.contractTransactionType === 'Register Contract'
    //       ? 'CONTRIBUTOR.WAGE.UPDATE-ADD-CONTRACT-WORKFLOW-PENDING-INFO'
    //       : 'CONTRIBUTOR.WAGE.UPDATE-CANCEL-CONTRACT-WORKFLOW-PENDING-INFO';
    //   dropDown.toolTipParam = engagement.contractWorkflow[0].contractTransactionId || 0;
    // }
    //else if (this.isPREligible && dropDown.key === ContributorActionEnum.MODIFY_COVERAGE) {
    //  dropDown.toolTipValue = 'CONTRIBUTOR.MODIFY-COVERAGE-PR-ELIGIBILITY-TOOLTIP';
    //  dropDown.toolTipParam = null;
    //}
    else pendingTransactions.forEach(obj => (dropDown = this.getTooltipForPendingWorkflow(dropDown, obj)));
    return dropDown;
  }

  /** Method to get tool tip content for establishment eligibility. */
  getTooltipForEstablishmentEligibility(dropDownItem: DropDownItems, status: string): DropDownItems {
    if (dropDownItem.key === ContributorActionEnum.MODIFY) {
      //if establishment is not registered, cannot modify engagement
      dropDownItem.toolTipValue = 'CONTRIBUTOR.ESTABLISHMENT-IS-NOT-REGISTERED';
      dropDownItem.toolTipParam = null;
    } else if (dropDownItem.key === ContributorActionEnum.MODIFY_COVERAGE) {
      //if establishment is not registered, cannot modify coverage
      dropDownItem.toolTipValue = 'CONTRIBUTOR.ESTABLISHMENT-IS-NOT-REGISTERED';
      dropDownItem.toolTipParam = null;
    } else if (dropDownItem.key === ContributorActionEnum.TERMINATE) {
      //if establishment is not registered, cannot terminate engagement
      dropDownItem.toolTipValue = 'CONTRIBUTOR.TERMINATE-CONTRIBUTOR-ESTABLISHMENT-INFO';
      dropDownItem.toolTipParam = null;
    }
    //  else if (dropDownItem.key === ContributorActionEnum.TRANSFER) {
    //   dropDownItem.toolTipValue = 'CONTRIBUTOR.ENGAGEMENT-TRANSFER-DISABLE';
    //   dropDownItem.toolTipParam = null;
    // }
    else if (dropDownItem.key === ContributorActionEnum.CANCEL) {
      //if establishment is closed or not registered, cannot cancel engagement
      dropDownItem.toolTipValue =
        status === EstablishmentStatusEnum.CLOSED
          ? 'CONTRIBUTOR.CANCEL-CON.ESTABLISHMENT-IS-CLOSED'
          : 'CONTRIBUTOR.CANCEL-CON.ESTABLISHMENT-NOT-REGISTERED-INFO';
      dropDownItem.toolTipParam = null;
    } else if (dropDownItem.key === ContributorActionEnum.TRANSFER) {
      //if establishment is not registered, cannot transfer engagement
      dropDownItem.toolTipValue = 'CONTRIBUTOR.TRANSFER-CON.NO-UNREGISTERED-TRANSFER-ENGAGEMENT';
      dropDownItem.toolTipParam = null;
    }
    //if establishment is not registered, cannot add contract
    // else if (dropDownItem.key === ContributorActionEnum.ADD_CONTRACT) {
    //   dropDownItem.toolTipValue = 'CONTRIBUTOR.CONTRACT-AUTH.ESTABLISHMENT-NOT-REGISTERED-INFO';
    //   dropDownItem.toolTipParam = null;
    // }
    return dropDownItem;
  }

  /** Method to get tooltip content for pending workflow. */
  getTooltipForPendingWorkflow(dropDownItem: DropDownItems, details: TransactionRefDetails): DropDownItems {
    if (
      details.type.english === TransactionName.TERMINATE_CONTRIBUTOR &&
      dropDownItem.key === ContributorActionEnum.TERMINATE
    ) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.TERMINATE-CONTRIBUTOR-WORKFLOW-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    } else if (
      details.type.english === TransactionName.SECONDMENT_ENGAGEMENT &&
      dropDownItem.key === ContributorActionEnum.TERMINATE
    ) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.SECONDMENT-WORKFLOW-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    } else if (
      details.type.english === TransactionName.STUDY_LEAVE_ENGAGEMENT &&
      dropDownItem.key === ContributorActionEnum.TERMINATE
    ) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.STUDY_LEAVE-WORKFLOW-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    } else if (
      details.type.english === TransactionName.TRANSFER_CONTRIBUTOR &&
      dropDownItem.key === ContributorActionEnum.TRANSFER
    ) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.TRANSFER-CON.TRANSFER-ENGAGEMENT-WORKFLOW-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    } else if (
      details.type.english === TransactionName.CANCEL_CONTRIBUTOR &&
      dropDownItem.key === ContributorActionEnum.CANCEL
    ) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.CANCEL-CON.CANCEL-ENGAGEMENT-WORKFLOW-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    } else if (
      details.type.english === TransactionName.MANAGE_WAGE &&
      dropDownItem.key === ContributorActionEnum.MODIFY
    ) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.WAGE.UPDATE-CURRENT-WAGE-PENDING-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    } else if (
      details.type.english === TransactionName.CHANGE_ENGAGEMENT &&
      dropDownItem.key === ContributorActionEnum.MODIFY
    ) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.WAGE.UPDATE-CHANGE-ENGAGEMENT-PENDING-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    } else if (details.type.english === TransactionName.MAINTAIN_COVERAGE) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.MODIFY-COVERAGE-WORKFLOW-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    }
    return dropDownItem;
  }
  /** Method to get tooltip content for all disabled options if secondment or study leave pending. */
  getTooltipForDisableAll(dropDownItem: DropDownItems, details: TransactionRefDetails): DropDownItems {
    if (details.type.english === TransactionName.SECONDMENT_ENGAGEMENT) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.SECONDMENT-WORKFLOW-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    } else if (details.type.english === TransactionName.STUDY_LEAVE_ENGAGEMENT) {
      dropDownItem.toolTipValue = 'CONTRIBUTOR.STUDY_LEAVE-WORKFLOW-INFO';
      dropDownItem.toolTipParam = details.referenceNo;
    }
    return dropDownItem;
  }
  /** Method to handle actions. */
  handleEngagementAction(selectedValue: string) {
    this.manageWageService.referenceNo = null;
    this.manageWageService.contractId = null;
    this.manageWageService.draftNeeded = null;
    if (selectedValue === ContributorActionEnum.ADD_CONTRACT) {
      // if (!this.checkContractEligibility()) {
      //   if (this.engagement.contractWorkflow[0]?.contractTransactionId && this.engagement.contractWorkflow[0]?.draft) {
      //     this.showModal(this.draftRequiredTemplate);
      //     this.transactionTraceId = this.engagement.contractWorkflow[0]?.contractTransactionId;
      //     this.manageWageService.referenceNo = this.transactionTraceId;
      //     this.manageWageService.contractId = this.engagement.contractWorkflow[0]?.contractId;
      //     this.selectedValue = selectedValue;
      //   } else
      //     this.edit.emit({
      //       index: this.index,
      //       engagementValue: this.engagement.engagementId,
      //       selectedValue: selectedValue
      //     });
      // }
    } else if (
      selectedValue === ContributorActionEnum.CANCEL_ENGAGEMENT ||
      selectedValue === ContributorActionEnum.MODIFY_JOINING_DATE ||
      selectedValue === ContributorActionEnum.MODIFY_LEAVING_DATE ||
      selectedValue === ContributorActionEnum.TERMINATE_ENGAGEMENT
    ) {
      this.modifyEngagement.comments = null;
      this.modifyEngagement.leavingReason.english = this.engagement.leavingReason?.english;
      this.modifyEngagement.leavingReason.arabic = this.engagement.leavingReason?.arabic;
      //this.modifyEngagement.leavingDate.gregorian = this.engagement.leavingDate?.gregorian;
      this.modifyEngagement.leavingDate.hijiri = null;
      //this.modifyEngagement.joiningDate.gregorian = this.engagement.joiningDate?.gregorian;
      this.modifyEngagement.joiningDate.hijiri = null;
      if (selectedValue === ContributorActionEnum.MODIFY_JOINING_DATE) {
        this.modifyEngagement.violationSubType = 'Modify Joining Date';
        this.modifyEngagement.violationType = 'Modify Engagement';
      } else if (selectedValue === ContributorActionEnum.MODIFY_LEAVING_DATE) {
        this.modifyEngagement.violationType = 'Modify Engagement';
        this.modifyEngagement.violationSubType = 'Modify Leaving Date';
      } else if (selectedValue === ContributorActionEnum.TERMINATE_ENGAGEMENT) {
        this.modifyEngagement.violationType = 'Terminate Engagement';
        this.modifyEngagement.violationSubType = null;
      } else if (selectedValue === ContributorActionEnum.CANCEL_ENGAGEMENT) {
        this.modifyEngagement.violationType = 'Cancel Engagement';
        this.modifyEngagement.violationSubType = null;
      }
      this.manageWageService
        .openEngagementDate(this.nin, this.engagement.engagementId, this.modifyEngagement)
        .subscribe(
          res => {
            this.engagement.selectedItem = selectedValue;
            this.individualActions.emit(this.engagement);
          },
          err => {
            if (err.status === 400) {
              this.language.subscribe(language => {
                this.lang = language;
              });
              if (err.error.details) {
                this.errDetails = [];
                for (var i = 0; i < err.error.details?.length; i++) {
                  if (this.lang == 'en') {
                    this.errDetails[i] = err?.error?.details[i]?.message?.english;
                  } else if (this.lang == 'ar') {
                    this.errDetails[i] = err?.error?.details[i]?.message?.arabic;
                  }
                }
              } else {
                if (this.lang == 'en') {
                  this.errMessage = err.error.message.english;
                } else if (this.lang == 'ar') {
                  this.errMessage = err.error.message.arabic;
                }
              }
              this.showModalPopUp(this.einspectionPopUpTemplate, 'lg');
            }
          }
        );
    } else if (selectedValue === ContributorActionEnum.VIEW_CONTRACT) {
      this.fetchContracts.emit(this.engagement);
    } else {
      if (selectedValue === ContributorActionEnum.MODIFY) {
        if (this.engagement.pendingTransaction.length != 0) {
          this.engagement.pendingTransaction.forEach(item => {
            if (item.type.english === TransactionName.CHANGE_ENGAGEMENT && item.referenceNo && item.draft) {
              this.showModal(this.draftRequiredTemplate);
              this.transactionTraceId = item.referenceNo;
              this.manageWageService.referenceNo = item.referenceNo;
              this.selectedValue = selectedValue;
            } else
              this.edit.emit({
                index: this.index,
                engagementValue: this.engagement.engagementId,
                selectedValue: selectedValue
              });
          });
        } else
          this.edit.emit({
            index: this.index,
            engagementValue: this.engagement.engagementId,
            selectedValue: selectedValue
          });
      } else
        this.edit.emit({
          index: this.index,
          engagementValue: this.engagement.engagementId,
          selectedValue: selectedValue
        });
    }
  }

  showModalPopUp(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to check contract eligibility. */
  checkContractEligibility() {
    let flag = false;
    if (this.engagement?.contracts) {
      if (this.engagement?.contracts[0]?.status === 'CONTRACT_PENDING_CON') {
        flag = true;
        this.showModal(this.cancelContractTemplate);
      }
    }
    return flag;
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to hide modal. */
  hideModal() {
    this.errDetails = [];
    this.modalRef.hide();
  }

  /** Method to cancel contract which is pending with contributor. */
  confirmCancelContract() {
    this.hideModal();
    this.cancelContract.emit({
      contractId: this.engagement.contracts[0]?.id,
      engagmentId: this.engagement.contracts[0]?.engagementId,
      status: this.engagement?.contracts[0]?.status
    });
  }
  showDraft() {
    this.manageWageService.draftNeeded = true;
    this.hideModal();
    this.edit.emit({
      index: this.index,
      engagementValue: this.engagement.engagementId,
      selectedValue: this.selectedValue
    });
  }

  clearDraft() {
    this.manageWageService.draftNeeded = false;
    this.hideModal();
    this.edit.emit({
      index: this.index,
      engagementValue: this.engagement.engagementId,
      selectedValue: this.selectedValue
    });
  }
}
