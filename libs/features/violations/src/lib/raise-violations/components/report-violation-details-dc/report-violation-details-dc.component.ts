import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Establishment, LovList } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { ViolationConstants, ViolationsEnum, ViolationTransaction } from '../../../shared';

@Component({
  selector: 'vol-report-violation-details-dc',
  templateUrl: './report-violation-details-dc.component.html',
  styleUrls: ['./report-violation-details-dc.component.scss']
})
export class ReportViolationDetailsDcComponent implements OnInit, OnChanges {
  violationForm: FormGroup;
  showInspection: boolean;
  showVisitId: boolean;
  currentDate: Date = new Date();
  minDate: Date = new Date();
  descMaxLength = ViolationConstants.DESCRIPTION_MAX_LENGTH;

  @Input() violationTypeDetails: LovList;
  @Input() inspectionTypeDetails: LovList;
  @Input() violationYesOrNoList: Observable<LovList>;
  @Input() parentForm: FormGroup;
  @Input() violationDetails: ViolationTransaction;
  @Input() editMode: boolean;
  @Input() establishmentDetails: Establishment;
  @Output() violationType: EventEmitter<string> = new EventEmitter();
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.violationForm = this.createViolationForm();
    this.parentForm.addControl('violationData', this.violationForm);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.violationDetails) this.violationDetails = changes.violationDetails.currentValue;
    if (this.editMode) {
      this.setEditViolationValues();
    }
    if (changes && changes.establishmentDetails)
      this.minDate = moment(this.establishmentDetails?.startDate?.gregorian).startOf('day').toDate();
  }

  setEditViolationValues() {
    if (this.violationDetails) {
      this.violationForm?.get('violationType.english')?.setValue(this.violationDetails?.violationType?.english);
      this.violationForm?.get('violationType.arabic')?.setValue(this.violationDetails?.violationType?.arabic);
      this.violationForm
        ?.get('violationDiscoveryDate.gregorian')
        ?.setValue(new Date(this.violationDetails?.dateReported?.gregorian));
      this.violationForm
        ?.get('inspectionDiscovered.english')
        ?.setValue(this.violationDetails?.discoveredAfterInspection?.english);
      this.violationForm
        ?.get('inspectionDiscovered.arabic')
        ?.setValue(this.violationDetails?.discoveredAfterInspection?.arabic);
      this.selectViolationDiscovered(this.violationDetails?.discoveredAfterInspection?.english);
      if (this.violationDetails?.discoveredAfterInspection?.english === ViolationsEnum?.BOOLEAN_YES) {
        this.violationForm
          ?.get('inspectionType.english')
          ?.setValue(this.violationDetails?.inspectionInfo?.inspectionType?.english);
        this.violationForm
          ?.get('inspectionType.arabic')
          ?.setValue(this.violationDetails?.inspectionInfo?.inspectionType?.arabic);
        // change parameter once api updated
        this.selectInspectionType(this.violationDetails?.inspectionInfo?.inspectionType?.english);
        this.violationForm?.get('visitId')?.setValue(this.violationDetails?.inspectionInfo?.visitId);
      }
      this.violationForm?.get('description')?.setValue(this.violationDetails?.violationDescription);
    }
  }

  createViolationForm(): FormGroup {
    return this.fb.group({
      violationType: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      violationDiscoveryDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      inspectionDiscovered: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      inspectionType: this.fb.group({
        english: [null],
        arabic: []
      }),
      visitId: ['', { updateOn: 'blur' }],
      description: ['', { validators: Validators.compose([Validators.required]), updateOn: 'blur' }]
    });
  }
  selectViolationType(value) {
    this.violationType.emit(value);
  }
  selectViolationDiscovered(value) {
    if (value === ViolationsEnum.BOOLEAN_YES) {
      this.showInspection = true;
      this.violationForm.get('inspectionType.english').setValidators(Validators.required);
      this.violationForm.get('inspectionType.arabic').setValidators(Validators.required);
      this.violationForm.get('inspectionType').updateValueAndValidity();
    } else {
      this.showInspection = false;
      this.violationForm.get('inspectionType.english').clearValidators();
      this.violationForm.get('inspectionType.arabic').clearValidators();
      this.violationForm.get('inspectionType').updateValueAndValidity();
      this.violationForm.get('inspectionType').reset();
      this.selectInspectionType(this.violationForm.get('inspectionType.english').value);
    }
  }
  selectInspectionType(value) {
    if (value === ViolationsEnum.RASED) {
      this.showVisitId = true;
      this.violationForm.get('visitId').setValidators(Validators.required);
      this.violationForm.get('visitId').updateValueAndValidity();
    } else {
      this.showVisitId = false;
      this.violationForm.get('visitId').reset();
      this.violationForm.get('visitId').clearValidators();
      this.violationForm.get('visitId').updateValueAndValidity();
    }
  }
  changeVisitId() {}
  changeDescription() {}
}
