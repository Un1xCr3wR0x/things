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
  DocumentItem,
  IdentifierLengthEnum,
  iqamaValidator,
  lengthValidator,
  TransactionReferenceData
} from '@gosi-ui/core';
import { ManagePersonConstants } from '../../../shared';

@Component({
  selector: 'cim-add-iqama-dc',
  templateUrl: './add-iqama-dc.component.html',
  styleUrls: ['./add-iqama-dc.component.scss']
})
export class AddIqamaDcComponent extends BaseComponent implements OnInit, OnDestroy {
  //Local Variables
  iqamaModifyForm: FormGroup;
  iqamaMaxLength = IdentifierLengthEnum.IQAMA;
  documentTransactionId = ManagePersonConstants.IQAMA_DOCUMENT_ID;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  //Input Variables
  @Input() parentForm: FormGroup;
  @Input() documents: DocumentItem[] = [];
  @Input() personId;
  @Input() isCsr = true;
  @Input() referenceNo: number;
  @Input() comments: TransactionReferenceData[] = [];
  @Input() isComments = true;
  @Input() uuid: string;

  //Output Variables
  @Output() uploadedEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();

  /**
   * Creates an instance of AddIqamaDcComponent
   * @memberof  AddIqamaDcComponent
   *
   */
  constructor(private fb: FormBuilder) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    this.iqamaModifyForm = this.fb.group({
      iqamaNo: [
        null,
        {
          validators: Validators.compose([Validators.required, iqamaValidator, lengthValidator(this.iqamaMaxLength)]),
          updateOn: 'blur'
        }
      ],
      type: ['IQAMA', Validators.required],
      comments: [null]
    });
    if (this.parentForm) {
      this.parentForm.addControl('iqamaAdd', this.iqamaModifyForm);
      if (this.parentForm.get('iqamaAdd').get('iqamaNo').value !== null)
        this.iqamaModifyForm.get('iqamaNo').setValue(this.parentForm.get('iqamaAdd').get('iqamaNo'));
    }
  }

  /**
   * This method handles the clearing tasks.
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.parentForm.removeControl('iqamaAdd');
  }

  // Method to emit upload details

  uploadedEventDetails() {
    this.uploadedEvent.emit();
  }
  // Method to emit refresh details

  refreshDetails(document: DocumentItem) {
    this.refresh.emit(document);
  }
}
