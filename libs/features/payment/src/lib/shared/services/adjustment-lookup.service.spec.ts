import { TestBed } from '@angular/core/testing';

import { AdjustmentLookupService } from './adjustment-lookup.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { RouterData, LanguageToken, ApplicationTypeToken, RouterDataToken } from '@gosi-ui/core';

describe('AdjustmentLookupService', () => {
  let service: AdjustmentLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() }
      ]
    });
    service = TestBed.inject(AdjustmentLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should getGosiAdjustmentSortLov', () => {
    expect(service.getGosiAdjustmentSortLov()).not.toEqual(null);
  });
  it('should getTpaAdjustmentSortLov', () => {
    expect(service.getTpaAdjustmentSortLov()).not.toEqual(null);
  });
});
