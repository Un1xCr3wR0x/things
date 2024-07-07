import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  EnvironmentToken,
  LanguageToken,
  LoginService,
  NotificationService,
  SideMenuStateToken
} from '@gosi-ui/core';
import { IconsModule } from '@gosi-ui/foundation-theme/lib/icons.module';
import { TimeAgoPipe } from '@gosi-ui/foundation-theme/lib/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { AuthTokenServiceStub, LoginServiceStub, ModalServiceStub, NotificationServiceStub } from 'testing';
import { AppBarScComponent } from './app-bar-sc.component';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('AppBarScComponent', () => {
  let component: AppBarScComponent;
  let fixture: ComponentFixture<AppBarScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppBarScComponent, TimeAgoPipe],
      imports: [FontAwesomeModule, IconsModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject('en')
        },
        { provide: Router, useValue: routerSpy },
        { provide: SideMenuStateToken, useValue: new BehaviorSubject<boolean>(true) },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PUBLIC },
        {
          provide: LoginService,
          useClass: LoginServiceStub
        },
        {
          provide: AuthTokenService,
          useClass: AuthTokenServiceStub
        },
        { provide: NotificationService, useClass: NotificationServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBarScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
