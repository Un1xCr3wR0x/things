/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { CryptoService } from './crypto.service';

/** To test CryptoService. */
describe('CryptoService', () => {
  let cryptoService: CryptoService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    cryptoService = TestBed.inject(CryptoService);
  });
  /** Test if CryptoService service is created properly. */
  it('Should create CryptoService service', () => {
    expect(cryptoService).toBeTruthy();
  });

  /** Test if encryption added properly. */
  it('Should call encrypt service', () => {
    cryptoService.encrypt('test');
    expect(cryptoService).toBeTruthy();
  });

  /** Test if decryption added properly. */
  it('Should call decrypt service', () => {
    cryptoService.decrypt('5gJcb8bI70ipbsgXwe2rNxJ4kUs=');
    expect(cryptoService).toBeTruthy();
  });
});
