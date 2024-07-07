import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched } from '@gosi-ui/core';

@Component({
  selector: 'fea-enter-complaint-dc',
  templateUrl: './enter-complaint-dc.component.html',
  styleUrls: ['./enter-complaint-dc.component.scss']
})
export class EnterComplaintDcComponent implements OnInit {
  @Input() isSend = false;
  @Output() send: EventEmitter<null> = new EventEmitter();
  @Output() close: EventEmitter<null> = new EventEmitter();

  sendComplainForm: FormGroup = null;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.sendComplainForm = this.createSendComplainForm();
  }
  createSendComplainForm() {
    return this.fb.group({
      complainDetails: [null, Validators.required],
      complainOf: [null, Validators.required],
      complainType: [null, Validators.required]
    });
  }

  sendComplaint() {
    markFormGroupTouched(this.sendComplainForm);
    if (this.sendComplainForm.valid) {
      this.send.emit(this.sendComplainForm.getRawValue());
    }
  }
  closeWindow() {
    this.close.emit();
  }
}
