import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, Lov, LovList } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { DisabilityDetails } from '../../shared/models/contributor-assessment-request';
import { Router } from '@angular/router';
import { ServiceProviderAddressDto } from '@gosi-ui/features/occupational-hazard/lib/shared/models/service-provider-address';
import { DisabilityDetails } from '../../models';

@Component({
  selector: 'mb-medical-report-download-dc',
  templateUrl: './medical-report-download-dc.component.html',
  styleUrls: ['./medical-report-download-dc.component.scss']
})
export class MedicalReportDownloadDcComponent implements OnInit, OnChanges {
  @Input() hospital: LovList;
  @Input() parentForm: FormGroup;
  @Input() serviceAddress: ServiceProviderAddressDto;
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Output() hospitalName: EventEmitter<BilingualText> = new EventEmitter();
  @Output() selectedProvider = new EventEmitter();
  @Output() pychiatricForm = new EventEmitter();

  requestReportForm = new FormGroup({});
  list: LovList = new LovList([]);
  showReports: boolean;
  modalRef: BsModalRef;

  constructor(readonly fb: FormBuilder, readonly modalService: BsModalService, readonly router: Router) {}

  ngOnInit(): void {
    this.requestReportForm = this.createServiceProviderForm();
    if (this.parentForm) {
      this.parentForm.addControl('disabilityReportForm', this.requestReportForm);
    }
    this.requestReportForm?.get('provider').valueChanges?.subscribe(() => {
      if (this.requestReportForm?.get('provider').value.english === null) {
        this.showReports = false;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.serviceAddress) {
      this.serviceAddress = changes.serviceAddress.currentValue;
      if (this.serviceAddress && this.requestReportForm.get('provider').value.english != null) this.showReports = true;
    }
  }
  createServiceProviderForm() {
    return this.fb.group({
      provider: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  providerSelected(event: Lov) {
    this.hospitalName.emit(event.value);
    // if (event) {

    // }
  }
  previousAssessment(TemplateValue: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
  }

  viewAssessmentById() {
    this.router.navigate([`/home/medical-board/disability-assessment/view`]);
  }
  hideModal() {
    this.modalRef.hide();
  }
  download() {
    this.selectedProvider.emit();
  }
  downloadPsychiatricForm(){
    this.pychiatricForm.emit();
  }
}
