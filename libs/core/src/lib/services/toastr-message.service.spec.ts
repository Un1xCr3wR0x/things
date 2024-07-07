import { TestBed } from '@angular/core/testing';

import { ToastrMessageService } from './toastr-message.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LanguageToken } from '../tokens';
import { BehaviorSubject, of } from 'rxjs';
import { BilingualText } from '../models';

describe('ToastrMessageService', () => {
  let service: ToastrMessageService;
  let toastSpyService: jasmine.SpyObj<any>;
  let translateService: jasmine.SpyObj<any>;

  beforeEach(() => {
    const toastSpy = jasmine.createSpyObj('ToastrService', ['show', 'success']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['get']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ToastrService,
          useValue: toastSpy
        },
        {
          provide: TranslateService,
          useValue: translateSpy
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        }
      ]
    });
    service = TestBed.inject(ToastrMessageService);
    toastSpyService = TestBed.inject(ToastrService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('should show toast message', () => {
    it('must show toast with billingual text', () => {
      const biText: BilingualText = { arabic: 'abcd', english: 'abcd' };
      service.show(biText);
      expect(toastSpyService.show.calls.count()).toBe(1);
    });
    it('must show toast with key and param', () => {
      const key = 'PERON';
      translateService.get.and.returnValue(of('string'));
      service.showByKey(key, 123);
      expect(toastSpyService.success.calls.count()).toBe(1);
    });
  });
  it('CREATE toast with billingual text', () => {
    const biText: BilingualText = { arabic: 'abcd', english: 'abcd' };
    service.showSuccess(biText);
    expect(toastSpyService.success.calls.count()).toBe(1);
  });
});
