/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { RoleIdEnum } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContributorConstants, ManageWageConstants } from '../../../../shared/constants';
import { ContributorActionEnum, TransactionName } from '../../../../shared/enums';
import { DropDownItems, EngagementDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-vic-engagement-view-dc',
  templateUrl: './vic-engagement-view-dc.component.html',
  styleUrls: ['./vic-engagement-view-dc.component.scss']
})
export class VicEngagementViewDcComponent implements OnInit {
  /** Local variables. */
  dropDownitems: Array<DropDownItems> = ManageWageConstants.VicActionsDropdown;
  modalRef: BsModalRef;

  /**Input variables */
  @Input() engagement: EngagementDetails;
  @Input() isFirst = false;
  @Input() index: number;
  @Input() isNin: boolean;
  @Input() currentUserRoles: string[];
  @Input() individualApp: boolean;
  @Input() isPREligible: boolean;

  /** Output Variables. */
  @Output() edit = new EventEmitter<object>(null);
  @Output() navigateToBillDash: EventEmitter<null> = new EventEmitter();

  /** Child Components. */
  @ViewChild('noPaidMonth') noPaidMonth: TemplateRef<HTMLElement>;

  /** Creates an instance of VicEngagementViewDcComponent. */
  constructor(readonly modalService: BsModalService) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    if (this.individualApp) {
      this.dropDownitems = ManageWageConstants.VicIndividualActionsDropdown;
    } else {
      this.createActionList();
    }
  }

  /** Method to create action list. */
  createActionList() {
    this.filterActions();
    this.disableActions();
    this.checkUserPrivileges();
  }

  /**Method to disable dropdownitems based on pending transactions */
  disableActions() {
    if (this.engagement.pendingTransaction?.length > 0)
      this.engagement.pendingTransaction.forEach(transRef => {
        switch (transRef.type.english) {
          case TransactionName.CANCEL_VIC:
            this.addTooltip(
              ContributorActionEnum.CANCEL,
              'CONTRIBUTOR.CANCEL-VIC.CANCEL-VIC-IN-PROGRESS',
              transRef.referenceNo
            );
            break;
          case TransactionName.TERMINATE_VIC:
            this.addTooltip(
              ContributorActionEnum.TERMINATE,
              'CONTRIBUTOR.TERMINATE-VIC.TERMINATE-VIC-IN-PROGRESS',
              transRef.referenceNo
            );
            break;
          case TransactionName.MANAGE_VIC_WAGE:
            this.addTooltip(
              ContributorActionEnum.MODIFY,
              'CONTRIBUTOR.VIC-WAGE-UPDATE.VIC-WAGE-UPDATE-IN-PROGRESS',
              transRef.referenceNo
            );
            break;
        }
      });
  }
  /**Method to set tooltip values for dropdown */
  addTooltip(dropdownType: string, toolptipValue: string, referenceNo: number): void {
    this.dropDownitems.forEach(dropdownItem => {
      if (dropdownItem.key === dropdownType) {
        dropdownItem.disabled = true;
        dropdownItem.toolTipValue = toolptipValue;
        if (referenceNo) dropdownItem.toolTipParam = referenceNo;
      }
    });
  }
  /** Method to filter actions. */
  filterActions() {
    //to remove terminate and modify for inactive engagements
    if (!ContributorConstants.ENGAGEMENT_ACTIVE_STATUS.includes(this.engagement.status)) {
      if (
        this.engagement.status !== ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS ||
        (this.engagement.status === ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS &&
          this.engagement.leavingDate?.gregorian)
      ) {
        this.dropDownitems.shift();
        this.dropDownitems.pop();
        // this.dropDownitems.push(
        //   ManageWageConstants.getDropDownItems(
        //     ContributorActionEnum.VIEW_VIC_BILL_DASH,
        //     'file-contract',
        //     'View-Contract.svg'
        //   )
        // );
      }
      if (this.engagement.status === ContributorConstants.ENGAGEMENT_CANCELLED_STATUS) {
        this.dropDownitems = [];
        this.dropDownitems.push(ManageWageConstants.REACTIVATE_ENGAGEMENT_DROPDOWN);
       }
    } else {
      if (this.engagement.vicNoOfPaidMonths === 0 && this.engagement.vicNoOfUnpaidMonths >= 6)
        this.dropDownitems = this.dropDownitems.filter(item => item.key !== ContributorActionEnum.CANCEL);
    }
  }

  /** Method to check user privileges. */
  checkUserPrivileges() {
    //Only CSR can perform VIC related transactions.
    if (this.currentUserRoles?.length === 0 || !this.currentUserRoles?.includes(RoleIdEnum.CSR.toString()))
      this.dropDownitems = [];
  }

  /** Method to handle actions. */
  handleEngagementAction(selectedValue: string) {
    if (
      selectedValue === ContributorActionEnum.TERMINATE &&
      ((this.engagement.vicNoOfPaidMonths === 0 && !this.isPREligible) ||
        (this.engagement.vicNoOfPaidMonths === 0 && this.engagement.vicNoOfPaidDays === 0 && this.isPREligible))
    ) {
      this.showModal(this.noPaidMonth);
    } else {
      if (selectedValue === ContributorActionEnum.VIEW_VIC_BILL_DASH) {
        this.navigateToBillDashboard();
      } else {
        this.edit.emit({
          index: this.index,
          selectedValue: selectedValue
        });
      }
    }
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-md modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to hide modal. */
  hideModal(): void {
    this.modalService.hide();
  }

  /** Method to navigate to cancel Vic. */
  navigateToCancelVic(): void {
    this.hideModal();
    this.edit.emit({
      index: this.index,
      selectedValue: ContributorActionEnum.CANCEL
    });
  }
  navigateToBillDashboard() {
    this.navigateToBillDash.emit();
  }
}
