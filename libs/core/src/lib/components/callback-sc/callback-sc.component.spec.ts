import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { CallbackScComponent } from './callback-sc.component';

describe('CallbackScComponent', () => {
  let component: CallbackScComponent;
  let fixture: ComponentFixture<CallbackScComponent>;
  Object.defineProperty(window, 'performance', {
    value: {
      getEntriesByType: key => []
    }
  });
  beforeEach(() => {
    const loginServiceStub = () => ({
      handleLoginCallBack: access_token => ({}),
      handleTokenUnavailable: () => {}
    });

    const activatedRouteStub = () => ({
      queryParams: { subscribe: f => f([]) }
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CallbackScComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        {
          provide: window,
          useValue: Window
        }
      ]
    });
    fixture = TestBed.createComponent(CallbackScComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`tokenLabel has default value`, () => {
    expect(component.tokenLabel).toEqual(`access_token`);
  });
});
