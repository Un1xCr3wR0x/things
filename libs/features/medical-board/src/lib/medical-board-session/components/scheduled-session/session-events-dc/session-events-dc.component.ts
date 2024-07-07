/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { convertToStringDDMMYYYY, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { IndividualSessionEvents } from '../../../../shared/models';
import { MBConstants } from '../../../../shared';
import moment from 'moment';

@Component({
  selector: 'mb-session-events-dc',
  templateUrl: './session-events-dc.component.html',
  styleUrls: ['./session-events-dc.component.scss']
})
export class SessionEventsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   * */
  currentDate: string;
  sessionDate = new Date();
  lang = 'en';
  showToday: boolean = false;

  @Input() sessionList: IndividualSessionEvents[];
  @Input() currentSelected: string;
  @Input() isNoSessions: boolean;
  @Input() langVal = 'en';
  @Input() todayDate: string;
  @Output() navigate: EventEmitter<IndividualSessionEvents> = new EventEmitter();

  /**
   *
   * @param fb
   * @param language
   */

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /**
   * Method to initialise tasks
   */

  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }

  /**
   * Method to detect changes in input property
   */

  ngOnChanges(changes: SimpleChanges) {
    //Defect 541268 arabic translation is not correct for date  and time
    if (this.todayDate === this.currentSelected) {
      this.showToday = true;
    } else {
      this.showToday = false;
    }
    // if (this.currentDate === this.currentSelected) this.currentSelected = undefined;
    if (changes && changes.sessionList) {
      this.sessionList = changes.sessionList.currentValue;
      if (this.sessionList) {
        this.sessionList.forEach(time => {
          const startTimeArray = time.sessionStartTime.split('::');
          const endTimeArray = time.sessionEndTime.split('::');
          startTimeArray[1] = startTimeArray[1] !== undefined ? startTimeArray[1] : '00';
          endTimeArray[1] = endTimeArray[1] !== undefined ? endTimeArray[1] : '00';
          if (startTimeArray[0].length === 1) startTimeArray[0] = ('0' + startTimeArray[0]).slice(-2);
          else startTimeArray[0] = startTimeArray[0];
          if (endTimeArray[0].length === 1) endTimeArray[0] = ('0' + endTimeArray[0]).slice(-2);
          else endTimeArray[0] = endTimeArray[0];
          if (startTimeArray[1].length === 1) startTimeArray[1] = ('0' + startTimeArray[1]).slice(-2);
          else startTimeArray[1] = startTimeArray[1];
          if (endTimeArray[1].length === 1) endTimeArray[1] = ('0' + endTimeArray[1]).slice(-2);
          else endTimeArray[1] = endTimeArray[1];

          if (Number(startTimeArray[0]) > 12) {
            time.sessionStartTime = Number(startTimeArray[0]) - 12 + ':' + startTimeArray[1];
            time.startTimeAmOrPm = MBConstants.PM;
          } else if (Number(startTimeArray[0]) === 12) {
            time.sessionStartTime = 12 + ':' + startTimeArray[1];
            time.startTimeAmOrPm = MBConstants.PM;
          } else if (Number(startTimeArray[0]) === 0) {
            time.sessionStartTime = 12 + ':' + startTimeArray[1];
            time.startTimeAmOrPm = MBConstants.AM;
          } else {
            time.sessionStartTime = startTimeArray[0] + ':' + startTimeArray[1];
            time.startTimeAmOrPm = MBConstants.AM;
          }

          if (Number(endTimeArray[0]) > 12) {
            time.sessionEndTime = Number(endTimeArray[0]) - 12 + ':' + endTimeArray[1];
            time.endTimeAmOrPm = MBConstants.PM;
          } else if (Number(endTimeArray[0]) === 12) {
            time.sessionEndTime = 12 + ':' + endTimeArray[1];
            time.endTimeAmOrPm = MBConstants.PM;
          } else if (Number(endTimeArray[0]) === 0) {
            time.sessionEndTime = 12 + ':' + endTimeArray[1];
            time.endTimeAmOrPm = MBConstants.AM;
          } else {
            time.sessionEndTime = endTimeArray[0] + ':' + endTimeArray[1];
            time.endTimeAmOrPm = MBConstants.AM;
          }
        });
      }
    }
    if (changes && changes.isNoSessions) this.isNoSessions = changes.isNoSessions.currentValue;
  }
  navigateToStatus(session: IndividualSessionEvents) {
    this.navigate.emit(session);
  }
}
