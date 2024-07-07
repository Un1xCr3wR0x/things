/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchKey: string = undefined;
  searchType: string = undefined;
  isSearch = false;
  constructor() {}
  /**
   * This method is to get the search key
   */
  getSearchKey(): string {
    return this.searchKey;
  }
  /**
   * This method is to set the search key
   * @param searchKey
   */
  setSearchKey(searchKey: string) {
    this.searchKey = searchKey;
  }
  /**
   * This method is to get the search type
   */
  getSearchType(): string {
    return this.searchType;
  }
  /**
   * This method is to set the search key
   * @param searchType
   */
  setSearchType(searchType: string) {
    this.searchType = searchType;
  }
  /**
   * Method to clear search values
   */
  clearSearch() {
    this.setSearchType(null);
    this.setSearchKey(null);
  }
}
