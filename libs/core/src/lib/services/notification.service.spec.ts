/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { Notification } from '../models';
import { NotificationServiceStub } from 'testing';
import { HttpClientModule } from '@angular/common/http';

/** To test NotificationService. */
describe('NotificationService', () => {
  let notificationService: NotificationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [NotificationService, { provide: NotificationService, useClass: NotificationServiceStub }]
    });
    notificationService = TestBed.inject(NotificationService);
  });

  /** Test if notification service is created properly. */
  it('Should create notification service', () => {
    expect(notificationService).toBeTruthy();
  });

  describe('notification', () => {
    it('should return notification', () => {
      const url = `http://apgapplvd02.gosi.ins:9030/bpm/api/v1/task/query`;
    });
  });
  /**
   * This method is to test add notification function.
   */
  describe('addNotification', () => {
    it('Should register a notification client', () => {
      const notification: Notification = {
        title: { arabic: '', english: '' },
        body: { arabic: '', english: '' },
        icon: '/assets/gosi.png',
        timestamp: {
          gregorian: new Date('2016-08-13T00:00:00.000Z'),
          hijiri: '1437-11-10'
        },
        redirectUrl: 'http://10.4.195.31:8030/web-establishment'
      };

      notificationService.addNotification(notification);

      notificationService.getNotification().subscribe(data => {
        expect(data.length).toBeGreaterThan(0);
      });
    });
  });

  /**
   * This method is to test get notification function.
   */
  describe('getNotification', () => {
    it('Should receive notification', () => {
      const notification: Notification = {
        title: { arabic: '', english: '' },
        body: { arabic: '', english: '' },
        icon: '/assets/gosi.png',
        timestamp: {
          gregorian: new Date('2016-08-13T00:00:00.000Z'),
          hijiri: '1437-11-10'
        },
        redirectUrl: 'http://10.4.195.31:8030/web-establishment'
      };

      notificationService.addNotification(notification);

      notificationService.getNotification().subscribe(data => {
        expect(data[0].title.english).toBe('');
      });
    });
  });
});
