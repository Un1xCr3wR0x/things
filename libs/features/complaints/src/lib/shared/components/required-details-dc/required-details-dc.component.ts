/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, Lov, LovList } from '@gosi-ui/core';

@Component({
  selector: 'ces-required-details-dc',
  templateUrl: './required-details-dc.component.html',
  styleUrls: ['./required-details-dc.component.scss']
})
export class RequiredDetailsDcComponent implements OnInit, OnChanges {
  /**
   * local variables
   */
  categoryForm: FormGroup;
  type1List: LovList;
  /**
   * input variables
   */
  @Input() categoryList: LovList;
  @Input() typeList: LovList;
  @Input() subTypeList: LovList;
  @Input() typeLabels: string;
  @Input() subTypeLabels: string;
  @Input() typePlaceholders: string;
  @Input() subTypePlaceholders: string;
  @Input() isCategorySelected: boolean;
  @Input() isTypeSelected: boolean;
  @Input() parentForm: FormGroup;
  @Input() isPublicApp = false;
  @Input() cardItems: any[];
  @Input() isSubmitted: boolean = false;
  @Input() transactionIds: any;
  //output variables
  @Output() category: EventEmitter<BilingualText> = new EventEmitter();
  @Output() registerCategory: EventEmitter<BilingualText> = new EventEmitter();
  @Output() isShowContactDetails: EventEmitter<any> = new EventEmitter();
  @Output() isCardSelected: EventEmitter<any> = new EventEmitter();
  @Output() type: EventEmitter<BilingualText> = new EventEmitter();
  @Output() clear: EventEmitter<null> = new EventEmitter();
  isCLicked: boolean = false;
  selectedIndex: any;
  lastTwo: boolean = false;
  categoryType: any;
  categoryLabel: string;

  /**
   *
   * @param formBuilder
   */
  constructor(readonly formBuilder: FormBuilder) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.categoryForm = this.createCategoryForm();
    this.parentForm.removeControl('categoryForm');
    if (this.parentForm) {
      this.parentForm.addControl('categoryForm', this.categoryForm);
    }
    if(this.transactionIds){
      let items = this.cardItems.filter(item => item.name.english == 'Complaint');
      this.cardItems = items;
      this.isCategorySelected = true;
      this.isTypeSelected = true;
      this.categoryType = 'Follow up Request';
      let commonList: Lov[] = [];
      commonList.push({
        sequence : 6,
        value: {
          arabic : 'متابعة طلب مقدم',
          english : 'Follow up Request'
        }
      })
      this.type1List = new LovList(commonList);
      this.categoryClick();
      let category: any =  'Complaint';
      let categoryType: BilingualText = {english: 'Follow up Request',arabic: 'متابعة طلب مقدم'};
      this.isSubmitted = false;
      this.selectedIndex = 0;
      this.isCLicked = true;
      this.isCardSelected.emit(true);
       this.labelChange(category);
      this.registerCategory.emit(category.english);
      this.category.emit(category);
      this.isSubmitted = false;
      this.selectedIndex = 0;
      this.categoryForm.get('complaintSubType').get('english').setValue(this.transactionIds);
       this.categoryForm.get('type').get('english').setValue(categoryType.english);
       this.categoryForm.get('type').get('arabic').setValue(categoryType.arabic);
    }
    if (this.cardItems?.length >= 2) {
      this.lastTwo = true;
    }
  }
  /**
   *
   * @param changes This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.typeLabels && changes.typeLabels.currentValue) {
      this.typeLabels = changes.typeLabels.currentValue;
    }
    if (changes && changes.typePlaceholders && changes.typePlaceholders.currentValue) {
      this.typePlaceholders = changes.typePlaceholders.currentValue;
    }
    if (changes && changes.subTypeLabels && changes.subTypeLabels.currentValue) {
      this.subTypeLabels = changes.subTypeLabels.currentValue;
    }
    if (changes && changes.subTypePlaceholders && changes.subTypePlaceholders.currentValue) {
      this.subTypePlaceholders = changes.subTypePlaceholders.currentValue;
    }
  }
  /**
   * Method to create required form
   */
  createCategoryForm(): FormGroup {
    return this.formBuilder.group({
      category: this.formBuilder.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      type: this.formBuilder.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      subType: this.formBuilder.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      complaintSubType: this.formBuilder.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      message: [null, Validators.compose([Validators.required])]
    });
  }
  /**
   *
   * @param category method to emit category
   */
  onCategorySelection(category: BilingualText) {
    if(!this.transactionIds){
    this.category.emit(category);
    this.isSubmitted = false;
    }
  }
  categoryClicked(category: any, index) {
    if(!this.transactionIds){
    this.isSubmitted = false;
    this.selectedIndex = index;
    this.isCLicked = true;
    this.isCardSelected.emit(true);
     this.labelChange(category?.english);
    this.registerCategory.emit(category.english);
  }
  }
  labelChange(categoryName){
  if(categoryName === 'Complaint'){
    this.categoryLabel = "COMPLAINTS.COMPLAINT-MESSAGE";
    } else if (categoryName === 'Suggestion'){
      this.categoryLabel = "COMPLAINTS.SUGGESTION-MESSAGE";
    }
    else{
      this.categoryLabel = "COMPLAINTS.ENQUIRY-MESSAGE";
    }
  }
  categoryClick() {
    this.isShowContactDetails.emit();
  }
  /**
   * method to emit clear event
   */
  onFocus() {
    this.clear.emit();
  }
  /**
   *
   * @param type method to emit type
   */
  onCategoryTypeSelect(type: BilingualText) {
    this.categoryType = type;
    this.type.emit(type);
  }
}
