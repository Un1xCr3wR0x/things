import { TestBed } from '@angular/core/testing';

import { StartupService } from './startup.service';
import { ApplicationTypeToken, LanguageToken } from '../tokens';
import { ApplicationTypeEnum, LanguageEnum } from '../enums';
import { BehaviorSubject } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { SwUpdateStub } from 'testing';

describe('StartupService', () => {
  let service: StartupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>(LanguageEnum.ENGLISH)
        },
        {
          provide: SwUpdate,
          useClass: SwUpdateStub
        }
      ]
    });
    service = TestBed.inject(StartupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
