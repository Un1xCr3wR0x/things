import { Component, EventEmitter, OnInit, Output, Input, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { LanguageToken, RoleIdEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { SessionInvitationDetails } from '../../../shared/models';

@Component({
  selector: 'mb-medical-board-session-invitation-dc',
  templateUrl: './medical-board-session-invitation-dc.component.html',
  styleUrls: ['./medical-board-session-invitation-dc.component.scss']
})
export class MedicalBoardSessionInvitationDcComponent implements OnInit, OnChanges {
  @Output() confirm: EventEmitter<SessionInvitationDetails> = new EventEmitter();
  @Output() show: EventEmitter<HTMLElement> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  @Input() allSessions: SessionInvitationDetails[];
  @Input() isManagerLogin: boolean;
  sessionId: number;
  inviteId: number;
  session: SessionInvitationDetails;
  lang = 'en';
  allowedAcceptAccess=[RoleIdEnum.MS_OFFICER, RoleIdEnum.CONTRACTED_DOCTOR,RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER]

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allSessions && changes.allSessions.currentValue) {
      this.allSessions = changes.allSessions.currentValue;
      if (this.allSessions)
        this.allSessions?.forEach(value => {
          const regx = /^\d{2}::\d{2}$/;
          const regy = /^\d{2}::\d{2}$/;
          if (!regx.test(value.sessionStartTime) && !regy.test(value.sessionEndTime)) {
            return null;
          }
          const startArray = value.sessionStartTime.split('::');
          const endArray = value.sessionEndTime.split('::');
          endArray[1] = endArray[1] !== undefined ? endArray[1] : '00';
          startArray[1] = startArray[1] !== undefined ? startArray[1] : '00';
          if (Number(startArray[0]) > 12) {
            value.sessionStartTime = Number(startArray[0]) - 12 + ':' + startArray[1] + 'PM';
          } else {
            if (Number(startArray[0]) === 0 || Number(startArray[0]) === 12) {
              value.sessionStartTime = 12 + ':' + startArray[1] + 'AM';
            } else if (Number(startArray[0]) !== 0) value.sessionStartTime = startArray[0] + ':' + startArray[1] + 'AM';
          }
          if (Number(endArray[0]) > 12) {
            value.sessionEndTime = Number(endArray[0]) - 12 + ':' + endArray[1] + 'PM';
          } else {
            if (Number(endArray[0]) === 0 || Number(endArray[0]) === 12) {
              value.sessionEndTime = 12 + ':' + endArray[1] + 'AM';
            } else if (Number(endArray[0]) !== 0) value.sessionEndTime = endArray[0] + ':' + endArray[1] + 'AM';
          }
        });
    }
  }
  onClick(template, session) {
    this.sessionId = session.sessionId;
    this.inviteId = session.inviteId;
    this.session = session;
    this.show.emit(template);
  }

  decline() {
    this.cancel.emit();
  }
  confirmEvent() {
    this.confirm.emit(this.session);
  }
}
