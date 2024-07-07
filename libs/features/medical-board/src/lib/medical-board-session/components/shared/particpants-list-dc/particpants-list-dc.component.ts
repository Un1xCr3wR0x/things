import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { startOfDay } from '@fullcalendar/angular';
import moment from 'moment';
import { IndividualSessionDetails } from '../../../../shared/models';

@Component({
  selector: 'mb-particpants-list-dc',
  templateUrl: './particpants-list-dc.component.html',
  styleUrls: ['./particpants-list-dc.component.scss']
})
export class ParticpantsListDcComponent implements OnChanges {
  /**
   * Local variables
   */
  @Input() isAmb: boolean;
  @Input() configurationDetails: IndividualSessionDetails;
  @Output() addParticpant: EventEmitter<null> = new EventEmitter();
  @Output() replace: EventEmitter<number> = new EventEmitter();
  @Output() remove: EventEmitter<number> = new EventEmitter();
  @Output() onReplace: EventEmitter<null> = new EventEmitter();
  @Output() onRemove: EventEmitter<null> = new EventEmitter();
  @Output() addByNin: EventEmitter<null> = new EventEmitter();
  @Output() navToProfile: EventEmitter<number> = new EventEmitter();
  @Input() isInCharge: boolean;
  @Input() isNotOfficer: boolean;
  @Input() isEditMode = false;
  isTimeDisabled = false;

  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.configurationDetails) this.configurationDetails = changes.configurationDetails.currentValue;
    this.isSessionAlreadyStarted();
  }
  onAddParticipants() {
    this.addParticpant.emit();
  }
  addByNinModalPopup() {
    this.addByNin.emit();
  }
  onReplaceMember(i: number) {
    this.replace.emit(i);
    this.onReplace.emit();
  }
  onRemoveMember(i: number) {
    this.remove.emit(i);
    this.onRemove.emit();
  }

  navigationToProfile(identificationNo: number) {
    this.navToProfile.emit(identificationNo);
  }
  /**
   * Method to check if the session has started
   */

  isSessionAlreadyStarted() {
    if (this.isEditMode) {
      const starttime = this.configurationDetails?.startTime.split('::');
      starttime[1] = starttime[1] !== undefined ? starttime[1] : '00';
      const startTime = starttime[0] + ':' + starttime[1];
      let hours = new Date().getHours().toString();
      hours = hours.length === 1 ? '0' + hours.toString() : hours;
      let _min = new Date().getMinutes().toString();
      _min = _min.length === 1 ? '0' + _min.toString() : _min;
      const currentTime = hours + ':' + _min;
      if (moment(this.configurationDetails?.startDate?.gregorian).isBefore(startOfDay(new Date()))) {
        this.isTimeDisabled = true;
      } else if (
        moment(this.configurationDetails?.startDate?.gregorian).isSame(startOfDay(new Date())) &&
        startTime < currentTime
      ) {
        this.isTimeDisabled = true;
      }
    }
  }
}
