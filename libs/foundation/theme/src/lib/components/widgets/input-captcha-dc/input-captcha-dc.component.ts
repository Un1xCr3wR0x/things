import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'gosi-input-captcha-dc',
  templateUrl: './input-captcha-dc.component.html',
  styleUrls: ['./input-captcha-dc.component.scss']
})
export class InputCaptchaDcComponent implements OnInit {
  @Input() captchaString: string;
  @Input() control: FormControl;

  @Output() refresh = new EventEmitter<null>();
  constructor() {}

  ngOnInit(): void {}
  /**
   * This method is to refresh captcha.
   */

  refreshCaptcha() {
    this.control.markAsUntouched();
    this.control.markAsPristine();
    this.control.reset();
    this.refresh.emit();
  }
}
