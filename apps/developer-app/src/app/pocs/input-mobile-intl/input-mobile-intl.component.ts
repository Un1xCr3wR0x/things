import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'dev-input-mobile-intl',
  templateUrl: './input-mobile-intl.component.html',
  styleUrls: ['./input-mobile-intl.component.scss']
})
export class InputMobileIntlComponent implements OnInit {
  control = new FormControl(null, { updateOn: 'blur' });
  isdControl = new FormControl(null);
  constructor() {}

  ngOnInit(): void {
    this.control.setValidators(Validators.required);
  }
}
