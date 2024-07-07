import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bnt-heir-details-dc',
  templateUrl: './heir-details-dc.component.html',
  styleUrls: ['./heir-details-dc.component.scss']
})
export class HeirDetailsDcComponent implements OnInit {
  @Input() contributorDetails;

  constructor() {}

  ngOnInit(): void {}
}
