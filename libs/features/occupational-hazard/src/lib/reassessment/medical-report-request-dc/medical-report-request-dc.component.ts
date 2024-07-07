import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssessmentDetails, BilingualText, Lov, LovList, MedicalboardAssessmentService } from '@gosi-ui/core';
import { ServiceProviderAddressDto } from '../../shared/models/service-provider-address';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DisabilityDetails } from '../../shared/models/contributor-assessment-request';
import { Router } from '@angular/router';

@Component({
  selector: 'oh-medical-report-request-dc',
  templateUrl: './medical-report-request-dc.component.html',
  styleUrls: ['./medical-report-request-dc.component.scss']
})
export class MedicalReportRequestDcComponent implements OnInit {
  @Input() hospital: LovList;
  @Input() parentForm: FormGroup;
  @Input() serviceAddress: ServiceProviderAddressDto;
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Output() hospitalName: EventEmitter<BilingualText> = new EventEmitter();
  @Output() previousAssessmentDetails: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() downloadData: EventEmitter<ServiceProviderAddressDto> = new EventEmitter();
  @Output() pychiatricForm = new EventEmitter();
  requestReportForm = new FormGroup({});
  list: LovList = new LovList([]);
  showReports: boolean;
  modalRef: BsModalRef;

  constructor(
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly medicaAssessmentService: MedicalboardAssessmentService
  ) {}

  ngOnInit(): void {
    this.requestReportForm = this.createServiceProviderForm();
    if (this.parentForm) {
      this.parentForm.addControl('disabilityReportForm', this.requestReportForm);
    }
    this.requestReportForm?.get('provider').valueChanges?.subscribe(() => {
      if (this.requestReportForm?.get('provider')?.value?.english === null) {
        this.showReports = false;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.serviceAddress) {
      this.serviceAddress = changes.serviceAddress.currentValue;
      if (this.serviceAddress && this.requestReportForm?.get('provider')?.value?.english != null)
        this.showReports = true;
    }
  }
  createServiceProviderForm() {
    return this.fb.group({
      provider: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  download(data) {
    this.downloadData.emit(data);
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

  // viewAssessmentById() {
  //   this.router.navigate([`/home/medical-board/disability-assessment/view`]);
  // }
  viewAssessmentById(eachperson: AssessmentDetails) {
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
  downloadPsychiatricForm(){
    this.pychiatricForm.emit();
  }
}
