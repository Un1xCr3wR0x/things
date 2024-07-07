import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { SessionCalendarService } from '../../services';
import { AddParticipantsList, BulkParticipants, IndividualSessionEvents, SessionRequest } from '../../models';
import { AlertService, GosiCalendar, LanguageToken, Lov, LovList, LovStatus, convertToYYYYMMDD } from '@gosi-ui/core';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddParticipantsDcComponent } from '../add-participants-dc/add-participants-dc.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { add } from 'ngx-bootstrap/chronos';
import { AddParticipantModalDcComponent } from '../add-participant-modal-dc/add-participant-modal-dc.component';

@Component({
  selector: 'mb-add-participanyby-nin-slot-dc',
  templateUrl: './add-participanyby-nin-slot-dc.component.html',
  styleUrls: ['./add-participanyby-nin-slot-dc.component.scss']
})
export class AddParticipanybyNINSlotDcComponent extends AddParticipantModalDcComponent implements OnInit {
  //Input Variables
  @Input() heading = '';
  @Input() sessionDate: GosiCalendar = new GosiCalendar();
  @Input() sessionParticipantList: LovList;
  @Input() searchedParticipant: AddParticipantsList;
  @Input() type: string;
  individualSessionEvents: IndividualSessionEvents[] = [];
  selectValue: string;
  setList: boolean;
  assessmentForm: FormGroup;
  @Output() setParticipantTime: EventEmitter<Lov> = new EventEmitter();
  @Output() canceltime: EventEmitter<null> = new EventEmitter();

  constructor(
    readonly sessionCalendarService: SessionCalendarService,
    readonly fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService
  ) {
    super(fb, language, alertService);
  }

  ngOnInit(): void {
    if (!this.assessmentForm) {
      this.assessmentForm = this.createSpecialtyForm();
    }
    const addbulk = this.searchedParticipant;
    this.searchedParticipant = addbulk;
    const ninType = this.type;
  }
  onCancelTime() {
    this.canceltime.emit();
  }
  onclickacceptslot() {
    if (this.assessmentForm.valid) {
      this.confirmAddParticipant();
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
