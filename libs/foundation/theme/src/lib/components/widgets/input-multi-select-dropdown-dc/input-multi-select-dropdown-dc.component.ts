/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Renderer2,
  ViewChild,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import {
  LanguageToken,
  LovList,
  Lov,
  InputBaseComponent,
  getErrorMsg,
  BilingualText,
  DropdownValues
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ElementRef } from '@angular/core';

// type multi = { sequence: number, english: string, arabic: string }
@Component({
  selector: 'gosi-input-multi-select-dropdown-dc',
  templateUrl: './input-multi-select-dropdown-dc.component.html',
  styleUrls: ['./input-multi-select-dropdown-dc.component.scss']
})
export class InputMultiSelectDropdownDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  //variables
  dropdownSettings: IDropdownSettings = {};
  selectedEnglishItems: Array<DropdownValues> = [];
  selectedArabicItems: Array<DropdownValues> = [];
  items: Lov[];
  selectedLanguage = 'en';
  dropdownValues: Array<DropdownValues> = [];
  multiSelectClick = false;
  multiSelectClickoutside = false;
  showClearButton = false;

  //css label
  @Input() noMarginLabel: boolean;

  //input Decorators
  @Input() list: LovList = null;
  @Input() selectedValues: BilingualText[];
  @Input() selectedLOVValues: LovList[];
  @Input() allowSearch = false;
  @Input() personList = false;
  @Input() searchPlaceholder: string;
  @Input() showReset = false;

  //Output decorators
  @Output() selected: EventEmitter<string[]> = new EventEmitter();
  @Output() clickInside: EventEmitter<any[]> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  @Output() selectedLOV: EventEmitter<LovList[]> = new EventEmitter();
  @Output() reset = new EventEmitter<null>();
  @Output() clearClicked: EventEmitter<boolean> = new EventEmitter();
  closeClick: boolean = false;
  resetClicked: boolean = false;

  //to ovverride an inline html style
  @ViewChild('arabicMultiSelectRef', { read: ElementRef }) set content(content: ElementRef) {
    if (content) {
      const mainSpan: HTMLSpanElement = content.nativeElement
        .getElementsByClassName('dropdown-btn')
        .item(0) as HTMLSpanElement;
      if (this.selectedLanguage === 'ar') {
        (mainSpan.lastChild as HTMLElement).style.float = 'left';
      }
    }
  }
  @ViewChild('multiSelectDropdown') multiSelectDropdown: ElementRef;
  /** constructors are initialized */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private el: ElementRef,
    private renderer: Renderer2,
    readonly cdr: ChangeDetectorRef
  ) {
    super();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'sequence',
      textField: 'english',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false
    };
  }
  /**Method to initialize */
  ngOnInit() {
    super.ngOnInit();
    this.renderer.removeClass(this.el.nativeElement, '.multiselect-dropdown.dropdown-button');
    this.language.subscribe(lang => {
      this.selectedLanguage = lang;
      if (lang === 'en') {
        this.dropdownSettings = {
          ...this.dropdownSettings,
          ...{ textField: 'english', noDataAvailablePlaceholderText: 'Data unavailable' }
        };
        this.onItemSelect();
      } else {
        this.dropdownSettings = {
          ...this.dropdownSettings,
          ...{ textField: 'arabic', noDataAvailablePlaceholderText: 'البيانات غير متوفرة' }
        };
        this.onItemSelect();
      }
      this.cdr.detectChanges();
    });
  }
  /**
   * This method is to handle the changes in inputs.
   *
   * @memberof InputSelectDcComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.personList) {
      this.dropdownSettings.idField = 'code';
    }
    if (changes.list && changes.list.currentValue != null) {
      if (changes.list.currentValue?.items != null) {
        this.dropdownValues = this.list?.items?.map(item => {
          return {
            sequence: item?.sequence,
            english: item?.value?.english,
            arabic: item?.value?.arabic,
            code: item?.code
          };
        });
      }
    }
    if (this.selectedValues && this.selectedValues?.length>0) {
      this.selectedEnglishItems = this.selectedArabicItems = this.selectedValues as Array<DropdownValues>;
      this.selectedEnglishItems = this.selectedArabicItems = this.dropdownValues.filter(value =>
        this.selectedValues.find(item => item?.english === value.english)
      );
      this.onItemSelect();
    }

    if (
      changes.selectedValues &&
      changes.selectedValues.currentValue &&
      changes.selectedValues.currentValue.length == 0
    ) {
      this.showClearButton = false;
    } else {
      this.showClearButton = true;
    }

    if (changes.allowSearch && changes.allowSearch.currentValue !== undefined)
      this.dropdownSettings.allowSearchFilter = this.allowSearch;
    if (changes.searchPlaceholder && changes.searchPlaceholder.currentValue)
      this.dropdownSettings = { ...this.dropdownSettings, ...{ searchPlaceholderText: this.searchPlaceholder } };
    this.cdr.detectChanges();
  }
  onItemDeselect() {
    this.closeClick = true;
    this.close.emit(this.closeClick);
  }
  /** Method to emit the billingual array and populate billingual data english and arabic arrays on item select and deselect */
  onItemSelect() {
    const billingualArray = [];
    if (this.personList) {
      this.selectedArabicItems = [];
      this.selectedEnglishItems.forEach(item => {
        const bilingualValues = this.dropdownValues.find(value => value.code === item.code);
        this.selectedArabicItems.push({ ...item, ...bilingualValues });
        billingualArray.push(bilingualValues);
      });
    } else {
      if (this.selectedLanguage === 'en') {
        this.selectedArabicItems = [];
        this.selectedEnglishItems.forEach(item => {
          const bilingualValues = this.dropdownValues.find(value => value.english === item.english);
          this.selectedArabicItems.push({ ...item, ...bilingualValues });
          billingualArray.push(bilingualValues);
        });
      } else {
        this.selectedEnglishItems = [];
        this.selectedArabicItems.forEach(item => {
          const bilingualValues = this.dropdownValues.find(value => value.arabic === item.arabic);
          this.selectedEnglishItems.push({ ...item, ...bilingualValues });
          billingualArray.push(bilingualValues);
        });
      }
    }
    if (billingualArray.length > 0) {
      this.showClearButton = true;
    } else {
      this.showClearButton = false;
    }
    this.selected.emit(billingualArray);
  }

  /** method to set error message conctrols on close */
  onClose() {
    if (this.control.controls) {
      this.setErrorMsgs(this.control.controls.english);
    }
  }
  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputSelectDcComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }
  @HostListener('document:click', ['$event'])
  onclick(event): void {
    if (this.multiSelectDropdown) {
      const selectCLick: any = this.multiSelectDropdown.nativeElement.contains(event.target);
      this.clickInside.emit(selectCLick);
      this.validationMethod(event);
    }
  }
  validationMethod(event) {
    if (this.multiSelectDropdown.nativeElement.contains(event.target) === false) {
      if (this.multiSelectClick) {
        this.multiSelectClickoutside = true;
      }
    }
    if (this.multiSelectDropdown.nativeElement.contains(event.target)) {
      if (this.multiSelectDropdown.nativeElement.getElementsByClassName('item2')[0].contains(event.target) === false) {
        this.multiSelectDropdown.nativeElement.getElementsByClassName('item2')[0].scrollTop = 0;
      }
      this.multiSelectClick = true;
    }
    this.validationCheck(event);
  }
  inputValidationCheck() {
    if (this.control.controls.english.status === 'INVALID' && this.multiSelectClickoutside === true) {
      return true;
    } else if (
      this.control.controls.arabic.value === null &&
      this.control.controls.arabic.status === 'INVALID' &&
      this.multiSelectClickoutside === true
    ) {
      return true;
    } else if (this.control.controls.english.status === 'INVALID' && this.control.controls.english.touched === true) {
      return true;
    } else if (this.control.controls.arabic.status === 'INVALID' && this.control.controls.arabic.touched === true) {
      return true;
    } else return false;
  }
  validationCheck(event) {
    if (
      this.multiSelectClick === true &&
      (this.selectedEnglishItems === null || this.selectedEnglishItems?.length === 0) &&
      this.multiSelectDropdown.nativeElement.contains(event.target) === false
    ) {
      this.onClose();
    } else if (
      this.multiSelectClick === true &&
      this.selectedEnglishItems?.length > 0 &&
      this.multiSelectDropdown.nativeElement.contains(event.target) === true
    ) {
      this.onClose();
    } else if (
      this.multiSelectClick === true &&
      this.selectedArabicItems?.length > 0 &&
      this.multiSelectDropdown.nativeElement.contains(event.target) === true
    ) {
      this.onClose();
    } else if (
      this.multiSelectClick === true &&
      (this.selectedArabicItems === null || this.selectedEnglishItems?.length === 0) &&
      this.multiSelectDropdown.nativeElement.contains(event.target) === false
    ) {
      this.onClose();
    } else if (
      this.multiSelectDropdown.nativeElement.contains(event.target) === false &&
      this.multiSelectClick === true
    ) {
      this.onClose();
    }
  }
  resetFilter(event) {
    this.resetClicked = true;
    event.stopPropagation();
    this.showClearButton = false;
    event.stopPropagation();
    this.clearClicked.emit(this.resetClicked);
    this.reset.emit();
  }
}
