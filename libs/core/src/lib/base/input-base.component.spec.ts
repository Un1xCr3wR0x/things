/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { WorkflowServiceStub } from 'testing';
import { ApplicationTypeEnum } from '../enums';
import { RouterData } from '../models';
import { WorkflowService } from '../services';
import { ApplicationTypeToken, LanguageToken, RouterDataToken } from '../tokens';
import { InputBaseComponent } from './input-base.component';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'bpm-task-list-base-derived'
})
export class DerivedInputBaseComponent extends InputBaseComponent {
  constructor() {
    super();
  }
  setErrorMsgs(control) {}
}
describe('InputBaseComponent', () => {
  let component: DerivedInputBaseComponent;
  let fixture: ComponentFixture<DerivedInputBaseComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: RouterDataToken, useValue: new RouterData() },
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
      declarations: [DerivedInputBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedInputBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should initiateSort', () => {
    it('initiateSort', () => {
      //@ts-ignore
      component.control = new AbstractControl();
      spyOn(component, 'validateField').and.callThrough();
      component.validateField();
      expect(component).toBeTruthy();
    });
  });

  describe('should call isRequired', () => {
    it('isRequired', () => {
      //@ts-ignore
      component.control = new AbstractControl();
      spyOn(component, 'isRequired').and.callThrough();
      component.isRequired();
      expect(component).toBeTruthy();
    });
  });
});
