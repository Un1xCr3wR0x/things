import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dsb-reload-dc',
  templateUrl: './reload-dc.component.html',
  styleUrls: ['./reload-dc.component.scss']
})
export class ReloadDcComponent implements OnInit {
  @Output() reload: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
