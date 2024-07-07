import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { startOfDay } from '@gosi-ui/core';
import { BillingConstants } from '../../../shared/constants';

@Component({
  selector: 'blg-get-months-dc',
  templateUrl: './get-months-dc.component.html',
  styleUrls: ['./get-months-dc.component.scss']
})
export class GetMonthsDcComponent implements OnInit, OnChanges {
  _contributionList;
  _pendingEventInfo;
  @Input() selectedyearList: [];
  @Input() isEditMode: boolean;
  documentTransactionId = BillingConstants.MAINTAIN_EVENT_DATE;
  wavierDetailsForm: FormGroup;
  // Input Variables
  @Input() documents: Document;
  @Input() isScan: boolean;
  @Input() uuid: string;
  @Input() transactionId: string;
  @Input() businessKey: number;
  // Output Variables
  @Output() doc: EventEmitter<null> = new EventEmitter();
  @Input() public get contributionList() {
    return this._contributionList;
  }
  public set contributionList(eventDate) {
    this._contributionList = eventDate;
  }
  @Input() public get pendingEventInfo() {
    return this._pendingEventInfo;
  }
  public set pendingEventInfo(pendDate) {
    this._pendingEventInfo = pendDate;
  }

  @Output() onSubmitClicked = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  firstDay: Date;
  lastDay: Date;
  disableStatus = true;
  selectedDate: Date;
  today: Date;

  eventDateForm: FormGroup;
  eventDateObj = {};
  selectedEventDateList = [];
  count = 0;
  modalRef: BsModalRef;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.initialiseForm();
    this.updateForm();
    if (this._pendingEventInfo) {
      this.patchFormValue();
    }
    this.listenForChange();
  }
  /**
   * This method is used to handle the changes in the input variables
   * @param changes
   * @memberof InputBaseComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isEditMode) {
      if (!this.isEditMode) {
        this.updateForm();
      }
    }
  }
  initialiseForm() {
    this.eventDateForm = this.fb.group({
      contributionDetails: '',
      workflow: this.fb.group({
        comments: ['']
      })
    });
  }

  patchFormValue() {
    if (this.eventDateForm) {
      for (const eventDate of this._pendingEventInfo) {
        this.eventDateForm.controls.contributionDetails['controls'][
          this._contributionList.map(contribution => contribution['year']).indexOf(eventDate['year'])
        ].controls.eventDateInfo['controls'].forEach(control => {
          if (control) {
            eventDate['eventDateInfo'].forEach(date => {
              if (date['month']['english'].indexOf(control.value.month['english']) > -1) {
                control.controls['eventDate'].setValue({
                  gregorian: date['eventDate']['gregorian'],
                  hijiri: date['eventDate']['hijiri']
                });
                this.pushDateChange(date);
              }
            });
          }
        });
      }
    }
  }

  updateForm() {
    this.eventDateForm?.setControl('contributionDetails', this.setExistingEventDetails(this._contributionList));
    for (const event of this._contributionList) {
      this.eventDateForm?.controls?.contributionDetails['controls'][this._contributionList.indexOf(event)].setControl(
        'eventDateInfo',
        this.setExistingDateInfo(event)
      );
    }
  }
  setExistingEventDetails(eventDetails) {
    const eventDetailsFA = new FormArray([]);
    if (eventDetails) {
      eventDetails.forEach(res => {
        eventDetailsFA.push(this.newEventDetails(res));
      });
    }
    return eventDetailsFA;
  }

  setExistingDateInfo(dateInfo): FormArray {
    const dateInfoFA = new FormArray([]);
    dateInfo['eventDateInfo'].forEach(res => {
      dateInfoFA.push(this.newDateInfo(res));
    });
    return dateInfoFA;
  }
  newEventDetails(res): FormGroup {
    return this.fb.group({
      year: [res['year']],
      eventDateInfo: ''
    });
  }

  newDateInfo(date) {
    return this.fb.group({
      month: this.fb.group({
        arabic: [date['month']['arabic']],
        english: [date['month']['english']]
      }),
      year: [date['year']],
      eventDate: this.fb.group({
        gregorian: [
          { value: date['eventDate']['gregorian'], disabled: this.getDisableStatus(date['eventDate']['gregorian']) },
          [Validators.required]
        ],
        hijiri: [date['eventDate']['hijiri']]
      })
    });
  }

  getLabel(month) {
    return 'BILLING.CALENDAR-LABEL.' + month.toUpperCase();
  }

  //enable next month only on a month selection by setting mindate
  getMinDate(currentMonth, selectedyear) {
    this.firstDay = new Date(selectedyear, currentMonth, 1);
    return this.firstDay;
  }

  //enable next month only on a month selection by setting mindate
  getMaxDate(currentMonth, selectedyear) {
    this.lastDay = new Date(selectedyear, currentMonth + 1, 0);
    return this.lastDay;
  }

  //disable the previous months
  getDisableStatus(date) {
    const currentMonth = date.getMonth();
    const selectedyear = date.getFullYear();
    this.disableStatus = true;
    const d1 = new Date(selectedyear, currentMonth + 1);
    const today = new Date();
    if (this.isEditMode && this.pendingDateChecker(date)) {
      this.disableStatus = false;
    } else if (d1 > today) {
      this.disableStatus = false;
    } else {
      this.disableStatus = true;
    }
    return this.disableStatus;
  }

  pendingDateChecker(date) {
    let status = false;
    this._pendingEventInfo[0]?.eventDateInfo?.forEach(pendingDate => {
      if (
        pendingDate.eventDate.gregorian.getMonth() === date.getMonth() &&
        pendingDate.eventDate.gregorian.getFullYear() === date.getFullYear()
      ) {
        return (status = true);
      }
    });
    return status;
  }

  listenForChange() {
    this.eventDateForm.controls.contributionDetails['controls'].forEach(contributionControl => {
      contributionControl.controls['eventDateInfo']['controls'].forEach(eventDateControl => {
        eventDateControl.valueChanges.subscribe(data => {
          data['eventDate']['gregorian'] = startOfDay(data['eventDate']['gregorian']);
          this.pushDateChange(data);
        });
      });
    });
  }

  pushDateChange(value) {
    if (typeof value === 'object') {
      const dateIndex = this.selectedEventDateList
        .map(data => data['year'] + data['month']['english'])
        .indexOf(value['year'] + value['month']['english']);
      if (dateIndex < 0) {
        this.selectedEventDateList.push(value);
      } else {
        this.selectedEventDateList[dateIndex] = value;
      }
      this._contributionList.forEach(contribution => {
        contribution.eventDateInfo.forEach(eventInfo => {
          this.selectedEventDateList.forEach((selectedEventDate, index) => {
            if (JSON.stringify(selectedEventDate?.eventDate) === JSON.stringify(eventInfo?.eventDate)) {
              this.selectedEventDateList.splice(index, 1);
            }
          });
        });
      });
    }
  }

  onSubmit(value) {
    const submitValue = Object.assign(
      {
        eventDateInfo: this.selectedEventDateList
      },
      {
        workflow: {
          comments: value
        }
      },
      { uuid: this.uuid }
    );
    this.onSubmitClicked.emit(submitValue);
  }

  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }

  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }

  refreshDocuments(item) {
    this.doc.emit(item);
  }
}
