import { BaseComponent, markFormGroupTouched } from '@gosi-ui/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'fea-individual-search',
  templateUrl: './individual-search-dc.component.html',
  styleUrls: ['./individual-search-dc.component.scss']
})
export class IndividualSearchDcComponent extends BaseComponent implements OnInit {
  individualForm: FormGroup = null;
  @Input() label: String;
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.individualForm = this.createIndividualForm();
  }

  createIndividualForm() {
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
    markFormGroupTouched(this.individualForm);
    if (this.individualForm.valid) {
      this.submit.emit(this.individualForm.getRawValue());
    } else {
      this.invalidForm.emit();
    }
  }
}
