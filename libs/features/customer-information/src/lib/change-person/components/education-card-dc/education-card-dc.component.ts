/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';

//This component is used to set the educational details  of the person
@Component({
  selector: 'cim-education-card-dc',
  templateUrl: './education-card-dc.component.html',
  styleUrls: ['./education-card-dc.component.scss']
})
export class EducationCardDcComponent extends BaseComponent implements OnInit {
  //Input variables
  @Input() person;
  @Input() educationList;
  @Input() editSpecialization;
  @Input() isCsr = false;
  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();

  /**
   * Creates an instance of EducationCardDcComponent
   * @memberof  EducationCardDcComponent
   *
   */
  constructor() {
    super();
  }

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {}

  // Method to emit edit details

  editEventDetails() {
    this.editEvent.emit();
  }
}
