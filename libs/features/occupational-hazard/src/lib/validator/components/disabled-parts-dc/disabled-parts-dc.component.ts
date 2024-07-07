/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, DropdownValues, InjuredPerson, LookupService, Lov, LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-disabled-parts-dc',
  templateUrl: './disabled-parts-dc.component.html',
  styleUrls: ['./disabled-parts-dc.component.scss']
})
export class DisabledPartsDcComponent implements OnInit {
  /**
   *Input Variable.
   */
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() bodyPartsCategoryList: LovList;
  @Input() injuredPerson: InjuredPerson;
  /**
   *Output Variable.
   */
  @Output() OnSelected = new EventEmitter();

  disabilityForm: FormArray = new FormArray([]);
  form: FormGroup;
  selectedParts: { bodyParts: DropdownValues[] }[];
  bodyPartsList = [];
  selected: { bodyParts: DropdownValues[] }[] = [];
  apiSubSpecialty: BilingualText[];
  constructor(readonly fb: FormBuilder, readonly lookUpService: LookupService) {}
  /**
   * This method handles initialization tasks.
   */
  ngOnInit(): void {
    this.form = this.fb.group({ disabilities: this.disabilityForm });
    if (this.parentForm) {
      this.parentForm.addControl('disabilityFormValue', this.disabilityForm);
    }
    this.bindApiValues();
  }
  get disabilities() {
    return this.form.get('disabilities') as FormArray;
  }
  get bodyParts() {
    return this.disabilities.controls[0].get('bodyParts');
  }
  /**
   * This method Bind fetched API values.
   */

  bindApiValues() {
    if (this.injuredPerson && this.injuredPerson.injuredPerson) {
      const injuredPersons = this.injuredPerson.injuredPerson;
      injuredPersons.forEach((res, i) => {
        this.disabilities.push(this.createDisabilityForm());
        this.disabilities.controls[i]
          .get('bodyPartsIndex')
          .setValue(this.bodyPartsCategoryList.items.map(part => part?.value?.english).indexOf(res?.category?.english));
        if (res && res?.bodyParts && res?.bodyParts?.length > 0) {
          res.bodyParts.forEach(parts => {
            (this.disabilities.controls[i].get('bodyParts') as FormArray).push(
              this.fb.group({
                english: [parts?.english],
                arabic: [parts?.arabic]
              })
            );
          });
        } else {
          (this.disabilities.controls[i].get('bodyParts') as FormArray).push(this.getBilingualForm());
        }
        this.selected.push({ bodyParts: null });
      });
      this.disabilities.patchValue(injuredPersons);
    }
  }
  getControl(partsForm: FormGroup) {
    const control = (partsForm.get('bodyParts') as FormArray).at(0) as FormGroup;
    return control;
  }

  getBilingualForm() {
    return this.fb.group({
      english: [''],
      arabic: ['']
    });
  }
  selectedBodyParts(selectedList: DropdownValues[], i: number) {
    this.selected[i].bodyParts = selectedList;
    this.OnSelected.emit(this.selected);
  }
  /*
   * This method is to create new form while clicking add button
   */
  addBodyParts() {
    this.disabilities.push(this.createDisabilityForm());
    (this.disabilities.at(this.disabilities.value.length - 1).get('bodyParts') as FormArray).push(
      this.getBilingualForm()
    );
  }
  /*
   *  To reset the value changes in the bodyParts Lov
   */

  onCategorySelected(bodyParts: Lov, i: number) {
    this.disabilities.controls[i].get('bodyPartsIndex').setValue(bodyParts.sequence - 1);
    if (this.disabilities.controls[i].get('category').valueChanges) {
      this.disabilities.controls[i].get('bodyParts').reset(i);
      this.disabilities.updateValueAndValidity();
    }
  }
  /*
   * This method is to delete the table field
   */
  onDeleteField(i: number) {
    this.disabilities.removeAt(i);
  }
  /*
   * This method is to create Disability Form
   */
  createDisabilityForm() {
    return this.fb.group({
      category: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      bodyParts: this.fb.array([]),
      bodyPartsIndex: [null]
    });
  }
}
