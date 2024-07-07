import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { DatePipe } from '@angular/common';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { SessionFilterRequest, SessionRequest, ConfigurationFilterConstants } from '../../../../shared';

@Component({
  selector: 'mb-configuration-filter-dc',
  templateUrl: './configuration-filter-dc.component.html',
  styleUrls: ['./configuration-filter-dc.component.scss']
})
export class ConfigurationFilterDcComponent implements OnInit, OnChanges {
  fieldOfficeForm: FormGroup = new FormGroup({});
  sessionTypeForm: FormGroup = new FormGroup({});
  medicalBoardTypeForm: FormGroup = new FormGroup({});
  slotForm: FormGroup = new FormGroup({});
  sessionPeriodForm = new FormControl();
  statusFilterForm: FormGroup;
  sessionChannelForm: FormGroup;
  selectedofficeOption: BilingualText[] = [];
  selectedSessionOption: BilingualText[] = [];
  selectedMedicalBoardOption: BilingualText[] = [];
  selectedstatusOption: BilingualText[] = [];
  selectedChannelOption: BilingualText[] = [];
  selectedSlotOption: BilingualText[] = [];
  statusValues: BilingualText[];
  channelValues: BilingualText[];
  sessionTypeValues: BilingualText[];
  medicalBoardTypeValues: BilingualText[];
  slotValue: BilingualText[];
  statusList: BilingualText[] = [];
  fieldOfficeValues: BilingualText[];
  channelList: BilingualText[] = [];
  sessionFilter: SessionFilterRequest = new SessionFilterRequest();
  slotLists: LovList;
  maxDate: Date;
  selectedSessionDate: Array<Date>;
  @Input() fieldOfficeLists: LovList;
  @Input() sessionTypeLists: LovList;
  @Input() medicalBoardTypeLists: LovList;
  @Input() channelLists: LovList;
  @Input() statusLists: LovList;
  @Input() sessionRequest: SessionRequest = new SessionRequest();
  @Input() isScheduledSession = false;
  @Output() filter: EventEmitter<SessionFilterRequest> = new EventEmitter();
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  constructor(readonly fb: FormBuilder, readonly datePipe: DatePipe) {}

