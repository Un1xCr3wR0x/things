import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'est-resume-modal-dc',
  templateUrl: './resume-modal-dc.component.html',
  styleUrls: ['./resume-modal-dc.component.scss']
})
export class ResumeModalDcComponent implements OnInit {
  @Input() message: BilingualText;
  @Input() id: string;

  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() new: EventEmitter<void> = new EventEmitter();
  @Output() resume: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  getLines(value: string) {
    return value?.split('.');
  }
}
