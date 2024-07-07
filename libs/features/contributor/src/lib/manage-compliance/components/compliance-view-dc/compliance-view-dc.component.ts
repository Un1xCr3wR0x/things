/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import * as moment from 'moment';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Alert,
  AlertIconEnum,
  AlertService,
  AlertTypeEnum,
  DocumentItem,
  LovList,
  markFormGroupTouched,
  WorkFlowActions,
  TransactionService
} from '@gosi-ui/core';
import { MaxLengthEnum, TransactionId } from '../../../shared/enums';
import { Choice } from '../../../shared/models';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { async } from '@angular/core/testing';

@Component({
  selector: 'cnt-compliance-view-dc',
  templateUrl: './compliance-view-dc.component.html',
  styleUrls: ['./compliance-view-dc.component.scss']
})
export class ComplianceViewDcComponent implements OnInit, OnChanges {
  @Input() contributor;
  @Input() currentLang;
  @Input() establishmentDetails;
  @Input() registrationNumber;
  @Input() engagement;
  @Input() payload;
  @Input() violationDetails;
  @Input() referanceNumber;
  @Input() documents;
  @Input() state;
  @Input() transactionRefData;
  @Input() uuid;
  @Input() isAnyDoc;
  @Input() isBillBatch;
  @Input() isModifyCoverage;
  @Input() taskId;
  @Input() isUnclaimed;
  @Input() isKashefChannel: boolean;

