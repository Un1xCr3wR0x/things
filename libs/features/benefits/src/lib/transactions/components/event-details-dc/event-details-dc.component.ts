import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bnt-event-details-dc',
  templateUrl: './event-details-dc.component.html',
  styleUrls: ['./event-details-dc.component.scss']
})
export class EventDetailsDcComponent implements OnInit {
  @Input() eventHistory = new Array();

  constructor() {}

  ngOnInit(): void {}
}
