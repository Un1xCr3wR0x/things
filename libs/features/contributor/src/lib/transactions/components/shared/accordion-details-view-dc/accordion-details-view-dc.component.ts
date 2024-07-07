import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cnt-accordion-details-view-dc',
  templateUrl: './accordion-details-view-dc.component.html',
  styleUrls: ['./accordion-details-view-dc.component.scss']
})
export class AccordionDetailsViewDcComponent implements OnInit {
  isOpen = false;
  isEmpty = false;
  @Input() heading: string = null;
  @Input() badge: string = null;

  constructor() {}

  ngOnInit(): void {}
}
