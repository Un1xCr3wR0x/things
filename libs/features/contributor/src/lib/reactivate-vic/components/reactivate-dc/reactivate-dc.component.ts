import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, LovList, markFormGroupTouched, scrollToTop } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContributorConstants, EngagementDetails, ReactivateEngagementDetails, ReactivateEngagementRequest } from '../../../shared';
import { Location } from '@angular/common';

@Component({
  selector: 'cnt-reactivate-dc',
  templateUrl: './reactivate-dc.component.html',
  styleUrls: ['./reactivate-dc.component.scss'] 
})
export class ReactivateDcComponent implements OnInit {
  modalRef: BsModalRef;
  ReactivateDetailsForm: FormGroup = new FormGroup({});
  
  @Input() lang: string;
  @Input() engagement: EngagementDetails;
  @Input() reactivateEngagements : ReactivateEngagementDetails;
  @Input() reactivateReasonList: LovList;
  @Input() validatorForm: FormGroup;
  @Input() isEditMode: boolean;

  
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() save = new EventEmitter<ReactivateEngagementRequest>();
  // engagement: EngagementDetails;
  
  ENGAGEMENT_INACTIVE = ContributorConstants.ENGAGEMENT_INACTIVE_STATUS;
  ENGAGEMENT_ACTIVE = ContributorConstants.ENGAGEMENT_ACTIVE_STATUS;
  ENGAGEMENT_CANCELLED = ContributorConstants.ENGAGEMENT_CANCELLED_STATUS;
  CANCEL_IN_PROGRESS = ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS;
  isFormChanged: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly location: Location,
  ) { }

  ngOnInit(): void {
    this.ReactivateDetailsForm = this.createReactivateForm();
    if(this.isEditMode){
      this.ReactivateDetailsForm.addControl('penaltyIndicator', this.fb.control(false));
      this.ReactivateDetailsForm.get('penaltyIndicator').setValue(false);
    }
    this.checkChangeInForm();

  }

  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges) {
     if(changes.reactivateEngagements && changes.reactivateEngagements.currentValue){
      if(this.isEditMode)this.bindDataToForm();
      console.log('second dc',this.reactivateEngagements);
      console.log(this.engagement);
      
     }
    
  }

  checkChangeInForm(){
    this.ReactivateDetailsForm.valueChanges.subscribe(() => {
      this.isFormChanged = true;
    });
  }

   /** Method to navigate back based on mode. */
   navigateBack() {
    this.location.back();
  }
  


  /**Getters for form control */
private get reactivateReasonFormControl(): FormControl {
  return this.ReactivateDetailsForm.get('reactivateReason') as FormControl;
}
private get CrmFormControl(): FormControl {
  return this.ReactivateDetailsForm.get('crmid') as FormControl;
}

  bindDataToForm(){
    Object.keys(this.reactivateEngagements).forEach(name => {
      if (this.ReactivateDetailsForm.get(name)) {
        
       if (name === 'reactivateReason') {
          this.reactivateReasonFormControl.setValue(this.reactivateEngagements.reactivateReason, { emitEvent: false });
        }
        else if (name === 'crmid') {
          this.CrmFormControl.setValue(this.reactivateEngagements.crmid, { emitEvent: false });
        }
        
      }
    });
  }


    /** Method to create terminate form. */
    createReactivateForm(): FormGroup {
      return this.fb.group({
        reactivateReason: this.fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        }),
        crmid : [null]
      });
    }


  saveReactivateDetails(){
    markFormGroupTouched(this.ReactivateDetailsForm);
    if(this.ReactivateDetailsForm.valid){
      this.save.emit(this.reactivatePayload());
    }else{
      this.showMandatoryFieldsError();
    }
  }


  /** Method to set mandatory fields validation (Use this as common method for all under this feature). */
  showMandatoryFieldsError() {
    scrollToTop();
    this.alertService.showMandatoryErrorMessage();
  }

   /** Method to assemble reactivate payload. */
   reactivatePayload(): ReactivateEngagementRequest {
    const payload: ReactivateEngagementRequest = new ReactivateEngagementRequest();
    payload.penaltyIndicator = this.ReactivateDetailsForm?.get('penaltyIndicator')?.value;
    payload.reactivateReason = this.ReactivateDetailsForm?.get('reactivateReason')?.value;
    payload.editFlow = this.isEditMode;
    payload.crmid = this.ReactivateDetailsForm?.get('crmid')?.value;
    console.log("payload", payload)
    return payload;
  }


  /**
   * This method is used to show given template
   * @param template
   */
  showTemplate(template: TemplateRef<HTMLElement>): void {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  confirmCancel(): void {
    this.reset.emit();
    this.decline();
  }
  /**Method to hide modal */
  decline(): void {
    this.modalRef.hide();
  }

}
