/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CsvFile } from '@gosi-ui/core';

@Component({
  selector: 'gosi-csv-item-dc',
  templateUrl: './csv-item-dc.component.html',
  styleUrls: ['./csv-item-dc.component.scss']
})
export class CsvItemDcComponent implements OnInit, OnChanges {
  /** Local variables */
  isOpen: boolean;

  /** Input variables */
  @Input() csvDetails: CsvFile;
  @Input() index: number;
  @Input() collapseView: boolean;

  /** Output variables. */
  @Output() download: EventEmitter<null> = new EventEmitter();

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.isOpen = this.index === 0;
  }

  /** Method to identify changes to input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.index && changes.index.currentValue !== undefined) {
      if (this.index === 0) this.isOpen = true;
    }
  }

  /** Method to handle csv download. */
  downloadCsv(event) {
    event.preventDefault();
    event.stopPropagation();
    this.download.emit();
  }
}
