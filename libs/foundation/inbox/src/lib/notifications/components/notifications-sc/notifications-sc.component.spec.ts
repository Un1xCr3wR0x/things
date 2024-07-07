import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentToken, LanguageToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { BilingualTextPipeMock } from 'testing';
import { TodolistServiceStub } from '../../../todolist/components/todolist-sc/todolist-sc.component.spec';
import { NotificationsService } from '../../services';
import { NotificationsScComponent } from './notifications-sc.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificationsScComponent', () => {
  let component: NotificationsScComponent;
  let fixture: ComponentFixture<NotificationsScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, NgxPaginationModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: NotificationsService,
          useClass: TodolistServiceStub
        }
      ],
      declarations: [NotificationsScComponent, BilingualTextPipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(NotificationsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
