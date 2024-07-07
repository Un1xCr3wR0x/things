import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList, markFormGroupTouched } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { EngagementDetails ,ContributorConstants, ReactivateEngagementDetails, ReactivateEngagementRequest } from '@gosi-ui/features/contributor/lib/shared';

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
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() save = new EventEmitter<ReactivateEngagementRequest>();
  isEditMode: boolean = false;
  // engagement: EngagementDetails;

  ENGAGEMENTS_INACTIVE = ContributorConstants.ENGAGEMENT_INACTIVE_STATUS;
  ENGAGEMENTS_ACTIVE = ContributorConstants.ENGAGEMENT_ACTIVE_STATUS;
  ENGAGEMENTS_CANCELLED = ContributorConstants.ENGAGEMENT_CANCELLED_STATUS;
  CANCEL_IN_PROGRESS = ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    //console.log(this.engagement,'dc 2');
    
    this.ReactivateDetailsForm = this.createReactivateForm();
  }

  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges) {
     if(changes.engagement && changes.engagement.currentValue){
     }
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
    }
  }

   /** Method to assemble reactivate payload. */
   reactivatePayload(): ReactivateEngagementRequest {
    const payload: ReactivateEngagementRequest = new ReactivateEngagementRequest();
    payload.reactivateReason = this.ReactivateDetailsForm?.get('reactivateReason')?.value;
    payload.editFlow = this.isEditMode;
    payload.crmid = this.ReactivateDetailsForm?.get('crmid')?.value;
    //console.log("payload", payload)
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
