import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, RouterConstants } from '@gosi-ui/core';
import { BulkReassignTabDcComponent } from '../bulk-reassign-tab-dc/bulk-reassign-tab-dc.component';
import { TeamManagementService } from '../../shared';
import { ReclaimTransactionDetails } from '../../shared/models/reclaim-transaction-details';
import { ReclaimPostResponse } from '../../shared/models/reclaim-post-response';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'gosi-ui-bulk-reassign-transactions-sc',
  templateUrl: './bulk-reassign-transactions-sc.component.html',
  styleUrls: ['./bulk-reassign-transactions-sc.component.scss']
})
export class BulkReassignTransactionsScComponent implements OnInit {

  currentTab = 0;
  transactionForms: FormGroup = new FormGroup({});
  transactionRefNo: number;
  transactionDetails: ReclaimTransactionDetails;
  isVerified: boolean;
  reclaimPostResponse: ReclaimPostResponse;
  maxLength = 10;
  message = {
    arabic: 'تم انشاء سحب المعاملة من بريد المشرف',
    english: 'Transaction Reclaim from Admin inbox Initiated'
  };
  
  constructor(public router: Router,
    readonly TeamManagementService: TeamManagementService,
    
    readonly alertService: AlertService) { }

  @ViewChild(BulkReassignTabDcComponent) child:BulkReassignTabDcComponent;

  ngOnInit(): void {
  }

  /**
   * method for back button
   */
  onBack() { }

  verifytransactionId(){
    this.alertService.clearAlerts();
    this.isVerified = false;
    const transactionRefNo =  this.transactionForms.get('reclaimTransactionForm').get('transactionRefNo').value;
    this.transactionForms.get('reclaimTransactionForm').markAllAsTouched();
    if(this.transactionForms.get('reclaimTransactionForm').valid){
    this.TeamManagementService.getReclaimTransactionDetails(transactionRefNo).subscribe(res => {
      this.transactionDetails = res;
      this.isVerified = true;
    },
    err => {
      if (err.error.details && err.error.details.length > 0) {
        this.alertService.showError(err.error.details[0]?.message)
      } else {
        this.alertService.showError(err.error.message);
      }
    }
    );
  }
  else{
    this.alertService.showMandatoryErrorMessage();
  }
    }

  reclaimTransaction(){
    this.TeamManagementService
    .saveReclaimTransactionDetails(this.transactionDetails.transactionRefNo, {
      commentScope:'BPM',
      comments: null,
      isExternalComment: true,
      outcome: this.transactionDetails?.customActions[0]

    })
    .subscribe(res => {
      this.reclaimPostResponse = res;
      this.transactionForms.get('reclaimTransactionForm').reset();
      this.isVerified = false;
      this.alertService.showSuccess(this.message);
    },
    err => {
      if (err.error.details && err.error.details.length > 0) {
        this.alertService.showError(err.error.details[0]?.message)
      } else {
        this.alertService.showError(err.error.message);
      }
    }
    );
  }

  /**
  * Method to set selected tab
  * @param tab
  */

  onSelect(tab) {
    this.currentTab = tab;
    switch (tab) {
      case 0:
        this.alertService.clearAlerts();
        //this.router.navigate([RouterConstants.ROUTE_BULK_REASSIGN]);
        break;
      case 1:
        this.alertService.clearAlerts();
        //this.router.navigate([RouterConstants.ROUTE_REASSIGN_HISTORY]);
        break;
        case 2:
          this.alertService.clearAlerts();
          this.child.onTabClick();
          break;
    }
  }
}
