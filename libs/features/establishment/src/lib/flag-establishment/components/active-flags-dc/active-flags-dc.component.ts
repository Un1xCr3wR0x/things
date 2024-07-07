/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, LanguageToken, LovList } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { FlagDetails, FlagFilter, FilterKeyValue } from '../../../shared';
import { FlagFilterDcComponent } from '../flag-filter-dc/flag-filter-dc.component';

@Component({
  selector: 'est-active-flags-dc',
  templateUrl: './active-flags-dc.component.html',
  styleUrls: ['./active-flags-dc.component.scss']
})
export class ActiveFlagsDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() flagMap: Map<string, FlagDetails[]>;
  @Input() flagNameMap: Map<
    string,
    {
      name: BilingualText;
      isOpen: boolean;
      searchParam: number;
      filters: FilterKeyValue[];
      filterReasons: LovList;
      creationTypeLovList: LovList;
    }
  >;
  @Input() activeFlagForm: FormGroup;
  @Input() hasModifyEligibility: boolean;
  //Output variables
  @Output() modifyReason: EventEmitter<number> = new EventEmitter();
  @Output() applySearch: EventEmitter<FlagFilter> = new EventEmitter();

  /** Child components */
  @ViewChildren('flagFilter')
  flagFilterComponents: QueryList<FlagFilterDcComponent>;

  // Local Variables
  lang: string;
  loadedFlagMap: Map<string, { flagDetails: FlagDetails[]; currentPage: number }> = new Map();
  pageSize = 5;
  flagFilters: FilterKeyValue[];

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>, readonly fb: FormBuilder) {}

  ngOnInit() {
    this.language.subscribe(language => (this.lang = language));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.flagMap && changes.flagMap.currentValue) {
      changes.flagMap.currentValue.forEach((value: FlagDetails[], key: string) => {
        if (!this.activeFlagForm.get(key)) {
          this.activeFlagForm.addControl(key, this.fb.group({}));
        }
        if (this.loadedFlagMap.has(key)) {
          const flag = this.loadedFlagMap.get(key);
          flag.flagDetails.splice(0, flag.flagDetails.length);
          this.loadedFlagMap.get(key).currentPage = 0;
        } else {
          this.loadedFlagMap.set(key, { flagDetails: [], currentPage: 0 });
        }
        this.loadMore(key, { currentPage: 0, pageSize: this.pageSize });
      });
    }
  }

  navigateToModifyFlag(flagId) {
    this.modifyReason.emit(flagId);
  }

  applySearchFilter(selectedType: string, searchParam: number, filters: FilterKeyValue[]) {
    this.flagNameMap.get(selectedType).filters = filters;
    this.flagNameMap.get(selectedType).searchParam = searchParam ? searchParam : undefined;
    const filterParam = new FlagFilter();
    filterParam.flagType = this.flagNameMap.get(selectedType).name;
    filterParam.flagFilter = filters;
    filterParam.transactionId = searchParam ? searchParam : undefined;
    this.applySearch.emit(filterParam);
  }

  /**
   * Method to load more items in view
   * @param event
   */
  loadMore(flagType: string, event: { currentPage: number; pageSize: number }) {
    const currentIndex = event.currentPage * event.pageSize;
    if (this.loadedFlagMap.has(flagType)) {
      const flag = this.loadedFlagMap.get(flagType);
      flag.flagDetails.push(...this.flagMap.get(flagType).slice(currentIndex, currentIndex + event.pageSize));
      flag.currentPage = event.currentPage;
    } else {
      this.loadedFlagMap.set(flagType, {
        flagDetails: [...this.flagMap.get(flagType).slice(currentIndex, currentIndex + event.pageSize)],
        currentPage: event.currentPage
      });
    }
  }

  /**
   * Method to detect accordion open change detecction
   * @param event
   * @param flagType
   */
  accordionOpenChange(event: boolean, flagType: string, index?: number) {
    this.flagNameMap.get(flagType).isOpen = event;
    if (!event) {
      this.flagFilterComponents.forEach((component, i) => {
        if (index !== undefined && index === i) component.cancelFilter();
      });
    }
  }

  /**
   * method to cancel the filter from parent component
   */
  cancelFilter(exceptionIndex?: number) {
    this.flagFilterComponents.forEach((component, index) => {
      if (!(exceptionIndex !== undefined && exceptionIndex === index)) component.cancelFilter();
    });
  }
}
