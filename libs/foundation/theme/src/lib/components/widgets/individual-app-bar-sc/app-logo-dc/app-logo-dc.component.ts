import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gosi-app-logo-dc',
  templateUrl: './app-logo-dc.component.html',
  styleUrls: ['./app-logo-dc.component.scss']
})
export class IndividualAppLogoDcComponent implements OnInit {
  @Input() showGosiLogo = true;
  @Input() showTaminatyLogo = false;
  @Input() showAmeenLogo = true;
  @Input() hideIcons: boolean;

  constructor() {}

  ngOnInit(): void {}
}
