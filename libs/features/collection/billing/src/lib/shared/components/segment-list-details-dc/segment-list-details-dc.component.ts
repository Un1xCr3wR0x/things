/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, SimpleChanges, OnChanges, Output, Inject, OnInit } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'blg-segment-list-details-dc',
  templateUrl: './segment-list-details-dc.component.html',
  styleUrls: ['./segment-list-details-dc.component.scss']
})
export class SegmentListDetailsDcomponent implements OnInit, OnChanges {
  /** Local Variables */
  lang = 'en';
  listItemEn;
  listItemAr;
  segmentlistLength: number;
  /** Input Variables */
  @Input() establishmentSegment;
  @Input() establishmentSegmentMultiSelect;
  /** Output Variables */
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to detect details on input changes */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.establishmentSegment?.currentValue) {
      this.establishmentSegment = changes?.establishmentSegment?.currentValue;
    }
    if (changes && changes?.establishmentSegmentMultiSelect?.currentValue) {
      this.establishmentSegmentMultiSelect = changes?.establishmentSegmentMultiSelect?.currentValue;
    }
  }
  closeConfirm() {
    this.cancel.emit();
    this.cancel.emit();
  }
}
