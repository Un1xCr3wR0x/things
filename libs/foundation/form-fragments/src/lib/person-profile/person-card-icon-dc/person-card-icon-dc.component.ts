/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BaseComponent, checkBilingualTextNull } from '@gosi-ui/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

const addIcon = 'plus';
const editIcon = 'pencil-alt';
const warningIcon = 'exclamation-triangle';
@Component({
  selector: 'frm-person-card-icon-dc',
  templateUrl: './person-card-icon-dc.component.html',
  styleUrls: ['./person-card-icon-dc.component.scss']
})
export class PersonCardIconDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Input Variables
  /**
   * Boolean variables to be specified if the card needs to enable, any actions such as add or edit.
   */
  @Input() canAdd = false;
  @Input() canEdit = false;
  @Input() id: string;
  /**
   * Value to displayed
   */
  @Input() identifier: string;
  /**
   * Variables to store the name of the font awesome icon.
   */
  @Input() icon: string;
  @Input() label: string;
  @Input() isUnderWorkFlow = false;
  /**
   * Date to be displayed .
   */
  @Input() date: Date;
  /**
   * Name of custom icon (svg).
   * Use if not in fontawesome or custom made
   * The icon is to be included in card-icon-dc.scss file
   */
  @Input() customIcon = '';

  //Output Variables
  @Output() addEvent: EventEmitter<void> = new EventEmitter();
  @Output() editEvent: EventEmitter<void> = new EventEmitter();

  //Local Variables
  functionalIcon = addIcon;
  isValueNull = false;
  /**
   * Creates an instance of CardIconDcComponent
   * @memberof  CardIconDcComponent
   *
   */
  constructor() {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.functionalIcon = this.initialiseTheView();
  }

  /**
   * Method to handle input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isUnderWorkFlow) {
      this.functionalIcon = this.initialiseTheView();
    }
  }
  /**
   * This method is used to check if the input identifier is null or empty
   * @param identifier
   */
  checkNullValue(identifier) {
    return checkBilingualTextNull(identifier);
  }
  /**
   * This method handles the event to be emitted tasks.
   *
   */
  emitActionEvents() {
    if (this.functionalIcon === addIcon || this.functionalIcon === warningIcon) {
      this.addEvent.emit();
    } else {
      this.editEvent.emit();
    }
  }

  /**
   * The method is to update the state of the component
   */
  initialiseTheView(): string {
    this.isValueNull = this.checkNullValue(this.identifier);
    if (this.isUnderWorkFlow) {
      return warningIcon;
    } else if (this.isValueNull) {
      return addIcon;
    } else if (this.canEdit) {
      return editIcon;
    }
  }
}
