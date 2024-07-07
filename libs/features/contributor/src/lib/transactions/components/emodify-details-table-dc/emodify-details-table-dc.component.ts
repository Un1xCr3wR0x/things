import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'cnt-emodify-details-table-dc',
  templateUrl: './emodify-details-table-dc.component.html',
  styleUrls: ['./emodify-details-table-dc.component.scss']
})
export class EmodifyDetailsTableDcComponent implements OnInit {
  @Input() engagement;
  @Input() violationDetails;
  constructor() { }

  ngOnInit(): void {
  }

}
