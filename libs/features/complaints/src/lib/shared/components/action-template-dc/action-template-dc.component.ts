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
  Inject,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {
  DocumentItem,
  LovList,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  markFormGroupTouched,
  markFormGroupUntouched,
  Lov,
  BilingualText,
  LanguageToken,
  Role,
  WorkFlowActions,
  AppConstants
} from '@gosi-ui/core';
import { DepartmentDetails, ClerkDetails } from '@gosi-ui/features/complaints/lib/shared/models';
import { BehaviorSubject } from 'rxjs';
import { ActionItemListConstants, ComplaintConstants, LovListConstants } from '../../constants';
import { CategoryEnum } from '../../enums';
import { TransactionType } from '../../models/transaction-Type-List';
const commentLength = AppConstants.BPM_MAXLENGTH_COMMENTS;
@Component({
  selector: 'ces-complaint-action-template-dc',
  templateUrl: './action-template-dc.component.html',
  styleUrls: ['./action-template-dc.component.scss']
})
export class ActionTemplateDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */
  businessKey: number;
  items = [];
  requestInfoForm: FormGroup;
  isSelected = false;
  commentsLabel: string;
  isAppPrivate = false;
  isScan = false;
  isLocationSelected = false;
  deptLabel = 'COMPLAINTS.SELECT-LOCATION';
  canAddDocument = true;
  departmentLovList: LovList = new LovList([]);
  clerkLovList: LovList = new LovList([]);
  headName: BilingualText = null;
  headJobTitle: BilingualText = null;
  lang = 'en';
  departmentHead = Role.DEPARTMENT_HEAD;
  delegateAction = WorkFlowActions.DELEGATE;
  actionItem = ActionItemListConstants.ACTION_ITEMS.find(item => item.action === this.currentAction);
  isDepartmentSelected = false;
  isTypeselected = false;
  isSuggestion = false;
  suggestionType: string;
  suggestionSubtype: string;
  workflowActions = WorkFlowActions;
  bindValueIsCode = true;
  ValidityList: LovList = new LovList(LovListConstants.COMPLAINTValidity_LIST);
  /*
   * Input variables
   */
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() transactionList: LovList = new LovList([]);
  @Input() documents: DocumentItem[] = [];
  @Input() uuid: string;
  @Input() transactionId: number;
  @Input() referenceNo: number;
  @Input() locationList: LovList = null;
  @Input() departmentList: DepartmentDetails[] = [];
  @Input() clerkList: ClerkDetails[] = [];
  @Input() currentRole: Role;
  @Input() currentAction: string;
  @Input() category: string;
  @Input() categoryList: LovList = new LovList([]);
  @Input() transactionTypeList: TransactionType[];
  @Input() rightTypeList = new LovList([]);
  @Input() rightSubtypeList = new LovList([]);
  @Input() getTransactionList: Function;
  /*
   * Output variables
   */
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  @Output() confirmEvent: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() documentAdd: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() location: EventEmitter<Lov> = new EventEmitter();
  @Output() add: EventEmitter<number> = new EventEmitter();
  @Output() remove: EventEmitter<DocumentItem> = new EventEmitter();
  /**
   *
   * @param fb
   * @param appToken
   * @param language
   * @param cdr
   */
  constructor(
    readonly fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(res => {
      this.lang = res;
    });
    this.commentsLabel = ComplaintConstants.COMPLAINTS_COMMENTS;
    this.initiateAction();
    this.isScan = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    if (this.category === CategoryEnum.SUGGESTION) this.isSuggestion = true;
  }

  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.parentForm) this.parentForm = changes.parentForm.currentValue;
    if (changes && changes.documents) this.documents = changes.documents.currentValue;
    if (changes && changes.locationList) this.locationList = changes.locationList.currentValue;
    if (changes && changes.departmentList) {
      this.departmentList = changes.departmentList.currentValue;
      if (this.departmentList) this.createDepartmentLovList();
    }
    if (changes && changes.clerkList) {
      this.clerkList = changes.clerkList.currentValue;
      if (this.clerkList) this.createClerkLovList();
    }
    if (changes && changes.category) this.category = changes.category.currentValue;
    if (changes && changes.currentRole) this.currentRole = changes.currentRole.currentValue;
    if (changes && changes.currentAction) {
      this.currentAction = changes.currentAction.currentValue;
      this.initiateAction();
    }
  }

  /**
   * Method to initiate actions
   */
  initiateAction() {
    this.actionItem = ActionItemListConstants.ACTION_ITEMS.find(item => item.action === this.currentAction);
    this.createActionForm();
    this.cdr.detectChanges();
  }

  /**
   * Method to confirm action details
   */
  confirmEventDetails() {
    this.parentForm.markAllAsTouched();
    this.parentForm.updateValueAndValidity();
    if (this.parentForm.valid) {
      markFormGroupUntouched(this.parentForm);
      this.confirmEvent.emit();
    } else {
      markFormGroupTouched(this.parentForm);
    }
  }

  /**
   * Method to create action form
   */
  createActionForm() {
    if (this.actionItem.canComment) {
      const comments = new FormControl(null, { validators: Validators.required, updateOn: 'blur' });
      if (this.actionItem.isCommentMandatory) {
        if (!this.parentForm.get('comments')) this.parentForm.addControl('comments', comments);
        this.parentForm.get('comments').setValidators([Validators.required, Validators.maxLength(commentLength)]);
      } else {
        if (!this.parentForm.get('comments')) this.parentForm.addControl('comments', comments);
        {
          this.parentForm.get('comments').setValidators([]);
          this.parentForm.get('comments').setValidators([Validators.maxLength(commentLength)]);
        }
      }
      this.parentForm.get('comments').updateValueAndValidity();
    }
    this.createDepartmentForm();
    if (this.actionItem.canClerk && this.currentRole === this.departmentHead) {
      if (this.parentForm.get('clerk')) this.parentForm.removeControl('clerk');
      this.parentForm.addControl('clerk', this.createSelectForm());
      if (this.parentForm.get('clerkId')) this.parentForm.removeControl('clerkId');
      this.parentForm.addControl('clerkId', this.fb.control(null, Validators.required));
    }
    if (this.actionItem.canLocation && this.currentRole !== this.departmentHead) {
      if (this.parentForm.get('office')) this.parentForm.removeControl('office');
      this.parentForm.addControl('office', this.createSelectForm());
    } else {
      if (this.parentForm.get('office')) this.parentForm.removeControl('office');
    }
  }

  /**
   * Method to create department form
   */
  createDepartmentForm() {
    if (this.actionItem.canDepartment && this.currentRole !== this.departmentHead) {
      if (this.parentForm.get('department')) this.parentForm.removeControl('department');
      this.parentForm.addControl('department', this.createSelectForm());
      if (this.parentForm.get('head')) this.parentForm.removeControl('head');
      this.parentForm.addControl('head', this.fb.control(null, Validators.required));
      if (this.parentForm.get('departmentId')) this.parentForm.removeControl('departmentId');
      this.parentForm.addControl('departmentId', this.fb.control(null, Validators.required));
    } else {
      if (this.parentForm.get('department')) this.parentForm.removeControl('department');
      if (this.parentForm.get('head')) this.parentForm.removeControl('head');
      if (this.parentForm.get('departmentId')) this.parentForm.removeControl('departmentId');
    }
  }
  /**
   * Method to get selected department
   * @param department
   */
  selectDepartment(department: Lov) {
    if (department) {
      const currentDepartment = this.departmentList.find(item => item.DepartmentID === department.code);
      this.parentForm.get('head').setValue(currentDepartment.DepartmentHeadID);
      this.parentForm.get('departmentId').setValue(currentDepartment.DepartmentID);
      this.headName = null;
      this.headJobTitle = null;
      if (currentDepartment.DepartmentHeadName && currentDepartment.DepartmentHeadName !== '0') {
        this.headName = new BilingualText();
        this.headName.english = this.headName.arabic = currentDepartment.DepartmentHeadName;
      }
      if (currentDepartment.DepartmentHeadJobTitle && currentDepartment.DepartmentHeadJobTitle !== '0') {
        this.headJobTitle = new BilingualText();
        this.headJobTitle.english = this.headJobTitle.arabic = currentDepartment.DepartmentHeadJobTitle;
      }
      this.isDepartmentSelected = true;
    } else {
      this.headName = null;
      this.headJobTitle = null;
      this.parentForm.get('head').reset();
      this.parentForm.get('departmentId').reset();
    }
  }

  /**
   * Method to get selected location
   * @param location
   */
  selectLocation(location: Lov) {
    if (location !== null) {
      this.parentForm.get('office').valueChanges.subscribe(() => {
        this.parentForm.get('department').reset();
        this.parentForm.get('head').reset();
      });
      this.location.emit(location);
    } else {
      this.parentForm.get('department').reset();
    }
    this.departmentLovList = null;
  }

  /**
   * Method to get added document details
   */
  addDocument() {
    this.add.emit();
  }
  /**
   * method to emit cancel details
   */
  cancelEventDetails() {
   // this.cancelEvent.emit();
  }

  /**
   * method to emit document details
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    this.refresh.emit(document);
  }

  /**
   * Method to create selected details form
   * @param required
   * @param initialValue
   */
  createSelectForm(required = true, initialValue?: string) {
    return this.fb.group({
      english: [
        initialValue,
        { validators: required ? Validators.required : Validators.nullValidator, updateOn: 'blur' }
      ],
      arabic: [null]
    });
  }
  /**
   * Method to create clerk lovlist
   */
  createClerkLovList() {
    this.clerkLovList = new LovList([]);
    this.clerkList.forEach(item => {
      const lov = new Lov();
      lov.value.arabic = item.Employee_Name_Ar;
      lov.value.english = item.Employee_Name_En;
      lov.code = item.Person_Number;
      this.clerkLovList.items.push(lov);
    });
  }

  /**
   * Method to create department lovlist
   */
  createDepartmentLovList() {
    this.departmentLovList = new LovList([]);
    this.departmentList.forEach(item => {
      const lov = new Lov();
      lov.value.arabic = item.DepartmentNameAR;
      lov.value.english = item.DepartmentNameEN;
      lov.code = item.DepartmentID;
      this.departmentLovList.items.push(lov);
    });
  }

  /**
   * Method to get selected clerk details
   * @param clerk
   */
  selectClerk(clerk: Lov) {
    if (clerk) {
      const clerkId = this.clerkList.find(item => item.Person_Number === clerk.code).employeeUserName;
      this.parentForm.get('clerkId').setValue(clerkId);
    } else this.parentForm.get('clerkId').setValue(null);
  }

  /**
   * Method to get selected suggestion type
   * @param category
   */
  selectSuggestionType(category) {
    if (category) {
      this.parentForm.get('category').valueChanges.subscribe(() => {
        this.parentForm.get('subCategory').reset();
      });
    } else this.parentForm.get('subCategory').reset();
  }

  /**
   * Method to trigger remove document event
   * @param document
   */
  removeDocument(document: DocumentItem) {
    this.remove.emit(document);
  }
  /**
   *
   * @param rightCategory method to emit category
   */
  onCategorySelection(rightCategory: number) {
    this.parentForm.get('rightCategory').get('type').reset();
    this.parentForm.get('rightCategory').get('subtype').reset();
    this.parentForm.get('rightCategory').get('type').disable();
    this.parentForm.get('rightCategory').get('subtype').disable();
    this.rightTypeList = new LovList([]);
    this.rightSubtypeList = new LovList([]);

    this.rightTypeList = this.getTransactionList(rightCategory);

    if (this.rightTypeList.items.length > 0) {
      this.parentForm.get('rightCategory').get('type').enable();
      this.parentForm.get('rightCategory').get('type').setValidators(Validators.required);
    } else {
      this.parentForm.get('rightCategory').get('type').clearValidators();
    }
  }
  /**
   *
   * @param rightType method to emit type
   */
  onCategoryTypeSelect(rightType: number) {
    this.rightSubtypeList = new LovList([]);
    this.parentForm.get('rightCategory').get('subtype').reset();

    this.rightSubtypeList = this.getTransactionList(rightType);

    if (this.rightSubtypeList.items.length > 0) {
      this.parentForm.get('rightCategory').get('subtype').enable();
      this.parentForm.get('rightCategory').get('subtype').setValidators(Validators.required);
    } else {
      this.parentForm.get('rightCategory').get('subtype').disable();
      this.parentForm.get('rightCategory').get('subtype').clearValidators();
    }
  }
}
