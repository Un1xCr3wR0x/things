/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('clear search', () => {
    it('Should clear search', () => {
      spyOn(service, 'setSearchType').and.callThrough();
      spyOn(service, 'setSearchKey').and.callThrough();
      service.clearSearch();
      expect(service).toBeTruthy();
    });
  });
  describe('set searchtype', () => {
    it('Should set searchtype', () => {
      const type = 'Complaint';
      service.setSearchType(type);
      expect(service.searchType).not.toEqual(null);
      expect(service).toBeTruthy();
    });
  });
  describe('get searchtype', () => {
    it('Should get searchtype', () => {
      service.getSearchType();
      expect(service).toBeTruthy();
    });
  });
  describe('get searchkey', () => {
    it('Should get searchkey', () => {
      service.getSearchKey();
      expect(service).toBeTruthy();
    });
  });
});
