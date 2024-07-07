import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  AuthTokenService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  RouterService,
  EnvironmentToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import {
  AlertServiceStub,
  AuthTokenServiceStub,
  BilingualTextPipeMock,
  inboxResponse,
  statusPriorityResponse
} from 'testing';
import { NotificationsScComponent } from '../../../notifications/components';
import { NotificationsService } from '../../../notifications/services';
import { TodolistScComponent } from './todolist-sc.component';

export class TodolistServiceStub {
  /**
   * Creates an instance of TodolistService.
   *
   * @memberof TodolistService
   */

  getTodoList() {
    return of(null);
  }

  fetchNotificationList() {
    return of(inboxResponse);
  }
  getTransactionPriorityStatus() {
    return of(statusPriorityResponse);
  }
}
export class NotificationServiceStub {
  /**
   * Creates an instance of TodolistService.
   *
   * @memberof NotificationService
   */

  getTodoList() {
    return of(null);
  }

  fetchTodoList() {
    return of(inboxResponse);
  }
}
describe('TodolistScComponent', () => {
  let component: TodolistScComponent;
  let fixture: ComponentFixture<TodolistScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, NgxPaginationModule, HttpClientTestingModule],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: NotificationsService, useClass: NotificationServiceStub },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        RouterService,
        FormBuilder
      ],
      declarations: [TodolistScComponent, BilingualTextPipeMock, NotificationsScComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(TodolistScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
