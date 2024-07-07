/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  BilingualText,
  getErrorMsg,
  InputBaseComponent,
  LanguageToken,
  LovCategoryList,
  LovCategory
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

/**
 * This component is to handle input select fields.
 *
 * @export
 * @class InputGroupbySelectDropdownDcComponent
 * @extends {InputBaseComponent}
 */
@Component({
  selector: 'gosi-input-group-select-dc',
  templateUrl: './input-groupby-select-dropdown-dc.component.html',
  styleUrls: ['./input-groupby-select-dropdown-dc.component.scss']
})
export class InputGroupbySelectDropdownDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  @Input() list: LovCategoryList = null;
  @Input() lookup: LovCategory[];
  @Input() arrayList = [];
  items: LovCategory[];

  @Output() select: EventEmitter<LovCategory> = new EventEmitter();
  @Output() selectLov: EventEmitter<LovCategory> = new EventEmitter();
  @Output() changeEvent: EventEmitter<null> = new EventEmitter();

  value: number = null;
  bindLabel = 'value.english';
  selectedLang = 'en';

  /**
   * Creates an instance of InputGroupbySelectDropdownDcComponent.
   * @memberof InputGroupbySelectDropdownDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  /**
   * This method is to handle the initialization tasks.
   *
   * @memberof InputGroupbySelectDropdownDcComponent
   */
  ngOnInit() {
    super.ngOnInit();
    this.language.subscribe(lang => {
      this.selectedLang = lang;
      if (lang === 'en') {
        this.bindLabel = 'value.english';
      } else {
        this.bindLabel = 'value.arabic';
      }
    });
  }

  /**
   * This method is to handle the changes in inputs.
   *
   * @memberof InputGroupbySelectDropdownDcComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.lookup && changes.lookup.currentValue != null) {
      // this.items = changes.lookup.currentValue;
    }

    if (changes.arrayList && changes.arrayList.currentValue.length > 0) {
      //this.items = this.arrayList.slice();
    }
    if (changes.list && changes.list.currentValue != null) {
      if (changes.list.currentValue.items != null) {
        this.items = changes.list.currentValue.items;
      }
    }
  }

  /**
   * Listner function for change event
   *
   * @memberof InputGroupbySelectDropdownDcComponent
   */
  @HostListener('change', ['$event.target.value'])
  change(val) {
    if (val && val.value) {
      if (this.control.controls) {
        (this.control as FormGroup).controls.english.setValue(val.value.english);
        (this.control as FormGroup).controls.arabic.setValue(val.value.arabic);
      }
      this.select.emit(val);
      this.selectLov.emit(val);
    } else if (val && this.control && !this.control.controls) {
      (this.control as FormGroup).setValue(val);
      this.select.emit(val);
    }
  }

  /**
   * This method handles the on close event.
   *
   * @param {any} controlName
   * @memberof InputGroupbySelectDropdownDcComponent
   */
  close() {
    if (this.control.controls) {
      this.setErrorMsgs(this.control.controls.english);
    } else if (this.control && !this.control.controls) {
      this.setErrorMsgs(this.control);
    }
  }

  /**
   * This method handles the on clear event.
   *
   * @memberof InputGroupbySelectDropdownDcComponent
   */
  clear() {
    if (this.control.controls) {
      this.control.controls.english.setValue(null);
      this.control.controls.arabic.setValue(null);
      this.setErrorMsgs(this.control.controls.english);
    } else if (this.control && !this.control.controls) {
      this.control.setValue(null);
      this.setErrorMsgs(this.control);
    }
    this.select.emit(null);
    this.selectLov.emit(null);
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputGroupbySelectDropdownDcComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }

  /** Method to handle change in control value */
  onChange(event) {
    this.changeEvent.emit();
  }
}
