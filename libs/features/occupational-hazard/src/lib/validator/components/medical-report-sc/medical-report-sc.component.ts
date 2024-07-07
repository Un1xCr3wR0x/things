import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentItem } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MedicalReportDetails, MedicalReportService } from '../../../shared';

@Component({
  selector: 'oh-medical-report-sc',
  templateUrl: './medical-report-sc.component.html',
  styleUrls: ['./medical-report-sc.component.scss']
})
export class MedicalReportScComponent implements OnInit, AfterViewInit {
  @ViewChild('medicalReportModal', { static: true })
  medicalReportModal: TemplateRef<HTMLElement>;
  medicalReportDetails: MedicalReportDetails;
  caseId = 1234;
  referenceNo = 1234;
  documentScanList: DocumentItem[] = [];
  documentCategoryList: DocumentItem[] = [];
  maxLengthComments = 50;
  comments: FormGroup;
  constructor(readonly modalService: BsModalService, readonly medicalReportService: MedicalReportService, readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.comments = this.fb.group({comments: ['']});
    this.medicalReportService.getMedicalReportDetails().subscribe(res=> this.medicalReportDetails = res);
  }
  ngAfterViewInit(): void {
    this.showMedicalReportModal(this.medicalReportModal);
  }
  showMedicalReportModal(medicalReportModal: TemplateRef<HTMLElement>) {
    this.modalService.show(medicalReportModal, Object.assign({}, { class: 'modal-xl' }));
  }
}
