/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoleIdEnum } from '@gosi-ui/core';

/**
 * Enum for identifying card type
 * primary - white background
 * secondary - grey background
 */
export enum cardType {
  Primary = 'primary',
  Secondary = 'secondary'
}

/**
 * Enum for heading size
 */
export enum headingSize {
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg'
}

@Component({
  selector: 'gosi-card-dc',
  templateUrl: './card-dc.component.html',
  styleUrls: ['./card-dc.component.scss']
})
export class CardDcComponent {
  /**
   * Input variables
   */
  @Input() type: cardType = cardType.Primary;
  @Input() heading: string;
  @Input() canEdit = false;
  @Input() icon: string;
  @Input() headingSize: headingSize = headingSize.Sm;
  @Input() minHeight: string;
  @Input() showCard = true;
  @Input() noHeadingMargin = false;
  @Input() id = 'editCard';
  @Input() isHeading = true;
  @Input() lessPadding = false;
  @Input() noBorder = false;
  @Input() paddingBottom = false;
  @Input() accessRoles: RoleIdEnum[] = [];
  @Input() accessIdentifier: number;
  @Input() mobilePaddingTop = true;
  @Input() mobilePaddingBottom = true;
  @Input() mobileMarginBottom = true;
  @Input() mobileBorderBottom = false;
  @Input() noMarginBottom = false;
  @Input() negativeMobileMargin = true;
  @Input() isRequired = true;
  @Input() noPadding = false;
  @Input() noGutters = false;
  @Input() isBoxShadow = false;
  @Input() mobileMarginRight = true;
  @Input() setMobileBorderRadius = false;
  @Input() isShow: any;
  @Input() lang;
  @Input() canRefresh: boolean = false;
  @Input() toolTipMsg: string;
  @Input() toolTipMessage: string;
  @Input() customHeight: boolean;

  /**
   * Output events
   */
  @Output() edit: EventEmitter<Object> = new EventEmitter();
  @Output() refresh: EventEmitter<Object> = new EventEmitter();

  /**
   * Method to trigger edit event
   */
  editDetails() {
    this.edit.emit();
  }
  
    /**
   * Method to trigger refresh event
   */
    refreshDetails() {
      this.refresh.emit();
    }
  
}
