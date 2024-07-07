/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  TransactionWorkflowDetails,
  IdentityManagementService,
  AppConstants,
  BPMTaskConstants,
  TransactionStatus,
  TransactionWorkflowItem
} from '@gosi-ui/core';

@Component({
  selector: 'gosi-workflow-sc',
  templateUrl: './workflow-sc.component.html',
  styleUrls: ['./workflow-sc.component.scss']
})
export class WorkflowScComponent implements OnInit, OnChanges {
  @Input() workflowItems: TransactionWorkflowDetails;
  isProfileLoaded = false;
  constructor(readonly identityManagementService: IdentityManagementService) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.workflowItems && changes.workflowItems.currentValue) {
      this.workflowItems = changes.workflowItems.currentValue;
      if (this.workflowItems.workFlowList) {
        this.workflowItems.workFlowList.forEach(item => {
          if (item.approverName?.english.toLowerCase() === BPMTaskConstants.ITSM_GROUP.toLowerCase()) {
            item.approverName.english = 'ITSM';
            item.approverName.arabic = 'بلاغ تقني';
          }
        });
      }
      if (this.workflowItems.transactionList) {
        this.workflowItems.transactionList.forEach(item => {
          if (item.approverName?.english.toLowerCase() === BPMTaskConstants.ITSM_GROUP.toLowerCase()) {
            item.approverName.english = 'ITSM';
            item.approverName.arabic = 'بلاغ تقني';
          }
        });
      }
    }
    this.isProfileLoaded = false;
  }
  showDetails() {
    if (!this.isProfileLoaded) {
      this.isProfileLoaded = true;
      this.workflowItems?.transactionList.forEach(item => {
        if (
          item.approverName &&
          item.approverName.english &&
          item.approverName.english.toLowerCase() !== AppConstants.GOSI_LABEL.english.toLowerCase() &&
          item.approverName.english.toLowerCase() !== BPMTaskConstants.BPM_SYSTEM.toLowerCase() &&
          item.approverName.english.toLowerCase() !== BPMTaskConstants.ITSM_GROUP.toLowerCase() &&
          item.approverName.english.toLowerCase() !== BPMTaskConstants.ITSM.toLowerCase()
        ) {
          if (item.status.english.toLowerCase() === TransactionStatus.SUSPENDED.toLowerCase()) {
            this.getUserProfileName(item);
          }
          else if (item.assigneeName) {
            if (item.approverRole && item.approverRole.english !== 'AdminPool') {
              item.approverName.arabic = item.approverName.english = item.assigneeName;
            } else {
              item.approverRole.arabic = item.approverRole.english;
            }
          } else if (item.approverName.english) {
            item.isProfileLoading = true;
            this.identityManagementService.getProfile(item.approverName.english).subscribe(
              profile => {
                if (profile && profile.longNameArabic) {
                  item.approverName.arabic = item.approverName.english = profile.longNameArabic;
                } else item.approverName.arabic = item.approverName.english;
                item.isProfileLoading = false;
              },
              () => {
                item.approverName.arabic = item.approverName.english;
                item.isProfileLoading = false;
              }
            );
          }
        }
      });
    }
  }

  getUserProfileName(workflowItem: TransactionWorkflowItem) {
    workflowItem.isProfileLoading = true;
    this.identityManagementService.getProfile(workflowItem.approverName.english).subscribe(
      profile => {
        if (profile && profile.longNameArabic) {
          workflowItem.approverName.arabic = workflowItem.approverName.english = profile.longNameArabic;
        } else workflowItem.approverName.arabic = workflowItem.approverName.english;
        workflowItem.isProfileLoading = false;
      },
      () => {
        workflowItem.approverName.arabic = workflowItem.approverName.english;
        workflowItem.isProfileLoading = false;
      }
    );
  }
}
