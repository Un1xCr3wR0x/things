/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output, Inject, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { SelectedTerminationPeriodDetails } from '../../../../shared/models/selected-termination-period-details';
@Component({
  selector: 'blg-backdated-termination-period-details-dc',
  templateUrl: './backdated-termination-period-details-dc.component.html',
  styleUrls: ['./backdated-termination-period-details-dc.component.scss']
})
export class BackdatedTerminationPeriodDetailsDcomponent implements OnInit, OnChanges {
  /** Local Variables */
  lang = 'en';
  list: SelectedTerminationPeriodDetails[];
  /** Input Variables */
  @Input() periodList: SelectedTerminationPeriodDetails[];

  /** Output Variables */
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to detect details on input changes */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  /**
   * This method to get values on input changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.periodList?.currentValue) {
      this.list = changes?.periodList?.currentValue;
    }
  }
  /**
   * This method to cancel the modal
   */
  closeConfirm() {
    this.cancel.emit();
  }
}
