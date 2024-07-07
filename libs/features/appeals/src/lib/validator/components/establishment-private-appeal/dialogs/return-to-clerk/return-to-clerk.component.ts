import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealValidatorRoles } from '@gosi-ui/features/appeals/lib/shared';

@Component({
  selector: 'return-to-clerk',
  templateUrl: './return-to-clerk.component.html'
})
export class ReturnToClerkComponent implements OnInit {
  form: FormGroup;
  Roles = AppealValidatorRoles;

  @Input() assignedRole: AppealValidatorRoles;
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * method to emit confirm
   */
  confirmSubmit() {
    this.form.updateValueAndValidity();
    this.form.markAllAsTouched();

    if (this.form.valid) this.confirm.emit(this.form.value);
  }

  /** Method to close the modal.   */
  hideModal() {
    this.closeModal.emit();
  }

  onInputBlur(): void {}

  initForm(): void {
    this.form = this.fb.group({
      comments: ['', Validators.required]
    });
  }
}
