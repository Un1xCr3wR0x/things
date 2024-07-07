/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, markFormGroupUntouched, markFormGroupTouched } from '@gosi-ui/core';
import { TransactionSummary } from '../../models';

@Component({
  selector: 'ces-modify-transaction-dc',
  templateUrl: './modify-transaction-dc.component.html',
  styleUrls: ['./modify-transaction-dc.component.scss']
})
export class ModifyTransactionDcComponent implements OnInit, OnChanges {
  //Local variables
  contactForm: FormGroup;
  isSelected = false;

  /*
   * Input Variables
   */
  @Input() typeLabel: string;
  @Input() canEditPriority = true;
  @Input() subTypeLabel: string;
  @Input() transactionSummary: TransactionSummary;
  @Input() typeList: LovList = null;
  @Input() subTypeList: LovList = null;
  @Input() isTypeSelected: boolean;
  @Input() heading = '';
  @Input() canEditPriorityOnly = false;
  @Input() priorityList: LovList = new LovList([]);
  @Input() parentForm: FormGroup = new FormGroup({});

  /*
   * Output Variables
   */
  @Output() confirm: EventEmitter<null> = new EventEmitter();
  @Output() hide: EventEmitter<null> = new EventEmitter();
  @Output() focus: EventEmitter<null> = new EventEmitter();
  @Output() typeSelect: EventEmitter<string> = new EventEmitter();

  /**
   * @param formBuilder
   */
  constructor(readonly formBuilder: FormBuilder) {}

  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    if (this.parentForm) {
      if (this.parentForm.get('type')) {
        this.parentForm.removeControl('type');
      }
      if (this.parentForm.get('subType')) {
        this.parentForm.removeControl('subType');
      }
      if (this.parentForm.get('priority')) {
        this.parentForm.removeControl('priority');
      }
      if (this.canEditPriority === true) this.parentForm.addControl('priority', this.createTypeForm());
      if (this.transactionSummary) {
        if (this.transactionSummary && this.transactionSummary.priority && this.parentForm.get('priority'))
          this.parentForm.get('priority').get('english').setValue(this.transactionSummary.priority.english);
        if (this.canEditPriorityOnly === false && this.transactionSummary) {
          this.parentForm.addControl('type', this.createTypeForm());
          if (this.transactionSummary.type && this.parentForm.get('type'))
            this.parentForm.get('type').setValue(this.transactionSummary.type);
          this.parentForm.addControl('subType', this.createTypeForm());
          if (this.transactionSummary.subtype && this.parentForm.get('subType'))
            this.parentForm.get('subType').setValue(this.transactionSummary.subtype);
          if (!this.isSelected && this.parentForm.value && this.parentForm.value.type !== null) {
            this.typeSelect.emit(this.parentForm.value.type.english);
          }
        }
      }
    }
  }
  /**
   * Method to handle changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.typeList && changes.typeList.currentValue) this.typeList = changes.typeList.currentValue;
      if (changes.subTypeList && changes.subTypeList.currentValue) this.subTypeList = changes.subTypeList.currentValue;
    }
  }
  /**
   * Method to create contact us form
   */
  createContactForm(): FormGroup {
    return this.formBuilder.group({
      type: this.createTypeForm(),
      subType: this.createTypeForm(),
      priority: this.createTypeForm()
    });
  }
  /**
   * Method to create create type form
   */
  createTypeForm(): FormGroup {
    return this.formBuilder.group({
      english: [null, Validators.compose([Validators.required])],
      arabic: [null]
    });
  }
  /**
   * Method to modify action details
   */
  modifyAction() {
    this.parentForm.updateValueAndValidity();
    markFormGroupUntouched(this.parentForm);
    if (this.parentForm.valid) this.confirm.emit();
    else markFormGroupTouched(this.parentForm);
  }
  /**
   * Method to hide modal
   */
  hideModal() {
    this.hide.emit();
  }

  /**
   * Method to get selected type
   * @param event
   */
  onTypeSelect(event) {
    this.isSelected = true;
    this.typeSelect.emit(event);
    if (this.transactionSummary && event !== this.transactionSummary.type) {
      this.parentForm.get('subType').reset();
    }
  }
  /**
   * Method to handle focus event on components
   */
  onFocus() {
    this.focus.emit();
  }
}
