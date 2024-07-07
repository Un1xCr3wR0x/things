/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BilingualText,
  bindToForm,
  Lov,
  LovList,
  markFormGroupTouched,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { Injury } from '../../shared';

@Component({
  selector: 'oh-reopen-details-dc',
  templateUrl: './reopen-details-dc.component.html',
  styleUrls: ['./reopen-details-dc.component.scss']
})
export class ReopenDetailsDcComponent implements OnInit, OnChanges {
  /**
   *
   * @param fb Creating an instance
   * @param router
   */

  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appTypeToken: string
  ) {}
  /**
   * Local Variables
   */
  disabled = false;
  reopenInjuryForm: FormGroup;
  /**
   * Input variables
   */
  @Input() reopenReasonList: LovList = new LovList([]);
  @Input() InjuryDetails: Injury;
  @Input() isWorkflow = false;
  @Input() showToggle = true;
  @Input() isEdit: boolean;

  /**
   * Output variables
   */
  @Output() showInjury: EventEmitter<boolean> = new EventEmitter();
  @Output() selectedReopenReason: EventEmitter<BilingualText> = new EventEmitter();

  /**
   *Method to detect changes in input
   * @param changes Capturing input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.reopenReasonList) {
      this.reopenReasonList = changes.reopenReasonList.currentValue;
    }
    if (changes && changes.showToggle) {
      this.showToggle = changes.showToggle.currentValue;
    }
    if (changes && changes.InjuryDetails) {
      this.InjuryDetails = changes.InjuryDetails?.currentValue;
      if ((this.isWorkflow && this.reopenInjuryForm) || (this.isEdit && this.reopenInjuryForm)) {
        bindToForm(this.reopenInjuryForm, this.InjuryDetails);
      }
    }
  }

  /**
   * This method is to handle initialization tasks
   */
  ngOnInit() {
    /**
     * creating form for reopen injury
     */
    this.reopenInjuryForm = this.createReopenInjuryForm();
  }

  /**
   * Validating the reopen injury form
   */

  createReopenInjuryForm() {
    return this.fb.group({
      reopenReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      modifyInjuryIndicator: [false, { updateOn: blur }]
    });
  }
  /**
   *
   * @param modifyIndicator
   * Method to check whether modification is required while reporting
   */
  modifyInjury(modifyIndicator) {
    //TODO: specify type for params
    this.showInjury.emit(modifyIndicator);
  }
  /**
   * Validation for form
   */
  isValidForm() {
    markFormGroupTouched(this.reopenInjuryForm);
    if (
      (this.isWorkflow && this.reopenInjuryForm && this.appTypeToken === ApplicationTypeEnum.PUBLIC) ||
      (this.isEdit && this.reopenInjuryForm && this.appTypeToken === ApplicationTypeEnum.PUBLIC)
    ) {
      if (!this.reopenInjuryForm.valid && !this.reopenInjuryForm.disabled) {
        return false;
      }
      return true;
    } else {
      if (this.reopenInjuryForm.valid) {
        return true;
      }
      return false;
    }
  }

  /**
   * This method is to emit the selected reopen reason
   * @param reopenReason
   */
  selectedReason(reopenReason: Lov) {
    this.selectedReopenReason.emit(reopenReason.value);
  }
}
