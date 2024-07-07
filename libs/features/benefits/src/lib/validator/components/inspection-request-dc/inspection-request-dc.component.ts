import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { LovList, BaseComponent, scrollToModalError, AppConstants, BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'bnt-inspection-request-dc',
  templateUrl: './inspection-request-dc.component.html',
  styleUrls: ['./inspection-request-dc.component.scss']
})
export class InspectionRequestDcComponent extends BaseComponent implements OnInit, OnDestroy {
  //Input Variables
  @Input() heading = '';
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() inspectionList$: Observable<LovList> = null;
  @Input() warningMessage: string;
  @Input() inspectionSelected: BilingualText;
  //Output Variables
  @Output() submitEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  //Local Variables
  selectedInspection: FormGroup = new FormGroup({});
  comments: FormControl = new FormControl(null, { updateOn: 'blur' });
  /**
   * Creates an instance of ReturnTemplateDcComponent
   * @memberof  InspectionRequestDcComponent
   *
   */
  constructor(private fb: FormBuilder) {
    super();
    this.selectedInspection = this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }
  /** This method is to initialise the component */
  ngOnInit() {
    if (this.parentForm) {
      this.parentForm.get('selectedInspection')
        ? this.parentForm.removeControl('selectedInspection')
        : this.parentForm.addControl('selectedInspection', this.selectedInspection);
      this.parentForm.get('comments')
        ? this.parentForm.removeControl('comments')
        : this.parentForm.addControl('comments', this.comments);
    }
    if (this.inspectionSelected) this.selectedInspection.patchValue(this.inspectionSelected);
  }

  /** This method is to return the transaction */
  submitTransaction() {
    this.parentForm.markAllAsTouched();
    this.parentForm.updateValueAndValidity();
    if (this.parentForm.valid) {
      this.submitEvent.emit();
    } else {
      scrollToModalError();
    }
  }
  /** This method is to clear the transaction */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.parentForm.removeControl('returnReason');
    this.parentForm.removeControl('comments');
  }
  // Method to emit cancel details

  cancelEventDetails() {
    this.cancelEvent.emit();
  }
}
