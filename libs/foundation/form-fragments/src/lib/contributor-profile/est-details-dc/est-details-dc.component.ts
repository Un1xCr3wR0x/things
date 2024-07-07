import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'frm-est-details-dc',
  templateUrl: './est-details-dc.component.html',
  styleUrls: ['./est-details-dc.component.scss']
})
export class EstDetailsDcComponent implements OnInit {
  @Input() isUserLoggedIn: boolean;
  @Input() isCsr: boolean;
  @Input() registrationNo: number;
  @Input() estName: number;
  @Input() isArabicScreen: boolean;

  @Output() back: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
