/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActionItemListConstants, ResolveConstants, ComplaintConstants, LovListConstants } from '../../constants';
import { LovList, DocumentItem, Lov, Role, markFormGroupUntouched, WorkFlowActions } from '@gosi-ui/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentDetails, ClerkDetails, TransactionSummary } from '../../models';
import { TransactionType } from '../../models/transaction-Type-List';

@Component({
  selector: 'ces-action-area-dc',
  templateUrl: './action-area-dc.component.html',
  styleUrls: ['./action-area-dc.component.scss']
})
export class ActionAreaDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  onlyHeading: boolean;
  heading: string;
  currentAction: string = null;
  transactionList: LovList = new LovList([]);
  actionItemList: LovList;
  currentActionList = ActionItemListConstants.ACTION_ITEMS;
  ValidityList: LovList = new LovList(LovListConstants.COMPLAINTValidity_LIST);
  rightTypeList = new LovList([]);
  rightSubtypeList = new LovList([]);

  /*
   * Input variables
   */
  @Input() actions: string[] = [];
  @Input() departmentList: DepartmentDetails[] = [];
  @Input() category: string;
  @Input() clerkList: ClerkDetails[] = [];
  @Input() documents: DocumentItem[] = [];
  @Input() uuid: string;
  @Input() transactionId: number;
  @Input() referenceNo: number;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() locationList: LovList;
  @Input() resubmitHeader: string;
  @Input() currentRole: Role;
  @Input() transactionSummary: TransactionSummary;
  @Input() categoryList: LovList = new LovList([]);
  @Input() transactionTypeList: TransactionType[];
  /**
   * Output variables
   */
  @Output() info: EventEmitter<string> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() remove: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() location: EventEmitter<Lov> = new EventEmitter();
  @Output() add: EventEmitter<number> = new EventEmitter();

  /**
   *
   * @param modalService
   * @param fb
   * @param cdr
   */
  constructor(readonly modalService: BsModalService, readonly fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  /** Method to intialise tasks */
  ngOnInit(): void {}

  /**
   * This method is used to handle the changes in the input variables.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.documents && changes.documents.currentValue) this.documents = changes.documents.currentValue;
    if (changes && changes.locationList && changes.locationList.currentValue)
      this.locationList = changes.locationList.currentValue;
    if (changes && changes.departmentList && changes.departmentList.currentValue)
      this.departmentList = changes.departmentList.currentValue;
    if (changes && changes.actions && changes.actions.currentValue) {
      this.actions = changes.actions.currentValue;
      this.createComplaintActionForm();
      if (this.actions.includes(WorkFlowActions.RESUBMIT)) {
        this.onlyHeading = true;
        this.selectAction(this.currentActionList.find(item => item.action === WorkFlowActions.RESUBMIT).value.english);
        this.heading = this.resubmitHeader;
      } else if (this.actions.includes(WorkFlowActions.REOPEN)) {
        this.onlyHeading = true;
        this.selectAction(this.currentActionList.find(item => item.action === WorkFlowActions.REOPEN).value.english);
        this.heading = ComplaintConstants.REOPEN;
      } else if (this.actions.includes(WorkFlowActions.PROVIDE_INFORMATION)) {
        this.onlyHeading = true;
        this.selectAction(
          this.currentActionList.find(item => item.action === WorkFlowActions.PROVIDE_INFORMATION).value.english
        );
        this.heading = ComplaintConstants.PROVIDE_INFO;
      } else {
        this.actionItemList = new LovList([]);
        this.onlyHeading = false;
        this.actionItemList = new LovList(
          this.currentActionList
            .filter((item, index) => {
              if (this.actions.includes(item.action)) {
                if (item.action === WorkFlowActions.RESOLVE)
                  this.currentActionList[index].value = item.value = ResolveConstants.RESOLVE_ACTIONS.find(
                    resolveItem => resolveItem.category === this.category
                  ).value;
                item.sequence = this.actions.indexOf(item.action) + 1;
                return item;
              }
            })
            .sort((v1, v2) => v1.sequence - v2.sequence)
        );
      }
    }
    this.cdr.detectChanges();
  }
  /**
   * method to emit selected action
   * @param value
   */
  selectAction(value: string) {
    const action = this.currentActionList.find(item => item.value.english === value).action;
    if (this.currentAction !== action) {
      this.resetFormGroup();
      this.currentAction = action;
      if (
        action == WorkFlowActions.RESOLVE ||
        action == WorkFlowActions.RETURN ||
        action == WorkFlowActions.ACKNOWLEDGE
      ) {
        this.createCategoryForm();
      }
      this.info.emit(action);
    }
  }
  /**
   * method to create action form group
   */
  createComplaintActionForm() {
    const chooseActionForm: FormGroup = this.fb.group({
      english: [null, { validators: Validators.required }],
      arabic: [null]
    });
    if (this.parentForm.get('action')) {
      this.parentForm.removeControl('action');
    }
    this.parentForm.addControl('action', chooseActionForm);
    if (this.actions.length === 1) {
      if (this.parentForm.get('action')) {
        this.parentForm.removeControl('action');
      }
    }
    this.parentForm.updateValueAndValidity();
  }
  /**
   * Method to emit document details
   */
  refreshDocument(document: DocumentItem) {
    this.refresh.emit(document);
  }
  /**
   * method to emit selected location
   * @param location
   */
  getLocation(location) {
    this.location.emit(location);
  }
  /**
   * method to reset form group
   */
  resetFormGroup() {
    Object.keys(this.parentForm.controls).forEach(item => {
      if (item !== 'action' && item !== 'comments') this.parentForm.removeControl(item);
    });
    this.parentForm.updateValueAndValidity();
    markFormGroupUntouched(this.parentForm);
  }

  /**
   * method to emit add document event
   */
  addDocument() {
    this.add.emit();
  }

  /**
   * method to emit remove document event
   */
  removeDocument(document: DocumentItem) {
    this.remove.emit(document);
  }

  /**
   * method to create Right CategoryForm form group
   */
  createCategoryForm(): void {
    const rightCategoryForm: FormGroup = this.fb.group({
      category: this.fb.group({
        english: [null, { validators: this.categoryList != null ? Validators.required : Validators.nullValidator }],
        arabic: [null]
      }),
      type: this.fb.group({
        english: [null, { validators: this.categoryList != null ? Validators.required : Validators.nullValidator }],
        arabic: [null]
      }),
      subtype: this.fb.group({
        english: [null, { validators: this.categoryList != null ? Validators.required : Validators.nullValidator }],
        arabic: [null]
      }),
      isValid: this.fb.group({
        english: [
          this.transactionSummary.isValid == 1
            ? this.ValidityList.items[0].value.english
            : this.ValidityList.items[1].value.english,
          { validators: Validators.required }
        ],
        arabic: [
          this.transactionSummary.isValid == 1
            ? this.ValidityList.items[0].value.arabic
            : this.ValidityList.items[1].value.arabic
        ]
      })
    });

    this.parentForm.addControl('rightCategory', rightCategoryForm);
    this.parentForm.updateValueAndValidity();
  }

  /**
   *
   * @param code method to set type list
   */
  getTransactionList(code: number) {
    var list = new LovList([]);
    this.transactionTypeList
      ?.filter(type => type.categoryCode == Number(code))
      .forEach((item, index) => {
        if (item.code) {
          const lovItem = new Lov();
          lovItem.value.arabic = item.arabic;
          lovItem.value.english = item.english;
          lovItem.code = item.code;
          lovItem.sequence = index;
          list.items.push(lovItem);
        }
      });
    return list;
  }
}
