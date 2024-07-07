import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, convertToYYYYMMDD, LanguageToken, LovList, RoleIdEnum, statusBadge, StatusBadgeTypes } from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { SessionFilterRequest, SessionInvitationDetails } from '../../../shared';

@Component({
  selector: 'mb-session-invitation-timeline-dc',
  templateUrl: './session-invitation-timeline-dc.component.html',
  styleUrls: ['./session-invitation-timeline-dc.component.scss']
})
export class SessionInvitationTimelineDcComponent implements OnInit, OnChanges {
  sessionValue: SessionInvitationDetails;
  statusBadgeTypes = StatusBadgeTypes;
  @Input() allSessions: SessionInvitationDetails[];
  @Input() locationList: LovList;
  @Input() sessionCount: number;
  @Input() searchParams = '';
  @Input() statusList: LovList;
  @Output() confirm: EventEmitter<SessionInvitationDetails> = new EventEmitter();
  @Output() show: EventEmitter<HTMLElement> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() filter: EventEmitter<SessionFilterRequest> = new EventEmitter();
  lang = 'en';
  isSearched = false;
  allowedWithdrawAccess=[RoleIdEnum.MS_OFFICER, RoleIdEnum.CONTRACTED_DOCTOR,RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER]
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allSessions && changes.allSessions.currentValue) {
      this.allSessions = changes.allSessions.currentValue;
      if (this.allSessions) {
        const todayDate = convertToYYYYMMDD(new Date().toString());
        this.allSessions.forEach(element => {
          element.isEnabled = false;
          if (moment(element.sessionDate.gregorian).format('YYYY-MM-DD') === todayDate) {
            let hours = new Date().getHours().toString();
            hours = hours.length === 1 ? '0' + hours.toString() : hours;
            let _min = new Date().getMinutes().toString();
            _min = _min.length === 1 ? '0' + _min.toString() : _min;
            const curTime = hours.toString() + ':' + _min;
            const endArray = element.sessionEndTime.split('::');
            let endTime: string;
            endArray[1] = endArray[1] !== undefined ? endArray[1] : '00';
            if (element.sessionEndTime.indexOf('AM') >= 0) {
              if (element.sessionEndTime.indexOf('12') >= 0) {
                endTime = element.sessionEndTime.replace('AM', '');
                const endHr = endTime.split(':');
                endTime = '00' + ':' + endHr[1];
              } else {
                endTime = element.sessionEndTime.replace('AM', '');
              }
            } else if (element.sessionEndTime.indexOf('PM') >= 0) {
              if (element.sessionEndTime.indexOf('12') >= 0) {
                endTime = element.sessionEndTime.replace('PM', '');
              } else {
                endTime = element.sessionEndTime.replace('PM', '');
                const endHr = endTime.split(':');
                endTime = (Number(endHr[0]) + 12).toString() + ':' + endHr[1];
              }
            } else {
              endTime = endArray[0] + ':' + endArray[1];
            }
            if (endTime < curTime) {
              element.isEnabled = true;
            }
          } else if (moment(element.sessionDate.gregorian).format('YYYY-MM-DD') < todayDate) {
            element.isEnabled = true;
          }
        });
      }
      if (this.allSessions)
        this.allSessions?.forEach(value => {
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
  onWithdraw(template, sessions) {
    this.show.emit(template);
    this.sessionValue = sessions;
  }
  decline() {
    this.cancel.emit();
  }
  confirmEvent() {
    this.confirm.emit(this.sessionValue);
  }
  /**
   *
   * @param status method to set status
   */
  statusBadgeType(status: BilingualText) {
    return statusBadge(status.english);
  }
  onsearchSessionId(value: string) {
    if (value && (value.length >= 3 || value === null)) {
      this.search.emit(value);
      this.isSearched = true;
      this.searchParams = value;
    }
  }
  onSearchEnable(key: string) {
    if (!key && this.isSearched) {
      this.isSearched = false;
      this.searchParams = key;
      this.search.emit(key);
    }
  }
  resetSearch() {
    this.search.emit(null);
  }
  onFilter(filterValue: SessionFilterRequest) {
    this.filter.emit(filterValue);
  }
}
