/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'dsb-establishment-list-dc',
  templateUrl: './establishment-list-dc.component.html',
  styleUrls: ['./establishment-list-dc.component.scss']
})
export class EstablishmentListDcComponent implements OnInit {
  //input variables
  @Input() establishmentList = [];
  @Input() selectedEstablishment: BilingualText = null;
  @Input() lang = 'en';
  @Input() canBack = false;
  //output variables
  @Output() back: EventEmitter<null> = new EventEmitter();
  @Output() select: EventEmitter<number> = new EventEmitter();
  establishment: BilingualText = null;
  constructor() {}

  ngOnInit(): void {}
  /**
   * method to emit on back event
   */
  backClicked() {
    this.back.emit();
  }
  /**
   * method to emit selected event
   */
  onSelect(value) {
    this.select.emit(value.registrationNo);
    this.establishment = value.name;
  }
}
