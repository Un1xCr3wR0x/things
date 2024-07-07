/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AppConstants,
  BaseComponent,
  borderNoValidator,
  DocumentItem,
  lengthValidator,
  IdentifierLengthEnum,
  TransactionReferenceData
} from '@gosi-ui/core';
import { ManagePersonConstants } from '../../../shared';

@Component({
  selector: 'cim-add-border-dc',
  templateUrl: './add-border-dc.component.html',
  styleUrls: ['./add-border-dc.component.scss']
})
export class AddBorderDcComponent extends BaseComponent implements OnInit, OnDestroy {
  //Local Variables
  borderModifyForm: FormGroup;
  borderMaxLength = IdentifierLengthEnum.BORDER_ID;
  documentTransactionId = ManagePersonConstants.BORDER_DOCUMENT_ID;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  //Input Variables
  @Input() parentForm: FormGroup;
  @Input() documents: DocumentItem[] = [];
  @Input() personId: string;
  @Input() isCsr = true;
  @Input() referenceNo: number;
  @Input() comments: TransactionReferenceData[] = [];
  @Input() isComments = true;
  @Input() uuid: string;
  //Output Variables
  @Output() uploadedEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();

  /**
   * Creates an instance of AddBorderDcComponent
   * @memberof  AddBorderDcComponent
   *
   */
  constructor(private fb: FormBuilder) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.borderModifyForm = this.fb.group({
      borderNo: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            borderNoValidator,
            lengthValidator(this.borderMaxLength)
          ]),
          updateOn: 'blur'
        }
      ],
      type: ['BORDER', Validators.required],
      comments: [null]
    });
    if (this.parentForm) {
      this.parentForm.addControl('borderAdd', this.borderModifyForm);
      if (this.parentForm.get('borderAdd').get('borderNo').value !== null)
        this.borderModifyForm.get('borderNo').setValue(this.parentForm.get('borderAdd').get('borderNo'));
    }
  }

  /**
   * This method handles the clearing  tasks.
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.parentForm.removeControl('borderAdd');
  }

  /**
   * This method is to emit fileUpload event
   */
  fileUpload() {
    this.uploadedEvent.emit();
  }
  // Method to emit refresh details
  refreshDocument(document: DocumentItem) {
    this.refresh.emit(document);
  }
}
