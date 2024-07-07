/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, LovList, scrollToModalError, AppConstants } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'frm-reject-template-dc',
  templateUrl: './reject-template-dc.component.html',
  styleUrls: ['./reject-template-dc.component.scss']
})
export class RejectTemplateDcComponent extends BaseComponent implements OnInit, OnDestroy {
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  //Input Variables
  @Input() heading = '';
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() rejectReasonList$: Observable<LovList> = null;
  @Input() transactionNumber = 'Not Available';
  @Input() warningMessage: string;
  @Input() commentsMandatory = false;
  @Input() multiValues = false;
  @Input() injuryRejectReasonList$: Observable<LovList> = null;
  @Input() isComplication = false;
  @Input() isRejectInjury = false;
  @Input() type = 'warning';
  @Input() allowanceFlag: boolean;
  @Input() repatriation: boolean;
  //OUtput Variables
  @Output() rejectEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  @Output() reject: EventEmitter<null> = new EventEmitter();

  //Local Variables
  dismissible = false;
  statusEst: string;
  errorMessage = '';
  modalHeader = '';
  bsModalRef: BsModalRef;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  rejectionMultiReason;
  rejectionReason: FormGroup = new FormGroup({});
  injuryRejectionReason: FormGroup = new FormGroup({});
  comments: FormControl = new FormControl(null, { updateOn: 'blur' });
  injuryRejectFlag: FormControl = new FormControl(false);
  parentInjuryRejectFlag: FormControl = new FormControl(false);
  reList: LovList;
  /**
   * Creates an instance of RejectTemplateDcComponent
   * @memberof  RejectTemplateDcComponent
   *
   */
  constructor(private fb: FormBuilder, readonly bsModalService: BsModalService, readonly router: Router) {
    super();
    this.rejectionReason = this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
    this.injuryRejectionReason = this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }

  //This method is to initialize the component
  ngOnInit() {
    if (this.multiValues === true) {
      this.rejectionMultiReason = new FormControl();
      this.rejectionReason = this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { updateOn: 'blur' }]
      });
    }
    if (this.parentForm) {
      if (this.multiValues === false) {
        this.parentForm.get('rejectionReason')
          ? this.parentForm.removeControl('rejectionReason')
          : this.parentForm.addControl('rejectionReason', this.rejectionReason);
      } else {
        this.parentForm.get('rejectionReason')
          ? this.parentForm.removeControl('rejectionReason')
          : this.parentForm.addControl('rejectionReason', this.rejectionMultiReason);
        this.parentForm.get('rejectionMultiReason')
          ? this.parentForm.removeControl('rejectionMultiReason')
          : this.parentForm.addControl('rejectionMultiReason', this.rejectionReason);
      }

      if (this.isComplication) {
        this.parentForm.get('injuryRejectionReason')
          ? this.parentForm.removeControl('injuryRejectionReason')
          : this.parentForm.addControl('injuryRejectionReason', this.injuryRejectionReason);
      }
      this.parentForm.get('comments')
        ? this.parentForm.removeControl('comments')
        : this.parentForm.addControl('comments', this.comments);
      if (this.isRejectInjury && !this.allowanceFlag && !this.repatriation) {
        this.parentForm.get('injuryRejectFlag')
          ? this.parentForm.removeControl('injuryRejectFlag')
          : this.parentForm.addControl('injuryRejectFlag', this.injuryRejectFlag);
        if (this.isComplication) {
          this.parentForm.get('parentInjuryRejectFlag')
            ? this.parentForm.removeControl('parentInjuryRejectFlag')
            : this.parentForm.addControl('parentInjuryRejectFlag', this.parentInjuryRejectFlag);
        }
      }
      if (this.commentsMandatory) {
        this.comments.setValidators(Validators.required);
      }
    }
  }
  rejectReason(item) {
    const rejectList = { english: item.english, arabic: item.arabic };
    return rejectList;
  }
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string): void {
    const config = {};
    if (size) {
      Object.assign(config, { class: 'modal-' + size });
    }
    this.bsModalRef = this.bsModalService.show(modalRef, config);
  }
  /** This method is to make comments section mandatory */
  commentMandatory(event) {
    this.comments.clearValidators();
    if (this.multiValues === true) {
      this.reList = event.map(this.rejectReason);
    }

    if (
      this.rejectionReason.get('english').value === 'Others' ||
      this.rejectionReason.get('english').value === 'Other' ||
      this.commentsMandatory ||
      this.injuryRejectFlag?.value ||
      this.parentInjuryRejectFlag?.value
    ) {
      this.comments.setValidators(Validators.required);
    } else {
      this.comments.clearValidators();
    }
    this.comments.markAsUntouched();
    this.comments.markAsPristine();
    this.comments.updateValueAndValidity();
    if (event === 'true') {
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.APPROVAL_OF_AUTHORIZATION';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION';
    }
  }
  /** This method is to reject transaction */
  rejectTransaction() {
    if (
      this.parentForm.get('rejectionReason').get('english').value !==
      'The complication is rejected because the injury is rejected'
    ) {
      this.parentForm.removeControl('injuryRejectionReason');
    }
    if (this.multiValues === true) {
      this.rejectionMultiReason.setValue(this.reList);
      this.parentForm.removeControl('rejectionMultiReason');
    }
    if (this.comments.value === null && this.comments.valid) {
      this.parentForm.removeControl('comments');
    }
    this.parentForm.markAllAsTouched();
    this.parentForm.updateValueAndValidity();
    if (this.parentForm.valid) {
      this.rejectEvent.emit();
    } else {
      scrollToModalError();
    }
  }
  /** This method is to clear transaction */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.parentForm.removeControl('rejectionReason');
    this.parentForm.removeControl('injuryRejectionReason');
    this.parentForm.removeControl('comments');
    this.parentForm.removeControl('parentInjuryRejectFlag');
    this.parentForm.removeControl('injuryRejectFlag');
    this.parentForm.removeControl('rejectionMultiReason');
  }
  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.bsModalRef.hide();
    if (this.dismissible) {
      this.router.navigate([`home/oh/injury/reopen`]);
    }
  }

  // Method to emit cancel details

  cancelEventDetails() {
    this.cancelEvent.emit();
  }
}
