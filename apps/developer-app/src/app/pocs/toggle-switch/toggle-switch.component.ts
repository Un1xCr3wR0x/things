import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dev-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  isToggleDisabled = false;
  toggleControl = new FormControl();
  constructor() {}

  ngOnInit(): void {}

  onToggle() {
    //console.log('toggle');
  }

  onClick() {
    this.isToggleDisabled = !this.isToggleDisabled;
  }
}
