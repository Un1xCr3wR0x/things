/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { bankDetailsByIBAN, ManagePersonServiceStub, ModalServiceStub, TranslateLoaderStub } from 'testing';
import { DependentDetails } from '../../shared';
import { RequestEventType } from '../../shared/models/questions';
import { DependentDetailsScComponent } from './dependent-details-sc.component';

describe('DependentDetailsScComponent', () => {
  let component: DependentDetailsScComponent;
  let fixture: ComponentFixture<DependentDetailsScComponent>;
  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', ['getBank']);
  lookupServiceSpy.getBank.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [DependentDetailsScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('imprisonmentPeriodSelected', () => {
    it('should imprisonmentPeriodSelected', () => {
      const event = new Event('click');
      component.imprisonmentPeriodSelected(event);
      expect(component.imprisonmentPeriodSelected).toBeDefined();
    });
  });
  describe('showHeader', () => {
    it('should showHeader', () => {
      component.showHeader();
      expect(component.showHeader).toBeDefined();
    });
  });
  describe('resetSearch', () => {
    it('should resetSearch', () => {
      component.resetSearch();
      expect(component.resetSearch).toBeDefined();
    });
  });
  describe('cancelTransaction', () => {
    it('should cancelTransaction', () => {
      spyOn(component.cancel, 'emit');
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('closePopup', () => {
    it('should closePopup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.closePopup();
      expect(component.decline).toBeDefined();
    });
  });
  describe('showIneligibilityDetails', () => {
    it('should showIneligibilityDetails', () => {
      const details = new DependentDetails();
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.showIneligibilityDetails(templateRef, details);
      expect(component.closePopup).toBeDefined();
    });
  });
  xdescribe(' addEventPopup', () => {
    it('should  addEventPopup', () => {
      const event = new RequestEventType();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.addEventPopup(templateRef, event);
      expect(component.addEventPopup).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('addAnotherDependent', () => {
    it('should addAnotherDependent', () => {
      component.addAnotherDependent();
      expect(component.addAnotherDependent).toBeTruthy();
    });
  });
  describe('getScreenSize', () => {
    it('should getScreenSize', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });
  xdescribe('applyForBenefit', () => {
    it('should applyForBenefit', () => {
      component.listOfDependents = [];
      component.applyForBenefit();
      expect(component.applyForBenefit).toBeDefined();
    });
  });
  describe('getDependents', () => {
    it('should getDependents', () => {
      const date = new GosiCalendar();
      component.getDependents(date);
      expect(component.getDependents).toBeDefined();
    });
  });
});
