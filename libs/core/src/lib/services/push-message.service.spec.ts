/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificationService, PushMessageService, EnvironmentToken } from '@gosi-ui/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { NotificationServiceStub, PushMessageServiceStub } from 'testing';
import { HttpClient } from '@angular/common/http';
import { ApplicationTypeToken } from '../tokens';
import { ApplicationTypeEnum } from '../enums';
const FireMessagingStub = {
  messaging: { subscribe: f => f([]) }
};
const httpSpy = { get: jasmine.createSpy('get'), post: jasmine.createSpy('post') };
describe('PushMessageService', () => {
  let pushMessageService: PushMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: PushMessageService, useClass: PushMessageServiceStub },

        { provide: AngularFireMessaging, useValue: FireMessagingStub },
        { provide: NotificationService, useClass: NotificationServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: HttpClient,
          useValue: httpSpy
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ]
    });

    pushMessageService = TestBed.inject(PushMessageService);
  });

  it('Should create PushMessageService', () => {
    expect(pushMessageService).toBeTruthy();
  });
});
