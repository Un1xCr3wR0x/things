import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'dev-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit {
  textArray: FormArray;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.textArray = this.fb.array([]);
    [1, 2, 3, 4, 5].forEach((_, index) => {
      if (index !== 3) {
        this.textArray.push(
          new FormControl(null, {
            validators: Validators.compose([Validators.required, Validators.minLength(3)]),
            updateOn: 'blur'
          })
        );
      } else {
        this.textArray.push(
          new FormControl(null, {
            validators: Validators.compose([Validators.minLength(3)]),
            updateOn: 'blur'
          })
        );
      }
    });
  }
}
