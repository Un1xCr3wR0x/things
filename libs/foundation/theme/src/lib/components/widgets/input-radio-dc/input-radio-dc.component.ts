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
import { InputBaseComponent, LanguageToken, Lov, LovList, getErrorMsg } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-input-radio-dc',
  templateUrl: './input-radio-dc.component.html',
  styleUrls: ['./input-radio-dc.component.scss']
})
export class InputRadioDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  @Input() noMargin = false;
  @Input() list: LovList = null;
  @Input() isVerticalAlign = false;
  @Input() hidenValues: string[] = [];

  items: Lov[] = null;

  @Output() select: EventEmitter<null> = new EventEmitter();

  value: number = null;
  selectedLang = 'en';

  /**
   * Creates an instance of InputRadioDcComponent.
   * @memberof InputRadioDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.list && this.list.items) {
      this.items = this.list.items;
    }
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.list && changes.list.currentValue && changes.list.previousValue !== changes.list.currentValue) {
      this.items = changes.list.currentValue.items;
    }
    if (changes.disabled && changes.disabled.currentValue) {
      this.disabled = changes.disabled.currentValue;
    }
  }

  @HostListener('change', ['$event.target.value'])
  change(val) {
    if (val && val.value) {
      if (this.control.controls) {
        this.control.controls.english.setValue(val.value.english);
        this.control.controls.arabic.setValue(val.value.arabic);
      }
      this.select.emit(val.value.english);
      this.value = val.value.english;
    }
  }

  isDisabled(value) {
    if (this.disabled) {
      return true;
    } else if (this.disabledValues && this.disabledValues.includes(value)) {
      return true;
    } else {
      return null;
    }
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }
}
