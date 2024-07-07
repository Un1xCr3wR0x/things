import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, Lov, GosiCalendar, formatDate } from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { TableHeadingAndParamName, DependentDetails } from '../../../../shared';
import { Observable } from 'rxjs';
@Component({
  selector: 'bnt-benefit-type-dc',
  templateUrl: './benefit-type-dc.component.html',
  styleUrls: ['./benefit-type-dc.component.scss']
})
export class BenefitTypeDcComponent implements OnInit {
  @Input() currentBenefits;
  @Input() listOfDependents: DependentDetails[];
  //For dependent edit
  @Input() searchResult: DependentDetails;
  @Input() systemRunDate: GosiCalendar;
  @Input() systemParameter: SystemParameter;
  @Input() annuityRelationShip$: Observable<LovList>;
  @Input() maritalStatus$: Observable<LovList>;
  @Input() heirStatus$: Observable<LovList>;
  @Input() heirStatusArr: string[];

  @Input() lang;
  @Input() tableHeadingAndParams: TableHeadingAndParamName[];

  @Output() onAddDependentClicked = new EventEmitter();
  @Output() onBenefitTypeCancelled = new EventEmitter();
  @Output() onBenefitTypeSave = new EventEmitter();
  @Output() onRemoveDependent = new EventEmitter();
  benefitTypeForm: FormGroup;
  benefitTypeList: LovList = new LovList([]);
  benefitTypes: Lov[] = [];
  isAddDependent = false;
  selectedBenefitType: string;
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.benefitTypes = [
      { value: { english: 'Lumpsum Benefit', arabic: 'منفعة الدفعة' }, sequence: 1 },
      { value: { english: 'Pension Benefit', arabic: 'استحقاق معاش' }, sequence: 2 }
    ];
    this.benefitTypes.forEach(type => {
      this.benefitTypeList.items.push(type);
    });
    this.benefitTypeForm = this.fb.group({
      benefitType: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    });
    this.benefitTypeForm.get('benefitType').setValue(this.currentBenefits.benefitType);
  }
  /**
   * Method to get selected benefit type
   * @param event
   */
  listenForBenefitType(event) {
    this.selectedBenefitType = event;
  }
  /** Method to emit benefit type on save button click */
  benefitTypeSave() {
    this.onBenefitTypeSave.emit(this.benefitTypeForm.get('benefitType.english').value);
  }
  /** Method to show add dependent component */
  showAddDependent() {
    this.isAddDependent = true;
  }
  /** Method to emit event on add dependent */
  OnAddDependent(dependent) {
    this.onAddDependentClicked.emit(dependent);
    this.isAddDependent = false;
  }
  /** Method to emit event on remove dependent */
  onDelete(dependent) {
    this.onRemoveDependent.emit(dependent);
  }
  /** Method to cancel benefit type edit */
  benefitTypeCancel() {
    this.onBenefitTypeCancelled.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
