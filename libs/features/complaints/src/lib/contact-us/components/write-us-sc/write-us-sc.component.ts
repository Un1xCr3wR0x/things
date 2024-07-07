import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'gosi-ui-write-us-sc',
  templateUrl: './write-us-sc.component.html',
  styleUrls: ['./write-us-sc.component.scss']
})
export class WriteUsScComponent implements OnInit {
  constructor(readonly router: Router) {}

  ngOnInit(): void {}
  onNavigateTo() {
    this.router.navigate(['/home/complaints/contact/write-to-us']);
  }
}
