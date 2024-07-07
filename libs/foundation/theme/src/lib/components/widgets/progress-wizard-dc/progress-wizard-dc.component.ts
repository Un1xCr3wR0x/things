/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent, WizardItem } from '@gosi-ui/core';

@Component({
  selector: 'gosi-progress-wizard-dc',
  templateUrl: './progress-wizard-dc.component.html',
  styleUrls: ['./progress-wizard-dc.component.scss']
})
export class ProgressWizardDcComponent extends BaseComponent implements OnInit {
  _wizardItems: WizardItem[];
  @Input() isMargin: any;
  @Input() set wizardItems(items: WizardItem[]) {
    this._wizardItems = items;
    if (items?.length >= 0) {
      this.totalWizards = items.length;
    }
  }

  get wizardItems(): WizardItem[] {
    return this._wizardItems.filter(wizard => !wizard.hide);
  }
  totalWizards: number;
  currentWizard: number;
  wizardTitle: string;
  margin: any = '';

  @Output() clickWizard: EventEmitter<Object> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.isMargin) {
      this.margin = 'wizardMargin';
    }
  }

  clickWizardItem(index) {
    if (!this.wizardItems[index].isDisabled) {
      this.setActive(index);
      this.clickWizard.emit(index);
      this.currentWizard = index;
    }
  }
  getActiveLabel() {
    this.wizardTitle = this.wizardItems.find(item => item.isActive === true)?.label;
    return this.wizardTitle;
  }

  setActive(index) {
    for (const wizard of this.wizardItems) {
      wizard.isActive = false;
    }
    this.wizardItems[index].isActive = true;
    this.wizardItems[index].isDisabled = false;
  }

  setDone(index) {
    this.wizardItems[index].isDone = true;
    this.wizardItems[index].isDisabled = false;
  }

  /**
   * This method is to handle form save&next event
   * @param index is the current index
   */
  setNextItem(index) {
    if (index <= this.totalWizards) {
      if (index > 0) {
        this.wizardItems[index - 1].isDone = true;
        this.wizardItems[index - 1].isActive = false;
      }
      if (this.wizardItems[index]) {
        this.wizardItems[index].isDisabled = false;
        this.wizardItems[index].isActive = true;
      }
      this.currentWizard = index;

      for (let i = index; i < this.totalWizards; i++) {
        if (this.wizardItems[i + 1]) {
          this.wizardItems[i + 1].isDisabled = true;
          this.wizardItems[i + 1].isActive = false;
          this.wizardItems[i + 1].isDone = false;
        }
      }
    }
  }

  /**
   * This method is to handle form previous event
   * @param index
   */
  setPreviousItem(index) {
    if (index >= 0) {
      this.setActive(index);
    }
  }
}
