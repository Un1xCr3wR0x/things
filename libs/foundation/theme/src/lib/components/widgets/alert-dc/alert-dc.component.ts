/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  Alert,
  AlertIconEnum,
  AlertTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  LanguageToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-alert-dc',
  templateUrl: './alert-dc.component.html',
  styleUrls: ['./alert-dc.component.scss']
})
export class AlertDcComponent extends BaseComponent implements OnInit, OnChanges {
  /**
   * Input Variables */

  @Input() alert: Alert;
  @Input() message: string = null;
  @Input() type: AlertTypeEnum;
  @Input() dismissible = true;
  @Input() details?: Alert[];
  @Input() bilingualMessage?: BilingualText;
  @Input() transparent = false; // Remove color and border
  @Input() noPadding = false; //Remove padding
  @Input() messageParam; //For translation key require parameter to be passed
  /**
   * Local variables
   */
  selectedLang = 'en';
  icon;
  errorIcon = AlertIconEnum.ERROR;

  @Output() closed: EventEmitter<Alert> = new EventEmitter();

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
  }

  /**
   * Used to cache the changes in input
   * @param changes changes happend to inputs
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.alert && changes.alert.currentValue) {
      this.alert = changes.alert.currentValue;
      this.icon = this.alert.icon;
      this.type = this.alert.type;
      this.dismissible = this.alert.dismissible;
      this.setIcon();
    }
    if (changes.type && changes.type.currentValue) {
      this.type = changes.type.currentValue;
      this.setIcon();
    }
    if (changes.message && changes.message.currentValue) {
      this.message = changes.message.currentValue;
      this.alert = this.alert ? this.alert : new Alert();
      this.alert.messageKey = this.message;
    }
    if (changes.details && changes.details.currentValue) {
      this.details = changes.details.currentValue;
      this.alert = this.alert ? this.alert : { ...new Alert(), message: undefined };
      this.alert.details = this.details;
    }
    if (changes.bilingualMessage && changes.bilingualMessage.currentValue) {
      this.bilingualMessage = changes.bilingualMessage.currentValue;
      this.alert = this.alert ? this.alert : new Alert();
      this.alert.message = this.bilingualMessage;
    }
    if (changes.messageParam && changes.messageParam.currentValue) {
      this.alert = this.alert ? this.alert : new Alert();
      this.alert.messageParam = this.messageParam;
    }
  }

  setIcon() {
    if (this.type === AlertTypeEnum.DANGER) {
      this.icon = AlertIconEnum.ERROR;
    } else if (this.type === AlertTypeEnum.WARNING) {
      this.icon = AlertIconEnum.WARNING;
    } else if (this.type === AlertTypeEnum.INFO) {
      this.icon = AlertIconEnum.INFO;
    } else {
      this.icon = AlertIconEnum.SUCCESS;
    }
  }

  triggerDismissEvent() {
    this.message = null;
    this.closed.emit(this.alert);
    this.alert = null;
  }
}
