import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BaseComponent, markFormGroupTouched } from '@gosi-ui/core';

@Component({
  selector: 'fea-establishments-search-dc',
  templateUrl: './establishments-search-dc.component.html',
  styleUrls: ['./establishments-search-dc.component.scss']
})
export class EstablishmentsSearchDcComponent extends BaseComponent implements OnInit {
  establishmentDetailsForm: FormGroup = null;
  @Input() label: String;
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.establishmentDetailsForm = this.createEstablishmentForm();
  }
  createEstablishmentForm() {
    return this.fb.group({
      data: [null, Validators.required]
    });
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  search() {
    markFormGroupTouched(this.establishmentDetailsForm);
    if (this.establishmentDetailsForm.valid) {
      this.submit.emit(this.establishmentDetailsForm.getRawValue());
    } else {
      this.invalidForm.emit();
    }
  }
}
