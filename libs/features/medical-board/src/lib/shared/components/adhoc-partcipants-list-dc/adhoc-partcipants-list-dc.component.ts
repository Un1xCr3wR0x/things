import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IndividualSessionDetails } from '../../models';

@Component({
  selector: 'mb-adhoc-partcipants-list-dc',
  templateUrl: './adhoc-partcipants-list-dc.component.html',
  styleUrls: ['./adhoc-partcipants-list-dc.component.scss']
})
export class AdhocPartcipantsListDcComponent implements OnInit {
  @Input() adhocParticipantList: IndividualSessionDetails;
  @Output() navigate = new EventEmitter<number>();
  @Input() lang = 'en';
  constructor() {}

  ngOnInit(): void {}
  getParticipantProfile(id: number) {
    this.navigate.emit(id);
  }
}
