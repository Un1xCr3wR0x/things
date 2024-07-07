/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, HostListener } from '@angular/core';
import { InputBaseComponent, WageCard } from '@gosi-ui/core';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gosi-input-wage-select-dc',
  templateUrl: './input-wage-select-dc.component.html',
  styleUrls: ['./input-wage-select-dc.component.scss']
})
export class InputWageSelectDcComponent extends InputBaseComponent implements OnChanges {
  /** Local variables. */
  currentSelection: WageCard = new WageCard();
  wages: WageCard[];
  firstSelectableIndex: number;
  lastSelectableIndex: number;

  /** Input variables. */
  @Input() wageCategories: WageCard[];
  @Input() disableAll: boolean;
  @Input() wageDecreaseInfo: string;
  @Input() wageIncreaseInfo: string;
  @Input() currentWageInfo: string;

  /** Output variables. */
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();
  @Output() showWarning: EventEmitter<null> = new EventEmitter();
  itemActive: boolean;

  /** Creates an instance of InputWageSelectDcComponent. */
  constructor() {
    super();
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.hideTooltip();
  }
  /** Method to handle changes in input variables. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.wageCategories && changes.wageCategories.currentValue) {
      this.currentSelection = new WageCard();
      this.wageCategories.forEach(item => {
        if (item.active) this.currentSelection = item;
      });
      this.identifyBoundaries();
      this.wages = [...this.wageCategories];
      if (this.disableAll) this.disableAllWageCategories();
    }
    if (changes.disableAll && this.disableAll && this.wageCategories) this.disableAllWageCategories();
    if (changes.control && changes.control.currentValue) this.detectChanges();
  }

  /** Method to identify boundaries. */
  identifyBoundaries() {
    const activeList = this.wageCategories.filter(item => !item.disabled);
    if (activeList.length > 0) {
      this.firstSelectableIndex = this.wageCategories.indexOf(activeList[0]);
      this.lastSelectableIndex = this.wageCategories.indexOf(activeList[activeList.length - 1]);
    } else {
      this.firstSelectableIndex = 0;
      this.lastSelectableIndex = this.wageCategories.length - 1;
    }
  }

  /** Method to disable all wage categories. */
  disableAllWageCategories() {
    this.wageCategories.forEach(wage => {
      if (!wage.active) wage.disabled = true;
    });
  }

  setErrorMsgs() {}

  /** Method to handle wage selection. */
  onWageSelect(wage: WageCard) {
    if (this.wageCategories.every(item => item.disabled)) {
      this.showWarning.emit();
    }
    if (!wage.disabled && !wage.active) {
      this.wageCategories.map(item => {
        if (item.wage === this.currentSelection.wage) item.active = false;
        else if (item.isCurrent == true || item.wage === wage.wage) item.active = true;
        return item;
      });
      this.currentSelection = wage;
      this.onSelect.emit(wage.category);
    }
  }

  /** Method to detect changes in control. */
  detectChanges() {
    this.control.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value: string) => {
      if (value === null || value === '') this.wages = [...this.wageCategories];
      else this.onSearch(Number(value));
    });
  }

  /** Method to handle searching wages. */
  onSearch(value: number) {
    const filteredList = [];
    if (value <= this.wageCategories[0].wage) filteredList.push(this.wageCategories[0]);
    else if (value >= this.wageCategories[this.wageCategories.length - 1].wage)
      filteredList.push(this.wageCategories[this.wageCategories.length - 1]);
    else {
      this.wageCategories.forEach((item, index, list) => {
        if (value > item.wage && value < list[index + 1].wage) {
          filteredList.push(item);
          filteredList.push(list[index + 1]);
        } else if (value === item.wage) filteredList.push(item);
      });
    }
    this.wages = [...filteredList];
  }

  /** Method to show tooltip. */
  showTooltip(index: number) {
    if (this.wageCategories[index - 1].isCurrent) this.tooltipContent = this.currentWageInfo;
    else if (index - 1 < this.firstSelectableIndex) this.tooltipContent = this.wageDecreaseInfo;
    else if (index - 1 > this.lastSelectableIndex) this.tooltipContent = this.wageIncreaseInfo;
  }

  /** Method to hide tooltip. */
  hideTooltip() {
    this.tooltipContent = undefined;
  }
}
