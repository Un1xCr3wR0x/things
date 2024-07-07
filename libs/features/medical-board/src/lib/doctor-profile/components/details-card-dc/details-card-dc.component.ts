/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent, checkBilingualTextNull } from '@gosi-ui/core';

const addIcon = 'plus';
const editIcon = 'pencil-alt';
const warningIcon = 'exclamation-triangle';

@Component({
  selector: 'mb-details-card-dc',
  templateUrl: './details-card-dc.component.html',
  styleUrls: ['./details-card-dc.component.scss']
})
export class DetailsCardDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Local Variables
  isValueNull = false;
  functionalIcon = addIcon;

  //Input Variables

  /**
   * Value to displayed
   */
  @Input() identifier: string;

  /**
   * Variable to store the name of the font awesome icon
   */
  @Input() label: string;
  @Input() icon: string;
  @Input() isUnderWorkFlow = false;

  /**
   * Name of custom icon (svg).
   * Use if not in fontawesome or custom made
   * The icon is to be included in card-icon-dc.scss file
   */
  @Input() customIcon = '';

  /**
   * Boolean variables to specify if the card needs to enable any actions such as add or edit
   */
  @Input() canEdit = false;
  @Input() canAdd = false;
  @Input() id: string;

  /**
   * Date to be displayed
   */
  @Input() date: Date;

  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();
  @Output() addEvent: EventEmitter<void> = new EventEmitter();

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
    this.functionalIcon = this.initialiseView();
  }

  /**
   * Method to handle input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isUnderWorkFlow) {
      this.functionalIcon = this.initialiseView();
    }
  }

  /**
   * This method handles the event to be emitted tasks.
   *
   */
  emitActionEvent() {
    if (this.functionalIcon === addIcon || this.functionalIcon === warningIcon) {
      this.addEvent.emit();
    } else {
      this.editEvent.emit();
    }
  }

  /**
   * The method is to update the state of the component
   */
  initialiseView(): string {
    this.isValueNull = this.checkNull(this.identifier);
    if (this.isUnderWorkFlow) {
      return warningIcon;
    } else if (this.isValueNull) {
      return addIcon;
    } else if (this.canEdit) {
      return editIcon;
    }
  }

  /**
   * This method is used to check if the input identifier is null or empty
   * @param identifier
   */
  checkNull(identifier) {
    return checkBilingualTextNull(identifier);
  }
}
