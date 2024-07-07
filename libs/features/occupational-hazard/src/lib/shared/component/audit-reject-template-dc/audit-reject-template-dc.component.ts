import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, LovList } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { ClaimsService } from '../../../shared/models/claims-service';
@Component({
  selector: 'oh-audit-reject-template-dc',
  templateUrl: './audit-reject-template-dc.component.html',
  styleUrls: ['./audit-reject-template-dc.component.scss']
})
export class AuditRejectTemplateDcComponent implements OnInit, OnChanges, OnDestroy {
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() unitList: LovList;
  @Input() selectionTreatmentlist: ClaimsService[] = [];
  @Input() rejectReasonList$: Observable<LovList> = null;
  //Local Variables
  auditRejectForm: FormGroup;
  showmandatory = false;

  //OUtput Variables
  @Output() auditEvent: EventEmitter<FormArray> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  auditRejectList: FormArray = new FormArray([]);
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.showmandatory = false;
    if (this.parentForm) {
      this.parentForm.addControl('auditForm', this.auditRejectList);
    }
    this.auditRejectList = this.fb.array([]);
    if (this.selectionTreatmentlist) {
      this.selectionTreatmentlist.forEach(res => {
        this.auditRejectForm = this.createAuditRejectForm();
        if (res.noOfUnits) {
          this.auditRejectForm
            .get('serviceDetails.serviceRejectionDetails.disputedUnits')
            .setValue(res.disputedUnits || res.noOfUnits);
          this.auditRejectForm.get('serviceDetails.serviceRejectionDetails.serviceId').setValue(res.serviceId);
        }
        this.auditRejectList.push(this.auditRejectForm);
      });
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.selectionTreatmentlist) {
      this.selectionTreatmentlist = changes.selectionTreatmentlist.currentValue;
    }
  }
  commentsSelection() {
    if (this.auditRejectList) {
      if (
        this.auditRejectForm.get('serviceDetails.serviceRejectionDetails.rejectionReason.english').value === 'Others'
      ) {
        this.auditRejectForm.get('comments').setValidators(Validators.required);
      } else {
        this.auditRejectForm.get('comments').clearValidators();
        this.showmandatory = false;
        this.auditRejectForm.get('comments').markAsUntouched();
      }
      this.auditRejectForm.get('comments').markAsPristine();
      this.auditRejectForm.get('comments').updateValueAndValidity();
    }
  }
  /** This method is to reject transaction */
  confirmRejectionDetails() {
    this.showmandatory = false;
    if (this.auditRejectForm.valid) {
      this.auditRejectForm.markAsUntouched();
      this.auditEvent.emit(this.auditRejectList);
    } else {
      this.showmandatory = true;
      this.auditRejectForm.markAllAsTouched();
      this.auditRejectForm.markAsPristine();
      this.auditRejectForm.updateValueAndValidity();
    }
  }

  /** This method is to clear transaction */
  ngOnDestroy() {
    this.parentForm.removeControl('auditRejectForm');
  }

  //Canceling Rejection Details

  cancelRejection() {
    this.showmandatory = false;
    this.cancelEvent.emit();
  }
  createAuditRejectForm(): FormGroup {
    return this.fb.group({
      comments: [''],
      serviceDetails: this.fb.group({
        invoiceItemId: null,
        serviceRejectionDetails: this.fb.group({
          disputedUnits: null,
          rejectionReason: this.fb.group({
            english: [null, { validators: Validators.required }],
            arabic: [null, { validators: Validators.required }]
          }),
          serviceId: null
        })
      })
    });
  }
}
