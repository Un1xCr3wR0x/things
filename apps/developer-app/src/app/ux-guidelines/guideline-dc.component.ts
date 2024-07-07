import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StateService } from './services/state.service';

@Component({
  selector: 'dev-guideline-dc',
  templateUrl: './guideline-dc.component.html'
})
export class GuidelineDcComponent implements OnInit {
  toggleControl = new FormControl(true);
  disabledControl = new FormControl();
  isToggleRequired = true;
  isDisabledRequired = true;
  heading: string;
  constructor(readonly state: StateService) {
    this.state.heading$.subscribe(res => {
      this.heading = res;
    });
    this.state.hasToggle$.subscribe(res => {
      this.isToggleRequired = res;
    });
    this.state.hasDisable$.subscribe(res => {
      this.isDisabledRequired = res;
    });
  }

  ngOnInit(): void {}

  makeMandatory(bool: boolean) {
    this.state.required$.next(bool);
  }
  makeDisabled(bool: boolean) {
    this.state.disabled$.next(bool);
  }
}
