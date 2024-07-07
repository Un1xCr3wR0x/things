import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { MedicalBoardAssessmentRequest } from '../../../shared';

@Component({
  selector: 'mb-medical-board-assessments-filter-dc',
  templateUrl: './medical-board-assessments-filter-dc.component.html',
  styleUrls: ['./medical-board-assessments-filter-dc.component.scss']
})
export class MedicalBoardAssessmentsFilterDcComponent implements OnInit {
  // @Input() specialtyList: LovList;
  @Input() assessmentTypeList: LovList;
  @Input() mbTypeList: LovList;

  //local Variable

  requestDateFilterForm = new FormControl();
  selectedAssessmentType: BilingualText[] = [];
  selectedStatus: BilingualText[] = [];
  selectedMbType: BilingualText[] = [];
  assessmentTypeValues: BilingualText[];
  mbTypeValues: BilingualText[];
  statusValues: BilingualText[];
  // visitingFilter: visitingFilterRequest = new visitingFilterRequest();
  sessionFilter: MedicalBoardAssessmentRequest = new MedicalBoardAssessmentRequest();
  //  formValues
  assessmentTypeForm: FormGroup = new FormGroup({});
  statusForm: FormGroup = new FormGroup({});
  selectedPeriodDate: Array<Date>;
  @Output() filter: EventEmitter<MedicalBoardAssessmentRequest> = new EventEmitter();
  statusList: LovList;
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  mbTypeForm: FormGroup = new FormGroup({});

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.statusList = new LovList([
      { value: { english: 'Draft', arabic: 'Draft ' }, sequence: 0, code: 1000 },
      { value: { english: 'Entered', arabic: 'مدخل' }, sequence: 1, code: 1001 },
      { value: { english: 'Rescheduled', arabic: 'إعادة جدولة' }, sequence: 2, code: 1002 },
      { value: { english: 'Assessment Completed ', arabic: 'اكتمال التقييم' }, sequence: 3, code: 1003 },
      {
        value: { english: 'Appealed by participant/ contributor', arabic: 'استئناف من المشترك/المشارك' },
        sequence: 4,
        code: 1004
      },
      {
        value: { english: 'Appealed by GOSI', arabic: 'استئناف من المؤسسة العامة للتأمينات الاجتماعية' },
        sequence: 5,
        code: 1005
      },
      {
        value: { english: 'Approved By Gosi Doctor', arabic: 'معتمد من طبيب المؤسسة العامة للتأمينات الاجتماعية' },
        sequence: 6,
        code: 1006
      },
      {
        value: { english: 'Rescheduled due to no show', arabic: 'تم إعادة الجدولة بسبب عدم حضور المشترك' },
        sequence: 7,
        code: 1007
      },
      {
        value: { english: 'Assessment Accepted by participant', arabic: 'تم قبول التقييم من المشترك' },
        sequence: 8,
        code: 1008
      },
      { value: { english: 'Returned', arabic: 'معاد' }, sequence: 9, code: 1009 },
      { value: { english: 'Rejected', arabic: 'مرفوض' }, sequence: 10, code: 1010 },
      { value: { english: 'Under Review', arabic: 'قيد المراجعة' }, sequence: 11, code: 1011 },
      {
        value: { english: 'Awaiting assessment scheduling', arabic: 'بانتظار جدول التقييم' },
        sequence: 12,
        code: 1012
      }
    ]);
    this.assessmentTypeList = new LovList([
      { value: { english: 'Occupational Disability', arabic: 'العجز المهني' }, sequence: 0, code: 1001 },
      { value: { english: 'Non-Occupational Disability', arabic: 'العجز غير المهني' }, sequence: 1, code: 1002 },
      { value: { english: 'Heir Disability', arabic: 'عجز وريث' }, sequence: 2, code: 1003 },
      { value: { english: 'Dependent Disability', arabic: 'عجز وريث' }, sequence: 3, code: 1004 }
    ]);
    this.mbTypeList = new LovList([
      { value: { english: 'Primary Medical Board', arabic: 'اللجنة الطبية الابتدائية' }, sequence: 0, code: 1001 },
      { value: { english: 'Appeal Medical Board', arabic: 'اللجنة الطبية  الاستئنافية' }, sequence: 1, code: 1002 }
    ]);
    this.assessmentTypeForm = this.getAssessmentTypeForm();
    this.statusForm = this.getStatusForm();
    this.mbTypeForm = this.getMbTypeForm();
  }
  getAssessmentTypeForm(): FormGroup {
    return this.fb.group({
      assessmentType: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getMbTypeForm(): FormGroup {
    return this.fb.group({
      mbType: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getStatusForm(): FormGroup {
    return this.fb.group({
      status: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  applyFilter() {
    if (this.requestDateFilterForm.value && this.requestDateFilterForm.value.length >= 1) {
      this.selectedPeriodDate = this.requestDateFilterForm.value;
    } else {
      this.selectedPeriodDate = null;
    }
    if (this.selectedAssessmentType && this.selectedAssessmentType.length >= 1) {
      this.assessmentTypeValues = this.selectedAssessmentType;
    } else {
      this.assessmentTypeValues = null;
    }

    if (this.selectedStatus && this.selectedStatus.length >= 1) {
      this.statusValues = this.selectedStatus;
    } else {
      this.statusValues = null;
    }

    if (this.selectedMbType && this.selectedMbType.length >= 1) {
      this.mbTypeValues = this.selectedMbType;
    } else {
      this.mbTypeValues = null;
    }
    if (this.selectedPeriodDate) {
      this.sessionFilter.sessionPeriodFrom = this.selectedPeriodDate[0];
      this.sessionFilter.sessionPeriodTo = this.selectedPeriodDate[1];
    }
    this.sessionFilter.assessmentType = this.assessmentTypeValues;
    this.sessionFilter.status = this.statusValues;
    this.sessionFilter.medicalBoardType = this.mbTypeValues;
    this.filter.emit(this.sessionFilter);
  }
  clearAllFilter() {
    this.assessmentTypeForm.get('assessmentType').reset();
    this.statusForm.get('status').reset();
    this.requestDateFilterForm.reset();
    this.mbTypeForm.get('mbType').reset();
    this.selectedAssessmentType = null;
    this.selectedStatus = null;
    this.selectedMbType = null;
    this.defaultFilter();
    this.filter.emit(this.sessionFilter);
  }
  defaultFilter() {
    this.sessionFilter.sessionPeriodFrom = undefined;
    this.sessionFilter.sessionPeriodTo = undefined;
    this.sessionFilter.status = [];
    this.sessionFilter.assessmentType = [];
    this.sessionFilter.medicalBoardType = [];
  }
  onScroll() {
    if (this.dateRangePicker?.dateRangePicker?.isOpen) this.dateRangePicker?.dateRangePicker?.hide();
  }
}
