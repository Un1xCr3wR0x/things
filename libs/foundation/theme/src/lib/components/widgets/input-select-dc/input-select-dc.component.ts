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
import { BilingualText, InputBaseComponent, LanguageToken, Lov, LovList, getErrorMsg } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
//import Fuse from 'fuse.js';
/**
 * This component is to handle input select fields.
 *
 * @export
 * @class InputSelectDcComponent
 * @extends {InputBaseComponent}
 */
@Component({
  selector: 'gosi-input-select-dc',
  templateUrl: './input-select-dc.component.html',
  styleUrls: ['./input-select-dc.component.scss']
})
export class InputSelectDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  @Input() list: LovList = null;
  @Input() lookup: Lov[];
  @Input() arrayList = [];
  @Input() noMargin = false; //Remove Margin
  @Input() hideClear = false;
  @Input() inputAttrs = null;
  @Input() bindValueIsCode = false;
  @Input() searchable = true;
  @Input() canValidateData = true;
  items: Lov[];
  //fuse :Fuse<any>;

  @Output() select: EventEmitter<BilingualText> = new EventEmitter();
  @Output() selectLov: EventEmitter<Lov> = new EventEmitter();
  @Output() changeEvent: EventEmitter<null> = new EventEmitter();

  value: number = null;
  bindLabel = 'value.english';
  selectedLang = 'en';

  /**
   * Creates an instance of InputSelectDcComponent.
   * @memberof InputSelectDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  /**
   * This method is to handle the initialization tasks.
   *
   * @memberof InputSelectDcComponent
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
   * @memberof InputSelectDcComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.lookup && changes.lookup.currentValue != null) {
      this.items = changes.lookup.currentValue;
      this.validateData();
    }

    if (changes.arrayList && changes.arrayList.currentValue?.length > 0) {
      this.items = this.arrayList.slice();
      this.validateData();
    }
    if (changes.list && changes.list.currentValue != null) {
      if (changes.list.currentValue.items != null) {
        this.items = changes.list.currentValue.items;
        this.validateData();
      }
    }
    if (changes?.control && changes?.control?.currentValue) {
      this.validateData();
    }
  }
  validateData() {
    if (!this.canValidateData) return;
    if (!this.canValidateData) return;
    if (this.control && this.control?.controls?.english?.value) {
      let flag = false;
      this.items?.forEach(lov => {
        if (lov?.value?.english === this.control?.controls?.english?.value) {
          flag = true;
        }
      });
      if (!flag) {
        const lov: Lov = {
          sequence: this.items?.length,
          value: { english: this.control?.controls?.english?.value, arabic: this.control?.controls?.arabic?.value },
          code: 999999,
          disabled: true,
          display: true
        };
        if (!this.items || this.items?.length <= 0) this.items = [];
        this.items.push(lov);
        this.control?.controls?.english.setErrors({ invalidDropdownValue: { invalid: true } });
        // this.control?.controls?.arabic.setErrors({ invalidDropdownValue: { invalid: true } });
        this.setErrorMsgs(this.control?.controls?.english);
      }
    } else {
      this.setErrorMsgs(this.control?.controls?.english);
    }
  }

  /**
   * Listner function for change event
   *
   * @memberof InputSelectDcComponent
   */
  @HostListener('change', ['$event.target.value'])
  change(val) {
    if (val && val.value) {
      if (this.control.controls) {
        (this.control as FormGroup).controls.english.setValue(val.value.english);
        (this.control as FormGroup).controls.arabic.setValue(val.value.arabic);
      }
      this.select.emit(val.value.english);
      this.selectLov.emit(val);
      if (this.bindValueIsCode) {
        (this.control as FormGroup).controls.english.setValue(val.code);
        this.select.emit(val.code);
        this.selectLov.emit(val);
      }
    } else if (val && this.control && !this.control.controls) {
      (this.control as FormGroup).setValue(val);
      this.select.emit(val);
    }
  }

  /**
   * This method handles the on close event.
   *
   * @param {any} controlName
   * @memberof InputSelectDcComponent
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
   * @memberof InputSelectDcComponent
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
   * @memberof InputSelectDcComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }

  /** Method to handle change in control value */
  onChange(event) {
    this.changeEvent.emit();
  }

  filterByFuse(term: string, item: any) {
    const fuseOptions = {
      isCaseSensitive: false,
      findAllMatches: true,
      threshold: 0.4,
      keys: ['value.arabic', 'value.english']
    };
    let newArrayForSearch = [item];
    /*  this.fuse = new Fuse(newArrayForSearch,fuseOptions);
    let result = this.fuse.search(term);
    return result.length > 0; */
    return '';
  }
}
