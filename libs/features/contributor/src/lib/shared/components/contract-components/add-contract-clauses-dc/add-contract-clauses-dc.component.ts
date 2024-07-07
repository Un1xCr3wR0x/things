/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LanguageToken, markFormGroupTouched, markFormGroupUntouched } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ClauseItem, Clauses, EngagementDetails } from '../../../models';

@Component({
  selector: 'cnt-add-contract-clauses-dc',
  templateUrl: './add-contract-clauses-dc.component.html',
  styleUrls: ['./add-contract-clauses-dc.component.scss']
})
export class AddContractClausesDcComponent implements OnInit, OnChanges {
  // local variables
  ownClauses = [];
  newClauseForm: FormGroup;
  parentForm: FormGroup;
  declareForm: FormGroup;
  isAdd = true;
  clauseMaxLength = 500;
  clauseMinLength = 1;
  lang = 'en';
  isAdditionalclauseModified = false;
  //Input and output emitters
  @Input() contractClausesList: Clauses[];
  @Input() isEditMode: boolean;
  @Input() activeEngagement: EngagementDetails;
  @Input() transportationAllowance;
  @Input() parentFormRef: FormGroup;
  @Input() isApiTriggered: boolean;

  @Output() save: EventEmitter<Object> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();

  clausesList;
  optionalList = [];
  additionalList = [];
  optionalClausesList: Clauses[] = [new Clauses()];
  mandatoryClausesList: Clauses[] = [];
  additionalClausesList: Clauses[] = [new Clauses()];