  @Output() onSubmitClicked: EventEmitter<Choice> = new EventEmitter<Choice>();
  @Output() onRefreshDoc: EventEmitter<DocumentItem> = new EventEmitter<DocumentItem>();
  @Output() onCancelClicked: EventEmitter<null> = new EventEmitter();
  minDiff: any;
  secDiff: any;
  penaltyInfo: Alert;
  infoMessage: string;
  cancelEngList: LovList = new LovList([]);
  cancelEngForm: FormGroup;
  parentForm: FormGroup = new FormGroup({});
  isEditMode = false;
  isCommentRequired;
  cancelEngBusinessKey;
  isDocumentUpload;
  commentMaxLength = MaxLengthEnum.COMMENTS;
  seconds: string;
  isUpdateWage = false;
  constructor(
    protected fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.cancelEngBusinessKey =
      this.violationDetails?.violationType?.english === 'Cancel Engagement'
        ? TransactionId.CANCEL_ENGAGEMENT_VIOLATION
        : this.violationDetails?.violationType?.english === 'Terminate Engagement'
        ? TransactionId.TERMINATE_ENGAGEMENT_VIOLATION
        : TransactionId.CHANGE_ENGAGEMENT_VIOLATION;
    this.showPenaltyInfo();
    this.initialiseCancelChoice();
    this.initialiseForm();
    this.isCommentRequired = true;
    this.calculateTimeDiff();
  }
  // this method is used to get values on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isAnyDoc?.currentValue) {
      this.initialiseForm();
    }
    if (changes?.violationDetails?.currentValue) {
      if (this.violationDetails.wage) this.isUpdateWage = true;
    }
  }
  claimTask() {
    this.calculateTimeDiff();
    this.transactionService.accquireTasks(this.taskId).subscribe(
      (res: any) => {
        const value = {
          english:
            'Transaction has been assigned . You can now process the transaction or release it back to Establishment inbox ',
          arabic: 'تم إسناد المعاملة، بإمكانك البدء بمعالجة المعاملة او ارجعاها إلى صندوق بريد المنشاة '
        };
        this.alertService.showSuccess(value);
        this.isUnclaimed = false;
      },
      err => {
        //console.log(err.error.status, err.headers.status);
        const value = {
          english: 'This Transaction can’t be assigned. Another admin have already assigned it to him ',
          arabic: 'لا يمكن اسناد المعاملة. لقد تم اسناد المعاملة من قبل مشرف آخر'
        };
        this.router.navigate(['home/transactions/list/todolist']);
        this.alertService.showError(value);
        setTimeout(() => {
          this.alertService.showError(value);
        }, 500);
      }
    );
    //  this.onClaimClicked.emit();
  }
  calculateTimeDiff() {
    var currentDate: any = this.payload.currentDate;
    var convertedDate: any = moment.tz(currentDate, 'Asia/Riyadh');
    var expDate: any = this.payload.claimTaskExpiry;
    // console.log(currentDate,convertedDate.format())
    var updated = moment(convertedDate.format(), 'DD-MM-YYYY HH:mm:ss'); //now
    var expiry = moment(expDate, 'DD-MM-YYYY HH:mm:ss');
    if (expDate == 'NULL') {
      this.minDiff = '89';
      this.seconds = '0';
    } else {
      this.minDiff = Math.floor(expiry.diff(updated, 'seconds') / 60);
      this.secDiff = expiry.diff(updated, 'seconds');
      this.seconds = (this.secDiff % 60).toString();
    }
  }
  release() {
    this.minDiff = '89';
    this.seconds = '0';
    this.payload.claimTaskExpiry = 'NULL';
    this.transactionService.releaseTasks(this.taskId).subscribe((res: any) => {
      const value = {
        english: 'Transaction released to Establishment Inbox',
        arabic: 'تم إعادة تعيين المعاملة إلى صندوق المنشأة'
      };
      this.alertService.showSuccess(value);
      this.isUnclaimed = true;
      setTimeout(() => {
        this.router.navigate(['home/transactions/list/todolist']);
      }, 2000);
    });
  }
  /** Method to extract messages  */
  getMessage():void{
    if(this.violationDetails?.violationSubType?.english == 'Cancel Engagement' || this.violationDetails?.violationType?.english == 'Cancel Engagement'){
      this.infoMessage = `CONTRIBUTOR.CANCEL-ENGAGEMENT-MESSAGE`;
    }else if(this.violationDetails?.violationSubType?.english =='Terminate Engagement' || this.violationDetails?.violationType.english == 'Terminate Engagement'){
      this.infoMessage = `CONTRIBUTOR.TERMINATE-ENGAGEMENT-MESSAGE`;
    }else if(this.violationDetails?.violationSubType?.english =='Modify Wage And Occupation' || this.violationDetails?.violationType.english =='Modify Wage And Occupation'){
      this.infoMessage = `CONTRIBUTOR.MODIFY-WAGE-AND-OCCUPATION-MESSAGE`;
    }
    else if(this.violationDetails?.violationSubType?.english =='Modify Leaving Date' || this.violationDetails?.violationType?.english =='Modify Leaving Date'){
      this.infoMessage = `CONTRIBUTOR.MODIFY-LEAFING-DATE-MESSAGE`;
    }else if(this.violationDetails?.violationSubType?.english =='Modify Joining Date' || this.violationDetails?.violationType?.english =='Modify Joining Date'){
      this.infoMessage = `CONTRIBUTOR.MODIFY-JOINING-DATE-MESSAGE`;
    }
    else {
      this.infoMessage = `CONTRIBUTOR.COMPLIANCE.E-INFO`;
    }
  }
  /** Method to show penalty information Alert */
  showPenaltyInfo(){
    this.getMessage();
    this.penaltyInfo = new Alert();
    this.penaltyInfo.messageKey = this.infoMessage;
    this.penaltyInfo.type = AlertTypeEnum.INFO;
    this.penaltyInfo.dismissible = false;
    this.penaltyInfo.icon = AlertIconEnum.INFO;
  }
  listenForCancelEng(decision) {
    if (decision === 'Disagree') {
      this.isDocumentUpload = true;
    } else {
      this.isDocumentUpload = false;
    }
  }
  initialiseForm() {
    this.cancelEngForm = this.fb.group({
      choice: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      comments: [''],
      acknowledge: [false, Validators.requiredTrue]
    });
    this.cancelEngForm
      .get('choice')
      .setValue(
        this.state === WorkFlowActions.RETURN || this.isAnyDoc
          ? this.cancelEngList.items[1]['value']
          : this.cancelEngList.items[0]['value']
      );
    this.listenForCancelEng(this.cancelEngForm.get('choice.english').value);
  }
  initialiseCancelChoice() {
    this.cancelEngList.items.push({ value: { english: 'Agree', arabic: 'موافق' }, sequence: 1 });
    this.cancelEngList.items.push({ value: { english: 'Disagree', arabic: 'غير موافق' }, sequence: 2 });
  }
  confirmEngagement() {
    this.cancelEngForm.markAllAsTouched();
    markFormGroupTouched(this.cancelEngForm);
    const action =
      this.cancelEngForm.get('choice').get('english').value === 'Agree'
        ? WorkFlowActions.APPROVE
        : WorkFlowActions.REJECT;
    if (this.cancelEngForm.get('acknowledge').valid) {
      this.onSubmitClicked.emit({ action: action, comments: this.cancelEngForm.get('comments').value });
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  cancelTransaction() {
    this.onCancelClicked.emit();
  }
  refreshDocument(doc) {
    this.onRefreshDoc.emit(doc);
  }
}
