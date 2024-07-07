/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  MenuToken,
  RouterData,
  RouterDataToken,
  MenuService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { menuData, ModalServiceStub, MenuServiceStub, ActivatedRouteStub } from 'testing';
import { SuggestionScComponent } from './suggestion-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
const routerSpy = { url: 'home/transactions/list/worklist', navigate: jasmine.createSpy('navigate') };

describe('SuggestionsScComponent', () => {
  let component: SuggestionScComponent;
  let fixture: ComponentFixture<SuggestionScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [SuggestionScComponent],
      providers: [
        FormBuilder,
        DatePipe,
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: MenuToken, useValue: menuData.menuItems },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: Router, useValue: routerSpy },
        { provide: MenuService, useClass: MenuServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // describe('should ngoninit', () => {
  //   it('should ngOnInit', () => {
  //     // component.routerData = initializeRouterData;
  //     // component.complaintRouterData = new ComplaintRouterData(component.routerData);
  //     // spyOn(component, 'setTransactionId').and.callThrough();
  //     // spyOn(component, 'setLabels').and.callThrough();
  //     // spyOn(component, 'getTransactionDetails').and.callThrough();
  //     // spyOn(component, 'getDocuments').and.callThrough();
  //     // spyOn(component, 'getComments').and.callThrough();
  //     // spyOn(component, 'getworkflowDetails').and.callThrough();
  //     // spyOn(component.workflowService, 'getBPMTask').and.returnValue(of());
  //     component.ngOnInit();
  //     // expect(component.routerData).toBeDefined();
  //     // expect(component.routerData.taskId).not.toEqual(undefined);
  //     // expect(component.complaintRouterData).toBeDefined();
  //     // expect(component.transactionTraceId).not.toEqual(null);
  //     // expect(component.businessKey).not.toEqual(null);
  //     // expect(component.category).not.toEqual(null);
  //     // expect(component.assignedRole).not.toEqual(null);
  //   });
  //   // it('should edit', () => {
  //   //   component.routerData = initializeRouterData;
  //   //   component.complaintRouterData = new ComplaintRouterData(component.routerData);
  //   //   component.assignedRole = Role.CUSTOMER_CARE_OFFICER;
  //   //   component.isPrivate = true;
  //   //   component.canEdit = true;
  //   //   component.ngOnInit();
  //   //   expect(component.canEdit).not.toEqual(true);
  //   //   expect(component.isPrivate).toEqual(true);
  //   //   expect(component.assignedRole).not.toEqual(null);
  //   //   expect(component.routerData).toBeDefined();
  //   //   expect(component.routerData.taskId).not.toEqual(undefined);
  //   //   expect(component.complaintRouterData).toBeDefined();
  //   // });
  // });
});
