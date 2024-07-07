import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lov } from '@gosi-ui/core';
import { AppealConstants } from '@gosi-ui/features/appeals';

@Component({
  selector: 'assign-to-specialist',
  templateUrl: './assign-to-specialist.component.html'
})
export class AssignToSpecialistComponent implements OnInit {
  @Input() appealSpecialistList: Lov[];
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() confirm: EventEmitter<null> = new EventEmitter();

  specialistForm: FormGroup;
  // appealSpecialistList: Lov[] = [];

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    // this.appealSpecialistList = AppealConstants.SPECIALIST_LIST;
  }

  initForm(): void {
    this.specialistForm = this.fb.group({
      roleId: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      comments: ['', Validators.required]
    });
  }

  /**
   * method to emit confirm
   */
  confirmSubmit() {
    this.specialistForm.updateValueAndValidity();
    this.specialistForm.markAllAsTouched();
    if (this.specialistForm.valid) this.confirm.emit(this.specialistForm.value);
  }

  /** Method to close the modal.   */
  hideModal() {
    this.closeModal.emit();
  }

}
