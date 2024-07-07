import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { SessionCalendarService } from '../../services';
import { BulkParticipants, IndividualSessionEvents, SessionRequest } from '../../models';
import { AlertService, GosiCalendar, LanguageToken, Lov, LovList, LovStatus, convertToYYYYMMDD } from '@gosi-ui/core';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddParticipantsDcComponent } from '../add-participants-dc/add-participants-dc.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { add } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'mb-add-participant-slot-dc',
  templateUrl: './add-participant-slot-dc.component.html',
  styleUrls: ['./add-participant-slot-dc.component.scss']
})
export class AddParticipantSlotDcComponent extends AddParticipantsDcComponent implements OnInit {
  //Input Variables
  @Input() heading = '';
  @Input() sessionDate: GosiCalendar = new GosiCalendar();
  @Input() sessionParticipantList: LovList;
  @Input() addbulkParticipants:  BulkParticipants[] = [];
  individualSessionEvents: IndividualSessionEvents[] = [];
  selectValue: string;
  setList: boolean;
  assessmentForm: FormGroup;
  @Output() setParticipantTime: EventEmitter<Lov> = new EventEmitter();
  @Output() canceltime: EventEmitter<null> = new EventEmitter();

  constructor(
    readonly sessionCalendarService: SessionCalendarService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly fb: FormBuilder
  ) {
    super(fb, modalService, language, alertService);
  }

  ngOnInit(): void {
    if (!this.assessmentForm) {
      this.assessmentForm = this.createSpecialtyForm();
    }
   const addbulk = this.addbulkParticipants;
   this.bulkParticipants = addbulk;


  }
  onCancelTime() {
    this.canceltime.emit();
  }
  onclickacceptslot(){
    if (this.assessmentForm.valid) { 
      this.onAddParticipants()
    } else {
      this.assessmentForm.markAllAsTouched();
    }
  }

  createSpecialtyForm() {
    return this.fb.group({
      assessmentTime: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  selectedParticipantTime(specialty: Lov) {
    this.setParticipantTime.emit(specialty);
  }
}
