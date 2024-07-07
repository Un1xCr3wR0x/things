/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { FilterKeyValue } from '../../models';
import { FilterKeyEnum } from '../../enum';

@Component({
  selector: 'bnt-applied-filters-dc',
  templateUrl: './applied-filters-dc.component.html',
  styleUrls: ['./applied-filters-dc.component.scss']
})
export class AppliedFiltersDcComponent {
  appliedFilters: FilterKeyValue[] = [];
  english = 'en';
  noOfFilters: number;

  @Input() set filters(inputFilters: FilterKeyValue[]) {
    this.appliedFilters = [];
    this.appliedFilters = inputFilters?.map(filter => new FilterKeyValue().fromJsonToObject(filter));
    this.calculateNoOfFilters(this.appliedFilters);
  }

  @Output() clearFilter: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly lang: BehaviorSubject<string>) {}

  clear(key: FilterKeyEnum, value?, isBilingual: boolean = false) {
    let customFilters = [...this.appliedFilters];
    if (value) {
      if (isBilingual) {
        customFilters = this.removeBilingualFilter(customFilters, key, value);
      } else {
        customFilters = this.removeFilterWithKeys(customFilters, key, value);
      }
    } else {
      customFilters = this.removeFilterOfKey(customFilters, key);
    }
    this.clearFilter.emit(customFilters);
  }

  clearAll() {
    this.clearFilter.emit([]);
  }

  /**
   * Method to filter out translateKey from multiple translate keys under same filter criteria
   * For eg: If you want to remove one particular status from multiple status under Establishment Status Filter,
   * @param appliedFilters
   * @param key
   * @param value
   */
  removeFilterWithKeys(appliedFilters: FilterKeyValue[], key: FilterKeyEnum, value: string): FilterKeyValue[] {
    const item =
      appliedFilters.filter(filterItem => filterItem.key === key)?.length > 0
        ? appliedFilters.filter(filterItem => filterItem.key === key)[0]
        : undefined;
    item.translateKeys = item.translateKeys.filter(translatekey => translatekey !== value);
    if (item.translateKeys?.length > 0) {
      return this.replaceFilter(appliedFilters, item);
    } else {
      return this.removeFilterOfKey(appliedFilters, key);
    }
  }

  /**
   * Method to filter out Bilingual value from multiple Bilingual values under same filter criteria
   * For eg: If you want to remove one particular nationality from multiple nationalities Nationality Filter
   * @param appliedFilters
   * @param key
   * @param value
   */
  removeBilingualFilter(appliedFilters: FilterKeyValue[], key: FilterKeyEnum, value: BilingualText): FilterKeyValue[] {
    const bilingualFilter: FilterKeyValue =
      appliedFilters.filter(item => item.key === key)?.length > 0
        ? appliedFilters.filter(item => item.key === key)[0]
        : undefined;
    if (bilingualFilter?.bilingualValues?.length > 0) {
      const index = bilingualFilter.bilingualValues
        .map(bilingualValue => bilingualValue.english)
        .indexOf(value.english);
      if (index !== -1) {
        bilingualFilter.bilingualValues.splice(index, 1);
        bilingualFilter.codes?.splice(index, 1);
      }
      if (bilingualFilter.bilingualValues?.length > 0) {
        return this.replaceFilter(appliedFilters, bilingualFilter);
      } else {
        return this.removeFilterOfKey(appliedFilters, key);
      }
    }
    return [...appliedFilters];
  }

  /**
   * Remove a particular filter from applied filters
   * @param appliedFilter
   * @param key
   */
  removeFilterOfKey(appliedFilters: FilterKeyValue[], key: FilterKeyEnum): FilterKeyValue[] {
    return [...appliedFilters.filter(item => item.key !== key)];
  }

  replaceFilter(appliedFilters: FilterKeyValue[], filter: FilterKeyValue) {
    return [...appliedFilters.map(value => (value.key === filter.key ? filter : value))];
  }

  calculateNoOfFilters(filters: FilterKeyValue[]) {
    this.noOfFilters = filters.reduce((length, filter) => {
      if (filter.bilingualValues?.length > 0) {
        return length + filter.bilingualValues?.length;
      }
      if (filter.translateKeys?.length > 0) {
        return length + filter.translateKeys?.length;
      }
      return length + 1;
    }, 0);
  }
}
