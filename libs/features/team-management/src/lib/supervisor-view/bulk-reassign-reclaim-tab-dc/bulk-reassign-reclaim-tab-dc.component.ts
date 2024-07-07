import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertService} from '@gosi-ui/core';
import { TeamManagementService } from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReclaimTransactionDetails } from '../../shared/models/reclaim-transaction-details';
import { ReclaimPostResponse } from '../../shared/models/reclaim-post-response';
import { Location } from '@angular/common';

@Component({
  selector: 'gosi-ui-bulk-reassign-reclaim-tab-dc',
  templateUrl: './bulk-reassign-reclaim-tab-dc.component.html',
  styleUrls: ['./bulk-reassign-reclaim-tab-dc.component.scss']
})
export class BulkReassignReclaimTabDcComponent implements OnInit {
  reclaimTransactionForm: FormGroup;
  transactionRefNo: number;
  reclaimPostResponse: ReclaimPostResponse;
  maxLength = 10;
  @Input() transactionDetails: ReclaimTransactionDetails;
  @Input() isVerified: boolean;
  @Input() parentForm: FormGroup; 
  @Output() getVerifyTransaction: EventEmitter<null> = new EventEmitter();
  @Output() getReclaimTransaction: EventEmitter<null> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    readonly TeamManagementService: TeamManagementService,
    readonly alertService: AlertService,
    readonly location: Location,
  ) { }

  ngOnInit(): void {
    this.reclaimTransactionForm = this.fb.group({
      transactionRefNo: [null, { validators: [Validators.required, Validators.minLength(8)] }]
    });
    if ( this.reclaimTransactionForm && this.parentForm) {
      this.parentForm.addControl('reclaimTransactionForm', this.reclaimTransactionForm);
    }
  }
  verifytransactionId(){
    this.getVerifyTransaction.emit();
    }
    reclaimTransaction(){
      this.getReclaimTransaction.emit();
    }
    onChange(event?) {
      this.alertService.clearAlerts();
      if(event.inputType == 'deleteContentBackward' || event.inputType == 'insertFromPaste' ||  event.inputType == 'insertText'){
        this.isVerified = false; 
      }

    }
  }


