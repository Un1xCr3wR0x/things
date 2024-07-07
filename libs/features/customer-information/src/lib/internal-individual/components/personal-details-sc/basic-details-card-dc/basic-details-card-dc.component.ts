/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';
import moment from 'moment-timezone';
//This component is to set the address details of the  person

@Component({
  selector: 'cim-basic-details-card-dc',
  templateUrl: './basic-details-card-dc.component.html',
  styleUrls: ['./basic-details-card-dc.component.scss']
})
export class BasicDetailsCardDcComponent extends BaseComponent implements OnInit {
  //Input variables
  @Input() personDetails;
  @Input() isCsr = false;

  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();
  ageYear: number;
  ageMonth: number;
  constructor() {
    super();
  }

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    this.ageYear = moment(new Date()).diff(moment(this.personDetails.birthDate.gregorian), 'year');
    this.ageMonth = moment(new Date()).diff(moment(this.personDetails.birthDate.gregorian), 'month') % 12;
  }

  // Method to emit edit details

  editEventDetails() {
    this.editEvent.emit();
  }
}
