/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { WorkflowServiceStub } from 'testing';
import { ApplicationTypeEnum } from '../enums';
import { RouterData } from '../models';
import { WorkflowService } from '../services';
import { ApplicationTypeToken, LanguageToken, RouterDataToken } from '../tokens';
import { BaseRoutingService } from './base-routing.service';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

@Component({
  selector: 'lookup-service-base-derived'
})
export class DerivedBaseRoutingService extends BaseRoutingService {
  setToLocalToken() {}
}
describe('BaseRoutingService', () => {
  let component: DerivedBaseRoutingService;
  let fixture: ComponentFixture<DerivedBaseRoutingService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: WorkflowService, useClass: WorkflowServiceStub }
      ],
      declarations: [DerivedBaseRoutingService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedBaseRoutingService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('navigate To Inbox', () => {
    it('should navigate To Inbox', () => {
      //@ts-ignore
      component.routerData = new RouterData();
      spyOn(component, 'isValidator').and.callThrough();
      component.isValidator();
      expect(component).toBeTruthy();
    });
  });
});
