/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  AuthTokenService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  RouterService,
  EnvironmentToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { AuthTokenServiceStub } from 'testing';
import { WorklistScComponent } from './worklist-sc.component';

describe('WorklistScComponent', () => {
  let component: WorklistScComponent;
  let fixture: ComponentFixture<WorklistScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [WorklistScComponent],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        RouterService,
        FormBuilder,
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorklistScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('should ngoninit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
    });
  });
  describe('should get request', () => {
    it('should  get request', () => {
      spyOn(component, 'initiateSort').and.callThrough();
      spyOn(component, 'resetPagination').and.callThrough();
      spyOn(component, 'initiateRequest').and.callThrough();
      component.getRequest();
      expect(component).toBeTruthy();
    });
  });
});
