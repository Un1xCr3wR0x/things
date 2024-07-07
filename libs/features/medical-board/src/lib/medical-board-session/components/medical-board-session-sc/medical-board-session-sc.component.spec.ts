import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalBoardSessionScComponent } from './medical-board-session-sc.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { RouterDataToken, RouterData, AlertService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { MBConstants } from '../../../shared';
import { Observable, of } from 'rxjs';
import { ActivatedRouteStub, AlertServiceStub } from 'testing/mock-services';

describe('MedicalBoardSessionScComponent', () => {
  let component: MedicalBoardSessionScComponent;
  let fixture: ComponentFixture<MedicalBoardSessionScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = {
    navigate: jasmine.createSpy('navigate'),
    url: 'home/medical-board/medical-board-session/regular-session',
    events: of(new NavigationEnd(0, '/', '/'))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [MedicalBoardSessionScComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(MedicalBoardSessionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test suite for medical tab ', () => {
    it('test suite for medical tab', () => {
      const accounTab = '';
      component.onMedicalBoardToNewTab(accounTab);
      expect(component).toBeTruthy();
    });
  });
  describe('test suite for navigation', () => {
    it('test suite for navigation', () => {
      const id = 1;
      component.navigateToCreateSession(id);
      expect(component).toBeTruthy();
    });
    it('test suite for navigation', () => {
      const id = 2;
      component.navigateToCreateSession(id);
      expect(component).toBeTruthy();
    });
  });
});
