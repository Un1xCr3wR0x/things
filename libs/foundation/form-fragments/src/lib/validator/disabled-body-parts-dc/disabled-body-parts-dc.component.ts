/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, Lov, LovList, DisabilityDetails, InjuredPerson } from '@gosi-ui/core';


@Component({
  selector: 'oh-disabled-body-parts-dc',
  templateUrl: './disabled-body-parts-dc.component.html',
  styleUrls: ['./disabled-body-parts-dc.component.scss']
})
export class DisabledBodyPartsDcComponent implements OnInit, OnChanges {
  /**
   *Input Variable.
   */
  @Input() bodyPartsCategoryList: LovList;
  @Input() injuredPerson: InjuredPerson;
  @Input() parentForm: FormGroup;
  @Input() disabilityDetails: DisabilityDetails;
  @Input() isReturn: boolean;
  @Input() isValidator = true;
  @Input() conveyanceRequired = false;
  /**
   * Local Variable
   */
  bodyPartsArray = [];
  selectedBP: BilingualText[];
  bodyPartsForm: FormGroup;
  constructor(readonly fb: FormBuilder) {}
  /**
   * This method handles initialization tasks.
   */
  ngOnInit(): void {
    this.bodyPartsForm = this.fb.group({ bodyParts: this.fb.array([]) });
    this.parentForm.addControl('bodyPartsList', this.disabilities);
    if (this.injuredPerson?.injuredPerson) {
      this.updateBodyPartForm();
    }
    if (
      this.disabilityDetails &&
      this.disabilityDetails.bodyPartsList &&
      this.disabilityDetails.bodyPartsList.length > 0
    ) {
      this.disabilityDetails.bodyPartsList.forEach((val, i) => {
        this.addBodyParts();
        this.disabilities?.controls[i]
          .get('bodyPartsIndex')
          .setValue(this.bodyPartsCategoryList.items.map(part => part?.value?.english).indexOf(val?.category?.english));
      });
      this.disabilities.patchValue(this.disabilityDetails?.bodyPartsList);
    }
    this.toPatchBodyPartsValue();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.injuredPerson && changes.injuredPerson.currentValue) {
      // for complication scenario
      this.injuredPerson = changes.injuredPerson.currentValue;
      if (this.injuredPerson.injuredPerson) {
        this.updateBodyPartForm();
      }
    }
    this.toPatchBodyPartsValue();
  }

  get disabilities() {
    return this.bodyPartsForm?.get('bodyParts') as FormArray;
  }
  /*
   * This method is to create new form while clicking add button
   */
  addBodyParts() {
    if(this.bodyPartForm()){
    this.disabilities.push(this.bodyPartForm());
    }
  }
  bodyPartForm() {
    return this.fb.group({
      category: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: null
      }),
      bodyParts: this.fb.group({
        english: null,
        arabic: null
      }),
      bodyPartsIndex: [null]
    });
  }
  onCategorySelected(bodyParts: Lov, i: number) {
    this.disabilities.controls[i]?.get('bodyPartsIndex').setValue(bodyParts.sequence - 1);
  }
  onDeleteField(i) {
    this.disabilities.removeAt(i);
  }
  /**
   * This method Bind fetched API values.
   */
  updateBodyPartForm() {
    if (this.injuredPerson && this.injuredPerson?.injuredPerson?.length > 0) {
      this.injuredPerson?.injuredPerson.forEach((bodyParts, i) => {
        this.addBodyParts();
        this.disabilities.controls[i]
          .get('bodyPartsIndex')
          .setValue(
            this.bodyPartsCategoryList.items.map(part => part?.value?.english).indexOf(bodyParts?.category?.english)
          );
      });
      this.disabilities.patchValue(this.injuredPerson?.injuredPerson);
    }
  }
  /**
   * This method is to reset the values in the bodyParts if category is removed .
   */
  onChange(event, i: number) {
    if (event === undefined) {
      this.disabilities.controls[i].get('bodyParts').reset(i);
      this.bodyPartsArray[i] = [];
    }
  }
  /**
   * for showing bodyparts array of values in field
   */
  toPatchBodyPartsValue() {
    this.disabilities?.controls?.forEach((control, i) => {
      const bp = this.disabilityDetails?.bodyPartsList?.[i] || this.injuredPerson?.injuredPerson?.[i];
      const selectedValues = bp?.bodyParts || [];
      control.get('bodyParts').patchValue(selectedValues);
      this.bodyPartsArray[i] = selectedValues;
    });
  }
  /**
   * bodyParts value to be returned while selecting each field
   * @param items
   * @param i
   */
  selectedBodyParts(items: BilingualText[], i: number) {
    this.selectedBP = items;
    this.bodyPartsArray[i] = this.selectedBP.map(val => ({
      english: val.english,
      arabic: val.arabic
    }));
  }
}
