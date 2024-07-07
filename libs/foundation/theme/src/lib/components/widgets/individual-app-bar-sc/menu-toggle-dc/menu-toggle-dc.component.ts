import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gosi-menu-toggle-dc',
  templateUrl: './menu-toggle-dc.component.html',
  styleUrls: ['./menu-toggle-dc.component.scss']
})
export class IndividualMenuToggleDcComponent implements OnInit {
  @Input() isOpen = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
