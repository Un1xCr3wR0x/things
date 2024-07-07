import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gosi-translate-dc',
  templateUrl: './translate-dc.component.html',
  styleUrls: ['./translate-dc.component.scss']
})
export class IndividualTranslateDcComponent implements OnInit {
  @Input() lang: string;
  @Output() selectLang: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
