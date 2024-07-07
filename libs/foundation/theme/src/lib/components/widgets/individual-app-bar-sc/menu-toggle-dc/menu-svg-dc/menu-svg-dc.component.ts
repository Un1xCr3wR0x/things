import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gosi-menu-svg-dc',
  templateUrl: './menu-svg-dc.component.html',
  styleUrls: ['./menu-svg-dc.component.scss']
})
export class IndividualMenuSvgDcComponent implements OnInit {
  @Input() isOpen = false;
  @Input() smallDevice = false;

  constructor() {}

  ngOnInit(): void {}
}