  selectedChannelOptions: Array<BilingualText>;
  isSelected = false;
  selectedOptionalList: Clauses[] = [new Clauses()];
  finalClausesList: Clauses[];
  isEdit: boolean;
  currentAdditionalClausItem: ClauseItem[] = [];
  selectedClauses;
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
    this.newClauseForm = this.fb.group({
      clauses: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            Validators.pattern('^(?=.*[a-zA-Z0-9]).{0,}$'),
            Validators.minLength(this.clauseMinLength),
            Validators.maxLength(this.clauseMaxLength)
          ]),
          updateOn: 'blur'
        }
      ],
      clausesArabic: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            Validators.minLength(this.clauseMinLength),
            Validators.maxLength(this.clauseMaxLength)
          ]),
          updateOn: 'blur'
        }
      ]
    });

    if (!this.parentForm?.get('checkBoxFlag'))
      this.parentForm = this.fb.group({
        checkBoxFlag: [this.isEditMode ? true : false]
      });

    if (!this.isEditMode) this.additionalClausesList[0].section.english = 'Additional Clauses';

    this.declareForm = this.fb.group({
      checkBoxFlag: [false, Validators.requiredTrue]
    });

    if (this.parentFormRef) {
      this.parentFormRef.addControl('optionalDataForm', this.parentForm);
      this.parentFormRef.addControl('newClauseForm', this.newClauseForm);
      this.parentFormRef.addControl('disclaimerForm', this.declareForm);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contractClausesList && changes.contractClausesList.currentValue) {
      this.optionalClausesList = this.filterByValue(this.contractClausesList, 'Optional Clauses');
      this.optionalClausesList = this.sortByOrderId(this.optionalClausesList);
      this.mandatoryClausesList = this.filterNotByValue(this.contractClausesList, 'Optional Clauses');
      this.mandatoryClausesList = this.filterNotByValue(this.mandatoryClausesList, 'Additional Clauses');
      this.mandatoryClausesList = this.sortByOrderId(this.mandatoryClausesList);
      if (!this.isAdditionalclauseModified)
        this.additionalClausesList = this.filterByValue(this.contractClausesList, 'Additional Clauses');
      if (this.additionalClausesList?.length < 1) {
        this.additionalClausesList = [new Clauses()];
        this.additionalClausesList[0].section.english = 'Additional Clauses';
      }
      if (this.optionalClausesList.length > 0) {
        if (!this.parentForm?.get('checkBoxFlag'))
          this.parentForm = this.fb.group({
            checkBoxFlag: null
          });
        this.optionalClausesList[0].clauses.forEach(item => {
          //prestine checked for , if the optional check box value edited
          //  and clicked prevs button with out save and next of cluaes form
          // that newvalue should be retained in cluases form with out losing .
          if (item.isChecked && this.parentForm.pristine) {
            this.parentForm.get('checkBoxFlag').patchValue(true);
            this.selectOptinalClauses('true', item);
          } else if (!item.isChecked && this.parentForm.pristine) {
            this.parentForm.get('checkBoxFlag').patchValue(false);
          } else if (!this.parentForm.pristine) {
            //to update selected optional clauses in case of optional clauses change due to contract type change
            this.selectOptinalClauses(this.parentForm.get('checkBoxFlag').value.toString(), item);
          }
        });
      }
    }
    if (changes && changes.isEditMode && changes.isEditMode.currentValue) {
      if (this.isEditMode) {
        if (this.contractClausesList?.length > 0 && !this.isAdditionalclauseModified)
          this.additionalClausesList = this.filterByValue(this.contractClausesList, 'Additional Clauses');
        if (this.additionalClausesList.length < 1) {
          this.additionalClausesList = [new Clauses()];
          this.additionalClausesList[0].section.english = 'Additional Clauses';
        }
      }
    }
  }

  selectOptinalClauses(value, clause?: ClauseItem) {
    const index = this.optionalClausesList[0].clauses.findIndex(e => e.id === clause.id);
    if (value === 'true') {
      this.selectedOptionalList = [new Clauses()];
      this.selectedOptionalList[0].section.english = 'Optional Clauses';
      this.isSelected = true;
      clause.isChecked = true;
      this.optionalClausesList[0].clauses[index].isChecked = true;
      let tempSelectedClause: [ClauseItem] = [new ClauseItem()];
      tempSelectedClause = this.pushToArray(tempSelectedClause, clause);
      this.selectedOptionalList[0].clauses = [...tempSelectedClause];
    } else {
      this.optionalClausesList[0].clauses[index].isChecked = false;
      clause.isChecked = false;
      this.isSelected = false;
      if (this.isEditMode) {
        value = true;
        this.isSelected = true;
      }
      this.selectedOptionalList = this.selectedOptionalList.filter(el => el.clauses[0].id !== clause.id);
    }
  }

  //anly push item not present in array
  pushToArray(selectedClause, obj) {
    const index = selectedClause.findIndex(e => e.id === obj.id);
    if (index === -1) {
      selectedClause = [...[obj]];
    }
    return selectedClause;
  }

  filterNotByValue(array, string) {
    const ClausesList = array.filter(function (clause: Clauses) {
      return clause.section.english !== string;
    });
    return ClausesList;
  }

  filterByValue(array, string) {
    const ClausesList = array.filter(function (clause: Clauses) {
      return clause.section.english === string;
    });
    return ClausesList;
  }
  previousForm() {
    this.previous.emit();
  }
  cancelForm() {
    this.cancel.emit();
  }
  saveContractDetails() {
    this.declareForm.markAllAsTouched();
    markFormGroupTouched(this.declareForm);
    this.optionalList = [];
    this.additionalList = [];
    this.selectedOptionalList.map(selClause => {
      this.optionalList.push(
        ...selClause.clauses.map(clause => {
          return { description: clause.description };
        })
      );
    });
    this.additionalClausesList.map(selClause => {
      this.additionalList.push(
        ...selClause.clauses.map(clause => {
          return { description: clause.description };
        })
      );
    });
    this.clausesList = { optionalClauses: this.optionalList, additionalClauses: this.additionalList };
    this.finalClausesList = [];
    this.selectedClauses = [];
    this.selectedClauses = this.finalClausesList.concat(
      this.mandatoryClausesList,
      this.selectedOptionalList,
      this.additionalClausesList
    );
    this.finalClausesList = this.finalClausesList.concat(
      this.mandatoryClausesList,
      this.optionalClausesList,
      this.additionalClausesList
    );
    if (this.declareForm.valid) {
      this.save.emit({ finalClausesList: this.finalClausesList, selectedClauses: this.clausesList });
    } else {
      this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
    }
  }
  saveNewClauses() {
    let maxOrderId = 0;
    this.isAdditionalclauseModified = true;
    this.newClauseForm.markAllAsTouched();
    if (this.newClauseForm.valid) {
      if (this.isEdit) {
        if (this.currentAdditionalClausItem.length > 0) {
          this.currentAdditionalClausItem[0].description.english = this.newClauseForm.get('clauses').value;
          this.currentAdditionalClausItem[0].description.arabic = this.newClauseForm.get('clausesArabic').value;
          const index = this.additionalClausesList[0].clauses.findIndex(
            e => e.order === this.currentAdditionalClausItem[0].order
          );
          this.additionalClausesList[0].clauses[index] = this.currentAdditionalClausItem[0];
        }
      } else {
        const newOwnClause = new ClauseItem();
        newOwnClause.description.english = this.newClauseForm.get('clauses').value;
        newOwnClause.description.arabic = this.newClauseForm.get('clausesArabic').value;
        if (this.additionalClausesList.length < 0) {
          newOwnClause.order = '1';
        } else {
          this.additionalClausesList[0].clauses.map(function (obj) {
            if (parseInt(obj.order, 10) > maxOrderId) maxOrderId = parseInt(obj.order, 10);
          });
          newOwnClause.order = (maxOrderId + 1).toString();
        }
        this.additionalClausesList[0].clauses.push(newOwnClause);
      }
      this.newClauseForm.get('clauses').patchValue('');
      this.newClauseForm.get('clausesArabic').patchValue('');
      this.isAdd = true;
      this.isEdit = false;
    }
  }
  addAdditionalClauses() {
    this.isAdd = false;
    this.newClauseForm.markAsUntouched();
    markFormGroupUntouched(this.newClauseForm);
  }
  cancelNewClauses() {
    this.isAdd = true;
    this.newClauseForm.get('clauses').patchValue('');
    this.newClauseForm.get('clausesArabic').patchValue('');
  }
  /**
   *  edit selected additional clause item
   */
  editAdditionalClause(item, i) {
    this.currentAdditionalClausItem = [];
    this.isAdditionalclauseModified = true;
    this.isAdd = false;
    this.isEdit = true;
    this.currentAdditionalClausItem.push(this.additionalClausesList[0].clauses[i]);
    this.newClauseForm.get('clauses').patchValue(item.english);
    this.newClauseForm.get('clausesArabic').patchValue(item.arabic);
  }

  /**
   *  delete selected additional clause item
   */
  removeAdditionalClause(i) {
    this.isAdditionalclauseModified = true;
    this.additionalClausesList[0].clauses.splice(i, 1);
  }

  /** Method to create establishment list form. */
  createNewClausesForm() {
    return this.fb.group({
      clauses: null
    });
  }

  //**sort clauses based on order id provided by backend */
  sortByOrderId(clausesArrays: Clauses[]) {
    clausesArrays.forEach(clausesArray => {
      clausesArray.clauses.sort((a, b) => {
        if (a.order > b.order) {
          return 1;
        } else if (a.order < b.order) {
          return -1;
        } else {
          return 0;
        }
      });
    });
    return clausesArrays;
  }
}
