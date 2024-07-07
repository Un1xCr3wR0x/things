import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ApplicationTypeEnum, ApplicationTypeToken, Environment, EnvironmentToken } from '@gosi-ui/core';

import { BillRecordService } from './bill-record.service';

describe('BillRecordService', () => {
  let service: BillRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: EnvironmentToken,
          useValue: new Environment()
        }
      ]
    });
    service = TestBed.inject(BillRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
