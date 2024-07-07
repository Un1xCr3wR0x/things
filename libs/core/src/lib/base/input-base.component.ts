/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FieldError } from '../models';
import { BaseComponent } from './base-component';

/**
 * This is the base component for all input elements like text, select etc.
 *
 * @export
 * @abstract
 * @class InputBaseComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 */

@Directive()
export abstract class InputBaseComponent extends BaseComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() id: string;
  @Input() name: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() control;
  @Input() helpText: string;
  @Input() ignoreLabel = false;
  @Input() readOnly = false;
  @Input() disabled = false;
  @Input() show = true;
  @Input() value = null;
  @Input() loading = false;
  @Input() invalidSelection: string;
  @Input() disabledValues: string[];
  @Input() maxLength: number = null;
  @Input() size: string;
  @Input() noMargin = false;
  @Input() noPadding = false;
  @Input() tooltipContent: string; //tooltip with info icon
  @Input() overridePlaceholder = false;
  @Input() hideOptionalLabel = false;
  @Input() hidePlaceholder = false;
  @Input() defaultPlaceholder = false;
  @Input() isPassword = false;
  // Output Variables
  @Output() keyUp: EventEmitter<null> = new EventEmitter();
  @Output() blur: EventEmitter<null> = new EventEmitter();
  @Output() focus: EventEmitter<null> = new EventEmitter();
  // Local Variables
  errorMsg: Subject<FieldError>;
  errorMsg$: Observable<FieldError>;
  validationError: FieldError;
  isInValid = false;

  /**
   * Creates an instance of InputBaseComponent.
   *
   * @memberof InputBaseComponent
   */
  constructor() {
    super();
    this.errorMsg = new BehaviorSubject<FieldError>(null);
    this.errorMsg$ = this.errorMsg.asObservable();
  }

  /**
   * This method is to handle the initialization tasks.
   *
   * @memberof InputBaseComponent
   */
  ngOnInit() {
    this.errorMsg$.subscribe((validationError: FieldError) => {
      this.validationError = validationError;
    });
    if (this.isPassword === true) {
      this.readOnly = true;
    }
  }
  /**
   * This method is used to handle the changes in the input variables
   * @param changes
   * @memberof InputBaseComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled) {
      this.disabled = changes.disabled.currentValue;
      if (this.control) {
        if (this.disabled) {
          this.control.disable();
        } else {
          this.control.enable();
        }
      }
    }
    if (changes.placeholder && changes.placeholder.currentValue) {
      this.placeholder = changes.placeholder.currentValue;
    }
  }

  /**
   * This method is to handle keyup events.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  onKeyUp(e) {
    this.keyUp.emit(e);
  }

  /**
   * Method to handle blur events
   * @param e Event
   * @param triggerEvent Default value is true, handle events if required.
   */
  onBlur(e, triggerEvent = true) {
    if (this.isPassword === true) {
      this.readOnly = true;
    }
    this.blur.emit(e);
    if (this.control?.controls) {
      this.setErrorMsgs(this.control?.controls.english);
    } else {
      if (this.control?.value && typeof this.control?.value === 'string')
        this.control.setValue(this.control.value.trim(), { emitEvent: triggerEvent });
      this.setErrorMsgs(this.control);
    }
  }
  /**
   * This method is to handle focus events.
   * @param e
   */
  onFocus(e) {
    if (this.isPassword === true) {
      this.readOnly = false;
    }
    this.focus.emit(e);
  }

  /**
   * This method is to validate the field validity.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  validateField() {
    const control = this.control;
    if (control?.controls) {
      return control?.controls?.english?.invalid &&
        (control?.controls?.english?.dirty || control?.controls?.english?.touched)
        ? true
        : false;
    } else return control?.invalid && (control?.dirty || control?.touched) ? true : false;
  }

  get hasValue() {
    if (this.control?.controls) {
      return this.control?.controls.english?.value;
    } else {
      return this.control?.value;
    }
  }

  abstract setErrorMsgs(control);

  /**
   * This method is mark the form element as mandatory.
   *
   * @returns true if the element is mandatory.
   * @memberof InputBaseComponent
   */
  isRequired() {
    let validator = null;
    if (this.control?.controls) {
      if (this.control?.controls?.english?.validator) {
        validator = this.control?.controls?.english?.validator({} as AbstractControl);
      }
      return validator && validator?.required ? true : false;
    } else {
      if (this.control?.validator) {
        validator = this.control?.validator({} as AbstractControl);
      }
      return validator && validator?.required ? true : false;
    }
  }
}
