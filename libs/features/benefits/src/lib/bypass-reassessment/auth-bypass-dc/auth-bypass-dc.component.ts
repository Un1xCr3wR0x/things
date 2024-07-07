/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LanguageToken, markFormGroupTouched, scrollToTop } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-auth-bypass-dc',
  templateUrl: './auth-bypass-dc.component.html',
  styleUrls: ['./auth-bypass-dc.component.scss']
})
export class AuthBypassDcComponent implements OnInit {
  //Local Variables
  authbypassForm: FormGroup;
  lang: string;
  errorMsg = false;
  //Input Variables
  @Input() captcha: string;
  //Output Variables
  @Output() refresh = new EventEmitter<null>();
  @Output() authId: EventEmitter<number> = new EventEmitter();
  @Output() onContinueClicked = new EventEmitter<{ identity: number; captchaValue: string }>();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  /**
   *
   * @param fb
   * @param language
   */
  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.authbypassForm = this.fb.group({
      identity: [null, Validators.required],
      captchaControl: [null, Validators.required]
    });
    this.language.subscribe(language => (this.lang = language));
  }
  refreshCaptcha() {
    this.refresh.emit();
  }
  getNin(nin: number) {
    this.authId.emit(nin);
  }
  /** Method to handle captcha and nin verification on continue button click. */
  continueAuth() {
    this.errorMsg = false;
    markFormGroupTouched(this.authbypassForm);
    this.authbypassForm.updateValueAndValidity();
    if (this.authbypassForm.valid) {
      this.onContinueClicked.emit({
        identity: this.authbypassForm.get('identity').value,
        captchaValue: this.authbypassForm.get('captchaControl').value
      });
    } else {
      scrollToTop();
      this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
    }
  }
}
