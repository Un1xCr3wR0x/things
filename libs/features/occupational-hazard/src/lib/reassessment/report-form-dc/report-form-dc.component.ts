import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssessmentDetails, BilingualText, LovList, MedicalboardAssessmentService } from '@gosi-ui/core';
import { ServiceProviderAddressDto } from '../../shared/models/service-provider-address';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DisabilityDetails, DisabiliyDtoList } from '@gosi-ui/features/medical-board';

@Component({
  selector: 'oh-report-form-dc',
  templateUrl: './report-form-dc.component.html',
  styleUrls: ['./report-form-dc.component.scss']
})
export class ReportFormDcComponent implements OnInit, OnChanges {
  /**
   * Input Variables
   */
  @Input() hospital: LovList;
  @Input() serviceAddress: ServiceProviderAddressDto;
  @Input() parentForm: FormGroup;
  @Input() occEarlyReassessment: boolean;
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Input() disabilityDetails: DisabiliyDtoList;
  /**
   * Output Variable
   */
  @Output() hospitalName: EventEmitter<BilingualText> = new EventEmitter();
  @Output() fileDownload: EventEmitter<ServiceProviderAddressDto> = new EventEmitter();
  @Output() hospitalChange: EventEmitter<BilingualText> = new EventEmitter();
  @Output() previousAssessmentDetails: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() pychiatricForm = new EventEmitter();

  /**
   * Local Variable
   */
  showDownload = false;
  requestReportForm = new FormGroup({});
  modalRef: BsModalRef;

  constructor(readonly fb: FormBuilder, readonly modalService: BsModalService, readonly router: Router, readonly medicaAssessmentService: MedicalboardAssessmentService) {}

  ngOnInit(): void {
    this.requestReportForm = this.createServiceProviderForm();
    if (this.parentForm) this.parentForm.addControl('reportForm', this.requestReportForm);
    this.occEarlyReassessment ? this.getOccNonOccType() : null;
    this.disabilityDetails && this.disabilityDetails.hospitalProvider ? (this.patchServiceProvider(), (this.showDownload = true)) : null;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.serviceAddress && changes.serviceAddress?.currentValue) {
      this.serviceAddress = changes.serviceAddress?.currentValue;
    }
    if (changes && changes?.serviceAddress && changes?.occEarlyReassessment?.currentValue) {
      this.occEarlyReassessment ? this.getOccNonOccType() : null;
    }
    this.disabilityDetails && this.disabilityDetails.hospitalProvider ? (this.patchServiceProvider(), (this.showDownload = true)) : null;
  }
  selectedHospital(value: BilingualText) {
    this.hospitalName.emit(value);
    value ? (this.showDownload = true) : (this.showDownload = false);
  }
  onChange(val) {
    val === undefined || this.requestReportForm.get('provider')?.value?.english === null || val === null
      ? (this.showDownload = false)
      : (this.showDownload = true);
  }
  createServiceProviderForm() {
    return this.fb.group({
      provider: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  download(serviceAddress: ServiceProviderAddressDto) {
    this.fileDownload.emit(serviceAddress);
  }
  previousAssessment(TemplateValue: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
  }

  viewAssessmentById(eachperson:AssessmentDetails) {
    if (eachperson.assessmentId) {
      this.hideModal();
    }

    this.medicaAssessmentService.setIsFromOh(true);
    this.previousAssessmentDetails.emit(eachperson);
    // this.router.navigate([`/home/medical-board/disability-assessment/view`]);
  }
  hideModal() {
    this.modalRef.hide();
  }
  getOccNonOccType() {
    if (this.occEarlyReassessment === true) {
      this.requestReportForm?.get('provider')?.get('english')?.clearValidators();
      this.requestReportForm?.get('provider')?.get('english')?.updateValueAndValidity();
    } else {
      this.requestReportForm?.get('provider')?.get('english')?.setValidators([Validators.required]);
      this.requestReportForm?.get('provider')?.get('english')?.updateValueAndValidity();
    }
  }
  patchServiceProvider() {
    this.requestReportForm.get('provider').get('english').patchValue(this.disabilityDetails?.hospitalProvider?.english);
    this.requestReportForm.get('provider').get('arabic').patchValue(this.disabilityDetails?.hospitalProvider?.arabic);
    this.requestReportForm.get('provider').get('english').updateValueAndValidity();
    this.requestReportForm.get('provider').get('arabic').updateValueAndValidity();
    this.hospitalChange.emit(this.disabilityDetails?.hospitalProvider);
  }
  downloadPsychiatricForm(){
    this.pychiatricForm.emit();
  }
}
