import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IndividualSessionDetails } from '../../models';
import { ParticipantDetails, ParticipantList } from '../../models/contracted-members copy';

@Component({
  selector: 'mb-session-participant-list-dc',
  templateUrl: './session-participant-list-dc.component.html',
  styleUrls: ['./session-participant-list-dc.component.scss']
})
export class SessionParticipantListDcComponent implements OnInit {
  @Input() participantDetails: ParticipantDetails;
  @Input() participantList: ParticipantList[];
  @Input() isCompleted = false;
  
  @Output() onNinClicked = new EventEmitter<ParticipantList>();

  constructor() { }

  ngOnInit(): void {
  }
  getParticipantProfile(participant: ParticipantList) {
    this.onNinClicked.emit(participant);
  }
}
