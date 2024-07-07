import { Component, Input, OnInit } from '@angular/core';
import { NotesTimelineResponse } from '../../models';

@Component({
  selector: 'trn-notes-history-dc',
  templateUrl: './notes-history-dc.component.html',
  styleUrls: ['./notes-history-dc.component.scss']
})
export class NotesHistoryDcComponent implements OnInit {

  @Input() notesTimeLine: NotesTimelineResponse[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
