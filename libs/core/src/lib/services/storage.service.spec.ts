/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { StorageServiceStub } from '../../../../../testing';

describe('StorageService', () => {
  let storageService: StorageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useClass: StorageServiceStub }]
    });
    storageService = TestBed.inject(StorageService);
  });

  it('Should create StorageService', () => {
    expect(storageService).toBeTruthy();
  });

  describe('setSessionValue', () => {
    it('Should set a value in session storage', () => {
      storageService.setSessionValue('lang', 'ar');
      expect(storageService.getSessionValue('lang')).toEqual('ar');
    });
  });

  describe('getSessionValue', () => {
    it('Should retrieve a value from session storage', () => {
      storageService.setSessionValue('lang', 'en');
      expect(storageService.getSessionValue('lang')).toEqual('en');
    });
  });

  describe('clearSession', () => {
    it('Should clear the session storage', () => {
      storageService.setSessionValue('lang', 'en');
      expect(storageService.getSessionValue('lang')).toEqual('en');
      storageService.clearSession();
      expect(storageService.getSessionValue('lang')).toBeUndefined();
    });
  });

  describe('setLocalValue', () => {
    it('Should set a value in local storage', () => {
      storageService.setLocalValue('lang', 'en');
      expect(storageService.getLocalValue('lang')).toEqual('en');
    });
  });

  describe('getLocalValue', () => {
    it('Should get a value from local storage', () => {
      storageService.setLocalValue('lang', 'en');
      expect(storageService.getLocalValue('lang')).toEqual('en');
    });
  });

  describe('clearLocal', () => {
    it('Should clear local storage', () => {
      storageService.setLocalValue('lang', 'en');
      expect(storageService.getLocalValue('lang')).toEqual('en');
      storageService.clearLocal();
      expect(storageService.getLocalValue('lang')).toBeUndefined();
    });
  });
});
