import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gosi-accordion-dc',
  templateUrl: './accordion-dc.component.html',
  styleUrls: ['./accordion-dc.component.scss']
})
export class AccordionDcComponent implements OnInit {
  @Input() heading: string = null;
  @Input() id = 'accordion';
  @Input() isOpen = false;
  @Input() isEmpty = false;
  @Input() isPrimaryColor = true;
  @Input() closeOthers = false;
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  isOpened(event: boolean) {
    this.isOpenChange.emit(event);
  }
}