  ngOnInit() {
    this.fieldOfficeForm = this.getFieldOfficeForm();
    this.sessionTypeForm = this.getSessionTypeForm();
    this.slotForm = this.getSlotForm();
    this.medicalBoardTypeForm = this.getMedicalBoardTYpeForm();
  }
  /*
   * Method to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.sessionRequest && changes.sessionRequest.currentValue) {
      this.sessionRequest = changes.sessionRequest.currentValue;
      this.sessionFilter = changes.sessionRequest.currentValue.filter;
      this.initiateFilter();
    }
    if (changes?.fieldOfficeLists?.currentValue) {
      this.fieldOfficeLists = changes?.fieldOfficeLists?.currentValue;
    }

    if (changes?.channelLists?.currentValue) {
      this.channelLists = changes?.channelLists?.currentValue;
      this.channelLists?.items?.forEach(item => {
        this.channelList.push(item?.value);
      });
    }
    this.sessionChannelForm = this.fb.group({
      items: new FormArray([])
    });
    this.channelList.forEach(() => {
      const control = new FormControl(false);
      (this.sessionChannelForm.controls.items as FormArray).push(control);
    });
    if (changes?.statusLists?.currentValue) {
      this.statusLists = changes?.statusLists?.currentValue;
      this.statusLists?.items?.forEach(item => {
        this.statusList.push(item?.value);
      });
    }
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.statusList.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
  }
  getFieldOfficeForm(): FormGroup {
    return this.fb.group({
      office: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getSessionTypeForm(): FormGroup {
    return this.fb.group({
      type: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getMedicalBoardTYpeForm(): FormGroup {
    return this.fb.group({
      type: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  getSlotForm(): FormGroup {
    return this.fb.group({
      slot: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  initiateFilter() {
    this.sessionTypeLists = new LovList(ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE);
    if (this.isScheduledSession) {
      this.statusList = ConfigurationFilterConstants.FILTER_FOR_SESSION_STATUS;
      this.slotLists = new LovList(ConfigurationFilterConstants.FILTER_FOR_SLOT_AVAILABILITY);
    }
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.statusList.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    this.sessionPeriodForm.setValue([this.sessionFilter?.sessionPeriodFrom, this.sessionFilter?.sessionPeriodTo]);
  }
  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.sessionFilter.sessionPeriodFrom = undefined;
    this.sessionFilter.sessionPeriodTo = undefined;
    this.sessionFilter.sessionType = [];
    this.sessionFilter.medicalBoardType = [];
    this.sessionFilter.channel = [];
    this.sessionFilter.status = [];
    this.sessionFilter.fieldOffice = [];
    this.sessionFilter.slot = [];
  }
  applyFilter() {
    if (this.selectedofficeOption && this.selectedofficeOption.length >= 1) {
      this.fieldOfficeValues = this.selectedofficeOption;
    } else {
      this.fieldOfficeValues = null;
    }

    if (this.selectedChannelOption && this.selectedChannelOption.length >= 1) {
      this.channelValues = this.selectedChannelOption;
    } else {
      this.channelValues = null;
    }
    if (this.selectedSessionOption && this.selectedSessionOption.length >= 1) {
      this.sessionTypeValues = this.selectedSessionOption;
    } else {
      this.sessionTypeValues = null;
    }
    if (this.selectedMedicalBoardOption && this.selectedMedicalBoardOption.length >= 1) {
      this.medicalBoardTypeValues = this.selectedMedicalBoardOption;
    } else {
      this.medicalBoardTypeValues = null;
    }
    if (this.selectedstatusOption && this.selectedstatusOption.length >= 1) {
      this.statusValues = this.selectedstatusOption;
    } else {
      this.statusValues = null;
    }
    if (this.sessionPeriodForm.value && this.sessionPeriodForm.value.length >= 1) {
      this.selectedSessionDate = this.sessionPeriodForm.value;
    } else {
      this.selectedSessionDate = null;
    }
    if (this.selectedSlotOption && this.selectedSlotOption.length >= 1) {
      this.slotValue = this.selectedSlotOption;
    } else {
      this.slotValue = null;
    }
    this.sessionFilter.channel = this.channelValues;
    this.sessionFilter.status = this.statusValues;
    this.sessionFilter.fieldOffice = this.fieldOfficeValues;
    this.sessionFilter.sessionType = this.sessionTypeValues;
    this.sessionFilter.slot = this.slotValue;
    this.sessionFilter.medicalBoardType = this.medicalBoardTypeValues;
    if (this.selectedSessionDate) {
      this.sessionFilter.sessionPeriodFrom = this.selectedSessionDate[0];
      this.sessionFilter.sessionPeriodTo = this.selectedSessionDate[1];
    }
    this.filter.emit(this.sessionFilter);
  }
  clearAllFilter() {
    this.sessionTypeForm.get('type').reset();
    this.fieldOfficeForm.get('office').reset();
    this.medicalBoardTypeForm.get('type').reset();
    this.slotForm.get('slot').reset();
    this.selectedstatusOption = [];
    this.selectedChannelOption = [];
    this.sessionChannelForm.reset();
    this.statusFilterForm.reset();
    this.selectedofficeOption = null;
    this.selectedSessionOption = null;
    this.selectedMedicalBoardOption = null;
    this.selectedSlotOption = null;
    this.sessionPeriodForm.reset();
    this.defaultFilter();
    this.filter.emit(this.sessionFilter);
  }
  onScroll() {
    if (this.dateRangePicker?.dateRangePicker?.isOpen) this.dateRangePicker?.dateRangePicker?.hide();
  }
}
