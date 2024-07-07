import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GosiCalendar } from '@gosi-ui/core';

@Component({
  selector: 'bnt-modify-request-date-dc',
  templateUrl: './modify-request-date-dc.component.html',
  styleUrls: ['./modify-request-date-dc.component.scss']
})
export class ModifyRequestDateDcComponent implements OnInit {
  requestDateForm: FormGroup;
  @Input() benefitRequest;
  @Input() systemRunDate: GosiCalendar;
  @Input() showIneligibilityPoup = false;
  @Input() showAlertMsg = true;

  @Output() close = new EventEmitter();
  @Output() onSave = new EventEmitter();
  @Output() showEligibilityPopup = new EventEmitter();
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.requestDateForm = this.createrequestDetailsForm();
  }
  createrequestDetailsForm() {
    return this.fb.group({
      requestDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      })
    });
  }
}
