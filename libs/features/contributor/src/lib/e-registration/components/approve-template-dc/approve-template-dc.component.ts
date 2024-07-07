/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, AppConstants } from '@gosi-ui/core';

@Component({
  selector: 'frm-approve-template-dc',
  templateUrl: './approve-template-dc.component.html',
  styleUrls: ['./approve-template-dc.component.scss']
})
export class ApproveTemplateDcComponent extends BaseComponent implements OnInit, OnDestroy {
  //Local Variables
  comments: FormControl = new FormControl(null, { updateOn: 'blur' });
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  //Input Variables
  @Input() heading = 'CONTRIBUTOR.E-APPROVE';
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() isCommentsMandatory: false;
  @Input() infoMessage: string;

  //Output Variables
  @Output() approveEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of ApproveTemplateDcComponent
   * @memberof  ApproveTemplateDcComponent
   *
   */
  constructor() {
    super();
  }

  /**
   * This method handles the initialization tasks.
   * @memberof  ApproveTemplateDcComponent
   */
  ngOnInit() {
    // if (this.isCommentsMandatory && this.parentForm) {
      this.comments = new FormControl(null, { validators: Validators.required });
      this.parentForm.get('comments')
        ? this.parentForm.removeControl('comments')
        : this.parentForm.addControl('comments', this.comments);
    // } else if (this.parentForm) {
    //   this.parentForm.get('comments')
    //     ? this.parentForm.removeControl('comments')
    //     : this.parentForm.addControl('comments', this.comments);
    // }
  }

  /**
   * This method handles the clearing of tasks.
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.parentForm.removeControl('comments');
  }

  // Method to emit  approve details

  approveEventDetails() {
    this.parentForm.markAllAsTouched();
    if (this.comments.valid) {
      this.approveEvent.emit();
    }
  }

  // Method to emit cancel details

  cancelEventDetails() {
    this.cancelEvent.emit();
  }
}
