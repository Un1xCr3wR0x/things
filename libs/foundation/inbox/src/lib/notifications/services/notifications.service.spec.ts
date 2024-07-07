import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService, NotificationRequest } from '@gosi-ui/core';
import { AlertServiceStub, inboxResponse } from 'testing';
import { NotificationsService } from './notifications.service';

let notificationsService: NotificationsService;
let httpMock: HttpTestingController;
describe('NotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationsService, { provide: AlertService, useClass: AlertServiceStub }]
    });

    notificationsService = TestBed.inject(NotificationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: NotificationsService = TestBed.inject(NotificationsService);
    expect(service).toBeTruthy();
  });
  describe('fetchInboxList', () => {
    it('should fetch todo list', () => {
      const inboxRequest = new NotificationRequest();
      const notificationUrl =
        '/api/v1/notification?page.pageNo=undefined&page.size=undefined&sort.column=Date&sort.direction=ASC';
      notificationsService.fetchNotificationList(inboxRequest).subscribe(() => {
        expect(inboxResponse.inboxEntries.length).toBeGreaterThan(0);
      });
      const httpRequest = httpMock.expectOne(notificationUrl);
      expect(httpRequest.request.method).toBe('GET');
      httpRequest.flush(inboxResponse);
      httpMock.verify();
    });
  });
});
