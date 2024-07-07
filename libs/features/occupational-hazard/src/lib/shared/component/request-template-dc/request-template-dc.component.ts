import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants, BaseComponent, BilingualText, LovList, scrollToModalError } from '@gosi-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'oh-request-template-dc',
  templateUrl: './request-template-dc.component.html',
  styleUrls: ['./request-template-dc.component.scss']
})
export class RequestTemplateDcComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
  //Input Variables
  @Input() heading = '';
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() inspectionList$: Observable<LovList> = null;
  @Input() warningMessage: string;
  @Input() errorMessage: string;
  @Input() prohibitInspection: boolean;
  @Input() showInspectionError = false;
  @Input() showWorkInspectionError = false;

  //Output Variables
  @Output() submitEvent: EventEmitter<null> = new EventEmitter();
  @Output() selectedInspect: EventEmitter<BilingualText> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  //Local Variables
  selectedInspection: FormGroup = new FormGroup({});
  isDisabled = false;
  showMessage = false;
  mandatoryMessage = false;
  showWorkInspectionMessage = false;
  comments: FormControl = new FormControl(null, { updateOn: 'blur' });
  /**
   * Creates an instance of ReturnTemplateDcComponent
   * @memberof  RequestTemplateDcComponent
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
      if (this.parentForm.get('selectedInspection')) this.parentForm.removeControl('selectedInspection');
      if (this.parentForm.get('comments')) this.parentForm.removeControl('comments');
      this.parentForm.addControl('selectedInspection', this.selectedInspection);
      this.parentForm.addControl('comments', this.comments);
    }
  }
  /**
   *
   * @param changes Capturing input on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.warningMessage) {
      this.warningMessage = changes.warningMessage.currentValue;
    }
    if (changes && changes.prohibitInspection) {
      if (changes.prohibitInspection.currentValue) this.isDisabled = true;
      else this.isDisabled = false;
    }
    if (changes && changes.showInspectionError) {
      this.showInspectionError = changes.showInspectionError.currentValue;
    }
    if (changes && changes.showWorkInspectionError) {
      this.showWorkInspectionError = changes.showWorkInspectionError.currentValue;
    }
  }

  /** This method is to return the transaction */
  submitTransaction() {
    if (this.parentForm.valid) {
      this.submitEvent.emit();
    } else {
      scrollToModalError();
      this.mandatoryMessage = true;
      this.parentForm.markAllAsTouched();
    }
  }
  /** This method is to clear the transaction */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.parentForm.removeControl('returnReason');
    this.parentForm.removeControl('comments');
  }
  /** This method is to set warning message for the selected Inspection */
  selectedInspectMsg(selectedInspect) {
    if (selectedInspect === 'Employer Affairs Inspection') {
      if (this.showInspectionError) {
        this.isDisabled = true;
        this.showMessage = true;
      }
    } else if (selectedInspect === 'Occupational Hazards Investigation') {
      if (this.showWorkInspectionError) {
        this.isDisabled = true;
        this.showWorkInspectionMessage = true;
      }
    }
    if (
      (!this.showInspectionError && selectedInspect === 'Employer Affairs Inspection') ||
      (!this.showWorkInspectionError && selectedInspect === 'Occupational Hazards Investigation')
    ) {
      this.isDisabled = false;
      this.showWorkInspectionMessage = false;
      this.showMessage = false;
    }
    this.selectedInspect.emit(selectedInspect);
  }
  // Method to emit cancel details
  cancelEventDetails() {
    this.cancelEvent.emit();
  }
}
