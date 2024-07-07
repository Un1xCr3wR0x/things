import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'gosi-refresh',
  template: ``
})
export class RefreshDcComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {
    this.location.back();
  }
}
