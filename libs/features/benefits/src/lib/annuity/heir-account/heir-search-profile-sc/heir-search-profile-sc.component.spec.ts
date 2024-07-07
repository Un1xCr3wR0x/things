/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ModalServiceStub, TranslateLoaderStub } from 'testing';
import { BenefitConstants } from '../../../shared';
import { HeirSearchProfileScComponent } from './heir-search-profile-sc.component';

describe('HeirSearchProfileScComponent', () => {
  let component: HeirSearchProfileScComponent;
  let fixture: ComponentFixture<HeirSearchProfileScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: BenefitConstants.ROUTE_LINKED_CONTRIBUTORS,
            component: HeirSearchProfileScComponent
          }
        ])
      ],
      declarations: [HeirSearchProfileScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeirSearchProfileScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('HttpClient testing', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      httpClient = TestBed.get(httpClient);
      httpTestingController = TestBed.get(httpTestingController);
    });
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
  describe('searchHeir', () => {
    it('should searchHeir', () => {
      spyOn(component.router, 'navigate').and.callThrough();
      component.searchHeir();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BenefitConstants.ROUTE_LINKED_CONTRIBUTORS],
        Object({
          queryParams: Object({
            heirId: null
          })
        })
      );
    });
  });
});
