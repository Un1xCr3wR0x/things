/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, LovList, scrollToModalError, AppConstants } from '@gosi-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'frm-return-template-dc',
  templateUrl: './return-template-dc.component.html',
  styleUrls: ['./return-template-dc.component.scss']
})
export class ReturnTemplateDcComponent extends BaseComponent implements OnInit, OnDestroy {
  //returnInfo: Alert = new Alert();
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  //Input Variables
  @Input() heading = '';
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() returnReasonList$: Observable<LovList> = null;
  @Input() warningMessage: string;
  @Input() commentsMandatory = false;
  @Input() multiValues = false;

  //Output Variables
  @Output() returnEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();

  //Local Variables
  returnMultiReason;
  returnReason: FormGroup = new FormGroup({});
  comments: FormControl = new FormControl(null, { updateOn: 'blur' });
  reList: LovList;

  /**
   * Creates an instance of ReturnTemplateDcComponent
   * @memberof  ReturnTemplateDcComponent
   *
   */
  constructor(private fb: FormBuilder) {
    super();
    this.returnReason = this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }

  /** This method is to initialise the component */
  ngOnInit() {
    if (this.multiValues === true) {
      this.returnMultiReason = new FormControl();
      this.returnReason = this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { updateOn: 'blur' }]
      });
    }
    if (this.parentForm) {
      if (this.multiValues === false) {
        this.parentForm.get('returnReason')
          ? this.parentForm.removeControl('returnReason')
          : this.parentForm.addControl('returnReason', this.returnReason);
      } else {
        this.parentForm.get('returnReason')
          ? this.parentForm.removeControl('returnReason')
          : this.parentForm.addControl('returnReason', this.returnMultiReason);
        this.parentForm.get('returnMultiReason')
          ? this.parentForm.removeControl('returnMultiReason')
          : this.parentForm.addControl('returnMultiReason', this.returnReason);
      }

      this.parentForm.get('comments')
        ? this.parentForm.removeControl('comments')
        : this.parentForm.addControl('comments', this.comments);
      if (this.commentsMandatory) {
        this.comments.setValidators(Validators.required);
      }
    }
  }
  returnReasons(item) {
    const returnList = { english: item.english, arabic: item.arabic };
    return returnList;
  }

  /** This method is to make comments section mandatory */
  commentMandatory(event) {
    this.comments.clearValidators();
    if (this.multiValues === true) {
      this.reList = event.map(this.returnReasons);
    }
    if (this.returnReason.get('english').value === 'Others' || this.commentsMandatory) {
      this.comments.setValidators(Validators.required);
    } else {
      this.comments.clearValidators();
    }
    this.comments.markAsUntouched();
    this.comments.markAsPristine();
    this.comments.updateValueAndValidity();
  }
  /** This method is to return the transaction */
  returnTransaction() {
    if (this.multiValues === true) {
      this.returnMultiReason.setValue(this.reList);
      this.parentForm.removeControl('returnMultiReason');
    }

    this.parentForm.markAllAsTouched();
    this.parentForm.updateValueAndValidity();
    if (this.parentForm.valid) {
      this.returnEvent.emit();
    } else {
      scrollToModalError();
    }
  }
  /** This method is to clear the transaction */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.parentForm.removeControl('returnReason');
    this.parentForm.removeControl('comments');
    this.parentForm.removeControl('returnMultiReason');
  }
  // Method to emit cancel details

  cancelEventDetails() {
    this.cancelEvent.emit();
  }
}
