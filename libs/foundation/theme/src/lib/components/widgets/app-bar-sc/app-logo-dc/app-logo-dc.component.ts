import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gosi-app-logo-dc',
  templateUrl: './app-logo-dc.component.html',
  styleUrls: ['./app-logo-dc.component.scss']
})
export class AppLogoDcComponent implements OnInit {
  @Input() showGosiLogo = true;
  @Input() showTaminatyLogo = false;
  @Input() showAmeenLogo = true;
  @Input() hideIcons: boolean;
  @Input() isAppIndividual: false;
  @Input() disableHomeLinks: boolean = false;

  mobileView = false;
  width: number;
  constructor() {}

  ngOnInit(): void {
    this.onWindowReSize();
  }
  @HostListener('window:resize', ['$event'])
  onWindowReSize() {
    this.width = window.innerWidth;
    if (this.width < 767 || this.width == 828 || this.width == 780 || this.width == 786 || this.width == 824) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  }
}
